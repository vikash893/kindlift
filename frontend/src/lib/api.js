import axios from 'axios';
import {
  getCached, setCache, invalidateRelated,
  getCacheKey, getInflight, setInflight, clearAllCache,
} from './apiCache';

// ─── Base URL Detection ─────────────────────────────
const getBaseURL = () => {
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8000/api';
  }
  return 'https://kindlift-1.onrender.com/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request Interceptor: Auth + Smart Caching ──────
api.interceptors.request.use((config) => {
  // Attach auth token
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Smart Cache: Serve GET requests from cache if available
  if (config.method === 'get') {
    const cached = getCached(config.url, config.params);
    if (cached) {
      // Return cached data by using a custom adapter that resolves immediately
      config.adapter = () =>
        Promise.resolve({
          data: cached,
          status: 200,
          statusText: 'OK (cached)',
          headers: {},
          config,
        });
      return config;
    }

    // Deduplication: If the same GET is already in-flight, reuse it
    const cacheKey = `${config.url}|${JSON.stringify(config.params || {})}`;
    const inflight = getInflight(cacheKey);
    if (inflight) {
      config._deduped = true;
      config.adapter = () => inflight;
      return config;
    }
  }

  return config;
});

// ─── Response Interceptor: Cache + Invalidation ─────
api.interceptors.response.use(
  (response) => {
    const { config } = response;
    const method = config.method;

    // Cache successful GET responses
    if (method === 'get' && response.status === 200 && !config._deduped) {
      setCache(config.url, config.params, response.data);
    }

    // Invalidate related caches on mutations
    if (['post', 'put', 'patch', 'delete'].includes(method)) {
      invalidateRelated(config.url);
    }

    return response;
  },
  (error) => {
    // Handle connection errors
    if (error.code === 'ERR_CONNECTION_REFUSED') {
      console.error('🔴 Backend down:', error.config?.baseURL);
    }

    // Clear token on auth failure
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        localStorage.removeItem('token');
      }
    }

    return Promise.reject(error);
  }
);

// ─── Inflight Request Tracking ──────────────────────
// Wrap original request to track inflight GETs for deduplication
const originalRequest = api.request.bind(api);
api.request = function (config) {
  if (config.method === 'get' || (!config.method && !config.data)) {
    const url = config.url;
    const cacheKey = `${url}|${JSON.stringify(config.params || {})}`;
    const existing = getInflight(cacheKey);
    if (existing) return existing;

    const promise = originalRequest(config);
    setInflight(cacheKey, promise);
    return promise;
  }
  return originalRequest(config);
};

// Export cache clearing for use on logout
export { clearAllCache };

export default api;