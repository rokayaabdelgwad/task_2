const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const authController = require('../controllers/authController');
const fileController =require('../controllers/fileController')
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const io = require('../socket')

io.on('connection', (socket) => {
    // Handle socket events
  });

router.use(authController.protectR);

router.post('/rooms/:roomId/join', roomController.authorizeRoomAccess, roomController.joinRoom);



router.param('roomId', roomController.authorizeRoomAccess);
router.get('/rooms/:roomId', roomController.getRoomDetails);
router.post('/rooms/:roomId/messages', roomController.createRoomMessage);
router.get('/rooms', roomController.getRooms);
router.post('/rooms', roomController.createRoom);
router.get('/rooms/:roomId/messages', roomController.getRoomMessages);
router.post('/rooms/:roomId/send-message', roomController.sendMessage);
router.post('/rooms/upload-file', upload.single('file'),fileController.uploadFile );
router.get('/rooms/files/:fileId', roomController.getFile);

module.exports = router;


