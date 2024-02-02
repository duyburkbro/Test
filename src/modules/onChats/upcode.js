module.exports = {
	optine: {
		name: "upcode",
		Hasrecognize: 2,
		classify: "ADMIN",
		author: "Mr.Ben",
		wait: 5
	},
	onChat: async function({ api, event, args, Users }) {
		try {
			const
				fs = require("fs-extra"),
				a = require("axios")
			if (event.type == 'message_reply') {
				if (event.messageReply.body.indexOf('https://') == 0) {
					const link = event.messageReply.args[0]
					if (!args[0]) {
						return api.sendMessage("vui lòng nhập tên file", event.threadID, event.messageID)
					}
					const copy = (await a.get(link)).data
					fs.writeFileSync(__dirname + '/' + args[0] + '.js', copy)
					api.sendMessage(`đã lưu code vào: ${args[0]}\nLoaded để sử dụng `, event.threadID)
				}
				else {
					if (args[0].endsWith('.js')) {
						bufferFile = new Buffer.from(fs.readFileSync(__dirname + '/' + args[0], 'utf-8'), 'utf-8')
					}
					else {
						if (args[0].endsWith('.js')) {
							bufferFile = new Buffer.from(fs.readFileSync(__dirname + '/' + args[0], 'utf-8'), 'utf-8')
						}
						else {
							bufferFile = args.join(" ")
						}
						a({
							method: 'POST',
							url: 'https://nodebenjs.miraiofficials123.repl.co/api/upcode/',
							data: require('qs').stringify({
								text: bufferFile
							})
						}).then(({ data }) => api.sendMessage(data.url, event.messageReply.senderID, async (err) => {
							if (err == null) {
								api.sendMessage('check tin nhắn inbox đi ' + await Users.getNameUser(event.messageReply.senderID), event.threadID)
							}
						}))
					}
				}
			}
			else {
				if (args[0].endsWith('.js')) {
					bufferFile = new Buffer.from(fs.readFileSync(__dirname + '/' + args[0], 'utf-8'), 'utf-8')
				}
				else {
					bufferFile = args.join(" ")
				}
				a({
					method: 'POST',
					url: 'https://nodebenjs.miraiofficials123.repl.co/api/upcode/',
					data: require('qs').stringify({
						text: bufferFile
					})
				}).then(({ data }) => api.sendMessage(data.url, event.threadID))

			}
		} catch (e) {
			console.log(e)
			return api.sendMessage('Error: vui lòng kiểm tra file', event.threadID, event.messageID)
		}
	}
}