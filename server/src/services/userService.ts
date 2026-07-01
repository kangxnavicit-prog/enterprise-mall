// Enterprise Mall - User Service
// Handles user profile retrieval, update, and point record listing

import { prisma } from '../config/database';
import { PaginatedData } from '../utils/response';
import { PaginationQuery } from '../types';
import { createNotFoundError, createConflictError } from '../utils/errors';

/**
 * Get user profile by ID (excluding password hash).
 * @param userId - Current user's ID
 * @returns User profile data
 */
export async function getProfile(userId: number): Promise<any> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
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
  });

  if (!user) {
    throw createNotFoundError('User not found');
  }

  return user;
}

/**
 * Update user profile fields.
 * @param userId - Current user's ID
 * @param data - Partial profile data to update
 * @returns Updated user profile
 */
export async function updateProfile(
  userId: number,
  data: { username?: string; address?: string; department?: string }
): Promise<any> {
  // If username is being updated, check uniqueness
  if (data.username) {
    const existingUser = await prisma.user.findFirst({
      where: {
        username: data.username,
        id: { not: userId },
      },
    });

    if (existingUser) {
      throw createConflictError('Username already taken');
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      username: data.username,
      address: data.address,
      department: data.department,
    },
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
  });

  return updatedUser;
}

/**
 * Get user's point records with pagination.
 * @param userId - Current user's ID
 * @param query - Pagination parameters
 * @returns Paginated list of point records
 */
export async function getPointRecords(userId: number, query: PaginationQuery): Promise<PaginatedData<any>> {
  const page: number = query.page ?? 1;
  const pageSize: number = query.pageSize ?? 20;
  const skip: number = (page - 1) * pageSize;

  const [records, total] = await Promise.all([
    prisma.pointRecord.findMany({
      where: { userId },
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.pointRecord.count({ where: { userId } }),
  ]);

  return {
    items: records,
    total,
    page,
    pageSize,
  };
}

export const userService = { getProfile, updateProfile, getPointRecords };
