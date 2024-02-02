const
	{ spawn } = require("child_process"),
	app = require("express")();
app.get("/", (req, res) => {
	res.json("Welcome to IseKaiBot")
})
app.listen(3000);
function Isekai(msg) {
	console.log(msg)
	const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "isekai.js"], {
		cwd: __dirname,
		stdio: "inherit",
		shell: true,
	});
	child.on("close", (statusCode) => {
		if (statusCode == 0) return Isekai(`Open Server...`);
		if (statusCode == 1) return Isekai(`Đang khởi động lại bot...`);
		else return;
	})
	child.on("error", (error) => console.log(error))
}
Isekai();