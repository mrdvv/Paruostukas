import express from 'express';
import { createOrder, getAllOrders, getUserOrders } from '../controllers/checkoutController.js';
import {isAuthenticated, isAdmin} from '../helpers/auth.js';

const router = express.Router();

// Create a new order (checkout)
router.post('/orders', isAuthenticated, createOrder);

router.get('/orders', isAuthenticated, isAdmin, getAllOrders);

// User: Get their orders
router.get('/orders/user', isAuthenticated, getUserOrders);

export default router;
