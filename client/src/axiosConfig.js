import axios from 'axios';

const instance = axios.create({
  // VITE_API_URL will be provided by Vercel. 
  // If it's missing (local), it defaults to localhost:5000
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true, // Crucial for your JWT Cookies
});

export default instance;