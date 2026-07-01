// Enterprise Mall - API Response Utility
// Provides standardized response formatting following { code, data, message } convention

import { Response } from 'express';

/** Unified API response structure */
export interface ApiResponse<T> {
  code: number;
  data: T | null;
  message: string;
}

/** Paginated data wrapper */
export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** Standard success response codes */
export const SUCCESS_CODE = 20000;

/** Error response code ranges */
export const ERROR_CODES = {
  BAD_REQUEST: 40001,
  UNAUTHORIZED: 40100,
  FORBIDDEN: 40300,
  NOT_FOUND: 40400,
  CONFLICT: 40900,
  INTERNAL_ERROR: 50000,
};

/**
 * Send a success response with data.
 * @param res - Express Response object
 * @param data - Response payload
 * @param message - Success message (defaults to "success")
 */
export function success<T>(res: Response, data: T, message: string = 'success'): Response {
  return res.json({
    code: SUCCESS_CODE,
    data,
    message,
  });
}

/**
 * Send a success response with paginated data.
 * @param res - Express Response object
 * @param items - Array of items for current page
 * @param total - Total number of items across all pages
 * @param page - Current page number
 * @param pageSize - Items per page
 */
export function paginated<T>(
  res: Response,
  items: T[],
  total: number,
  page: number,
  pageSize: number
): Response {
  return res.json({
    code: SUCCESS_CODE,
    data: {
      items,
      total,
      page,
      pageSize,
    },
    message: 'success',
  });
}

/**
 * Send an error response.
 * @param res - Express Response object
 * @param code - Error code from ERROR_CODES
 * @param message - Error description
 * @param statusCode - HTTP status code (defaults to 400)
 */
export function error(
  res: Response,
  code: number,
  message: string,
  statusCode: number = 400
): Response {
  return res.status(statusCode).json({
    code,
    data: null,
    message,
  });
}
