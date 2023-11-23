
const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  createdAt: { type: Date, default: Date.now },
  
});

// Create indexes
messageSchema.index({ room: 1, createdAt: -1 });
messageSchema.index({ user: 1, createdAt: -1 });


module.exports = messageSchema;
