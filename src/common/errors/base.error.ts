import { HTTP_STATUS, HttpStatusCode } from '../constants/http-status';
import { ERROR_CODES, ErrorCode } from '../constants/error-codes';

/**
 * Base Error Class
 * All custom errors should extend this class
 */
export class BaseError extends Error {
  public readonly statusCode: HttpStatusCode;
  public readonly errorCode: ErrorCode;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    message: string,
    statusCode: HttpStatusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    errorCode: ErrorCode = ERROR_CODES.INTERNAL_SERVER_ERROR,
    isOperational: boolean = true,
    details?: any
  ) {
    super(message);
    
    Object.setPrototypeOf(this, new.target.prototype);
    
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = isOperational;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      status: 'error',
      error: {
        code: this.errorCode,
        message: this.message,
        ...(this.details && { details: this.details }),
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  }
}
