import { WebRTCService } from '../../services/WebRTCService';

describe('WebRTCService', () => {
  let service: WebRTCService;
  let mockPeerConnection: any;
  let mockStream: any;

  beforeEach(() => {
    service = new WebRTCService();
    
    mockPeerConnection = {
      createOffer: jest.fn().mockResolvedValue({ type: 'offer' }),
      createAnswer: jest.fn().mockResolvedValue({ type: 'answer' }),
      setLocalDescription: jest.fn().mockResolvedValue(undefined),
      setRemoteDescription: jest.fn().mockResolvedValue(undefined),
      addIceCandidate: jest.fn().mockResolvedValue(undefined),
      addTrack: jest.fn(),
      close: jest.fn()
    };

    mockStream = {
      getTracks: jest.fn().mockReturnValue([
        { kind: 'audio' },
        { kind: 'video' }
      ])
    };

    (global.RTCPeerConnection as jest.Mock).mockReturnValue(mockPeerConnection);
    (navigator.mediaDevices.getUserMedia as jest.Mock).mockResolvedValue(mockStream);
  });

  describe('getUserMedia', () => {
    it('should get user media successfully', async () => {
      const result = await service.getUserMedia();
      
      expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalled();
      expect(result).toBe(mockStream);
    });

    it('should throw error when getUserMedia fails', async () => {
      const error = new Error('Permission denied');
      (navigator.mediaDevices.getUserMedia as jest.Mock).mockRejectedValue(error);

      await expect(service.getUserMedia()).rejects.toThrow('Failed to access camera/microphone. Please grant permissions.');
    });
  });

  describe('createPeerConnection', () => {
    it('should create a new peer connection', () => {
      const pc = service.createPeerConnection();
      
      expect(RTCPeerConnection).toHaveBeenCalled();
      expect(pc).toBe(mockPeerConnection);
    });
  });

  describe('addLocalStreamToPeer', () => {
    it('should add all tracks to peer connection', () => {
      service.addLocalStreamToPeer(mockPeerConnection, mockStream);
      
      expect(mockStream.getTracks).toHaveBeenCalled();
      expect(mockPeerConnection.addTrack).toHaveBeenCalledTimes(2);
    });
  });

  describe('createOffer', () => {
    it('should create and set local description', async () => {
      const offer = await service.createOffer(mockPeerConnection);
      
      expect(mockPeerConnection.createOffer).toHaveBeenCalled();
      expect(mockPeerConnection.setLocalDescription).toHaveBeenCalledWith({ type: 'offer' });
      expect(offer).toEqual({ type: 'offer' });
    });
  });

  describe('createAnswer', () => {
    it('should create answer and set descriptions', async () => {
      const offer = { type: 'offer', sdp: 'test-sdp' };
      
      const answer = await service.createAnswer(mockPeerConnection, offer);
      
      expect(mockPeerConnection.setRemoteDescription).toHaveBeenCalled();
      expect(mockPeerConnection.createAnswer).toHaveBeenCalled();
      expect(mockPeerConnection.setLocalDescription).toHaveBeenCalledWith({ type: 'answer' });
      expect(answer).toEqual({ type: 'answer' });
    });
  });

  describe('setRemoteAnswer', () => {
    it('should set remote description', async () => {
      const answer = { type: 'answer', sdp: 'test-sdp' };
      
      await service.setRemoteAnswer(mockPeerConnection, answer);
      
      expect(mockPeerConnection.setRemoteDescription).toHaveBeenCalled();
    });
  });

  describe('addIceCandidate', () => {
    it('should add ICE candidate', async () => {
      const candidate = { candidate: 'test-candidate' };
      
      await service.addIceCandidate(mockPeerConnection, candidate);
      
      expect(mockPeerConnection.addIceCandidate).toHaveBeenCalled();
    });
  });

  describe('cleanup', () => {
    it('should close peer connection', () => {
      service.cleanup(mockPeerConnection);
      
      expect(mockPeerConnection.close).toHaveBeenCalled();
    });

    it('should handle undefined peer connection', () => {
      expect(() => service.cleanup()).not.toThrow();
    });
  });
});