// Enterprise Mall - OrderList Page
// Employee order history with status filter and pagination

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

import { useOrderStore } from '../../stores/orderStore';
import OrderStatusTag from '../../components/OrderStatusTag';
import PointBadge from '../../components/PointBadge';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatDate } from '../../utils/format';
import { ORDER_STATUS_LABELS } from '../../utils/constants';

const OrderList: React.FC = () => {
  const navigate = useNavigate();
  const orderStore = useOrderStore();

  useEffect(() => {
    orderStore.fetchOrders();
  }, []);

  const handleStatusFilter = (status: string | undefined) => {
    orderStore.setStatusFilter(status || undefined);
  };

  const handlePageChange = (page: number) => {
    orderStore.setPage(page);
  };

  if (orderStore.loading && orderStore.orders.length === 0) {
    return <LoadingSpinner message="加载订单列表..." fullPage />;
  }

  const totalPages: number = Math.max(1, Math.ceil(orderStore.total / orderStore.pageSize));

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          我的订单
        </Typography>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>状态筛选</InputLabel>
          <Select
            value={orderStore.statusFilter || ''}
            label="状态筛选"
            onChange={(e) => handleStatusFilter(e.target.value === '' ? undefined : e.target.value)}
          >
            <MenuItem value="">全部</MenuItem>
            {Object.entries(ORDER_STATUS_LABELS).map(([key, label]) => (
              <MenuItem key={key} value={key}>{label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {orderStore.orders.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="body1" color="text.secondary">
            暂无订单
          </Typography>
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} className="card-shadow">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>订单号</TableCell>
                  <TableCell>状态</TableCell>
                  <TableCell>总积分</TableCell>
                  <TableCell>创建时间</TableCell>
                  <TableCell>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderStore.orders.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>{order.orderNo}</TableCell>
                    <TableCell>
                      <OrderStatusTag status={order.status} />
                    </TableCell>
                    <TableCell>
                      <PointBadge points={order.totalPoints} />
                    </TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell>
                      <Chip
                        label="查看详情"
                        clickable
                        color="primary"
                        variant="outlined"
                        onClick={() => navigate(`/orders/${order.id}`)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Pagination
            page={orderStore.page}
            pageSize={orderStore.pageSize}
            total={orderStore.total}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </Box>
  );
};

export default OrderList;
