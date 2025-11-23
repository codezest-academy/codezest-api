import { BaseError } from './base.error';
import { HTTP_STATUS } from '../constants/http-status';
import { ERROR_CODES } from '../constants/error-codes';

/**
 * Not Found Error
 * Thrown when a requested resource is not found
 */
export class NotFoundError extends BaseError {
  constructor(resource: string, identifier?: string | number) {
    const message = identifier
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`;

    super(message, HTTP_STATUS.NOT_FOUND, ERROR_CODES.RESOURCE_NOT_FOUND);
  }
}
