// Enterprise Mall - Constants Definitions
// Centralizes API prefix, storage keys, error codes, and status mappings

/** API base URL */
export const API_BASE_URL: string = '/api';

/** localStorage key for JWT token */
export const TOKEN_KEY: string = 'mall_token';

/** localStorage key for cart data */
export const CART_STORAGE_KEY: string = 'mall_cart';

/** API response code constants */
export const ERROR_CODES = {
  SUCCESS: 20000,
  BAD_REQUEST: 40001,
  UNAUTHORIZED: 40100,
  FORBIDDEN: 40300,
  NOT_FOUND: 40400,
  CONFLICT: 40900,
  INTERNAL_ERROR: 50000,
} as const;

/** Order status display labels */
export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: '待发货',
  SHIPPED: '已发货',
  COMPLETED: '已完成',
  CANCELLED: '已取消',
};

/** Order status color mapping (MUI color) */
export const ORDER_STATUS_COLORS: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  PENDING: 'warning',
  SHIPPED: 'info',
  COMPLETED: 'success',
  CANCELLED: 'error',
};

/** Point type display labels */
export const POINT_TYPE_LABELS: Record<string, string> = {
  GRANT: '发放',
  CONSUME: '消费',
  REFUND: '退款',
  ADJUST: '调整',
};

/** User role display labels */
export const USER_ROLE_LABELS: Record<string, string> = {
  EMPLOYEE: '员工',
  ADMIN: '管理员',
};

/** Default pagination settings */
export const DEFAULT_PAGE_SIZE: number = 20;

/** Max file upload size (5MB) */
export const MAX_UPLOAD_SIZE: number = 5 * 1024 * 1024;

/** Allowed image MIME types */
export const ALLOWED_IMAGE_TYPES: string[] = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
