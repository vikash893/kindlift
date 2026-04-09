/**
 * @fileoverview JWT Authentication Middleware
 *
 * Protects API routes by verifying Bearer tokens in the Authorization header.
 * Decoded user payload (id, name) is attached to `req.user` for downstream use.
 *
 * @requires jsonwebtoken - JWT token verification
 */

const jwt = require('jsonwebtoken');

/**
 * Express middleware that validates JWT tokens from the Authorization header.
 *
 * Expected header format: `Authorization: Bearer <token>`
 *
 * On success, attaches decoded user data to `req.user`:
 * - `req.user.id`   — MongoDB user ID
 * - `req.user.name` — User's display name
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware
 * @returns {void}
 *
 * @example
 * // Usage in a route
 * const { authMiddleware } = require('../middleware/auth');
 * router.get('/protected', authMiddleware, (req, res) => {
 *   res.json({ userId: req.user.id });
 * });
 */
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      message: 'No token, authorization denied'
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret'
    );

    req.user = {
      id: decoded.id,
      name: decoded.name
    };

    next();
  } catch (err) {
    res.status(401).json({
      message: 'Token is not valid'
    });
  }
};

module.exports = { authMiddleware };