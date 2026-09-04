import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThreeDLogoEmblem from '../components/common/ThreeDLogoEmblem';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { 
  LayoutDashboard, 
  Home as HomeIcon,
  ChefHat,
  ShoppingBag,
  MessageSquare, 
  MapPin, 
  LogOut, 
  ShieldCheck, 
  Menu as MenuIcon, 
  X,
  Globe,
  Sparkles,
  Calendar,
  Mic,
  UtensilsCrossed,
  Receipt,
  Navigation,
  Info,
  Compass,
  Sliders
} from 'lucide-react';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const adminMenuGroups = [
    {
      group: 'OVERVIEW',
      items: [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard }
      ]
    },
    {
      group: 'WEBSITE CONTROL',
      items: [
        { name: 'Navbar Manager', path: '/admin/navbar', icon: Navigation },
        { name: 'Home Page', path: '/admin/home-settings', icon: HomeIcon },
        { name: 'About Page', path: '/admin/about-settings', icon: Info },
        { name: 'Explore Page', path: '/admin/explore-settings', icon: Compass },
        { name: 'Global Settings', path: '/admin/location-settings', icon: MapPin }
      ]
    },
    {
      group: 'MENU & INVENTORY',
      items: [
        { name: 'Menu Catalog', path: '/admin/future-menu', icon: ChefHat }
      ]
    },
    {
      group: 'OPERATIONS',
      items: [
        { name: 'Live Orders', path: '/admin/orders', icon: ShoppingBag, badge: 'Live' },
        { name: 'Billing Counter', path: '/admin/billing-counter', icon: Receipt, badge: 'Live' }
      ]
    },
    {
      group: 'COMMUNITY CONTENT',
      items: [
        { name: 'Campus Events', path: '/admin/events', icon: Calendar },
        { name: 'Synergy Showcase', path: '/admin/synergy', icon: Mic },
        { name: "What's Happening", path: '/admin/happenings', icon: Sparkles },
        { name: 'Facilities Cards', path: '/admin/facilities', icon: UtensilsCrossed },
        { name: 'Customer Feedback', path: '/admin/feedback', icon: MessageSquare }
      ]
    },
    {
      group: 'SYSTEM & CREDENTIALS',
      items: [
        { name: 'System Settings', path: '/admin/settings', icon: Sliders }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFF7E8] text-[#202522] flex flex-col md:flex-row font-sans selection:bg-[#F47B20] selection:text-white">
      
      {/* DESKTOP SIDEBAR (Deep Forest Green #183A2A) */}
      <aside className="hidden md:flex flex-col w-64 bg-[#183A2A] text-[#FFF7E8] border-r border-[#7D967E]/30 sticky top-0 h-screen overflow-y-auto shrink-0 shadow-xl z-30">
        
        {/* Brand Header */}
        <div className="p-5 border-b border-[#7D967E]/30 space-y-4">
          <div className="flex items-center gap-3">
            <ThreeDLogoEmblem size="small" interactive={false} />
            <div>
              <h2 className="font-display font-extrabold text-[#FFF7E8] text-base tracking-tight leading-tight">
                MHP ADMIN
              </h2>
              <p className="text-[9px] text-[#F47B20] font-black uppercase tracking-widest">
                WEBSITE CONTROL SYSTEM
              </p>
            </div>
          </div>

          {/* View Customer Website Link */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-3 rounded-xl bg-[#204935] hover:bg-[#285740] text-[#FFF7E8] border border-[#7D967E]/40 text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <Globe className="w-3.5 h-3.5 text-[#F47B20]" />
            <span>Customer Website</span>
          </a>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3.5 space-y-6">
          {adminMenuGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1.5">
              <h3 className="px-3 text-[10px] font-black text-[#7D967E] uppercase tracking-widest">
                {group.group}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                        active
                          ? 'bg-[#F47B20] text-white shadow-md border border-[#F47B20]'
                          : 'text-[#FFF7E8]/80 hover:text-[#FFF7E8] hover:bg-[#204935]/70'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-[#7D967E]'}`} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                          active ? 'bg-white text-[#F47B20]' : 'bg-[#F47B20]/20 text-[#F47B20]'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer / Staff Logout */}
        <div className="p-4 border-t border-[#7D967E]/30 bg-[#122E21]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#F47B20] text-white flex items-center justify-center font-bold text-xs">
                {user?.name ? user.name[0] : 'A'}
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-[#FFF7E8] block truncate max-w-[110px]">
                  {user?.name || 'MHP Admin'}
                </span>
                <span className="text-[9px] text-[#7D967E] block uppercase font-bold">Manager</span>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                navigate('/admin/login');
              }}
              className="p-2 text-[#7D967E] hover:text-white rounded-lg hover:bg-rose-900/40 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <div className="md:hidden bg-[#183A2A] border-b border-[#7D967E]/30 p-4 flex items-center justify-between text-[#FFF7E8] sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <ThreeDLogoEmblem size="small" interactive={false} />
          <span className="font-display font-extrabold text-[#FFF7E8] text-sm">
            MHP ADMIN SYSTEM
          </span>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-[#FFF7E8] hover:bg-[#204935] rounded-lg"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </div>

      {/* MOBILE DRAWER */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex">
          <div className="w-72 bg-[#183A2A] text-[#FFF7E8] h-full p-5 space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#7D967E]/30 pb-4">
              <div className="flex items-center gap-2">
                <ThreeDLogoEmblem size="small" />
                <span className="font-display font-extrabold text-sm">MHP ADMIN</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-[#7D967E]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-4">
              {adminMenuGroups.map((group, gIdx) => (
                <div key={gIdx} className="space-y-1">
                  <h3 className="text-[10px] font-black text-[#7D967E] uppercase px-2">
                    {group.group}
                  </h3>
                  {group.items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`block px-3 py-2 rounded-xl text-xs font-bold ${
                        isActive(item.path) ? 'bg-[#F47B20] text-white' : 'text-[#FFF7E8]/80'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              ))}
            </nav>

            <button
              onClick={() => {
                logout();
                navigate('/admin/login');
              }}
              className="w-full py-2.5 rounded-xl bg-rose-600/20 text-rose-300 text-xs font-bold flex items-center justify-center gap-2 border border-rose-500/30"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>

    </div>
  );
};

export default AdminLayout;
