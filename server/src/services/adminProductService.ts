// Enterprise Mall - Admin Product Service
// Handles admin product CRUD operations and image management

import { prisma, parseJsonArray, stringifyJsonArray } from '../config/database';
import { CreateProductBody, UpdateProductBody } from '../types';
import { createNotFoundError, createConflictError } from '../utils/errors';

/**
 * Create a new product.
 * @param data - Product creation data
 * @returns Created product
 */
export async function createProduct(data: CreateProductBody): Promise<any> {
  // Verify category exists
  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
  });

  if (!category) {
    throw createNotFoundError('Category not found');
  }

  const product = await prisma.product.create({
    data: {
      categoryId: data.categoryId,
      name: data.name,
      sku: data.sku ?? '',
      description: data.description ?? null,
      images: "[]",
      pointsPrice: data.pointsPrice,
      stock: data.stock ?? 0,
      status: data.status ?? 'ACTIVE',
    },
    include: {
      category: {
        select: { id: true, name: true },
      },
    },
  });

  return product;
}

/**
 * Update an existing product.
 * @param productId - Product ID to update
 * @param data - Partial product update data
 * @returns Updated product
 */
export async function updateProduct(productId: number, data: UpdateProductBody): Promise<any> {
  // Verify product exists
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw createNotFoundError('Product not found');
  }

  // Verify category exists if categoryId is being changed
  if (data.categoryId !== undefined) {
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw createNotFoundError('Category not found');
    }
  }

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: {
      categoryId: data.categoryId,
      name: data.name,
      description: data.description,
      pointsPrice: data.pointsPrice,
      stock: data.stock,
      status: data.status,
    },
    include: {
      category: {
        select: { id: true, name: true },
      },
    },
  });

  return updatedProduct;
}

/**
 * Delete a product (soft delete by setting status to INACTIVE).
 * @param productId - Product ID to delete
 */
export async function deleteProduct(productId: number): Promise<void> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw createNotFoundError('Product not found');
  }

  // Soft delete: set status to INACTIVE instead of removing record
  await prisma.product.update({
    where: { id: productId },
    data: { status: 'INACTIVE' },
  });
}

/**
 * Upload images to a product (append to existing images array).
 * @param productId - Product ID
 * @param imageUrls - Array of new image URL paths
 * @returns Updated product with new images
 */
export async function uploadImages(productId: number, imageUrls: string[]): Promise<any> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw createNotFoundError('Product not found');
  }

  // Append new images to existing array (parse string → array, then stringify back)
  const existingImages: string[] = parseJsonArray(product.images);
  const updatedImages: string = stringifyJsonArray([...existingImages, ...imageUrls]);

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: { images: updatedImages },
    include: {
      category: {
        select: { id: true, name: true },
      },
    },
  });

  return updatedProduct;
}

/**
 * List all products for admin (no status filter — returns ACTIVE and INACTIVE).
 * @param query - Pagination and search parameters
 * @returns Paginated list of all products
 */
export async function listProducts(query: { page?: number; pageSize?: number; search?: string }): Promise<any> {
  const page: number = query.page ?? 1;
  const pageSize: number = query.pageSize ?? 20;
  const skip: number = (page - 1) * pageSize;

  const where: any = {};
  if (query.search) {
    where.name = { contains: query.search };
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: pageSize,
      include: { category: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where }),
  ]);

  return { items: products, total, page, pageSize };
}

export const adminProductService = { createProduct, updateProduct, deleteProduct, uploadImages, listProducts };
