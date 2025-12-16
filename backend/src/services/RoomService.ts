import { Room } from '../models/Room.ts';

export class RoomService {
  private rooms = new Map<string, Room>();

  createRoom(roomId: string, creatorSocketId: string): Room {
    if (this.rooms.has(roomId)) {
      throw new Error('Room already exists');
    }

    const room = new Room(roomId, creatorSocketId);
    this.rooms.set(roomId, room);
    return room;
  }

  joinRoom(roomId: string, joinerSocketId: string): Room {
    const room = this.rooms.get(roomId);
    
    if (!room) {
      throw new Error('Room not found');
    }

    if (room.isFull()) {
      throw new Error('Room is full');
    }

    room.addJoiner(joinerSocketId);
    return room;
  }

  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  removeRoom(roomId: string): void {
    this.rooms.delete(roomId);
  }

  findRoomByParticipant(socketId: string): { room: Room; roomId: string } | null {
    for (const [roomId, room] of this.rooms) {
      if (room.hasParticipant(socketId)) {
        return { room, roomId };
      }
    }
    return null;
  }

  getRoomCount(): number {
    return this.rooms.size;
  }
}