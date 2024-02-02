const
	fs = require("fs-extra"),
	path = __dirname + "/data/Threads.json", 
	data = require(path);
async function getData(threadID) {
	const find = await data.find(i => i.threadID === threadID);
	if (!find) return "group not found";
	return find || null
};

async function setData(threadID, optine) {
	var find = await data.find(i => i.threadID === threadID);
	if (!find) return "group not found";
	find = optine;
	return fs.writeFileSync(path, JSON.stringify(data, null, 2))
};

function getAll() {
	return data;
};
module.exports = {
	getData,
	setData,
	getAll
}