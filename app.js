const express = require("express");
const roomController = require("./controllers/roomController");
const userRouter = require("./routes/userRoute");
const roomRoutes = require("./routes/roomRoutes");
const fileRoute = require("./routes/fileRoute");
const messageRouter = require("./routes/messageRouter");
const http = require("http");
const socketIOSetup = require("./socket");
const socketIO = require("socket.io");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = socketIO(server);
// Use io in your route/controller

app.use("/Task_2/v1/files", fileRoute);
app.use("/Task_2/v1/chat", roomRoutes);
app.use("/Task_2/v1/users", userRouter);
app.use("/Task_2/v1/messages", messageRouter);

module.exports = app;
