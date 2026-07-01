// Enterprise Mall - AdminUserList Page
// Admin user management with point adjustment dialog

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
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import { useAdminStore } from '../../stores/adminStore';
import { useNotification } from '../../hooks/useNotification';
import PointBadge from '../../components/PointBadge';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';
import { USER_ROLE_LABELS } from '../../utils/constants';

const AdminUserList: React.FC = () => {
  const adminStore = useAdminStore();
  const { notifySuccess, notifyError } = useNotification();

  const [page, setPage] = useState<number>(1);
  const pageSize = 20;

  // Point adjustment dialog state
  const [adjustDialogOpen, setAdjustDialogOpen] = useState<boolean>(false);
  const [targetUserId, setTargetUserId] = useState<number>(0);
  const [targetUsername, setTargetUsername] = useState<string>('');
  const [adjustPoints, setAdjustPointsAmount] = useState<number>(0);
  const [adjustType, setAdjustType] = useState<string>('GRANT');
  const [adjustReason, setAdjustReason] = useState<string>('');

  useEffect(() => {
    adminStore.fetchAdminUsers({ page, pageSize });
  }, [page]);

  const handleOpenAdjust = (userId: number, username: string) => {
    setTargetUserId(userId);
    setTargetUsername(username);
    setAdjustPointsAmount(0);
    setAdjustType('GRANT');
    setAdjustReason('');
    setAdjustDialogOpen(true);
  };

  const handleAdjust = async () => {
    if (adjustPoints <= 0) {
      notifyError('积分数量必须大于0');
      return;
    }

    try {
      await adminStore.adjustUserPoints(targetUserId, {
        points: adjustPoints,
        type: adjustType,
        reason: adjustReason.trim() || undefined,
      });
      notifySuccess(`${adjustType === 'GRANT' ? '发放' : '调整'}积分成功`);
      setAdjustDialogOpen(false);
    } catch (error: any) {
      notifyError(error?.message || '操作失败');
    }
  };

  if (adminStore.adminUserLoading && adminStore.adminUsers.length === 0) {
    return <LoadingSpinner message="加载用户列表..." />;
  }

  const totalPages: number = Math.max(1, Math.ceil(adminStore.adminUserTotal / pageSize));

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        用户管理
      </Typography>

      <TableContainer component={Paper} className="card-shadow">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>工号</TableCell>
              <TableCell>用户名</TableCell>
              <TableCell>角色</TableCell>
              <TableCell>部门</TableCell>
              <TableCell>积分</TableCell>
              <TableCell>状态</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {adminStore.adminUsers.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>{user.employeeId}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  <Chip
                    label={USER_ROLE_LABELS[user.role] || user.role}
                    color={user.role === 'ADMIN' ? 'primary' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{user.department || '-'}</TableCell>
                <TableCell>
                  <PointBadge points={user.points} size="medium" />
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.isActive ? '正常' : '禁用'}
                    color={user.isActive ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    icon={<AddCircleIcon />}
                    label="调整积分"
                    clickable
                    color="primary"
                    variant="outlined"
                    size="small"
                    onClick={() => handleOpenAdjust(user.id, user.username)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        page={page}
        pageSize={pageSize}
        total={adminStore.adminUserTotal}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* Point adjustment dialog */}
      <Dialog open={adjustDialogOpen} onClose={() => setAdjustDialogOpen(false)}>
        <DialogTitle>调整积分 - {targetUsername}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>操作类型</InputLabel>
            <Select value={adjustType} label="操作类型" onChange={(e) => setAdjustType(e.target.value)}>
              <MenuItem value="GRANT">发放积分（增加）</MenuItem>
              <MenuItem value="ADJUST">调整积分（增加/扣减）</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="积分数量"
            type="number"
            value={adjustPoints}
            onChange={(e) => setAdjustPointsAmount(Number(e.target.value))}
            margin="normal"
            required
            inputProps={{ min: 1 }}
            helperText={adjustType === 'ADJUST' ? '正数为增加，负数为扣减' : ''}
          />

          <TextField
            fullWidth
            label="原因"
            value={adjustReason}
            onChange={(e) => setAdjustReason(e.target.value)}
            margin="normal"
            placeholder="请填写操作原因"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAdjustDialogOpen(false)}>取消</Button>
          <Button variant="contained" color="primary" onClick={handleAdjust} disabled={adjustPoints <= 0}>
            确认操作
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminUserList;
