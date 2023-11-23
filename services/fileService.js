// /services/fileService.js

const File = require('../models/fileModel');

async function uploadFile(userId, roomId, file) {
  // Implement file upload logic here
  const filename = file.originalname;
  const path = `/uploads/${filename}`;

  const uploadedFile = new File({ user: userId, room: roomId, filename, path });
  await uploadedFile.save();

  return uploadedFile;
}

module.exports = { uploadFile };
