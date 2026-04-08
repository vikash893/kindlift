require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const rateLimit = require("express-rate-limit");
const connectDB = require('./config/db');

// Routes
const authRoutes = require('./routes/auth');
const rideRoutes = require('./routes/rides');
const requestRoutes = require('./routes/requests');
const savedRideRoutes = require('./routes/savedRides');
const ratingRoutes = require('./routes/ratings');
const locationRoutes = require('./routes/location');

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 8000;

  // ✅ GLOBAL RATE LIMIT
  const globalLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 300,
  });

  // ✅ STRICT LIMIT FOR LOCATION
  const locationLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 60,
  });

  // Connect DB
  await connectDB();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Apply global limiter
  app.use(globalLimiter);

  // Create HTTP server
  const server = http.createServer(app);

  // Socket.io setup
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  app.set('io', io);

  // Socket events
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join', (userId) => {
      socket.join(userId);
    });

    socket.on('send_message', async (data) => {
      try {
        console.log("🔥 MESSAGE DATA:", data);

        const { requestId, senderId, receiverId, text } = data;
        console.log("🔥 SENDER:", senderId, "RECEIVER:", receiverId);

        const { Message } = require('./models/Message');

        const newMessage = new Message({ requestId, senderId, text });
        await newMessage.save();

        console.log("🔥 MESSAGE SAVED:", newMessage);

        io.to(receiverId).emit('receive_message', newMessage);
        socket.emit('receive_message', newMessage);

      } catch (err) {
        console.error('❌ Socket error:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/rides', rideRoutes);
  app.use('/api/requests', requestRoutes);
  app.use('/api/saved-rides', savedRideRoutes);
  app.use('/api/ratings', ratingRoutes);

  // Location route with stricter limit
  app.use("/api/location", locationLimiter, locationRoutes);

  // Start server
 server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
}

startServer().catch((err) => {
  console.error('❌ Server failed to start:', err);
});