import { BaseError } from './base.error';
import { HTTP_STATUS } from '../constants/http-status';
import { ERROR_CODES } from '../constants/error-codes';

/**
 * Forbidden Error
 * Thrown when user doesn't have permission to access a resource
 */
export class ForbiddenError extends BaseError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, HTTP_STATUS.FORBIDDEN, ERROR_CODES.FORBIDDEN);
  }
}
