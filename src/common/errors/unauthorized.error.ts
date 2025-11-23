import { BaseError } from './base.error';
import { HTTP_STATUS } from '../constants/http-status';
import { ERROR_CODES } from '../constants/error-codes';

/**
 * Unauthorized Error
 * Thrown when authentication is required but not provided or invalid
 */
export class UnauthorizedError extends BaseError {
  constructor(message: string = 'Authentication required') {
    super(message, HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED);
  }
}
