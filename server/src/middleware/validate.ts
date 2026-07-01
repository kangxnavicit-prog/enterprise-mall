// Enterprise Mall - Request Validation Middleware
// Provides reusable validation chains using express-validator for common request fields

import { body, query, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { createBadRequestError } from '../utils/errors';

/**
 * Middleware that checks express-validator validation results.
 * If any validation fails, throws a BadRequestError with the first error message.
 */
export function validate(req: Request, _res: Response, next: NextFunction): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    next(createBadRequestError(firstError.msg));
    return;
  }
  next();
}

/** Validation chains for login request */
export const loginValidation: ValidationChain[] = [
  body('employeeId').trim().notEmpty().withMessage('Employee ID is required'),
  body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

/** Validation chains for add/update cart item */
export const cartItemValidation: ValidationChain[] = [
  body('productId').isInt({ min: 1 }).withMessage('Product ID must be a positive integer'),
  body('quantity').optional().isInt({ min: 1, max: 99 }).withMessage('Quantity must be between 1 and 99'),
];

/** Validation chains for creating an order */
export const createOrderValidation: ValidationChain[] = [
  body('address').optional().trim().isLength({ max: 200 }).withMessage('Address must be under 200 characters'),
  body('remark').optional().trim().isLength({ max: 500 }).withMessage('Remark must be under 500 characters'),
];

/** Validation chains for admin creating a product */
export const createProductValidation: ValidationChain[] = [
  body('categoryId').isInt({ min: 1 }).withMessage('Category ID must be a positive integer'),
  body('name').trim().notEmpty().withMessage('Product name is required').isLength({ max: 100 }).withMessage('Product name must be under 100 characters'),
  body('description').optional().trim().isLength({ max: 2000 }).withMessage('Description must be under 2000 characters'),
  body('pointsPrice').isInt({ min: 1 }).withMessage('Points price must be a positive integer'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
];

/** Validation chains for admin updating a product */
export const updateProductValidation: ValidationChain[] = [
  body('categoryId').optional().isInt({ min: 1 }).withMessage('Category ID must be a positive integer'),
  body('name').optional().trim().isLength({ max: 100 }).withMessage('Product name must be under 100 characters'),
  body('description').optional().trim().isLength({ max: 2000 }).withMessage('Description must be under 2000 characters'),
  body('pointsPrice').optional().isInt({ min: 1 }).withMessage('Points price must be a positive integer'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
];

/** Validation chains for admin creating a category */
export const createCategoryValidation: ValidationChain[] = [
  body('name').trim().notEmpty().withMessage('Category name is required').isLength({ max: 50 }).withMessage('Category name must be under 50 characters'),
  body('icon').optional().trim(),
  body('sortOrder').optional().isInt({ min: 0 }).withMessage('Sort order must be a non-negative integer'),
];

/** Validation chains for admin updating a category */
export const updateCategoryValidation: ValidationChain[] = [
  body('name').optional().trim().isLength({ max: 50 }).withMessage('Category name must be under 50 characters'),
  body('icon').optional().trim(),
  body('sortOrder').optional().isInt({ min: 0 }).withMessage('Sort order must be a non-negative integer'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
];

/** Validation chains for admin updating an order */
export const updateOrderValidation: ValidationChain[] = [
  body('status').optional().isIn(['PENDING', 'SHIPPED', 'COMPLETED', 'CANCELLED']).withMessage('Invalid order status'),
  body('trackingNo').optional().trim().isLength({ max: 50 }).withMessage('Tracking number must be under 50 characters'),
];

/** Validation chains for admin adjusting user points */
export const adjustPointsValidation: ValidationChain[] = [
  body('points').isInt({ min: 1 }).withMessage('Points must be a positive integer'),
  body('type').isIn(['GRANT', 'ADJUST']).withMessage('Type must be GRANT or ADJUST'),
  body('reason').optional().trim().isLength({ max: 200 }).withMessage('Reason must be under 200 characters'),
];

/** Validation chains for pagination query parameters */
export const paginationValidation: ValidationChain[] = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('pageSize').optional().isInt({ min: 1, max: 100 }).withMessage('PageSize must be between 1 and 100'),
];

/** Validation chains for user profile update */
export const updateProfileValidation: ValidationChain[] = [
  body('username').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Username must be between 2 and 50 characters'),
  body('address').optional().trim().isLength({ max: 200 }).withMessage('Address must be under 200 characters'),
  body('department').optional().trim().isLength({ max: 50 }).withMessage('Department must be under 50 characters'),
];
