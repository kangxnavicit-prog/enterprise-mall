// Enterprise Mall - Role Guard Middleware
// Standalone export of roleGuard for route-level authorization checks

import { Request, Response, NextFunction } from 'express';
import { RequestUser } from '../types';
import { Role } from '../types/enums';
import { createForbiddenError, createUnauthorizedError } from '../utils/errors';

/**
 * Express middleware factory that restricts route access to specified roles.
 * Must be used after authMiddleware (depends on req.user being set).
 * @param allowedRoles - Array of Role enum values permitted to access the route
 * @returns Middleware function that checks user role
 */
export function roleGuardMiddleware(allowedRoles: Role[]): (req: Request, res: Response, next: NextFunction) => void {
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
