// Enterprise Mall - Admin Store (Zustand)
// Manages admin dashboard stats, product editing, and loading states

import { create } from 'zustand';
import { DashboardStats } from '../types';
import { Product, Category, ImportResult } from '../types/product';
import { Order } from '../types/order';
import { User } from '../types/user';
import * as adminApi from '../api/admin';

interface AdminState {
  // Dashboard
  dashboardStats: DashboardStats | null;
  dashboardLoading: boolean;

  // Products
  editingProduct: Product | null;
  productLoading: boolean;

  // Admin Products list
  adminProducts: Product[];
  adminProductTotal: number;
  adminProductLoading: boolean;

  // Categories
  categories: Category[];
  categoryLoading: boolean;

  // Orders
  adminOrders: Order[];
  adminOrderTotal: number;
  adminOrderLoading: boolean;

  // Users
  adminUsers: User[];
  adminUserTotal: number;
  adminUserLoading: boolean;

  // Import
  importLoading: boolean;

  error: string | null;

  // Actions
  fetchDashboard: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  createProduct: (data: any) => Promise<Product>;
  updateProduct: (id: number, data: any) => Promise<Product>;
  deleteProduct: (id: number) => Promise<void>;
  fetchAdminProducts: (params?: any) => Promise<void>;
  importProducts: (file: File) => Promise<ImportResult>;
  setEditingProduct: (product: Product | null) => void;
  fetchAdminOrders: (params?: any) => Promise<void>;
  updateOrderStatus: (id: number, data: any) => Promise<Order>;
  fetchAdminUsers: (params?: any) => Promise<void>;
  adjustUserPoints: (userId: number, data: any) => Promise<any>;
  createCategory: (data: any) => Promise<Category>;
  updateCategory: (id: number, data: any) => Promise<Category>;
  deleteCategory: (id: number) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  dashboardStats: null,
  dashboardLoading: false,
  editingProduct: null,
  productLoading: false,
  adminProducts: [],
  adminProductTotal: 0,
  adminProductLoading: false,
  categories: [],
  categoryLoading: false,
  adminOrders: [],
  adminOrderTotal: 0,
  adminOrderLoading: false,
  adminUsers: [],
  adminUserTotal: 0,
  adminUserLoading: false,
  importLoading: false,
  error: null,

  fetchDashboard: async () => {
    set({ dashboardLoading: true, error: null });
    try {
      const response = await adminApi.getDashboardStats();
      set({ dashboardStats: response.data!, dashboardLoading: false });
    } catch (error: any) {
      set({ dashboardLoading: false, error: error?.message || 'Failed to fetch dashboard' });
    }
  },

  fetchCategories: async () => {
    set({ categoryLoading: true, error: null });
    try {
      const response = await adminApi.getCategories();
      set({ categories: response.data! || [], categoryLoading: false });
    } catch (error: any) {
      set({ categoryLoading: false, error: error?.message || 'Failed to fetch categories' });
    }
  },

  createProduct: async (data: any) => {
    set({ productLoading: true, error: null });
    try {
      const response = await adminApi.createProduct(data);
      set({ productLoading: false });
      return response.data!;
    } catch (error: any) {
      set({ productLoading: false, error: error?.message || 'Failed to create product' });
      throw error;
    }
  },

  updateProduct: async (id: number, data: any) => {
    set({ productLoading: true, error: null });
    try {
      const response = await adminApi.updateProduct(id, data);
      set({ productLoading: false });
      return response.data!;
    } catch (error: any) {
      set({ productLoading: false, error: error?.message || 'Failed to update product' });
      throw error;
    }
  },

  deleteProduct: async (id: number) => {
    set({ productLoading: true, error: null });
    try {
      await adminApi.deleteProduct(id);
      set({ productLoading: false });
    } catch (error: any) {
      set({ productLoading: false, error: error?.message || 'Failed to delete product' });
      throw error;
    }
  },

  fetchAdminProducts: async (params?: any) => {
    set({ adminProductLoading: true, error: null });
    try {
      const response = await adminApi.getAdminProducts(params);
      set({
        adminProducts: response.data!.items,
        adminProductTotal: response.data!.total,
        adminProductLoading: false,
      });
    } catch (error: any) {
      set({ adminProductLoading: false, error: error?.message || 'Failed to fetch admin products' });
    }
  },

  importProducts: async (file: File) => {
    set({ importLoading: true, error: null });
    try {
      const response = await adminApi.importProducts(file);
      set({ importLoading: false });
      return response.data!;
    } catch (error: any) {
      set({ importLoading: false, error: error?.message || 'Failed to import products' });
      throw error;
    }
  },

  setEditingProduct: (product: Product | null) => {
    set({ editingProduct: product });
  },

  fetchAdminOrders: async (params?: any) => {
    set({ adminOrderLoading: true, error: null });
    try {
      const response = await adminApi.getAdminOrders(params);
      set({
        adminOrders: response.data!.items,
        adminOrderTotal: response.data!.total,
        adminOrderLoading: false,
      });
    } catch (error: any) {
      set({ adminOrderLoading: false, error: error?.message || 'Failed to fetch orders' });
    }
  },

  updateOrderStatus: async (id: number, data: any) => {
    try {
      const response = await adminApi.updateOrderStatus(id, data);
      // Refresh order list after status update
      await get().fetchAdminOrders();
      return response.data!;
    } catch (error: any) {
      set({ error: error?.message || 'Failed to update order' });
      throw error;
    }
  },

  fetchAdminUsers: async (params?: any) => {
    set({ adminUserLoading: true, error: null });
    try {
      const response = await adminApi.getAdminUsers(params);
      set({
        adminUsers: response.data!.items,
        adminUserTotal: response.data!.total,
        adminUserLoading: false,
      });
    } catch (error: any) {
      set({ adminUserLoading: false, error: error?.message || 'Failed to fetch users' });
    }
  },

  adjustUserPoints: async (userId: number, data: any) => {
    try {
      const response = await adminApi.adjustUserPoints(userId, data);
      // Refresh user list after points adjustment
      await get().fetchAdminUsers();
      return response.data!;
    } catch (error: any) {
      set({ error: error?.message || 'Failed to adjust points' });
      throw error;
    }
  },

  createCategory: async (data: any) => {
    set({ categoryLoading: true, error: null });
    try {
      const response = await adminApi.createCategory(data);
      await get().fetchCategories();
      return response.data!;
    } catch (error: any) {
      set({ categoryLoading: false, error: error?.message || 'Failed to create category' });
      throw error;
    }
  },

  updateCategory: async (id: number, data: any) => {
    set({ categoryLoading: true, error: null });
    try {
      const response = await adminApi.updateCategory(id, data);
      await get().fetchCategories();
      return response.data!;
    } catch (error: any) {
      set({ categoryLoading: false, error: error?.message || 'Failed to update category' });
      throw error;
    }
  },

  deleteCategory: async (id: number) => {
    set({ categoryLoading: true, error: null });
    try {
      await adminApi.deleteCategory(id);
      await get().fetchCategories();
    } catch (error: any) {
      set({ categoryLoading: false, error: error?.message || 'Failed to delete category' });
      throw error;
    }
  },
}));
