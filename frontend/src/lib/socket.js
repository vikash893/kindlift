import { io } from 'socket.io-client';

export const socket = io('https://kindlift-1.onrender.com', {
  autoConnect: false,
  transports: ['websocket'],
});