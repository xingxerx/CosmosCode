const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const logger = require('../../utils/logger');

/**
 * Sets up real-time collaboration using Socket.IO
 * @param {Object} server - HTTP server instance
 * @returns {Object} - Configured Socket.IO instance
 */
function setupSocketServer(server) {
  const io = socketIo(server, {
    cors: {
      origin: config.app.corsOrigins,
      methods: ['GET', 'POST'],
      credentials: true
    }
  });
  
  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    
    try {
      const decoded = jwt.verify(token, config.auth.jwtSecret);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });
  
  // Set up collaboration rooms
  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.user.id}`);
    
    // Join a simulation room
    socket.on('join-simulation', (simulationId) => {
      socket.join(`simulation:${simulationId}`);
      socket.to(`simulation:${simulationId}`).emit('user-joined', {
        userId: socket.user.id,
        username: socket.user.username
      });
    });
    
    // Share parameter updates
    socket.on('update-parameters', (data) => {
      socket.to(`simulation:${data.simulationId}`).emit('parameters-updated', {
        userId: socket.user.id,
        parameters: data.parameters,
        timestamp: new Date()
      });
    });
    
    // Share annotations
    socket.on('add-annotation', (data) => {
      socket.to(`simulation:${data.simulationId}`).emit('annotation-added', {
        userId: socket.user.id,
        annotation: data.annotation,
        position: data.position,
        timestamp: new Date()
      });
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.user.id}`);
    });
  });
  
  return io;
}

module.exports = { setupSocketServer };