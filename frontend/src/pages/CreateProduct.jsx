import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Alert, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import axios from 'axios';
import useStore from '../store/store.js';

const CreateProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
    rating: 0,
    category: "",
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const {list: categories, fetchCategories} = useStore((state) => state.categories);
  const { fetchProducts, createProduct } = useStore((state) => state.products);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!formData.name || !formData.price || !formData.image || !formData.category) {
      setError('All fields are required');
      return;
    }
    console.log('FormData:', formData);
    console.log('Sending product data:', formData);

    try {
      await createProduct(formData);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Failed to create product");
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
        <FormControl fullWidth required margin="normal">
          <InputLabel>Category</InputLabel>
          <Select
          name="category"
          value={formData.category}
          onChange={handleChange}
          >
            {categories.map((category) => (
              <MenuItem key={category._id} value={category.name}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
