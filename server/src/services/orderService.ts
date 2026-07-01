// Enterprise Mall - Order Service
// Handles order creation (transaction: deduct points + deduct stock + create order + clear cart + PointRecord)
// and order retrieval

import { prisma, parseJsonArray } from '../config/database';
import { generateOrderNo } from '../utils/orderNo';
import { PaginatedData } from '../utils/response';
import { OrderQuery, CreateOrderBody } from '../types';
import { createNotFoundError, createConflictError, createBadRequestError } from '../utils/errors';
import { Prisma } from '@prisma/client';

/**
 * Create a new order using a database transaction.
 * Transaction steps:
 * 1. Fetch cart items with product info
 * 2. Validate all products are active and have sufficient stock
 * 3. Calculate total points
 * 4. Check user has enough points
 * 5. Deduct points from user (update balance)
 * 6. Create PointRecord (CONSUME type)
 * 7. Deduct stock for each product using optimistic lock (WHERE version = expected)
 * 8. Create Order + OrderItems
 * 9. Clear user's cart
 * @param userId - Current user's ID
 * @param payload - Order creation payload (address, remark)
 * @returns Created order with items
 */
export async function createOrder(userId: number, payload: CreateOrderBody): Promise<any> {
  const result = await prisma.$transaction(async (tx) => {
    // 1. Fetch cart items with product info
    const cartItems = await tx.cartItem.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });

    if (cartItems.length === 0) {
      throw createBadRequestError('Cart is empty');
    }

    // 2. Validate products
    for (const item of cartItems) {
      if (item.product.status !== 'ACTIVE') {
        throw createConflictError(`Product "${item.product.name}" is not available`);
      }
      if (item.product.stock < item.quantity) {
        throw createConflictError(`Product "${item.product.name}" has insufficient stock`);
      }
    }

    // 3. Calculate total points
    const totalPoints: number = cartItems.reduce(
      (sum: number, item: any) => sum + item.product.pointsPrice * item.quantity,
      0
    );

    // 4. Check user points
    const user = await tx.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw createNotFoundError('User not found');
    }

    if (user.points < totalPoints) {
      throw createConflictError('Insufficient points');
    }

    // 5. Deduct points from user
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: { points: user.points - totalPoints },
    });

    // 6. Create PointRecord (CONSUME type)
    await tx.pointRecord.create({
      data: {
        userId,
        type: 'CONSUME',
        points: totalPoints,
        balance: updatedUser.points,
        reason: `订单消费：${totalPoints}积分`,
      },
    });

    // 7. Deduct stock with optimistic lock for each product
    for (const item of cartItems) {
      const updateResult = await tx.product.updateMany({
        where: {
          id: item.product.id,
          version: item.product.version, // Optimistic lock: WHERE version = expected
        },
        data: {
          stock: item.product.stock - item.quantity,
          version: item.product.version + 1,
        },
      });

      if (updateResult.count === 0) {
        // Optimistic lock conflict - another transaction modified the product
        throw createConflictError(`Product "${item.product.name}" stock conflict, please retry`);
      }
    }

    // 8. Create Order + OrderItems
    const orderNo: string = generateOrderNo();

    const order = await tx.order.create({
      data: {
        orderNo,
        userId,
        totalPoints,
        address: payload.address ?? user.address,
        remark: payload.remark,
        orderItems: {
          create: cartItems.map((item: any) => ({
            productId: item.product.id,
            productName: item.product.name,
            productImage: parseJsonArray(item.product.images).length > 0 ? parseJsonArray(item.product.images)[0] : '',
            pointsPrice: item.product.pointsPrice,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });

    // 9. Clear user's cart
    await tx.cartItem.deleteMany({
      where: { userId },
    });

    return order;
  });

  return result;
}

/**
 * Get user's orders with optional status filtering and pagination.
 * @param userId - Current user's ID
 * @param query - Filter and pagination parameters
 * @returns Paginated list of orders
 */
export async function getOrders(userId: number, query: OrderQuery): Promise<PaginatedData<any>> {
  const page: number = query.page ?? 1;
  const pageSize: number = query.pageSize ?? 10;
  const skip: number = (page - 1) * pageSize;

  const where: any = { userId };

  if (query.status) {
    where.status = query.status;
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        orderItems: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    items: orders,
    total,
    page,
    pageSize,
  };
}

/**
 * Get a single order by ID.
 * Only returns the order if it belongs to the requesting user.
 * @param userId - Current user's ID (for ownership check)
 * @param orderId - Order ID to retrieve
 * @returns Order with items
 */
export async function getOrderById(userId: number, orderId: number): Promise<any> {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: {
      orderItems: true,
    },
  });

  if (!order) {
    throw createNotFoundError('Order not found');
  }

  return order;
}

export const orderService = { createOrder, getOrders, getOrderById };
