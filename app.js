const express = require('express');
const app = express();
const userRouter = require('./routes/userRoute');
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));



app.use('/Task_2/v1/users', userRouter);
module.exports = app;