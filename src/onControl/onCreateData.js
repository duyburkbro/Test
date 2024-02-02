module.exports = async function({ api, event }) {
	try {
		const
			fs = require("fs-extra"),
			pathThreads = __dirname + "/../func/data/Threads.json",
			dataThreads = require(pathThreads),
			pathUsers = __dirname + "/../func/data/Users.json",
			dataUsers = require(pathUsers),
			{ threadID, senderID, isGroup } = event;
		const { threadsBanned } = global.data;
		if (threadsBanned.has(threadID)) return;
		if (isGroup != true) return;
		if (!fs.existsSync(pathThreads)) fs.writeFileSync(pathThreads, JSON.stringify([]))
		if (!fs.existsSync(pathUsers)) fs.writeFileSync(pathUsers, JSON.stringify([]))
		const
			findThreads = await dataThreads.find(i => i.threadID == threadID),
			findUsers = await dataUsers.find(i => i.senderID == senderID)
		if (!findThreads) {
			const threadInfo = await api.getThreadInfo(threadID)
			const { userInfo } = threadInfo;
			dataThreads.push({ threadID, threadInfo, data: {} });
			console.log("[ IseKai ] - " + `successfully created data for the group: ${threadID}`)
			userInfo.forEach(async (item) => {
				const findUser = await dataUsers.find(i => i.senderID == item.id);
				if (!findUser) {
					dataUsers.push({
						senderID: item.id, name: item.name, data: {
							"msg": 0,
							"money": 0
						}
					});
					console.log("[ IseKai ]" + ` - create successful data for users: ${item.name} ( id: ${item.id} )`)
				}
			})
		};
		if (!findUsers) {
			const { name } = (await api.getUserInfo(senderID))[senderID];
			dataUsers.push({
				senderID, name, data: {
					"msg": 0,
					"money": 0
				}
			});
			console.log("[ IseKai ]" + ` - create successful data for users: ${name} ( id: ${senderID} )`)
		}
		fs.writeFileSync(pathThreads, JSON.stringify(dataThreads, null, 2));
		return fs.writeFileSync(pathUsers, JSON.stringify(dataUsers, null, 2))
	} catch (error) {
		return;
	}
}