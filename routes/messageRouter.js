const express = require("express");
const messageController = require("../controllers/messageController");
const router = express.Router();
const authController = require("../controllers/authController");
const chatController = require("../controllers/roomController");
// Apply protect middleware to all routes in this router
router.use(authController.protect);
// Routes


router.post("/send", messageController.createMessage);
router.get("/room/:roomId",chatController.authorizeRoomAccess, messageController.getRoomMessages);

module.exports = router;
