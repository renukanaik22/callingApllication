import React, { useState } from 'react';
import { HomePage } from './components/features/HomePage';
import { VideoCallPage } from './components/features/VideoCallPage';

type Page = 'home' | 'call';

interface AppState {
  currentPage: Page;
  roomId: string;
  isCreator: boolean;
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    currentPage: 'home',
    roomId: '',
    isCreator: false
  });

  const handleCreateRoom = (id: string): void => {
    setAppState({
      roomId: id,
      isCreator: true,
      currentPage: 'call'
    });
  };

  const handleJoinRoom = (id: string): void => {
    setAppState({
      roomId: id,
      isCreator: false,
      currentPage: 'call'
    });
  };

  const handleEndCall = (): void => {
    setAppState({
      currentPage: 'home',
      roomId: '',
      isCreator: false
    });
  };

  return (
    <>
      {appState.currentPage === 'home' && (
        <HomePage onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} />
      )}
      {appState.currentPage === 'call' && (
        <VideoCallPage 
          roomId={appState.roomId} 
          isCreator={appState.isCreator} 
          onEndCall={handleEndCall} 
        />
      )}
    </>
  );
};

export default App;
