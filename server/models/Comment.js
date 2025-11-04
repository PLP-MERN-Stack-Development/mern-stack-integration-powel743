// /server/models/Comment.js
import mongoose from 'mongoose';

const commentSchema = mongoose.Schema({
  name: {
    type: String, // Store the user's name (for simplicity)
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  // Relationship to the User who wrote the comment
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Relationship to the Post the comment belongs to
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  }
}, {
  timestamps: true, // Includes createdAt and updatedAt
});

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;