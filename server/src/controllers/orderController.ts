// Enterprise Mall - Order Controller
// Handles order creation and retrieval

import { Request, Response, NextFunction } from 'express';
import { orderService } from '../services/orderService';
import { success, paginated } from '../utils/response';
import { RequestUser, CreateOrderBody, OrderQuery, OrderStatus } from '../types';
import { createBadRequestError } from '../utils/errors';

/** Create a new order (checkout) */
export async function createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user: RequestUser = req.user!;
    const { address, remark }: CreateOrderBody = req.body;

    const order = await orderService.createOrder(user.id, { address, remark });
    success(res, order, 'Order created successfully');
  } catch (error) {
    next(error);
  }
}

/** Get user's order list with optional filtering */
export async function getOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user: RequestUser = req.user!;
    const query: OrderQuery = {
      status: req.query.status as OrderStatus | undefined,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : 10,
    };

    if (query.page !== undefined && isNaN(query.page)) {
      query.page = 1;
    }
    if (query.pageSize !== undefined && isNaN(query.pageSize)) {
      query.pageSize = 10;
    }

    const result = await orderService.getOrders(user.id, query);
    paginated(res, result.items, result.total, result.page, result.pageSize);
  } catch (error) {
    next(error);
  }
}

/** Get order detail by ID */
export async function getOrderById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user: RequestUser = req.user!;
    const orderId: number = parseInt(req.params.id, 10);

    if (isNaN(orderId)) {
      next(createBadRequestError('Invalid order ID'));
      return;
    }

    const order = await orderService.getOrderById(user.id, orderId);
    success(res, order);
  } catch (error) {
    next(error);
  }
}

export const orderController = { createOrder, getOrders, getOrderById };
