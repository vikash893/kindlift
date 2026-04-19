/**
 * API Smart Cache — Deduplication + TTL-based response caching
 * 
 * Features:
 * 1. Deduplicates concurrent identical GET requests (inflight merging)
 * 2. Caches GET responses with configurable TTL per endpoint
 * 3. Cache invalidation on mutations (POST/PUT/DELETE)
 * 4. Manual invalidation API for components
 */

// Cache store: { key: { data, timestamp, ttl } }
const cache = new Map();

// Inflight request store: { key: Promise }
const inflight = new Map();

// Default TTL (ms) per route pattern
const TTL_CONFIG = {
  '/auth/me': 5 * 60 * 1000,           // 5 min — user profile rarely changes mid-session
  '/rides/my-offers': 30 * 1000,        // 30s — dashboard offers
  '/requests/incoming': 15 * 1000,      // 15s — incoming requests (needs to be fresh)
  '/requests/my-requests': 30 * 1000,   // 30s — my requests
  '/saved-rides': 60 * 1000,            // 60s — saved rides
  '/admin/stats': 60 * 1000,            // 60s — admin dashboard stats
  '/admin/users': 30 * 1000,            // 30s — admin user list
  '/admin/rides': 30 * 1000,            // 30s — admin rides
  '/admin/requests': 30 * 1000,         // 30s — admin requests
  '/admin/ratings': 30 * 1000,          // 30s — admin ratings
  '/ratings/user/': 60 * 1000,          // 60s — user ratings
};

/**
 * Get TTL for a given URL
 */
function getTTL(url) {
  for (const [pattern, ttl] of Object.entries(TTL_CONFIG)) {
    if (url.includes(pattern)) return ttl;
  }
  return 0; // No cache by default
}

/**
 * Generate cache key from URL + params
 */
export function getCacheKey(url, params) {
  const paramStr = params ? JSON.stringify(params) : '';
  return `${url}|${paramStr}`;
}

/**
 * Get cached response if still valid
 */
export function getCached(url, params) {
  const key = getCacheKey(url, params);
  const entry = cache.get(key);
  if (!entry) return null;
  
  const age = Date.now() - entry.timestamp;
  if (age > entry.ttl) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

/**
 * Store response in cache
 */
export function setCache(url, params, data) {
  const ttl = getTTL(url);
  if (ttl <= 0) return;
  
  const key = getCacheKey(url, params);
  cache.set(key, { data, timestamp: Date.now(), ttl });
}

/**
 * Invalidate cache entries matching a pattern
 * Called automatically on POST/PUT/DELETE
 */
export function invalidateCache(urlPattern) {
  for (const [key] of cache) {
    if (key.includes(urlPattern)) {
      cache.delete(key);
    }
  }
}

/**
 * Invalidate related caches based on mutation URL
 * e.g., PUT /requests/:id/status should invalidate /requests/* and /rides/*
 */
export function invalidateRelated(url) {
  if (url.includes('/requests')) {
    invalidateCache('/requests');
    invalidateCache('/rides');
    invalidateCache('/admin/stats');
  }
  if (url.includes('/rides')) {
    invalidateCache('/rides');
    invalidateCache('/admin/stats');
  }
  if (url.includes('/ratings')) {
    invalidateCache('/ratings');
    invalidateCache('/admin/stats');
  }
  if (url.includes('/users') || url.includes('/auth/update-profile')) {
    invalidateCache('/users');
    invalidateCache('/auth/me');
    invalidateCache('/admin/stats');
  }
  if (url.includes('/saved-rides')) {
    invalidateCache('/saved-rides');
  }
}

/**
 * Deduplicate inflight GET requests
 * If the same GET is already in-flight, return the existing promise
 */
export function getInflight(key) {
  return inflight.get(key) || null;
}

export function setInflight(key, promise) {
  inflight.set(key, promise);
  // Clean up after resolution
  promise.finally(() => inflight.delete(key));
}

/**
 * Clear entire cache (useful on logout)
 */
export function clearAllCache() {
  cache.clear();
  inflight.clear();
}

/**
 * Get cache stats for debugging
 */
export function getCacheStats() {
  return {
    entries: cache.size,
    inflight: inflight.size,
    keys: [...cache.keys()],
  };
}
