import express from 'express';
import Product from '../models/product.js';
import {
  createProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
  toggleRating,
} from '../controllers/productController.js';
import { isAdmin } from '../helpers/auth.js';
import { isAuthenticated } from '../helpers/auth.js'; // Import isAuthenticated middleware

const router = express.Router();

// Get all products
router.get('/products', getAllProducts);

// Create a new product
router.post('/products', isAdmin, async (req, res) => {
  const { name, price, image, rating, description } = req.body;

  // Validate input
  if (!name || !price || !image || !description) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const product = new Product({ name, price, image, rating, description });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('Error creating product:', err.message);
    res.status(500).json({ message: 'Failed to create product', error: err.message });
  }
});

// Update a product
router.put('/products/:id', isAdmin, updateProduct);

// Delete a product by ID
router.delete('/products/:id', isAdmin, deleteProduct);

// Increment product rating (require authentication)
router.put('/products/:id/rating', isAuthenticated, toggleRating); // Added isAuthenticated middleware

export default router;
