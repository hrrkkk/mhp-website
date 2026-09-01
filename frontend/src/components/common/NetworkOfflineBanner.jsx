import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

/**
 * NetworkOfflineBanner — Real-Time Internet Connection Monitor
 * Displays a high-contrast top banner when user loses internet connection.
 */
const NetworkOfflineBanner = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="bg-rose-900 text-rose-100 py-2 px-4 text-xs font-sans font-bold border-b border-rose-700 shadow-md flex items-center justify-between z-50 sticky top-0">
      <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-center">
        <WifiOff className="w-4 h-4 text-rose-300 animate-pulse shrink-0" />
        <span>You are currently offline. Check your internet or campus Wi-Fi connection.</span>
        <button 
          onClick={() => window.location.reload()}
          className="ml-2 px-2.5 py-0.5 rounded-md bg-rose-950 text-white hover:bg-rose-800 transition-colors flex items-center gap-1 text-[11px] font-extrabold border border-rose-700"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Retry</span>
        </button>
      </div>
    </div>
  );
};

export default NetworkOfflineBanner;
