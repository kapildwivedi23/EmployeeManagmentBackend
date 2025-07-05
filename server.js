const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*'
  }
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/auth', require('./routes/authRoutes'));
app.use('/admin', require('./routes/adminRoutes'));
app.use('/employee', require('./routes/employeeRoutes'));

connectDB();

// WebSocket: basic chat
io.on('connection', socket => {
  console.log('User connected:', socket.id);

  socket.on('join', (room) => {
    socket.join(room);
  });

  socket.on('chat-message', ({ room, sender, text }) => {
    io.to(room).emit('chat-message', { sender, text, time: new Date() });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(3000, () => {
  console.log('✅ Server is running on port 3000');
});
