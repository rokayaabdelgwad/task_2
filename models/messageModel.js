const mongoose=require('mongoose');
const messageSchema=require('./schema/messageSchema')
const Message=  mongoose.model('Message',messageSchema)

module.exports=Message