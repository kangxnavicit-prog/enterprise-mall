// Enterprise Mall - Frontend Type Definitions (Unified Export)

export type { User, PointRecord, AuthState } from './user';
export type { Product, Category, CartItemWithProduct } from './product';
export type { Order, OrderItem, OrderStatusType, CreateOrderPayload } from './order';
export type { ApiResponse, PaginatedData, PaginatedResponse } from './api';

// Re-export enums as const objects for frontend use
export const OrderStatus = {
  PENDING: 'PENDING',
  SHIPPED: 'SHIPPED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export const ProductStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export const PointType = {
  GRANT: 'GRANT',
  CONSUME: 'CONSUME',
  REFUND: 'REFUND',
  ADJUST: 'ADJUST',
} as const;

export const UserRole = {
  EMPLOYEE: 'EMPLOYEE',
  ADMIN: 'ADMIN',
} as const;

// Dashboard stats type
export interface DashboardStats {
  todayOrderCount: number;
  monthlyPointsConsumed: number;
  pendingShipmentCount: number;
  topProducts: TopProduct[];
  totalUsers: number;
  totalProducts: number;
}

export interface TopProduct {
  id: number;
  name: string;
  images: string[];
  pointsPrice: number;
  stock: number;
  totalSold: number;
  category: { name: string };
}
