const
	fs = require("fs-extra");
const upload = async (url) => {
	const { ImgurClient } = require('imgur');
	const client = new ImgurClient({ clientId: 'b88f92544843717' });
	const { image } = require('image-downloader');
	const { get } = require('request');
	const dest = `${__dirname}/${get(url).uri.pathname.replace(/\/|-|_/g, '')}`;
	await image({ url, dest });
	const res = await client.upload({ image: fs.createReadStream(dest), type: 'stream' });
	fs.unlinkSync(dest)
	return res.data.link || null;
};
module.exports = {
	optine: {
		name: "cover",
		classify: "Tiện nghi",
		author: "Mr.Ben",
		wail: 5,
		desc: "code cho zui"
	},
	onChat: async function({ api, event, args }) {
		try {
			const
				axios = require('axios'),
				{ threadID, messageID } = event;
			if (event.type != "message_reply" || event.messageReply.attachments.length == 0) return api.sendMessage('Vui lòng reply 1 ảnh nào đó', threadID, messageID)
			else {
				var attachment = [], c = 1;
				for (var i of event.messageReply.attachments) {
					var path = __dirname + "/cache/Cover" + (c++) + '.jpg';
					if (i.type == 'photo') {
						if (!i.url.endsWith('.jpg' || '.png')) url = await upload(i.url);
						const cover = (await axios.get('https://site--meitu--ypbfbhsgwlkm.code.run/meitu-image-v2?url=' + url)).data.image;
						const data = (await axios.get(cover, { responseType: 'arraybuffer' })).data;
						fs.writeFileSync(path, Buffer.from(data, 'utf-8'));
						attachment.push(fs.createReadStream(path))
					}
					else return api.sendMessage("Vui lòng chỉ reply ảnh", threadID, messageID)
				};
				return api.sendMessage({ attachment }, threadID, messageID)
			}
		} catch (error) {
			console.log(error)
			return api.sendMessage(`Lỗi xẩy ra`, event.threadID, event.messageID)
		}
	}
}