// Enterprise Mall - Order Store (Zustand)
// Manages order list, current order, and order filters

import { create } from 'zustand';
import { Order } from '../types/order';
import { createOrder as createOrderApi, getOrders as getOrdersApi, getOrderById as getOrderByIdApi } from '../api/order';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  total: number;
  page: number;
  pageSize: number;
  statusFilter: string | undefined;
  loading: boolean;
  error: string | null;

  // Actions
  fetchOrders: (params?: { status?: string; page?: number; pageSize?: number }) => Promise<void>;
  fetchOrderById: (id: number) => Promise<void>;
  createOrder: (payload: { address: string; remark?: string }) => Promise<Order>;
  setStatusFilter: (status: string | undefined) => void;
  setPage: (page: number) => void;
  clearCurrentOrder: () => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  currentOrder: null,
  total: 0,
  page: 1,
  pageSize: 10,
  statusFilter: undefined,
  loading: false,
  error: null,

  fetchOrders: async (params?: { status?: string; page?: number; pageSize?: number }) => {
    set({ loading: true, error: null });
    try {
      const status = params?.status || get().statusFilter;
      const page = params?.page || get().page;
      const pageSize = params?.pageSize || get().pageSize;

      const response = await getOrdersApi({ status, page, pageSize });

      set({
        orders: response.data!.items,
        total: response.data!.total,
        page: response.data!.page,
        pageSize: response.data!.pageSize,
        statusFilter: status,
        loading: false,
      });
    } catch (error: any) {
      set({ loading: false, error: error?.message || 'Failed to fetch orders' });
    }
  },

  fetchOrderById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await getOrderByIdApi(id);
      set({ currentOrder: response.data, loading: false });
    } catch (error: any) {
      set({ loading: false, error: error?.message || 'Failed to fetch order' });
    }
  },

  createOrder: async (payload: { address: string; remark?: string }) => {
    set({ loading: true, error: null });
    try {
      const response = await createOrderApi(payload);
      const order: Order = response.data!;
      set({ currentOrder: order, loading: false });
      return order;
    } catch (error: any) {
      set({ loading: false, error: error?.message || 'Failed to create order' });
      throw error;
    }
  },

  setStatusFilter: (status: string | undefined) => {
    set({ statusFilter: status, page: 1 });
    get().fetchOrders({ status, page: 1 });
  },

  setPage: (page: number) => {
    set({ page });
    get().fetchOrders({ status: get().statusFilter, page });
  },

  clearCurrentOrder: () => {
    set({ currentOrder: null });
  },
}));
