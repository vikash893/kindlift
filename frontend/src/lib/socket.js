import { io } from 'socket.io-client';

// In development, it connects to the same host/port
export const socket = io('/', {
  autoConnect: false,
});