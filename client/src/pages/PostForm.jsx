// /client/src/pages/PostForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const PostForm = () => {
  const { id } = useParams(); // Used for editing (undefined for creation)
  const navigate = useNavigate();
  const { userInfo } = useAuth();

  // --- File Upload States ---
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // --- API Hooks ---
  const { data: formPostData, request: postRequest } = useApi(); // For fetching/submitting posts
  const { request: categoryRequest } = useApi(); // For fetching categories

  // --- Local State ---
  const [categories, setCategories] = useState([]); // store fetched categories
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
  });
  const [validationErrors, setValidationErrors] = useState({});
  const isEditing = !!id;

  // --- Redirect if not logged in ---
  useEffect(() => {
    if (!userInfo) {
      alert('You must be logged in to create or edit posts.');
      navigate('/login');
    }
  }, [userInfo, navigate]);

  // --- Fetch Categories on Mount ---
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await categoryRequest('GET', '/categories');
        if (result && Array.isArray(result)) {
          setCategories(result);
        } else {
          setCategories([]);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategories([]);
      }
    };
    loadCategories();
  }, [categoryRequest]);

  // --- Fetch Post Data if Editing ---
  useEffect(() => {
    if (isEditing) {
      postRequest('GET', `/posts/${id}`);
    }
  }, [isEditing, id, postRequest]);

  // --- Populate Form Data when Post Data Arrives ---
  useEffect(() => {
    if (isEditing && formPostData) {
      setFormData({
        title: formPostData.title || '',
        content: formPostData.content || '',
        category: formPostData.category?._id || '',
        featuredImage: formPostData.featuredImage || '',
      });
    }
  }, [isEditing, formPostData]);

  // --- Handle Form Input Changes ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- Image Upload Handler ---
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const uploadFileHandler = async (file) => {
    const data = new FormData();
    data.append('image', file);

    try {
      setUploading(true);
      setUploadError(null);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const res = await axios.post('/api/upload', data, config);
      setUploading(false);
      return res.data.imagePath;
    } catch (error) {
      setUploading(false);
      const errorMessage = error.response?.data?.message || error.message || 'File upload failed.';
      setUploadError(errorMessage);
      return null;
    }
  };

  // --- Validation ---
  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required.';
    if (!formData.content.trim()) errors.content = 'Content is required.';
    if (!formData.category) errors.category = 'A category must be selected.';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // --- Submit Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (!userInfo || !userInfo.token) return navigate('/login');

    let imagePath = formData.featuredImage;

    if (imageFile) {
      imagePath = await uploadFileHandler(imageFile);
      if (!imagePath) return;
    }

    const finalPayload = {
      ...formData,
      featuredImage: imagePath,
    };

    try {
      const method = isEditing ? 'PUT' : 'POST';
      const endpoint = isEditing ? `/posts/${id}` : '/posts';

      const result = await postRequest(method, endpoint, finalPayload, userInfo.token);
      navigate(`/post/${result._id}`, { replace: true });
    } catch (err) {
      console.error('Submission error:', err);
    }
  };

  const submitLoading = postRequest.loading;
  const submitError = postRequest.error;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        {isEditing ? 'Edit Blog Post' : 'Create New Post'}
      </h1>

      {submitError && (
        <div className="p-3 mb-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          Error: {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
            disabled={submitLoading}
          />
          {validationErrors.title && <p className="text-red-500 text-xs mt-1">{validationErrors.title}</p>}
        </div>

        {/* Content */}
        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            rows="8"
            value={formData.content}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
            disabled={submitLoading}
          />
          {validationErrors.content && <p className="text-red-500 text-xs mt-1">{validationErrors.content}</p>}
        </div>

        {/* Category */}
        <div className="mb-6">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 bg-white"
            disabled={submitLoading}
          >
            <option value="">Select a Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          {validationErrors.category && <p className="text-red-500 text-xs mt-1">{validationErrors.category}</p>}
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Featured Image
          </label>
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 bg-white"
            accept="image/png, image/jpeg, image/webp"
          />
          {(formData.featuredImage && !imageFile) && (
            <p className="text-sm text-gray-500 mt-2">
              Current Image: <span className="text-blue-500">{formData.featuredImage}</span>
            </p>
          )}
          {uploading && <p className="text-blue-500 text-sm mt-1">Uploading image...</p>}
          {uploadError && <p className="text-red-500 text-xs mt-1">Upload Error: {uploadError}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:opacity-50"
          disabled={submitLoading}
        >
          {submitLoading
            ? isEditing
              ? 'Updating...'
              : 'Creating...'
            : isEditing
              ? 'Update Post'
              : 'Publish Post'}
        </button>
      </form>
    </div>
  );
};

export default PostForm;
