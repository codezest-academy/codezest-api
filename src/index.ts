import createApp from './app';
import { createServer, startServer } from './server';

/**
 * Application Entry Point
 */
const main = async () => {
  const app = createApp();
  const server = createServer(app);
  await startServer(server);
};

// Start the application
main().catch((error) => {
  console.error('Fatal error during startup:', error);
  process.exit(1);
});
