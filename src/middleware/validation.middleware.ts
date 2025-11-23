import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ValidationError } from '../common/errors/validation.error';

/**
 * Validation Middleware
 * Validates request body, query, or params using Zod schema
 */
export const validate = (schema: AnyZodObject, source: 'body' | 'query' | 'params' = 'body') => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = req[source];
      await schema.parseAsync(data);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(ValidationError.fromZodError(error));
      } else {
        next(error);
      }
    }
  };
};
