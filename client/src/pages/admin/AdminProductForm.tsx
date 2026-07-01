// Enterprise Mall - AdminProductForm Page
// Product creation and editing form for admin

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';

import { useAdminStore } from '../../stores/adminStore';
import { useProductStore } from '../../stores/productStore';
import { useNotification } from '../../hooks/useNotification';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const adminStore = useAdminStore();
  const productStore = useProductStore();
  const { notifySuccess, notifyError } = useNotification();

  const isEditing: boolean = !!id;
  const productId: number = parseInt(id || '0', 10);

  const [categoryId, setCategoryId] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [pointsPrice, setPointsPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [status, setStatus] = useState<string>('ACTIVE');

  useEffect(() => {
    adminStore.fetchCategories();

    if (isEditing) {
      productStore.fetchProductById(productId);
    }
  }, []);

  // Populate form with existing product data
  useEffect(() => {
    if (isEditing && productStore.currentProduct) {
      const product = productStore.currentProduct;
      setCategoryId(product.categoryId);
      setName(product.name);
      setDescription(product.description || '');
      setPointsPrice(product.pointsPrice);
      setStock(product.stock);
      setStatus(product.status);
    }
  }, [productStore.currentProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      notifyError('商品名称不能为空');
      return;
    }
    if (categoryId === 0) {
      notifyError('请选择分类');
      return;
    }
    if (pointsPrice <= 0) {
      notifyError('积分价格必须大于0');
      return;
    }

    try {
      if (isEditing) {
        await adminStore.updateProduct(productId, {
          categoryId,
          name: name.trim(),
          description: description.trim() || undefined,
          pointsPrice,
          stock,
          status,
        });
        notifySuccess('商品更新成功');
      } else {
        await adminStore.createProduct({
          categoryId,
          name: name.trim(),
          description: description.trim() || undefined,
          pointsPrice,
          stock,
          status,
        });
        notifySuccess('商品创建成功');
      }
      navigate('/admin/products');
    } catch (error: any) {
      notifyError(error?.message || '操作失败');
    }
  };

  if (isEditing && productStore.loading) {
    return <LoadingSpinner message="加载商品信息..." />;
  }

  const categories = adminStore.categories.filter((c) => c.isActive);

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        {isEditing ? '编辑商品' : '新增商品'}
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 2 }} className="card-shadow">
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel>分类</InputLabel>
            <Select value={categoryId} label="分类" onChange={(e) => setCategoryId(Number(e.target.value))}>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.icon ? `${category.icon} ` : ''}{category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="商品名称"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="商品描述"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            multiline
            rows={3}
          />

          <TextField
            fullWidth
            label="积分价格"
            type="number"
            value={pointsPrice}
            onChange={(e) => setPointsPrice(Number(e.target.value))}
            margin="normal"
            required
            inputProps={{ min: 1 }}
          />

          <TextField
            fullWidth
            label="库存数量"
            type="number"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            margin="normal"
            inputProps={{ min: 0 }}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>状态</InputLabel>
            <Select value={status} label="状态" onChange={(e) => setStatus(e.target.value)}>
              <MenuItem value="ACTIVE">上架</MenuItem>
              <MenuItem value="INACTIVE">下架</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button variant="outlined" onClick={() => navigate('/admin/products')}>
              取消
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={adminStore.productLoading}
            >
              {adminStore.productLoading ? <CircularProgress size={24} /> : (isEditing ? '保存修改' : '创建商品')}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AdminProductForm;
