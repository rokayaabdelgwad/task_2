// /middleware/fileUpload.js

const multer = require('multer');

// Multer configuration for handling file uploads
const storage = multer.memoryStorage(); // Store files in memory (you may adjust this based on your needs)
const upload = multer({ storage });

module.exports = upload;

