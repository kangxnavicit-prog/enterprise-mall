// Enterprise Mall - Admin Product Controller
// Handles admin product CRUD and image upload operations

import { Request, Response, NextFunction } from 'express';
import { adminProductService } from '../services/adminProductService';
import { success } from '../utils/response';
import { CreateProductBody, UpdateProductBody, RequestUser } from '../types';
import { createBadRequestError } from '../utils/errors';
import { paginationValidation, validate } from '../middleware/validate';

/** Create a new product */
export async function createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body: CreateProductBody = req.body;
    const product = await adminProductService.createProduct(body);
    success(res, product, 'Product created successfully');
  } catch (error) {
    next(error);
  }
}

/** Update an existing product */
export async function updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const productId: number = parseInt(req.params.id, 10);
    if (isNaN(productId)) {
      next(createBadRequestError('Invalid product ID'));
      return;
    }

    const body: UpdateProductBody = req.body;
    const product = await adminProductService.updateProduct(productId, body);
    success(res, product, 'Product updated successfully');
  } catch (error) {
    next(error);
  }
}

/** Delete a product (soft delete by setting status to INACTIVE) */
export async function deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const productId: number = parseInt(req.params.id, 10);
    if (isNaN(productId)) {
      next(createBadRequestError('Invalid product ID'));
      return;
    }

    await adminProductService.deleteProduct(productId);
    success(res, null, 'Product deleted successfully');
  } catch (error) {
    next(error);
  }
}

/** Upload product images */
export async function uploadImages(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const productId: number = parseInt(req.params.id, 10);
    if (isNaN(productId)) {
      next(createBadRequestError('Invalid product ID'));
      return;
    }

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      next(createBadRequestError('No images uploaded'));
      return;
    }

    const imageUrls: string[] = files.map((file: Express.Multer.File) => `/uploads/products/${file.filename}`);
    const updatedProduct = await adminProductService.uploadImages(productId, imageUrls);
    success(res, updatedProduct, 'Images uploaded successfully');
  } catch (error) {
    next(error);
  }
}

/** List all products for admin (no status filter — includes INACTIVE) */
export async function listProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page: number = parseInt(req.query.page as string) || 1;
    const pageSize: number = parseInt(req.query.pageSize as string) || 20;
    const search: string | undefined = req.query.search as string | undefined;

    const result = await adminProductService.listProducts({ page, pageSize, search });
    success(res, result, 'Products retrieved successfully');
  } catch (error) {
    next(error);
  }
}

export const adminProductController = { createProduct, updateProduct, deleteProduct, uploadImages, listProducts };
