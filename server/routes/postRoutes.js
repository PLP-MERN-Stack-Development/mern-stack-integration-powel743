import express from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/postController.js';
import { 
  createPostComment, // NEW IMPORT
  getPostComments    // NEW IMPORT
} from '../controllers/commentController.js'; 
import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// Public route (GET) vs Protected route (POST)
// Note: For a blog, you might want to require admin access for POST/PUT/DELETE,
// but for now, we'll just require ANY logged-in user using 'protect'.
router.route('/')
  .get(getPosts)
  .post(protect, createPost); // Apply 'protect' here

router.route('/:id')
  .get(getPostById)
  .put(protect, updatePost)    // Apply 'protect' here
  .delete(protect, deletePost); // Apply 'protect' here

// Nested routes for comments on a specific post ID
router.route('/:id/comments')
    .post(protect, createPostComment) // Protected: only logged-in users can comment
    .get(getPostComments);          // Public: anyone can view comments


export default router;