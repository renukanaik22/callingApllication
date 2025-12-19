import { Socket } from 'socket.io';
import { RoomService } from '../services/RoomService.ts';
import { 
  ClientToServerEvents, 
  ServerToClientEvents,
  OfferMessage,
  AnswerMessage,
  IceCandidateMessage
} from '../types/signaling-event.types.ts';
import { Logger } from '../utils/Logger.ts';

export class SocketController {
  constructor(
    private roomService: RoomService,
    private logger: Logger
  ) {}

  handleConnection(socket: Socket<ClientToServerEvents, ServerToClientEvents>): void {
    this.logger.info(`User connected: ${socket.id}`);

    socket.on('create-room', (roomId) => this.handleCreateRoom(socket, roomId));
    socket.on('join-room', (roomId) => this.handleJoinRoom(socket, roomId));
    socket.on('offer', (data) => this.handleOffer(socket, data));
    socket.on('answer', (data) => this.handleAnswer(socket, data));
    socket.on('ice-candidate', (data) => this.handleIceCandidate(socket, data));
    socket.on('disconnect', () => this.handleDisconnect(socket));
  }

  private handleCreateRoom(socket: Socket<ClientToServerEvents, ServerToClientEvents>, roomId: string): void {
    try {
      this.roomService.createRoom(roomId, socket.id);
      socket.join(roomId);
      socket.emit('room-created', roomId);
      this.logger.info(`Room created: ${roomId} by ${socket.id}`);
    } catch (error) {
      if (error instanceof Error && error.message === 'Room already exists') {
        socket.emit('room-exists');
      } else {
        this.logger.error(`Error creating room: ${error}`);
      }
    }
  }

  private handleJoinRoom(socket: Socket<ClientToServerEvents, ServerToClientEvents>, roomId: string): void {
    try {
      socket.join(roomId);
      socket.to(roomId).emit('user-joined', socket.id);
      socket.emit('room-joined', roomId);
      this.logger.info(`User ${socket.id} joined room: ${roomId}`);
    } catch (error) {
      if (error instanceof Error) {
        switch (error.message) {
          case 'Room not found':
            socket.emit('room-not-found');
            break;
          case 'Room is full':
            socket.emit('room-full');
            break;
          default:
            this.logger.error(`Error joining room: ${error}`);
        }
      }
    }
  }

  private handleOffer(socket: Socket<ClientToServerEvents, ServerToClientEvents>, { roomId, offer }: OfferMessage): void {
    this.logger.info(`Offer received for room: ${roomId}`);
    socket.to(roomId).emit('offer', offer);
  }

  private handleAnswer(socket: Socket<ClientToServerEvents, ServerToClientEvents>, { roomId, answer }: AnswerMessage): void {
    this.logger.info(`Answer received for room: ${roomId}`);
    socket.to(roomId).emit('answer', answer);
  }

  private handleIceCandidate(socket: Socket<ClientToServerEvents, ServerToClientEvents>, { roomId, candidate }: IceCandidateMessage): void {
    this.logger.info(`ICE candidate received for room: ${roomId}`);
    socket.to(roomId).emit('ice-candidate', candidate);
  }

  private handleDisconnect(socket: Socket<ClientToServerEvents, ServerToClientEvents>): void {
    this.logger.info(`User disconnected: ${socket.id}`);
    
    const roomData = this.roomService.findRoomByParticipant(socket.id);
    if (roomData) {
      const { roomId } = roomData;
      socket.to(roomId).emit('user-disconnected');
      this.roomService.removeRoom(roomId);
      this.logger.info(`Room ${roomId} removed due to user disconnect`);
    }
  }
}