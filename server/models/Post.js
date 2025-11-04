// /server/models/Post.js
import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  // Relationship to Category
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  // Relationship to User (for Task 5)
  user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true,
  },
  // image path
  featuredImage: { // NEW FIELD
    type: String,
    required: false, // Optional image
  },

  // NEW FIELD: Array of Comment IDs
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],

  numComments: { // Quick count for display purposes
    type: Number,
    required: true,
    default: 0,
  }},
  
{
  timestamps: true,
});

const Post = mongoose.model('Post', postSchema);
export default Post;