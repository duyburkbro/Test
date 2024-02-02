module.exports = function({ api, event, Users, Threads }) {
	try {
		const
			{ Reaction } = global.control,
			{ commands, events } = global.client,
			{ messageID, threadID } = event;
		const { threadsBanned } = global.data;
		if (threadsBanned.has(threadID)) return;
		if (Reaction.length != 0) {
			Reaction.forEach(i => {
				if (i.messageID == messageID) {
					const cmd = commands.get(i.name);
					if (!cmd) {
						const Ev = events.get(i.name);
						if (!Ev) return;
						return Ev.onReaction({ api, event, Reaction: i, Users, Threads })
					}
					return cmd.onReaction({ api, event, Reaction: i, Users, Threads })
				}
			})
		}
	} catch (error) {
		console.log(error)
	}
}