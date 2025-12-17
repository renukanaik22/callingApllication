import { ICEServerConfig, MediaConstraints } from '../interfaces/webrtc';

export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

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