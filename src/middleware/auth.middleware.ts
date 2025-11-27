import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { UnauthorizedError } from '../common/errors/unauthorized.error';
import { UserRole } from '@prisma/client';
import { logSecurityEvent, SecurityEvent } from '../utils/security-logger';

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

    // Verify token with issuer and audience validation
    try {
      const decoded = jwt.verify(token, config.jwt.secret, {
        issuer: 'codezest-auth',
        audience: 'codezest-api',
      }) as {
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
        logSecurityEvent(SecurityEvent.TOKEN_EXPIRED, {
          ip: req.ip,
          path: req.path,
          method: req.method,
        });
        throw new UnauthorizedError('Token expired');
      }
      if (jwtError instanceof jwt.JsonWebTokenError) {
        const event = jwtError.message.includes('issuer')
          ? SecurityEvent.INVALID_ISSUER
          : jwtError.message.includes('audience')
            ? SecurityEvent.INVALID_AUDIENCE
            : SecurityEvent.INVALID_TOKEN;

        logSecurityEvent(event, {
          ip: req.ip,
          path: req.path,
          method: req.method,
          error: jwtError.message,
        });
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
        const decoded = jwt.verify(token, config.jwt.secret, {
          issuer: 'codezest-auth',
          audience: 'codezest-api',
        }) as {
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
