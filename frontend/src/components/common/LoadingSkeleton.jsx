import React from 'react';

const LoadingSkeleton = ({ count = 6, height = "h-28 sm:h-44" }) => {
  return (
    <div className="space-y-6">
      
      {/* Category Pills Skeleton */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none animate-pulse">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-8 sm:h-9 w-20 sm:w-24 bg-[#7D967E]/20 rounded-full shrink-0" />
        ))}
      </div>

      {/* Food Cards Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6 animate-pulse">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white border-2 border-[#7D967E]/20 rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 flex flex-col justify-between space-y-2 sm:space-y-4 shadow-sm">
            <div className="space-y-2 sm:space-y-3">
              <div className={`bg-[#7D967E]/20 rounded-xl sm:rounded-2xl w-full ${height}`} />
              <div className="space-y-1 sm:space-y-2">
                <div className="h-2.5 sm:h-3 bg-[#7D967E]/20 rounded-md w-1/4" />
                <div className="h-4 sm:h-5 bg-[#7D967E]/30 rounded-md w-3/4" />
                <div className="h-2.5 sm:h-3 bg-[#7D967E]/20 rounded-md w-full" />
              </div>
            </div>
            <div className="pt-2 sm:pt-3 border-t border-[#7D967E]/20 flex items-center justify-between">
              <div className="h-4 sm:h-6 bg-[#7D967E]/30 rounded-md w-10 sm:w-16" />
              <div className="h-7 sm:h-9 bg-[#F47B20]/30 rounded-lg sm:rounded-xl w-16 sm:w-24" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default LoadingSkeleton;
