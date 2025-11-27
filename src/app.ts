import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import 'express-async-errors';

import config from './config';
import { loggingMiddleware } from './middleware/logging.middleware';
import { errorMiddleware } from './middleware/error.middleware';
import routes from './routes';

/**
 * Create Express Application
 */
const createApp = (): Application => {
  const app = express();

  // Security middleware
  app.use(helmet());

  // CORS
  app.use(
    cors({
      origin: config.cors.origin,
      credentials: config.cors.credentials,
    })
  );

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Compression
  app.use(compression());

  // Logging
  app.use(loggingMiddleware);

  // Rate limiting
  // Note: For production with multiple instances, configure Redis-backed rate limiting
  // See src/config/rate-limit.config.ts for Redis implementation
  const rateLimit = require('express-rate-limit');
  const limiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
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
  app.use(limiter);

  // Health check endpoint
  if (config.healthCheck.enabled) {
    app.get('/health', (_req, res) => {
      res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.env,
      });
    });
  }

  // Swagger API Documentation
  if (config.swagger.enabled) {
    const swaggerUi = require('swagger-ui-express');
    const { swaggerSpec } = require('./config/swagger.config');

    app.use(
      config.swagger.path,
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, {
        explorer: true,
        swaggerOptions: {
          persistAuthorization: true,
          displayRequestDuration: true,
          filter: true,
          syntaxHighlight: {
            activate: true,
            theme: 'monokai',
          },
        },
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'CodeZest API Documentation',
      })
    );
  }

  // API routes
  app.use(`/api/${config.apiVersion}`, routes);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      status: 'error',
      error: {
        code: 'ROUTE_NOT_FOUND',
        message: `Route ${req.method} ${req.path} not found`,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  });

  // Error handling middleware (must be last)
  app.use(errorMiddleware);

  return app;
};

export default createApp;
