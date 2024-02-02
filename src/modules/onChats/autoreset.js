module.exports.optine = {
	name: "autoreset",
	classify: "ADMIN",
	Hasrecognize: 2,
	author: "Mr.Ben",
	desc: "Tự động khởi động lại",
	wait: 0
};
const
	fs = require("fs-extra"),
	Mpath = __dirname + "/cache/autoReset.json";
module.exports.onLoad = async () => {
	if (!fs.existsSync(Mpath)) fs.writeFileSync(Mpath, JSON.stringify([]))
};
setInterval(async () => {
	const data = require(Mpath);
	const time = require("moment-timezone").tz("Asia/Ho_Chi_minh").format("HH:mm:ss");
	if (data.includes(time)) {
		process.exit(1)
	}
}, 1000)
module.exports.onChat = async function({ api, event, args }) {
	const
		{ threadID, messageID, senderID } = event,
		data = require(Mpath),
		send = (msg) => api.sendMessage(msg, threadID, messageID);
	var
		listSc = [], listErr = [], msg = [], c = 1;
	switch (args[0].toLowerCase()) {
		case "add": {
			for (var i of args.slice(1).join(" ").split(", ")) {
				var
					[HH, MM, SS] = i.split(":");
				if (!HH || !MM || !SS) return send("Sai format: HH:MM:SS");
				if (HH.length < 2) HH = "0" + HH;
				if (MM.length < 2) MM = "0" + MM;
				if (SS.length < 2) SS = "0" + SS;
				var Rstime = HH + ":" + MM + ":" + SS;
				if (data.includes(Rstime)) listErr.push(Rstime);
				else {
					data.push(Rstime)
					listSc.push(Rstime)
				}
			};
			send(`Đã thêm thành công ${listSc.length} Time, và không thành công: ${listErr.length}`);
			return fs.writeFileSync(Mpath, JSON.stringify(data, null, 2))
		};
		case "-l":
		case "l":
		case "list": {
			msg += "[ List Time Reset ]\n\n";
			for (var i of data) {
				msg += (c++) + ". " + i + "\n";
			};
			msg += "\n- Reply stt để xóa";
			return api.sendMessage(msg, threadID, (err, info) => {
				global.control.Reply.push({
					name: this.optine.name,
					messageID: info.messageID,
					author: senderID,
					data,
					type: "list"
				})
			}, messageID)
		}
	}
};
module.exports.onReply = async function({ api, event, Reply: H }) {
	const
		{ threadID, messageID, senderID, args } = event,
		data = require(Mpath);
	if (senderID != H.author) return;
	if (H.type == "list") {
		var listSc = [], listErr = []
		for (var i of args) {
			try {
				data.splice(data.indexOf(H.data[i - 1], 1));
				listSc.push(i)
			} catch (error) {
				listErr.push(i)
			}
		};
		return api.sendMessage(`Đã xóa thành công ${listSc.length}, và không thành công: ${listErr.length}`, threadID, () => {
			fs.writeFileSync(Mpath, JSON.stringify(data, null, 2))
		}, messageID)
	}
}