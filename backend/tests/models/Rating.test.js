/**
 * @fileoverview Unit tests for Rating model schema validation
 *
 * Tests rating value constraints, raterRole enum,
 * and the unique compound index for duplicate prevention.
 */

const mongoose = require('mongoose');
const { Rating } = require('../../models/Rating');

describe('Rating Model', () => {
  const validRating = {
    rideOfferId: new mongoose.Types.ObjectId(),
    requestId: new mongoose.Types.ObjectId(),
    raterId: new mongoose.Types.ObjectId(),
    ratedUserId: new mongoose.Types.ObjectId(),
    rating: 5,
    review: 'Excellent ride!',
    raterRole: 'passenger',
  };

  test('should create a valid rating', () => {
    const rating = new Rating(validRating);

    expect(rating.rating).toBe(5);
    expect(rating.review).toBe('Excellent ride!');
    expect(rating.raterRole).toBe('passenger');
  });

  test('should accept rating value of 1 (minimum)', () => {
    const rating = new Rating({ ...validRating, rating: 1 });
    const error = rating.validateSync();
    expect(error).toBeUndefined();
  });

  test('should accept rating value of 5 (maximum)', () => {
    const rating = new Rating({ ...validRating, rating: 5 });
    const error = rating.validateSync();
    expect(error).toBeUndefined();
  });

  test('should reject rating below 1', () => {
    const rating = new Rating({ ...validRating, rating: 0 });
    const error = rating.validateSync();
    expect(error).toBeDefined();
    expect(error.errors.rating).toBeDefined();
  });

  test('should reject rating above 5', () => {
    const rating = new Rating({ ...validRating, rating: 6 });
    const error = rating.validateSync();
    expect(error).toBeDefined();
    expect(error.errors.rating).toBeDefined();
  });

  test('should accept "driver" as raterRole', () => {
    const rating = new Rating({ ...validRating, raterRole: 'driver' });
    const error = rating.validateSync();
    expect(error).toBeUndefined();
  });

  test('should accept "passenger" as raterRole', () => {
    const rating = new Rating({ ...validRating, raterRole: 'passenger' });
    const error = rating.validateSync();
    expect(error).toBeUndefined();
  });

  test('should reject invalid raterRole', () => {
    const rating = new Rating({ ...validRating, raterRole: 'admin' });
    const error = rating.validateSync();
    expect(error).toBeDefined();
    expect(error.errors.raterRole).toBeDefined();
  });

  test('should default review to empty string', () => {
    const { review, ...noReview } = validRating;
    const rating = new Rating(noReview);
    expect(rating.review).toBe('');
  });

  test('should require rating field', () => {
    const { rating: ratingVal, ...noRating } = validRating;
    const rating = new Rating(noRating);
    const error = rating.validateSync();
    expect(error).toBeDefined();
    expect(error.errors.rating).toBeDefined();
  });

  test('should require raterRole field', () => {
    const { raterRole, ...noRole } = validRating;
    const rating = new Rating(noRole);
    const error = rating.validateSync();
    expect(error).toBeDefined();
    expect(error.errors.raterRole).toBeDefined();
  });

  test('should have unique compound index on requestId + raterId', () => {
    const indexes = Rating.schema.indexes();
    const compoundIndex = indexes.find(
      (idx) => idx[0].requestId === 1 && idx[0].raterId === 1
    );
    expect(compoundIndex).toBeDefined();
    expect(compoundIndex[1].unique).toBe(true);
  });

  test('should have timestamps enabled', () => {
    const schema = Rating.schema;
    expect(schema.options.timestamps).toBe(true);
  });
});
