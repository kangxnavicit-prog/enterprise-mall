// Enterprise Mall - Configuration Module
// Centralizes all runtime configuration from environment variables

import dotenv from 'dotenv';
dotenv.config();

export const DATABASE_URL: string = process.env.DATABASE_URL || 'file:./prisma/dev.db';
export const JWT_SECRET: string = process.env.JWT_SECRET || 'dev_jwt_secret_change_in_production';
export const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '24h';
export const PORT: number = parseInt(process.env.PORT || '3000', 10);
export const NODE_ENV: string = process.env.NODE_ENV || 'development';
export const CORS_ORIGIN: string = process.env.CORS_ORIGIN || 'http://localhost:5173';
export const UPLOAD_DIR: string = process.env.UPLOAD_DIR || 'uploads/products';
export const MAX_FILE_SIZE: number = parseInt(process.env.MAX_FILE_SIZE || '5242880', 10);
