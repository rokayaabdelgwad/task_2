require("./db");
const app = require("./app");
const socket = require("socket.io");


const port = process.env.PORT || 3001 || 3002;

const server =app.listen(port, () => {
  console.log(`listening on ${port} 👍👍`);
});

// Socket setup
const io = socket(server);

io.on("connection", function (socket) {
  console.log("Made socket connection");
});