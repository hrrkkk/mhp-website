import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Home, UtensilsCrossed, ShoppingBag, Receipt, User, ShieldCheck } from 'lucide-react';

const MobileBottomBar = () => {
  const location = useLocation();
  const { totalCartCount } = useCart();
  const { user } = useAuth();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      path: '/',
      icon: Home,
      exact: true
    },
    {
      id: 'menu',
      label: 'Menu',
      path: '/menu',
      icon: UtensilsCrossed
    },
    {
      id: 'orders',
      label: 'My Orders',
      path: user ? '/profile' : '/login',
      icon: Receipt
    },
    {
      id: 'cart',
      label: 'Cart',
      path: '/cart',
      icon: ShoppingBag,
      badge: totalCartCount
    },
    {
      id: 'profile',
      label: user?.role === 'admin' ? 'Admin' : (user ? 'Profile' : 'Account'),
      path: user?.role === 'admin' ? '/admin/dashboard' : (user ? '/profile' : '/login'),
      icon: user?.role === 'admin' ? ShieldCheck : User
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#183A2A]/95 backdrop-blur-xl border-t border-[#7D967E]/40 shadow-2xl px-2 py-1.5 preserve-3d">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.exact ? location.pathname === item.path : isActive(item.path);

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`relative flex flex-col items-center gap-0.5 px-3 py-1 rounded-2xl transition-all duration-200 cursor-pointer ${
                active
                  ? 'text-[#F47B20] font-black scale-105'
                  : 'text-[#FFF7E8]/70 hover:text-[#FFF7E8]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${active ? 'text-[#F47B20]' : 'text-[#7D967E]'}`} />
                {item.badge > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-[#F47B20] text-white border-2 border-[#183A2A] text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>

              <span className="text-[10px] tracking-wider uppercase font-bold">
                {item.label}
              </span>

              {/* Active Indicator Underline (Amazon Reference Style) */}
              {active && (
                <span className="w-5 h-0.5 bg-[#F47B20] rounded-full mt-0.5 shadow-sm" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomBar;
