module.exports = function ({ api, event, Users, Threads }) {
	try {
		const
			{ events } = global.client,
			{ logMessageType } = event;
		const { threadsBanned } = global.data;
		if (threadsBanned.has(event.threadID)) return;
		events.forEach(i => {
			if (i.optine.EventType.includes(logMessageType)) i.onChat({ api, event, Users, Threads })
		})
	} catch (error) {
		console.log(error)
	}
}