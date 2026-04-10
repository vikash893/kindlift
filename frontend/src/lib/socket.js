import { io } from 'socket.io-client';

// Auto-detect environment for socket connection
const getSocketURL = () => {
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8000';
  }
  
  return 'https://kindlift-1.onrender.com';
};

export const socket = io(getSocketURL(), {
  autoConnect: false,
  transports: ['websocket', 'polling'], // fallback to polling if websocket fails
});