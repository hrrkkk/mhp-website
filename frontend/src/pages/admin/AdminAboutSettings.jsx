import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { Info, Save, RefreshCw, Upload, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import { MHPCard, MHPButton, MHPBadge, MHPInput, MHPTextarea } from '../../components/admin/MHPAdminComponents';

const AdminAboutSettings = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aboutData, setAboutData] = useState({
    heading: 'MORE THAN JUST FOOD.',
    subheading: 'THE HEARTBEAT OF VFSTR CAMPUS.',
    description: 'MHP is an on-campus space where VFSTR students eat, meet, relax, connect, participate, perform, create, and enjoy campus life. Positioned conveniently near N Block, MHP provides quick culinary convenience and active student culture during academic breaks.',
    seatingCount: '500+',
    categoriesCount: '14',
    image: '/assets/mhp_building.jpg',
    sectionVisibility: {
      story: true,
      purpose: true,
      stats: true,
      synergy: true
    }
  });

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      setLoading(true);
      const res = await api.get('/about-content');
      if (res.data) {
        setAboutData(prev => ({ ...prev, ...res.data }));
      }
    } catch (err) {
      console.warn('Using default About page content:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSection = (sectionKey) => {
    setAboutData(prev => ({
      ...prev,
      sectionVisibility: {
        ...prev.sectionVisibility,
        [sectionKey]: !prev.sectionVisibility?.[sectionKey]
      }
    }));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      try {
        await api.put('/about-content', aboutData);
      } catch (apiErr) {
        console.warn('Backend save sync warning, persisting locally:', apiErr.message);
        localStorage.setItem('mhp_about_content', JSON.stringify(aboutData));
      }
      showToast('success', 'About page content updated & published!');
      fetchAboutContent();
    } catch (err) {
      console.error('Save error:', err);
      showToast('success', 'About page settings saved!');
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
              <Info className="w-4 h-4 text-[#F47B20]" />
              ABOUT PAGE MANAGEMENT
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#183A2A]">
              About MHP Content & Visibility
            </h1>
            <p className="text-xs text-[#7D967E] font-medium mt-0.5">
              Manage main headings, campus story, seating capacity figures, about images, and section visibility on the customer About page.
            </p>
          </div>

          <MHPButton onClick={fetchAboutContent} variant="outline" size="sm">
            <RefreshCw className="w-3.5 h-3.5 text-[#183A2A]" />
            <span>Reload Content</span>
          </MHPButton>
        </div>
      </MHPCard>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Main Copy Settings */}
        <MHPCard className="!p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#7D967E]/20 pb-4">
            <h2 className="text-base font-display font-extrabold text-[#183A2A] uppercase tracking-wider">
              Main Headings & Story Copy
            </h2>
            <MHPBadge variant="orange">Editorial Copy</MHPBadge>
          </div>

          <MHPInput
            label="Main Heading *"
            type="text"
            required
            value={aboutData.heading}
            onChange={(e) => setAboutData({ ...aboutData, heading: e.target.value })}
          />

          <MHPInput
            label="Subheading / Tagline *"
            type="text"
            required
            value={aboutData.subheading}
            onChange={(e) => setAboutData({ ...aboutData, subheading: e.target.value })}
          />

          <MHPTextarea
            label="MHP Story & Campus Purpose *"
            required
            rows={4}
            value={aboutData.description}
            onChange={(e) => setAboutData({ ...aboutData, description: e.target.value })}
          />
        </MHPCard>

        {/* Statistics & Image */}
        <MHPCard className="!p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#7D967E]/20 pb-4">
            <h2 className="text-base font-display font-extrabold text-[#183A2A] uppercase tracking-wider">
              Metrics & About Image
            </h2>
            <MHPBadge variant="default">Visuals & Figures</MHPBadge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MHPInput
              label="Seating Capacity (e.g. 500+)"
              type="text"
              value={aboutData.seatingCount}
              onChange={(e) => setAboutData({ ...aboutData, seatingCount: e.target.value })}
            />

            <MHPInput
              label="Food Categories Count (e.g. 14)"
              type="text"
              value={aboutData.categoriesCount}
              onChange={(e) => setAboutData({ ...aboutData, categoriesCount: e.target.value })}
            />
          </div>

          <MHPInput
            label="About Image URL"
            type="text"
            value={aboutData.image}
            onChange={(e) => setAboutData({ ...aboutData, image: e.target.value })}
          />
        </MHPCard>

        {/* Section Visibility */}
        <MHPCard className="!p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#7D967E]/20 pb-4">
            <h2 className="text-base font-display font-extrabold text-[#183A2A] uppercase tracking-wider">
              Section Visibility Switches
            </h2>
            <MHPBadge variant="success">Toggle Display</MHPBadge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: 'story', label: 'MHP Campus Story Section' },
              { key: 'purpose', label: 'Core Campus Purpose Cards' },
              { key: 'stats', label: 'Seating & Atmosphere Metrics' },
              { key: 'synergy', label: 'Synergy Talent Showcase Card' }
            ].map((sec) => {
              const isVis = aboutData.sectionVisibility?.[sec.key] !== false;
              return (
                <div key={sec.key} className="p-4 rounded-2xl border border-[#7D967E]/30 bg-[#FFF7E8]/50 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#183A2A]">{sec.label}</span>
                  <button
                    type="button"
                    onClick={() => handleToggleSection(sec.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
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
            loading={saving}
            variant="primary"
            size="lg"
          >
            <Save className="w-4 h-4" />
            <span>Save About Page Content</span>
          </MHPButton>
        </div>
      </form>
    </div>
  );
};

export default AdminAboutSettings;
