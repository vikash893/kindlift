/**
 * @fileoverview Unit tests for JWT authentication middleware
 *
 * Tests token validation, missing tokens, expired tokens,
 * and correct user payload extraction.
 */

const jwt = require('jsonwebtoken');
const { authMiddleware } = require('../../middleware/auth');

// Mock Express req/res/next
const mockRequest = (authHeader) => ({
  header: jest.fn((name) => {
    if (name === 'Authorization') return authHeader;
    return null;
  }),
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

// Test secret — matches the fallback in auth.js
const JWT_SECRET = 'fallback_secret';

describe('authMiddleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should reject request with no Authorization header', () => {
    const req = mockRequest(undefined);
    const res = mockResponse();

    authMiddleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'No token, authorization denied',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('should reject request with empty token', () => {
    const req = mockRequest('Bearer ');
    const res = mockResponse();

    authMiddleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('should reject request with invalid token', () => {
    const req = mockRequest('Bearer invalid.token.here');
    const res = mockResponse();

    authMiddleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Token is not valid',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('should accept request with valid token and attach user to req', () => {
    const payload = { id: '507f1f77bcf86cd799439011', name: 'Test User' };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    const req = mockRequest(`Bearer ${token}`);
    const res = mockResponse();

    authMiddleware(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(req.user).toBeDefined();
    expect(req.user.id).toBe(payload.id);
    expect(req.user.name).toBe(payload.name);
  });

  test('should reject expired token', () => {
    const payload = { id: '507f1f77bcf86cd799439011', name: 'Test User' };
    // Create token that's already expired
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '-1s' });

    const req = mockRequest(`Bearer ${token}`);
    const res = mockResponse();

    authMiddleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Token is not valid',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('should reject token signed with wrong secret', () => {
    const payload = { id: '507f1f77bcf86cd799439011', name: 'Test User' };
    const token = jwt.sign(payload, 'wrong_secret', { expiresIn: '7d' });

    const req = mockRequest(`Bearer ${token}`);
    const res = mockResponse();

    authMiddleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('should handle token without Bearer prefix', () => {
    const payload = { id: '507f1f77bcf86cd799439011', name: 'Test User' };
    const token = jwt.sign(payload, JWT_SECRET);

    // No "Bearer " prefix — the replace will still work
    const req = mockRequest(token);
    const res = mockResponse();

    authMiddleware(req, res, mockNext);

    // Should try to verify the raw token
    // The token is valid, so it should pass through
    expect(mockNext).toHaveBeenCalled();
  });
});
