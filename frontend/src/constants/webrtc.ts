import { ICEServerConfig, MediaConstraints } from '../interfaces/webrtc';

const getSocketUrl = (): string => {
  // Production: Use environment variable or deployed backend
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_SOCKET_URL || 'https://your-backend.onrender.com';
  }
  return 'http://localhost:3001';
};

export const SOCKET_URL = getSocketUrl();

export const ICE_SERVERS: ICEServerConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' }
  ]
};

export const MEDIA_CONSTRAINTS: MediaConstraints = {
  video: true,
  audio: true
};

export const ROOM_ID_LENGTH = 8;

export const COPY_TIMEOUT = 2000;