// Enterprise Mall - Auth API
// Login and logout API calls

import apiClient from './client';
import { ApiResponse } from '../types/api';
import { User } from '../types/user';

interface LoginResponse {
  token: string;
  user: User;
}

/** Login with employee ID and password */
export async function login(employeeId: string, password: string): Promise<ApiResponse<LoginResponse>> {
  return apiClient.post('/auth/login', { employeeId, password });
}

/** Logout (server-side acknowledgment) */
export async function logout(): Promise<ApiResponse<null>> {
  return apiClient.post('/auth/logout');
}
