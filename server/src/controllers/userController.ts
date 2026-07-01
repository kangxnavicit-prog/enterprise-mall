// Enterprise Mall - User Controller
// Handles user profile and point record retrieval

import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/userService';
import { success, paginated } from '../utils/response';
import { RequestUser, PaginationQuery } from '../types';

/** Get current user profile */
export async function getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user: RequestUser = req.user!;
    const profile = await userService.getProfile(user.id);
    success(res, profile);
  } catch (error) {
    next(error);
  }
}

/** Update current user profile */
export async function updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user: RequestUser = req.user!;
    const { username, address, department }: { username?: string; address?: string; department?: string } = req.body;

    const updatedProfile = await userService.updateProfile(user.id, { username, address, department });
    success(res, updatedProfile, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
}

/** Get current user's point records */
export async function getPointRecords(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user: RequestUser = req.user!;
    const query: PaginationQuery = {
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : 20,
    };

    if (query.page !== undefined && isNaN(query.page)) {
      query.page = 1;
    }
    if (query.pageSize !== undefined && isNaN(query.pageSize)) {
      query.pageSize = 20;
    }

    const result = await userService.getPointRecords(user.id, query);
    paginated(res, result.items, result.total, result.page, result.pageSize);
  } catch (error) {
    next(error);
  }
}

export const userController = { getProfile, updateProfile, getPointRecords };
