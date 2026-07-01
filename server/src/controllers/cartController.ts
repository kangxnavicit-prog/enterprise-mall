// Enterprise Mall - Cart Controller
// Handles cart CRUD operations (add, update, remove items)

import { Request, Response, NextFunction } from 'express';
import { cartService } from '../services/cartService';
import { success } from '../utils/response';
import { RequestUser, CartItemBody } from '../types';
import { createBadRequestError } from '../utils/errors';

/** Get current user's cart items */
export async function getCart(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user: RequestUser = req.user!;
    const cartItems = await cartService.getCart(user.id);
    success(res, cartItems);
  } catch (error) {
    next(error);
  }
}

/** Add item to cart */
export async function addItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user: RequestUser = req.user!;
    const { productId, quantity }: CartItemBody = req.body;

    if (!productId) {
      next(createBadRequestError('Product ID is required'));
      return;
    }

    const cartItem = await cartService.addItem(user.id, productId, quantity ?? 1);
    success(res, cartItem, 'Item added to cart');
  } catch (error) {
    next(error);
  }
}

/** Update cart item quantity */
export async function updateItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user: RequestUser = req.user!;
    const cartItemId: number = parseInt(req.params.id, 10);
    const { quantity }: { quantity?: number } = req.body;

    if (isNaN(cartItemId)) {
      next(createBadRequestError('Invalid cart item ID'));
      return;
    }

    if (quantity === undefined || quantity < 1) {
      next(createBadRequestError('Quantity must be at least 1'));
      return;
    }

    const cartItem = await cartService.updateItem(user.id, cartItemId, quantity);
    success(res, cartItem, 'Cart item updated');
  } catch (error) {
    next(error);
  }
}

/** Remove item from cart */
export async function removeItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user: RequestUser = req.user!;
    const cartItemId: number = parseInt(req.params.id, 10);

    if (isNaN(cartItemId)) {
      next(createBadRequestError('Invalid cart item ID'));
      return;
    }

    await cartService.removeItem(user.id, cartItemId);
    success(res, null, 'Item removed from cart');
  } catch (error) {
    next(error);
  }
}

export const cartController = { getCart, addItem, updateItem, removeItem };
