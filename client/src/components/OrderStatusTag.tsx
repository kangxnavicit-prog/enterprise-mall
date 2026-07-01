// Enterprise Mall - OrderStatusTag Component
// Displays order status as a colored chip/tag

import React from 'react';
import { Chip } from '@mui/material';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../utils/constants';

interface OrderStatusTagProps {
  status: string;
  size?: 'small' | 'medium';
}

const OrderStatusTag: React.FC<OrderStatusTagProps> = ({ status, size = 'small' }) => {
  const label: string = ORDER_STATUS_LABELS[status] || status;
  const color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' =
    ORDER_STATUS_COLORS[status] || 'default';

  return (
    <Chip
      label={label}
      color={color}
      size={size}
      variant="filled"
      sx={{ fontWeight: 'bold' }}
    />
  );
};

export default OrderStatusTag;
