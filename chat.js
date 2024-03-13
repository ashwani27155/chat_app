const express = require("express");
const app = express();
const http = require("http").Server(app); // Binding express to http server

//Binding http server to the socket.io
const io = require("socket.io")(http);

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/views/chat.html");
});
//  Store connected user into an array
const users = [];
io.on("connection", (socket) => {
	console.log("User is connected");
	// Listen to the event setUserName
	socket.on("setipaddress", (data) => {
		console.log(data);
		//  Check if the user name is already taken

		if (users.indexOf(data.ipaddress) > -1) {
			// Respond back to the client that username is already taken
			socket.emit(
				"ipAddress",
				data.ipaddress + " : ipAddress is already exist.Try something different"
			);
		} else {
			//Push the user name into array
			users.push(data.ipaddress);

			socket.emit("ipaddressSet", { username: data.ipaddress });
		}

		// Listen on the message event
		socket.on("msg", (data) => {
			// Broadcasted message to all the users
			io.sockets.emit("newmsg", data);
		});
	});
});
/**
 * Starting the http server
 */
http.listen(8000, () => {
	console.log("Server started");
});
