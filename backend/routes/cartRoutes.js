import express from 'express';
import { addItemToCart, removeItemFromCart, updateItemQuantity, getCartItems, emptyCart } from '../controllers/cartController';

const router = express.Router();

// Add item to cart
router.post('/cart', addItemToCart);

// Remove item from cart
router.delete('/cart/:id', removeItemFromCart);

// Update item quantity in cart
router.put('/cart/:id', updateItemQuantity);

// Get cart items
router.get('/cart', getCartItems);

// Empty cart
router.delete('/cart', emptyCart);

export default router;