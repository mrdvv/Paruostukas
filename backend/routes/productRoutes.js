import express from 'express';
import {createProduct, getAllProducts, deleteProduct, updateProduct} from '../controllers/productController';
import {isAdmin} from '../helpers/auth';
const router = express.Router();

// Get all products
router.get('/', getAllProducts);

// Create a new product
router.post('/products',isAdmin, createProduct);

// Update a product
router.put('/products/:id',isAdmin, updateProduct);

// Delete a product by ID
router.delete('/products/:id',isAdmin, deleteProduct);


export default router;