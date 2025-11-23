import { BaseError } from './base.error';
import { HTTP_STATUS } from '../constants/http-status';
import { ERROR_CODES } from '../constants/error-codes';
import { ZodError } from 'zod';

/**
 * Validation Error
 * Thrown when request validation fails
 */
export class ValidationError extends BaseError {
  constructor(message: string, details?: any) {
    super(message, HTTP_STATUS.UNPROCESSABLE_ENTITY, ERROR_CODES.VALIDATION_ERROR, true, details);
  }

  /**
   * Create ValidationError from Zod error
   */
  static fromZodError(error: ZodError): ValidationError {
    const details = error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
      code: err.code,
    }));

    return new ValidationError('Validation failed', details);
  }
}
