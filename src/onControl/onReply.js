module.exports = function({ api, event, Users, Threads }) {
	try {
		const
			{ Reply } = global.control,
			{ commands, events } = global.client,
			{ messageReply } = event;
		const { threadsBanned } = global.data;
		if (threadsBanned.has(event.threadID)) return;
		if (Reply.length !== 0) {
			Reply.forEach(i => {
				if (messageReply.messageID == i.messageID) {
					const cmd = commands.get(i.name);
					if (!cmd) {
						const Ev = events.get(i.name);
						if (!Ev) return;
						return Ev.onReply({ api, event, Reply: i, Users, Threads });
					}
					return cmd.onReply({ api, event, Reply: i, Users, Threads })
				};
			});
		}
	} catch (error) {
		null;
	}
}