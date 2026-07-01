// Enterprise Mall - Custom Error Classes
// Defines AppError for structured error handling across the application

/** Custom application error with code, message, and HTTP status code */
export class AppError extends Error {
  public code: number;
  public statusCode: number;

  constructor(code: number, message: string, statusCode: number = 400) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    // Maintain proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/** Factory functions for common error types */

export function createBadRequestError(message: string): AppError {
  return new AppError(40001, message, 400);
}

export function createUnauthorizedError(message: string = 'Authentication required'): AppError {
  return new AppError(40100, message, 401);
}

export function createForbiddenError(message: string = 'Access denied'): AppError {
  return new AppError(40300, message, 403);
}

export function createNotFoundError(message: string = 'Resource not found'): AppError {
  return new AppError(40400, message, 404);
}

export function createConflictError(message: string): AppError {
  return new AppError(40900, message, 409);
}

export function createInternalError(message: string = 'Internal server error'): AppError {
  return new AppError(50000, message, 500);
}
