// /routes/fileRoute.js

const express = require('express');
const router = express.Router();
const fileService = require('../services/fileService');

// Middleware for handling file uploads
const upload = require('../middleware/fileUpload');

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const userId = req.user?.id; // Use optional chaining
    const roomId = req.body.roomId;
    const file = req.file;

    if (!userId) {
      // Handle the case where the user is not authenticated
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const uploadedFile = await fileService.uploadFile(userId, roomId, file);
    
    // Respond with the uploaded file information
    res.json(uploadedFile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
