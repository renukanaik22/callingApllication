import { useState, useEffect, useRef, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { ConnectionStatus } from '../interfaces/webrtc';
import { webRTCService } from '../services/WebRTCService';

interface UseWebRTCCallProps {
  socket: Socket | null;
  roomId: string;
  onError: (error: string) => void;
}

export const useWebRTCCall = ({ socket, roomId, onError }: UseWebRTCCallProps) => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  
  const mediaReadyRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const initializeMedia = useCallback(async () => {
    if (mediaReadyRef.current) {
      console.log('⚠️ Media already initialized, skipping...');
      return;
    }
    try {
      const stream = await webRTCService.getUserMedia();
      mediaReadyRef.current = stream;
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to access media devices');
    }
  }, [onError]);

  const setupPeerConnection = useCallback(() => {
    const pc = webRTCService.createPeerConnection();
    const stream = mediaReadyRef.current || localStream;
    if (stream) {
      webRTCService.addLocalStreamToPeer(pc, stream);
    } else {
      console.warn('⚠️ No local stream when setting up peer connection!');
    }

    pc.ontrack = (event) => {
      const [stream] = event.streams;
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
      setConnectionStatus('connected');
    };
    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('ice-candidate', { roomId, candidate: event.candidate });
      } else {
        console.log('🏁 ICE gathering complete');
      }
    };
    pc.onconnectionstatechange = () => {
      setConnectionStatus(pc.connectionState as ConnectionStatus);
    };

    return pc;
  }, [localStream, socket, roomId]);

  const createOffer = useCallback(async () => {
    try {
      const pc = setupPeerConnection();
      await new Promise(resolve => setTimeout(resolve, 100));
      const offer = await webRTCService.createOffer(pc);
      peerConnectionRef.current = pc;
      socket?.emit('offer', { roomId, offer });
    } catch (error) {
      onError('Failed to create offer');
    }
  }, [setupPeerConnection, socket, roomId, onError]);

  const handleOffer = useCallback(async (offer: RTCSessionDescriptionInit) => {
    try {
      const pc = setupPeerConnection();
      await new Promise(resolve => setTimeout(resolve, 100));
      const answer = await webRTCService.createAnswer(pc, offer);
      peerConnectionRef.current = pc;
      socket?.emit('answer', { roomId, answer });
    } catch (error) {
      onError('Failed to handle offer');
    }
  }, [setupPeerConnection, socket, roomId, onError]);

  const handleAnswer = useCallback(async (answer: RTCSessionDescriptionInit) => {
    try {
      if (peerConnectionRef.current) {
        await webRTCService.setRemoteAnswer(peerConnectionRef.current, answer);
      }
    } catch (error) {
      onError('Failed to handle answer');
    }
  }, [onError]);

  const handleIceCandidate = useCallback(async (candidate: RTCIceCandidateInit) => {
    try {
      if (peerConnectionRef.current) {
        await webRTCService.addIceCandidate(peerConnectionRef.current, candidate);
      }
    } catch (error) {
      onError('Failed to add ICE candidate:');
    }
  }, []);

  useEffect(() => {
    initializeMedia();
    return () => {
      const stream = mediaReadyRef.current;
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
        });
      }
    };
  }, []); // Empty dependency - only run on mount

  useEffect(() => {
    if (!socket) return;
    const handleRoomJoined = () => {
      const tryCreateOffer = (attempt = 1) => {
        if (mediaReadyRef.current) {
          createOffer();
        } else if (attempt < 10) {
          setTimeout(() => tryCreateOffer(attempt + 1), 300);
        } else {
          onError(' Media still not ready after 10 retries');
        }
      };
      tryCreateOffer();
    };

    socket.on('room-created', () => setConnectionStatus('connected'));
    socket.on('room-joined', handleRoomJoined);
    socket.on('user-joined', () => setConnectionStatus('connected'));
    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('ice-candidate', handleIceCandidate);

    return () => {
      socket.off('room-created');
      socket.off('room-joined');
      socket.off('user-joined');
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
    };
  }, [socket, createOffer, handleOffer, handleAnswer, handleIceCandidate]);

  const cleanup = useCallback(() => {
    const refStream = mediaReadyRef.current;
    const stateStream = localStream;
    const videoElement = localVideoRef.current;
    
    if (refStream) {
      refStream.getTracks().forEach(track => {
        track.stop();
      });
    }
    
    if (stateStream && stateStream !== refStream) {
      stateStream.getTracks().forEach(track => {
        track.stop();
      });
    }
    
    if (videoElement && videoElement.srcObject) {
      const videoStream = videoElement.srcObject as MediaStream;
      videoStream.getTracks().forEach(track => {
        track.stop();
      });
      videoElement.srcObject = null;
    }
    
    if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
      const remoteStream = remoteVideoRef.current.srcObject as MediaStream;
      remoteStream.getTracks().forEach(track => {
        track.stop();
      });
      remoteVideoRef.current.srcObject = null;
    }
    webRTCService.cleanup(peerConnectionRef.current || undefined);
    peerConnectionRef.current = null;
    mediaReadyRef.current = null;
    setLocalStream(null);
    window.location.reload();
  }, [localStream]);

  return {
    connectionStatus,
    localStream,
    localVideoRef,
    remoteVideoRef,
    cleanup
  };
};