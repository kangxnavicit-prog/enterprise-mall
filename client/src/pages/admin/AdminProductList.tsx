// Enterprise Mall - AdminProductList Page
// Admin product management with table and actions

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
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';

import { useAdminStore } from '../../stores/adminStore';
import { useNotification } from '../../hooks/useNotification';
import PointBadge from '../../components/PointBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import ProductImportDialog from '../../components/ProductImportDialog';

const AdminProductList: React.FC = () => {
  const navigate = useNavigate();
  const adminStore = useAdminStore();
  const { notifySuccess, notifyError } = useNotification();
  const [deleteTarget, setDeleteTarget] = React.useState<number | null>(null);
  const [importDialogOpen, setImportDialogOpen] = React.useState<boolean>(false);

  useEffect(() => {
    adminStore.fetchAdminProducts({ pageSize: 100 });
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminStore.deleteProduct(deleteTarget);
      notifySuccess('商品已删除');
      adminStore.fetchAdminProducts({ pageSize: 100 });
    } catch (error: any) {
      notifyError(error?.message || '删除失败');
    }
    setDeleteTarget(null);
  };

  if (adminStore.adminProductLoading && adminStore.adminProducts.length === 0) {
    return <LoadingSpinner message="加载商品列表..." />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          商品管理
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/products/new')}
        >
          新增商品
        </Button>
        <Button
          variant="outlined"
          startIcon={<UploadFileIcon />}
          onClick={() => setImportDialogOpen(true)}
          sx={{ ml: 1 }}
        >
          批量导入
        </Button>
      </Box>

      <TableContainer component={Paper} className="card-shadow">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>名称</TableCell>
              <TableCell>分类</TableCell>
              <TableCell>积分价</TableCell>
              <TableCell>库存</TableCell>
              <TableCell>状态</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {adminStore.adminProducts.map((product) => (
              <TableRow key={product.id} hover>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category?.name || '-'}</TableCell>
                <TableCell>
                  <PointBadge points={product.pointsPrice} />
                </TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <Chip
                    label={product.status === 'ACTIVE' ? '上架' : '下架'}
                    color={product.status === 'ACTIVE' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small" color="primary" onClick={() => navigate(`/admin/products/${product.id}/edit`)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => setDeleteTarget(product.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteTarget !== null} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          <Typography>确认要删除该商品吗？删除后商品将标记为下架状态。</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>取消</Button>
          <Button color="error" onClick={handleDelete}>确认删除</Button>
        </DialogActions>
      </Dialog>

      {/* Product import dialog */}
      <ProductImportDialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        onSuccess={() => adminStore.fetchAdminProducts({ pageSize: 100 })}
      />
    </Box>
  );
};

export default AdminProductList;
