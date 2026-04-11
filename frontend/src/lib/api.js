import axios from 'axios';

// Automatically detect environment:
// - In development (localhost), use deployed backend
// - In production (deployed), use the deployed backend URL
const getBaseURL = () => {
  const hostname = window.location.hostname;
  
  // If running locally, use the local backend
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8000/api';
  }
  
  // Production — all deployed domains (kindlift.in, *.onrender.com, etc.)
  return 'https://kindlift-1.onrender.com/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 60000, // 60 second timeout for Render.com cold starts
  headers: {
    'Content-Type': 'application/json',
  },
});

// Log the base URL being used (for debugging)
console.log('🌐 API Base URL:', api.defaults.baseURL);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    // Ensure headers object exists
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Log outgoing requests
  console.log(`📤 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  
  return config;
});

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    console.log(`📥 ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    console.error('❌ API Error Details:', {
      message: error.message,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      status: error.response?.status,
      data: error.response?.data
    });
    
    // Handle connection refused errors
    if (error.code === 'ERR_CONNECTION_REFUSED') {
      console.error('🔴 Connection refused. Backend might be down at:', error.config?.baseURL);
    }
    
    // If token is expired/invalid, clear it
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      // Don't redirect if already on login/register
      if (currentPath !== '/login' && currentPath !== '/register') {
        localStorage.removeItem('token');
      }
    }
    return Promise.reject(error);
  }
);

export default api;