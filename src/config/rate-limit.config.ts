import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';
import config from './index';
import logger from './logger.config';

/**
 * Create Rate Limiter
 * Uses Redis in production for distributed rate limiting
 * Falls back to in-memory for development
 */
export const createRateLimiter = async (): Promise<RateLimitRequestHandler> => {
  const isProduction = config.env === 'production';
  const windowMs = config.rateLimit.windowMs;
  const max = config.rateLimit.maxRequests;

  // Use Redis in production if available
  if (isProduction && config.redis.host) {
    try {
      const redisClient = createClient({
        socket: {
          host: config.redis.host,
          port: config.redis.port,
        },
        password: config.redis.password,
      });

      await redisClient.connect();

      logger.info('Rate limiter using Redis store');

      return rateLimit({
        store: new RedisStore({
          // @ts-expect-error - RedisStore types are not fully compatible
          client: redisClient,
          prefix: 'rl:',
        }),
        windowMs,
        max,
        message: {
          status: 'error',
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests from this IP, please try again later.',
          },
        },
        standardHeaders: true,
        legacyHeaders: false,
      });
    } catch (error) {
      logger.error(
        'Failed to connect to Redis for rate limiting, falling back to in-memory',
        error
      );
    }
  }

  // Fallback to in-memory for development or if Redis fails
  logger.info('Rate limiter using in-memory store');

  return rateLimit({
    windowMs,
    max,
    message: {
      status: 'error',
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests from this IP, please try again later.',
      },
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

/**
 * Strict Rate Limiter for sensitive operations
 */
export const createStrictRateLimiter = async (): Promise<RateLimitRequestHandler> => {
  const isProduction = config.env === 'production';

  if (isProduction && config.redis.host) {
    try {
      const redisClient = createClient({
        socket: {
          host: config.redis.host,
          port: config.redis.port,
        },
        password: config.redis.password,
      });

      await redisClient.connect();

      return rateLimit({
        store: new RedisStore({
          // @ts-expect-error - RedisStore types are not fully compatible
          client: redisClient,
          prefix: 'rl:strict:',
        }),
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 10, // 10 requests per window
        message: {
          status: 'error',
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests, please try again later.',
          },
        },
        standardHeaders: true,
        legacyHeaders: false,
      });
    } catch (error) {
      logger.error(
        'Failed to connect to Redis for strict rate limiting, falling back to in-memory',
        error
      );
    }
  }

  return rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
      status: 'error',
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests, please try again later.',
      },
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};
