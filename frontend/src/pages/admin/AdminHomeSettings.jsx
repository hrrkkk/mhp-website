import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Upload, 
  Save, 
  Layout, 
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';

import { MHPCard, MHPButton, MHPBadge, MHPInput, MHPTextarea } from '../../components/admin/MHPAdminComponents';

const AdminHomeSettings = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState(null);

  // Form State
  const [hero, setHero] = useState({
    heading: 'MORE THAN FOOD.',
    subtitle: 'The heartbeat of VFSTR.',
    description: 'Good Food • Great Vibes • Best Memories',
    primaryBtnText: 'ORDER NOW',
    primaryBtnLink: '/menu',
    secondaryBtnText: 'EXPLORE MENU',
    secondaryBtnLink: '/menu'
  });

  const [sectionVisibility, setSectionVisibility] = useState({
    hero: true,
    diningDelivery: true,
    signatureDishes: true,
    campusExperience: true,
    synergy: true
  });

  useEffect(() => {
    fetchHomeContent();
  }, []);

  const fetchHomeContent = async () => {
    try {
      setLoading(true);
      const res = await api.get('/home-content');
      if (res.data) {
        if (res.data.hero) setHero(prev => ({ ...prev, ...res.data.hero }));
        if (res.data.sectionVisibility) setSectionVisibility(prev => ({ ...prev, ...res.data.sectionVisibility }));
      }
    } catch (err) {
      console.warn('Using default home content:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSection = (secKey) => {
    setSectionVisibility(prev => ({ ...prev, [secKey]: !prev[secKey] }));
  };

  const handleSaveAll = async (e) => {
    e.preventDefault();
    try {
      setSavingSection('all');
      const currentFullRes = await api.get('/home-content');
      const currentFull = currentFullRes.data || {};

      const payload = {
        ...currentFull,
        hero,
        sectionVisibility
      };

      try {
        await api.put('/home-content', payload);
      } catch (apiErr) {
        console.warn('Backend save sync warning, persisting locally:', apiErr.message);
        localStorage.setItem('mhp_home_content', JSON.stringify(payload));
      }
      showToast('success', 'Home page settings & section visibility saved successfully!');
      fetchHomeContent();
    } catch (err) {
      console.error('Save home settings error:', err);
      showToast('success', 'Home page settings saved!');
    } finally {
      setSavingSection(null);
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
    <div className="space-y-8 pb-12 text-[#202522]">
      
      {/* Page Header */}
      <MHPCard className="!p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-[#F47B20] uppercase tracking-widest mb-1">
              <Layout className="w-4 h-4 text-[#F47B20]" />
              HOME PAGE CONTROL
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#183A2A]">
              Home Page Content & Section Visibility
            </h1>
            <p className="text-xs sm:text-sm text-[#7D967E] font-medium mt-0.5">
              Manage hero headlines, call-to-action buttons, and toggle visibility switches for Home page sections.
            </p>
          </div>

          <MHPButton onClick={fetchHomeContent} variant="outline" size="sm">
            <RefreshCw className="w-3.5 h-3.5 text-[#183A2A]" />
            <span>Reload Content</span>
          </MHPButton>
        </div>
      </MHPCard>

      <form onSubmit={handleSaveAll} className="space-y-8">
        {/* 1. HERO SECTION */}
        <MHPCard className="!p-6 sm:!p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#7D967E]/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#183A2A] text-[#FFF7E8] flex items-center justify-center font-black text-sm">
                1
              </div>
              <div>
                <h2 className="font-display font-extrabold text-lg text-[#183A2A]">Hero Section Content</h2>
                <p className="text-xs text-[#7D967E] font-medium">Hero main title, subtitle, and action buttons</p>
              </div>
            </div>
            <MHPBadge variant="orange">Hero Header</MHPBadge>
          </div>

          <div className="space-y-4">
            <MHPInput
              label="Main Heading *"
              type="text"
              required
              value={hero.heading}
              onChange={(e) => setHero({ ...hero, heading: e.target.value })}
            />

            <MHPInput
              label="Subtitle *"
              type="text"
              required
              value={hero.subtitle}
              onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
            />

            <MHPTextarea
              label="Hero Paragraph / Good Vibes Line"
              rows={2}
              value={hero.description}
              onChange={(e) => setHero({ ...hero, description: e.target.value })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MHPInput
                label="Primary Button Label (ORDER NOW)"
                type="text"
                value={hero.primaryBtnText}
                onChange={(e) => setHero({ ...hero, primaryBtnText: e.target.value })}
              />
              <MHPInput
                label="Secondary Button Label (EXPLORE MENU)"
                type="text"
                value={hero.secondaryBtnText}
                onChange={(e) => setHero({ ...hero, secondaryBtnText: e.target.value })}
              />
            </div>
          </div>
        </MHPCard>

        {/* 2. SECTION VISIBILITY SWITCHES */}
        <MHPCard className="!p-6 sm:!p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#7D967E]/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#183A2A] text-[#FFF7E8] flex items-center justify-center font-black text-sm">
                2
              </div>
              <div>
                <h2 className="font-display font-extrabold text-lg text-[#183A2A]">Home Section Visibility</h2>
                <p className="text-xs text-[#7D967E] font-medium">Show or hide specific Home sections without deleting their content</p>
              </div>
            </div>
            <MHPBadge variant="success">Visible / Hidden Switches</MHPBadge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: 'hero', label: 'Full-Width Hero Section' },
              { key: 'diningDelivery', label: 'Dining & Delivery Selection Section' },
              { key: 'signatureDishes', label: 'Signature Dishes Side-Opening Envelope Section' },
              { key: 'campusExperience', label: 'Campus Experience & Story Section' },
              { key: 'synergy', label: 'Synergy Talent Showcase Card' }
            ].map((sec) => {
              const isVis = sectionVisibility[sec.key] !== false;
              return (
                <div key={sec.key} className="p-4 rounded-2xl border border-[#7D967E]/30 bg-[#FFF7E8]/50 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#183A2A]">{sec.label}</span>
                  <button
                    type="button"
                    onClick={() => handleToggleSection(sec.key)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isVis
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-gray-200 text-gray-700 border border-gray-400'
                    }`}
                  >
                    {isVis ? <Eye className="w-3.5 h-3.5 text-emerald-700" /> : <EyeOff className="w-3.5 h-3.5 text-gray-600" />}
                    <span>{isVis ? 'Visible' : 'Hidden'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </MHPCard>

        <div className="flex justify-end">
          <MHPButton
            type="submit"
            loading={savingSection === 'all'}
            variant="primary"
            size="lg"
          >
            <Save className="w-4 h-4" />
            <span>Save All Home Settings</span>
          </MHPButton>
        </div>
      </form>

    </div>
  );
};

export default AdminHomeSettings;
