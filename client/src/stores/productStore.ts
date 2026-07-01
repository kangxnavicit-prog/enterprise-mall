// Enterprise Mall - Product Store (Zustand)
// Manages product list, filters, search, and pagination

import { create } from 'zustand';
import { Product } from '../types/product';
import { getProducts as getProductsApi, getProductById as getProductByIdApi } from '../api/product';

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  total: number;
  page: number;
  pageSize: number;
  filters: {
    category?: number;
    search?: string;
  };
  loading: boolean;
  error: string | null;

  // Actions
  fetchProducts: (filters?: { category?: number; search?: string; page?: number; pageSize?: number }) => Promise<void>;
  fetchProductById: (id: number) => Promise<void>;
  setFilters: (filters: { category?: number; search?: string }) => void;
  setPage: (page: number) => void;
  clearCurrentProduct: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  currentProduct: null,
  total: 0,
  page: 1,
  pageSize: 20,
  filters: {},
  loading: false,
  error: null,

  fetchProducts: async (filters?: { category?: number; search?: string; page?: number; pageSize?: number }) => {
    set({ loading: true, error: null });
    try {
      const currentFilters = filters || get().filters;
      const currentPage = filters?.page || get().page;
      const currentPageSize = filters?.pageSize || get().pageSize;

      const response = await getProductsApi({
        ...currentFilters,
        page: currentPage,
        pageSize: currentPageSize,
      });

      set({
        products: response.data!.items,
        total: response.data!.total,
        page: response.data!.page,
        pageSize: response.data!.pageSize,
        filters: currentFilters,
        loading: false,
      });
    } catch (error: any) {
      set({ loading: false, error: error?.message || 'Failed to fetch products' });
    }
  },

  fetchProductById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await getProductByIdApi(id);
      set({ currentProduct: response.data, loading: false });
    } catch (error: any) {
      set({ loading: false, error: error?.message || 'Failed to fetch product' });
    }
  },

  setFilters: (filters: { category?: number; search?: string }) => {
    set({ filters, page: 1 });
    get().fetchProducts(filters);
  },

  setPage: (page: number) => {
    set({ page });
    get().fetchProducts({ ...get().filters, page });
  },

  clearCurrentProduct: () => {
    set({ currentProduct: null });
  },
}));
