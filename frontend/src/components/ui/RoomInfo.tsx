import React, { useCallback } from 'react';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';
import { Button } from './Button';

interface RoomInfoProps {
  roomId: string;
}

export const RoomInfo: React.FC<RoomInfoProps> = ({ roomId }) => {
  const { copied, copyToClipboard } = useCopyToClipboard();

  const handleCopyRoomId = useCallback(() => {
    copyToClipboard(roomId);
  }, [copyToClipboard, roomId]);

  return (
    <div className="room-info">
      <span className="room-id">Room: {roomId}</span>
      <Button 
        size="small" 
        variant="secondary" 
        onClick={handleCopyRoomId}
        className="copy-btn"
      >
        {copied ? 'Copied!' : 'Copy'}
      </Button>
    </div>
  );
};