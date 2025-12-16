import { ICE_SERVERS, MEDIA_CONSTRAINTS } from '../constants/webrtc';
import {ICEServerConfig, MediaConstraints} from "../interfaces/webrtc.ts";

export class WebRTCService {
  async getUserMedia(constraints: MediaConstraints = MEDIA_CONSTRAINTS): Promise<MediaStream> {
    try {
      // Don't store - return fresh stream each time
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      return stream;
    } catch (error) {
      throw new Error('Failed to access camera/microphone. Please grant permissions.');
    }
  }

  createPeerConnection(config: ICEServerConfig = ICE_SERVERS): RTCPeerConnection {
    // Always return a new peer connection - don't store it
    return new RTCPeerConnection(config);
  }

  addLocalStreamToPeer(peerConnection: RTCPeerConnection, stream: MediaStream): void {
    stream.getTracks().forEach(track => {
      peerConnection.addTrack(track, stream);
    });
  }

  async createOffer(peerConnection: RTCPeerConnection): Promise<RTCSessionDescriptionInit> {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    return offer;
  }

  async createAnswer(peerConnection: RTCPeerConnection, offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    return answer;
  }

  async setRemoteAnswer(peerConnection: RTCPeerConnection, answer: RTCSessionDescriptionInit): Promise<void> {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  }

  async addIceCandidate(peerConnection: RTCPeerConnection, candidate: RTCIceCandidateInit): Promise<void> {
    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  }

  cleanup(peerConnection?: RTCPeerConnection): void {
    if (peerConnection) {
      peerConnection.close();
    }
  }
}

export const webRTCService = new WebRTCService();