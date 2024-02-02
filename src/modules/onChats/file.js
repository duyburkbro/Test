module.exports.optine = {
	name: "file",
	classify: "Tiện nghi",
	wait: 5,
	author: "Mr.Ben",
	Hasrecognize: 2
};
const
	fs = require("fs-extra"),
	axios = require("axios"),
	size = function(size) {
		var msg = `${size}`.split("").slice(0, 2).join(".") + " BY";
		if (size > 1024) msg = `${size}`.split("").slice(0, 2).join(".") + " KB";
		if (size > (1024 * 1024)) msg = `${size}`.split("").slice(0, 2).join(".") + " MB";
		if (size > (1024 * 1024 * 1024)) msg = `${size}`.split("").slice(0, 2).join(".") + " GB";
		return msg;
	}
module.exports.onChat = async function({ api, event, args }) {
	try {
		const
			{ threadID, messageID, senderID } = event;
		var
			path = __dirname + "/../../../",
			files = fs.readdirSync(path);
		var
			msg = [], file = [], c = 1;
		files.forEach(i => {
			var Sfile = fs.statSync(path + i);
			file.push(i);
			if (Sfile.isFile() == true) tick = "[File]"
			else tick = "[Folder]";
			msg.push(tick + " - " + (c++) + ". " + i + ` (${size(Sfile.size)}) `);
		})
		return api.sendMessage(msg.join("\n") + `\n- Open: Mở Folder bạn muốn theo stt trên`, threadID, (err, info) => {
			global.control.Reply.push({
				name: this.optine.name,
				messageID: info.messageID, 
				author: senderID,
				path,
				files,
				type: "file"
			})
		}, messageID)
	} catch (error) {
		console.log(error)
	}
};
module.exports.onReply = async function({ api, Reply: H, event }) {
	try {
		const
			{ messageID, threadID, senderID, args } = event,
			send = (msg) => api.sendMessage(msg, threadID, messageID)
		if (H.type == "file") {
			switch (args[0].toLowerCase()) {
				case "open": {
					if (!parseInt(args[1])) return send("Vui lòng chỉ nhập số");
					var
						path = H.path + H.files[args[1]-1] + "/";
					if (fs.statSync(path).isFile() == true) return send("Vui lòng chỉ chọn Folder")
					var
						files = fs.readdirSync(path);
					var
						msg = [], file = [], c = 1;
					files.forEach(i => {
						var Sfile = fs.statSync(path + i);
						file.push(i);
						if (Sfile.isFile() == true) tick = "[File]"
						else tick = "[Folder]";
						msg.push(tick + " - " + (c++) + ". " + i + ` (${size(Sfile.size)}) `);
					})
					return api.sendMessage(msg.join("\n") + `\n- Open: Mở Folder bạn muốn theo stt trên`, threadID, (err, info) => {
						global.control.Reply.push({
							name: this.optine.name,
							messageID: info.messageID, 
							author: senderID,
							path,
							files,
							type: "file"
						})
					}, messageID)
				};
			  case "view": {
					var attachment = [];
					for (var a of args.slice(1)) {
						var
							path = H.path + H.files[a - 1];
						if (fs.statSync(path).isFile() != true) return send("Vui lòng chỉ chọn File");
						attachment.push(fs.createReadStream(path))
					};
					return api.sendMessage({ attachment }, threadID, (err) => {console.log(err)}, messageID)
				}
			}
		}
	} catch (error) {
		console.log(error)
	}
}