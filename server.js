const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

const botName = "TechRoomChat Bot";

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    socket.emit(
      "message",
      formatMessage(botName, `Welcome to TechRoomChat, ${username}!`, socket.id)
    );

    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${username} has joined the chat`, socket.id)
      );

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      roomUsers: getRoomUsers(user.room),
    });
  });

  socket.on("chatMessage", (msg) => {
    const currentUser = getCurrentUser(socket.id);
    io.to(currentUser.room).emit(
      "message",
      formatMessage(currentUser.username, msg, socket.id)
    );
  });

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`, socket.id)
      );

      io.to(user.room).emit("roomUsers", {
        room: user.room,
        roomUsers: getRoomUsers(user.room),
      });
    }
  });
});

const PORT = 3000 || process.env.port;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
