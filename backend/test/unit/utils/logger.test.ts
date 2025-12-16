import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Logger } from '../../../src/utils/Logger.ts';

describe('Logger', () => {
  let logger: Logger;
  let consoleSpy: any;

  beforeEach(() => {
    logger = new Logger();
    consoleSpy = {
      log: vi.spyOn(console, 'log').mockImplementation(() => {}),
      error: vi.spyOn(console, 'error').mockImplementation(() => {}),
      warn: vi.spyOn(console, 'warn').mockImplementation(() => {})
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('info', () => {
    it('should log info message with timestamp', () => {
      const message = 'Test info message';
      
      logger.info(message);

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringMatching(/^\[INFO\] \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z - Test info message$/)
      );
    });
  });

  describe('error', () => {
    it('should log error message with timestamp', () => {
      const message = 'Test error message';
      
      logger.error(message);

      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringMatching(/^\[ERROR\] \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z - Test error message$/)
      );
    });
  });

  describe('warn', () => {
    it('should log warning message with timestamp', () => {
      const message = 'Test warning message';
      
      logger.warn(message);

      expect(consoleSpy.warn).toHaveBeenCalledWith(
        expect.stringMatching(/^\[WARN\] \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z - Test warning message$/)
      );
    });
  });
});