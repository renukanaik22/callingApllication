import { useState, useEffect, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { socketService } from '../services/SocketService';

interface UseSocketProps {
  roomId: string;
  isCreator: boolean;
  onRoomNotFound: () => void;
  onRoomFull: () => void;
  onUserDisconnected: () => void;
}

export const useSocket = ({ 
  roomId, 
  isCreator, 
  onRoomNotFound, 
  onRoomFull, 
  onUserDisconnected 
}: UseSocketProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    const socketInstance = socketService.connect();
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      setIsConnected(true);
      if (isCreator) {
        socketInstance.emit('create-room', roomId);
      } else {
        socketInstance.emit('join-room', roomId);
      }
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    socketInstance.on('room-not-found', onRoomNotFound);
    socketInstance.on('room-full', onRoomFull);
    socketInstance.on('user-disconnected', onUserDisconnected);
  }, [roomId, isCreator, onRoomNotFound, onRoomFull, onUserDisconnected]);

  const disconnect = useCallback(() => {
    socketService.disconnect();
    setSocket(null);
    setIsConnected(false);
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    socket,
    isConnected,
    disconnect
  };
};