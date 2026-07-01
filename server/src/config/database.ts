// Enterprise Mall - Database Configuration
// Initializes Prisma Client for SQLite and verifies connection on startup
//
// NOTE: SQLite doesn't support native arrays or enums.
// Images are stored as JSON strings in DB, auto-parsed to arrays via response middleware.
// Enum values are stored as plain strings (e.g., "EMPLOYEE", "PENDING").

import { PrismaClient } from '@prisma/client';

import { NODE_ENV } from './index';

// Plain Prisma client (no extensions — avoids TransactionClient type conflicts)
export const prisma = new PrismaClient({
  log: NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

/**
 * Connect to the database and verify the connection.
 * Called once during server startup.
 */
export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    console.log('[Enterprise Mall] Database connected successfully (SQLite)');
  } catch (error) {
    console.error('[Enterprise Mall] Database connection failed:', error);
    throw error;
  }
}

/**
 * Gracefully disconnect from the database.
 * Called on process shutdown signals.
 */
export async function disconnectDatabase(): Promise<void> {
  try {
    await prisma.$disconnect();
    console.log('[Enterprise Mall] Database disconnected');
  } catch (error) {
    console.error('[Enterprise Mall] Database disconnect error:', error);
  }
}

// Register shutdown hooks
process.on('SIGINT', async () => {
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDatabase();
  process.exit(0);
});

// --- Image JSON helpers (for SQLite String ↔ array conversion) ---

/**
 * Parse a JSON string into a string array (for images fields stored as strings in SQLite).
 */
export function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try { return JSON.parse(value); } catch { return []; }
}

/**
 * Stringify a string array into a JSON string (for writing images fields to SQLite).
 */
export function stringifyJsonArray(value: string[]): string {
  return JSON.stringify(value ?? []);
}
