// Enterprise Mall - Admin Routes
// Mounts all admin sub-routes (products, categories, orders, users, dashboard)
// All admin routes require authentication + ADMIN role

import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { roleGuardMiddleware } from '../middleware/roleGuard';
import { Role } from '../types/enums';
import { adminProductController } from '../controllers/adminProductController';
import { adminCategoryController } from '../controllers/adminCategoryController';
import { adminOrderController } from '../controllers/adminOrderController';
import { adminUserController } from '../controllers/adminUserController';
import { adminDashboardController } from '../controllers/adminDashboardController';
import {
  createProductValidation,
  updateProductValidation,
  createCategoryValidation,
  updateCategoryValidation,
  updateOrderValidation,
  adjustPointsValidation,
  paginationValidation,
  validate,
} from '../middleware/validate';
import { uploadMultiple } from '../middleware/upload';
import { uploadXlsx } from '../middleware/uploadXlsx';
import { adminProductImportController } from '../controllers/adminProductImportController';

const router = express.Router();

// All admin routes require authentication + ADMIN role
router.use(authMiddleware);
router.use(roleGuardMiddleware([Role.ADMIN]));

// ── Admin Product Routes ──

/** Get all products (admin, no status filter) */
router.get('/products', paginationValidation, validate, adminProductController.listProducts);

/** Create a new product */
router.post('/products', createProductValidation, validate, adminProductController.createProduct);

/** Update an existing product */
router.put('/products/:id', updateProductValidation, validate, adminProductController.updateProduct);

/** Delete a product */
router.delete('/products/:id', adminProductController.deleteProduct);

/** Upload product images */
router.post('/products/:id/images', uploadMultiple.array('images', 5), adminProductController.uploadImages);

/** Import products from xlsx file */
router.post('/products/import', uploadXlsx.single('file'), adminProductImportController.importProducts);

// ── Admin Category Routes ──

/** Get all categories */
router.get('/categories', adminCategoryController.getCategories);

/** Create a new category */
router.post('/categories', createCategoryValidation, validate, adminCategoryController.createCategory);

/** Update a category */
router.put('/categories/:id', updateCategoryValidation, validate, adminCategoryController.updateCategory);

/** Delete a category */
router.delete('/categories/:id', adminCategoryController.deleteCategory);

// ── Admin Order Routes ──

/** Get all orders (with filtering) */
router.get('/orders', paginationValidation, validate, adminOrderController.getOrders);

/** Update order status (ship/complete) */
router.put('/orders/:id', updateOrderValidation, validate, adminOrderController.updateOrderStatus);

// ── Admin User Routes ──

/** Get user list */
router.get('/users', paginationValidation, validate, adminUserController.getUsers);

/** Adjust user points (grant/adjust) */
router.put('/users/:id/points', adjustPointsValidation, validate, adminUserController.adjustPoints);

// ── Admin Dashboard ──

/** Get dashboard statistics */
router.get('/dashboard', adminDashboardController.getStats);

export { router as adminRoutes };
