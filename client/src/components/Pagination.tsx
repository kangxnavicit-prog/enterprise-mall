// Enterprise Mall - Pagination Component
// Reusable pagination controls for list pages

import React from 'react';
import {
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onPageSizeChange,
}) => {
  const pageSizes: number[] = [10, 20, 50];

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 3, pb: 2 }}>
      <Typography variant="body2" color="text.secondary">
        共 {total} 条记录，第 {page}/{totalPages} 页
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {onPageSizeChange && (
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>每页</InputLabel>
            <Select value={pageSize} label="每页" onChange={(e) => onPageSizeChange(Number(e.target.value))}>
              {pageSizes.map((size) => (
                <MenuItem key={size} value={size}>{size}条</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <Button
          size="small"
          variant="outlined"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          上一页
        </Button>

        <Button
          size="small"
          variant="outlined"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          下一页
        </Button>
      </Box>
    </Box>
  );
};

export default Pagination;
