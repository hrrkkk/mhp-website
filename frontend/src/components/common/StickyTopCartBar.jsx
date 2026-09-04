import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ArrowRight, Sparkles } from 'lucide-react';

/**
 * FloatingCartBar / StickyTopCartBar — Persistent Floating Bottom Cart Bar
 * Appears floating at the bottom of the viewport whenever items exist in the cart.
 * Floats above bottom mobile bar on mobile, and centered at bottom on desktop.
 * Allows users to view cart and checkout constantly while scrolling items to order.
 */
const StickyTopCartBar = () => {
  const location = useLocation();
  const { totalCartCount, totalCartAmount } = useCart();

  // Do not display if cart is empty or user is already on the Cart page
  if (totalCartCount === 0 || location.pathname === '/cart') {
    return null;
  }

  return (
    <div className="fixed bottom-16 md:bottom-6 left-3 right-3 md:left-1/2 md:-translate-x-1/2 z-50 md:max-w-lg transition-all pointer-events-auto">
      <Link
        to="/cart"
        className="w-full bg-[#183A2A]/95 hover:bg-[#10271C] text-white p-3 rounded-2xl shadow-2xl border-2 border-[#F47B20] flex items-center justify-between gap-3 backdrop-blur-2xl group hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[#F47B20]/40"
      >
        {/* Left Side: Counter & Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#F47B20] to-[#FF882E] text-white flex items-center justify-center font-black text-sm shadow-lg shadow-[#F47B20]/40 group-hover:scale-105 transition-transform">
            {totalCartCount}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-black tracking-wider uppercase text-[#FFF7E8] flex items-center gap-1.5">
              <span>VIEW CART & CHECKOUT</span>
              <Sparkles className="w-3.5 h-3.5 text-[#F47B20] animate-pulse" />
            </span>
            <span className="text-[11px] text-[#7D967E] font-bold">
              {totalCartCount} {totalCartCount === 1 ? 'item added' : 'items added'}
            </span>
          </div>
        </div>

        {/* Right Side: Total Amount & Action CTA */}
        <div className="flex items-center gap-2.5 bg-[#F47B20] group-hover:bg-[#FF882E] text-white px-4 py-2 rounded-xl font-black text-xs shadow-lg shadow-[#F47B20]/40 transition-colors shrink-0">
          <span className="font-mono text-sm">₹{totalCartAmount}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>
    </div>
  );
};

export default StickyTopCartBar;
