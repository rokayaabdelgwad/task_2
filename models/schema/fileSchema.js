const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  filename: String,
  path: String,
  createdAt: { type: Date, default: Date.now },
});



module.exports = fileSchema;