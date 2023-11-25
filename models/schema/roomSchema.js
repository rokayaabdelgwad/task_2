const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: String,
  users: [{ type: mongoose.Schema.Types.ObjectId, ref:'User' }],
  text:String
});



module.exports = roomSchema;