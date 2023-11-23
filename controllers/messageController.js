// messageController.js
const Message = require('../models/messageModel');
const Room = require('../models/roomModel');

exports.createMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user._id;
    const roomId = req.params.roomId;

    // Check if the user is a member of the room
    const room = await Room.findOne({ _id: roomId, users: userId });
    if (!room) {
      return res.status(403).json({ error: 'Unauthorized. User is not a member of the room' });
    }

    const newMessage = await Message.create({ user: userId, text, room: roomId });

    res.status(201).json({ status: 'success', data: { message: newMessage } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getRoomMessages = async (req, res) => {
  try {
    const roomId = req.params.roomId;

    // Check if the user is a member of the room
    const isMember = await Room.exists({ _id: roomId, users: req.user._id });
    if (!isMember) {
      return res.status(403).json({ error: 'Unauthorized. User is not a member of the room' });
    }

    const messages = await Message.find({ room: roomId }).populate('user', 'username');

    res.status(200).json({ status: 'success', data: { messages } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

