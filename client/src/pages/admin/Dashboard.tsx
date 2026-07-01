// Enterprise Mall - Admin Dashboard Page
// Admin overview dashboard with stats cards and top products chart

import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PeopleIcon from '@mui/icons-material/People';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

import { useAdminStore } from '../../stores/adminStore';
import PointBadge from '../../components/PointBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatPoints } from '../../utils/format';
import { DashboardStats } from '../../types';

const Dashboard: React.FC = () => {
  const adminStore = useAdminStore();

  useEffect(() => {
    adminStore.fetchDashboard();
  }, []);

  if (adminStore.dashboardLoading) {
    return <LoadingSpinner message="加载看板数据..." />;
  }

  const stats: DashboardStats | null = adminStore.dashboardStats;

  if (!stats) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="body1" color="text.secondary">
          无法加载看板数据
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        数据看板
      </Typography>

      {/* Stats cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2 }} className="card-shadow">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <ShoppingBagIcon color="primary" />
                <Typography variant="body2" color="text.secondary">今日订单</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                {stats.todayOrderCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2 }} className="card-shadow">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TrendingUpIcon color="secondary" />
                <Typography variant="body2" color="text.secondary">本月积分消耗</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="secondary.main">
                {formatPoints(stats.monthlyPointsConsumed)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2 }} className="card-shadow">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <LocalShippingIcon color="warning" />
                <Typography variant="body2" color="text.secondary">待发货</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {stats.pendingShipmentCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2 }} className="card-shadow">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <PeopleIcon color="success" />
                <Typography variant="body2" color="text.secondary">总用户数</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {stats.totalUsers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Top products */}
      <Paper sx={{ p: 3, borderRadius: 2 }} className="card-shadow">
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
          🔥 热销 TOP 5
        </Typography>

        {stats.topProducts.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            暂无销售数据
          </Typography>
        ) : (
          <Box>
            {stats.topProducts.map((product, index) => (
              <Box
                key={product.id}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2, borderBottom: '1px solid #eee' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h6" fontWeight="bold" color="primary.main" sx={{ minWidth: 30 }}>
                    #{index + 1}
                  </Typography>
                  <Typography variant="body1">{product.name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <PointBadge points={product.pointsPrice} label="积分价" />
                  <Typography variant="body2" color="success.main" fontWeight="bold">
                    已售 {product.totalSold} 件
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Dashboard;
