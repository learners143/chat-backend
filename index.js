const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://chat-frontend-bay-three.vercel.app",
    methods: ["GET", "POST"],
  },
});

// Enable CORS for all routes
app.use(cors());
app.use(express.json());
app.get("/", (req,res) => {
  res.send("It's working fine")
})


io.on("connection", (socket) => {
  console.log('A user connected');

  // Join chat and store the user's name
  socket.on("joinChat", (arg) => {
    socket.name = arg;
    socket.broadcast.emit('joinChat', `${socket.name} has joined the chat`);
  });

  // Listen for new messages and broadcast them
  socket.on('newMessage', (message) => {
    const msgWithUser = { name: socket.name, message };
    socket.broadcast.emit('newMessage', msgWithUser);
    console.log(msgWithUser);
  });

  // When a user disconnects
  socket.on('disconnect', () => {
    console.log(`${socket.name} disconnected`);
    socket.broadcast.emit('userDisconnected', `${socket.name} has left the chat`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
