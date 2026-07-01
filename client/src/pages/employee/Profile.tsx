// Enterprise Mall - Profile Page
// User profile display and edit, plus point records and recent orders list

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Link,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '../../stores/authStore';
import { getPointRecords } from '../../api/user';
import { getOrders } from '../../api/order';
import { updateProfile } from '../../api/user';
import { useNotification } from '../../hooks/useNotification';
import PointBadge from '../../components/PointBadge';
import OrderStatusTag from '../../components/OrderStatusTag';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatDate, formatPoints } from '../../utils/format';
import { POINT_TYPE_LABELS } from '../../utils/constants';
import { PointRecord } from '../../types/user';
import { Order } from '../../types/order';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const { notifySuccess, notifyError } = useNotification();
  const [pointRecords, setPointRecords] = useState<PointRecord[]>([]);
  const [pointTotal, setPointTotal] = useState<number>(0);
  const [loadingRecords, setLoadingRecords] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(false);

  const [username, setUsername] = useState<string>(authStore.user?.username || '');
  const [address, setAddress] = useState<string>(authStore.user?.address || '');
  const [department, setDepartment] = useState<string>(authStore.user?.department || '');

  useEffect(() => {
    fetchPointRecords();
    fetchOrders();
  }, []);

  const fetchPointRecords = async () => {
    setLoadingRecords(true);
    try {
      const response = await getPointRecords({ page: 1, pageSize: 20 });
      setPointRecords(response.data!.items || []);
      setPointTotal(response.data!.total);
    } catch {
      // Silently fail for point records
    } finally {
      setLoadingRecords(false);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await getOrders({ page: 1, pageSize: 5 });
      setOrders(response.data!.items || []);
    } catch {
      // Silently fail
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await updateProfile({ username, address, department });
      authStore.setAuth(response.data!, authStore.token!);
      notifySuccess('个人信息更新成功');
      setEditing(false);
    } catch (error: any) {
      notifyError(error?.message || '更新失败');
    } finally {
      setSaving(false);
    }
  };

  if (!authStore.user) {
    return <LoadingSpinner message="加载个人信息..." fullPage />;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        个人信息
      </Typography>

      {/* Profile info */}
      <Paper sx={{ p: 3, mb: 2, borderRadius: 2 }} className="card-shadow">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            基本信息
          </Typography>
          <Button variant="outlined" size="small" onClick={() => setEditing(!editing)}>
            {editing ? '取消编辑' : '编辑信息'}
          </Button>
        </Box>

        {editing ? (
          <Box>
            <TextField
              fullWidth
              label="用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="部门"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="收货地址"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              margin="normal"
              multiline
              rows={2}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={saving}
              sx={{ mt: 2 }}
            >
              {saving ? <CircularProgress size={24} /> : '保存'}
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">工号</Typography>
              <Typography variant="body1">{authStore.user.employeeId}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">用户名</Typography>
              <Typography variant="body1">{authStore.user.username}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">部门</Typography>
              <Typography variant="body1">{authStore.user.department || '未填写'}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">积分余额</Typography>
              <PointBadge points={authStore.user.points} size="medium" />
            </Box>
            <Box sx={{ gridColumn: '1 / -1' }}>
              <Typography variant="body2" color="text.secondary">收货地址</Typography>
              <Typography variant="body1">{authStore.user.address || '未填写'}</Typography>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Recent orders */}
      <Paper sx={{ p: 3, mb: 2, borderRadius: 2 }} className="card-shadow">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            最近订单
          </Typography>
          <Button size="small" onClick={() => navigate('/orders')}>
            查看全部
          </Button>
        </Box>

        {loadingOrders ? (
          <LoadingSpinner message="加载订单..." />
        ) : orders.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
            暂无订单
          </Typography>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>订单号</TableCell>
                  <TableCell align="center">积分</TableCell>
                  <TableCell align="center">状态</TableCell>
                  <TableCell>时间</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/orders/${order.id}`)}>
                    <TableCell>
                      <Link component="span" underline="hover" sx={{ cursor: 'pointer' }}>
                        {order.orderNo}
                      </Link>
                    </TableCell>
                    <TableCell align="center">{formatPoints(order.totalPoints)}</TableCell>
                    <TableCell align="center">
                      <OrderStatusTag status={order.status} size="small" />
                    </TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Point records */}
      <Paper sx={{ p: 3, borderRadius: 2 }} className="card-shadow">
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
          积分记录
        </Typography>

        {loadingRecords ? (
          <LoadingSpinner message="加载积分记录..." />
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>类型</TableCell>
                  <TableCell align="center">积分变动</TableCell>
                  <TableCell align="center">余额</TableCell>
                  <TableCell>原因</TableCell>
                  <TableCell>时间</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pointRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{POINT_TYPE_LABELS[record.type] || record.type}</TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="body2"
                        sx={{
                          color: record.type === 'CONSUME' ? 'error.main' : 'success.main',
                          fontWeight: 'bold',
                        }}
                      >
                        {record.type === 'CONSUME' ? '-' : '+'}{formatPoints(record.points)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">{formatPoints(record.balance)}</TableCell>
                    <TableCell>{record.reason || '-'}</TableCell>
                    <TableCell>{formatDate(record.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default Profile;
