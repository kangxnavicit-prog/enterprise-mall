// Enterprise Mall - OrderDetail Page
// Displays full order detail including items, status, and tracking info

import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Alert,
} from '@mui/material';

import { useOrderStore } from '../../stores/orderStore';
import OrderStatusTag from '../../components/OrderStatusTag';
import PointBadge from '../../components/PointBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatDate } from '../../utils/format';

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const orderStore = useOrderStore();

  const orderId: number = parseInt(id || '0', 10);

  useEffect(() => {
    if (orderId) {
      orderStore.fetchOrderById(orderId);
    }
  }, [orderId]);

  if (orderStore.loading) {
    return <LoadingSpinner message="加载订单详情..." fullPage />;
  }

  if (!orderStore.currentOrder) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Alert severity="warning">订单不存在</Alert>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/orders')}>
          返回订单列表
        </Button>
      </Box>
    );
  }

  const order = orderStore.currentOrder;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          订单详情
        </Typography>
        <OrderStatusTag status={order.status} size="medium" />
      </Box>

      {/* Order info */}
      <Paper sx={{ p: 3, mb: 2, borderRadius: 2 }} className="card-shadow">
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
          基本信息
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">订单号</Typography>
            <Typography variant="body1">{order.orderNo}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">创建时间</Typography>
            <Typography variant="body1">{formatDate(order.createdAt)}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">收货地址</Typography>
            <Typography variant="body1">{order.address || '未填写'}</Typography>
          </Box>
          {order.trackingNo && (
            <Box>
              <Typography variant="body2" color="text.secondary">快递单号</Typography>
              <Typography variant="body1">{order.trackingNo}</Typography>
            </Box>
          )}
          {order.shippedAt && (
            <Box>
              <Typography variant="body2" color="text.secondary">发货时间</Typography>
              <Typography variant="body1">{formatDate(order.shippedAt)}</Typography>
            </Box>
          )}
          {order.completedAt && (
            <Box>
              <Typography variant="body2" color="text.secondary">完成时间</Typography>
              <Typography variant="body1">{formatDate(order.completedAt)}</Typography>
            </Box>
          )}
          {order.remark && (
            <Box sx={{ gridColumn: '1 / -1' }}>
              <Typography variant="body2" color="text.secondary">备注</Typography>
              <Typography variant="body1">{order.remark}</Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <PointBadge points={order.totalPoints} label="订单总积分" size="large" />
        </Box>
      </Paper>

      {/* Order items */}
      <Paper sx={{ p: 3, borderRadius: 2 }} className="card-shadow">
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
          商品明细
        </Typography>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>商品</TableCell>
                <TableCell align="center">单价</TableCell>
                <TableCell align="center">数量</TableCell>
                <TableCell align="right">小计</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.orderItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {item.productImage && (
                        <Box
                          component="img"
                          src={item.productImage}
                          alt={item.productName}
                          sx={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 1 }}
                        />
                      )}
                      <Typography variant="body2">{item.productName}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <PointBadge points={item.pointsPrice} />
                  </TableCell>
                  <TableCell align="center">{item.quantity}</TableCell>
                  <TableCell align="right">
                    <PointBadge points={item.pointsPrice * item.quantity} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate('/orders')}>
        返回订单列表
      </Button>
    </Box>
  );
};

export default OrderDetail;
