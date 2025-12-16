// Room management types
export interface Room {
  creator: string;
  joiner: string | null;
}

// WebRTC signaling message types
export interface OfferMessage {
  roomId: string;
  offer: RTCSessionDescriptionInit;
}

export interface AnswerMessage {
  roomId: string;
  answer: RTCSessionDescriptionInit;
}

export interface IceCandidateMessage {
  roomId: string;
  candidate: RTCIceCandidateInit;
}

// Socket event types
export interface ServerToClientEvents {
  'room-created': (roomId: string) => void;
  'room-joined': (roomId: string) => void;
  'room-exists': () => void;
  'room-not-found': () => void;
  'room-full': () => void;
  'user-joined': (socketId: string) => void;
  'user-disconnected': () => void;
  'offer': (offer: RTCSessionDescriptionInit) => void;
  'answer': (answer: RTCSessionDescriptionInit) => void;
  'ice-candidate': (candidate: RTCIceCandidateInit) => void;
}

export interface ClientToServerEvents {
  'create-room': (roomId: string) => void;
  'join-room': (roomId: string) => void;
  'offer': (data: OfferMessage) => void;
  'answer': (data: AnswerMessage) => void;
  'ice-candidate': (data: IceCandidateMessage) => void;
}