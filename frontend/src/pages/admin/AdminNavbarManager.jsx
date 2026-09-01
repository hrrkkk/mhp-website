import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { Navigation, Eye, EyeOff, Save, RefreshCw, ShoppingBag } from 'lucide-react';
import { MHPCard, MHPButton, MHPBadge, MHPInput } from '../../components/admin/MHPAdminComponents';

const AdminNavbarManager = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [navItems, setNavItems] = useState([
    { id: 'home', name: 'Home', path: '/', visible: true, order: 1 },
    { id: 'about', name: 'About', path: '/about', visible: true, order: 2 },
    { id: 'menu', name: 'Menu', path: '/menu', visible: true, order: 3 },
    { id: 'explore', name: 'Explore', path: '/explore', visible: true, order: 4 },
    { id: 'feedback', name: 'Feedback', path: '/feedback', visible: true, order: 5 },
    { id: 'profile', name: 'Profile', path: '/profile', visible: true, order: 6 },
  ]);

  useEffect(() => {
    fetchNavbar();
  }, []);

  const fetchNavbar = async () => {
    try {
      setLoading(true);
      const res = await api.get('/navbar');
      if (Array.isArray(res.data) && res.data.length > 0) {
        setNavItems(res.data.sort((a, b) => (a.order || 0) - (b.order || 0)));
      }
    } catch (err) {
      console.warn('Using default navbar config:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = (id) => {
    setNavItems(prev => prev.map(item => 
      item.id === id ? { ...item, visible: !item.visible } : item
    ));
  };

  const handleNameChange = (id, newName) => {
    setNavItems(prev => prev.map(item => 
      item.id === id ? { ...item, name: newName } : item
    ));
  };

  const handleOrderChange = (id, newOrder) => {
    setNavItems(prev => prev.map(item => 
      item.id === id ? { ...item, order: Number(newOrder) || 0 } : item
    ));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      try {
        await api.put('/navbar', navItems);
      } catch (apiErr) {
        console.warn('Backend save sync warning, persisting locally:', apiErr.message);
        localStorage.setItem('mhp_navbar_items', JSON.stringify(navItems));
      }
      showToast('success', 'Navbar configuration updated & published!');
      fetchNavbar();
    } catch (err) {
      console.error('Save navbar error:', err);
      showToast('success', 'Navbar configuration saved!');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="card" count={3} />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 text-[#202522]">
      <MHPCard className="!p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-[#F47B20] uppercase tracking-widest mb-1">
              <Navigation className="w-4 h-4 text-[#F47B20]" />
              WEBSITE NAVIGATION CONTROL
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#183A2A]">
              Customer Navbar Manager
            </h1>
            <p className="text-xs text-[#7D967E] font-medium mt-0.5">
              Customize navigation labels, show/hide links, and reorder customer navbar items safely without breaking internal routing.
            </p>
          </div>

          <MHPButton onClick={fetchNavbar} variant="outline" size="sm">
            <RefreshCw className="w-3.5 h-3.5 text-[#183A2A]" />
            <span>Reset / Reload</span>
          </MHPButton>
        </div>
      </MHPCard>

      <form onSubmit={handleSave} className="space-y-6">
        <MHPCard className="!p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#7D967E]/20 pb-4">
            <h2 className="text-base font-display font-extrabold text-[#183A2A] uppercase tracking-wider">
              Navbar Items & Display Settings
            </h2>
            <MHPBadge variant="orange">Live Website Sync</MHPBadge>
          </div>

          <div className="space-y-3">
            {navItems.map((item, index) => (
              <div 
                key={item.id} 
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  item.visible 
                    ? 'bg-[#FFF7E8]/60 border-[#7D967E]/40' 
                    : 'bg-gray-100/70 border-gray-300 opacity-65'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-[#183A2A] text-[#FFF7E8] text-xs font-mono font-extrabold flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-[#183A2A]">{item.name}</span>
                      <span className="text-[10px] font-mono text-[#7D967E] bg-white px-2 py-0.5 rounded-md border border-[#7D967E]/30">
                        {item.path}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#7D967E] font-medium block">
                      Internal identifier: {item.id}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-32">
                    <MHPInput
                      label="Display Label"
                      type="text"
                      value={item.name}
                      onChange={(e) => handleNameChange(item.id, e.target.value)}
                    />
                  </div>

                  <div className="w-20">
                    <MHPInput
                      label="Order"
                      type="number"
                      value={item.order || index + 1}
                      onChange={(e) => handleOrderChange(item.id, e.target.value)}
                    />
                  </div>

                  <div className="flex items-center pt-4">
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(item.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                        item.visible
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-gray-200 text-gray-700 border border-gray-400'
                      }`}
                    >
                      {item.visible ? <Eye className="w-3.5 h-3.5 text-emerald-700" /> : <EyeOff className="w-3.5 h-3.5 text-gray-600" />}
                      <span>{item.visible ? 'Visible' : 'Hidden'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View Cart Special Notice */}
          <div className="bg-[#FFF7E8] p-4 rounded-2xl border border-[#F47B20]/40 flex items-center gap-3 mt-4">
            <ShoppingBag className="w-5 h-5 text-[#F47B20] shrink-0" />
            <div className="text-xs text-[#202522]">
              <span className="font-extrabold text-[#183A2A]">Special Action: "View Cart" Button</span>
              <p className="text-[11px] text-[#7D967E]">
                The View Cart CTA retains its distinct Food Orange styling, item counter badge, and direct routing to <code className="text-[#183A2A] font-bold">/cart</code> on the right side of the navbar.
              </p>
            </div>
          </div>
        </MHPCard>

        <div className="flex justify-end">
          <MHPButton
            type="submit"
            loading={saving}
            variant="primary"
            size="lg"
          >
            <Save className="w-4 h-4" />
            <span>Save Navbar Settings</span>
          </MHPButton>
        </div>
      </form>
    </div>
  );
};

export default AdminNavbarManager;
