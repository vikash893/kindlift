/**
 * @fileoverview Unit tests for RideRequest model schema validation
 *
 * Tests the ride request schema including status lifecycle,
 * completion code, and rating flag tracking.
 */

const mongoose = require('mongoose');
const { RideRequest } = require('../../models/RideRequest');

describe('RideRequest Model', () => {
  const validRequest = {
    passengerId: new mongoose.Types.ObjectId(),
    offerId: new mongoose.Types.ObjectId(),
    seatsRequested: 2,
    source: { name: 'Saket, Delhi', lat: 28.5244, lng: 77.2066 },
    destination: { name: 'Sector 62, Noida', lat: 28.6270, lng: 77.3650 },
  };

  test('should create a valid ride request', () => {
    const request = new RideRequest(validRequest);

    expect(request.passengerId).toEqual(validRequest.passengerId);
    expect(request.offerId).toEqual(validRequest.offerId);
    expect(request.seatsRequested).toBe(2);
    expect(request.source.name).toBe('Saket, Delhi');
  });

  test('should default status to "pending"', () => {
    const request = new RideRequest(validRequest);
    expect(request.status).toBe('pending');
  });

  test('should default rating flags to false', () => {
    const request = new RideRequest(validRequest);
    expect(request.isRatedByPassenger).toBe(false);
    expect(request.isRatedByDriver).toBe(false);
  });

  test('should accept all valid status values', () => {
    const statuses = ['pending', 'accepted', 'rejected', 'completed'];

    statuses.forEach((status) => {
      const request = new RideRequest({ ...validRequest, status });
      expect(request.status).toBe(status);
    });
  });

  test('should reject invalid status values', () => {
    const request = new RideRequest({ ...validRequest, status: 'unknown' });
    const error = request.validateSync();
    expect(error).toBeDefined();
    expect(error.errors.status).toBeDefined();
  });

  test('should enforce minimum seatsRequested of 1', () => {
    const request = new RideRequest({ ...validRequest, seatsRequested: 0 });
    const error = request.validateSync();
    expect(error).toBeDefined();
    expect(error.errors.seatsRequested).toBeDefined();
  });

  test('should fail validation without passengerId', () => {
    const { passengerId, ...noPassenger } = validRequest;
    const request = new RideRequest(noPassenger);
    const error = request.validateSync();
    expect(error).toBeDefined();
    expect(error.errors.passengerId).toBeDefined();
  });

  test('should fail validation without offerId', () => {
    const { offerId, ...noOffer } = validRequest;
    const request = new RideRequest(noOffer);
    const error = request.validateSync();
    expect(error).toBeDefined();
    expect(error.errors.offerId).toBeDefined();
  });

  test('should accept a completion code', () => {
    const request = new RideRequest({
      ...validRequest,
      completionCode: '4567',
    });
    expect(request.completionCode).toBe('4567');
  });

  test('should track rating flags independently', () => {
    const request = new RideRequest({
      ...validRequest,
      isRatedByPassenger: true,
      isRatedByDriver: false,
    });

    expect(request.isRatedByPassenger).toBe(true);
    expect(request.isRatedByDriver).toBe(false);
  });

  test('should have timestamps enabled', () => {
    const schema = RideRequest.schema;
    expect(schema.options.timestamps).toBe(true);
  });
});
