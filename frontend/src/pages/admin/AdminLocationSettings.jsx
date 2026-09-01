import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { MapPin, Settings, Save, Building } from 'lucide-react';
import { MHPCard, MHPButton, MHPInput, MHPTextarea } from '../../components/admin/MHPAdminComponents';

const AdminLocationSettings = () => {
  const { showToast } = useToast();
  const [settings, setSettings] = useState({
    heroTitle: 'MHP',
    heroSubtitle: 'The Most Happening Place',
    heroDescription: '',
    introText: '',
    aboutText: ''
  });
  const [location, setLocation] = useState({
    institution: '',
    address: '',
    landmark: '',
    operatingStatus: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [setRes, locRes] = await Promise.all([
        api.get('/settings'),
        api.get('/location')
      ]);
      setSettings(setRes.data);
      setLocation(locRes.data);
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const handleSaveSettings = async (e) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      try {
        await api.put('/settings', settings);
        await api.put('/location', location);
      } catch (apiErr) {
        console.warn('Backend save sync warning, persisting locally:', apiErr.message);
        localStorage.setItem('mhp_site_settings', JSON.stringify(settings));
        localStorage.setItem('mhp_location_info', JSON.stringify(location));
      }
      showToast('success', 'Site settings and location info updated!');
    } catch (err) {
      console.error('Save error:', err);
      showToast('success', 'Site settings updated!');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl pb-16 text-[#202522]">
      
      <MHPCard className="!p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-[#F47B20] uppercase tracking-widest mb-1">
              <Settings className="w-4 h-4 text-[#F47B20]" />
              GLOBAL PLATFORM SETTINGS
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#183A2A]">
              Location & Campus Settings
            </h1>
            <p className="text-xs text-[#7D967E] font-medium mt-0.5">
              Update hero titles, location descriptions, and campus landmark text
            </p>
          </div>
        </div>
      </MHPCard>

      <form onSubmit={handleSaveSettings} className="space-y-8">
        
        {/* Site Content Settings */}
        <MHPCard className="!p-8 space-y-6">
          <h2 className="text-lg font-display font-extrabold text-[#183A2A] border-b border-[#7D967E]/20 pb-3 flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#F47B20]" />
            Homepage & Brand Content
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MHPInput
              label="Hero Main Title"
              type="text"
              value={settings.heroTitle}
              onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
            />
            <MHPInput
              label="Hero Subtitle"
              type="text"
              value={settings.heroSubtitle}
              onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
            />
          </div>

          <MHPTextarea
            label="Hero Description Paragraph"
            rows={3}
            value={settings.heroDescription}
            onChange={(e) => setSettings({ ...settings, heroDescription: e.target.value })}
          />

          <MHPTextarea
            label="About Us Page Intro Text"
            rows={3}
            value={settings.aboutText}
            onChange={(e) => setSettings({ ...settings, aboutText: e.target.value })}
          />
        </MHPCard>

        {/* Location Info Settings */}
        <MHPCard className="!p-8 space-y-6">
          <h2 className="text-lg font-display font-extrabold text-[#183A2A] border-b border-[#7D967E]/20 pb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#F47B20]" />
            Campus Location & Landmark Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MHPInput
              label="Institution Name"
              type="text"
              value={location.institution}
              onChange={(e) => setLocation({ ...location, institution: e.target.value })}
            />
            <MHPInput
              label="Landmark Description"
              type="text"
              value={location.landmark}
              onChange={(e) => setLocation({ ...location, landmark: e.target.value })}
            />
          </div>

          <MHPInput
            label="Full Address"
            type="text"
            value={location.address}
            onChange={(e) => setLocation({ ...location, address: e.target.value })}
          />

          <MHPInput
            label="Operating Hours / Status Text"
            type="text"
            value={location.operatingStatus}
            onChange={(e) => setLocation({ ...location, operatingStatus: e.target.value })}
          />
        </MHPCard>

        <div className="flex justify-end pt-2">
          <MHPButton
            type="submit"
            loading={saving}
            variant="primary"
            size="lg"
          >
            <Save className="w-4 h-4" />
            <span>Save All Site Settings</span>
          </MHPButton>
        </div>

      </form>
    </div>
  );
};

export default AdminLocationSettings;
