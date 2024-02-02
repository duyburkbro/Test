module.exports.optine = {
	name: "test",
	classify: "Tiện nghi",
	wait: 0
};
/*module.exports.autoLoad = () => {
	console.log("oke ccccc")
}*/
module.exports.onChat = async function({ api, event, args, Users, Threads }) {
	const {nicknames} = await api.getThreadInfo(event.threadID);
	console.log(nicknames[event.senderID])
};
module.exports.Reply = function({ api, event, Reply: H }) {
	console.log(api)
};
module.exports.Reaction = function({ api, event, Reaction: H }) {
	console.log(H)
};
module.exports.Event = function({ api, event }) {
	//console.log(event)
}