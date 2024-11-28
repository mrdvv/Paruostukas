import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import useStore from '../store/store.js';
import ProductCard from '../components/productcard';
import axios from 'axios';
const MainPage = () => {
  const { list, setProducts } = useStore((state) => state.products);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/products');
        console.log('Fetched products:', response.data); // Log API response
        if (response.data.success) {
          setProducts(response.data.data); // Update Zustand state with fetched products
        } else {
          console.error('Failed to fetch products:', response.data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
  
    fetchProducts();
  }, [setProducts]); // Depend on Zustand's setProducts
  
  

  console.log('Products in Zustand:', list); // Log the Zustand list

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Our Products
      </Typography>
      <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2}>
        {Array.isArray(list) && list.length > 0 ? (
          list.map((product) => <ProductCard key={product._id} product={product} />)
        ) : (
          <Typography>No products available.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default MainPage;
