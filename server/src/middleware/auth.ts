// Enterprise Mall - Auth Middleware
// Extracts and verifies JWT token from Authorization header, attaches user info to request

import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../config/jwt';
import { AppError, createUnauthorizedError, createForbiddenError } from '../utils/errors';
import { RequestUser } from '../types';
import { Role } from '../types/enums';

/**
 * Express middleware that authenticates requests via JWT.
 * Extracts the Bearer token from the Authorization header,
 * verifies it, and attaches decoded user info to req.user.
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  try {
    const authHeader: string | undefined = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createUnauthorizedError('No token provided');
    }

    const token: string = authHeader.split(' ')[1];

    if (!token) {
      throw createUnauthorizedError('Invalid token format');
    }

    const decoded: JwtPayload = verifyToken(token);

    // Attach user info to request for downstream handlers
    req.user = {
      id: decoded.id,
      role: decoded.role as Role,
      employeeId: decoded.employeeId,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(createUnauthorizedError('Invalid or expired token'));
    }
  }
}

/**
 * Express middleware that checks if the authenticated user has a specific role.
 * Must be used AFTER authMiddleware (requires req.user to exist).
 * @param allowedRoles - Array of roles that are permitted to access the route
 */
export function roleGuard(allowedRoles: Role[]): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user: RequestUser | undefined = req.user;

    if (!user) {
      next(createUnauthorizedError('User not authenticated'));
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      next(createForbiddenError('Insufficient permissions'));
      return;
    }

    next();
  };
}
