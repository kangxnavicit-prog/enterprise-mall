// Enterprise Mall - AdminOrderList Page
// Admin order management with status filter, ship/complete actions

import React, { useEffect, useState } from 'react';
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import { useAdminStore } from '../../stores/adminStore';
import { useNotification } from '../../hooks/useNotification';
import OrderStatusTag from '../../components/OrderStatusTag';
import PointBadge from '../../components/PointBadge';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatDate } from '../../utils/format';
import { ORDER_STATUS_LABELS } from '../../utils/constants';

const AdminOrderList: React.FC = () => {
  const adminStore = useAdminStore();
  const { notifySuccess, notifyError } = useNotification();

  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const pageSize = 20;

  // Ship dialog state
  const [shipDialogOpen, setShipDialogOpen] = useState<boolean>(false);
  const [shipOrderId, setShipOrderId] = useState<number>(0);
  const [trackingNo, setTrackingNo] = useState<string>('');

  useEffect(() => {
    adminStore.fetchAdminOrders({
      status: statusFilter || undefined,
      page,
      pageSize,
    });
  }, [statusFilter, page]);

  const handleShip = async () => {
    try {
      await adminStore.updateOrderStatus(shipOrderId, {
        status: 'SHIPPED',
        trackingNo: trackingNo.trim(),
      });
      notifySuccess('发货成功');
      setShipDialogOpen(false);
      setTrackingNo('');
    } catch (error: any) {
      notifyError(error?.message || '发货失败');
    }
  };

  const handleComplete = async (orderId: number) => {
    try {
      await adminStore.updateOrderStatus(orderId, { status: 'COMPLETED' });
      notifySuccess('订单已完成');
    } catch (error: any) {
      notifyError(error?.message || '操作失败');
    }
  };

  const handleCancel = async (orderId: number) => {
    try {
      await adminStore.updateOrderStatus(orderId, { status: 'CANCELLED' });
      notifySuccess('订单已取消，积分已退还');
    } catch (error: any) {
      notifyError(error?.message || '取消失败');
    }
  };

  const openShipDialog = (orderId: number) => {
    setShipOrderId(orderId);
    setTrackingNo('');
    setShipDialogOpen(true);
  };

  if (adminStore.adminOrderLoading && adminStore.adminOrders.length === 0) {
    return <LoadingSpinner message="加载订单列表..." />;
  }

  const totalPages: number = Math.max(1, Math.ceil(adminStore.adminOrderTotal / pageSize));

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          订单管理
        </Typography>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>状态筛选</InputLabel>
          <Select
            value={statusFilter}
            label="状态筛选"
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <MenuItem value="">全部</MenuItem>
            {Object.entries(ORDER_STATUS_LABELS).map(([key, label]) => (
              <MenuItem key={key} value={key}>{label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper} className="card-shadow">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>订单号</TableCell>
              <TableCell>用户</TableCell>
              <TableCell>总积分</TableCell>
              <TableCell>状态</TableCell>
              <TableCell>创建时间</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {adminStore.adminOrders.map((order: any) => (
              <TableRow key={order.id} hover>
                <TableCell>{order.orderNo}</TableCell>
                <TableCell>
                  {order.user ? `${order.user.username} (${order.user.employeeId})` : '-'}
                </TableCell>
                <TableCell>
                  <PointBadge points={order.totalPoints} />
                </TableCell>
                <TableCell>
                  <OrderStatusTag status={order.status} />
                </TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>
                  {order.status === 'PENDING' && (
                    <>
                      <Chip
                        icon={<LocalShippingIcon />}
                        label="发货"
                        clickable
                        color="info"
                        size="small"
                        onClick={() => openShipDialog(order.id)}
                        sx={{ mr: 1 }}
                      />
                      <Chip
                        icon={<CancelIcon />}
                        label="取消"
                        clickable
                        color="error"
                        size="small"
                        onClick={() => handleCancel(order.id)}
                      />
                    </>
                  )}
                  {order.status === 'SHIPPED' && (
                    <Chip
                      icon={<CheckCircleIcon />}
                      label="完成"
                      clickable
                      color="success"
                      size="small"
                      onClick={() => handleComplete(order.id)}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        page={page}
        pageSize={pageSize}
        total={adminStore.adminOrderTotal}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* Ship dialog */}
      <Dialog open={shipDialogOpen} onClose={() => setShipDialogOpen(false)}>
        <DialogTitle>确认发货</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="快递单号"
            value={trackingNo}
            onChange={(e) => setTrackingNo(e.target.value)}
            margin="normal"
            required
            placeholder="请输入快递单号"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShipDialogOpen(false)}>取消</Button>
          <Button variant="contained" color="primary" onClick={handleShip} disabled={!trackingNo.trim()}>
            确认发货
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminOrderList;
