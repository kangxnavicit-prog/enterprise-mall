// Enterprise Mall - Admin API
// Admin operations: products, categories, orders, users, dashboard

import apiClient from './client';
import { ApiResponse, PaginatedResponse } from '../types/api';
import { Product, Category, ImportResult } from '../types/product';
import { Order } from '../types/order';
import { User } from '../types/user';
import { DashboardStats } from '../types';

// ── Admin Products ──

interface AdminProductQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

/** Get all products for admin (includes INACTIVE) */
export async function getAdminProducts(params?: AdminProductQueryParams): Promise<PaginatedResponse<Product>> {
  return apiClient.get('/admin/products', { params });
}

/** Create a new product */
export async function createProduct(data: {
  categoryId: number;
  name: string;
  description?: string;
  pointsPrice: number;
  stock?: number;
  status?: string;
}): Promise<ApiResponse<Product>> {
  return apiClient.post('/admin/products', data);
}

/** Update an existing product */
export async function updateProduct(
  id: number,
  data: {
    categoryId?: number;
    name?: string;
    description?: string;
    pointsPrice?: number;
    stock?: number;
    status?: string;
  }
): Promise<ApiResponse<Product>> {
  return apiClient.put(`/admin/products/${id}`, data);
}

/** Delete a product */
export async function deleteProduct(id: number): Promise<ApiResponse<null>> {
  return apiClient.delete(`/admin/products/${id}`);
}

/** Upload product images */
export async function uploadProductImages(id: number, files: File[]): Promise<ApiResponse<Product>> {
  const formData = new FormData();
  files.forEach((file: File) => {
    formData.append('images', file);
  });
  return apiClient.post(`/admin/products/${id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

// ── Admin Product Import ──

/** Import products from xlsx file */
export async function importProducts(file: File): Promise<ApiResponse<ImportResult>> {
  const formData = new FormData();
  formData.append('file', file);
  return apiClient.post('/admin/products/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

// ── Admin Categories ──

/** Get all categories */
export async function getCategories(): Promise<ApiResponse<Category[]>> {
  return apiClient.get('/admin/categories');
}

/** Create a new category */
export async function createCategory(data: {
  name: string;
  icon?: string;
  sortOrder?: number;
}): Promise<ApiResponse<Category>> {
  return apiClient.post('/admin/categories', data);
}

/** Update a category */
export async function updateCategory(
  id: number,
  data: { name?: string; icon?: string; sortOrder?: number; isActive?: boolean }
): Promise<ApiResponse<Category>> {
  return apiClient.put(`/admin/categories/${id}`, data);
}

/** Delete a category */
export async function deleteCategory(id: number): Promise<ApiResponse<null>> {
  return apiClient.delete(`/admin/categories/${id}`);
}

// ── Admin Orders ──

interface AdminOrderQueryParams {
  status?: string;
  userId?: number;
  page?: number;
  pageSize?: number;
}

/** Get all orders (admin) */
export async function getAdminOrders(params?: AdminOrderQueryParams): Promise<PaginatedResponse<Order>> {
  return apiClient.get('/admin/orders', { params });
}

/** Update order status (ship/complete/cancel) */
export async function updateOrderStatus(
  id: number,
  data: { status?: string; trackingNo?: string }
): Promise<ApiResponse<Order>> {
  return apiClient.put(`/admin/orders/${id}`, data);
}

// ── Admin Users ──

interface AdminUserQueryParams {
  page?: number;
  pageSize?: number;
}

/** Get user list (admin) */
export async function getAdminUsers(params?: AdminUserQueryParams): Promise<PaginatedResponse<User>> {
  return apiClient.get('/admin/users', { params });
}

/** Adjust user points (grant/adjust) */
export async function adjustUserPoints(
  id: number,
  data: { points: number; type: string; reason?: string }
): Promise<ApiResponse<{ user: User; record: any }>> {
  return apiClient.put(`/admin/users/${id}/points`, data);
}

// ── Admin Dashboard ──

/** Get dashboard statistics */
export async function getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
  return apiClient.get('/admin/dashboard');
}
