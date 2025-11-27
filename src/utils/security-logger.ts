import logger from '../config/logger.config';

/**
 * Security Event Types
 */
export enum SecurityEvent {
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  FORBIDDEN_ACCESS = 'FORBIDDEN_ACCESS',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  INVALID_ISSUER = 'INVALID_ISSUER',
  INVALID_AUDIENCE = 'INVALID_AUDIENCE',
}

/**
 * Security Event Details
 */
export interface SecurityEventDetails {
  userId?: string;
  ip?: string;
  path?: string;
  method?: string;
  error?: string;
  [key: string]: any;
}

/**
 * Log Security Event
 * Logs security-related events with structured format
 */
export const logSecurityEvent = (event: SecurityEvent, details: SecurityEventDetails): void => {
  logger.warn({
    type: 'SECURITY_EVENT',
    event,
    ...details,
    timestamp: new Date().toISOString(),
  });
};
