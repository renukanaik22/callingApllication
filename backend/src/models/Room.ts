export class Room {
  constructor(
    public readonly id: string,
    public readonly creator: string,
    public joiner: string | null = null
  ) {}

  addJoiner(socketId: string): void {
    if (this.joiner) {
      throw new Error('Room is already full');
    }
    this.joiner = socketId;
  }

  isFull(): boolean {
    return this.joiner !== null;
  }

  hasParticipant(socketId: string): boolean {
    return this.creator === socketId || this.joiner === socketId;
  }

  getOtherParticipant(socketId: string): string | null {
    if (this.creator === socketId) return this.joiner;
    if (this.joiner === socketId) return this.creator;
    return null;
  }
}