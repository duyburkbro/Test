module.exports = async function({ api, event, Users, Threads }) {
	try {
		const
			{ PREFIX, OnlyAdmin, ADMIN } = global.client.settings,
			{ commands, waits } = global.client,
			{ body, senderID, messageID, threadID } = event,
			{ threadsBanned, UsersBanned } = global.data,
			thread4 = await api.getThreadInfo(threadID),
			{ data } = await Threads.getData(threadID),
			Pre = !data ? PREFIX : data['PREFIX'] || PREFIX,
			control = new RegExp(`^\\${Pre}\\s*`);
		if (!control.test(body)) return;
		if (!ADMIN.includes(senderID) && threadsBanned.has(threadID)) {
			var dataB = threadsBanned.get(threadID);
			return api.sendMessage(`[ Group Is banned ]\n- Nhóm bạn đã bị cấm với lý do: ${dataB.reason}\n- Thời gian: ${dataB.timeStart}`, threadID, messageID)
		};
		const
			args = body.replace(control, "").split(" "),
			cmd = commands.get(args[0].toLowerCase());
		if (!cmd) return api.sendMessage(`the command you used does not exist please use ${Pre}help to see the commands available on the bot`, threadID, messageID);
		var recognize = 0;
		if (ADMIN.includes(senderID)) recognize = 2;
		else {
			const find = await thread4.adminIDs.find(i => i.id == senderID);
			if (find) recognize = 1;
		};
		if (recognize < cmd.optine.Hasrecognize) return api.sendMessage(`Bạn không đủ quyền hạn để sử dụng lệnh: ${args[0]}`, threadID, messageID)
		const
			{ wait } = cmd.optine,
			cooldowns = Date.now() + wait * 1000;
		if (!waits.has(senderID)) {
			waits.set(senderID, { cooldowns })
		}
		else if (waits.get(senderID).cooldowns >= Date.now()) {
			return api.sendMessage("Bạn đang trong thời gian chờ vui lòng thử lại sau: " + Math.floor((waits.get(senderID).cooldowns - Date.now())/ 1000) + "s", threadID, messageID);
		}
		else waits.set(senderID, { cooldowns })
		return cmd.onChat({ api, event, args: args.slice(1), Users, Threads, recognize })
	} catch (error) {
		console.log(error)
	}
}