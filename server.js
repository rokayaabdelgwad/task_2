require("./db");
const app = require("./app");
const http = require("http");
const socketIO = require("socket.io");
const server = http.createServer(app);
const io = socketIO(server);
const redisAdapter = require('socket.io-redis');

// Use Redis as a scalable message broker
io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));

io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle user connection
  socket.on('user connected', async (userId) => {
    // Update user's online status to true
    await authService.setUserOnlineStatus(userId, true);

    // Broadcast the updated user list to all connected users
    io.emit('user list', await getOnlineUsers());

    console.log(`User ${userId} connected`);
  });

  // Handle chat messages
  socket.on('chat message', async (data) => {
    // Save the message to MongoDB
    // Assume the data contains: { roomId, userId, text }
    const message = new Message(data);
    await message.save();

    // Broadcast the message to all users in the room
    io.to(data.roomId).emit('chat message', message);

    // Notify the recipient about the new message if they are online
    const recipientSocket = findSocketByUserId(data.recipientId);
    if (recipientSocket) {
      recipientSocket.emit('new message', message);
    }
  });

  // Handle room joining
  socket.on('join room', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room ${roomId}`);
  });

  // Handle user joining
  socket.on('join user', async (data) => {
    socket.join(data.roomId);
    io.to(data.roomId).emit('user joined', { roomId: data.roomId, userId: data.userId });

    // Update user's online status to true
    await authService.setUserOnlineStatus(data.userId, true);

    // Broadcast the updated user list to all connected users
    io.emit('user list', await getOnlineUsers());
  });

  // Handle user disconnection
  socket.on('disconnect', async () => {
    console.log('User disconnected');

    // Update user's online status to false
    const userId = findUserIdBySocket(socket);
    if (userId) {
      await authService.setUserOnlineStatus(userId, false);

      // Broadcast the updated user list to all connected users
      io.emit('user list', await getOnlineUsers());
    }
  });

  // Handle file upload
  socket.on('upload file', async (data) => {
    // Handle file upload logic here
    // Assume data contains: { roomId, userId, file }

    const uploadedFile = await chatService.uploadFile(data.roomId, data.userId, data.file);

    // Emit an event to notify all users in the room about the new file
    io.to(data.roomId).emit('new file', uploadedFile);
  });
});

const port = process.env.PORT || 3001 || 3002;

app.listen(port, () => {
  console.log(`listening on ${port} 👍👍`);
});
