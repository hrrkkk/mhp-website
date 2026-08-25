import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { MapPin, Settings, Save, Building } from 'lucide-react';

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
    e.preventDefault();
    try {
      setSaving(true);
      await api.put('/settings', settings);
      await api.put('/location', location);
      showToast('success', 'Site settings and location info updated!');
    } catch (err) {
      console.error('Save error:', err);
      showToast('error', 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl pb-16">
      
      <div>
        <h1 className="text-2xl font-extrabold text-[#FFFDF8] flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#F4A62A]" />
          Website Settings & Location Info Editor
        </h1>
        <p className="text-xs text-[#BDB7AD] mt-1">Update hero titles, location descriptions, and campus landmark text without editing code</p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-8">
        
        {/* Site Content Settings */}
        <div className="mhp-card-dark p-8 rounded-3xl border border-[#2E2A27] space-y-6 shadow-lg">
          <h2 className="text-lg font-bold text-[#FFFDF8] border-b border-[#2E2A27] pb-3 flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#F4A62A]" />
            Homepage & Brand Content
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#BDB7AD]">Hero Main Title</label>
              <input
                type="text"
                value={settings.heroTitle}
                onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#2E2A27] text-[#FFFDF8] text-xs focus:outline-none focus:border-[#F4A62A]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#BDB7AD]">Hero Subtitle</label>
              <input
                type="text"
                value={settings.heroSubtitle}
                onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#2E2A27] text-[#FFFDF8] text-xs focus:outline-none focus:border-[#F4A62A]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#BDB7AD]">Hero Description Paragraph</label>
            <textarea
              rows={3}
              value={settings.heroDescription}
              onChange={(e) => setSettings({ ...settings, heroDescription: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#2E2A27] text-[#FFFDF8] text-xs focus:outline-none focus:border-[#F4A62A]"
            ></textarea>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#BDB7AD]">About MHP Main Text</label>
            <textarea
              rows={4}
              value={settings.aboutText}
              onChange={(e) => setSettings({ ...settings, aboutText: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#2E2A27] text-[#FFFDF8] text-xs focus:outline-none focus:border-[#F4A62A]"
            ></textarea>
          </div>
        </div>

        {/* Location Info */}
        <div className="mhp-card-dark p-8 rounded-3xl border border-[#2E2A27] space-y-6 shadow-lg">
          <h2 className="text-lg font-bold text-[#FFFDF8] border-b border-[#2E2A27] pb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#F4A62A]" />
            VFSTR Campus Location & Landmarks
          </h2>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#BDB7AD]">Institution Name</label>
            <input
              type="text"
              value={location.institution}
              onChange={(e) => setLocation({ ...location, institution: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#2E2A27] text-[#FFFDF8] text-xs focus:outline-none focus:border-[#F4A62A]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#BDB7AD]">Address</label>
            <input
              type="text"
              value={location.address}
              onChange={(e) => setLocation({ ...location, address: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#2E2A27] text-[#FFFDF8] text-xs focus:outline-none focus:border-[#F4A62A]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#BDB7AD]">Primary Landmark Description *</label>
            <textarea
              rows={3}
              value={location.landmark}
              onChange={(e) => setLocation({ ...location, landmark: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#2E2A27] text-[#FFFDF8] text-xs font-medium focus:outline-none focus:border-[#F4A62A]"
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn-mhp-primary px-8 py-3.5 text-xs flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Updating Settings...' : 'Save Website Settings'}</span>
        </button>
      </form>

    </div>
  );
};

export default AdminLocationSettings;
