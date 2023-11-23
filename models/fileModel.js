const mongoose=require('mongoose');
const fileSchema=require('./schema/fileSchema')
const file=  mongoose.model('File',fileSchema)

module.exports=file