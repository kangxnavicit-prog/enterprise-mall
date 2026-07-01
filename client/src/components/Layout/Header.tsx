// Enterprise Mall - Header Component
// Top navigation bar with user info, points display, and navigation links

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Badge,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { formatPoints } from '../../utils/format';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const itemCount = useCartStore((state) => state.itemCount());

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        bgcolor: 'white',
        borderBottom: '1px solid rgba(216, 67, 21, 0.1)',
      }}
    >
      <Toolbar>
        <Box
          component={Link}
          to="/"
          sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', flexGrow: 1 }}
        >
          <Box
            component="img"
            src="/logo.png"
            alt="致欧商城"
            sx={{ height: 36, objectFit: 'contain' }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: '#2c3e50',
              textDecoration: 'none',
              letterSpacing: 0.5,
            }}
          >
            致欧商城
          </Typography>
        </Box>

        {isAuthenticated && user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Points display — warm accent color */}
            <Typography variant="body2" sx={{ color: 'accent.main', fontWeight: 'bold' }}>
              积分: {formatPoints(user.points)}
            </Typography>

            {/* Cart button — warm hover effect */}
            <IconButton
              color="primary"
              onClick={() => navigate('/cart')}
              sx={{
                '&:hover': {
                  bgcolor: 'rgba(216, 67, 21, 0.08)',
                },
              }}
            >
              <Badge badgeContent={itemCount} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {/* Profile link — warm hover */}
            <IconButton
              color="primary"
              onClick={() => navigate('/profile')}
              sx={{
                '&:hover': {
                  bgcolor: 'rgba(216, 67, 21, 0.08)',
                },
              }}
            >
              <PersonIcon />
            </IconButton>

            {/* Admin link (only for ADMIN role) */}
            {user.role === 'ADMIN' && (
              <Button size="small" variant="outlined" color="primary" onClick={() => navigate('/admin')}>
                管理后台
              </Button>
            )}

            {/* Logout */}
            <IconButton color="error" onClick={handleLogout} title="退出登录">
              <LogoutIcon />
            </IconButton>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
