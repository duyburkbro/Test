"use strict";

function log(msg) {
	return console.log("[ IseKai ] -", msg)
};
async function saveFile(path, url) {
	try {
		const
			axios = require("axios"),
			fs = require("fs-extra"),
			data = (await axios.get(url, { responseType: "arraybuffer" })).data;
		fs.writeFileSync(path, Buffer.from(data, "utf-8"))
	} catch (error) {
		log("Không thể tải file")
	}
}
module.exports = {
	log,
	saveFile
}