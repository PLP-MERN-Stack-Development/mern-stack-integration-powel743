// /client/src/pages/PostList.jsx (FINAL CORRECTED VERSION)
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useApi from '../hooks/useApi';

const PostList = () => {
  const { data: postData = {}, loading, error, request: fetchPosts } = useApi();
  
  // FIX APPLIED HERE: Guarantee categories is an array or defaults to []
  const { data: categories = [], request: fetchCategories } = useApi();
  
  // Destructure returned pagination and post data
  const { posts = [], page: currentPage = 1, totalPages = 1 } = postData || {}; 

  // Local state for search/filter controls
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [pageNumber, setPageNumber] = useState(1);

  // --- Fetching Logic (Memoized function for useEffect) ---
  const loadPosts = useCallback(() => {
    // Construct query string for API
    const query = new URLSearchParams();
    if (keyword) query.append('keyword', keyword);
    if (selectedCategory) query.append('category', selectedCategory);
    if (pageNumber) query.append('pageNumber', pageNumber);

    const endpoint = `/posts?${query.toString()}`;
    fetchPosts('GET', endpoint);

  }, [keyword, selectedCategory, pageNumber, fetchPosts]);

  // --- useEffects ---
  useEffect(() => {
    fetchCategories('GET', '/categories'); // Fetch categories for filter dropdown
  }, [fetchCategories]);

  useEffect(() => {
    loadPosts(); // Load posts whenever keyword, category, or page changes
  }, [loadPosts]); 
  
  // --- Handlers ---
  const handleSearch = (e) => {
    setKeyword(e.target.value);
    setPageNumber(1); // Reset to page 1 on new search
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPageNumber(1); // Reset to page 1 on new filter
  };
  
  const changePage = (page) => {
      if (page >= 1 && page <= totalPages) {
          setPageNumber(page);
      }
  };

  // --- Rendering Logic (Missing Loading/Error checks for brevity) ---
  // You should re-insert your full loading and error logic here
  
  // Example of missing loading/error handling (use your previous code)
  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>Error fetching posts: {error}</div>;


  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-extrabold mb-6 text-gray-900 border-b pb-2">Blog Overview</h1>

      {/* Search and Filter Controls */}
      <div className="flex flex-wrap gap-4 mb-8">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by title or content..."
          value={keyword}
          onChange={handleSearch}
          className="p-3 border border-gray-300 rounded-lg shadow-sm flex-grow min-w-[200px]"
        />
        
        {/* Category Filter Dropdown */}
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="p-3 border border-gray-300 rounded-lg shadow-sm bg-white"
          disabled={!categories}
        >
          {Array.isArray(categories) && categories.map((cat) => ( 
    <option key={cat._id} value={cat._id}>
        {cat.name}
    </option>
          ))}
        </select>
      </div>

      {/* Post Grid (Render Posts) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post._id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
             {post.featuredImage && (
                <img 
                    src={post.featuredImage} 
                    alt={post.title} 
                    className="w-full h-32 object-cover rounded-md mb-4"
                />
             )}
            <h2 className="text-2xl font-bold mb-2 text-gray-900 line-clamp-2">
              <Link to={`/post/${post._id}`} className="hover:text-blue-600">
                {post.title}
              </Link>
            </h2>
            <p className="text-sm text-gray-500 mb-3">
              Category: <span className="font-medium text-indigo-600">{post.category?.name}</span>
            </p>
            <Link to={`/post/${post._id}`} className="inline-block text-blue-500 hover:text-blue-700 font-semibold transition duration-150">
              Read More &rarr;
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination Controls (Remains the same) */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-2">
          <button 
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 border rounded-lg disabled:opacity-50"
          >
            &larr; Previous
          </button>

          {[...Array(totalPages).keys()].map((x) => (
            <button
              key={x + 1}
              onClick={() => changePage(x + 1)}
              className={`p-2 border rounded-lg font-bold ${x + 1 === currentPage ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
            >
              {x + 1}
            </button>
          ))}

          <button 
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 border rounded-lg disabled:opacity-50"
          >
            Next &rarr;
          </button>
        </div>
      )}
      
    </div>
  );
};

export default PostList;