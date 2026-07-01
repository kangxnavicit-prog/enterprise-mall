// Enterprise Mall - Order Number Generator
// Generates unique order numbers using timestamp + random suffix pattern

/**
 * Generate a unique order number.
 * Format: ORD-{timestamp}-{4-digit-random}
 * Example: ORD-20260626100233-7A2F
 * @returns Unique order number string
 */
export function generateOrderNo(): string {
  const now: Date = new Date();
  const timestamp: string = now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0') +
    String(now.getSeconds()).padStart(2, '0');

  const randomSuffix: string = Math.random().toString(36).substring(2, 6).toUpperCase();

  return `ORD-${timestamp}-${randomSuffix}`;
}
