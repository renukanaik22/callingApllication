import { renderHook, act } from '@testing-library/react';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';
import * as roomUtils from '../../utils/room';

jest.mock('../../utils/room');
const mockCopyUtil = roomUtils.copyToClipboard as jest.MockedFunction<typeof roomUtils.copyToClipboard>;

describe('useCopyToClipboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with copied as false', () => {
    const { result } = renderHook(() => useCopyToClipboard());
    
    expect(result.current.copied).toBe(false);
    expect(typeof result.current.copyToClipboard).toBe('function');
  });

  it('should set copied to true when copy succeeds', async () => {
    mockCopyUtil.mockResolvedValue(true);
    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      await result.current.copyToClipboard('test text');
    });

    expect(result.current.copied).toBe(true);
    expect(mockCopyUtil).toHaveBeenCalledWith('test text');
  });

  it('should reset copied to false after timeout', async () => {
    mockCopyUtil.mockResolvedValue(true);
    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      await result.current.copyToClipboard('test text');
    });

    expect(result.current.copied).toBe(true);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.copied).toBe(false);
  });

  it('should not set copied when copy fails', async () => {
    mockCopyUtil.mockResolvedValue(false);
    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      await result.current.copyToClipboard('test text');
    });

    expect(result.current.copied).toBe(false);
  });
});