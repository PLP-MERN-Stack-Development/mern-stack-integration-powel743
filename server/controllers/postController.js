// /server/controllers/postController.js
import asyncHandler from 'express-async-handler';
import Post from '../models/Post.js';
import Category from '../models/Category.js';



// Define the number of posts to display per page
const POSTS_PER_PAGE = 8;

// @desc    Get all blog posts with filtering, searching, and pagination
// @route   GET /api/posts?keyword=...&category=...&page=...
// @access  Public
const getPosts = asyncHandler(async (req, res) => {
  const page = Number(req.query.pageNumber) || 1; // Default to page 1

  // 1. Search Filtering (Keyword)
  const keyword = req.query.keyword
    ? {
        // Search across title or content using a case-insensitive regex
        $or: [
          { title: { $regex: req.query.keyword, $options: 'i' } },
          { content: { $regex: req.query.keyword, $options: 'i' } },
        ],
      }
    : {};

  // 2. Category Filtering
  const categoryFilter = req.query.category
    ? { category: req.query.category } // Category ID is provided
    : {};

  // Combine filters
  const filter = { ...keyword, ...categoryFilter };
  
  // 3. Counting and Pagination
  const count = await Post.countDocuments(filter);
  const totalPages = Math.ceil(count / POSTS_PER_PAGE);

  // Fetch posts with limit and skip for pagination
  const posts = await Post.find(filter)
    .populate('category', 'name')
    .sort({ createdAt: -1 }) // Sort by newest first
    .limit(POSTS_PER_PAGE)
    .skip(POSTS_PER_PAGE * (page - 1));

  res.json({ posts, page, totalPages, totalPosts: count });
});

// @desc    Get a single blog post
// @route   GET /api/posts/:id
// @access  Public
const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate('category', 'name');

  if (post) {
    res.json(post);
  } else {
    // This will be caught by the general error handler (below)
    res.status(404);
    throw new Error('Post not found');
  }
});

// @desc    Create a blog post
// @route   POST /api/posts
// @access  Private (Needs Authentication later, but Public for now)
const createPost = asyncHandler(async (req, res) => {
  const { title, content, category } = req.body;

  // Basic Validation
  if (!title || !content || !category) {
    res.status(400);
    throw new Error('Please fill all required fields: title, content, and category.');
  }

  // Check if category exists
  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
      res.status(404);
      throw new Error('Category not found.');
  }

  const post = new Post({
    title,
    content,
    category,
    user: req.user._id, // NEW: Assign the authenticated user as the author
  });

  const createdPost = await post.save();
  res.status(201).json(createdPost);
});


// @desc    Update an existing blog post
// @route   PUT /api/posts/:id
// @access  Private (Needs Authentication later)
const updatePost = asyncHandler(async (req, res) => {
  const { title, content, category } = req.body;

  const post = await Post.findById(req.params.id);

  if (post) {
    // Check if category exists if it was updated
    if (category) {
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            res.status(404);
            throw new Error('Category not found.');
        }
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// @desc    Delete a blog post
// @route   DELETE /api/posts/:id
// @access  Private (Needs Authentication later)
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id);

  if (post) {
    res.json({ message: 'Post removed' });
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

export {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};