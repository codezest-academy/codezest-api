import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { UnauthorizedError } from '../common/errors/unauthorized.error';
import { UserRole } from '@prisma/client';

/**
 * JWT Authentication Middleware
 * Verifies JWT token and attaches user to request
 */
export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as {
        id: string;
        email: string;
        role: string;
      };

      // Attach user to request
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role as UserRole,
      };

      next();
    } catch (jwtError) {
      if (jwtError instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('Token expired');
      }
      throw new UnauthorizedError('Invalid token');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Optional Authentication Middleware
 * Attaches user if token is valid, but doesn't throw error if missing
 */
export const optionalAuthMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);

      try {
        const decoded = jwt.verify(token, config.jwt.secret) as {
          id: string;
          email: string;
          role: string;
        };

        req.user = {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role as UserRole,
        };
      } catch (jwtError) {
        // Silently ignore invalid tokens for optional auth
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};
