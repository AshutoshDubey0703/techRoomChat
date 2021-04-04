const moment = require("moment");
const botName = require("../server");

const formatMessage = (username, text, socketId) => {
  return {
    username,
    text,
    time: moment().format("h:mm a"),
    socketId: socketId,
    isChatBot: username === "TechRoomChat Bot" ? true : false,
  };
};

module.exports = formatMessage;
