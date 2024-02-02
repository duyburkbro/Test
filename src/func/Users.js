const
	fs = require("fs-extra"), 
	path = __dirname + "/data/Users.json", 
	data = require(path);
async function getName(senderID) {
	const find = await data.find(i => i.senderID === senderID);
	if (!find) return "Người dùng Facebook";
	return find.name || "người dùng Facebook";
};

async function getData(senderID) {
	const find = await data.find(i => i.senderID === senderID);
	return find || null;
};

async function setData(senderID, optine) {
	var find = await data.find(i => i.senderID === senderID);
	if (!find) return "User not found";
	find = optine;
	return fs.writeFileSync(path, JSON.stringify(data, null, 2));
};

function getAll() {
	return data;
}
module.exports = {
	getName,
	getData,
	setData,
	getAll
}