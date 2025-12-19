import { SignalingServer } from './SignalingServer.ts';
import { Logger } from './utils/Logger.ts';
import { getAppConfig } from './config/AppConfig.ts';

const logger = new Logger();
const config = getAppConfig();

const signalingServer = new SignalingServer(config, logger);

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  logger.info(`${signal} received, shutting down gracefully`);
  signalingServer.stop();
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start the application
signalingServer.start();