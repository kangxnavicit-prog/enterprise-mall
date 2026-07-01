// Enterprise Mall - Validation Utility Functions
// Provides form input validation helpers

/** Validate employee ID format */
export function validateEmployeeId(id: string): boolean {
  return id.length >= 3 && id.length <= 20;
}

/** Validate password length */
export function validatePassword(password: string): boolean {
  return password.length >= 6;
}

/** Validate address length */
export function validateAddress(address: string): boolean {
  return address.length > 0 && address.length <= 200;
}

/** Validate quantity (positive integer) */
export function validateQuantity(quantity: number): boolean {
  return Number.isInteger(quantity) && quantity >= 1 && quantity <= 99;
}

/** Validate points (positive integer) */
export function validatePoints(points: number): boolean {
  return Number.isInteger(points) && points >= 1;
}

/** Validate product name */
export function validateProductName(name: string): boolean {
  return name.trim().length > 0 && name.trim().length <= 100;
}

/** Validate category name */
export function validateCategoryName(name: string): boolean {
  return name.trim().length > 0 && name.trim().length <= 50;
}

/** Validate tracking number */
export function validateTrackingNo(trackingNo: string): boolean {
  return trackingNo.trim().length > 0 && trackingNo.trim().length <= 50;
}

/** Validate email format (optional) */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/** Check if value is a valid positive integer */
export function isPositiveInteger(value: any): boolean {
  const num = Number(value);
  return Number.isInteger(num) && num > 0;
}
