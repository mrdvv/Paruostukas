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
router.post('/products', isAuthenticated, createProduct);
router.put('/products/:id', isAdmin, updateProduct);

router.delete('/products/:id', isAdmin, deleteProduct);

router.put('/products/:id/rating', isAuthenticated, toggleRating);

router.get('/products/rated', isAuthenticated, GetRatedProducts)
router.get('/products/search', searchProducts);
export default router;
