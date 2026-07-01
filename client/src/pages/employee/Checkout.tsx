// Enterprise Mall - Checkout Page
// Order confirmation page with address, summary, and submit

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';

import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import { useOrderStore } from '../../stores/orderStore';
import { useNotification } from '../../hooks/useNotification';
import PointBadge from '../../components/PointBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const cartStore = useCartStore();
  const authStore = useAuthStore();
  const orderStore = useOrderStore();
  const { notifySuccess, notifyError } = useNotification();

  const [address, setAddress] = useState<string>(authStore.user?.address || '');
  const [remark, setRemark] = useState<string>('');

  const totalPoints: number = cartStore.totalPoints();
  const userPoints: number = authStore.user?.points ?? 0;
  const canSubmit: boolean = cartStore.items.length > 0 && userPoints >= totalPoints && address.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    try {
      const order = await orderStore.createOrder({
        address: address.trim(),
        remark: remark.trim() || undefined,
      });

      // Clear cart and update user points after successful order
      cartStore.clearLocalCart();
      authStore.updatePoints(userPoints - totalPoints);
      notifySuccess('订单创建成功！');

      navigate(`/orders/${order.id}`);
    } catch (error: any) {
      notifyError(error?.message || '下单失败');
    }
  };

  if (cartStore.items.length === 0 && !orderStore.loading) {
    navigate('/cart');
    return null;
  }

  if (orderStore.loading) {
    return <LoadingSpinner message="正在创建订单..." fullPage />;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        <PaymentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        确认订单
      </Typography>

      {/* Order items summary */}
      <Paper sx={{ p: 3, mb: 2, borderRadius: 2 }} className="card-shadow">
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
          商品清单
        </Typography>

        {cartStore.items.map((item) => (
          <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body1">
              {item.product.name} × {item.quantity}
            </Typography>
            <PointBadge points={item.product.pointsPrice * item.quantity} />
          </Box>
        ))}

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" fontWeight="bold">
            总计: {cartStore.itemCount()} 件商品
          </Typography>
          <PointBadge points={totalPoints} label="消耗积分" size="large" />
        </Box>
      </Paper>

      {/* Address and remark */}
      <Paper sx={{ p: 3, mb: 2, borderRadius: 2 }} className="card-shadow">
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
          收货信息
        </Typography>

        <TextField
          fullWidth
          label="收货地址"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          margin="normal"
          required
          placeholder="请输入收货地址"
          multiline
          rows={2}
        />

        <TextField
          fullWidth
          label="备注（可选）"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          margin="normal"
          placeholder="订单备注信息"
          multiline
          rows={2}
        />
      </Paper>

      {/* Points balance check */}
      <Paper sx={{ p: 3, mb: 2, borderRadius: 2 }} className="card-shadow">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1">
            当前积分余额: {userPoints.toLocaleString()}
          </Typography>
          {userPoints < totalPoints && (
            <Alert severity="error" sx={{ flex: 1, ml: 2 }}>
              积分不足！还需 {(totalPoints - userPoints).toLocaleString()} 积分
            </Alert>
          )}
        </Box>
      </Paper>

      {/* Submit button */}
      <Button
        fullWidth
        variant="contained"
        color="primary"
        size="large"
        onClick={handleSubmit}
        disabled={!canSubmit || orderStore.loading}
        sx={{ mt: 2 }}
      >
        {orderStore.loading ? <CircularProgress size={24} /> : `确认兑换 (${totalPoints.toLocaleString()} 积分)`}
      </Button>
    </Box>
  );
};

export default Checkout;
