import axios from 'axios';

// Automatically detect environment:
// - In development (localhost), use localhost backend
// - In production (deployed), use the deployed backend URL
const getBaseURL = () => {
  const hostname = window.location.hostname;
  
  // If running locally
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8000/api';
  }
  
  // If deployed on Render or any other platform, use the backend URL
  return 'https://kindlift-1.onrender.com/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    // Ensure headers object exists
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
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