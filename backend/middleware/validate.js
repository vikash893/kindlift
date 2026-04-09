/**
 * @fileoverview Input Validation Middleware
 *
 * Provides reusable validation chains for all API endpoints
 * using express-validator. Each route group has its own set
 * of validation rules.
 *
 * @requires express-validator - Input validation and sanitization
 */

const { body, query, param, validationResult } = require('express-validator');

/**
 * Middleware that checks for validation errors from express-validator.
 * If errors exist, returns a 400 response with error details.
 * Should be placed AFTER validation chains in the middleware array.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map(e => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }
  next();
};

// ═══════════════════ AUTH VALIDATORS ═══════════════════

/** Validation rules for POST /api/auth/register */
const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone')
    .optional()
    .trim()
    .isLength({ max: 20 }).withMessage('Phone number too long'),
  handleValidationErrors,
];

/** Validation rules for POST /api/auth/login */
const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

/** Validation rules for POST /api/auth/send-otp */
const validateSendOtp = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  handleValidationErrors,
];

/** Validation rules for POST /api/auth/verify-otp */
const validateVerifyOtp = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  body('otp')
    .trim()
    .notEmpty().withMessage('OTP is required')
    .isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
    .isNumeric().withMessage('OTP must contain only digits'),
  handleValidationErrors,
];

// ═══════════════════ RIDE VALIDATORS ═══════════════════

/** Validation rules for POST /api/rides (create ride offer) */
const validateCreateRide = [
  body('source.name')
    .trim()
    .notEmpty().withMessage('Source location name is required'),
  body('source.lat')
    .notEmpty().withMessage('Source latitude is required')
    .isFloat({ min: -90, max: 90 }).withMessage('Invalid source latitude'),
  body('source.lng')
    .notEmpty().withMessage('Source longitude is required')
    .isFloat({ min: -180, max: 180 }).withMessage('Invalid source longitude'),
  body('destination.name')
    .trim()
    .notEmpty().withMessage('Destination location name is required'),
  body('destination.lat')
    .notEmpty().withMessage('Destination latitude is required')
    .isFloat({ min: -90, max: 90 }).withMessage('Invalid destination latitude'),
  body('destination.lng')
    .notEmpty().withMessage('Destination longitude is required')
    .isFloat({ min: -180, max: 180 }).withMessage('Invalid destination longitude'),
  body('seatsAvailable')
    .notEmpty().withMessage('Seats available is required')
    .isInt({ min: 1, max: 10 }).withMessage('Seats must be between 1 and 10'),
  body('departureTime')
    .notEmpty().withMessage('Departure time is required')
    .isISO8601().withMessage('Invalid date format'),
  handleValidationErrors,
];

/** Validation rules for GET /api/rides/search */
const validateSearchRides = [
  query('sourceLat')
    .notEmpty().withMessage('Source latitude is required')
    .isFloat({ min: -90, max: 90 }).withMessage('Invalid source latitude'),
  query('sourceLng')
    .notEmpty().withMessage('Source longitude is required')
    .isFloat({ min: -180, max: 180 }).withMessage('Invalid source longitude'),
  query('destLat')
    .notEmpty().withMessage('Destination latitude is required')
    .isFloat({ min: -90, max: 90 }).withMessage('Invalid destination latitude'),
  query('destLng')
    .notEmpty().withMessage('Destination longitude is required')
    .isFloat({ min: -180, max: 180 }).withMessage('Invalid destination longitude'),
  query('seats')
    .notEmpty().withMessage('Seats is required')
    .isInt({ min: 1, max: 10 }).withMessage('Seats must be between 1 and 10'),
  handleValidationErrors,
];

// ═══════════════════ REQUEST VALIDATORS ═══════════════════

/** Validation rules for POST /api/requests (create ride request) */
const validateCreateRequest = [
  body('offerId')
    .notEmpty().withMessage('Offer ID is required')
    .isMongoId().withMessage('Invalid offer ID format'),
  body('seatsRequested')
    .notEmpty().withMessage('Seats requested is required')
    .isInt({ min: 1, max: 10 }).withMessage('Seats must be between 1 and 10'),
  body('source.name')
    .trim()
    .notEmpty().withMessage('Source location name is required'),
  body('source.lat')
    .isFloat({ min: -90, max: 90 }).withMessage('Invalid source latitude'),
  body('source.lng')
    .isFloat({ min: -180, max: 180 }).withMessage('Invalid source longitude'),
  body('destination.name')
    .trim()
    .notEmpty().withMessage('Destination location name is required'),
  body('destination.lat')
    .isFloat({ min: -90, max: 90 }).withMessage('Invalid destination latitude'),
  body('destination.lng')
    .isFloat({ min: -180, max: 180 }).withMessage('Invalid destination longitude'),
  handleValidationErrors,
];

/** Validation rules for PUT /api/requests/:id/status */
const validateUpdateStatus = [
  param('id')
    .isMongoId().withMessage('Invalid request ID format'),
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['accepted', 'rejected']).withMessage('Status must be "accepted" or "rejected"'),
  handleValidationErrors,
];

/** Validation rules for PUT /api/requests/:id/complete */
const validateCompleteRequest = [
  param('id')
    .isMongoId().withMessage('Invalid request ID format'),
  body('code')
    .trim()
    .notEmpty().withMessage('Completion code is required')
    .isLength({ min: 4, max: 4 }).withMessage('Code must be 4 digits')
    .isNumeric().withMessage('Code must contain only digits'),
  handleValidationErrors,
];

/** Validation for MongoDB ObjectId params */
const validateMongoId = [
  param('id')
    .isMongoId().withMessage('Invalid ID format'),
  handleValidationErrors,
];

// ═══════════════════ RATING VALIDATORS ═══════════════════

/** Validation rules for POST /api/ratings */
const validateCreateRating = [
  body('rideOfferId')
    .notEmpty().withMessage('Ride offer ID is required')
    .isMongoId().withMessage('Invalid ride offer ID'),
  body('requestId')
    .notEmpty().withMessage('Request ID is required')
    .isMongoId().withMessage('Invalid request ID'),
  body('ratedUserId')
    .notEmpty().withMessage('Rated user ID is required')
    .isMongoId().withMessage('Invalid rated user ID'),
  body('rating')
    .notEmpty().withMessage('Rating is required')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('review')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Review must be under 500 characters'),
  body('raterRole')
    .notEmpty().withMessage('Rater role is required')
    .isIn(['driver', 'passenger']).withMessage('Role must be "driver" or "passenger"'),
  handleValidationErrors,
];

// ═══════════════════ SAVED RIDE VALIDATORS ═══════════════════

/** Validation rules for POST /api/saved-rides */
const validateCreateSavedRide = [
  body('sourceName')
    .trim()
    .notEmpty().withMessage('Source name is required')
    .isLength({ max: 200 }).withMessage('Source name too long'),
  body('destinationName')
    .trim()
    .notEmpty().withMessage('Destination name is required')
    .isLength({ max: 200 }).withMessage('Destination name too long'),
  body('seats')
    .optional()
    .isInt({ min: 1, max: 10 }).withMessage('Seats must be between 1 and 10'),
  handleValidationErrors,
];

// ═══════════════════ LOCATION VALIDATORS ═══════════════════

/** Validation rules for GET /api/location/search */
const validateLocationSearch = [
  query('q')
    .trim()
    .notEmpty().withMessage('Search query is required')
    .isLength({ min: 3, max: 200 }).withMessage('Query must be 3-200 characters'),
  handleValidationErrors,
];

module.exports = {
  handleValidationErrors,
  validateRegister,
  validateLogin,
  validateSendOtp,
  validateVerifyOtp,
  validateCreateRide,
  validateSearchRides,
  validateCreateRequest,
  validateUpdateStatus,
  validateCompleteRequest,
  validateMongoId,
  validateCreateRating,
  validateCreateSavedRide,
  validateLocationSearch,
};
