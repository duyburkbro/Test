module.exports.optine = {
	name: "adm",
	wait: 2,
	classify: "Tiện nghi",
	Hasrecognize: 2
};
module.exports.onChat = async function({ api, event, args, Users }) {
	try {
		const
			{ ADMIN } = global.client.settings,
			{ threadID, messageID, senderID, type, mentions } = event,
			fs = require("fs-extra"),
			path = __dirname + "/../../settings.json";
		var
			listErr = [], listSc = [],
			id = type == "message_reply" ? [event.messageReply.senderID] : Object.keys(mentions).length != 0 ? Object.keys(mentions) : [senderID];
		switch (args[0].toLowerCase()) {
			case "add": {
				for (var i of id) {
					if (ADMIN.includes(i)) listErr.push(i);
					else {
						ADMIN.push(i)
						listSc.push(i)
					}
				};
				return api.sendMessage(`Đã thêm thành công ${listSc.length} ADMIN, và ${listErr.length} không thành công`, threadID, () => fs.writeFileSync(path, JSON.stringify(global.client.settings, null, 2)), messageID)
			};
			case "del": {
				for (var i of id) {
					if (!ADMIN.includes(i)) listErr.push(i)
					else {
						ADMIN.splice(ADMIN.indexOf(i, 1));
						listSc.push(i)
					}
				}
				return api.sendMessage(`Đã xóa thành công ${listSc.length} ADMIN, và ${listErr.length} không thành công`, threadID, () => fs.writeFileSync(path, JSON.stringify(global.client.settings, null, 2)), messageID)
			};
			case "list":
			case "-l": {
				var msg = [], c = 1;
				msg += "[ LIST ADMIN ]\n";
				for (var i of ADMIN) {
					msg += (c++) + `.\n- Tên ADMIN: ${await Users.getName(i)}\n- Link FB: https:www.facebook.com/profile.php?id=` + i + '\n---------\n'
				};
				return api.sendMessage(msg, threadID, messageID)
			};
			case "only": {
				global.client.settings.OnlyAdmin = (global.client.settings.OnlyAdmin == true ? false : true);
				return api.sendMessage(global.client.settings.OnlyAdmin == false ? 'Đã tắt thành công chế độ OnlyADMIN' : 'Đã bật thành công chế độ OnlyADMIN', threadID, () => fs.writeFileSync(path, JSON.stringify(global.client.settings, null, 2)), messageID)
			}
		}
	} catch (error) {
		console.log(error)
	}
}