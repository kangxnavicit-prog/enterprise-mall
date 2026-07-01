// Enterprise Mall - Admin Category Controller
// Handles admin category CRUD operations

import { Request, Response, NextFunction } from 'express';
import { adminCategoryService } from '../services/adminCategoryService';
import { success } from '../utils/response';
import { CreateCategoryBody, UpdateCategoryBody } from '../types';
import { createBadRequestError } from '../utils/errors';

/** Get all categories */
export async function getCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const categories = await adminCategoryService.getCategories();
    success(res, categories);
  } catch (error) {
    next(error);
  }
}

/** Create a new category */
export async function createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body: CreateCategoryBody = req.body;
    const category = await adminCategoryService.createCategory(body);
    success(res, category, 'Category created successfully');
  } catch (error) {
    next(error);
  }
}

/** Update a category */
export async function updateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const categoryId: number = parseInt(req.params.id, 10);
    if (isNaN(categoryId)) {
      next(createBadRequestError('Invalid category ID'));
      return;
    }

    const body: UpdateCategoryBody = req.body;
    const category = await adminCategoryService.updateCategory(categoryId, body);
    success(res, category, 'Category updated successfully');
  } catch (error) {
    next(error);
  }
}

/** Delete a category */
export async function deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const categoryId: number = parseInt(req.params.id, 10);
    if (isNaN(categoryId)) {
      next(createBadRequestError('Invalid category ID'));
      return;
    }

    await adminCategoryService.deleteCategory(categoryId);
    success(res, null, 'Category deleted successfully');
  } catch (error) {
    next(error);
  }
}

export const adminCategoryController = { getCategories, createCategory, updateCategory, deleteCategory };
