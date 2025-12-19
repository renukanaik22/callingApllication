import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { SocketController } from './controllers/SocketController.ts';
import { RoomService } from './services/RoomService.ts';
import { Logger } from './utils/Logger.ts';
import { AppConfig } from './config/AppConfig.ts';
import { ClientToServerEvents, ServerToClientEvents } from "./types/signaling-event.types.ts";

export class SignalingServer {
  private app: express.Application;
  private server: ReturnType<typeof createServer>;
  private io!: Server<ClientToServerEvents, ServerToClientEvents>;
  private socketController!: SocketController;

  constructor(
    private config: AppConfig,
    private logger: Logger
  ) {
    this.app = express();
    this.setupMiddleware();
    this.server = createServer(this.app);
    this.setupSocketIO();
    this.setupDependencies();
  }

  private setupMiddleware(): void {
    this.app.use(cors({
      origin: this.config.corsOrigin
    }));
    this.app.use(express.json());
  }

  private setupSocketIO(): void {
    this.io = new Server<ClientToServerEvents, ServerToClientEvents>(this.server, {
      cors: { origin: this.config.corsOrigin }
    });
  }

  private setupDependencies(): void {
    const roomService = new RoomService();
    this.socketController = new SocketController(roomService, this.logger);
    
    this.io.on('connection', (socket) => {
      this.socketController.handleConnection(socket);
    });
  }

  start(): void {
    this.server.listen(this.config.port, () => {
      this.logger.info(`Signaling server running on port ${this.config.port}`);
      this.logger.info(`Environment: ${this.config.nodeEnv}`);
    });
  }

  stop(): void {
    this.server.close();
    this.logger.info('Server stopped');
  }
}