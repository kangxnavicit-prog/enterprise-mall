// Enterprise Mall - Product API
// Product list and detail API calls

import apiClient from './client';
import { ApiResponse, PaginatedResponse } from '../types/api';
import { Product } from '../types/product';

interface ProductQueryParams {
  category?: number;
  search?: string;
  page?: number;
  pageSize?: number;
}

/** Get product list with filtering and pagination */
export async function getProducts(params?: ProductQueryParams): Promise<PaginatedResponse<Product>> {
  return apiClient.get('/products', { params });
}

/** Get single product detail by ID */
export async function getProductById(id: number): Promise<ApiResponse<Product>> {
  return apiClient.get(`/products/${id}`);
}
