// Enterprise Mall - Product Service
// Handles product listing with filtering/search/pagination and product detail retrieval

import { prisma } from '../config/database';
import { ProductQuery } from '../types';
import { createNotFoundError } from '../utils/errors';
import { PaginatedData } from '../utils/response';

/**
 * Get products with optional category filter, search, and pagination.
 * Only returns ACTIVE products for employee browsing.
 * @param query - Filter and pagination parameters
 * @returns Paginated list of products with category info
 */
export async function getProducts(query: ProductQuery): Promise<PaginatedData<any>> {
  const page: number = query.page ?? 1;
  const pageSize: number = query.pageSize ?? 20;
  const skip: number = (page - 1) * pageSize;

  // Build where clause
  const where: any = {
    status: 'ACTIVE',
  };

  if (query.category !== undefined) {
    where.categoryId = query.category;
  }

  if (query.search) {
    where.name = {
      contains: query.search,
    };
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items: products,
    total,
    page,
    pageSize,
  };
}

/**
 * Get a single product by ID, including category info.
 * @param productId - Product ID
 * @returns Product with category data
 */
export async function getProductById(productId: number): Promise<any> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          icon: true,
        },
      },
    },
  });

  if (!product) {
    throw createNotFoundError('Product not found');
  }

  return product;
}

export const productService = { getProducts, getProductById };
