// Enterprise Mall - Admin Order Service
// Handles admin order listing and status updates (ship/complete)

import { prisma } from '../config/database';
import { Prisma } from '@prisma/client';
import { PaginatedData } from '../utils/response';
import { AdminOrderQuery, UpdateOrderBody } from '../types';
import { createNotFoundError, createConflictError, createBadRequestError } from '../utils/errors';

/**
 * Get all orders with optional filtering and pagination.
 * @param query - Filter and pagination parameters
 * @returns Paginated list of orders with user info
 */
export async function getOrders(query: AdminOrderQuery): Promise<PaginatedData<any>> {
  const page: number = query.page ?? 1;
  const pageSize: number = query.pageSize ?? 20;
  const skip: number = (page - 1) * pageSize;

  const where: any = {};

  if (query.status) {
    where.status = query.status;
  }

  if (query.userId !== undefined) {
    where.userId = query.userId;
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        user: {
          select: {
            id: true,
            employeeId: true,
            username: true,
            department: true,
          },
        },
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
 * Update order status: SHIPPED (with tracking number) or COMPLETED.
 * Validates that the status transition is allowed.
 * @param orderId - Order ID to update
 * @param body - Update payload (status, trackingNo)
 * @param operatorId - Admin user ID who performed the operation
 * @returns Updated order
 */
export async function updateOrderStatus(orderId: number, body: UpdateOrderBody, operatorId: number): Promise<any> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { orderItems: true },
  });

  if (!order) {
    throw createNotFoundError('Order not found');
  }

  // Validate status transitions
  const newStatus: string | undefined = body.status;
  const currentStatus: string = order.status;

  if (newStatus === 'SHIPPED') {
    if (currentStatus !== 'PENDING') {
      throw createConflictError('Only PENDING orders can be shipped');
    }

    const trackingNo: string = body.trackingNo ?? '';
    if (!trackingNo) {
      throw createBadRequestError('Tracking number is required for shipping');
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'SHIPPED',
        trackingNo,
        shippedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            employeeId: true,
            username: true,
          },
        },
        orderItems: true,
      },
    });

    return updatedOrder;
  }

  if (newStatus === 'COMPLETED') {
    if (currentStatus !== 'SHIPPED') {
      throw createConflictError('Only SHIPPED orders can be completed');
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            employeeId: true,
            username: true,
          },
        },
        orderItems: true,
      },
    });

    return updatedOrder;
  }

  if (newStatus === 'CANCELLED') {
    if (currentStatus === 'COMPLETED' || currentStatus === 'CANCELLED') {
      throw createConflictError('Cannot cancel a completed or already cancelled order');
    }

    // Cancel order and refund points + restore stock
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Refund points to user
      const user = await tx.user.findUnique({
        where: { id: order.userId },
      });

      if (!user) {
        throw createNotFoundError('User not found');
      }

      const refundedUser = await tx.user.update({
        where: { id: order.userId },
        data: { points: user.points + order.totalPoints },
      });

      // Create PointRecord for refund
      await tx.pointRecord.create({
        data: {
          userId: order.userId,
          type: 'REFUND',
          points: order.totalPoints,
          balance: refundedUser.points,
          reason: `Order cancellation refund: ${order.totalPoints} points`,
          orderId: order.id,
          operatorId,
        },
      });

      // Restore stock for each order item
      for (const orderItem of order.orderItems) {
        await tx.product.update({
          where: { id: orderItem.productId },
          data: {
            stock: { increment: orderItem.quantity },
          },
        });
      }

      // Update order status
      const cancelledOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED' },
        include: {
          user: {
            select: {
              id: true,
              employeeId: true,
              username: true,
            },
          },
          orderItems: true,
        },
      });

      return cancelledOrder;
    });

    return updatedOrder;
  }

  throw createBadRequestError('Invalid status update');
}

export const adminOrderService = { getOrders, updateOrderStatus };
