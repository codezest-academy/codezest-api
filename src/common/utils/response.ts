import { Response } from 'express';
import { HTTP_STATUS } from '../constants/http-status';

/**
 * Standard API Response Format
 */
interface ApiResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta: {
    timestamp: string;
    version?: string;
  };
}

/**
 * Send success response
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode: number = HTTP_STATUS.OK
): Response => {
  const response: ApiResponse<T> = {
    status: 'success',
    data,
    meta: {
      timestamp: new Date().toISOString(),
      version: 'v1',
    },
  };

  return res.status(statusCode).json(response);
};

/**
 * Send error response
 */
export const sendError = (
  res: Response,
  code: string,
  message: string,
  statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  details?: any
): Response => {
  const response: ApiResponse = {
    status: 'error',
    error: {
      code,
      message,
      ...(details && { details }),
    },
    meta: {
      timestamp: new Date().toISOString(),
      version: 'v1',
    },
  };

  return res.status(statusCode).json(response);
};

/**
 * Send paginated response
 */
export const sendPaginated = <T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number
): Response => {
  const response = {
    status: 'success',
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
    meta: {
      timestamp: new Date().toISOString(),
      version: 'v1',
    },
  };

  return res.status(HTTP_STATUS.OK).json(response);
};

/**
 * Helper functions for creating response objects (for testing)
 */
export const successResponse = <T>(data: T, message?: string) => ({
  status: 'success' as const,
  data,
  ...(message && { message }),
  meta: {
    timestamp: new Date().toISOString(),
  },
});

export const errorResponse = (code: string, message: string, details?: any) => ({
  status: 'error' as const,
  error: {
    code,
    message,
    ...(details && { details }),
  },
  meta: {
    timestamp: new Date().toISOString(),
  },
});

export const paginatedResponse = <T>(
  items: T[],
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }
) => ({
  status: 'success' as const,
  data: items,
  pagination,
  meta: {
    timestamp: new Date().toISOString(),
  },
});
