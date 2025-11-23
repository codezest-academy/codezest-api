import { createCacheClient } from '@codezest-academy/codezest-cache';
import { logger } from '../../common/utils/logger'; // Your service's logger

// Create the client with connection details and logger
export const cache = createCacheClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  logger: logger, // Optional: Inject your logger (Winston/Pino)
});
