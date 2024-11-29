import express from 'express';
import Product from '../models/product.js';
import {
  createProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
  toggleRating,
  GetRatedProducts,
  searchProducts
} from '../controllers/productController.js';
import { isAdmin } from '../helpers/auth.js';
import { isAuthenticated } from '../helpers/auth.js'; // Import isAuthenticated middleware

const router = express.Router();

// Get all products
router.get('/products', getAllProducts);

// Create a new product
router.post('/products', async (req, res) => {
  const { name, price, image, rating, description, category } = req.body;

  // Validate input
  if (!name || !price || !image || !description || !category) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const product = new Product({ name, price, image, rating, description, category });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('Error creating product:', err.message);
    res.status(500).json({ message: 'Failed to create product', error: err.message });
  }
});

router.put('/products/:id', isAdmin, updateProduct);

router.delete('/products/:id', isAdmin, deleteProduct);

router.put('/products/:id/rating', isAuthenticated, toggleRating);

router.get('/products/rated', isAuthenticated, GetRatedProducts)
router.get('/products/search', searchProducts)
export default router;
