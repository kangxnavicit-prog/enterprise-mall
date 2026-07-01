// Enterprise Mall - App Component
// Root component with route configuration and provider setup

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// Layouts
import EmployeeLayout from './components/Layout/EmployeeLayout';
import AdminLayout from './components/Layout/AdminLayout';

// Auth Guards
import AuthGuard from './components/AuthGuard';
import RoleGuard from './components/RoleGuard';

// Employee Pages
import Login from './pages/employee/Login';
import ProductList from './pages/employee/ProductList';
import ProductDetail from './pages/employee/ProductDetail';
import Cart from './pages/employee/Cart';
import Checkout from './pages/employee/Checkout';
import OrderList from './pages/employee/OrderList';
import OrderDetail from './pages/employee/OrderDetail';
import Profile from './pages/employee/Profile';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import AdminProductList from './pages/admin/AdminProductList';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminOrderList from './pages/admin/AdminOrderList';
import AdminUserList from './pages/admin/AdminUserList';
import AdminCategoryList from './pages/admin/AdminCategoryList';
import Notification from './components/Notification';

// MUI Theme — Warm Amber/Caramel palette (焦糖棕)
// Warm, professional, not flashy — suitable for enterprise mall
const theme = createTheme({
  palette: {
    primary: {
      main: '#d84315',        // Deep Orange 700 — burnt caramel, warm & professional
      light: '#ff8a65',       // Deep Orange 300 — hover states
      dark: '#bf360c',        // Deep Orange 900 — pressed/active states
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff9800',        // Orange 500 — warm accent for badges & secondary actions
      light: '#ffb74d',       // Orange 300
      dark: '#e65100',        // Deep Orange 900
      contrastText: '#ffffff',
    },
    accent: {
      main: '#ff6d00',        // Bright orange — highlights, fire emoji, points
      50: '#fff3e0',
      100: '#ffe0b2',
      200: '#ffcc80',
      300: '#ffb74d',
      400: '#ffa726',
      500: '#ff9800',
      600: '#fb8c00',
      700: '#f57c00',
      800: '#ef6c00',
      900: '#e65100',
    },
    background: {
      default: '#fff8f0',     // Warm white — slight amber tint for page background
      paper: '#ffffff',
    },
    action: {
      hover: 'rgba(216, 67, 21, 0.08)',     // Warm amber tinted hover
      selected: 'rgba(216, 67, 21, 0.16)',   // Warm amber tinted selected
      hoverOpacity: 0.08,
      selectedOpacity: 0.16,
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  shape: {
    borderRadius: 2,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 3,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
          textTransform: 'none',
          fontWeight: 600,
          transition: 'all 0.2s ease',
        },
        contained: {
          boxShadow: '0 2px 6px rgba(216, 67, 21, 0.18)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(216, 67, 21, 0.25)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        outlined: {
          borderColor: 'rgba(216, 67, 21, 0.2)',
        },
      },
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Notification />
      <BrowserRouter>
        <Routes>
          {/* Login route (no layout) */}
          <Route path="/login" element={<Login />} />

          {/* Employee routes (with EmployeeLayout) */}
          <Route element={<AuthGuard />}>
            <Route element={<EmployeeLayout />}>
              <Route path="/" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<OrderList />} />
              <Route path="/orders/:id" element={<OrderDetail />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Admin routes (with AdminLayout + RoleGuard) */}
            <Route element={<RoleGuard requiredRole="ADMIN" />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/admin/products" element={<AdminProductList />} />
                <Route path="/admin/products/new" element={<AdminProductForm />} />
                <Route path="/admin/products/:id/edit" element={<AdminProductForm />} />
                <Route path="/admin/orders" element={<AdminOrderList />} />
                <Route path="/admin/users" element={<AdminUserList />} />
                <Route path="/admin/categories" element={<AdminCategoryList />} />
              </Route>
            </Route>
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
