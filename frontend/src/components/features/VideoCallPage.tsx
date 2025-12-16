import React, { useState, useCallback } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { useWebRTCCall } from '../../hooks/useWebRTCCall';
import { Button } from '../ui/Button';
import { RoomInfo } from '../ui/RoomInfo';
import { CallControls } from '../ui/CallControls';
import './VideoCallPage.css';

interface VideoCallPageProps {
  roomId: string;
  isCreator: boolean;
  onEndCall: () => void;
}

export const VideoCallPage: React.FC<VideoCallPageProps> = ({ 
  roomId, 
  isCreator, 
  onEndCall 
}) => {
  const [error, setError] = useState<string>('');
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => {
      alert(errorMessage);
      onEndCall();
    }, 100);
  }, [onEndCall]);

  const handleRoomNotFound = useCallback(() => {
    handleError('Room not found!');
  }, [handleError]);

  const handleRoomFull = useCallback(() => {
    handleError('Room is full!');
  }, [handleError]);

  const handleUserDisconnected = useCallback(() => {
    setTimeout(onEndCall, 2000);
  }, [onEndCall]);

  const { socket } = useSocket({
    roomId,
    isCreator,
    onRoomNotFound: handleRoomNotFound,
    onRoomFull: handleRoomFull,
    onUserDisconnected: handleUserDisconnected
  });

  const {
    connectionStatus,
    localStream,
    localVideoRef,
    remoteVideoRef,
    cleanup
  } = useWebRTCCall({
    socket,
    roomId,
    onError: handleError
  });

  const handleEndCall = useCallback(() => {
    cleanup();
    onEndCall();
  }, [cleanup, onEndCall]);

  const handleVideoStateChange = useCallback((videoOff: boolean) => {
    setIsVideoOff(videoOff);
  }, []);

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h2>Connection Error</h2>
          <p>{error}</p>
          <Button onClick={onEndCall}>Return to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="call-container">
      <RoomInfo roomId={roomId} />
      
      <div className={`status status-${connectionStatus}`}>
        Status: {connectionStatus}
      </div>

      <div className="video-grid">
        <div className="video-wrapper local-video">
          <video 
            ref={localVideoRef} 
            autoPlay 
            muted 
            playsInline 
            className="video-element"
          />
          <div className="video-label">You</div>
          {isVideoOff && <div className="video-off-overlay">Video Off</div>}
        </div>
        
        <div className="video-wrapper remote-video">
          <video 
            ref={remoteVideoRef} 
            autoPlay 
            playsInline 
            className="video-element"
          />
          <div className="video-label">Remote</div>
          {connectionStatus !== 'connected' && (
            <div className="waiting-overlay">
              <div className="waiting-text">
                {connectionStatus === 'connecting' ? 'Connecting...' : 'Waiting for participant'}
              </div>
            </div>
          )}
        </div>
      </div>

      <CallControls 
        localStream={localStream} 
        onEndCall={handleEndCall}
        onVideoStateChange={handleVideoStateChange}
      />
    </div>
  );
};