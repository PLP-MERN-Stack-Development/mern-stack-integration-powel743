// /server/routes/categoryRoutes.js
import express from 'express';
import {
  getCategories,
  createCategory,
  getCategoryById,
  deleteCategory,
} from '../controllers/categoryController.js';

const router = express.Router();

// Route for getting all categories and creating a new one
router.route('/').get(getCategories).post(createCategory);

// Route for specific category operations
router.route('/:id').get(getCategoryById).delete(deleteCategory);

export default router;