import express from 'express';
import { createCategory, getCategories } from '../controllers/categoryController.js';
import { isAdmin, isAuthenticated } from '../helpers/auth.js'

const router = express.Router();

router.post('/categories', isAdmin, createCategory);
router.get('/categories', getCategories);

export default router;