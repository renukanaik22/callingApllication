import { renderHook, act } from '@testing-library/react';
import { useMediaControls } from '../../hooks/useMediaControls';

describe('useMediaControls', () => {
  let mockAudioTrack: any;
  let mockVideoTrack: any;
  let mockStream: MediaStream;

  beforeEach(() => {
    mockAudioTrack = {
      enabled: true,
      kind: 'audio'
    };
    
    mockVideoTrack = {
      enabled: true,
      kind: 'video'
    };

    mockStream = {
      getAudioTracks: jest.fn().mockReturnValue([mockAudioTrack]),
      getVideoTracks: jest.fn().mockReturnValue([mockVideoTrack])
    } as unknown as MediaStream;
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useMediaControls(mockStream));
    
    expect(result.current.isMuted).toBe(false);
    expect(result.current.isVideoOff).toBe(false);
    expect(typeof result.current.toggleMute).toBe('function');
    expect(typeof result.current.toggleVideo).toBe('function');
  });

  it('should toggle mute state', () => {
    const { result } = renderHook(() => useMediaControls(mockStream));

    act(() => {
      result.current.toggleMute();
    });

    expect(mockAudioTrack.enabled).toBe(false);
    expect(result.current.isMuted).toBe(true);

    act(() => {
      result.current.toggleMute();
    });

    expect(mockAudioTrack.enabled).toBe(true);
    expect(result.current.isMuted).toBe(false);
  });

  it('should toggle video state', () => {
    const { result } = renderHook(() => useMediaControls(mockStream));

    act(() => {
      result.current.toggleVideo();
    });

    expect(mockVideoTrack.enabled).toBe(false);
    expect(result.current.isVideoOff).toBe(true);

    act(() => {
      result.current.toggleVideo();
    });

    expect(mockVideoTrack.enabled).toBe(true);
    expect(result.current.isVideoOff).toBe(false);
  });

  it('should handle null stream gracefully', () => {
    const { result } = renderHook(() => useMediaControls(null));

    act(() => {
      result.current.toggleMute();
      result.current.toggleVideo();
    });

    expect(result.current.isMuted).toBe(false);
    expect(result.current.isVideoOff).toBe(false);
  });

  it('should handle stream without tracks', () => {
    const emptyStream = {
      getAudioTracks: jest.fn().mockReturnValue([]),
      getVideoTracks: jest.fn().mockReturnValue([])
    } as unknown as MediaStream;

    const { result } = renderHook(() => useMediaControls(emptyStream));

    act(() => {
      result.current.toggleMute();
      result.current.toggleVideo();
    });

    expect(result.current.isMuted).toBe(false);
    expect(result.current.isVideoOff).toBe(false);
  });
});