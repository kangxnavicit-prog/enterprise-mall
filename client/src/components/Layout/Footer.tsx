// Enterprise Mall - Footer Component
// Simple footer with copyright info

import React from 'react';
import { Typography, Box } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box component="footer" sx={{ bgcolor: 'grey.100', p: 2, mt: 'auto' }}>
      <Typography variant="body2" color="text.secondary" align="center">
        © 2026 致欧商城 — 内部积分兑换平台
      </Typography>
    </Box>
  );
};

export default Footer;
