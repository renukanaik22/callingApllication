import { App } from './app.ts';
import { Logger } from './utils/Logger.ts';
import { getAppConfig } from './config/AppConfig.ts';

const logger = new Logger();
const config = getAppConfig();

const app = new App(config, logger);

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  logger.info(`${signal} received, shutting down gracefully`);
  app.stop();
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start the application
app.start();