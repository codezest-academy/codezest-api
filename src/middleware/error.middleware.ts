import { Request, Response, NextFunction } from 'express';
import { BaseError } from '../common/errors/base.error';
import { HTTP_STATUS } from '../common/constants/http-status';
import { ERROR_CODES } from '../common/constants/error-codes';
import logger from '../common/utils/logger';
import config from '../config';

/**
 * Error Middleware
 * Global error handler for the application
 */
export const errorMiddleware = (
  err: Error | BaseError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Log error
  logger.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  // Handle BaseError (operational errors)
  if (err instanceof BaseError) {
    return res.status(err.statusCode).json(err.toJSON());
  }

  // Handle Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;

    if (prismaError.code === 'P2002') {
      return res.status(HTTP_STATUS.CONFLICT).json({
        status: 'error',
        error: {
          code: ERROR_CODES.UNIQUE_CONSTRAINT_VIOLATION,
          message: 'Resource already exists',
          details: {
            field: prismaError.meta?.target,
          },
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      });
    }

    if (prismaError.code === 'P2003') {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'error',
        error: {
          code: ERROR_CODES.FOREIGN_KEY_VIOLATION,
          message: 'Invalid reference',
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      });
    }
  }

  // Handle unknown errors
  const statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const errorCode = ERROR_CODES.INTERNAL_SERVER_ERROR;
  const message = config.env === 'production' ? 'An unexpected error occurred' : err.message;

  return res.status(statusCode).json({
    status: 'error',
    error: {
      code: errorCode,
      message,
      ...(config.env === 'development' && { stack: err.stack }),
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  });
};
