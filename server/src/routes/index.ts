// Enterprise Mall - Route Registration
// Mounts all API sub-routes onto the Express app

import express, { Express } from 'express';
import { authRoutes } from './authRoutes';
import { productRoutes } from './productRoutes';
import { cartRoutes } from './cartRoutes';
import { orderRoutes } from './orderRoutes';
import { userRoutes } from './userRoutes';
import { adminRoutes } from './adminRoutes';

/**
 * Mount all API routes onto the Express application.
 * Route prefix: /api
 */
export function mountRoutes(app: Express): void {
  const apiRouter = express.Router();

  // Public and authenticated routes
  apiRouter.use('/auth', authRoutes);
  apiRouter.use('/products', productRoutes);
  apiRouter.use('/cart', cartRoutes);
  apiRouter.use('/orders', orderRoutes);
  apiRouter.use('/users', userRoutes);

  // Admin routes (require ADMIN role)
  apiRouter.use('/admin', adminRoutes);

  app.use('/api', apiRouter);
}
