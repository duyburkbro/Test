module.exports.optine = {
	name: "bot",
	classify: "Tiện nghi",
	author: "Mr.Ben",
	wait: 5,
	Hasrecognize: 2
};
const
	fs = require("fs-extra"),
	axios = require("axios")
module.exports.run = async function({ api, event, args }) {
	return api.sendMessage(
		`Reply tin nhắn này để chọn stt bạn muốn dưới đây:` + "\n" +
		`1. Tìm kiếm bạn bè`
		, event.threadID, (err, info) => {
			global.control.Reply.push({
				name: this.optine.name,
				messageID: info.messageID,
				author: event.senderID,
				type: "one"
			})
		}, event.messageID)
};
module.exports.Reply = async function({ api, event, Reply: H }) {
	const
		{ threadID, messageID, senderID } = event,
		{ saveFile } = global.control.extend;
	if (senderID != H.author) return;
	try {
		switch (H.type.toLowerCase()) {
			case "one": {
				if (!parseInt(event.body)) return api.sendMessage("Vui lòng chỉ nhập số", threadID, messageID)
				if (event.body == 1) {
					return api.sendMessage(`Reply tin nhắn này để nhập "tên người dùng bạn muốn tìm"`, threadID, (err, info) => {
						global.control.Reply.push({
							name: this.optine.name,
							messageID: info.messageID,
							author: senderID,
							type: "one:1"
						})
					}, messageID)
				}
			};
			case "one:1": {
				const searchU = await api.getUserID(event.body);
				var Abody = [], c = 1, attachment = [], allFile = [], allID = [];
				for (var i of searchU) {
					var path = __dirname + "/cache/hm" + (c++) + ".jpg";
					await saveFile(path, i.photoUrl);
					allFile.push(path);
					allID.push(i.userID);
					attachment.push(fs.createReadStream(path));
					Abody += (c) + `.\n - Tên người dùng: ${i.name}\n - ID: ${i.userID}\n - url: ${i.profileUrl}\n- Xác minh: ${i.isVerified == false ? "Chưa" : "Bật"}\n- Loại: ${i.type}\n-------\n`;
				};
				var msg = {};
				msg.body = Abody;
				msg.attachment = attachment;
				return api.sendMessage(msg, threadID, (err, info) => {
					allFile.forEach(i => fs.unlinkSync(i))
					global.control.Reply.push({
						name: this.optine.name,
						messageID: info.messageID,
						author: senderID,
						allID,
						type: "one:2"
					})
				}, messageID)
			};
			case "one:2": {
				if (!parseInt(event.args[0])) return api.sendMessage("Vui lòng chỉ nhập số", threadID, messageID);
				api.addFriend(H.allID[event.args[0] - 1], (err) => {
					console.log(err)
				})
			}
		}
	} catch (error) {
		console.log(error)
	}
}