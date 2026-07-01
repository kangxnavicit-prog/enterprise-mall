// Enterprise Mall - TypeScript Type Definitions
// Defines all shared types used across controllers, services, and middleware

import { Role, OrderStatus, ProductStatus, PointType } from './enums';

// Re-export enums for convenient access from '../types'
export { Role, OrderStatus, ProductStatus, PointType } from './enums';

// Augment Express Request type to include user property from auth middleware
declare global {
  namespace Express {
    interface Request {
      user?: import('./index').RequestUser;
    }
  }
}

/** Request user info attached by auth middleware */
export interface RequestUser {
  id: number;
  role: Role;
  employeeId: string;
}

/** Login request body */
export interface LoginBody {
  employeeId: string;
  password: string;
}

/** Add/Update cart item request body */
export interface CartItemBody {
  productId: number;
  quantity?: number;
}

/** Create order request body */
export interface CreateOrderBody {
  address?: string;
  remark?: string;
}

/** Admin: Update product request body */
export interface UpdateProductBody {
  categoryId?: number;
  name?: string;
  description?: string;
  pointsPrice?: number;
  stock?: number;
  status?: ProductStatus;
}

/** Admin: Create product request body */
export interface CreateProductBody {
  categoryId: number;
  name: string;
  sku?: string;
  description?: string;
  pointsPrice: number;
  stock?: number;
  status?: ProductStatus;
}

/** Admin: Create category request body */
export interface CreateCategoryBody {
  name: string;
  icon?: string;
  sortOrder?: number;
}

/** Admin: Update category request body */
export interface UpdateCategoryBody {
  name?: string;
  icon?: string;
  sortOrder?: number;
  isActive?: boolean;
}

/** Admin: Update order request body */
export interface UpdateOrderBody {
  status?: OrderStatus;
  trackingNo?: string;
}

/** Admin: Adjust user points request body */
export interface AdjustPointsBody {
  points: number;
  type: PointType;
  reason?: string;
}

/** Pagination query parameters */
export interface PaginationQuery {
  page?: number;
  pageSize?: number;
}

/** Product filter query parameters */
export interface ProductQuery extends PaginationQuery {
  category?: number;
  search?: string;
}

/** Order filter query parameters */
export interface OrderQuery extends PaginationQuery {
  status?: OrderStatus;
}

/** Admin order filter query parameters */
export interface AdminOrderQuery extends PaginationQuery {
  status?: OrderStatus;
  userId?: number;
}

/** Import product row parsed from Excel */
export interface ImportProductRow {
  rowIndex: number;
  name: string;
  sku: string;
  pointsPrice: number;
  stock: number;
  categoryName: string;
  imageUrl: string;
}

/** Import product failure detail */
export interface ImportFailure {
  row: number;
  name: string;
  reason: string;
}

/** Import product result returned to client */
export interface ImportProductResult {
  successCount: number;
  failCount: number;
  failures: ImportFailure[];
  createdCategories: string[];
}
