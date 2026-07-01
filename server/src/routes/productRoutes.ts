// Enterprise Mall - Product Routes
// GET /api/products, GET /api/products/:id (public routes)

import express from 'express';
import { productController } from '../controllers/productController';
import { paginationValidation, validate } from '../middleware/validate';

const router = express.Router();

/** Get product list with optional filtering, search, and pagination */
router.get('/', paginationValidation, validate, productController.getProducts);

/** Get single product detail by ID */
router.get('/:id', productController.getProductById);

export { router as productRoutes };
