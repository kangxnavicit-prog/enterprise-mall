// Enterprise Mall - Global Error Handler Middleware
// Catches all unhandled errors (AppError and unknown) and returns standardized responses

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { ERROR_CODES } from '../utils/response';
import { NODE_ENV } from '../config';

/**
 * Global error handler middleware. Must be mounted as the LAST middleware.
 * Handles both custom AppError instances and unexpected errors.
 * - AppError: returns structured { code, data, message } with the error's statusCode
 * - Unknown errors: returns 500 with generic message (details hidden in production)
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response {
  // Handle custom AppError instances
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      code: err.code,
      data: null,
      message: err.message,
    });
  }

  // Handle unexpected/unknown errors
  console.error('[Enterprise Mall] Unhandled error:', err);

  const message: string = NODE_ENV === 'development'
    ? err.message || 'Internal server error'
    : 'Internal server error';

  return res.status(500).json({
    code: ERROR_CODES.INTERNAL_ERROR,
    data: null,
    message,
  });
}
