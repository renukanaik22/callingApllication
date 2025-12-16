import { generateRoomId, copyToClipboard } from '../../utils/room';

describe('room utils', () => {
  describe('generateRoomId', () => {
    it('should generate a room ID with correct length', () => {
      const roomId = generateRoomId();
      
      expect(roomId).toHaveLength(8);
      expect(typeof roomId).toBe('string');
    });

    it('should generate unique room IDs', () => {
      const roomId1 = generateRoomId();
      const roomId2 = generateRoomId();
      
      expect(roomId1).not.toBe(roomId2);
    });

    it('should only contain alphanumeric characters', () => {
      const roomId = generateRoomId();
      
      expect(roomId).toMatch(/^[a-z0-9]+$/);
    });
  });

  describe('copyToClipboard', () => {
    let mockWriteText: jest.Mock;

    beforeEach(() => {
      mockWriteText = jest.fn();
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText
        }
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should copy text to clipboard successfully', async () => {
      mockWriteText.mockResolvedValue(undefined);
      
      const result = await copyToClipboard('test text');
      
      expect(mockWriteText).toHaveBeenCalledWith('test text');
      expect(result).toBe(true);
    });

    it('should return false when clipboard API fails', async () => {
      mockWriteText.mockRejectedValue(new Error('Clipboard error'));
      
      const result = await copyToClipboard('test text');
      
      expect(result).toBe(false);
    });

    it('should return false when clipboard API is not available', async () => {
      Object.assign(navigator, { clipboard: undefined });
      
      const result = await copyToClipboard('test text');
      
      expect(result).toBe(false);
    });
  });
});