module.exports.optine = {
	name: "thread",
	classify: "Tiện nghi",
	wait: 5,
	Hasrecognize: 2
};
const
	bound = 10;
module.exports.onChat = async function({ api, event, args, Threads }) {
	const
		{ threadID, messageID, senderID } = event,
		{ threadsBanned } = global.data;
	switch (args[0].toLowerCase()) {
		case "ban": {
			const { data } = await Threads.getData(threadID);
			data["banned"] = {
				threadID,
				reason: args.slice(1).join(" ") || "không có lý do",
				timeStart: Date.now()
			};
			await Threads.setData(threadID, { data });
			threadsBanned.set(threadID, data["banned"])
			return api.sendMessage(`Cấm thành công nhóm: ${threadID}\n- với lý do: ${data["banned"].reason}`, threadID, messageID)
		};
		case "unban": {
			const { data } = await Threads.getData(threadID);
			delete data["banned"];
			await Threads.setData(threadID, { data })
			threadsBanned.delete(threadID)
			return api.sendMessage(`Đã unban thành công`, threadID, messageID)
		};
		case "listban": {
			var data = [];
			threadsBanned.forEach(i => {
				data.push(i)
			});
			var msg = [], c = 1, id = []
			for (var i of data) {
				id.push(i.threadID);
				const { threadName } = await api.getThreadInfo(i.threadID);
				msg += (c++) + `\n- Tên nhóm: ${threadName}\n- Lý do: ${i.reason}\n- Thời gian: ${i.timeStart}\n-------\n`
			}
			return api.sendMessage("[ LIST BAN ]\n\n" + msg + "\n- Reply stt bạn muốn để unban", threadID, (err, info) => {
				global.control.Reply.push({
					name: this.optine.name,
					messageID: info.messageID,
					author: senderID,
					id, type: "listban"
				})
			}, messageID)
		};
		case "list":
		case "-l": {
			var msg = [], c = 1;
			for (var i of global.allID.Threads) {
        console.log(i)
				const { name, participantIDs, adminIDs, messageCount } = await api.getThreadInfo(i);
				msg.push(
					(c++) + `.\n`	+
					` Tên nhóm: ${name}\n` +
					` Tổng thành viên: ${participantIDs.length}\n` +
					` Tổng tin nhắn: ${messageCount}\n` +
					` Tổng QTV: ${adminIDs.length}`
				)
			};
			var body = [], cMsg = [];
			for (let index = 0; index < bound; index++) {
				if (index >= msg.length) break;
        body += msg[index] + `\n--------\n`;
			};
      return api.sendMessage({body}, threadID, messageID)
		}
	}
};
module.exports.onReply = async function({ api, event, Reply: H }) {
	try {
		const { threadID, messageID } = event;
		switch (H.type) {
			case "listban": {
				const
					{ threadsBanned } = global.data;
				var listSc = [], listErr = [];
				for (var i of event.args) {
					try {
						if (!threadsBanned.has(H.id[i - 1])) listErr.push(i)
						else {
							threadsBanned.delete(H.id[i - 1]);
							listSc.push(i)
						}
					} catch (error) {
						listErr.push(i)
					}
				};
				return api.sendMessage(`Đã gỡ ban thành công ${listSc.length}, và ${listErr.length} nhóm không thành công`, threadID, () => api.unsendMessage(H.messageID), messageID)
			}
		}
	} catch (error) {
		console.log(error)
	}
}