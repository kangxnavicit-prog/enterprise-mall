// Enterprise Mall - API Type Definitions

export interface ApiResponse<T> {
  code: number;
  data: T | null;
  message: string;
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type PaginatedResponse<T> = ApiResponse<PaginatedData<T>>;
