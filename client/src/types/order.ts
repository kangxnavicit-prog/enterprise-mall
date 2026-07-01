// Enterprise Mall - Order Type Definitions

export type OrderStatusType = 'PENDING' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';

export interface Order {
  id: number;
  orderNo: string;
  userId: number;
  totalPoints: number;
  status: OrderStatusType;
  address: string | null;
  trackingNo: string | null;
  remark: string | null;
  createdAt: string;
  updatedAt: string;
  shippedAt: string | null;
  completedAt: string | null;
  orderItems: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  productImage: string;
  pointsPrice: number;
  quantity: number;
}

export interface CreateOrderPayload {
  address: string;
  remark?: string;
}
