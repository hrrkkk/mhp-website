import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ArrowRight, Sparkles } from 'lucide-react';

/**
 * StickyTopCartBar (Floating View Cart Bar)
 * High-visibility floating bar that stays pinned on screen while scrolling items to order.
 * Floats at bottom-20 (mobile, above bottom tab bar) / bottom-6 (desktop) with z-[60].
 */
const StickyTopCartBar = () => {
  const location = useLocation();
  const { totalCartCount, totalCartAmount } = useCart();

  // Do not display if cart is empty or user is already on the Cart page
  if (totalCartCount === 0 || location.pathname === '/cart') {
    return null;
  }

  return (
    <div className="fixed bottom-20 md:bottom-6 left-3 right-3 md:left-1/2 md:-translate-x-1/2 z-[60] w-[calc(100%-1.5rem)] md:w-full md:max-w-lg transition-all duration-300 pointer-events-auto">
      <Link
        to="/cart"
        className="w-full bg-gradient-to-r from-[#F47B20] via-[#FF882E] to-[#F47B20] text-white p-3 sm:p-3.5 rounded-2xl shadow-[0_10px_35px_rgba(244,123,32,0.5)] border-2 border-white/40 flex items-center justify-between gap-3 backdrop-blur-xl group hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        {/* Left Side: Counter & Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white text-[#F47B20] flex items-center justify-center font-black text-sm shadow-md group-hover:scale-105 transition-transform shrink-0">
            {totalCartCount}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs sm:text-sm font-black tracking-wider uppercase text-white flex items-center gap-1.5 drop-shadow-sm">
              <span>VIEW CART & CHECKOUT</span>
              <Sparkles className="w-4 h-4 text-yellow-200 animate-pulse" />
            </span>
            <span className="text-[11px] text-white/90 font-bold">
              {totalCartCount} {totalCartCount === 1 ? 'item selected' : 'items selected'} • Tap to review
            </span>
          </div>
        </div>

        {/* Right Side: Total Amount & Action CTA */}
        <div className="flex items-center gap-2 bg-[#183A2A] group-hover:bg-[#10271C] text-white px-3.5 py-2 rounded-xl font-black text-xs sm:text-sm shadow-lg border border-white/20 transition-colors shrink-0">
          <span className="font-mono">₹{totalCartAmount}</span>
          <ArrowRight className="w-4 h-4 text-[#F47B20] group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>
    </div>
  );
};

export default StickyTopCartBar;
