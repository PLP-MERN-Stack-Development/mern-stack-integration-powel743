// /client/src/pages/SinglePost.jsx (Updated with Comments Logic)
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useApi from '../hooks/useApi';
import { useAuth } from '../context/AuthContext'; // Import Auth

const SinglePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useAuth(); // Current logged-in user info

  // 1. Hook for FETCHING the post and initial comments
  const { 
    data: post, 
    loading: fetchLoading, 
    error: fetchError, 
    request: fetchPost 
  } = useApi();
  
  // 2. Hook for DELETING the post
  const { 
    loading: deleteLoading, 
    error: deleteError, 
    request: deletePost 
  } = useApi();
  
  // 3. Hook for SUBMITTING a new comment
  const { 
    loading: commentLoading, 
    error: commentError, 
    request: submitComment 
  } = useApi();

  // Local state for comment form
  const [newCommentText, setNewCommentText] = useState('');
  
  // --- Fetch Post on Load ---
  useEffect(() => {
    if (id) {
      // Fetch post, which now includes populated comments from the back-end
      fetchPost('GET', `/posts/${id}`);
    }
  }, [id, fetchPost]);

  // --- Delete Handler (remains the same) ---
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost('DELETE', `/posts/${id}`, null, userInfo.token); // Pass token
        alert('Post deleted successfully!');
        navigate('/'); 
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };
  
  // --- Submit Comment Handler ---
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    if (!userInfo || !userInfo.token) return alert('You must be logged in to comment.');

    try {
      // POST to the nested comment route
      const response = await submitComment(
        'POST', 
        `/posts/${id}/comments`, 
        { comment: newCommentText }, 
        userInfo.token // Pass token for protection
      );
      
      // OPTIMISTIC UI: Re-fetch post data to update the comment list
      // Note: A more efficient approach would be to update the 'post' state directly
      fetchPost('GET', `/posts/${id}`); 
      
      setNewCommentText(''); // Clear the form
      
    } catch (err) {
      console.error('Comment submission failed:', err);
    }
  };

  // --- Rendering Logic (Loading, Error, Not Found) ---
  if (fetchLoading) { /* ... Loading UI ... */ }
  if (fetchError) { /* ... Error UI ... */ }
  if (!post) { return null; }

  // --- Main Render ---
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-2xl">
      {/* Post Header and Content (Keep existing) */}
      <h1 className="text-4xl font-extrabold mb-4">{post.title}</h1>
      {/* ... Edit/Delete buttons (ensure they pass userInfo.token in handleDelete) ... */}
      <div className="prose max-w-none text-lg text-gray-800 leading-relaxed whitespace-pre-wrap mb-10">
        <p>{post.content}</p>
      </div>
      
      {/* --- Comments Section --- */}
      <div className="mt-10 border-t pt-6">
        <h2 className="text-2xl font-bold mb-4">
          Comments ({post.numComments})
        </h2>
        
        {/* Comment Submission Form */}
        <div className="mb-8">
          {userInfo ? (
            <form onSubmit={handleCommentSubmit} className="bg-gray-50 p-4 rounded-lg shadow-inner">
              <textarea
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Write a comment..."
                rows="3"
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500"
                disabled={commentLoading}
              ></textarea>
              <button
                type="submit"
                className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50"
                disabled={commentLoading}
              >
                {commentLoading ? 'Posting...' : 'Post Comment'}
              </button>
              {commentError && (
                <p className="text-red-500 text-sm mt-2">Error: {commentError}</p>
              )}
            </form>
          ) : (
            <p className="text-gray-600 p-4 border rounded-lg">
              <Link to="/login" className="text-blue-500 hover:underline">Log in</Link> to leave a comment.
            </p>
          )}
        </div>

        {/* Comment List Display */}
        {post.comments && post.comments.length > 0 ? (
          <div className="space-y-4">
            {post.comments.map((comment, index) => (
              <div key={comment._id || index} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-gray-800">{comment.name}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{comment.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No comments yet. Be the first!</p>
        )}
      </div>
    </div>
  );
};

export default SinglePost;