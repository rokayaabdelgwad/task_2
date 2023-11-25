const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const authController = require('../controllers/authController');
const fileController =require('../controllers/fileController')
const multer = require('multer');// Multer configuration for handling file uploads
const upload = multer({ storage: multer.memoryStorage() });// Store files in memory (you may adjust this based on your needs)

// Apply the protect middleware for user authentication
router.use(authController.protectR);

router.post('/rooms/:roomId/join', roomController.authorizeRoomAccess, roomController.joinRoom);

// router.post('/rooms/:roomId/join', roomController.joinRoom);

router.param('roomId', roomController.authorizeRoomAccess);
// router.use(roomController.authorizeRoomAccess)

// Your room-related routes
router.get('/rooms/:roomId', roomController.getRoomDetails);
router.post('/rooms/:roomId/messages', roomController.createRoomMessage);
router.get('/rooms', roomController.getRooms);
router.post('/rooms', roomController.createRoom);
router.get('/rooms/:roomId/messages', roomController.getRoomMessages);
router.post('/rooms/:roomId/send-message', roomController.sendMessage);
router.post('/rooms/upload-file', upload.single('file'),fileController.uploadFile );
router.get('/rooms/files/:fileId', roomController.getFile);

module.exports = router;


