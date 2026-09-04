import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';

/**
 * StickyTopCartBar — Persistent Floating Top Cart Bar
 * Appears at top of viewport whenever items exist in the cart.
 * Eliminates the need to scroll up/down to view cart.
 */
const StickyTopCartBar = () => {
  const location = useLocation();
  const { totalCartCount, totalCartAmount } = useCart();

  // Do not display if cart is empty or user is already on the Cart page
  if (totalCartCount === 0 || location.pathname === '/cart') {
    return null;
  }

  return (
    <div className="fixed top-16 sm:top-20 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-md pointer-events-auto transition-all animate-bounce-short">
      <Link
        to="/cart"
        className="w-full bg-gradient-to-r from-[#183A2A] via-[#204935] to-[#183A2A] text-white p-2.5 sm:p-3 rounded-2xl shadow-2xl border-2 border-[#F47B20] flex items-center justify-between gap-3 backdrop-blur-xl group hover:scale-[1.02] active:scale-[0.98] transition-transform"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#F47B20] text-white flex items-center justify-center font-black text-xs shadow-md shadow-[#F47B20]/40 group-hover:bg-[#FF882E]">
            {totalCartCount}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-black tracking-wider uppercase text-[#FFF7E8] flex items-center gap-1">
              <span>VIEW CART & CHECKOUT</span>
              <Sparkles className="w-3 h-3 text-[#F47B20]" />
            </span>
            <span className="text-[10px] text-[#7D967E] font-bold">
              {totalCartCount} {totalCartCount === 1 ? 'item selected' : 'items selected'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#F47B20] group-hover:bg-[#FF882E] text-white px-3.5 py-1.5 rounded-xl font-extrabold text-xs shadow-md transition-colors">
          <span className="font-mono text-xs">₹{totalCartAmount}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>
    </div>
  );
};

export default StickyTopCartBar;
