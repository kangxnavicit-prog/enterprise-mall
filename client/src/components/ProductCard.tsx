// Enterprise Mall - ProductCard Component
// Displays product summary in a card format for listing pages

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import { Product } from '../types/product';
import PointBadge from './PointBadge';
import { useCartStore } from '../stores/cartStore';
import { useNotification } from '../hooks/useNotification';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);
  const [adding, setAdding] = useState(false);
  const { notifySuccess, notifyError } = useNotification();

  const imageUrl: string = product.images.length > 0
    ? product.images[0]
    : '/uploads/products/placeholder.jpg';

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent navigating to detail page
    if (adding) return;
    setAdding(true);
    try {
      await addItem(product.id, 1);
      notifySuccess(`${product.name} 已加入购物车`);
    } catch {
      notifyError('加入购物车失败');
    } finally {
      setAdding(false);
    }
  };

  return (
    <Card
      onClick={handleClick}
      className="cursor-pointer transition-hover card-shadow"
      sx={{ borderRadius: 2, overflow: 'hidden', height: 350, display: 'flex', flexDirection: 'column' }}
    >
      {/* Product image area */}
      <Box sx={{ height: 185, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
        <img
          src={imageUrl}
          alt={product.name}
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
        />
      </Box>

      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 }, display: 'flex', flexDirection: 'column', gap: 0.3 }}>
        <Typography
          variant="subtitle2"
          fontWeight="bold"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.25,
            minHeight: '2.5em',
          }}
        >
          {product.name}
        </Typography>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.25 }}>
          SKU: {product.sku}
        </Typography>

        {product.category && (
          <Chip
            label={product.category.name}
            size="small"
            variant="outlined"
            sx={{ height: 22, fontSize: '0.7rem', mt: 0.25 }}
          />
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 0.5 }}>
          <PointBadge points={product.pointsPrice} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              库存: {product.stock}
            </Typography>
            {/* Cart button */}
            <IconButton
              size="small"
              onClick={handleAddToCart}
              disabled={adding}
              sx={{
                bgcolor: 'rgba(216, 67, 21, 0.06)',
                color: 'accent.main',
                borderRadius: 1.5,
                p: 0.5,
                border: '1px solid rgba(216, 67, 21, 0.12)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: 'rgba(216, 67, 21, 0.14)',
                  boxShadow: '0 2px 6px rgba(216, 67, 21, 0.2)',
                  transform: 'scale(1.08)',
                },
              }}
            >
              <ShoppingCartIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
