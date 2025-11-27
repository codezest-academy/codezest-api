import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../common/errors/forbidden.error';
import { UnauthorizedError } from '../common/errors/unauthorized.error';
import { UserRole } from '@prisma/client';
import { logSecurityEvent, SecurityEvent } from '../utils/security-logger';

/**
 * Role-Based Access Control Middleware
 * Checks if user has required role(s)
 */
export const rbacMiddleware = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new ForbiddenError('Authentication required');
      }

      const userRole = req.user.role;

      if (!allowedRoles.includes(userRole)) {
        logSecurityEvent(SecurityEvent.FORBIDDEN_ACCESS, {
          userId: req.user.id,
          ip: req.ip,
          path: req.path,
          method: req.method,
          userRole,
          requiredRoles: allowedRoles.join(', '),
        });
        throw new ForbiddenError(`Access denied. Required roles: ${allowedRoles.join(', ')}`);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Role-based access control middleware
 * Checks if user has required role
 */
export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      if (!allowedRoles.includes(req.user.role)) {
        logSecurityEvent(SecurityEvent.FORBIDDEN_ACCESS, {
          userId: req.user.id,
          ip: req.ip,
          path: req.path,
          method: req.method,
          userRole: req.user.role,
          requiredRoles: allowedRoles.join(', '),
        });
        throw new ForbiddenError(`Access denied. Required roles: ${allowedRoles.join(', ')}`);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Admin only middleware
 */
export const adminOnly = rbacMiddleware(UserRole.ADMIN);
