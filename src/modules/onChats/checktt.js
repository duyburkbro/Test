const
	fs = require("fs-extra"),
	path = __dirname + "/Isekai_Checktt/",
	moment = require("moment-timezone"),
	limit = 10,
	Cname = "checktt";
while (true) {
	try {
	} catch (e) { }
};
module.exports = {
	optine: {
		name: Cname,
		classify: "Tiện nghi",
		author: "Mr.Ben",
		Hasrecognize: 0,
		wait: 5,
		desc: "Kiểm tra Tương tác nhóm"
	},
	onLoad: async () => {
		if (!fs.existsSync(path + "dataDay.json")) {
			const
				year = moment.tz("Asia/Ho_Chi_minh").year(),
				month = moment.tz("Asia/Ho_Chi_minh").month();
			var data = {};
			data.year = year;
			data.month = month;
			fs.writeFileSync(path + "dataDay.json", JSON.stringify(data, null, 2))
		}
	},
	onChat: async function({ api, event, Users, Threads, args }) {
		try {
			const
				{ threadID, senderID, messageID, mentions } = event,
				data = require(path + threadID + ".json"),
				id = event.type == "message_reply" ? event.messageReply.senderID : Object.keys(mentions).length != 0 ? Object.keys(mentions)[0] : senderID,
				findU = await data.find(i => i.senderID === id),
				top = {
					"day": data.sort((a, b) => b.day - a.day).findIndex(i => i.senderID === id) + 1,
					"week": data.sort((a, b) => b.week - a.week).findIndex(i => i.senderID === id) + 1,
					"year": data.sort((a, b) => b.year - a.year).findIndex(i => i.senderID === id) + 1,
					"month": data.sort((a, b) => b.month - a.month).findIndex(i => i.senderID === id) + 1
				},
				type = args[0] == "day" ? "day" : args[0] == "week" ? "week" : args[0] == "month" ? "month" : false;
			if (type != false) {
				var
					msg = [], c = 1, body = [];
				var allData = data.sort((a, b) => b[type] - a[type]);
				for (var i of allData) {
					msg.push(`- Tên người dùng: ${await Users.getName(i.senderID)}\n- Tương tác ${type}: ${i[type]}`)
				};
				body += `[ TOP TƯƠNG TÁC ${type.toUpperCase()} ]\n`;
				for (var i = 0; i < limit; i++) {
					if (i >= msg.length) break;
					body += (c++) + `.\n` + msg[i] + "\n--------\n"
				};
				var numPage = Math.ceil(allData.length / limit)
				return api.sendMessage(body + "\n- Reply tin nhắn này để chọn trang muốn xem: " + `1 / ${numPage}`, threadID, (err, info) => {
					global.control.Reply.push({
						name: Cname,
						messageID: info.messageID,
						author: senderID,
						msg,
						type: "CheckttAll", types: type
					})
				}, messageID)
			}
			return api.sendMessage(
				`[ ${await Users.getName(id)} ]\n- Ngày:\n Tương tác: ${findU.day} - top: ${top.day}\n- Tuần:\n Tương tác: ${findU.week} - top: ${top.week}\n- tháng:\n Tương tác: ${findU.month} - top: ${top.month}\n- Năm:\n Tương tác: ${findU.year} - top: ${top.year}`, threadID, messageID
			)
		} catch (error) {
			console.log(error)
		}
	},
	onEvent: async function({ api, event, Users }) {
		try {
			const
				{ threadID, senderID, isGroup } = event;
			if (isGroup != true) return api.sendMessage('Vui lòng chỉ sài lệnh này trong nhóm!', threadID, messageID);
			if (!fs.existsSync(path + threadID + ".json")) fs.writeFileSync(path + threadID + ".json", JSON.stringify([]))
			const pathT = path + threadID + ".json";
			var
				data = require(pathT),
				findU = await data.find(i => i.senderID === senderID);
			if (!findU) {
				data.push({ senderID, day: 0, month: 0, week: 0, year: 0 })
			}
			else {
				findU.day += 1;
				findU.month += 1;
				findU.week += 1;
				findU.year += 1;
			}
			return fs.writeFileSync(pathT, JSON.stringify(data, null, 2))
		} catch (error) {
			console.log(error)
		}
	},
	onReply: async function({ api, event, Reply: H }) {
		try {
			if (H.type == "CheckttAll") {
				const
					msg = H.msg,
					{ threadID, messageID, senderID } = event;
				var page = !parseInt(event.body) ? 1 : parseInt(event.body);
				page <= 1 ? 1 : "";
				var numPage = Math.ceil(msg.length / limit);
				var body = [], c = 1;
				body += `[ TOP TƯƠNG TÁC ${H.types.toUpperCase()} ]\n`;
				for (var i = limit * (page - 1); i < limit * (page - 1) + limit; i++) {
					if (i >= msg.length) break;
					body += (c++) + `.\n` + msg[i] + "\n--------\n"
				};
				return api.sendMessage(body + "\n- Reply tin nhắn này để chọn trang muốn xem: " + `${page} / ${numPage}`, threadID, (err, info) => {
					global.control.Reply.push({
						name: Cname,
						messageID: info.messageID,
						author: senderID,
						msg,
						type: "CheckttAll", types: H.types
					})
				}, messageID)
			}
		} catch (error) {
			console.log(error)
		}
	}
};