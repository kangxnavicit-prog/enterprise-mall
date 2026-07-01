// Enterprise Mall - AdminCategoryList Page
// Admin category management with create, edit, and delete

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
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { useAdminStore } from '../../stores/adminStore';
import { useNotification } from '../../hooks/useNotification';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Category } from '../../types/product';

const AdminCategoryList: React.FC = () => {
  const adminStore = useAdminStore();
  const { notifySuccess, notifyError } = useNotification();

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number>(0);

  // Form fields
  const [name, setName] = useState<string>('');
  const [icon, setIcon] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<number>(0);

  useEffect(() => {
    adminStore.fetchCategories();
  }, []);

  const openCreateDialog = () => {
    setEditingCategory(null);
    setName('');
    setIcon('');
    setSortOrder(0);
    setDialogOpen(true);
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setIcon(category.icon || '');
    setSortOrder(category.sortOrder);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      notifyError('分类名称不能为空');
      return;
    }

    try {
      if (editingCategory) {
        await adminStore.updateCategory(editingCategory.id, {
          name: name.trim(),
          icon: icon.trim() || undefined,
          sortOrder,
        });
        notifySuccess('分类更新成功');
      } else {
        await adminStore.createCategory({
          name: name.trim(),
          icon: icon.trim() || undefined,
          sortOrder,
        });
        notifySuccess('分类创建成功');
      }
      setDialogOpen(false);
    } catch (error: any) {
      notifyError(error?.message || '操作失败');
    }
  };

  const handleDelete = async () => {
    try {
      await adminStore.deleteCategory(deleteTarget);
      notifySuccess('分类已删除');
    } catch (error: any) {
      notifyError(error?.message || '删除失败');
    }
    setDeleteDialogOpen(false);
  };

  if (adminStore.categoryLoading && adminStore.categories.length === 0) {
    return <LoadingSpinner message="加载分类列表..." />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          分类管理
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateDialog}>
          新增分类
        </Button>
      </Box>

      <TableContainer component={Paper} className="card-shadow">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>图标</TableCell>
              <TableCell>名称</TableCell>
              <TableCell>排序</TableCell>
              <TableCell>状态</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {adminStore.categories.map((category) => (
              <TableRow key={category.id} hover>
                <TableCell>{category.id}</TableCell>
                <TableCell>{category.icon || '-'}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.sortOrder}</TableCell>
                <TableCell>
                  <Chip
                    label={category.isActive ? '启用' : '禁用'}
                    color={category.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small" color="primary" onClick={() => openEditDialog(category)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => {
                    setDeleteTarget(category.id);
                    setDeleteDialogOpen(true);
                  }}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{editingCategory ? '编辑分类' : '新增分类'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="分类名称"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="图标（emoji或文字）"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            margin="normal"
            placeholder="例如: 📱"
          />
          <TextField
            fullWidth
            label="排序权重"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            margin="normal"
            inputProps={{ min: 0 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>取消</Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            {editingCategory ? '保存修改' : '创建分类'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          <Typography>确认要删除该分类吗？如果分类下有活跃商品则无法删除。</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>取消</Button>
          <Button color="error" onClick={handleDelete}>确认删除</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminCategoryList;
