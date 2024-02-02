module.exports.optine = {
	name: "magic",
	classify: "Tiện nghi", 
	author: "Mr.Ben",
	wait: 5,
	Hasrecognize: 0,
	desc: "Chuyển ảnh thường sang anime"
}
module.exports.run = async function({ api, event }) {
	const
		{ threadID, messageID, messageReply } = event,
		axios = require("axios");
	if (event.type != "message_reply") return api.sendMessage("Vui lòng Reply ảnh muốn đổi", threadID, messageID);
	var listSc = [], listErr = [];
	for (var i of messageReply.attachments) {
		try {
			if (i.type != "photo") listErr.push(i)
			else {
				const draw = (await axios.get("https://thieutrungkien.dev/draw?url=" + i.url));
				return console.log(draw)
			}
		} catch (error) {
			listErr.push(i)
		}
	}
}