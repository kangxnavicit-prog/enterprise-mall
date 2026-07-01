// Enterprise Mall - Admin Product Import Controller
// Handles the HTTP request/response for batch product import from xlsx files

import { Request, Response, NextFunction } from 'express';
import { adminProductImportService } from '../services/adminProductImportService';
import { success } from '../utils/response';
import { createBadRequestError } from '../utils/errors';

/**
 * Import products from an uploaded xlsx file.
 * Expects a single file upload via multer with field name 'file'.
 */
export async function importProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const file = req.file as Express.Multer.File | undefined;

    if (!file) {
      next(createBadRequestError('No file uploaded'));
      return;
    }

    if (!file.buffer || file.buffer.length === 0) {
      next(createBadRequestError('Uploaded file is empty'));
      return;
    }

    const result = await adminProductImportService.importProducts(file.buffer);
    success(res, result, 'Import completed');
  } catch (error) {
    next(error);
  }
}

export const adminProductImportController = { importProducts };
