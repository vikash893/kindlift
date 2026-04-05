require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const { createServer: createViteServer } = require('vite');
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

  // Connect DB
  await connectDB();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

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
      console.log(`User ${userId} joined room`);
    });

    socket.on('send_message', async (data) => {
      try {
        const { requestId, senderId, receiverId, text } = data;
        const { Message } = require('./models/Message');

        const newMessage = new Message({ requestId, senderId, text });
        await newMessage.save();

        io.to(receiverId).emit('receive_message', newMessage);
        socket.emit('receive_message', newMessage);
      } catch (err) {
        console.error('Socket error:', err);
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
  app.use("/api/location", locationRoutes);

  // 🔥 FRONTEND + BACKEND HANDLING

  if (process.env.NODE_ENV === 'production') {
    // Serve React build
    const distPath = path.join(__dirname, '../frontend/build');

    app.use(express.static(distPath));

    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    // Vite dev server (only for local dev)
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  }

  // Start server
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('❌ Server failed to start:', err);
});