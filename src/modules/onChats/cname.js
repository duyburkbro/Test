module.exports = {
	optine: {
		name: "cname",
		classify: "Tiện nghi",
		wait: 5,
		Hasrecognize: 1,
		author: "Mr.Ben",
		desc: "Thao tác trong nhóm chat"
	},
	onChat: async function({ api, event, args }) {
		const
			{ messageID, threadID, type, mentions, senderID } = event,
			name = type == "message_reply" ? args.join('') : args.slice(" - ")[0];
		var
			id = type == "message_reply" ? [event.messageReply.senderID] : Object.keys(mentions).length != 0 ? Object.keys(mentions) : [senderID];
		for (let i of id ) {
			api.changeNickname(name, threadID, i, (err => {
				if (err) return api.sendMessage("Lỗi xảy ra ko thể thay đổi tên", threadID, messageID)
			}));
			};
		return api.sendMessage("Đã thay đổi tên thành công cho " + id.length + " Người dùng", threadID, messageID)
	}
}