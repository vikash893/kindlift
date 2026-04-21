import { io } from 'socket.io-client';

// Auto-detect environment for socket connection
const getSocketURL = () => {
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8000';
  }
  
  // Local network testing on mobile
  if (hostname.startsWith('192.168.') || hostname.startsWith('10.') || hostname.startsWith('172.')) {
    return `http://${hostname}:8000`;
  }
  
  return 'https://kindlift-1.onrender.com';
};

export const socket = io(getSocketURL(), {
  autoConnect: false,
  transports: ['websocket', 'polling'], // fallback to polling if websocket fails
});