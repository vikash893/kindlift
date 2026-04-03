import { io } from 'socket.io-client';

// Connect to the backend server on port 8000
export const socket = io('http://localhost:8000', {
  autoConnect: false,
  transports: ['websocket', 'polling'],
});