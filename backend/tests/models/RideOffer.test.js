/**
 * @fileoverview Unit tests for RideOffer model schema validation
 *
 * Tests the ride offer schema including required fields,
 * status enum validation, and default values.
 */

const mongoose = require('mongoose');
const { RideOffer } = require('../../models/RideOffer');

describe('RideOffer Model', () => {
  const validOffer = {
    driverId: new mongoose.Types.ObjectId(),
    source: { name: 'Connaught Place', lat: 28.6315, lng: 77.2167 },
    destination: { name: 'Sector 18 Noida', lat: 28.5706, lng: 77.3218 },
    seatsAvailable: 3,
    departureTime: new Date('2026-04-15T08:00:00Z'),
  };

  test('should create a valid ride offer', () => {
    const offer = new RideOffer(validOffer);

    expect(offer.source.name).toBe('Connaught Place');
    expect(offer.source.lat).toBe(28.6315);
    expect(offer.destination.name).toBe('Sector 18 Noida');
    expect(offer.seatsAvailable).toBe(3);
    expect(offer.departureTime).toEqual(new Date('2026-04-15T08:00:00Z'));
  });

  test('should default status to "waiting"', () => {
    const offer = new RideOffer(validOffer);
    expect(offer.status).toBe('waiting');
  });

  test('should accept valid status values', () => {
    const statuses = ['waiting', 'ongoing', 'completed', 'cancelled'];

    statuses.forEach((status) => {
      const offer = new RideOffer({ ...validOffer, status });
      expect(offer.status).toBe(status);
    });
  });

  test('should reject invalid status values', () => {
    const offer = new RideOffer({ ...validOffer, status: 'invalid_status' });
    const error = offer.validateSync();
    expect(error).toBeDefined();
    expect(error.errors.status).toBeDefined();
  });

  test('should fail validation without source name', () => {
    const offer = new RideOffer({
      ...validOffer,
      source: { lat: 28.6315, lng: 77.2167 },
    });
    const error = offer.validateSync();
    expect(error).toBeDefined();
    expect(error.errors['source.name']).toBeDefined();
  });

  test('should fail validation without destination coordinates', () => {
    const offer = new RideOffer({
      ...validOffer,
      destination: { name: 'Noida' },
    });
    const error = offer.validateSync();
    expect(error).toBeDefined();
  });

  test('should fail validation without driverId', () => {
    const { driverId, ...noDriver } = validOffer;
    const offer = new RideOffer(noDriver);
    const error = offer.validateSync();
    expect(error).toBeDefined();
    expect(error.errors.driverId).toBeDefined();
  });

  test('should fail validation without departureTime', () => {
    const { departureTime, ...noTime } = validOffer;
    const offer = new RideOffer(noTime);
    const error = offer.validateSync();
    expect(error).toBeDefined();
    expect(error.errors.departureTime).toBeDefined();
  });

  test('should enforce minimum seats of 0', () => {
    const offer = new RideOffer({ ...validOffer, seatsAvailable: -1 });
    const error = offer.validateSync();
    expect(error).toBeDefined();
    expect(error.errors.seatsAvailable).toBeDefined();
  });

  test('should have timestamps enabled', () => {
    const schema = RideOffer.schema;
    expect(schema.options.timestamps).toBe(true);
  });
});
