module.exports = function ({ api, event, Users, Threads }) {
	try {
		const { commands } = global.client;
		const { threadsBanned } = global.data;
		if (threadsBanned.has(event.threadID)) return;
		commands.forEach(i => {
			if (i.onEvent) i.onEvent({ api, event, Users, Threads })
		})
	} catch (error) {
		console.log(error)
	}
}