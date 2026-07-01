// Enterprise Mall - Admin User Service
// Handles admin user listing and points adjustment (grant/adjust + PointRecord)

import { prisma } from '../config/database';
import { Prisma } from '@prisma/client';
import { PaginatedData } from '../utils/response';
import { PaginationQuery, AdjustPointsBody } from '../types';
import { createNotFoundError, createBadRequestError } from '../utils/errors';

/**
 * Get user list with pagination.
 * @param query - Pagination parameters
 * @returns Paginated list of users (excluding password hash)
 */
export async function getUsers(query: PaginationQuery): Promise<PaginatedData<any>> {
  const page: number = query.page ?? 1;
  const pageSize: number = query.pageSize ?? 20;
  const skip: number = (page - 1) * pageSize;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: pageSize,
      select: {
        id: true,
        employeeId: true,
        username: true,
        role: true,
        department: true,
        points: true,
        avatarUrl: true,
        address: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count(),
  ]);

  return {
    items: users,
    total,
    page,
    pageSize,
  };
}

/**
 * Adjust user points (grant or adjust) and create a PointRecord.
 * @param userId - Target user ID
 * @param body - Adjustment payload (points, type, reason)
 * @param operatorId - Admin user ID performing the adjustment
 * @returns Updated user and point record info
 */
export async function adjustPoints(userId: number, body: AdjustPointsBody, operatorId: number): Promise<any> {
  // Verify target user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw createNotFoundError('User not found');
  }

  // Validate adjustment based on type
  const points: number = body.points;
  const type: string = body.type;

  if (type === 'GRANT' || type === 'ADJUST') {
    // For GRANT/ADJUST with positive points, add to user balance
    const newBalance: number = user.points + points;

    if (newBalance < 0) {
      throw createBadRequestError('Adjustment would result in negative points balance');
    }

    // Update user points and create PointRecord in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { points: newBalance },
        select: {
          id: true,
          employeeId: true,
          username: true,
          points: true,
        },
      });

      const pointRecord = await tx.pointRecord.create({
        data: {
          userId,
          type: type as any,
          points,
          balance: newBalance,
          reason: body.reason ?? `${type === 'GRANT' ? 'Points granted' : 'Points adjusted'}: ${points} points`,
          operatorId,
        },
      });

      return { user: updatedUser, record: pointRecord };
    });

    return result;
  }

  throw createBadRequestError('Invalid adjustment type');
}

export const adminUserService = { getUsers, adjustPoints };
