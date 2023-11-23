
const Room = require('../models/roomModel');
const Message = require('../models/messageModel');
const File = require('../models/fileModel');

exports.getRooms = async () => {
  const rooms = await Room.find().populate('users', 'username');
  return rooms;
};

exports.createRoom = async ({ name }) => {
  const room = new Room({ name });
  await room.save();
  return room;
};

exports.getRoomMessages = async (roomId, page = 1, pageSize = 20) => {
  const messages = await Message.find({ room: roomId })
    .sort({ createdAt: -1 }) // Sort in descending order
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .populate('user', 'username'); // Populate the user information

  return messages.reverse(); // Reverse the order to get messages in ascending order
};

exports.sendMessage = async (roomId, userId, text) => {
  const message = new Message({ room: roomId, user: userId, text });
  await message.save();
  return message;
};

exports.joinRoom = async (roomId, userId) => {
  const room = await Room.findById(roomId);
  if (room) {
    if (!room.users.includes(userId)) {
      room.users.push(userId);
      await room.save();
    }
    return room;
  }
  throw new Error('Room not found');
};

exports.uploadFile = async (roomId, userId, file) => {
  // Save the file to the server or cloud storage
  const filename = file.originalname; // You may want to rename the file for security
  const path = `/uploads/${filename}`; // Update the path based on your server setup

  // Save file information to MongoDB
  const uploadedFile = new File({ user: userId, room: roomId, filename, path });
  await uploadedFile.save();

  return uploadedFile;
};

exports.getFile = async (fileId) => {
  return File.findById(fileId);
};
