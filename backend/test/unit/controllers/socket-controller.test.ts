import { describe, it, expect, beforeEach, vi } from 'vitest';
import {SocketController} from "../../../src/controllers/SocketController";
import {RoomService} from "../../../src/services/RoomService";
import {Logger} from "../../../src/utils/Logger";
import {Room} from "../../../src/models/Room";

describe('SocketController', () => {
  let socketController: SocketController;
  let mockRoomService: RoomService;
  let mockLogger: Logger;
  let mockSocket: any;

  beforeEach(() => {
    mockRoomService = {
      createRoom: vi.fn(),
      joinRoom: vi.fn(),
      findRoomByParticipant: vi.fn(),
      removeRoom: vi.fn(),
    } as any;

    mockLogger = {
      info: vi.fn(),
      error: vi.fn(),
    } as any;

    mockSocket = {
      id: 'test-socket-id',
      join: vi.fn(),
      emit: vi.fn(),
      to: vi.fn(() => ({ emit: vi.fn() })),
      on: vi.fn(),
    };

    socketController = new SocketController(mockRoomService, mockLogger);
  });

  describe('handleCreateRoom', () => {
    it('should create room successfully', () => {
      const room = new Room('test123', 'test-socket-id');
      vi.mocked(mockRoomService.createRoom).mockReturnValue(room);

      socketController['handleCreateRoom'](mockSocket, 'test123');

      expect(mockRoomService.createRoom).toHaveBeenCalledWith('test123', 'test-socket-id');
      expect(mockSocket.join).toHaveBeenCalledWith('test123');
      expect(mockSocket.emit).toHaveBeenCalledWith('room-created', 'test123');
      expect(mockLogger.info).toHaveBeenCalled();
    });

    it('should handle room already exists error', () => {
      vi.mocked(mockRoomService.createRoom).mockImplementation(() => {
        throw new Error('Room already exists');
      });

      socketController['handleCreateRoom'](mockSocket, 'test123');

      expect(mockSocket.emit).toHaveBeenCalledWith('room-exists');
    });

    it('should handle unexpected errors', () => {
      vi.mocked(mockRoomService.createRoom).mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      socketController['handleCreateRoom'](mockSocket, 'test123');

      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('handleJoinRoom', () => {
    it('should join room successfully', () => {
      socketController['handleJoinRoom'](mockSocket, 'test123');

      expect(mockSocket.join).toHaveBeenCalledWith('test123');
      expect(mockSocket.emit).toHaveBeenCalledWith('room-joined', 'test123');
      expect(mockLogger.info).toHaveBeenCalled();
    });
  });

  describe('handleOffer', () => {
    it('should relay offer to room', () => {
      const offerData = {
        roomId: 'test123',
        offer: { type: 'offer' as const, sdp: 'mock-sdp' }
      };

      socketController['handleOffer'](mockSocket, offerData);

      expect(mockSocket.to).toHaveBeenCalledWith('test123');
    });
  });

  describe('handleAnswer', () => {
    it('should relay answer to room', () => {
      const answerData = {
        roomId: 'test123',
        answer: { type: 'answer' as const, sdp: 'mock-sdp' }
      };

      socketController['handleAnswer'](mockSocket, answerData);

      expect(mockSocket.to).toHaveBeenCalledWith('test123');
    });
  });

  describe('handleIceCandidate', () => {
    it('should relay ICE candidate to room', () => {
      const candidateData = {
        roomId: 'test123',
        candidate: { candidate: 'mock-candidate', sdpMLineIndex: 0 }
      };

      socketController['handleIceCandidate'](mockSocket, candidateData);

      expect(mockSocket.to).toHaveBeenCalledWith('test123');
    });
  });

  describe('handleDisconnect', () => {
    it('should handle user disconnect and cleanup room', () => {
      const roomData = {
        room: new Room('test123', 'test-socket-id'),
        roomId: 'test123'
      };
      vi.mocked(mockRoomService.findRoomByParticipant).mockReturnValue(roomData);

      socketController['handleDisconnect'](mockSocket);

      expect(mockRoomService.findRoomByParticipant).toHaveBeenCalledWith('test-socket-id');
      expect(mockRoomService.removeRoom).toHaveBeenCalledWith('test123');
      expect(mockLogger.info).toHaveBeenCalledTimes(2);
    });

    it('should handle disconnect when user not in any room', () => {
      vi.mocked(mockRoomService.findRoomByParticipant).mockReturnValue(null);

      socketController['handleDisconnect'](mockSocket);

      expect(mockRoomService.removeRoom).not.toHaveBeenCalled();
    });
  });
});