import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import axios from 'axios';
import useStore from '../store/store.js'; // Zustand store for products

const CreateProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
    rating: 0,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { fetchProducts } = useStore((state) => state.products); // Use the fetchProducts function

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validate input
    if (!formData.name || !formData.price || !formData.image) {
      setError('All fields are required');
      return;
    }

    try {
      const token = localStorage.getItem('token'); // Get token from localStorage
      if (!token) {
        setError('You are not authorized to perform this action');
        return;
      }

      // API call to create a product with Authorization header
      await axios.post(
        'http://localhost:8000/api/products',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request
          },
        }
      );

      // Fetch updated product list from the server
      await fetchProducts();

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create product');
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ mt: 8 }}
    >
      <Typography variant="h4" gutterBottom>
        Create Product
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>Product created successfully!</Alert>}

      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ width: '100%', maxWidth: 400 }}
      >
        <TextField
          name="name"
          label="Product Name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          name="price"
          label="Price"
          value={formData.price}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          type="number"
        />
        <TextField
          name="image"
          label="Image URL"
          value={formData.image}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          name="description"
          label="Description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          multiline
          rows={3}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Create Product
        </Button>
      </Box>
    </Box>
  );
};

export default CreateProduct;
