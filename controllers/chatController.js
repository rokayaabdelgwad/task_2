const chatService = require('../services/chatService');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
    const room = await chatService.createRoom(req.body);
    res.status(201).json(room);
  } catch (error) {
    console.error(error);
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

exports.joinRoom = async (req, res) => {
  try {
    const { roomId, userId } = req.body;
    const room = await chatService.joinRoom(roomId, userId);
    
    // Emit an event to notify other users in the room about the new member
    io.to(roomId).emit('user joined', { roomId, userId });

    res.json(room);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
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
