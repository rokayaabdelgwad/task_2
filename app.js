const express = require('express');
const userRouter = require('./routes/userRoute');
const chatRoutes = require('./routes/roomRoutes');
const fileRoute = require('./routes/fileRoute');
const messageRouter=require('./routes/messageRouter')
const app = express();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use('/Task_2/v1/files', fileRoute);
app.use('/Task_2/v1/chat', chatRoutes);
app.use('/Task_2/v1/users', userRouter);
app.use('/Task_2/v1/messages', messageRouter);


module.exports = app;