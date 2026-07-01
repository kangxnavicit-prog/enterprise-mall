// Enterprise Mall - Login Page
// Employee login form with employee ID and password

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';

import { useAuthStore } from '../../stores/authStore';
import { useNotification } from '../../hooks/useNotification';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuthStore();
  const { notifySuccess, notifyError } = useNotification();

  const [employeeId, setEmployeeId] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!employeeId.trim()) {
      notifyError('请输入工号');
      return;
    }
    if (!password) {
      notifyError('请输入密码');
      return;
    }

    try {
      await login(employeeId.trim(), password);
      notifySuccess('登录成功');
      navigate('/');
    } catch (err: any) {
      notifyError(err?.message || '登录失败');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          bgcolor: '#ffffff',
          border: '1px solid rgba(216, 67, 21, 0.06)',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Box
            component="img"
            src="/logo.png"
            alt="致欧商城"
            sx={{ height: 56, objectFit: 'contain', mb: 1 }}
          />
          <Typography variant="h5" fontWeight="bold" sx={{ color: '#2c3e50' }}>
            致欧商城
          </Typography>
          <Typography variant="body2" color="text.secondary">
            请使用工号和密码登录
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="工号"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            margin="normal"
            required
            variant="outlined"
            placeholder="例如: EMP001"
            InputLabelProps={{ shrink: true }}
            inputProps={{ style: { padding: '16px 14px' } }}
          />

          <TextField
            fullWidth
            label="密码"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            variant="outlined"
            placeholder="请输入密码"
            InputLabelProps={{ shrink: true }}
            inputProps={{ style: { padding: '16px 14px' } }}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3, mb: 2, borderRadius: 3 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : '登录'}
          </Button>
        </form>

        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
          测试账号: ADMIN001/admin123 (管理员) | EMP001/emp123 (员工)
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;
