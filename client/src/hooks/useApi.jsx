import { useState, useCallback } from 'react';
import axiosInstance from '../axiosConfig'; // 🟢 CHANGE 1: Import the "Smart" Axios

// 🟢 CHANGE 2: We keep '/api' as a prefix, but we don't rely on it for the domain anymore.
// The domain (localhost:5000 or Render) comes from axiosInstance.
const API_PATH_PREFIX = '/api'; 

/**
 * Custom hook for making API requests with built-in state management.
 * @returns {object} { data, loading, error, request }
 */
const useApi = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // useCallback memoizes the function to prevent unnecessary re-renders
  const request = useCallback(async (method, endpoint, payload = null) => {
    setLoading(true);
    setError(null);
    // Clear data on new request unless it's a list fetch
    setData({}); 

    try {
      // 🟢 CHANGE 3: Construct the relative path
      // Example: '/api' + '/users/login' = '/api/users/login'
      // axiosInstance will attach the Base URL automatically
      const url = `${API_PATH_PREFIX}${endpoint}`;
      
      const config = {
        method: method.toLowerCase(),
        url, 
        // Send payload for POST, PUT, PATCH
        data: ['post', 'put', 'patch'].includes(method.toLowerCase()) ? payload : undefined,
      };

      // 🟢 CHANGE 4: Execute using the Smart Instance
      const response = await axiosInstance(config);
      
      setData(response.data);
      setLoading(false);
      return response.data; 

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An unknown error occurred.';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage); 
    }
  }, []); 

  return { data, loading, error, request };
};

export default useApi;