// Enterprise Mall - Order API
// Order creation and retrieval API calls

import apiClient from './client';
import { ApiResponse, PaginatedResponse } from '../types/api';
import { Order, CreateOrderPayload } from '../types/order';

interface OrderQueryParams {
  status?: string;
  page?: number;
  pageSize?: number;
}

/** Create a new order (checkout) */
export async function createOrder(payload: CreateOrderPayload): Promise<ApiResponse<Order>> {
  return apiClient.post('/orders', payload);
}

/** Get user's order list with optional filtering */
export async function getOrders(params?: OrderQueryParams): Promise<PaginatedResponse<Order>> {
  return apiClient.get('/orders', { params });
}

/** Get order detail by ID */
export async function getOrderById(id: number): Promise<ApiResponse<Order>> {
  return apiClient.get(`/orders/${id}`);
}
