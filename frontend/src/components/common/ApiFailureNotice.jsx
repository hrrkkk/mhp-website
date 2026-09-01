import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * ApiFailureNotice Component
 * Handles API connection failure gracefully with clear explanation & Retry action button.
 */
const ApiFailureNotice = ({ title = "Connection Issue", message = "Unable to connect to MHP Server.", onRetry }) => {
  return (
    <div className="bg-[#FFF7E8] p-8 sm:p-10 rounded-3xl border-2 border-amber-500/40 text-center space-y-4 max-w-md mx-auto shadow-xl">
      <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
        <AlertTriangle className="w-7 h-7" />
      </div>

      <div className="space-y-1">
        <h3 className="font-display font-extrabold text-xl text-[#183A2A]">
          {title}
        </h3>
        <p className="text-xs text-[#7D967E] font-medium leading-relaxed">
          {message}
        </p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2.5 rounded-xl bg-[#F47B20] hover:bg-[#FF882E] text-white text-xs font-black tracking-wider transition-all shadow-md inline-flex items-center gap-2 cursor-pointer hover:scale-105"
        >
          <RefreshCw className="w-4 h-4" />
          <span>TRY AGAIN</span>
        </button>
      )}
    </div>
  );
};

export default ApiFailureNotice;
