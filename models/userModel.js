const mongoose=require('mongoose');
const userSchema=require('./schema/userSchema')
const user=  mongoose.model('User',userSchema)

module.exports=user