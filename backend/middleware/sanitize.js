/**
 * @fileoverview XSS Sanitization Middleware
 *
 * Recursively sanitizes all string values in req.body, req.query, and req.params
 * to prevent Cross-Site Scripting (XSS) attacks by escaping HTML entities.
 *
 * @requires xss - XSS filter library
 */

const xss = require('xss');

/**
 * XSS filter options — strip all HTML tags except none.
 * Allows only plain text through.
 */
const xssOptions = {
  whiteList: {},          // No tags allowed
  stripIgnoreTag: true,   // Strip all unknown tags
  stripIgnoreTagBody: ['script', 'style'], // Remove script/style entirely
};

/**
 * Recursively sanitize all string values in an object.
 *
 * @param {*} obj - Value to sanitize (string, object, array, or primitive)
 * @returns {*} Sanitized value
 */
function sanitizeValue(obj) {
  if (typeof obj === 'string') {
    return xss(obj, xssOptions);
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeValue);
  }

  if (obj && typeof obj === 'object') {
    const sanitized = {};
    for (const key of Object.keys(obj)) {
      sanitized[key] = sanitizeValue(obj[key]);
    }
    return sanitized;
  }

  return obj; // numbers, booleans, null, undefined — pass through
}

/**
 * Express middleware that sanitizes all incoming request data
 * (body, query params, and URL params) to prevent XSS attacks.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const sanitizeInput = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  if (req.query) {
    req.query = sanitizeValue(req.query);
  }
  if (req.params) {
    req.params = sanitizeValue(req.params);
  }
  next();
};

module.exports = { sanitizeInput, sanitizeValue };
