// Enterprise Mall - CartItemCard Component
// Displays a cart item with product info, quantity controls, and removal

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';

import { CartItemWithProduct } from '../types/product';
import PointBadge from './PointBadge';

interface CartItemCardProps {
  item: CartItemWithProduct;
  onUpdateQuantity: (cartItemId: number, quantity: number) => void;
  onRemove: (cartItemId: number) => void;
  loading?: boolean;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item, onUpdateQuantity, onRemove, loading }) => {
  const imageUrl: string = item.product.images.length > 0
    ? item.product.images[0]
    : '/uploads/products/placeholder.jpg';

  const subtotal: number = item.product.pointsPrice * item.quantity;

  const handleIncrement = () => {
    if (item.quantity < item.product.stock) {
      onUpdateQuantity(item.id, item.quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    onRemove(item.id);
  };

  return (
    <Card sx={{ display: 'flex', mb: 2, borderRadius: 2 }} className="card-shadow">
      {/* Product image area — warm tinted background */}
      <Box sx={{ width: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
        <img
          src={imageUrl}
          alt={item.product.name}
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', height: 120 }}
        />
      </Box>
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', py: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" noWrap>
          {item.product.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
          <PointBadge points={item.product.pointsPrice} label="单价" />
          <Typography variant="body2" color="text.secondary">
            库存: {item.product.stock}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
          {/* Quantity controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="small" onClick={handleDecrement} disabled={loading || item.quantity <= 1}>
              <RemoveIcon />
            </IconButton>
            <TextField
              value={item.quantity}
              size="small"
              sx={{ width: 60, textAlign: 'center' }}
              inputProps={{ readOnly: true, style: { textAlign: 'center' } }}
            />
            <IconButton size="small" onClick={handleIncrement} disabled={loading || item.quantity >= item.product.stock}>
              <AddIcon />
            </IconButton>
          </Box>

          {/* Subtotal and delete */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <PointBadge points={subtotal} label="小计" size="medium" />
            <IconButton color="error" onClick={handleRemove} disabled={loading}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CartItemCard;
