// Enterprise Mall - Admin Dashboard Service
// Provides dashboard statistics: today's orders, monthly points consumed, pending shipments, top 5 products

import { prisma } from '../config/database';

/**
 * Get dashboard statistics for admin overview.
 * Returns: today's order count, this month's points consumed,
 * pending shipment count, and top 5 hot-selling products.
 * @returns Dashboard statistics object
 */
export async function getStats(): Promise<{
  todayOrderCount: number;
  monthlyPointsConsumed: number;
  pendingShipmentCount: number;
  topProducts: any[];
  totalUsers: number;
  totalProducts: number;
}> {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Today's order count
  const todayOrderCount: number = await prisma.order.count({
    where: {
      createdAt: {
        gte: todayStart,
      },
    },
  });

  // This month's points consumed
  const monthlyConsumedRecords = await prisma.pointRecord.findMany({
    where: {
      type: 'CONSUME',
      createdAt: {
        gte: monthStart,
      },
    },
    select: { points: true },
  });

  const monthlyPointsConsumed: number = monthlyConsumedRecords.reduce(
    (sum: number, record: any) => sum + record.points,
    0
  );

  // Pending shipment count (orders in PENDING status)
  const pendingShipmentCount: number = await prisma.order.count({
    where: { status: 'PENDING' },
  });

  // Top 5 hot-selling products (by order item quantity)
  const topProducts = await prisma.orderItem.groupBy({
    by: ['productId'],
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: 'desc',
      },
    },
    take: 5,
  });

  // Fetch product details for top products
  const topProductIds: number[] = topProducts.map((item: any) => item.productId);

  const productDetails = await prisma.product.findMany({
    where: { id: { in: topProductIds } },
    select: {
      id: true,
      name: true,
      images: true,
      pointsPrice: true,
      stock: true,
      category: {
        select: { name: true },
      },
    },
  });

  // Combine with quantity data
  const topProductsWithQuantity: any[] = productDetails.map((product: any) => {
    const orderItemData = topProducts.find((item: any) => item.productId === product.id);
    return {
      ...product,
      totalSold: orderItemData?._sum?.quantity ?? 0,
    };
  });

  // Sort by totalSold descending
  topProductsWithQuantity.sort((a: any, b: any) => b.totalSold - a.totalSold);

  // Total users
  const totalUsers: number = await prisma.user.count();

  // Total active products
  const totalProducts: number = await prisma.product.count({
    where: { status: 'ACTIVE' },
  });

  return {
    todayOrderCount,
    monthlyPointsConsumed,
    pendingShipmentCount,
    topProducts: topProductsWithQuantity,
    totalUsers,
    totalProducts,
  };
}

export const adminDashboardService = { getStats };
