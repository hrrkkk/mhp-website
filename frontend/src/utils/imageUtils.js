/**
 * Central Image URL Helper & Fallback Resolver
 * Ensures relative paths (/uploads/...) resolve against backend server,
 * external images use no-referrer policy, and missing/broken images show high-quality category fallbacks.
 */

export const getCategoryFallback = (category = '') => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('biryani') || cat.includes('pulao') || cat.includes('rice')) {
    return 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80';
  }
  if (cat.includes('starter') || cat.includes('fast food') || cat.includes('curry')) {
    return 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80';
  }
  if (cat.includes('breakfast') || cat.includes('dosa') || cat.includes('idly')) {
    return 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80';
  }
  if (cat.includes('shake') || cat.includes('mocktail') || cat.includes('juice') || cat.includes('beverage')) {
    return 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80';
  }
  if (cat.includes('burger') || cat.includes('sandwich') || cat.includes('pizza') || cat.includes('bread')) {
    return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80';
  }
  return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
};

export const getImageUrl = (imagePath, category = '') => {
  if (!imagePath || typeof imagePath !== 'string' || imagePath.trim() === '') {
    return getCategoryFallback(category);
  }
  const cleanPath = imagePath.trim();
  if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
    return cleanPath;
  }
  
  // Handle frontend public assets (/assets/...)
  if (cleanPath.startsWith('/assets/') || cleanPath.startsWith('assets/')) {
    return cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  }
  
  // Handle relative upload paths (/uploads/...)
  const DEFAULT_PROD_API = 'https://mhp-backend-ee30.onrender.com/api';
  const DEFAULT_DEV_API = 'http://localhost:5000/api';
  const isProduction = import.meta.env.PROD || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1');
  const apiBase = import.meta.env.VITE_API_URL || (isProduction ? DEFAULT_PROD_API : DEFAULT_DEV_API);
  const serverBase = apiBase.replace(/\/api\/?$/, '');
  return `${serverBase}${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`;
};

export const handleImageError = (e, category = '') => {
  e.target.onerror = null;
  e.target.src = getCategoryFallback(category);
};
