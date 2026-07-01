// Enterprise Mall - useCart Hook
// Provides convenient access to cart state and derived values

import { useEffect } from 'react';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';

export function useCart() {
  const cartStore = useCartStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Fetch cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      cartStore.fetchCart();
    } else {
      cartStore.clearLocalCart();
    }
  }, [isAuthenticated]);

  return {
    items: cartStore.items,
    totalPoints: cartStore.totalPoints(),
    itemCount: cartStore.itemCount(),
    loading: cartStore.loading,
    error: cartStore.error,
    addItem: cartStore.addItem,
    updateItem: cartStore.updateItem,
    removeItem: cartStore.removeItem,
    clearLocalCart: cartStore.clearLocalCart,
    fetchCart: cartStore.fetchCart,
  };
}
