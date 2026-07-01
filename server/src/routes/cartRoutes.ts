// Enterprise Mall - Cart Routes
// GET /api/cart, POST /api/cart, PUT /api/cart/:id, DELETE /api/cart/:id

import express from 'express';
import { cartController } from '../controllers/cartController';
import { cartItemValidation, validate } from '../middleware/validate';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// All cart routes require authentication
router.use(authMiddleware);

/** Get current user's cart items */
router.get('/', cartController.getCart);

/** Add item to cart */
router.post('/', cartItemValidation, validate, cartController.addItem);

/** Update cart item quantity */
router.put('/:id', cartItemValidation, validate, cartController.updateItem);

/** Remove item from cart */
router.delete('/:id', cartController.removeItem);

export { router as cartRoutes };
