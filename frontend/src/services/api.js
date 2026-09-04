import axios from 'axios';

const DEFAULT_PROD_API = 'https://mhp-backend-ee3o.onrender.com/api';
const DEFAULT_DEV_API = 'http://localhost:5000/api';

const isProduction = import.meta.env.PROD || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1');

let rawBase = import.meta.env.VITE_API_URL || (isProduction ? DEFAULT_PROD_API : DEFAULT_DEV_API);

// Auto-correct invalid/typo URL (oo30 -> ee3o) from Render dashboard environment settings
if (rawBase && rawBase.includes('mhp-backend-oo30')) {
  rawBase = rawBase.replace('mhp-backend-oo30', 'mhp-backend-ee3o');
}

// Ensure HTTPS protocol when running on HTTPS or production to prevent Mixed Content security blocking
if (typeof window !== 'undefined' && (window.location.protocol === 'https:' || isProduction) && rawBase.startsWith('http://')) {
  rawBase = rawBase.replace('http://', 'https://');
}

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
    // If the server responded with an HTTP status code (400, 401, 404, 500, etc.), preserve response error!
    if (error.response) {
      return Promise.reject(error);
    }

    const config = error.config;
    if (!config) {
      return Promise.reject(error);
    }

    // Catch any request failure where no response was received (ERR_NETWORK, ECONNABORTED, ETIMEDOUT, etc.)
    const isTrueNetworkError = !error.response && (
      error.code === 'ECONNABORTED' ||
      error.code === 'ERR_NETWORK' ||
      error.code === 'ETIMEDOUT' ||
      error.code === 'ERR_BAD_RESPONSE' ||
      error.message === 'Network Error' ||
      (error.message && error.message.toLowerCase().includes('network')) ||
      (error.message && error.message.toLowerCase().includes('timeout'))
    );

    if (isTrueNetworkError) {
      config.__retryCount = (config.__retryCount || 0) + 1;
      const isAuthRequest = config.url && (config.url.includes('/auth/login') || config.url.includes('/auth/register'));
      const maxRetries = isAuthRequest ? 3 : 5;
      const retryDelay = 2000;

      if (config.__retryCount <= maxRetries) {
        console.log(`[API Retry] ⚡ Retrying request to ${config.url} (Attempt ${config.__retryCount}/${maxRetries})...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        return api(config);
      }
      error.message = 'Server connection issue. Please check your internet or try again.';
    }

    return Promise.reject(error);
  }
);

export default api;
