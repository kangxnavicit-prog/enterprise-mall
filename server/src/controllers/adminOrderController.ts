// Enterprise Mall - Admin Order Controller
// Handles admin order list retrieval and status updates

import { Request, Response, NextFunction } from 'express';
import { adminOrderService } from '../services/adminOrderService';
import { success, paginated } from '../utils/response';
import { AdminOrderQuery, UpdateOrderBody, RequestUser, OrderStatus } from '../types';
import { createBadRequestError } from '../utils/errors';

/** Get all orders with optional filtering */
export async function getOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const query: AdminOrderQuery = {
      status: req.query.status as OrderStatus | undefined,
      userId: req.query.userId ? parseInt(req.query.userId as string, 10) : undefined,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : 20,
    };

    if (query.userId !== undefined && isNaN(query.userId)) {
      query.userId = undefined;
    }
    if (query.page !== undefined && isNaN(query.page)) {
      query.page = 1;
    }
    if (query.pageSize !== undefined && isNaN(query.pageSize)) {
      query.pageSize = 20;
    }

    const result = await adminOrderService.getOrders(query);
    paginated(res, result.items, result.total, result.page, result.pageSize);
  } catch (error) {
    next(error);
  }
}

/** Update order status (ship/complete) */
export async function updateOrderStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const orderId: number = parseInt(req.params.id, 10);
    if (isNaN(orderId)) {
      next(createBadRequestError('Invalid order ID'));
      return;
    }

    const body: UpdateOrderBody = req.body;
    const operator: RequestUser = req.user!;
    const order = await adminOrderService.updateOrderStatus(orderId, body, operator.id);
    success(res, order, 'Order status updated successfully');
  } catch (error) {
    next(error);
  }
}

export const adminOrderController = { getOrders, updateOrderStatus };
