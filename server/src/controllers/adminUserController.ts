// Enterprise Mall - Admin User Controller
// Handles admin user list retrieval and point adjustment

import { Request, Response, NextFunction } from 'express';
import { adminUserService } from '../services/adminUserService';
import { success, paginated } from '../utils/response';
import { PaginationQuery, AdjustPointsBody, RequestUser } from '../types';
import { createBadRequestError } from '../utils/errors';

/** Get user list with pagination */
export async function getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
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

    const result = await adminUserService.getUsers(query);
    paginated(res, result.items, result.total, result.page, result.pageSize);
  } catch (error) {
    next(error);
  }
}

/** Adjust user points (grant/adjust with reason) */
export async function adjustPoints(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId: number = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      next(createBadRequestError('Invalid user ID'));
      return;
    }

    const body: AdjustPointsBody = req.body;
    const operator: RequestUser = req.user!;
    const result = await adminUserService.adjustPoints(userId, body, operator.id);
    success(res, result, 'Points adjusted successfully');
  } catch (error) {
    next(error);
  }
}

export const adminUserController = { getUsers, adjustPoints };
