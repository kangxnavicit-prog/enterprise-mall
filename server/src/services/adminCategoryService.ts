// Enterprise Mall - Admin Category Service
// Handles admin category CRUD operations

import { prisma } from '../config/database';
import { CreateCategoryBody, UpdateCategoryBody } from '../types';
import { createNotFoundError, createConflictError } from '../utils/errors';

/**
 * Get all categories (including inactive ones for admin management).
 * @returns Array of all categories
 */
export async function getCategories(): Promise<any[]> {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  return categories;
}

/**
 * Create a new category.
 * @param data - Category creation data
 * @returns Created category
 */
export async function createCategory(data: CreateCategoryBody): Promise<any> {
  // Check for duplicate name
  const existingCategory = await prisma.category.findUnique({
    where: { name: data.name },
  });

  if (existingCategory) {
    throw createConflictError('Category name already exists');
  }

  const category = await prisma.category.create({
    data: {
      name: data.name,
      icon: data.icon ?? null,
      sortOrder: data.sortOrder ?? 0,
    },
  });

  return category;
}

/**
 * Update an existing category.
 * @param categoryId - Category ID to update
 * @param data - Partial category update data
 * @returns Updated category
 */
export async function updateCategory(categoryId: number, data: UpdateCategoryBody): Promise<any> {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw createNotFoundError('Category not found');
  }

  // Check for duplicate name if name is being changed
  if (data.name) {
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: data.name,
        id: { not: categoryId },
      },
    });

    if (existingCategory) {
      throw createConflictError('Category name already exists');
    }
  }

  const updatedCategory = await prisma.category.update({
    where: { id: categoryId },
    data: {
      name: data.name,
      icon: data.icon,
      sortOrder: data.sortOrder,
      isActive: data.isActive,
    },
  });

  return updatedCategory;
}

/**
 * Delete a category.
 * Will fail if category has active products.
 * @param categoryId - Category ID to delete
 */
export async function deleteCategory(categoryId: number): Promise<void> {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: {
      products: {
        where: { status: 'ACTIVE' },
        select: { id: true },
      },
    },
  });

  if (!category) {
    throw createNotFoundError('Category not found');
  }

  // Prevent deletion if category has active products
  if (category.products.length > 0) {
    throw createConflictError('Cannot delete category with active products');
  }

  // Soft delete: set isActive to false
  await prisma.category.update({
    where: { id: categoryId },
    data: { isActive: false },
  });
}

export const adminCategoryService = { getCategories, createCategory, updateCategory, deleteCategory };
