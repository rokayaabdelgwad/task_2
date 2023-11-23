// /services/messageService.js

const Message = require('../models/messageModel');

async function saveMessage(text, userId, roomId) {
  const message = new Message({ text, user: userId, room: roomId });
  await message.save();
  return message;
}

module.exports = { saveMessage };
