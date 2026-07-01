// Enterprise Mall - Password Hash Utility
// Provides bcryptjs hashing and comparison functions for user authentication

import bcrypt from 'bcryptjs';

const SALT_ROUNDS: number = 10;

/**
 * Hash a plaintext password using bcryptjs.
 * @param password - Plain text password to hash
 * @returns Hashed password string
 */
export async function hashPassword(password: string): Promise<string> {
  const salt: string = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
}

/**
 * Compare a plaintext password against a stored hash.
 * @param password - Plain text password to verify
 * @param hash - Stored bcrypt hash to compare against
 * @returns True if password matches the hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
