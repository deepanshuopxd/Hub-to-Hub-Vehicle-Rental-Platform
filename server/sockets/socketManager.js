const socketIO = require('socket.io');
const gpsHandler = require('./gpsHandler');
const chatHandler = require('./chatHandler');

let io;

const initSocket = (server) => {
  io = socketIO(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
  });

  io.on('connection', (socket) => {
    console.log(`Socket Connected: ${socket.id}`);

    // Join a general room based on User ID (for personal notifications)
    socket.on('authenticate', (userId) => {
      socket.join(userId);
    });

    // Initialize Handlers
    gpsHandler(io, socket);
    chatHandler(io, socket);

    socket.on('disconnect', () => {
      // console.log('Socket disconnected');
    });
  });
};

const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized!');
  return io;
};

module.exports = { initSocket, getIO };