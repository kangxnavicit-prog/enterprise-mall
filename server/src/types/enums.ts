// Enterprise Mall - Enum Definitions
// Mirrors the Prisma schema enums for use in TypeScript business logic

export enum Role {
  EMPLOYEE = 'EMPLOYEE',
  ADMIN = 'ADMIN',
}

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  SHIPPED = 'SHIPPED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum PointType {
  GRANT = 'GRANT',
  CONSUME = 'CONSUME',
  REFUND = 'REFUND',
  ADJUST = 'ADJUST',
}
