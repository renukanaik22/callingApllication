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
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const mediaReadyRef = useRef<MediaStream | null>(null);

  const initializeMedia = useCallback(async () => {
    // Prevent multiple initializations
    if (mediaReadyRef.current) {
      console.log('⚠️ Media already initialized, skipping...');
      return;
    }
    
    try {
      console.log('📹 Getting user media...');
      const stream = await webRTCService.getUserMedia();
      console.log('✅ Media obtained, setting local stream:', stream);
      mediaReadyRef.current = stream;  // Set ref immediately
      setLocalStream(stream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        console.log('📺 Local video updated');
      }
    } catch (error) {
      console.error('❌ Media initialization failed:', error);
      onError(error instanceof Error ? error.message : 'Failed to access media devices');
    }
  }, [onError]);

  const setupPeerConnection = useCallback(() => {
    console.log('🔧 setupPeerConnection called');
    const pc = webRTCService.createPeerConnection();
    console.log('✅ Peer connection created:', pc);
    
    // CRITICAL: Add local stream FIRST, then set up handlers
    // Use ref stream for immediate access
    const stream = mediaReadyRef.current || localStream;
    if (stream) {
      console.log('📹 Adding local stream to peer connection');
      webRTCService.addLocalStreamToPeer(pc, stream);
    } else {
      console.warn('⚠️ No local stream when setting up peer connection!');
    }

    pc.ontrack = (event) => {
      console.log('📺 Remote track received');
      const [stream] = event.streams;
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
      setConnectionStatus('connected');
    };

    pc.onicecandidate = (event) => {
      console.log('🧊 ICE candidate generated:', event.candidate);
      if (event.candidate && socket) {
        console.log('📤 Sending ICE candidate');
        socket.emit('ice-candidate', { roomId, candidate: event.candidate });
      } else {
        console.log('🏁 ICE gathering complete');
      }
    };

    pc.onconnectionstatechange = () => {
      console.log('🔄 Connection state changed:', pc.connectionState);
      setConnectionStatus(pc.connectionState as ConnectionStatus);
    };

    pc.onicegatheringstatechange = () => {
      console.log('❄️ ICE gathering state:', pc.iceGatheringState);
    };

    return pc;
  }, [localStream, socket, roomId]);

  const createOffer = useCallback(async () => {
    try {
      console.log('🎯 createOffer called');
      const pc = setupPeerConnection();
      // Small delay to ensure peer connection is fully set up
      await new Promise(resolve => setTimeout(resolve, 100));
      const offer = await webRTCService.createOffer(pc);
      peerConnectionRef.current = pc;
      console.log('📤 Offer created, sending to server');
      socket?.emit('offer', { roomId, offer });
    } catch (error) {
      console.error('❌ createOffer failed:', error);
      onError('Failed to create offer');
    }
  }, [setupPeerConnection, socket, roomId, onError]);

  const handleOffer = useCallback(async (offer: RTCSessionDescriptionInit) => {
    try {
      console.log('📥 Offer received, creating answer...');
      const pc = setupPeerConnection();
      // Small delay to ensure peer connection is fully set up
      await new Promise(resolve => setTimeout(resolve, 100));
      const answer = await webRTCService.createAnswer(pc, offer);
      peerConnectionRef.current = pc;
      console.log('📤 Answer created, sending to server');
      socket?.emit('answer', { roomId, answer });
    } catch (error) {
      console.error('❌ handleOffer failed:', error);
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
      console.error('Failed to add ICE candidate:', error);
    }
  }, []);

  useEffect(() => {
    console.log('🚀 Initializing media...');
    initializeMedia();
    
    // Cleanup on unmount
    return () => {
      console.log('🧽 Component unmounting, cleaning up...');
      const stream = mediaReadyRef.current;
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
          console.log('⏹️ Unmount: Stopped track:', track.kind);
        });
      }
    };
  }, [initializeMedia]);

  useEffect(() => {
    if (!socket) return;

    const handleRoomJoined = () => {
      console.log('📥 handleRoomJoined called, mediaReady:', !!mediaReadyRef.current);
      
      const tryCreateOffer = (attempt = 1) => {
        if (mediaReadyRef.current) {
          console.log('✅ Media ready, creating offer');
          createOffer();
        } else if (attempt < 10) {
          console.log(`⏳ Media not ready, retry ${attempt}/10...`);
          setTimeout(() => tryCreateOffer(attempt + 1), 300);
        } else {
          console.error('❌ Media still not ready after 10 retries');
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
    console.log('🧽 CLEANUP CALLED');
    
    // Stop all media tracks from multiple sources
    const refStream = mediaReadyRef.current;
    const stateStream = localStream;
    const videoElement = localVideoRef.current;
    
    // Stop ref stream
    if (refStream) {
      console.log('📹 Stopping ref stream tracks...');
      refStream.getTracks().forEach(track => {
        track.stop();
        console.log('⏹️ Stopped ref track:', track.kind);
      });
    }
    
    // Stop state stream (if different)
    if (stateStream && stateStream !== refStream) {
      console.log('📹 Stopping state stream tracks...');
      stateStream.getTracks().forEach(track => {
        track.stop();
        console.log('⏹️ Stopped state track:', track.kind);
      });
    }
    
    // Stop video element stream
    if (videoElement && videoElement.srcObject) {
      const videoStream = videoElement.srcObject as MediaStream;
      console.log('📹 Stopping video element stream...');
      videoStream.getTracks().forEach(track => {
        track.stop();
        console.log('⏹️ Stopped video track:', track.kind);
      });
      videoElement.srcObject = null;
    }
    
    // Also stop remote video
    if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
      const remoteStream = remoteVideoRef.current.srcObject as MediaStream;
      console.log('📹 Stopping remote stream...');
      remoteStream.getTracks().forEach(track => {
        track.stop();
        console.log('⏹️ Stopped remote track:', track.kind);
      });
      remoteVideoRef.current.srcObject = null;
    }
    
    webRTCService.cleanup(peerConnectionRef.current || undefined);
    peerConnectionRef.current = null;
    mediaReadyRef.current = null;
    setLocalStream(null);
    
    console.log('✅ Cleanup complete');
    
    // Force page reload to release camera
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