const express = require('express');
const router = express.Router();
const fileController=require('../controllers/fileController')
const multer = require('multer');// Multer configuration for handling file uploads
const upload = multer({ storage: multer.memoryStorage() });// Store files in memory (you may adjust this based on your needs)

router.use(fileController.protect)
router.post('/upload', upload.single('file'),fileController.uploadFile );


module.exports = router;
