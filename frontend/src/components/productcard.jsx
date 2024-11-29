import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import useStore from '../store/store.js'; // Zustand store

const ProductCard = ({ product }) => {
  const { isLoggedIn, isAdmin } = useStore((state) => state.auth); // Auth state
  const { addToCart } = useStore((state) => state.cart); // Cart actions
  const { toggleRating, updateProduct, deleteProduct, fetchProducts } = useStore((state) => state.products); // Product actions

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isRated, setIsRated] = useState(false); // Track whether the product is rated
  const [formData, setFormData] = useState({
    name: product.name,
    price: product.price,
    image: product.image,
    description: product.description,
    category: product.category,
  }); 

  useEffect(() => {
    const ratedProducts = JSON.parse(localStorage.getItem('ratedProducts')) || {};
    setIsRated(!!ratedProducts[product._id]);
  }, [product._id]);

  const handleToggleRating = async () => {
    try {
      const increment = !isRated;
      const success = await toggleRating(product._id, increment);

      if (success) {

        const ratedProducts = JSON.parse(localStorage.getItem('ratedProducts')) || {};
        if (isRated) {
          delete ratedProducts[product._id];
        } else {
          ratedProducts[product._id] = true;
        }
        localStorage.setItem('ratedProducts', JSON.stringify(ratedProducts));
        setIsRated(!isRated);
      }
    } catch (error) {
      console.error('Error toggling rating:', error);
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleEditSubmit = async () => {
    try {
      const success = await updateProduct(product._id, formData);
      if (success) {
        setEditOpen(false);
        await fetchProducts(); 
      }
    } catch (error) {
      console.error('Error editing product:', error);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      const success = await deleteProduct(product._id);
      if (success) {
        setDeleteOpen(false);
        await fetchProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <>
      <Card sx={{ maxWidth: 300, margin: 2 }}>
        <CardMedia
          component="img"
          height="140"
          image={product.image || 'https://via.placeholder.com/150'}
          alt={product.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            {product.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            €{product.price}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Rating: {product.rating}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.description}
          </Typography>
          <Typography variant="body2" color="text.secondary">
          Category: {product.category?.name || 'Unknown'}
          </Typography>
          <Box mt={2} display="flex" flexDirection="column" gap={1}>
            {isLoggedIn && (
              <Button
                variant="contained"
                color={isRated ? 'warning' : 'primary'}
                onClick={handleToggleRating}
              >
                {isRated ? 'Unrate' : 'Rate'}
              </Button>
            )}
            <Button variant="contained" color="secondary" onClick={handleAddToCart}>
              Add to Cart
            </Button>
            {isAdmin && (
              <>
                <Button
                  variant="outlined"
                  color="info"
                  onClick={() => setEditOpen(true)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setDeleteOpen(true)}
                >
                  Delete
                </Button>
              </>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <TextField
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="price"
            label="Price"
            type="number"
            value={formData.price}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="image"
            label="Image URL"
            value={formData.image}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleFormChange}
            fullWidth
            multiline
            rows={3}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this product? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteProduct} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductCard;
