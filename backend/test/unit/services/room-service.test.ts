import { describe, it, expect, beforeEach } from 'vitest';
import { RoomService } from '../../../src/services/RoomService';
import { Room } from '../../../src/models/Room';

describe('RoomService', () => {
  let roomService: RoomService;

  beforeEach(() => {
    roomService = new RoomService();
  });

  describe('createRoom', () => {
    it('should create room successfully', () => {
      const room = roomService.createRoom('test123', 'creator-id');

      expect(room).toBeInstanceOf(Room);
      expect(room.id).toBe('test123');
      expect(room.creator).toBe('creator-id');
      expect(room.joiner).toBeNull();
    });

    it('should throw error for duplicate room', () => {
      roomService.createRoom('duplicate123', 'creator-id');

      expect(() => {
        roomService.createRoom('duplicate123', 'another-creator');
      }).toThrow('Room already exists');
    });
  });

  describe('joinRoom', () => {
    it('should join existing room successfully', () => {
      roomService.createRoom('join123', 'creator-id');
      
      const room = roomService.joinRoom('join123', 'joiner-id');

      expect(room.joiner).toBe('joiner-id');
      expect(room.isFull()).toBe(true);
    });

    it('should throw error for non-existent room', () => {
      expect(() => {
        roomService.joinRoom('nonexistent', 'joiner-id');
      }).toThrow('Room not found');
    });

    it('should throw error for full room', () => {
      roomService.createRoom('full123', 'creator-id');
      roomService.joinRoom('full123', 'first-joiner');

      expect(() => {
        roomService.joinRoom('full123', 'second-joiner');
      }).toThrow('Room is full');
    });
  });

  describe('getRoom', () => {
    it('should return existing room', () => {
      roomService.createRoom('get123', 'creator-id');
      
      const room = roomService.getRoom('get123');

      expect(room).toBeDefined();
      expect(room?.id).toBe('get123');
    });

    it('should return undefined for non-existent room', () => {
      const room = roomService.getRoom('nonexistent');
      
      expect(room).toBeUndefined();
    });
  });

  describe('removeRoom', () => {
    it('should remove existing room', () => {
      roomService.createRoom('remove123', 'creator-id');
      expect(roomService.getRoom('remove123')).toBeDefined();

      roomService.removeRoom('remove123');
      
      expect(roomService.getRoom('remove123')).toBeUndefined();
    });
  });

  describe('findRoomByParticipant', () => {
    it('should find room by creator', () => {
      roomService.createRoom('find123', 'creator-id');
      
      const result = roomService.findRoomByParticipant('creator-id');

      expect(result).toBeDefined();
      expect(result?.roomId).toBe('find123');
      expect(result?.room.creator).toBe('creator-id');
    });

    it('should find room by joiner', () => {
      roomService.createRoom('find456', 'creator-id');
      roomService.joinRoom('find456', 'joiner-id');
      
      const result = roomService.findRoomByParticipant('joiner-id');

      expect(result).toBeDefined();
      expect(result?.roomId).toBe('find456');
      expect(result?.room.joiner).toBe('joiner-id');
    });

    it('should return null for non-participant', () => {
      const result = roomService.findRoomByParticipant('non-participant');
      
      expect(result).toBeNull();
    });
  });

  describe('getRoomCount', () => {
    it('should return correct room count', () => {
      expect(roomService.getRoomCount()).toBe(0);

      roomService.createRoom('room1', 'creator1');
      expect(roomService.getRoomCount()).toBe(1);

      roomService.createRoom('room2', 'creator2');
      expect(roomService.getRoomCount()).toBe(2);

      roomService.removeRoom('room1');
      expect(roomService.getRoomCount()).toBe(1);
    });
  });
});