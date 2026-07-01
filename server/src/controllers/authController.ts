// Enterprise Mall - Auth Controller
// Handles login and logout requests

import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { success } from '../utils/response';
import { AppError, createBadRequestError } from '../utils/errors';
import { RequestUser } from '../types';

/** Login with employee ID and password */
export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { employeeId, password }: { employeeId: string; password: string } = req.body;

    if (!employeeId || !password) {
      next(createBadRequestError('Employee ID and password are required'));
      return;
    }

    const result = await authService.login(employeeId, password);
    success(res, result, 'Login successful');
  } catch (error) {
    next(error);
  }
}

/** Logout (client-side token clearing, server returns success) */
export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user: RequestUser = req.user!;
    await authService.logout(user.id);
    success(res, null, 'Logout successful');
  } catch (error) {
    next(error);
  }
}

export const authController = { login, logout };
