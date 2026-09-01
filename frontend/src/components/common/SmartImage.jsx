import React, { useState } from 'react';
import { getImageUrl, getCategoryFallback } from '../../utils/imageUtils';
import { Utensils } from 'lucide-react';

/**
 * SmartImage Component
 * Handles:
 * 1. Image Loading (Skeleton shimmer overlay while loading)
 * 2. Failed Image (Graceful category fallback & unbroken image icon)
 */
const SmartImage = ({ src, alt, category = '', className = '', ...props }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [imgSrc, setImgSrc] = useState(() => getImageUrl(src, category));

  const handleLoad = () => {
    setLoaded(true);
  };

  const handleError = () => {
    setError(true);
    const fallback = getCategoryFallback(category);
    if (imgSrc !== fallback) {
      setImgSrc(fallback);
    }
  };

  return (
    <div className={`relative overflow-hidden bg-[#183A2A]/10 ${className}`}>
      
      {/* Loading Skeleton Shimmer */}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse z-10 flex items-center justify-center">
          <Utensils className="w-6 h-6 text-[#7D967E]/40 animate-bounce" />
        </div>
      )}

      <img
        {...props}
        src={imgSrc}
        alt={alt || 'Food Item'}
        onLoad={handleLoad}
        onError={handleError}
        referrerPolicy="no-referrer"
        className={`w-full h-full object-cover transition-all duration-500 ${
          loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        }`}
      />

      {/* Failed Image Fallback Badge */}
      {error && (
        <div className="absolute bottom-2 left-2 bg-[#183A2A]/90 backdrop-blur-xs px-2 py-0.5 rounded-md text-[9px] font-extrabold text-[#FFF7E8] border border-[#7D967E]/40 z-20">
          MHP Special
        </div>
      )}
    </div>
  );
};

export default SmartImage;
