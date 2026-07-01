// Enterprise Mall - usePagination Hook
// Provides pagination state and navigation helpers

import { useState, useCallback } from 'react';

interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

interface UsePaginationReturn extends PaginationState {
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setTotal: (total: number) => void;
  setPageSize: (pageSize: number) => void;
  reset: () => void;
}

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;

export function usePagination(initialPageSize: number = DEFAULT_PAGE_SIZE): UsePaginationReturn {
  const [page, setPage] = useState<number>(DEFAULT_PAGE);
  const [pageSize, setPageSizeState] = useState<number>(initialPageSize);
  const [total, setTotalCount] = useState<number>(0);

  const totalPages: number = Math.max(1, Math.ceil(total / pageSize));
  const hasNextPage: boolean = page < totalPages;
  const hasPrevPage: boolean = page > 1;

  const goToPage = useCallback((newPage: number) => {
    const validPage = Math.max(1, Math.min(newPage, totalPages));
    setPage(validPage);
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setPage(page + 1);
    }
  }, [hasNextPage, page]);

  const prevPage = useCallback(() => {
    if (hasPrevPage) {
      setPage(page - 1);
    }
  }, [hasPrevPage, page]);

  const setTotal = useCallback((newTotal: number) => {
    setTotalCount(newTotal);
  }, []);

  const setPageSize = useCallback((newPageSize: number) => {
    setPageSizeState(newPageSize);
    setPage(1);
  }, []);

  const reset = useCallback(() => {
    setPage(DEFAULT_PAGE);
    setTotalCount(0);
  }, []);

  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNextPage,
    hasPrevPage,
    goToPage,
    nextPage,
    prevPage,
    setTotal,
    setPageSize,
    reset,
  };
}
