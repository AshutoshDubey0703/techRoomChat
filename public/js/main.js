const chatForm = document.getElementById("chat-form");
const socket = io();
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

const outputMessage = (message) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>`;
  if (message.isChatBot) {
    // div.classList.remove("message");
    // div.classList.remove("selfMessage");
    div.classList.add("botMessage");
  } else if (message.socketId === socket.id) {
    div.classList.add("selfMessage");
  } else {
    div.classList.add("otherMessage");
  }

  chatMessages.appendChild(div);
};

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.emit("joinRoom", { username, room });

socket.on("roomUsers", ({ room, roomUsers }) => {
  outputRoomName(room);
  outputUsers(roomUsers);
});

socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  socket.emit("chatMessage", msg);
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

function outputRoomName(room) {
  roomName.innerText = room;
}

function outputUsers(users) {
  console.log("users: ", users);
  userList.innerHTML = users
    .map((user) => `<li>${user.username}</li>`)
    .join("");
}
