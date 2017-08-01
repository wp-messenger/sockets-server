var fs = require('fs');
var allowedApiKeys = JSON.parse(fs.readFileSync('api-keys.json', 'utf8'));

console.log(allowedApiKeys.keys);

var port = 4000;
var io = require('./node_modules/socket.io')(port);
if (io) {
	console.log('Server running on port: ' + port);

	var namespaces = allowedApiKeys.keys;

	for (var i = 0; i < namespaces.length; i++) {
		var namespaceName = namespaces[ i ];
		var namespace = io.of('/' + namespaceName);

		namespace.on('connection', function (socket) {
			socket.on("sendMessage", function (data) {
				console.log('sendMessage');
				namespace.emit(data.to, {"from": data.from, "msg": data.msg, "display_name": data.display_name, "image_url": data.image_url});
			});
			socket.on("con", function (data) {
				console.log('con');
				namespace.emit("newCon", data);
				socket.on('disconnect', function () {
					namespace.emit("dis", data);
				});
			});
			socket.on("okNewCon", function (data) {
				namespace.emit("acceptCon" + data.to, data.my);
			});
			socket.on("write", function (data) {
				console.log('write');
				namespace.emit("write" + data.to, data.my);
			});
			socket.on("stopWrite", function (data) {
				namespace.emit("stopWrite" + data.to, data.my);
			});
		});
	}
}