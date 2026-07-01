// Enterprise Mall - ProductDetail Page
// Displays full product details with image carousel, info, and add-to-cart

import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  Alert,
  Chip,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

import { useProductStore } from '../../stores/productStore';
import { useCartStore } from '../../stores/cartStore';
import { useNotification } from '../../hooks/useNotification';
import ImageCarousel from '../../components/ImageCarousel';
import PointBadge from '../../components/PointBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productStore = useProductStore();
  const cartStore = useCartStore();
  const { notifySuccess, notifyError } = useNotification();

  const productId: number = parseInt(id || '0', 10);

  useEffect(() => {
    if (productId) {
      productStore.fetchProductById(productId);
    }
  }, [productId]);

  const handleAddToCart = async () => {
    try {
      await cartStore.addItem(productId, 1);
      notifySuccess('已添加到购物车');
    } catch (error: any) {
      notifyError(error?.message || '添加购物车失败');
    }
  };

  if (productStore.loading) {
    return <LoadingSpinner message="加载商品详情..." fullPage />;
  }

  if (!productStore.currentProduct) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Alert severity="warning">商品不存在或已被下架</Alert>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/')}>
          返回商品列表
        </Button>
      </Box>
    );
  }

  const product = productStore.currentProduct;

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Image section */}
        <Box sx={{ flex: 1 }}>
          <ImageCarousel images={product.images} height={400} />
        </Box>

        {/* Info section */}
        <Paper sx={{ flex: 1, p: 3, borderRadius: 2 }} className="card-shadow">
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
            {product.name}
          </Typography>

          {product.category && (
            <Chip label={product.category.name} size="small" variant="outlined" sx={{ mb: 2 }} />
          )}

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 2 }}>
            <PointBadge points={product.pointsPrice} label="兑换积分" size="large" />
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            库存: {product.stock} 件
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Description */}
          {product.description && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                商品描述
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {product.description}
              </Typography>
            </Box>
          )}

          {/* Add to cart button */}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            startIcon={<AddShoppingCartIcon />}
            onClick={handleAddToCart}
            disabled={product.stock <= 0 || cartStore.loading}
            sx={{ mt: 2 }}
          >
            {product.stock > 0 ? '加入购物车' : '库存不足'}
          </Button>

          {product.stock > 0 && product.stock <= 10 && (
            <Typography variant="body2" color="warning.main" sx={{ mt: 1, textAlign: 'center' }}>
              库存紧张，仅剩 {product.stock} 件
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default ProductDetail;
