import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Home, UtensilsCrossed, ShoppingBag } from 'lucide-react';

const MobileBottomBar = () => {
  const location = useLocation();
  const { totalCartCount } = useCart();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#183A2A]/95 backdrop-blur-xl border-t border-[#7D967E]/40 shadow-2xl px-4 py-2 preserve-3d">
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* 🏠 Home */}
        <Link
          to="/"
          className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-2xl transition-all duration-200 ${
            isActive('/') && !location.pathname.startsWith('/menu') && !location.pathname.startsWith('/cart')
              ? 'text-[#F47B20] font-extrabold bg-[#204935] border border-[#7D967E]/30 scale-105'
              : 'text-[#FFF7E8]/70 hover:text-[#FFF7E8]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] tracking-wider uppercase font-bold">Home</span>
        </Link>

        {/* 🍽 Menu */}
        <Link
          to="/menu"
          className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-2xl transition-all duration-200 ${
            isActive('/menu')
              ? 'text-[#F47B20] font-extrabold bg-[#204935] border border-[#7D967E]/30 scale-105'
              : 'text-[#FFF7E8]/70 hover:text-[#FFF7E8]'
          }`}
        >
          <UtensilsCrossed className="w-5 h-5" />
          <span className="text-[10px] tracking-wider uppercase font-bold">Menu</span>
        </Link>

        {/* 🛒 Cart */}
        <Link
          to="/cart"
          className={`relative flex flex-col items-center gap-1 px-5 py-1.5 rounded-2xl transition-all duration-200 ${
            isActive('/cart')
              ? 'text-[#FFF7E8] bg-[#F47B20] shadow-lg shadow-[#F47B20]/40 scale-105 font-extrabold'
              : 'text-[#FFF7E8]/80 hover:text-[#FFF7E8] bg-[#204935]/80 border border-[#7D967E]/30'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-2 -right-2.5 bg-[#F47B20] text-white border-2 border-[#183A2A] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                {totalCartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-wider uppercase font-bold">Cart</span>
        </Link>

      </div>
    </div>
  );
};

export default MobileBottomBar;
