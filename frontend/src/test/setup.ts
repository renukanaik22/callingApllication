import '@testing-library/jest-dom';

// Mock WebRTC APIs
global.RTCPeerConnection = jest.fn().mockImplementation(() => ({
  createOffer: jest.fn().mockResolvedValue({}),
  createAnswer: jest.fn().mockResolvedValue({}),
  setLocalDescription: jest.fn().mockResolvedValue(undefined),
  setRemoteDescription: jest.fn().mockResolvedValue(undefined),
  addIceCandidate: jest.fn().mockResolvedValue(undefined),
  addTrack: jest.fn(),
  close: jest.fn(),
  getSenders: jest.fn().mockReturnValue([]),
  ontrack: null,
  onicecandidate: null,
  onconnectionstatechange: null,
  onicegatheringstatechange: null,
  connectionState: 'new',
  iceGatheringState: 'new'
}));

global.RTCSessionDescription = jest.fn().mockImplementation((init) => init);
global.RTCIceCandidate = jest.fn().mockImplementation((init) => init);

global.MediaStream = jest.fn().mockImplementation(() => ({
  getTracks: jest.fn().mockReturnValue([]),
  getAudioTracks: jest.fn().mockReturnValue([]),
  getVideoTracks: jest.fn().mockReturnValue([])
}));

// Mock navigator.mediaDevices
Object.defineProperty(navigator, 'mediaDevices', {
  writable: true,
  value: {
    getUserMedia: jest.fn().mockResolvedValue(new MediaStream())
  }
});

// Mock window.location.reload
Object.defineProperty(window, 'location', {
  writable: true,
  value: {
    reload: jest.fn()
  }
});