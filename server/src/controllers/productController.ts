// Enterprise Mall - Product Controller
// Handles product list and detail requests (public routes)

import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/productService';
import { success, paginated } from '../utils/response';
import { ProductQuery } from '../types';
import { createBadRequestError } from '../utils/errors';

/** Get product list with filtering, search, and pagination */
export async function getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const query: ProductQuery = {
      category: req.query.category ? parseInt(req.query.category as string, 10) : undefined,
      search: req.query.search as string | undefined,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : 20,
    };

    // Validate parsed integers
    if (query.category !== undefined && isNaN(query.category)) {
      next(createBadRequestError('Invalid category parameter'));
      return;
    }
    if (query.page !== undefined && isNaN(query.page)) {
      query.page = 1;
    }
    if (query.pageSize !== undefined && isNaN(query.pageSize)) {
      query.pageSize = 20;
    }

    const result = await productService.getProducts(query);
    paginated(res, result.items, result.total, result.page, result.pageSize);
  } catch (error) {
    next(error);
  }
}

/** Get single product detail by ID */
export async function getProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const productId: number = parseInt(req.params.id, 10);

    if (isNaN(productId)) {
      next(createBadRequestError('Invalid product ID'));
      return;
    }

    const product = await productService.getProductById(productId);
    success(res, product);
  } catch (error) {
    next(error);
  }
}

export const productController = { getProducts, getProductById };
