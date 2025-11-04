// /server/controllers/commentController.js
import asyncHandler from 'express-async-handler';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

// @desc    Create a new comment on a post
// @route   POST /api/posts/:id/comments
// @access  Private (Requires login)
const createPostComment = asyncHandler(async (req, res) => {
  const { comment } = req.body;
  const postId = req.params.id;

  const post = await Post.findById(postId);

  if (post) {
    if (!comment) {
      res.status(400);
      throw new Error('Comment text cannot be empty.');
    }

    const newComment = new Comment({
      name: req.user.name, // Get name from authenticated user
      comment,
      user: req.user._id, // Get ID from authenticated user
      post: postId,
    });

    // 1. Save the new comment document
    const createdComment = await newComment.save();
    
    // 2. Update the Post document (add comment reference and update count)
    post.comments.push(createdComment._id);
    post.numComments = post.comments.length;
    await post.save();

    res.status(201).json({ 
        message: 'Comment added',
        comment: createdComment // Return the created comment
    });
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// @desc    Get all comments for a post
// @route   GET /api/posts/:id/comments
// @access  Public
const getPostComments = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate({
      path: 'comments',
      model: 'Comment',
      // Optional: select specific fields from the Comment (e.g., exclude user ID)
      select: 'name comment createdAt user', 
    })
    // Sort comments by creation date (newest first)
    .sort({ 'comments.createdAt': -1 }); 

  if (post) {
    // Send back the populated comments array
    res.json(post.comments); 
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

export { createPostComment, getPostComments };