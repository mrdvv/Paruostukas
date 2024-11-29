import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import useStore from '../store/store.js';
import ProductCard from './productcard.jsx';

const ProductList = () => {
  const fetchProducts = useStore((state) => state.products.fetchProducts);
  const products = useStore((state) => state.products.list);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Our Ads
      </Typography>
      <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2}>
        {products.length > 0 ? (
          products.map((product) => <ProductCard key={product._id} product={product} />)
        ) : (
          <Typography>No products available.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default ProductList;
