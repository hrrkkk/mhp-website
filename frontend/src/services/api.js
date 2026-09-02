import axios from 'axios';

const DEFAULT_PROD_API = 'https://mhp-backend-ee3o.onrender.com/api';
const DEFAULT_DEV_API = 'http://localhost:5000/api';

const isProduction = import.meta.env.PROD || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1');

const rawBase = import.meta.env.VITE_API_URL || (isProduction ? DEFAULT_PROD_API : DEFAULT_DEV_API);
const API_BASE_URL = (rawBase && !rawBase.includes('/api')) 
  ? `${rawBase.replace(/\/$/, '')}/api` 
  : rawBase;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000,
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

// Automatic Retry Interceptor for Render Free Tier Cold-Starts & Network Flakes
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    
    // If error is network-related (e.g. Render spinning up) and hasn't exceeded max retries
    if (!config || config.__isRetry) {
      if (error.message === 'Network Error' || error.code === 'ECONNABORTED') {
        error.message = 'Server is starting up... Please wait a few seconds and try again.';
      }
      return Promise.reject(error);
    }

    const isNetworkError = !error.response || error.code === 'ECONNABORTED' || error.message === 'Network Error';
    if (isNetworkError) {
      config.__retryCount = (config.__retryCount || 0) + 1;
      if (config.__retryCount <= 2) {
        // Wait 2.5 seconds before retrying
        await new Promise((resolve) => setTimeout(resolve, 2500));
        return api(config);
      }
      error.message = 'Server is starting up... Please wait a few seconds and try again.';
    }

    return Promise.reject(error);
  }
);

export default api;
