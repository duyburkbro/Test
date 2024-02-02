module.exports.optine = {
	name: "ping",
	classify: "Tiện nghi",
	author: "Mr.Ben",
	wait: 10,
	Hasrecognize: 1,
	desc: "Tag mọi người"
};
const
	axios = require("axios"),
	fs = require("fs-extra"),
	time = (format) => require("moment-timezone").tz("Asia/Ho_Chi_minh").format(format);
module.exports.onChat = async function({ api, event, Users, args }) {
	try {
		const
			{ isGroup, threadID, messageID, participantIDs, messageReply, senderID } = event;
		if (isGroup == false) return api.sendMessage("vui lòng chỉ gọi mọi người trong group", threadID, messageID);
		if (event.type == "message_reply") {
			if (messageReply.attachments.length != 0) {
				var allFile = [], c = 1, attachment = [];
				for (var i of messageReply.attachments) {
					var
						typeFile = i.type == "audio" ? ".mp3" : i.type == "video" ? ".mp4" : i.type == "photo" ? ".png" : ".gif",
						path = __dirname + "/cache/pingAll" + (c++) + typeFile,
						url = (await axios.get(i.url, { responseType: "arraybuffer" })).data;
					fs.writeFileSync(path, Buffer.from(url, "utf-8"))
					attachment.push(fs.createReadStream(path))
					allFile.push(path)
				}
				var
					mentions = [], body = args.length == 0 ? "Không có nội dung" : args.join(" ");
				participantIDs.forEach(i => {
					mentions.push({
						tag: body,
						id: i
					})
				})
				var msg = {};
				msg.body = `[ Call All ]\n[🗣] - Người gọi: ${await Users.getName(senderID)}\n[💬] - Nội dung: ${body}\n[⏰️] - Thời gian: ${time("DD/MM/YYYY")} - ${time("HH:mm:ss")}`;
				msg.attachment = attachment;
				msg.mentions = mentions;
				return api.sendMessage(msg, threadID, () => allFile.forEach(i => fs.unlinkSync(i)), messageID)
			}
			else {
				var
					mentions = [], body = messageReply.args.length == 0 ? "Không có nội dung" : messageReply.args.join(" ");
				participantIDs.forEach(i => {
					mentions.push({
						tag: body,
						id: i
					})
				})
				var msg = {};
				msg.body = `[ Call All ]\n[🗣] - Người gọi: ${await Users.getName(senderID)}\n[💬] - Nội dung: ${body}\n[⏰️] - Thời gian: ${time("DD/MM/YYYY")} - ${time("HH:mm:ss")}`;
				msg.mentions = mentions;
				return api.sendMessage(msg, threadID, messageID)
			}
		}
		else {
			var
				mentions = [], body = args.length == 0 ? "Không có nội dung" : args.join(" ");
			participantIDs.forEach(i => {
				mentions.push({
					tag: body,
					id: i
				})
			})
			var msg = {};
			msg.body = `[ Call All ]\n[🗣] - Người gọi: ${await Users.getName(senderID)}\n[💬] - Nội dung: ${body}\n[⏰️] - Thời gian: ${time("DD/MM/YYYY")} - ${time("HH:mm:ss")}`;
			msg.mentions = mentions;
			return api.sendMessage(msg, threadID, messageID)
		}
	} catch (error) {
		console.log(error)
	}
}