// Enterprise Mall - Cart Page
// Shopping cart page with item list, total points, and checkout button

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Alert,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import CartItemCard from '../../components/CartItemCard';
import PointBadge from '../../components/PointBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const cartStore = useCartStore();
  const userPoints = useAuthStore((state) => state.user?.points ?? 0);

  const handleUpdateQuantity = async (cartItemId: number, quantity: number) => {
    await cartStore.updateItem(cartItemId, quantity);
  };

  const handleRemove = async (cartItemId: number) => {
    await cartStore.removeItem(cartItemId);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartStore.loading && cartStore.items.length === 0) {
    return <LoadingSpinner message="加载购物车..." />;
  }

  const totalPoints: number = cartStore.totalPoints();
  const canCheckout: boolean = cartStore.items.length > 0 && userPoints >= totalPoints;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        <ShoppingCartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        购物车
      </Typography>

      {cartStore.items.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          购物车为空，快去浏览商品吧！
        </Alert>
      ) : (
        <>
          {/* Cart items */}
          {cartStore.items.map((item) => (
            <CartItemCard
              key={item.id}
              item={item}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemove}
              loading={cartStore.loading}
            />
          ))}

          {/* Summary */}
          <Paper sx={{ p: 3, mt: 2, borderRadius: 2 }} className="card-shadow">
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body1">
                商品数量: {cartStore.itemCount()} 件
              </Typography>
              <PointBadge points={totalPoints} label="总计积分" size="large" />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="body1">
                当前积分: {userPoints.toLocaleString()}
              </Typography>
              {userPoints < totalPoints && (
                <Typography variant="body2" color="error.main">
                  积分不足！还需 {(totalPoints - userPoints).toLocaleString()} 积分
                </Typography>
              )}
            </Box>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              onClick={handleCheckout}
              disabled={!canCheckout || cartStore.loading}
              sx={{ mt: 1 }}
            >
              {canCheckout ? '去结算' : '积分不足，无法结算'}
            </Button>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default Cart;
