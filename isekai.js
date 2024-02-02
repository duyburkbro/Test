const
	login = require("./fca"),
	fs = require("fs-extra");

//////setup global

global.client = {
	settings: require("./settings.json"),
	commands: new Map(),
	events: new Map(),
	waits: new Map()
};

global.data = {
	threadsBanned: new Map(),
	UsersBanned: new Map()
};

global.control = {
	extend: require("./extend"),
	Reply: new Array(),
	Reaction: new Array()
};

global.allID = {
	Threads: new Array(),
	Users: new Array()
}
///////startbot
login({ appState: JSON.parse(fs.readFileSync("fbstate.txt", "utf-8")) }, (err, api) => {
	if (err) console.log(err);
	try {
		api.setOptions(global.client.settings.FCAOption);
		const pathMdl = __dirname + "/src/modules/onChats/";
		fs.readdirSync(pathMdl).forEach(i => {
			if (!i.endsWith(".js")) return;
			try {
				var mdl = require(pathMdl + i);
				if (mdl.onLoad) mdl.onLoad()
				if (!mdl.optine || !mdl.optine.name || !mdl.optine.classify) return console.log("[ IseKai ] - Event không đúng định dạng: " + i)
				global.client.commands.set(mdl.optine.name, mdl)
			} catch (error) {
				global.control.extend.log("Không thể tải lệnh lỗi:\n" + error)
			}
		})
		const pathEvent = __dirname + "/src/modules/onEvents/";
		fs.readdirSync(pathEvent).forEach(i => {
			var event = require(pathEvent + i);
			if (!i.endsWith(".js")) return;
			try {
				if (event.onLoad) event.onLoad()
				if (!event.optine || !event.optine.name || !event.optine.EventType) return console.log("[ IseKai ] - Event không đúng định dạng: " + i)
				global.client.events.set(event.optine.name, event)
			} catch (error) {
				global.control.extend.log("Không thể load Event lỗi:\n" + error)
			}
		})
		global.control.extend.log(`Đã tải thành công ${global.client.commands.size} Runs, và ${global.client.events.size} Events`);
		global.client.api = api;
		const
			listApi = {};
		listApi.api = api;
		require("./src/listen.js")(listApi)
	} catch (error) {
		global.control.extend.log("Error" + error)
	}
})