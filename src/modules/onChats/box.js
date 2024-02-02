module.exports = {
	optine: {
		name: "box",
		classify: "Tiện nghi",
		wait: 5,
		Hasrecognize: 1,
		author: "Mr.Ben",
		desc: "Thao tác trong nhóm chat"
	},
	onChat: async function({ api, event, args, Users, Threads }) {
		try {
			const
				{ threadID, messageID, senderID, mentions, participantIDs } = event,
				{ PREFIX } = global.client.settings,
				{ threadInfo } = await Threads.getData(threadID),
				fs = require("fs-extra"),
				time = (date) => require('moment-timezone')(parseInt(date)).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY - HH:mm:ss');
			if (args.length == 0) return;
			switch (args[0].toLowerCase()) {
				case "info":
				case "-i": {
					const
						info = await api.getThreadInfo(threadID),
						{ data } = await Threads.getData(threadID),
						boy = [], girl = [],
						path = __dirname + "/cache/AvtGroup.png";
					var dataUrl = (await require('axios').get(info.imageSrc, { responseType: 'arraybuffer'})).data;
					fs.writeFileSync(path, Buffer.from(dataUrl, 'utf-8'))
					info.userInfo.forEach(i => {
						if (i.gender == "MALE") {
							boy.push(i.name)
						}
						else girl.push(i.name)
					});
					const DataDay = function(t1, t2) {
						const
							d1 = new Date(parseInt(t1)),
							d2 = new Date(parseInt(t2));
						return Math.ceil((d1.getTime() - d2.getTime()) / (24 * 60 * 60 * 1000));
					};
					return api.sendMessage({
						body: `[ INFO Group ]\n[🏡] - Tên nhóm: ${info.name}\n[👻] - Emoji: ${info.emoji}\n[😶‍🌫️] - Màu Nền ${info.color}\n[🗝] - Dấu lệnh: ${data["PREFIX"] || PREFIX}\n[🔐] - Phê duyệt: ${info.approvalMode == true ? "đang bật" : "đã tắt"}\n[💾] - Thời gian Tạo dữ liệu: ${time(threadInfo.timestamp)} (${DataDay(info.timestamp, threadInfo.timestamp)} Ngày)\n-----------\n[👨‍👩‍👧‍👧] - Số thành viên: ${info.participantIDs.length}\n[🙆‍♀️] - Số thành viên Nữ: ${girl.length}\n[🙆‍♂️] - Số thành viên Nam: ${boy.length}\n[💂‍♂️] - Số quản trị viên: ${info.adminIDs.length}\n[👤] - Số thành viên cần Duyệt: ${info.approvalQueue.length}\n-----------\n[💬] - Tổng tin nhắn: ${info.messageCount}\n[💭] - Số Tin nhắn đã gỡ: ${info.unreadCount}`,
						attachment: fs.createReadStream(path)
					}, threadID, () => fs.unlinkSync(path), messageID)
				};
				case "admin":
				case "qtv": {
					const status = args[1] == "true" ? true : args[1] == "false" ? false : null;
					const id = event.type == "message_reply" ? event.messageReply.senderID : Object.keys(mentions).length != 0 ? Object.keys(mentions) : args.slice(2).length != 0 ? args.slice(2) : [senderID];
					if (status == null) return api.sendMessage(`vui lòng nhập status:\n- true: thêm qtv, false: xóa qtv`, threadID, messageID)
					api.changeAdminStatus(threadID, id, status, (err) => {
						if (err) return api.sendMessage("Lỗi: " + err.error, threadID, messageID)
						else return api.sendMessage(`Đã ${status == true ? "thêm" : "xóa"} thành công ${id.length} QTV nhóm`, threadID, messageID)
					});
					return;
				};
				case "adduser": {
					for (var i of args.slice(1)) {
						if (i.indexOf("https://") == 0) {
							
						}
					}
				};
			  case "-u":
				case "ndfb": {
					var body = [], c = 1, id = [];
					for (var i of participantIDs) {
						const { name } = await api.getUserInfo(i);
						if (name == 'Người dùng Facebook') {
							body.push(`${c++}. ID: ${i}`);
							id.push(i)
						};
					};
					if (body.length == 0) return api.sendMessage('Không có ndfb trong nhóm của bạn', threadID, messageID)
					return api.sendMessage(body.join('\n') + `\n------\n Số ndfb: ${body.length}\n Thả icon nếu muốn xóa tất cả ndfb`, threadID, (err, info) => {
						global.control.Reaction.push({
							mame: this.optine.name, 
							messageID: info.messageID, 
							author: senderID, 
							id,
							type: 'ndfb'
						})
					}, messageID)
				}
			}
		} catch (error) {
			console.log(error)
		}
	},
	onReaction: async function({ api, event, Reaction: H }) {
		try {
			const { senderID, threadID, messageID } = event;
			if (H.author != senderID) return;
			switch (H.type.toLowerCase()) {
				case "ndfb": {
					for (let {id} of H) {
						api.removeUserFromGroup(id, threadID)
					};
					return api.sendMessage(`Đã xoá thành công: ${H.id.length} ndfb`, threadID, messageID)
				}
			}
		} catch (error) {
			console.log(error)
		}
	}
}