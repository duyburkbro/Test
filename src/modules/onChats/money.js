module.exports.optine = {
	name: "money",
	classify: "Tiện nghi", 
	wait: 5,
	author: "Mr.Ben", 
	Hasrecognize: 0
};
module.exports.onChat = async function({ api, event, args, Users, recognize }) {
	try {
		const
			{ threadID, messageID, senderID, mentions } = event;
		if (args[0] == "check") {
			const id = event.type == "message_reply" ? event.messageReply.senderID : Object.keys(mentions).length != 0 ? Object.keys(mentions) : args.slice(2).length != 0 ? args.slice(2) : [senderID];
			var msg = [], c = 1;
			for (var i of id) {
				var data = await Users.getData(i);
				msg += (c++) + `.\n- Tên ${data.name}\n- Money: ${data.data.money}\n------\n`;
			};
			return api.sendMessage("[ Thông Tin ]\n" + msg, threadID, messageID)
		};
		if (args[0] == "set") {
			if (recognize < 2) return api.sendMessage("Bạn không đủ quyền hạn", threadID, messageID);
			if (!parseInt(args[1])) return api.sendMessage("vui lòng chỉ nhâp số", threadID, messageID)
			const id = event.type == "message_reply" ? event.messageReply.senderID : Object.keys(mentions).length != 0 ? Object.keys(mentions) : args.slice(2).length != 0 ? args.slice(2) : [senderID];
			var msg = [], c = 1;
			for (var i of id) {
				var
					data = await Users.getData(i);
				data.data.money += parseInt(args[1]);
				await Users.setData(i, {data})
				msg += (c++) + `.\n- Tên ${data.name}\n- Money: ${args[1]}\n------\n`;
			};
			return api.sendMessage("[ Thông Tin Chỉnh Sửa ]\n" + msg, threadID, messageID)
		}
	} catch (error) {
		console.log(error)
	}
}