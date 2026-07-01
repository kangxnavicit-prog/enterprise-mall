// Enterprise Mall - Cart Service
// Handles cart operations: getCart, addItem, updateItem, removeItem

import { prisma } from '../config/database';
import { createNotFoundError, createConflictError, createBadRequestError } from '../utils/errors';

/**
 * Get current user's cart items with product details.
 * @param userId - Current user's ID
 * @returns Array of cart items with product info
 */
export async function getCart(userId: number): Promise<any[]> {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          images: true,
          pointsPrice: true,
          stock: true,
          status: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return cartItems;
}

/**
 * Add a product to the user's cart.
 * If the product already exists in the cart, increment quantity.
 * @param userId - Current user's ID
 * @param productId - Product ID to add
 * @param quantity - Quantity to add (default: 1)
 * @returns Created or updated cart item
 */
export async function addItem(userId: number, productId: number, quantity: number): Promise<any> {
  // Verify product exists and is active
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw createNotFoundError('Product not found');
  }

  if (product.status !== 'ACTIVE') {
    throw createBadRequestError('Product is not available');
  }

  if (product.stock < quantity) {
    throw createConflictError('Insufficient stock');
  }

  // Check if product already in cart
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      userId_productId: { userId, productId },
    },
  });

  if (existingItem) {
    // Increment quantity on existing item
    const newQuantity: number = existingItem.quantity + quantity;

    if (newQuantity > product.stock) {
      throw createConflictError('Quantity exceeds available stock');
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            images: true,
            pointsPrice: true,
            stock: true,
            status: true,
          },
        },
      },
    });

    return updatedItem;
  }

  // Create new cart item
  const cartItem = await prisma.cartItem.create({
    data: {
      userId,
      productId,
      quantity,
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          images: true,
          pointsPrice: true,
          stock: true,
          status: true,
        },
      },
    },
  });

  return cartItem;
}

/**
 * Update a cart item's quantity.
 * @param userId - Current user's ID
 * @param cartItemId - Cart item ID to update
 * @param quantity - New quantity value
 * @returns Updated cart item
 */
export async function updateItem(userId: number, cartItemId: number, quantity: number): Promise<any> {
  // Verify cart item belongs to user
  const cartItem = await prisma.cartItem.findFirst({
    where: { id: cartItemId, userId },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          images: true,
          pointsPrice: true,
          stock: true,
        },
      },
    },
  });

  if (!cartItem) {
    throw createNotFoundError('Cart item not found');
  }

  if (quantity > cartItem.product.stock) {
    throw createConflictError('Quantity exceeds available stock');
  }

  const updatedItem = await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          images: true,
          pointsPrice: true,
          stock: true,
          status: true,
        },
      },
    },
  });

  return updatedItem;
}

/**
 * Remove an item from the user's cart.
 * @param userId - Current user's ID
 * @param cartItemId - Cart item ID to remove
 */
export async function removeItem(userId: number, cartItemId: number): Promise<void> {
  // Verify cart item belongs to user
  const cartItem = await prisma.cartItem.findFirst({
    where: { id: cartItemId, userId },
  });

  if (!cartItem) {
    throw createNotFoundError('Cart item not found');
  }

  await prisma.cartItem.delete({
    where: { id: cartItemId },
  });
}

export const cartService = { getCart, addItem, updateItem, removeItem };
