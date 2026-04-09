/**
 * @fileoverview KindLift Backend Server — Entry Point
 *
 * Express.js HTTP server with Socket.IO for real-time messaging.
 * Includes comprehensive security middleware: Helmet (headers),
 * CORS (origin restrictions), XSS sanitization, HPP protection,
 * rate limiting, and JWT authentication.
 *
 * @requires dotenv     - Environment variable management
 * @requires express    - HTTP server framework
 * @requires http       - Node.js HTTP module for Socket.IO
 * @requires socket.io  - Real-time bidirectional communication
 * @requires cors       - Cross-Origin Resource Sharing
 * @requires helmet     - Security HTTP headers
 * @requires hpp        - HTTP Parameter Pollution protection
 * @requires express-rate-limit - API rate limiting
 */

require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const hpp = require('hpp');
const rateLimit = require("express-rate-limit");
const connectDB = require('./config/db');
const { sanitizeInput } = require('./middleware/sanitize');

// ─── Route Imports ────────────────────────────────────────
const authRoutes = require('./routes/auth');
const rideRoutes = require('./routes/rides');
const requestRoutes = require('./routes/requests');
const savedRideRoutes = require('./routes/savedRides');
const ratingRoutes = require('./routes/ratings');
const locationRoutes = require('./routes/location');
const adminRouter = require('./admin/getuser');

/**
 * Allowed CORS origins for frontend clients.
 * Add your deployed frontend URL and localhost for development.
 */
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:8000',
  'https://kindlift.in',
  'https://www.kindlift.in',
  'https://kindlift.onrender.com',
  'https://kindlift-1.onrender.com',
  'https://kindlift-frontend.onrender.com',
  process.env.FRONTEND_URL,
].filter(Boolean);

/**
 * Initializes and starts the KindLift server with full security stack.
 *
 * Security layers (in order):
 * 1. Helmet — Sets secure HTTP headers (X-Frame-Options, CSP, etc.)
 * 2. CORS — Restricts origins, methods, and headers
 * 3. HPP — Prevents HTTP Parameter Pollution attacks
 * 4. Rate Limiting — Global (300/min) and per-route limits
 * 5. XSS Sanitization — Strips HTML/script tags from all inputs
 * 6. JWT Authentication — Token-based auth on protected routes
 * 7. Input Validation — express-validator on all route handlers
 *
 * @async
 * @returns {Promise<void>}
 */
async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 8000;

  // ─── Security: HTTP Headers (Helmet) ──────────────────
  // Sets X-Content-Type-Options, X-Frame-Options, X-XSS-Protection,
  // Strict-Transport-Security, Content-Security-Policy, and more.
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false, // Disabled — frontend is on a separate origin
    crossOriginOpenerPolicy: false,
  }));

  // ─── Security: CORS Configuration ─────────────────────
  // Restricts which domains can access the API
 const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const allowed = ALLOWED_ORIGINS.some(allowedOrigin =>
      origin.startsWith(allowedOrigin)
    );

    if (allowed) {
      return callback(null, true);
    }

    console.log('❌ CORS blocked:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};
  app.use(cors(corsOptions));
  // Handle preflight requests explicitly
  app.options('*', cors(corsOptions));

  // ─── Security: HTTP Parameter Pollution ───────────────
  // Prevents attackers from sending duplicate query params
  app.use(hpp());

  // ─── Body Parsing ─────────────────────────────────────
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // ─── Security: XSS Sanitization ──────────────────────
  // Strips HTML tags and script content from all request inputs
  app.use(sanitizeInput);

  // ─── Security: Rate Limiting ──────────────────────────
  // Global: 300 requests per minute per IP
  const globalLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 300,
    standardHeaders: true,  // Return rate limit info in headers
    legacyHeaders: false,   // Disable X-RateLimit-* headers
    message: { message: 'Too many requests, please try again later' },
  });

  // Stricter limit for auth routes (prevent brute force)
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,                   // 20 attempts per 15 min
    message: { message: 'Too many login attempts, please try again after 15 minutes' },
  });

  // Stricter limit for location/geocoding API (60 req/min)
  const locationLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    message: { message: 'Too many location requests, please slow down' },
  });

  app.use(globalLimiter);

  // ─── Database Connection ──────────────────────────────
  await connectDB();

  // ─── HTTP & WebSocket Server ──────────────────────────
  const server = http.createServer(app);

  /**
   * Socket.IO server instance.
   * Configured with CORS for allowed origins.
   */
  const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      const allowed = ALLOWED_ORIGINS.some(allowedOrigin =>
        origin.startsWith(allowedOrigin)
      );

      if (allowed) return callback(null, true);

      console.log('❌ Socket CORS blocked:', origin);
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST'],
    credentials: true
  }
});

  // Make Socket.IO accessible in Express route handlers
  app.set('io', io);

  // ─── Socket.IO Event Handlers ─────────────────────────
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    /**
     * Join event — adds the user to their personal room.
     * @param {string} userId - The MongoDB user ID to join as room name
     */
    socket.on('join', (userId) => {
      // Basic validation: ensure userId is a string
      if (typeof userId === 'string' && userId.length > 0) {
        socket.join(userId);
      }
    });

    /**
     * Send message event — persists a chat message and delivers it in real-time.
     * @param {Object} data - { requestId, senderId, receiverId, text }
     */
    socket.on('send_message', async (data) => {
      try {
        const { requestId, senderId, receiverId, text } = data;

        // Input validation for socket messages
        if (!requestId || !senderId || !receiverId || !text) {
          return;
        }

        if (typeof text !== 'string' || text.trim().length === 0) {
          return;
        }

        const { Message } = require('./models/Message');

        const newMessage = new Message({
          requestId,
          senderId,
          text: text.substring(0, 2000), // Limit message length
        });
        await newMessage.save();

        // Deliver to receiver's room and echo back to sender
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

  // ─── API Routes ───────────────────────────────────────
  app.use('/api/auth', authLimiter, authRoutes);         // Auth with brute force protection
  app.use('/api/rides', rideRoutes);                      // Ride offer management
  app.use('/api/requests', requestRoutes);                // Ride request lifecycle
  app.use('/api/saved-rides', savedRideRoutes);           // Saved routes
  app.use('/api/ratings', ratingRoutes);                  // Post-ride ratings
  app.use("/api/location", locationLimiter, locationRoutes);
  app.use('/api/admin', adminRouter);
  // Location with stricter limit

  // ─── Global Error Handler ─────────────────────────────
  // Catches unhandled errors and CORS violations
  app.use((err, req, res, next) => {
    if (err.message === 'Not allowed by CORS') {
      return res.status(403).json({ message: 'CORS: Origin not allowed' });
    }
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal server error' });
  });

  // ─── Start Server ────────────────────────────────────
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('❌ Server failed to start:', err);
});