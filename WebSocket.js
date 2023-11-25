// const express = require('express');
// const https = require('https');
// const WebSocket = require('ws');
// const fs = require('fs');

// const app = express();

// // Load SSL/TLS certificates
// const serverOptions = {
//   key: fs.readFileSync('path/to/private-key.pem'),
//   cert: fs.readFileSync('path/to/certificate.pem'),
//   ca: fs.readFileSync('path/to/ca.pem'), // Include CA certificates if applicable
// };

// const server = https.createServer(serverOptions, app);
// const wss = new WebSocket.Server({ server });

// wss.on('connection', (ws) => {
//   // Handle WebSocket connections
//   ws.on('message', (message) => {
//     // Broadcast the received message to all connected clients
//     wss.clients.forEach((client) => {
//       if (client !== ws && client.readyState === WebSocket.OPEN) {
//         client.send(message);
//       }
//     });
//   });
// });

// // Your existing routes and middleware here

// // Start the server
// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   console.log(`Server is running on https://localhost:${PORT}`);
// });
