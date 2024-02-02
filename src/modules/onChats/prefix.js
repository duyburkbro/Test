module.exports = {
	optine: {
		name: "prefix",
		author: "Mr.Ben",
		wait: 5,
		classify: "Tiện nghi",
		desc: "PREFIX"
	}, 
	onChat: async function({ api, event, Threads, args }) {
		try {
			const
				{ threadID, messageID } = event,
				{ data } = await Threads.getData(threadID),
				{ BOTNAME } = global.client.settings;
			switch (args[0].toLowerCase()) {
				case "set": 
				case "-s": {
					if (!args[1]) return api.sendMessage("vui longf nhập control muốn bot đổi", threadID, messageID)
					data["PREFIX"] = args[1];
					await Threads.setData(threadID, {data});
					return api.sendMessage(`Đã thay đổi thành công control thành: ${data["PREFIX"]}`, threadID, () => {
						api.changeNickname(`[ ${data["PREFIX"]} ] - ${BOTNAME}`, threadID, api.getCurrentUserID())
					}, messageID)
				}
			}
		} catch (error) {
			console.log(error)
		}
	},
	onEvent: async({ api, event, Threads }) => {
		const { threadID, messageID, body } = event;
		const { data } = await Threads.getData(threadID);
		const { PREFIX } = global.client.settings;
		const regExp = new RegExp(`^\\prefix`);
		if (!regExp.test(body)) return;
		return api.sendMessage(`PREFIX Của bot là: ${data["PREFIX"] || PREFIX}`,  threadID, messageID)
	}
}