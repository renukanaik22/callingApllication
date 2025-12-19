export interface MediaConstraints {
  video: boolean;
  audio: boolean;
}

export interface ICEServerConfig {
  iceServers: RTCIceServer[];
}

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

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'failed';

export interface MediaControls {
  isMuted: boolean;
  isVideoOff: boolean;
  toggleMute: () => void;
  toggleVideo: () => void;
}