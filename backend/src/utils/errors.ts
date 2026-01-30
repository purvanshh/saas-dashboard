/**
 * Error Handling Utilities
 * 
 * Standardized error responses for consistent API behavior.
 * All errors follow the same format for predictable client handling.
 */

import { Response } from 'express';
import { ApiError, ErrorCode } from '../types';

/**
 * Send a standardized error response
 */
export function sendError(
  res: Response,
  code: ErrorCode,
  message: string,
  status: number,
  details?: Record<string, unknown>
): void {
  const error: ApiError = {
    code,
    message,
    status,
    ...(details && { details }),
  };

  res.status(status).json({ error });
}

/**
 * Common error response helpers
 */
export const errors = {
  unauthorized: (res: Response, message = 'Authentication required') => {
    sendError(res, 'UNAUTHORIZED', message, 401);
  },

  forbidden: (res: Response, message = 'Access denied') => {
    sendError(res, 'FORBIDDEN', message, 403);
  },

  notFound: (res: Response, resource: string) => {
    sendError(res, 'NOT_FOUND', `${resource} not found`, 404);
  },

  validation: (res: Response, details: Record<string, string[]>) => {
    sendError(res, 'VALIDATION_ERROR', 'Validation failed', 400, details);
  },

  tenantNotFound: (res: Response) => {
    sendError(res, 'TENANT_NOT_FOUND', 'Organization not found or access denied', 403);
  },

  insufficientPermissions: (res: Response, required: string, current: string) => {
    sendError(res, 'INSUFFICIENT_PERMISSIONS', 
      `Permission denied. Required: ${required}`, 
      403, 
      { requiredPermission: required, currentRole: current }
    );
  },

  rateLimit: (res: Response) => {
    sendError(res, 'RATE_LIMIT_EXCEEDED', 'Too many requests. Please try again later.', 429);
  },

  internal: (res: Response, message = 'Internal server error') => {
    console.error('Internal error:', message);
    sendError(res, 'INTERNAL_ERROR', message, 500);
  },
};

/**
 * Async handler wrapper
 * Catches errors in async route handlers and passes to Express error handler
 */
export function asyncHandler(
  fn: (req: any, res: any, next: any) => Promise<void>
) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Custom error class for application-specific errors
 */
export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly status: number;
  public readonly details?: Record<string, unknown>;

  constructor(
    code: ErrorCode,
    message: string,
    status: number,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
    
    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handler middleware
 * Must be registered last in the Express app
 */
export function globalErrorHandler(
  err: Error | AppError,
  req: any,
  res: any,
  _next: any
): void {
  // Log the error
  console.error('Error:', err);

  // Handle known application errors
  if (err instanceof AppError) {
    sendError(res, err.code, err.message, err.status, err.details);
    return;
  }

  // Handle Zod validation errors
  if (err.name === 'ZodError') {
    sendError(res, 'VALIDATION_ERROR', 'Validation failed', 400, { 
      issues: (err as any).issues 
    });
    return;
  }

  // Default to internal error
  sendError(res, 'INTERNAL_ERROR', 'Internal server error', 500);
}
