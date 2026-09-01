import React from 'react';

const LoadingSkeleton = ({ count = 6, height = "h-44" }) => {
  return (
    <div className="space-y-6">
      
      {/* Category Pills Skeleton */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none animate-pulse">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-9 w-24 bg-[#7D967E]/20 rounded-full shrink-0" />
        ))}
      </div>

      {/* Food Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white border-2 border-[#7D967E]/20 rounded-3xl p-4 flex flex-col justify-between space-y-4 shadow-sm">
            <div className="space-y-3">
              <div className={`bg-[#7D967E]/20 rounded-2xl w-full ${height}`} />
              <div className="space-y-2">
                <div className="h-3 bg-[#7D967E]/20 rounded-md w-1/4" />
                <div className="h-5 bg-[#7D967E]/30 rounded-md w-3/4" />
                <div className="h-3 bg-[#7D967E]/20 rounded-md w-full" />
              </div>
            </div>
            <div className="pt-3 border-t border-[#7D967E]/20 flex items-center justify-between">
              <div className="h-6 bg-[#7D967E]/30 rounded-md w-16" />
              <div className="h-9 bg-[#F47B20]/30 rounded-xl w-24" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default LoadingSkeleton;
