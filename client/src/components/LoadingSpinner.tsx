// Enterprise Mall - LoadingSpinner Component
// Displays a centered loading indicator

import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
  fullPage?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = '加载中...', fullPage = false }) => {
  if (fullPage) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: 2 }}>
        <CircularProgress size={60} />
        <Typography variant="body1" color="text.secondary">{message}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4, gap: 2 }}>
      <CircularProgress size={40} />
      <Typography variant="body2" color="text.secondary">{message}</Typography>
    </Box>
  );
};

export default LoadingSpinner;
