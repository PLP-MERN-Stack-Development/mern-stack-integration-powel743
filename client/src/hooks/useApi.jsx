import { useState, useCallback } from 'react';
import axios from 'axios';

// The proxy configured in vite.config.js means '/api' goes to http://localhost:5000/api
const API_BASE_URL = '/api';

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
    // Clear data on new request unless it's a list fetch where you might want to preserve previous data briefly
    setData({}); 

    try {
      const url = `${API_BASE_URL}${endpoint}`;
      
      const config = {
        method: method.toLowerCase(),
        url,
        // Send payload for POST, PUT, PATCH
        data: ['post', 'put', 'patch'].includes(method.toLowerCase()) ? payload : undefined,
        // headers: { Authorization: `Bearer ${token}` }, // For Task 5 (Auth)
      };

      const response = await axios(config);
      setData(response.data);
      setLoading(false);
      return response.data; // Return data for immediate use (e.g., navigation after create)

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An unknown error occurred.';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage); // Re-throw the error for the calling component to handle

    }
  }, []); // Dependencies array is empty as it only relies on internal React/Axios state

  return { data, loading, error, request };
};

export default useApi;