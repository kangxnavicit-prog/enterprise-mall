// Enterprise Mall - CategoryFilter Component
// Category selection filter chips for product listing

import React from 'react';
import { Box, Chip } from '@mui/material';

import { Category } from '../types/product';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId?: number;
  onSelect: (categoryId?: number) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategoryId,
  onSelect,
}) => {
  const activeCategories = categories.filter((c: Category) => c.isActive);

  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
      <Chip
        label="全部"
        variant={selectedCategoryId === undefined ? 'filled' : 'outlined'}
        color={selectedCategoryId === undefined ? 'primary' : 'default'}
        onClick={() => onSelect(undefined)}
      />
      {activeCategories.map((category: Category) => (
        <Chip
          key={category.id}
          label={category.icon ? `${category.icon} ${category.name}` : category.name}
          variant={selectedCategoryId === category.id ? 'filled' : 'outlined'}
          color={selectedCategoryId === category.id ? 'primary' : 'default'}
          onClick={() => onSelect(category.id)}
        />
      ))}
    </Box>
  );
};

export default CategoryFilter;
