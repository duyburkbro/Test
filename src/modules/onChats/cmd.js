module.exports.optine = {
	name: "cmd",
	classify: "Tiện nghi",
	author: "Mr.Ben",
	period: "1.0",
	desc: "Thao tác với các cmd",
	wait: 2
};
module.exports.onChat = function({ api, event, args }) {
	try {
		const
			{ commands } = global.client,
			{ threadID, messageID } = event;
		switch (args[0].toLowerCase()) {
			case "load":
			case "l":
			case "-l": {
				var listSc = [], listErr = [];
				for (var a of args.slice(1)) {
					try {
						const path = __dirname + "/" + a + ".js";
						delete require["cache"][require["resolve"](path)];
						commands.delete(a);
						const mdl = require(path);
						if (mdl.onLoad) mdl.onLoad()
						if (!mdl.optine || !mdl.optine.name || !mdl.optine.classify) return console.log("[ IseKai ] - command không đúng định dạng: " + mdl.optine.name)
						commands.set(mdl.optine.name, mdl);
						listSc.push(a)
					} catch (error) {
						console.log(error)
						listErr.push(a)
					}
				};
				return api.sendMessage("load thành công: " + listSc.length + " lệnh, và " + listErr.length + " số lệnh không thể load", threadID, messageID)
			}
			case "unload":
			case "ul":
			case "-ul": {
				var listSc = [], listErr = [];
				for (var a of args.slice(1)) {
					try {
						const path = __dirname + "/" + a + ".js";
						delete require["cache"][require["resolve"](path)];
						commands.delete(a);
						listSc.push(a)
					} catch (error) {
						console.log(error)
						listErr.push(a)
					}
				};
				return api.sendMessage("unload thành công: " + listSc.length + " lệnh, và " + listErr.length + " số lệnh không thể unload", threadID, messageID)
			}
		}
	} catch (error) {
		console.log(error)
	}
}