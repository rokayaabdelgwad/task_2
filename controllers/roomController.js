const chatService = require('../services/chatService');
const multer = require('multer');
const Room = require('../models/roomModel');
const Message = require('../models/messageModel');
const AppError = require('../utils/appError');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


exports.getRoomDetails = async (req, res) => {
  try {
    const roomId = req.params.roomId;

    const room = await Room.findById(roomId).populate('users', 'username');

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.status(200).json({ status: 'success', data: { room } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createRoomMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user._id;
    const roomId = req.params.roomId;

    const newMessage = await Message.create({ user: userId, text, room: roomId });

    res.status(201).json({ status: 'success', data: { message: newMessage } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getRooms = async (req, res) => {
  try {
    const rooms = await chatService.getRooms();
    res.json(rooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user._id || req.user.id; // Use both req.user._id and req.user.id

    // Ensure userId is valid before adding to the users array
    if (!userId) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Create a new room with the user ID associated
    const newRoom = await Room.create({
      name,
      users: [userId], // Make sure the user is added here
    });

    res.status(201).json(newRoom);
  } catch (error) {
    
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.getRoomMessages = async (req, res) => {
  try {
    const { roomId, page, pageSize } = req.query;
    const messages = await chatService.getRoomMessages(roomId, page, pageSize);
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { roomId, userId, text } = req.body;
    const message = await chatService.sendMessage(roomId, userId, text);
    
    // Emit the message to all users in the room
    io.to(roomId).emit('chat message', message);

    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/////////////////////////////////////////////////////////////////
exports.joinRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id;

    const result = await chatService.joinRoom(roomId, userId);

    res.status(200).json({
      status: 'User joined room successfully',
      data: { result },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  console.log('Request Params:', req.params);
  console.log('Request User:', req.user);
};


// Endpoint for uploading files
exports.uploadFile = upload.single('file');
exports.postFile = async (req, res) => {
  try {
    const { roomId, userId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const uploadedFile = await chatService.uploadFile(roomId, userId, file);

    // Emit an event to notify all users in the room about the new file
    io.to(roomId).emit('new file', uploadedFile);

    res.status(201).json(uploadedFile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




// Endpoint for downloading files
exports.getFile = async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const file = await chatService.getFile(fileId);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Implement logic to download the file
    // You may want to use file.path to locate the file on the server

    res.json(file);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.authorizeRoomAccess = async (req, res, next) => {
  try {
    const roomId = req.params.roomId;

    // Check if the room exists
    const room = await Room.findById(roomId);

    if (!room) {
      return next(new AppError('Room not found', 404));
    }

    // Check if the authenticated user is a member of the room
    if (!room.users.includes(req.user.id)) {
      return next(new AppError('Unauthorized. User is not a member of the room', 403));
    }

    // If the user is a member, continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    return next(new AppError('Internal Server Error', 500));
  }
};


