const socketIO = require("socket.io");

function setupSocket(server) {
  const io = socketIO(server);
  // Set up your Socket.IO events and listeners here

  io.on('connection', (socket) => {
    console.log('A user connected');
    // ... other socket events
  });

  return io;
}

module.exports = setupSocket;
