module.exports = function({ api }) {
	try {
		const
			fs = require("fs-extra"),
			pathThreads = __dirname + "/func/data/Threads.json",
			pathUsers = __dirname + "/func/data/Users.json";
		if (!fs.existsSync(pathThreads)) fs.writeFileSync(pathThreads, JSON.stringify([]))
		if (!fs.existsSync(pathUsers)) fs.writeFileSync(pathUsers, JSON.stringify([]))
		const
			Users = require("./func/Users.js"),
			Threads = require("./func/Threads.js"),
			{ log } = global.control.extend;
		global.client.Users = Users;
		global.client.Threads = Threads;
		//////SetUp data Users/Threads;
		(async () => {
			const { allID } = global;
			const { threadsBanned, UsersBanned } = global.data;
			Threads.getAll().forEach(i => {
				if (!allID.Threads.includes(i.threadID)) allID.Threads.push(i.threadID);
			});
			Users.getAll().forEach(i => {
				if (!allID.Users.includes(i.senderID)) allID.Users.push(i.senderID);
			});
			for (var i of allID.Threads) {
				var { data } = await Threads.getData(i);
				if (data["banned"]) {
					threadsBanned.set(i, data["banned"])
				}
			};
			for (var i of allID.Users) {
				var { data } = await Users.getData(i)
				if (data["banned"]) {
					UsersBanned.set(i, data["banned"])
				}
			}
			return log(`Khỏi tạo thành công data cho các: ${allID.Threads.length} nhóm, ${allID.Users.length} người dùng`)
		})();
		//////autoClean; 
		(async () => {
			const
				{ autoClean } = global.client.settings,
				pathCache = __dirname + "/modules/onChats/cache/";
			var listSc = [], listErr = []
			autoClean.forEach(exit => {
				try {
					fs.readdirSync(pathCache).forEach(i => {
						if (i.includes(exit)) {
							fs.unlinkSync(pathCache + i);
							listSc.push(i)
						}
				})
				} catch (error) {
					listErr.push(exit)
				}
			});
			return log(`[ autoClean ] - Dọn thành công: ${listSc.length} file rác và ${listErr.length} không thành công`)
		})()
		//////start Listen;
		api.listenMqtt(function(err, event) {
			if (err) return console.log(err);
			const
				onChat = require("./onControl/onChat.js"),
				onReply = require("./onControl/onReply.js"),
				onReaction = require("./onControl/onReaction.js"),
				onChatEvent = require("./onControl/onChatEvent.js"),
				onEvent = require("./onControl/onEvent.js");
				onCreateData = require("./onControl/onCreateData.js")({ api, event });
			if (!global.client.settings.ADMIN.includes(event.senderID)) return;
			switch (event.type) {
				case "message":
				case "message_reply":
				case "message_unsend":
					onChat({ api, event, Users, Threads });
					onChatEvent({ api, event, Users, Threads });
					onReply({ api, event, Users, Threads });
					break;
				case "message_reaction":
					onReaction({ api, event, Users, Threads });
					break;
				case "event":
					if (global.client.settings.autoSendEvent == true) return api.sendMessage("[ CẬP NHẬT NHÓM ]\n- " + event.logMessageBody.replace(/Bạn|bạn/, "BOT") || event.logMessageBody, event.threadID);
					onEvent({ api, event, Users, Threads })
					break;
			}
		})
	} catch (error) {
		console.log(error)
	}
}