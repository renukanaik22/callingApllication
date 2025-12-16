import { describe, it, expect } from 'vitest';
import {Room} from "../../../src/models/Room";

describe('Room', () => {
  describe('constructor', () => {
    it('should create room with correct properties', () => {
      const roomId = 'test123';
      const creatorId = 'creator-socket-id';

      const room = new Room(roomId, creatorId);

      expect(room.id).toBe(roomId);
      expect(room.creator).toBe(creatorId);
      expect(room.joiner).toBeNull();
    });

    it('should create room with joiner', () => {
      const room = new Room('test456', 'creator-id', 'joiner-id');

      expect(room.joiner).toBe('joiner-id');
    });
  });

  describe('addJoiner', () => {
    it('should add joiner successfully', () => {
      const room = new Room('test123', 'creator-id');
      
      room.addJoiner('joiner-id');

      expect(room.joiner).toBe('joiner-id');
    });

    it('should throw error when room is full', () => {
      const room = new Room('test123', 'creator-id', 'existing-joiner');

      expect(() => room.addJoiner('new-joiner')).toThrow('Room is already full');
    });
  });

  describe('isFull', () => {
    it('should return false for empty room', () => {
      const room = new Room('test123', 'creator-id');
      
      expect(room.isFull()).toBe(false);
    });

    it('should return true for full room', () => {
      const room = new Room('test123', 'creator-id', 'joiner-id');
      
      expect(room.isFull()).toBe(true);
    });
  });

  describe('hasParticipant', () => {
    it('should return true for creator', () => {
      const room = new Room('test123', 'creator-id');

      expect(room.hasParticipant('creator-id')).toBe(true);
    });

    it('should return true for joiner', () => {
      const room = new Room('test123', 'creator-id', 'joiner-id');

      expect(room.hasParticipant('joiner-id')).toBe(true);
    });

    it('should return false for non-participant', () => {
      const room = new Room('test123', 'creator-id');

      expect(room.hasParticipant('random-id')).toBe(false);
    });
  });

  describe('getOtherParticipant', () => {
    it('should return joiner when given creator', () => {
      const room = new Room('test123', 'creator-id', 'joiner-id');

      expect(room.getOtherParticipant('creator-id')).toBe('joiner-id');
    });

    it('should return creator when given joiner', () => {
      const room = new Room('test123', 'creator-id', 'joiner-id');

      expect(room.getOtherParticipant('joiner-id')).toBe('creator-id');
    });

    it('should return null for non-participant', () => {
      const room = new Room('test123', 'creator-id', 'joiner-id');

      expect(room.getOtherParticipant('random-id')).toBeNull();
    });

    it('should return null when no joiner exists', () => {
      const room = new Room('test123', 'creator-id');

      expect(room.getOtherParticipant('creator-id')).toBeNull();
    });
  });
});