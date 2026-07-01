// Enterprise Mall - Auth Service
// Handles login (password verification + JWT generation) and logout

import { prisma } from '../config/database';
import { comparePassword } from '../utils/hash';
import { generateToken } from '../config/jwt';
import { createUnauthorizedError, createNotFoundError } from '../utils/errors';

/**
 * Login: verify employee ID + password, return JWT token and user info.
 * @param employeeId - Employee ID string
 * @param password - Plain text password
 * @returns Object containing token and user data
 */
export async function login(employeeId: string, password: string): Promise<{
  token: string;
  user: {
    id: number;
    employeeId: string;
    username: string;
    role: string;
    department: string | null;
    points: number;
    avatarUrl: string | null;
  };
}> {
  // Find user by employee ID
  const user = await prisma.user.findUnique({
    where: { employeeId },
  });

  if (!user) {
    throw createNotFoundError('User not found');
  }

  // Check if user is active
  if (!user.isActive) {
    throw createUnauthorizedError('Account is disabled');
  }

  // Verify password
  const isPasswordValid: boolean = await comparePassword(password, user.passwordHash);
  if (!isPasswordValid) {
    throw createUnauthorizedError('Invalid password');
  }

  // Generate JWT token
  const token: string = generateToken({
    id: user.id,
    role: user.role,
    employeeId: user.employeeId,
  });

  return {
    token,
    user: {
      id: user.id,
      employeeId: user.employeeId,
      username: user.username,
      role: user.role,
      department: user.department,
      points: user.points,
      avatarUrl: user.avatarUrl,
    },
  };
}

/**
 * Logout: server-side acknowledgment (client clears token).
 * Future enhancement: could invalidate token in a Redis store.
 * @param userId - User ID (for logging purposes)
 */
export async function logout(userId: number): Promise<void> {
  // No server-side action needed for JWT logout
  // Client will clear the token from localStorage
  console.log(`[Auth] User ${userId} logged out`);
}

export const authService = { login, logout };
