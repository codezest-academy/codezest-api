import morgan from 'morgan';
import logger from '../common/utils/logger';
import config from '../config';

/**
 * Morgan stream to Winston
 */
const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

/**
 * Morgan logging middleware
 * Uses different formats for development and production
 */
export const loggingMiddleware = morgan(
  config.env === 'production'
    ? 'combined' // Apache combined format for production
    : 'dev', // Colored output for development
  { stream }
);
