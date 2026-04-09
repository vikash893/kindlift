/**
 * @fileoverview Unit tests for SavedRide model schema validation
 *
 * Tests saved ride/route bookmarking schema including
 * required fields, default values, and location structure.
 */

const mongoose = require('mongoose');
const { SavedRide } = require('../../models/SavedRide');

describe('SavedRide Model', () => {
  const validSavedRide = {
    userId: new mongoose.Types.ObjectId(),
    source: { name: 'Home - Dwarka', lat: 28.5921, lng: 77.0460 },
    destination: { name: 'Office - Gurugram', lat: 28.4595, lng: 77.0266 },
    seats: 2,
  };

  test('should create a valid saved ride', () => {
    const ride = new SavedRide(validSavedRide);

    expect(ride.source.name).toBe('Home - Dwarka');
    expect(ride.destination.name).toBe('Office - Gurugram');
    expect(ride.seats).toBe(2);
  });

  test('should default seats to 1', () => {
    const { seats, ...noSeats } = validSavedRide;
    const ride = new SavedRide(noSeats);
    expect(ride.seats).toBe(1);
  });

  test('should fail validation without userId', () => {
    const { userId, ...noUser } = validSavedRide;
    const ride = new SavedRide(noUser);
    const error = ride.validateSync();
    expect(error).toBeDefined();
    expect(error.errors.userId).toBeDefined();
  });

  test('should fail validation without source name', () => {
    const ride = new SavedRide({
      ...validSavedRide,
      source: { lat: 28.5921, lng: 77.0460 },
    });
    const error = ride.validateSync();
    expect(error).toBeDefined();
  });

  test('should fail validation without destination coordinates', () => {
    const ride = new SavedRide({
      ...validSavedRide,
      destination: { name: 'Office' },
    });
    const error = ride.validateSync();
    expect(error).toBeDefined();
  });

  test('should store coordinates as numbers', () => {
    const ride = new SavedRide(validSavedRide);
    expect(typeof ride.source.lat).toBe('number');
    expect(typeof ride.source.lng).toBe('number');
    expect(typeof ride.destination.lat).toBe('number');
    expect(typeof ride.destination.lng).toBe('number');
  });

  test('should have timestamps enabled', () => {
    const schema = SavedRide.schema;
    expect(schema.options.timestamps).toBe(true);
  });
});
