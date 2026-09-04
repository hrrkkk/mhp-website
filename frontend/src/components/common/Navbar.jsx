import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import ThreeDLogoEmblem from './ThreeDLogoEmblem';
import TopInfoBanner from './TopInfoBanner';
import api from '../../services/api';
import { 
  User, 
  LogOut, 
  Menu as MenuIcon, 
  X,
  ShoppingBag,
  ShieldCheck
} from 'lucide-react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { totalCartCount, totalCartAmount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const [dynamicNavItems, setDynamicNavItems] = useState([
    { id: 'home', name: 'Home', path: '/', visible: true, order: 1 },
    { id: 'about', name: 'About', path: '/about', visible: true, order: 2 },
    { id: 'menu', name: 'Menu', path: '/menu', visible: true, order: 3 },
    { id: 'explore', name: 'Explore', path: '/explore', visible: true, order: 4 },
    { id: 'feedback', name: 'Feedback', path: '/feedback', visible: true, order: 5 },
    { id: 'profile', name: 'Profile', path: '/profile', visible: true, order: 6 },
  ]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    api.get('/navbar')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setDynamicNavItems(res.data.filter(item => item.visible !== false).sort((a, b) => (a.order || 0) - (b.order || 0)));
        }
      })
      .catch(() => {});
  }, []);

  const navLinks = dynamicNavItems.map(item => ({
    name: item.name,
    path: item.id === 'profile' ? (isAuthenticated ? '/profile' : '/login') : item.path
  }));

  const isActive = (path) => {
    if (path.includes('?')) {
      return location.pathname + location.search === path;
    }
    return location.pathname === path && !location.search;
  };

  return (
    <>
      <TopInfoBanner />
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'py-2 bg-[#183A2A]/98 backdrop-blur-2xl border-b border-[#F47B20]/30 shadow-2xl shadow-black/20' 
          : 'py-3 bg-[#183A2A]/90 backdrop-blur-xl border-b border-[#7D967E]/30'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* LEFT SIDE: Compact MHP Logo + "THE MOST HAPPENING PLACE" */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <ThreeDLogoEmblem size="small" className="w-9 h-9 sm:w-10 sm:h-10 transition-transform group-hover:scale-105" />
            <div className="flex flex-col justify-center">
              <span className="font-display font-extrabold text-[#FFF7E8] text-base sm:text-lg tracking-tight leading-none group-hover:text-[#F47B20] transition-colors">
                MHP
              </span>
              <span className="text-[8px] sm:text-[9px] text-[#7D967E] font-sans font-extrabold tracking-widest uppercase block mt-0.5 group-hover:text-[#FFF7E8] transition-colors">
                THE MOST HAPPENING PLACE
              </span>
            </div>
          </Link>

          {/* CENTER: Navigation Links */}
          <div className="hidden lg:flex items-center gap-1.5 bg-[#10271C]/60 p-1.5 rounded-full border border-[#7D967E]/20">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-1.5 rounded-full text-xs font-extrabold font-sans transition-all duration-200 relative ${
                    active
                      ? 'text-[#FFF7E8] bg-gradient-to-r from-[#204935] to-[#183A2A] border border-[#7D967E]/50 shadow-md shadow-black/30'
                      : 'text-[#FFF7E8]/75 hover:text-[#FFF7E8] hover:bg-[#204935]/50'
                  }`}
                >
                  <span>{link.name}</span>
                  {active && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#F47B20] shadow-sm shadow-[#F47B20]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* RIGHT SIDE: PRIMARY CTA (ORDER NOW) + VIEW CART + Auth Status */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* 1. ORDER NOW — STRONGEST CTA */}
            <Link
              to="/menu?mode=delivery"
              className="px-4.5 py-2 rounded-full bg-gradient-to-r from-[#F47B20] to-[#FF882E] hover:from-[#FF882E] hover:to-[#FFA04D] text-white text-xs font-black tracking-wider flex items-center gap-2 shadow-lg shadow-[#F47B20]/40 transition-all hover:scale-105 active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>ORDER NOW</span>
            </Link>

            {/* 2. HIGH CONTRAST CART BUTTON */}
            <Link
              to="/cart"
              className={`px-4 py-2 rounded-2xl text-xs font-black tracking-wider flex items-center gap-2 transition-all shadow-lg hover:scale-105 border ${
                totalCartCount > 0
                  ? 'bg-gradient-to-r from-[#F47B20] to-[#FF882E] text-white border-[#F47B20] shadow-[#F47B20]/50 animate-pulse'
                  : 'bg-[#204935] hover:bg-[#285740] text-[#FFF7E8] border-[#7D967E]/40'
              }`}
            >
              <span className="text-sm">🛒</span>
              <span>Cart ({totalCartCount})</span>
              {totalCartCount > 0 && (
                <span className="font-mono text-[11px] bg-black/30 px-2 py-0.5 rounded-lg border border-white/20">
                  ₹{totalCartAmount}
                </span>
              )}
            </Link>

            {/* Profile / Sign In */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 border-l border-[#7D967E]/30 pl-3">
                <Link
                  to="/profile"
                  className="px-3.5 py-1.5 rounded-full bg-[#204935] hover:bg-[#285740] text-[#FFF7E8] border border-[#7D967E]/30 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-[#F47B20]" />
                  <span>{user?.name?.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  title="Sign Out"
                  className="p-1.5 rounded-full bg-[#204935] hover:bg-rose-900/60 text-[#FFF7E8]/70 hover:text-rose-200 border border-[#7D967E]/30 transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 border-l border-[#7D967E]/30 pl-3">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-[#FFF7E8]/80 hover:text-[#FFF7E8] text-xs font-bold transition-all"
                >
                  Sign In
                </Link>
              </div>
            )}

          </div>

          {/* Mobile Menu Toggle & Direct ORDER NOW button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              to="/menu?mode=delivery"
              className="px-3 py-1.5 rounded-full bg-[#F47B20] text-white font-extrabold text-xs flex items-center gap-1 shadow-md"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>ORDER NOW</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#204935] border border-[#7D967E]/30 text-[#FFF7E8] hover:text-[#F47B20]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#183A2A]/98 backdrop-blur-2xl border-b border-[#7D967E]/30 px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive(link.path)
                    ? 'bg-[#204935] text-[#FFF7E8] border-l-4 border-[#F47B20]'
                    : 'text-[#FFF7E8]/80 hover:bg-[#204935]/60 hover:text-[#FFF7E8]'
                }`}
              >
                <span>{link.name}</span>
              </Link>
            ))}

            {/* Mobile VIEW CART Link */}
            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-extrabold bg-[#204935] text-[#FFF7E8] border-2 border-[#F47B20] shadow-sm mt-2"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#F47B20]" />
                <span>VIEW CART</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#F47B20] text-white text-[10px] font-black">
                {totalCartCount} {totalCartCount === 1 ? 'Item' : 'Items'}
              </span>
            </Link>
          </div>

          <div className="pt-3 border-t border-[#7D967E]/30 space-y-2">
            {isAuthenticated ? (
              <div className="flex gap-2">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#204935] text-[#FFF7E8] text-xs font-bold text-center border border-[#7D967E]/30"
                >
                  My Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-rose-900/40 text-rose-200 text-xs font-bold border border-rose-800/40"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 rounded-xl bg-[#204935] text-[#FFF7E8] text-xs font-bold text-center border border-[#7D967E]/30"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-mhp-primary text-xs text-center"
                >
                  Join MHP
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
    </>
  );
};

export default Navbar;

