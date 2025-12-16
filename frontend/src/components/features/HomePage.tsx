import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { generateRoomId } from '../../utils/room';
import './HomePage.css';

interface HomePageProps {
  onCreateRoom: (roomId: string) => void;
  onJoinRoom: (roomId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onCreateRoom, onJoinRoom }) => {
  const [joinRoomId, setJoinRoomId] = useState('');
  const [error, setError] = useState('');

  const handleCreateRoom = (): void => {
    const roomId = generateRoomId();
    onCreateRoom(roomId);
  };

  const handleJoinRoom = (): void => {
    const trimmedRoomId = joinRoomId.trim();
    
    if (!trimmedRoomId) {
      setError('Please enter a room ID');
      return;
    }

    if (trimmedRoomId.length < 6) {
      setError('Room ID must be at least 6 characters');
      return;
    }

    setError('');
    onJoinRoom(trimmedRoomId);
  };

  const handleRoomIdChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setJoinRoomId(e.target.value);
    if (error) setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleJoinRoom();
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>WebRTC Video Call</h1>
        
        <div className="action-section">
          <Button 
            variant="primary" 
            size="large" 
            onClick={handleCreateRoom}
            className="create-room-btn"
          >
            Create Room
          </Button>
        </div>

        <div className="divider">OR</div>

        <div className="action-section">
          <Input
            placeholder="Enter Room ID"
            value={joinRoomId}
            onChange={handleRoomIdChange}
            onKeyPress={handleKeyPress}
            error={error}
            className="room-input"
          />
          <Button 
            variant="secondary" 
            size="large" 
            onClick={handleJoinRoom}
            disabled={!joinRoomId.trim()}
            className="join-room-btn"
          >
            Join Room
          </Button>
        </div>

        <div className="instructions">
          <h3>Instructions:</h3>
          <ul>
            <li>Click "Create Room" to start a new video call</li>
            <li>Share the Room ID with another person</li>
            <li>They can join using "Join Room" with your Room ID</li>
            <li>Allow camera and microphone permissions when prompted</li>
          </ul>
        </div>
      </div>
    </div>
  );
};