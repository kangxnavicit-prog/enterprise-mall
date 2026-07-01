// Enterprise Mall - Product Type Definitions

export interface Product {
  id: number;
  categoryId: number;
  name: string;
  sku: string;
  description: string | null;
  images: string[];
  pointsPrice: number;
  stock: number;
  version: number;
  status: 'ACTIVE' | 'INACTIVE';
  avgRating: number;
  createdAt: string;
  updatedAt: string;
  category?: Category;
}

export interface Category {
  id: number;
  name: string;
  icon: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface CartItemWithProduct {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: Product;
}

/** Import product result returned from backend */
export interface ImportResult {
  successCount: number;
  failCount: number;
  failures: { row: number; name: string; reason: string }[];
  createdCategories: string[];
}
