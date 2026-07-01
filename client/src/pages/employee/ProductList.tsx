// Enterprise Mall - ProductList Page
// Employee product listing with search, category filter, and pagination

import React, { useEffect } from 'react';
import { Box, Typography, Grid } from '@mui/material';

import { useProductStore } from '../../stores/productStore';
import { useAdminStore } from '../../stores/adminStore';
import ProductCard from '../../components/ProductCard';
import SearchBar from '../../components/SearchBar';
import CategoryFilter from '../../components/CategoryFilter';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';

const ProductList: React.FC = () => {
  const productStore = useProductStore();
  const categories = useAdminStore((state) => state.categories);
  const fetchCategories = useAdminStore((state) => state.fetchCategories);

  useEffect(() => {
    productStore.fetchProducts();
    fetchCategories();
  }, []);

  const handleSearch = (query: string) => {
    productStore.setFilters({ ...productStore.filters, search: query });
  };

  const handleCategorySelect = (categoryId?: number) => {
    productStore.setFilters({ ...productStore.filters, category: categoryId });
  };

  const handlePageChange = (page: number) => {
    productStore.setPage(page);
  };

  if (productStore.loading && productStore.products.length === 0) {
    return <LoadingSpinner message="加载商品列表..." fullPage />;
  }

  const totalPages: number = Math.max(1, Math.ceil(productStore.total / productStore.pageSize));

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        商品列表
      </Typography>

      {/* Search and filter controls */}
      <Box sx={{ mb: 3 }}>
        <SearchBar onSearch={handleSearch} placeholder="搜索商品名称..." />
      </Box>

      <CategoryFilter
        categories={categories}
        selectedCategoryId={productStore.filters.category}
        onSelect={handleCategorySelect}
      />

      {/* Product grid */}
      {productStore.products.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="body1" color="text.secondary">
            暂无商品
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {productStore.products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      {productStore.total > productStore.pageSize && (
        <Pagination
          page={productStore.page}
          pageSize={productStore.pageSize}
          total={productStore.total}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </Box>
  );
};

export default ProductList;
