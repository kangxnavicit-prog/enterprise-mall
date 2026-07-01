// Enterprise Mall - User API
// User profile and point record API calls

import apiClient from './client';
import { ApiResponse, PaginatedResponse } from '../types/api';
import { User, PointRecord } from '../types/user';

interface PaginationParams {
  page?: number;
  pageSize?: number;
}

/** Get current user profile */
export async function getProfile(): Promise<ApiResponse<User>> {
  return apiClient.get('/users/profile');
}

/** Update current user profile */
export async function updateProfile(data: {
  username?: string;
  address?: string;
  department?: string;
}): Promise<ApiResponse<User>> {
  return apiClient.put('/users/profile', data);
}

/** Get current user's point records */
export async function getPointRecords(params?: PaginationParams): Promise<PaginatedResponse<PointRecord>> {
  return apiClient.get('/users/points', { params });
}
