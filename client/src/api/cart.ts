// Enterprise Mall - Cart API
// Cart CRUD API calls

import apiClient from './client';
import { ApiResponse } from '../types/api';
import { CartItemWithProduct } from '../types/product';

/** Get current user's cart items */
export async function getCart(): Promise<ApiResponse<CartItemWithProduct[]>> {
  return apiClient.get('/cart');
}

/** Add item to cart */
export async function addToCart(productId: number, quantity: number = 1): Promise<ApiResponse<CartItemWithProduct>> {
  return apiClient.post('/cart', { productId, quantity });
}

/** Update cart item quantity */
export async function updateCartItem(id: number, quantity: number): Promise<ApiResponse<CartItemWithProduct>> {
  return apiClient.put(`/cart/${id}`, { quantity });
}

/** Remove item from cart */
export async function removeFromCart(id: number): Promise<ApiResponse<null>> {
  return apiClient.delete(`/cart/${id}`);
}
