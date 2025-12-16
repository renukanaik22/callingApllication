import { render, screen, fireEvent } from '@testing-library/react';
import { CallControls } from '../../components/ui/CallControls';
import * as useMediaControlsHook from '../../hooks/useMediaControls';

jest.mock('../../hooks/useMediaControls');
const mockUseMediaControls = useMediaControlsHook.useMediaControls as jest.MockedFunction<typeof useMediaControlsHook.useMediaControls>;

describe('CallControls', () => {
  const mockOnEndCall = jest.fn();
  const mockOnVideoStateChange = jest.fn();
  const mockToggleMute = jest.fn();
  const mockToggleVideo = jest.fn();
  const mockStream = {} as MediaStream;

  beforeEach(() => {
    mockUseMediaControls.mockReturnValue({
      isMuted: false,
      isVideoOff: false,
      toggleMute: mockToggleMute,
      toggleVideo: mockToggleVideo
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render all control buttons', () => {
    render(
      <CallControls 
        localStream={mockStream} 
        onEndCall={mockOnEndCall}
        onVideoStateChange={mockOnVideoStateChange}
      />
    );
    
    expect(screen.getByTitle('Mute')).toBeInTheDocument();
    expect(screen.getByTitle('Turn Video Off')).toBeInTheDocument();
    expect(screen.getByTitle('End Call')).toBeInTheDocument();
  });

  it('should call toggleMute when mute button is clicked', () => {
    render(
      <CallControls 
        localStream={mockStream} 
        onEndCall={mockOnEndCall}
      />
    );
    
    const muteButton = screen.getByTitle('Mute');
    fireEvent.click(muteButton);
    
    expect(mockToggleMute).toHaveBeenCalled();
  });

  it('should call toggleVideo when video button is clicked', () => {
    render(
      <CallControls 
        localStream={mockStream} 
        onEndCall={mockOnEndCall}
      />
    );
    
    const videoButton = screen.getByTitle('Turn Video Off');
    fireEvent.click(videoButton);
    
    expect(mockToggleVideo).toHaveBeenCalled();
  });

  it('should call onEndCall when end call button is clicked', () => {
    render(
      <CallControls 
        localStream={mockStream} 
        onEndCall={mockOnEndCall}
      />
    );
    
    const endCallButton = screen.getByTitle('End Call');
    fireEvent.click(endCallButton);
    
    expect(mockOnEndCall).toHaveBeenCalled();
  });

  it('should show muted state correctly', () => {
    mockUseMediaControls.mockReturnValue({
      isMuted: true,
      isVideoOff: false,
      toggleMute: mockToggleMute,
      toggleVideo: mockToggleVideo
    });

    render(
      <CallControls 
        localStream={mockStream} 
        onEndCall={mockOnEndCall}
      />
    );
    
    expect(screen.getByTitle('Unmute')).toBeInTheDocument();
    expect(screen.getByText('🔇')).toBeInTheDocument();
  });

  it('should show video off state correctly', () => {
    mockUseMediaControls.mockReturnValue({
      isMuted: false,
      isVideoOff: true,
      toggleMute: mockToggleMute,
      toggleVideo: mockToggleVideo
    });

    render(
      <CallControls 
        localStream={mockStream} 
        onEndCall={mockOnEndCall}
      />
    );
    
    expect(screen.getByTitle('Turn Video On')).toBeInTheDocument();
    expect(screen.getByText('📹')).toBeInTheDocument();
  });

  it('should call onVideoStateChange when video state changes', () => {
    const { rerender } = render(
      <CallControls 
        localStream={mockStream} 
        onEndCall={mockOnEndCall}
        onVideoStateChange={mockOnVideoStateChange}
      />
    );

    expect(mockOnVideoStateChange).toHaveBeenCalledWith(false);

    mockUseMediaControls.mockReturnValue({
      isMuted: false,
      isVideoOff: true,
      toggleMute: mockToggleMute,
      toggleVideo: mockToggleVideo
    });

    rerender(
      <CallControls 
        localStream={mockStream} 
        onEndCall={mockOnEndCall}
        onVideoStateChange={mockOnVideoStateChange}
      />
    );

    expect(mockOnVideoStateChange).toHaveBeenCalledWith(true);
  });
});