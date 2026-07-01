// Enterprise Mall - Cart Store (Zustand)
// Manages cart state with localStorage persistence and derived totalPoints

import { create } from 'zustand';
import { CartItemWithProduct } from '../types/product';
import { getCart as getCartApi, addToCart as addToCartApi, updateCartItem as updateCartItemApi, removeFromCart as removeFromCartApi } from '../api/cart';
import { CART_STORAGE_KEY } from '../utils/constants';

interface CartState {
  items: CartItemWithProduct[];
  loading: boolean;
  error: string | null;

  // Computed (via get())
  totalPoints: () => number;
  itemCount: () => number;

  // Actions
  fetchCart: () => Promise<void>;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  updateItem: (cartItemId: number, quantity: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
  clearLocalCart: () => void;
  syncWithServer: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  // Derived: calculate total points from cart items
  totalPoints: () => {
    return get().items.reduce(
      (sum: number, item: CartItemWithProduct) => sum + item.product.pointsPrice * item.quantity,
      0
    );
  },

  // Derived: count total number of items
  itemCount: () => {
    return get().items.reduce(
      (sum: number, item: CartItemWithProduct) => sum + item.quantity,
      0
    );
  },

  fetchCart: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getCartApi();
      const items: CartItemWithProduct[] = response.data || [];
      set({ items, loading: false });
      // Persist to localStorage
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error: any) {
      set({ loading: false, error: error?.message || 'Failed to fetch cart' });
    }
  },

  addItem: async (productId: number, quantity: number = 1) => {
    set({ loading: true, error: null });
    try {
      const response = await addToCartApi(productId, quantity);
      // Refresh cart from server
      await get().fetchCart();
      set({ loading: false });
    } catch (error: any) {
      set({ loading: false, error: error?.message || 'Failed to add item' });
      throw error;
    }
  },

  updateItem: async (cartItemId: number, quantity: number) => {
    set({ loading: true, error: null });
    try {
      await updateCartItemApi(cartItemId, quantity);
      // Refresh cart from server
      await get().fetchCart();
      set({ loading: false });
    } catch (error: any) {
      set({ loading: false, error: error?.message || 'Failed to update item' });
      throw error;
    }
  },

  removeItem: async (cartItemId: number) => {
    set({ loading: true, error: null });
    try {
      await removeFromCartApi(cartItemId);
      // Refresh cart from server
      await get().fetchCart();
      set({ loading: false });
    } catch (error: any) {
      set({ loading: false, error: error?.message || 'Failed to remove item' });
      throw error;
    }
  },

  clearLocalCart: () => {
    set({ items: [], error: null });
    localStorage.removeItem(CART_STORAGE_KEY);
  },

  syncWithServer: async () => {
    // On app startup, try to sync localStorage cart with server
    try {
      await get().fetchCart();
    } catch {
      // If server fetch fails, use localStorage data
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        try {
          const items: CartItemWithProduct[] = JSON.parse(stored);
          set({ items });
        } catch {
          localStorage.removeItem(CART_STORAGE_KEY);
        }
      }
    }
  },
}));
