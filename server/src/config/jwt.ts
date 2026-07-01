// Enterprise Mall - JWT Configuration
// Provides JWT token generation and verification utilities

import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from './index';

/** JWT payload structure embedded in the token */
export interface JwtPayload {
  id: number;
  role: string;
  employeeId: string;
}

/**
 * Generate a JWT token for the given user payload.
 * @param payload - User identity data to embed in the token
 * @returns Signed JWT string
 */
export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });
}

/**
 * Verify and decode a JWT token.
 * @param token - JWT string to verify
 * @returns Decoded payload if token is valid
 * @throws JsonWebTokenError if token is invalid or expired
 */
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
