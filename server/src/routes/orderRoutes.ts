// Enterprise Mall - Order Routes
// POST /api/orders, GET /api/orders, GET /api/orders/:id

import express from 'express';
import { orderController } from '../controllers/orderController';
import { createOrderValidation, paginationValidation, validate } from '../middleware/validate';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// All order routes require authentication
router.use(authMiddleware);

/** Create a new order (checkout) */
router.post('/', createOrderValidation, validate, orderController.createOrder);

/** Get user's order list with optional filtering */
router.get('/', paginationValidation, validate, orderController.getOrders);

/** Get order detail by ID */
router.get('/:id', orderController.getOrderById);

export { router as orderRoutes };
