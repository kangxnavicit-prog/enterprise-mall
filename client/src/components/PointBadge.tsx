// Enterprise Mall - PointBadge Component
// Displays points value as a highlighted badge with warm accent styling

import React from 'react';
import { Box, Typography } from '@mui/material';
import { formatPoints } from '../utils/format';

interface PointBadgeProps {
  points: number;
  label?: string;
  size?: 'small' | 'medium' | 'large';
}

const sizeConfig = {
  small: { fontSize: '0.75rem', iconSize: 16 },
  medium: { fontSize: '0.875rem', iconSize: 20 },
  large: { fontSize: '1rem', iconSize: 24 },
};

const PointBadge: React.FC<PointBadgeProps> = ({ points, label, size = 'small' }) => {
  const config = sizeConfig[size];

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
      {label && (
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: config.fontSize }}>
          {label}:
        </Typography>
      )}
      <Typography
        sx={{
          color: 'accent.main',
          fontWeight: 'bold',
          fontSize: config.fontSize,
          bgcolor: 'accent.50',
          px: 1,
          py: 0.25,
          borderRadius: 1.5,
          border: '1px solid rgba(255, 109, 0, 0.15)',
        }}
      >
        🔥 {formatPoints(points)}
      </Typography>
    </Box>
  );
};

export default PointBadge;
