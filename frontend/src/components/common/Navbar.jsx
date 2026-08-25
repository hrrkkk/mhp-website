import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import ThreeDLogoEmblem from './ThreeDLogoEmblem';
import { 
  User, 
  LogOut, 
  Menu as MenuIcon, 
  X,
  ShoppingBag
} from 'lucide-react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { totalCartCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

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

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Menu', path: '/menu' },
    { name: 'Facilities', path: '/facilities' },
    { name: 'Location', path: '/location' },
    { name: 'Feedback', path: '/feedback' },
    ...(isAuthenticated ? [{ name: 'Profile', path: '/profile' }] : []),
    { name: 'View Cart', path: '/cart', isCart: true }
  ];

  const isActive = (path) => {
    if (path.includes('?')) {
      return location.pathname + location.search === path;
    }
    return location.pathname === path && !location.search;
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'py-2 bg-[#111113]/95 backdrop-blur-xl border-b border-[#351923] shadow-2xl' 
        : 'py-3.5 bg-[#111113]/85 backdrop-blur-md border-b border-[#191417]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Left: Official MHP Brand Emblem & Subtitle */}
          <Link to="/" className="flex items-center gap-3 group">
            <ThreeDLogoEmblem size="medium" />
            <div>
              <span className="font-display font-bold text-[#F5EEE7] text-lg sm:text-xl tracking-tight block leading-none group-hover:text-[#C96F4F] transition-colors">
                MHP
              </span>
              <span className="text-[9px] text-[#C96F4F] font-sans font-extrabold tracking-widest uppercase block mt-0.5">
                THE MOST HAPPENING PLACE
              </span>
            </div>
          </Link>

          {/* Center: Clean Floating Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);

              if (link.isCart) {
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`ml-2 px-4 py-2 rounded-xl text-xs font-extrabold font-sans transition-all duration-300 flex items-center gap-2 border shadow-lg cursor-pointer transform hover:-translate-y-0.5 ${
                      totalCartCount > 0
                        ? 'bg-gradient-to-r from-[#D77A4D] to-[#D8A04D] text-white border-[#D77A4D] shadow-[#D77A4D]/25'
                        : 'bg-[#191417] text-[#F5EEE7] border-[#C96F4F]/60 hover:bg-[#351923]'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-white" />
                    <span>View Cart {totalCartCount > 0 ? `(${totalCartCount})` : ''}</span>
                  </Link>
                );
              }

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold font-sans transition-all duration-200 flex items-center gap-1.5 ${
                    active
                      ? 'text-[#F5EEE7] bg-[#191417] border border-[#C96F4F]/60 shadow-sm'
                      : 'text-[#B9A9A2] hover:text-[#F5EEE7] hover:bg-[#191417]/60'
                  }`}
                >
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right: Student Profile & Sign Out / Login CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="px-4 py-2 rounded-xl bg-[#191417] hover:bg-[#351923] text-[#F5EEE7] border border-[#351923] text-xs font-bold transition-all duration-200 flex items-center gap-2 shadow-sm"
                >
                  <User className="w-3.5 h-3.5 text-[#C96F4F]" />
                  <span>{user?.name?.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  title="Sign Out"
                  className="p-2 rounded-xl bg-[#191417] hover:bg-rose-950/60 text-[#B9A9A2] hover:text-rose-300 border border-[#351923] transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-[#B9A9A2] hover:text-[#F5EEE7] text-xs font-bold transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="btn-mhp-primary text-xs py-2 px-4 min-h-0"
                >
                  Student Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              to="/cart"
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#C96F4F] to-[#D79A45] text-[#F5EEE7] font-extrabold text-xs flex items-center gap-1.5 shadow-md"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart {totalCartCount > 0 ? `(${totalCartCount})` : ''}</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#191417] border border-[#351923] text-[#B9A9A2] hover:text-[#F5EEE7]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#111113]/98 backdrop-blur-2xl border-b border-[#191417] px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  link.isCart
                    ? 'bg-gradient-to-r from-[#D77A4D] to-[#D8A04D] text-white font-extrabold shadow-sm'
                    : isActive(link.path)
                      ? 'bg-[#191417] text-[#F5EEE7] border-l-4 border-[#C96F4F]'
                      : 'text-[#B9A9A2] hover:bg-[#191417] hover:text-[#F5EEE7]'
                }`}
              >
                <div className="flex items-center gap-2">
                  {link.isCart && <ShoppingBag className="w-4 h-4" />}
                  <span>{link.name}</span>
                </div>
                {link.isCart && (
                  <span className="px-2 py-0.5 rounded-full bg-[#140D0D]/80 text-[#F5EEE7] text-[10px] font-black">
                    {totalCartCount} {totalCartCount === 1 ? 'Item' : 'Items'}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-[#191417] space-y-2">
            {isAuthenticated ? (
              <div className="flex gap-2">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#191417] text-[#F5EEE7] text-xs font-bold text-center border border-[#351923]"
                >
                  My Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#191417] text-rose-300 text-xs font-bold border border-[#351923]"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 rounded-xl bg-[#191417] text-[#F5EEE7] text-xs font-bold text-center border border-[#351923]"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-mhp-primary text-xs"
                >
                  Student Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
