import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThreeDLogoEmblem from '../components/common/ThreeDLogoEmblem';
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
  Receipt
} from 'lucide-react';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const adminMenuGroups = [
    {
      group: 'Management',
      items: [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Home Page', path: '/admin/home-settings', icon: HomeIcon }
      ]
    },
    {
      group: 'Menu & Ordering',
      items: [
        { name: 'Billing Counter', path: '/admin/billing-counter', icon: Receipt, badge: 'Live' },
        { name: 'Menu', path: '/admin/future-menu', icon: ChefHat },
        { name: 'Orders', path: '/admin/orders', icon: ShoppingBag, badge: 'Live' }
      ]
    },
    {
      group: 'Content & Community',
      items: [
        { name: "What's Happening", path: '/admin/happenings', icon: Sparkles },
        { name: 'Events', path: '/admin/events', icon: Calendar },
        { name: 'Synergy Showcase', path: '/admin/synergy', icon: Mic },
        { name: 'Facilities Cards', path: '/admin/facilities', icon: UtensilsCrossed },
        { name: 'Feedback', path: '/admin/feedback', icon: MessageSquare }
      ]
    },
    {
      group: 'Settings',
      items: [
        { name: 'Settings', path: '/admin/location-settings', icon: MapPin }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#171417] text-[#F4EDE5] flex flex-col md:flex-row selection:bg-[#C46F4F] selection:text-[#F8F3EB] relative">
      
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#351C2B] text-[#F4EDE5] border-r border-[#632F3D] sticky top-0 h-screen overflow-y-auto shrink-0 shadow-2xl z-30">
        
        {/* Brand Header */}
        <div className="p-5 border-b border-[#632F3D] space-y-3">
          <div className="flex items-center gap-3">
            <ThreeDLogoEmblem size="small" interactive={false} />
            <div>
              <h2 className="font-bold text-[#F4EDE5] text-sm tracking-tight">Admin Portal</h2>
              <p className="text-[10px] text-[#C46F4F] font-extrabold uppercase tracking-wider">VFSTR Vadlamudi</p>
            </div>
          </div>

          {/* View Customer Website Button */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3.5 rounded-xl bg-[#171417] hover:bg-[#632F3D] text-[#F4EDE5] border border-[#632F3D] text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
          >
            <Globe className="w-4 h-4 text-[#C46F4F]" />
            <span>Customer Website</span>
          </a>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3.5 space-y-6">
          {adminMenuGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1.5">
              <h3 className="px-3 text-[10px] font-extrabold text-[#C8BDB6]/70 uppercase tracking-widest">
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
                          ? 'bg-[#C46F4F] text-[#F8F3EB] shadow-md border border-white/20'
                          : 'text-[#C8BDB6] hover:text-[#F4EDE5] hover:bg-[#632F3D]/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-[#C8BDB6]'}`} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase ${
                          active ? 'bg-white/20 text-white' : 'bg-[#C46F4F]/30 text-[#C46F4F] border border-[#C46F4F]/40'
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

        {/* Admin User Footer */}
        <div className="p-4 border-t border-[#632F3D] bg-[#171417] flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-[#351C2B] text-[#C46F4F] flex items-center justify-center font-bold text-xs shrink-0 border border-[#632F3D]">
              <ShieldCheck className="w-4 h-4 text-[#C46F4F]" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-[#F4EDE5] truncate">{user?.name || 'Admin User'}</p>
              <p className="text-[10px] text-[#C8BDB6] truncate">{user?.email || 'admin@mhp.vfstr.ac.in'}</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/admin/login');
            }}
            title="Sign Out"
            className="p-2 text-[#C8BDB6] hover:text-rose-300 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Mobile Admin Header */}
      <div className="md:hidden bg-[#351C2B] text-[#F4EDE5] border-b border-[#632F3D] p-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-3">
          <ThreeDLogoEmblem size="small" interactive={false} />
          <span className="font-bold text-[#F4EDE5] text-sm">Admin Portal</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-[#171417] border border-[#632F3D] text-[#C8BDB6]"
        >
          {sidebarOpen ? <X className="w-5 h-5 text-white" /> : <MenuIcon className="w-5 h-5 text-white" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="md:hidden bg-[#351C2B] text-[#F4EDE5] border-b border-[#632F3D] p-4 space-y-3 shadow-xl">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#171417] text-[#C46F4F] border border-[#632F3D] text-xs font-bold"
          >
            <Globe className="w-4 h-4" />
            <span>View Customer Website</span>
          </a>

          <div className="space-y-1">
            {[
              { name: 'Dashboard', path: '/admin/dashboard' },
              { name: 'Home Page', path: '/admin/home-settings' },
              { name: 'Menu', path: '/admin/future-menu' },
              { name: 'Orders (Live)', path: '/admin/orders' },
              { name: 'Billing Counter', path: '/admin/billing-counter' },
              { name: "What's Happening", path: '/admin/happenings' },
              { name: 'Events Manager', path: '/admin/events' },
              { name: 'Synergy Showcase', path: '/admin/synergy' },
              { name: 'Facilities Cards', path: '/admin/facilities' },
              { name: 'Customer Feedback', path: '/admin/feedback' },
              { name: 'Settings', path: '/admin/location-settings' }
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`block px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                  isActive(item.path)
                    ? 'bg-[#C46F4F] text-white font-bold'
                    : 'text-[#C8BDB6] hover:text-white hover:bg-[#632F3D]'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <button
            onClick={() => {
              logout();
              setSidebarOpen(false);
              navigate('/admin/login');
            }}
            className="w-full py-2.5 rounded-xl bg-[#171417] text-rose-300 text-xs font-bold flex items-center justify-center gap-2 border border-[#632F3D]"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}

      {/* Main Admin Content View */}
      <main className="flex-1 bg-[#171417] text-[#F4EDE5] p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default AdminLayout;
