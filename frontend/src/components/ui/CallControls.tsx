import React, { useEffect } from 'react';
import { useMediaControls } from '../../hooks/useMediaControls';
import { Button } from './Button';

interface CallControlsProps {
  localStream: MediaStream | null;
  onEndCall: () => void;
  onVideoStateChange?: (isVideoOff: boolean) => void;
}

export const CallControls: React.FC<CallControlsProps> = ({ 
  localStream, 
  onEndCall,
  onVideoStateChange
}) => {
  const { isMuted, isVideoOff, toggleMute, toggleVideo } = useMediaControls(localStream);

  useEffect(() => {
    onVideoStateChange?.(isVideoOff);
  }, [isVideoOff, onVideoStateChange]);

  return (
    <div className="controls-bar">
      <Button
        variant={isMuted ? 'danger' : 'secondary'}
        onClick={toggleMute}
        title={isMuted ? 'Unmute' : 'Mute'}
        className="control-btn mute-btn"
      >
        {isMuted ? '🔇' : '🎤'}
      </Button>
      
      <Button
        variant={isVideoOff ? 'danger' : 'secondary'}
        onClick={toggleVideo}
        title={isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
        className="control-btn video-btn"
      >
        {isVideoOff ? '📹' : '📷'}
      </Button>
      
      <Button
        variant="danger"
        onClick={onEndCall}
        title="End Call"
        className="control-btn end-btn"
      >
        ❌
      </Button>
    </div>
  );
};