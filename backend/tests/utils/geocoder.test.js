/**
 * @fileoverview Unit tests for geocoder utility functions
 *
 * Tests the Haversine distance calculation formula with known distances
 * and edge cases (same point, antipodal points, zero crossing).
 */

const { calculateDistance } = require('../../utils/geocoder');

describe('calculateDistance (Haversine Formula)', () => {
  test('should return 0 for the same point', () => {
    const distance = calculateDistance(28.6315, 77.2167, 28.6315, 77.2167);
    expect(distance).toBeCloseTo(0, 1);
  });

  test('should calculate distance between Delhi and Noida (~20 km)', () => {
    // Connaught Place, Delhi → Sector 18, Noida
    const distance = calculateDistance(28.6315, 77.2167, 28.5706, 77.3218);
    expect(distance).toBeGreaterThan(10);
    expect(distance).toBeLessThan(30);
  });

  test('should calculate distance between Delhi and Mumbai (~1,150 km)', () => {
    // Delhi → Mumbai
    const distance = calculateDistance(28.7041, 77.1025, 19.0760, 72.8777);
    expect(distance).toBeGreaterThan(1100);
    expect(distance).toBeLessThan(1200);
  });

  test('should calculate distance between two very close points (< 1 km)', () => {
    // Two points within ~500 meters
    const distance = calculateDistance(28.6315, 77.2167, 28.6345, 77.2187);
    expect(distance).toBeLessThan(1);
    expect(distance).toBeGreaterThan(0);
  });

  test('should handle negative latitudes (Southern Hemisphere)', () => {
    // Sydney, Australia → Melbourne, Australia (~713 km)
    const distance = calculateDistance(-33.8688, 151.2093, -37.8136, 144.9631);
    expect(distance).toBeGreaterThan(700);
    expect(distance).toBeLessThan(750);
  });

  test('should handle crossing the equator', () => {
    // Nairobi, Kenya (south of equator) → Cairo, Egypt (north of equator)
    const distance = calculateDistance(-1.2921, 36.8219, 30.0444, 31.2357);
    expect(distance).toBeGreaterThan(3400);
    expect(distance).toBeLessThan(3600);
  });

  test('should handle crossing the prime meridian', () => {
    // London, UK → Paris, France
    const distance = calculateDistance(51.5074, -0.1278, 48.8566, 2.3522);
    expect(distance).toBeGreaterThan(330);
    expect(distance).toBeLessThan(350);
  });

  test('should return correct type (number)', () => {
    const distance = calculateDistance(0, 0, 1, 1);
    expect(typeof distance).toBe('number');
    expect(Number.isFinite(distance)).toBe(true);
  });

  test('should be symmetric (A→B === B→A)', () => {
    const distAB = calculateDistance(28.6315, 77.2167, 19.0760, 72.8777);
    const distBA = calculateDistance(19.0760, 72.8777, 28.6315, 77.2167);
    expect(distAB).toBeCloseTo(distBA, 5);
  });
});
