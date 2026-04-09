/**
 * @fileoverview Unit tests for User model schema validation
 *
 * Tests schema validation rules, default values, and required fields
 * using Mongoose's built-in validation (no DB connection needed).
 */

const mongoose = require('mongoose');
const { User } = require('../../models/User');

describe('User Model', () => {
  test('should create a valid user with required fields', () => {
    const user = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedpassword123',
    });

    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john@example.com');
    expect(user.password).toBe('hashedpassword123');
  });

  test('should set default values correctly', () => {
    const user = new User({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'hashedpassword456',
    });

    expect(user.isDriverVerified).toBe(false);
    expect(user.coins).toBe(0);
    expect(user.ratingSum).toBe(0);
    expect(user.totalRatings).toBe(0);
  });

  test('should fail validation without name', async () => {
    const user = new User({
      email: 'test@example.com',
      password: 'password123',
    });

    const error = user.validateSync();
    expect(error).toBeDefined();
    expect(error.errors.name).toBeDefined();
  });

  test('should fail validation without email', async () => {
    const user = new User({
      name: 'Test User',
      password: 'password123',
    });

    const error = user.validateSync();
    expect(error).toBeDefined();
    expect(error.errors.email).toBeDefined();
  });

  test('should fail validation without password', async () => {
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
    });

    const error = user.validateSync();
    expect(error).toBeDefined();
    expect(error.errors.password).toBeDefined();
  });

  test('should accept optional fields', () => {
    const user = new User({
      name: 'Driver User',
      email: 'driver@example.com',
      password: 'hashedpassword',
      phone: '+91-9876543210',
      profilePhoto: 'data:image/jpeg;base64,abc123',
      vehicleNumber: 'DL01AB1234',
      licenseNumber: 'DL-1234567890',
      vehiclePhoto: 'data:image/jpeg;base64,vehicle123',
      isDriverVerified: true,
      coins: 50,
      ratingSum: 20,
      totalRatings: 5,
    });

    expect(user.phone).toBe('+91-9876543210');
    expect(user.isDriverVerified).toBe(true);
    expect(user.coins).toBe(50);
    expect(user.ratingSum).toBe(20);
    expect(user.totalRatings).toBe(5);
    expect(user.vehicleNumber).toBe('DL01AB1234');
  });

  test('should calculate average rating correctly', () => {
    const user = new User({
      name: 'Rated User',
      email: 'rated@example.com',
      password: 'password',
      ratingSum: 22,
      totalRatings: 5,
    });

    const avgRating = user.totalRatings > 0
      ? user.ratingSum / user.totalRatings
      : 0;

    expect(avgRating).toBeCloseTo(4.4, 1);
  });

  test('should have timestamps enabled', () => {
    const schema = User.schema;
    expect(schema.options.timestamps).toBe(true);
  });
});
