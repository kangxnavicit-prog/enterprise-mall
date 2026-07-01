// Enterprise Mall - Admin Dashboard Controller
// Handles dashboard statistics retrieval

import { Request, Response, NextFunction } from 'express';
import { adminDashboardService } from '../services/adminDashboardService';
import { success } from '../utils/response';

/** Get dashboard statistics */
export async function getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const stats = await adminDashboardService.getStats();
    success(res, stats);
  } catch (error) {
    next(error);
  }
}

export const adminDashboardController = { getStats };
