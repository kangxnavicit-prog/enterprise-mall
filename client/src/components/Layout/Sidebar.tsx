// Enterprise Mall - Sidebar Component
// Admin navigation sidebar with menu items

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PeopleIcon from '@mui/icons-material/People';
import StoreIcon from '@mui/icons-material/Store';

const SIDEBAR_WIDTH = 220;

interface MenuItem {
  text: string;
  icon: React.ReactElement;
  path: string;
}

const menuItems: MenuItem[] = [
  { text: '数据看板', icon: <DashboardIcon />, path: '/admin' },
  { text: '商品管理', icon: <ShoppingBagIcon />, path: '/admin/products' },
  { text: '分类管理', icon: <CategoryIcon />, path: '/admin/categories' },
  { text: '订单管理', icon: <LocalShippingIcon />, path: '/admin/orders' },
  { text: '用户管理', icon: <PeopleIcon />, path: '/admin/users' },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: SIDEBAR_WIDTH,
          boxSizing: 'border-box',
          bgcolor: 'grey.900',
          color: 'white',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <StoreIcon sx={{ fontSize: 30, color: 'primary.main', mr: 1 }} />
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
          管理后台
        </Typography>
      </Box>
      <Divider sx={{ bgcolor: 'grey.700' }} />
      <List>
        {menuItems.map((item: MenuItem) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
            sx={{
              bgcolor: location.pathname === item.path ? 'primary.main' : 'transparent',
              '&:hover': { bgcolor: location.pathname === item.path ? 'primary.dark' : 'grey.800' },
              borderRadius: 1,
              mb: 1,
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? 'white' : 'grey.400' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{ color: location.pathname === item.path ? 'white' : 'grey.300' }}
            />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ bgcolor: 'grey.700' }} />
      <Box sx={{ p: 2, mt: 'auto' }}>
        <ListItem button onClick={() => navigate('/')} sx={{ borderRadius: 1 }}>
          <ListItemIcon sx={{ color: 'grey.400' }}>
            <StoreIcon />
          </ListItemIcon>
          <ListItemText primary="返回商城" sx={{ color: 'grey.300' }} />
        </ListItem>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
