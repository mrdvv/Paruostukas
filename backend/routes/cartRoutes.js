import express from 'express';
import {
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
  getCartItems,
  emptyCart,
} from '../controllers/cartController.js';
import {isAuthenticated} from '../helpers/auth.js';

const router = express.Router();

// Protect all cart routes with the authentication middleware
router.post('/cart', isAuthenticated, addItemToCart);
router.delete('/cart/:id', isAuthenticated, removeItemFromCart);
router.put('/cart/:id', isAuthenticated, updateItemQuantity);
router.get('/cart', isAuthenticated, getCartItems);
router.delete('/cart', isAuthenticated, emptyCart);

export default router;
