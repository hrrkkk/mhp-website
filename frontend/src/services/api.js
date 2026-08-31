import axios from 'axios';

const DEFAULT_PROD_API = 'https://mhp-backend-ee3o.onrender.com/api';
const DEFAULT_DEV_API = 'http://localhost:5000/api';

const isProduction = import.meta.env.PROD || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1');

const API_BASE_URL = import.meta.env.VITE_API_URL || (isProduction ? DEFAULT_PROD_API : DEFAULT_DEV_API);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach Auth Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mhp_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
