import React from 'react';
import { Utensils, RotateCcw } from 'lucide-react';

/**
 * EmptyMenuState Component
 * Handles 0 items matching search query or category filters on MenuPage.
 */
const EmptyMenuState = ({ search = '', category = 'All', onReset }) => {
  return (
    <div className="bg-white p-10 sm:p-14 rounded-3xl border-2 border-[#7D967E]/30 text-center space-y-5 max-w-lg mx-auto shadow-xl">
      <div className="w-16 h-16 rounded-full bg-[#FFF7E8] text-[#F47B20] border border-[#7D967E]/30 flex items-center justify-center mx-auto shadow-sm">
        <Utensils className="w-8 h-8 text-[#F47B20]" />
      </div>

      <div className="space-y-1.5">
        <h3 className="font-display font-extrabold text-2xl text-[#183A2A]">
          No dishes found
        </h3>
        <p className="text-xs text-[#7D967E] font-medium leading-relaxed max-w-sm mx-auto">
          {search ? (
            <>No items matching "<strong className="text-[#183A2A]">{search}</strong>" in <strong className="text-[#183A2A]">{category}</strong>.</>
          ) : (
            <>No dishes available under the <strong className="text-[#183A2A]">{category}</strong> category right now.</>
          )}
        </p>
      </div>

      {onReset && (
        <button
          onClick={onReset}
          className="px-6 py-3 rounded-xl bg-[#183A2A] hover:bg-[#204935] text-[#FFF7E8] text-xs font-extrabold tracking-wider transition-all shadow-md inline-flex items-center gap-2 cursor-pointer hover:scale-105"
        >
          <RotateCcw className="w-4 h-4 text-[#F47B20]" />
          <span>RESET FILTERS & VIEW ALL DISHES</span>
        </button>
      )}
    </div>
  );
};

export default EmptyMenuState;
