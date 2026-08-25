import React from 'react';

const LoadingSkeleton = ({ count = 3, height = "h-48" }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4">
          <div className={`bg-slate-800/80 rounded-xl w-full ${height}`}></div>
          <div className="h-6 bg-slate-800/80 rounded-md w-3/4"></div>
          <div className="h-4 bg-slate-800/60 rounded-md w-full"></div>
          <div className="h-4 bg-slate-800/60 rounded-md w-5/6"></div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
