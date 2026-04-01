const dotenv = require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const { createServer: createViteServer } = require('vite');
const  connectDB  = require('./config/db');
                                                           
const authRoutes = require('./routes/auth');                  
const rideRoutes = require('./routes/rides');              
const requestRoutes = require('./routes/requests');                 
const savedRideRoutes = require('./routes/savedRides');             

async function startServer() {
  const app = express();
  const PORT = 8000;

  // Connect to MongoDB
  await connectDB();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Create HTTP server for Socket.io
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  // Make io accessible in routes
  app.set('io', io);

  // Socket.io connection
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

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
        console.error('Socket message error:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  // API Routes
  app.use('/api/auth',authRoutes );
  app.use('/api/rides', rideRoutes);
  app.use('/api/requests', requestRoutes);
  app.use('/api/saved-rides', savedRideRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);