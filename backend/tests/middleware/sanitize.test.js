/**
 * @fileoverview Unit tests for XSS sanitization middleware
 *
 * Tests that HTML tags, script injections, and XSS payloads are
 * properly stripped from request body, query, and params.
 */

const { sanitizeValue, sanitizeInput } = require('../../middleware/sanitize');

describe('sanitizeValue', () => {
  test('should strip script tags', () => {
    const result = sanitizeValue('<script>alert("xss")</script>');
    expect(result).not.toContain('<script>');
    expect(result).not.toContain('</script>');
  });

  test('should strip HTML tags', () => {
    const result = sanitizeValue('<b>bold</b> <i>italic</i>');
    expect(result).not.toContain('<b>');
    expect(result).not.toContain('<i>');
  });

  test('should preserve plain text', () => {
    const result = sanitizeValue('Hello World 123');
    expect(result).toBe('Hello World 123');
  });

  test('should handle nested objects', () => {
    const input = {
      name: '<script>hack</script>John',
      address: {
        city: '<b>Delhi</b>',
        lat: 28.6315,
      },
    };
    const result = sanitizeValue(input);
    expect(result.name).not.toContain('<script>');
    expect(result.address.city).not.toContain('<b>');
    expect(result.address.lat).toBe(28.6315); // Numbers unchanged
  });

  test('should handle arrays', () => {
    const input = ['<img src=x onerror=alert(1)>', 'safe text'];
    const result = sanitizeValue(input);
    expect(result[0]).not.toContain('<img');
    expect(result[1]).toBe('safe text');
  });

  test('should pass through numbers', () => {
    expect(sanitizeValue(42)).toBe(42);
    expect(sanitizeValue(3.14)).toBe(3.14);
  });

  test('should pass through booleans', () => {
    expect(sanitizeValue(true)).toBe(true);
    expect(sanitizeValue(false)).toBe(false);
  });

  test('should pass through null and undefined', () => {
    expect(sanitizeValue(null)).toBe(null);
    expect(sanitizeValue(undefined)).toBe(undefined);
  });

  test('should strip event handlers', () => {
    const result = sanitizeValue('<div onmouseover="alert(1)">hover</div>');
    expect(result).not.toContain('onmouseover');
  });

  test('should strip style tags', () => {
    const result = sanitizeValue('<style>body{display:none}</style>content');
    expect(result).not.toContain('<style>');
    expect(result).toContain('content');
  });
});

describe('sanitizeInput middleware', () => {
  test('should sanitize req.body', () => {
    const req = {
      body: { name: '<script>alert("xss")</script>John' },
      query: {},
      params: {},
    };
    const res = {};
    const next = jest.fn();

    sanitizeInput(req, res, next);

    expect(req.body.name).not.toContain('<script>');
    expect(next).toHaveBeenCalled();
  });

  test('should sanitize req.query', () => {
    const req = {
      body: {},
      query: { search: '<img src=x onerror=alert(1)>' },
      params: {},
    };
    const res = {};
    const next = jest.fn();

    sanitizeInput(req, res, next);

    expect(req.query.search).not.toContain('<img');
    expect(next).toHaveBeenCalled();
  });

  test('should sanitize req.params', () => {
    const req = {
      body: {},
      query: {},
      params: { id: '<script>document.cookie</script>' },
    };
    const res = {};
    const next = jest.fn();

    sanitizeInput(req, res, next);

    expect(req.params.id).not.toContain('<script>');
    expect(next).toHaveBeenCalled();
  });

  test('should call next() always', () => {
    const req = { body: null, query: null, params: null };
    const res = {};
    const next = jest.fn();

    sanitizeInput(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
