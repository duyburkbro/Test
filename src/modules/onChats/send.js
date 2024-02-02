module.exports.optine = {
	name: "send",
	classify: "ADMIN",
	author: "Mr.Ben",
	wait: 2,
	Hasrecognize: 2, 
	desc: "Gửi thông báo cho tất cả nhóm trên bot"
};
const
	axios = require("axios"),
	fs = require("fs-extra"),
	time = (format) => require("moment-timezone").tz("Asia/Ho_Chi_minh").format(format);
module.exports.onChat = async function({ api, event, args, Users }) {
	try {
		const
			{ threadID, messageID, messageReply, senderID } = event,
			{ allID } = global,
			{ saveFile } = global.control.extend,
			{ threadName } = await api.getThreadInfo(threadID);
		var
			listSc = [], listErr = [];
		if (event.type == "message_reply") {
			if (messageReply.attachments.length != 0) {
				var allFile = [], c = 1, attachment = [];
				for (var i of messageReply.attachments) {
					var
						typeFile = i.type == "photo" ? ".png" : i.type == "audio" ? ".mp3" : i.type == "video" ? ".mp4" : ".gif",
						path = __dirname + "/cache/sendNoti" + (c++) + typeFile;
						await saveFile(path, i.url);
					allFile.push(path);
					attachment.push(fs.createReadStream(path))
				};
				var msg = {};
				msg.body = `[ Notice From ${await Users.getName(senderID)}]\n[👤] - Gửi từ: ${threadID == senderID ? "Tin nhắn riêng" : threadName}\n[💬] - Nội dung: ${args.length == 0 ? "Không có nội dung" : args.join(" ")}\n[⏰️] - Vào lúc: ${time("DD/MM/YYYY")} - ${time("HH:mm:ss")}\n[💡] - Trả lời tin nhắn này để nhắn lại cho ADMIN`;
				msg.attachment = attachment;
				allID.Threads.forEach(i => {
					if (i != threadID) {
						api.sendMessage(msg, i, (err, info) => {
							if (err) console.log(err);
							global.control.Reply.push({
								name: this.optine.name,
								messageID: info.messageID,
								Reply: messageID,
								threadID,
								type: "Send"
							})
						});
						listSc.push(i)
					}
				});
			}
			else return api.sendMessage("[ SendNoti ] - vui lòng chỉ reply: ảnh, video, gif, music", threadID, messageID);
		}
		else {
			var msg = {};
			msg.body = `[ Notice From ${await Users.getName(senderID)}]\n[👤] - Gửi từ: ${threadID == senderID ? "Tin nhắn riêng" : threadName}\n[💬] - Nội dung: ${args.length == 0 ? "Không có nội dung" : args.join(" ")}\n[⏰️] - Vào lúc: ${time("DD/MM/YYYY")} - ${time("HH:mm:ss")}\n[💡] - Trả lời tin nhắn này để nhắn lại cho ADMIN`;
			allID.Threads.forEach(i => {
				if (i != threadID) {
					api.sendMessage(msg, i, (err, info) => {
						if (err) return listErr.push(i)
						global.control.Reply.push({
							name: this.optine.name,
							messageID: info.messageID,
							threadID,
							Reply: messageID,
							type: "Send"
						});
						listSc.push(i)
					})
				}
			});
		};
		return api.sendMessage(`[ SendNoti ] - Đã gửi thành công cho ${listSc.length} nhóm, và không thành công cho ${listErr.length} nhóm`, threadID, () => allFile.forEach(i => fs.unlinkSync(i)), messageID)
	} catch (error) {
		console.log(error)
	}
};
module.exports.onReply = async function({ api, event, Reply: H, Users }) {
	try {
		const
			{ threadID, messageID, senderID, attachments, args } = event,
			{ threadName } = await api.getThreadInfo(threadID);
		if (H.type == "Send") {
			if (attachments.length != 0) {
				var allFile = [], c = 1, attachment = [];
				for (var i of attachments) {
					var
						typeFile = i.type == "photo" ? ".png" : i.type == "audio" ? ".mp3" : i.type == "video" ? ".mp4" : ".gif",
						path = __dirname + "/cache/sendNoti" + (c++) + typeFile,
						url = (await axios.get(i.url, { responseType: "arraybuffer" })).data;
					fs.writeFileSync(path, Buffer.from(url, "utf-8"))
					allFile.push(path);
					attachment.push(fs.createReadStream(path))
				};
				var msg = {};
				msg.body = `[ Reply From User ${await Users.getName(senderID)}]\n[👤] - Gửi từ: ${threadID == senderID ? "Tin nhắn riêng" : threadName}\n[💬] - Nội dung: ${args.length == 0 ? "Không có nội dung" : args.join(" ")}\n[⏰️] - Vào lúc: ${time("DD/MM/YYYY")} - ${time("HH:mm:ss")}\n[💡] - Trả lời tin nhắn này để nhắn lại cho Người dùng`;
				msg.attachment = attachment;
				return api.sendMessage(msg, H.threadID, (err, info) => {
					global.control.Reply.push({
						name: this.optine.name,
						messageID: info.messageID,
						threadID,
						Reply: messageID,
						type: "UserReply"
					});
					allFile.forEach(i => fs.unlinkSync(i))
				}, H.Reply)
			}
			else {
				var msg = {};
				msg.body = `[ Reply From User ${await Users.getName(senderID)}]\n[👤] - Gửi từ: ${threadID == senderID ? "Tin nhắn riêng" : threadName}\n[💬] - Nội dung: ${args.length == 0 ? "Không có nội dung" : args.join(" ")}\n[⏰️] - Vào lúc: ${time("DD/MM/YYYY")} - ${time("HH:mm:ss")}\n[💡] - Trả lời tin nhắn này để nhắn lại cho Người dùng`;
				return api.sendMessage(msg, H.threadID, (err, info) => {
					global.control.Reply.push({
						name: this.optine.name,
						messageID: info.messageID,
						threadID,
						Reply: messageID,
						type: "UserReply"
					})
				}, H.Reply)
			}
		}
		else {
			if (attachments.length != 0) {
				var allFile = [], c = 1, attachment = [];
				for (var i of attachments) {
					var
						typeFile = i.type == "photo" ? ".png" : i.type == "audio" ? ".mp3" : i.type == "video" ? ".mp4" : ".gif",
						path = __dirname + "/cache/sendNoti" + (c++) + typeFile,
						url = (await axios.get(i.url, { responseType: "arraybuffer" })).data;
					fs.writeFileSync(path, Buffer.from(url, "utf-8"))
					allFile.push(path);
					attachment.push(fs.createReadStream(path))
				};
				var msg = {};
				msg.body = `[ Reply From ADMIN ${await Users.getName(senderID)}]\n[👤] - Gửi từ: ${threadID == senderID ? "Tin nhắn riêng" : threadName}\n[💬] - Nội dung: ${args.length == 0 ? "Không có nội dung" : args.join(" ")}\n[⏰️] - Vào lúc: ${time("DD/MM/YYYY")} - ${time("HH:mm:ss")}\n[💡] - Trả lời tin nhắn này để nhắn lại cho Người ADMIN`;
				msg.attachment = attachment;
				return api.sendMessage(msg, H.threadID, (err, info) => {
					global.control.Reply.push({
						name: this.optine.name,
						messageID: info.messageID,
						threadID,
						Reply: messageID,
						type: "Send"
					})
					allFile.forEach(i => fs.unlinkSync(i))
				}, H.Reply)
			}
			else {
				var msg = {};
				msg.body = `[ Reply From ADMIN ${await Users.getName(senderID)}]\n[👤] - Gửi từ: ${threadID == senderID ? "Tin nhắn riêng" : threadName}\n[💬] - Nội dung: ${args.length == 0 ? "Không có nội dung" : args.join(" ")}\n[⏰️] - Vào lúc: ${time("DD/MM/YYYY")} - ${time("HH:mm:ss")}\n[💡] - Trả lời tin nhắn này để nhắn lại cho ADMIN `;
				return api.sendMessage(msg, H.threadID, (err, info) => {
					global.control.Reply.push({
						name: this.optine.name,
						messageID: info.messageID,
						threadID,
						Reply: messageID,
						type: "Send"
					})
				}, H.Reply)
			}
		}
	} catch (error) {
		console.log(error)
	}
}