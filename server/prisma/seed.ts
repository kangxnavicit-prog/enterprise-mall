// Enterprise Mall - Seed Data Script
// Creates initial admin user, categories, and products for development/testing

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Helper: stringify images array for SQLite (images stored as JSON string)
function stringifyImages(arr: string[]): string {
  return JSON.stringify(arr);
}

const SALT_ROUNDS: number = 10;

async function hashPassword(password: string): Promise<string> {
  const salt: string = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
}

async function main(): Promise<void> {
  console.log('[Seed] Starting seed data creation...');

  // 1. Create initial admin user
  const adminPasswordHash: string = await hashPassword('admin123');
  const admin = await prisma.user.upsert({
    where: { employeeId: 'ADMIN001' },
    update: {},
    create: {
      employeeId: 'ADMIN001',
      username: 'admin',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      department: 'Management',
      points: 99999,
      isActive: true,
    },
  });
  console.log(`[Seed] Admin user created: ${admin.employeeId} / ${admin.username}`);

  // Create a test employee user
  const employeePasswordHash: string = await hashPassword('emp123');
  const employee = await prisma.user.upsert({
    where: { employeeId: 'EMP001' },
    update: {},
    create: {
      employeeId: 'EMP001',
      username: '张三',
      passwordHash: employeePasswordHash,
      role: 'EMPLOYEE',
      department: '技术研发部',
      points: 5000,
      address: '北京市海淀区中关村科技园',
      isActive: true,
    },
  });
  console.log(`[Seed] Employee user created: ${employee.employeeId} / ${employee.username}`);

  // 2. Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: '数码电子' },
      update: {},
      create: {
        name: '数码电子',
        icon: '📱',
        sortOrder: 1,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { name: '生活用品' },
      update: {},
      create: {
        name: '生活用品',
        icon: '🏠',
        sortOrder: 2,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { name: '办公用品' },
      update: {},
      create: {
        name: '办公用品',
        icon: '💼',
        sortOrder: 3,
        isActive: true,
      },
    }),
  ]);
  console.log(`[Seed] Categories created: ${categories.map((c: any) => c.name).join(', ')}`);

  // 3. Create products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        categoryId: categories[0].id,
        name: '无线蓝牙耳机',
        description: '高品质降噪蓝牙耳机，续航30小时，支持快充',
        images: stringifyImages(['/uploads/products/headphone-default.jpg']),
        pointsPrice: 800,
        stock: 50,
        status: 'ACTIVE',
        avgRating: 4.5,
      },
    }),
    prisma.product.create({
      data: {
        categoryId: categories[0].id,
        name: '智能手表',
        description: '运动健康监测智能手表，支持心率、睡眠、运动记录',
        images: stringifyImages(['/uploads/products/watch-default.jpg']),
        pointsPrice: 1200,
        stock: 30,
        status: 'ACTIVE',
        avgRating: 4.2,
      },
    }),
    prisma.product.create({
      data: {
        categoryId: categories[1].id,
        name: '保温杯',
        description: '316不锈钢保温杯，12小时长效保温，500ml容量',
        images: stringifyImages(['/uploads/products/cup-default.jpg']),
        pointsPrice: 200,
        stock: 100,
        status: 'ACTIVE',
        avgRating: 4.0,
      },
    }),
    prisma.product.create({
      data: {
        categoryId: categories[2].id,
        name: '笔记本电脑支架',
        description: '铝合金笔记本支架，6档角度调节，散热通风设计',
        images: stringifyImages(['/uploads/products/stand-default.jpg']),
        pointsPrice: 350,
        stock: 80,
        status: 'ACTIVE',
        avgRating: 4.3,
      },
    }),
    prisma.product.create({
      data: {
        categoryId: categories[2].id,
        name: '人体工学鼠标',
        description: '垂直握持设计，减少手腕压力，适合长时间办公使用',
        images: stringifyImages(['/uploads/products/mouse-default.jpg']),
        pointsPrice: 400,
        stock: 60,
        status: 'ACTIVE',
        avgRating: 4.1,
      },
    }),
  ]);
  console.log(`[Seed] Products created: ${products.map((p: any) => p.name).join(', ')}`);

  console.log('[Seed] Seed data creation completed!');
}

main()
  .catch((error: Error) => {
    console.error('[Seed] Error during seeding:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
