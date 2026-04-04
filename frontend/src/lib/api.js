import axios from 'axios';

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://kindlift-1.onrender.com/api'
    : 'http://localhost:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;