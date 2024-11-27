import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

// Get home page
router.get('/')

// Register a new user
router.post('/register', registerUser);

// Login a registered user
router.post('/login', loginUser);

export default router;