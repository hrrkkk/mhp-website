import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Upload, 
  Save, 
  CheckCircle2, 
  Layout, 
  Layers, 
  Mic, 
  ExternalLink,
  RefreshCw
} from 'lucide-react';

const AdminHomeSettings = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(null);

  // Form State
  const [hero, setHero] = useState({
    heading: '',
    subtitle: '',
    description: '',
    primaryBtnText: '',
    primaryBtnLink: '',
    image: ''
  });

  const [campusExperience, setCampusExperience] = useState({
    sectionLabel: '',
    heading: '',
    description: '',
    bullet1: '',
    bullet2: '',
    bullet3: '',
    image: ''
  });

  const [synergy, setSynergy] = useState({
    sectionLabel: '',
    heading: '',
    tagline: '',
    description: '',
    buttonText: '',
    buttonLink: '',
    image: ''
  });

  useEffect(() => {
    fetchHomeContent();
  }, []);

  const fetchHomeContent = async () => {
    try {
      setLoading(true);
      const res = await api.get('/home-content');
      if (res.data) {
        if (res.data.hero) setHero(res.data.hero);
        if (res.data.campusExperience) setCampusExperience(res.data.campusExperience);
        if (res.data.synergy) setSynergy(res.data.synergy);
      }
    } catch (err) {
      console.error('Failed to load home page content:', err);
      showToast('error', 'Failed to load home page content');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e, sectionKey, setter) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('error', 'Please select a valid image file (JPG, PNG, WEBP)');
      return;
    }

    try {
      setUploadingImage(sectionKey);
      
      // Instant local preview
      const localPreviewUrl = URL.createObjectURL(file);
      setter(prev => ({ ...prev, image: localPreviewUrl }));

      // Upload to server
      const formData = new FormData();
      formData.append('image', file);

      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data?.imageUrl) {
        setter(prev => ({ ...prev, image: res.data.imageUrl }));
        showToast('success', 'Image uploaded successfully! Click "Save Changes" to apply.');
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      showToast('error', 'Image upload failed. Please try again.');
    } finally {
      setUploadingImage(null);
    }
  };

  const handleSaveSection = async (sectionKey, updatedSectionData) => {
    try {
      setSavingSection(sectionKey);

      // Fetch latest full content first to merge cleanly
      const currentFullRes = await api.get('/home-content');
      const currentFull = currentFullRes.data || {};

      const payload = {
        ...currentFull,
        [sectionKey]: updatedSectionData
      };

      const res = await api.put('/home-content', payload);

      if (res.data) {
        showToast('success', `${sectionKey.toUpperCase()} section saved successfully!`);
      }
    } catch (err) {
      console.error(`Failed to save ${sectionKey} section:`, err);
      showToast('error', `Failed to save ${sectionKey} section changes`);
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
    <div className="space-y-8 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDD7CD] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#202020] text-[#B9684D] text-xs font-semibold mb-2">
            <Layout className="w-3.5 h-3.5" />
            <span>Content Control</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#202020] tracking-tight">
            Home Page Management
          </h1>
          <p className="text-xs sm:text-sm text-[#77736D] mt-1">
            Manage the content and images displayed on the MHP customer home page.
          </p>
        </div>

        <button
          onClick={fetchHomeContent}
          className="self-start sm:self-center px-4 py-2 rounded-lg bg-[#FFFFFF] border border-[#DDD7CD] hover:bg-[#F5F1E8] text-[#202020] text-xs font-semibold flex items-center gap-2 shadow-xs transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#77736D]" />
          <span>Reload Content</span>
        </button>
      </div>

      {/* ==================================================== */}
      {/* 1. HERO / MAIN HOME SECTION */}
      {/* ==================================================== */}
      <section className="bg-[#FFFFFF] rounded-xl border border-[#DDD7CD] p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#DDD7CD] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#202020] text-[#B9684D] flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <h2 className="font-display font-semibold text-lg text-[#202020]">Hero / Main Home Section</h2>
              <p className="text-xs text-[#77736D]">Hero banner title, tagline, and call-to-action buttons</p>
            </div>
          </div>
          <span className="text-[10px] px-2.5 py-1 rounded bg-[#F5F1E8] text-[#202020] border border-[#DDD7CD] font-semibold uppercase">
            Hero Header
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#202020] uppercase tracking-wider mb-1.5">
                Main Heading
              </label>
              <input
                type="text"
                value={hero.heading}
                onChange={(e) => setHero({ ...hero, heading: e.target.value })}
                placeholder="e.g. MHP – The Most Happening Place"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDD7CD] bg-[#F5F1E8] text-[#202020] text-xs sm:text-sm font-medium focus:outline-none focus:border-[#B9684D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#202020] uppercase tracking-wider mb-1.5">
                Tagline / Subtitle
              </label>
              <input
                type="text"
                value={hero.subtitle}
                onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                placeholder='e.g. "Where campus life happens."'
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDD7CD] bg-[#F5F1E8] text-[#202020] text-xs sm:text-sm font-medium focus:outline-none focus:border-[#B9684D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#202020] uppercase tracking-wider mb-1.5">
                Hero Description Text
              </label>
              <textarea
                rows={3}
                value={hero.description}
                onChange={(e) => setHero({ ...hero, description: e.target.value })}
                placeholder="Brief description paragraph under hero heading..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDD7CD] bg-[#F5F1E8] text-[#202020] text-xs sm:text-sm font-medium focus:outline-none focus:border-[#B9684D]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#202020] uppercase tracking-wider mb-1.5">
                  Primary Button Text
                </label>
                <input
                  type="text"
                  value={hero.primaryBtnText}
                  onChange={(e) => setHero({ ...hero, primaryBtnText: e.target.value })}
                  placeholder="Explore Food Menu"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDD7CD] bg-[#F5F1E8] text-[#202020] text-xs font-medium focus:outline-none focus:border-[#B9684D]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#202020] uppercase tracking-wider mb-1.5">
                  Primary Button Link
                </label>
                <input
                  type="text"
                  value={hero.primaryBtnLink}
                  onChange={(e) => setHero({ ...hero, primaryBtnLink: e.target.value })}
                  placeholder="/menu"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDD7CD] bg-[#F5F1E8] text-[#202020] text-xs font-medium focus:outline-none focus:border-[#B9684D]"
                />
              </div>
            </div>
          </div>

          {/* Hero Image Control */}
          <div className="space-y-3 bg-[#F5F1E8] p-5 rounded-xl border border-[#DDD7CD]">
            <label className="block text-xs font-bold text-[#202020] uppercase tracking-wider">
              Hero Image Preview (Optional Banner)
            </label>
            
            <div className="h-44 rounded-lg overflow-hidden border border-[#DDD7CD] bg-[#202020] relative flex items-center justify-center">
              {hero.image ? (
                <img
                  src={hero.image}
                  alt="Hero Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-4 text-[#77736D]">
                  <ImageIcon className="w-8 h-8 mx-auto mb-1 text-[#77736D]" />
                  <p className="text-xs">No hero image set (Uses text-centered hero banner)</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-1">
              <label className="cursor-pointer px-4 py-2 rounded-lg bg-[#202020] hover:bg-[#2A2927] text-[#F5F1E8] text-xs font-semibold flex items-center gap-2 transition-all">
                <Upload className="w-3.5 h-3.5 text-[#B9684D]" />
                <span>{uploadingImage === 'hero' ? 'Uploading...' : 'Change Image'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'hero', setHero)}
                  className="hidden"
                  disabled={uploadingImage === 'hero'}
                />
              </label>

              {hero.image && (
                <button
                  type="button"
                  onClick={() => setHero({ ...hero, image: '' })}
                  className="px-3 py-2 text-xs font-semibold text-[#B75B55] hover:underline"
                >
                  Remove Image
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-[#DDD7CD]">
          <button
            onClick={() => handleSaveSection('hero', hero)}
            disabled={savingSection === 'hero'}
            className="px-6 py-2.5 rounded-lg bg-[#B9684D] hover:bg-[#A35940] text-[#FFFFFF] text-xs font-bold flex items-center gap-2 shadow-xs transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{savingSection === 'hero' ? 'Saving Hero Section...' : 'Save Changes'}</span>
          </button>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 2. CAMPUS EXPERIENCE SECTION */}
      {/* ==================================================== */}
      <section className="bg-[#FFFFFF] rounded-xl border border-[#DDD7CD] p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#DDD7CD] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#202020] text-[#B9684D] flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <h2 className="font-display font-semibold text-lg text-[#202020]">Campus Experience Section</h2>
              <p className="text-xs text-[#77736D]">MHP student gathering text, bullets, and right-side image</p>
            </div>
          </div>
          <span className="text-[10px] px-2.5 py-1 rounded bg-[#F5F1E8] text-[#202020] border border-[#DDD7CD] font-semibold uppercase">
            Overview Card
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#202020] uppercase tracking-wider mb-1.5">
                Section Label Badge
              </label>
              <input
                type="text"
                value={campusExperience.sectionLabel}
                onChange={(e) => setCampusExperience({ ...campusExperience, sectionLabel: e.target.value })}
                placeholder="The Campus Experience"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDD7CD] bg-[#F5F1E8] text-[#202020] text-xs sm:text-sm font-medium focus:outline-none focus:border-[#B9684D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#202020] uppercase tracking-wider mb-1.5">
                Main Section Heading
              </label>
              <input
                type="text"
                value={campusExperience.heading}
                onChange={(e) => setCampusExperience({ ...campusExperience, heading: e.target.value })}
                placeholder="More Than Just Food — The Heartbeat of VFSTR Campus"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDD7CD] bg-[#F5F1E8] text-[#202020] text-xs sm:text-sm font-medium focus:outline-none focus:border-[#B9684D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#202020] uppercase tracking-wider mb-1.5">
                Section Description
              </label>
              <textarea
                rows={3}
                value={campusExperience.description}
                onChange={(e) => setCampusExperience({ ...campusExperience, description: e.target.value })}
                placeholder="MHP is an on-campus space where students eat..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDD7CD] bg-[#F5F1E8] text-[#202020] text-xs sm:text-sm font-medium focus:outline-none focus:border-[#B9684D]"
              />
            </div>

            <div className="space-y-2.5 pt-1">
              <label className="block text-xs font-bold text-[#202020] uppercase tracking-wider">
                Bullet Points (Feature Highlights)
              </label>
              <input
                type="text"
                value={campusExperience.bullet1}
                onChange={(e) => setCampusExperience({ ...campusExperience, bullet1: e.target.value })}
                placeholder="Bullet point 1"
                className="w-full px-3.5 py-2 rounded-lg border border-[#DDD7CD] bg-[#F5F1E8] text-[#202020] text-xs font-medium focus:outline-none focus:border-[#B9684D]"
              />
              <input
                type="text"
                value={campusExperience.bullet2}
                onChange={(e) => setCampusExperience({ ...campusExperience, bullet2: e.target.value })}
                placeholder="Bullet point 2"
                className="w-full px-3.5 py-2 rounded-lg border border-[#DDD7CD] bg-[#F5F1E8] text-[#202020] text-xs font-medium focus:outline-none focus:border-[#B9684D]"
              />
              <input
                type="text"
                value={campusExperience.bullet3}
                onChange={(e) => setCampusExperience({ ...campusExperience, bullet3: e.target.value })}
                placeholder="Bullet point 3"
                className="w-full px-3.5 py-2 rounded-lg border border-[#DDD7CD] bg-[#F5F1E8] text-[#202020] text-xs font-medium focus:outline-none focus:border-[#B9684D]"
              />
            </div>
          </div>

          {/* Image Control for Campus Experience */}
          <div className="space-y-3 bg-[#F5F1E8] p-5 rounded-xl border border-[#DDD7CD]">
            <label className="block text-xs font-bold text-[#202020] uppercase tracking-wider">
              Current Image Preview (MHP Student Gathering)
            </label>
            
            <div className="h-56 rounded-lg overflow-hidden border border-[#DDD7CD] bg-[#202020] relative">
              {campusExperience.image ? (
                <img
                  src={campusExperience.image}
                  alt="Campus Experience Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="h-full flex items-center justify-center text-[#77736D] p-4 text-center">
                  <p className="text-xs">No image selected</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="cursor-pointer px-4 py-2 rounded-lg bg-[#202020] hover:bg-[#2A2927] text-[#F5F1E8] text-xs font-semibold flex items-center gap-2 transition-all">
                <Upload className="w-3.5 h-3.5 text-[#B9684D]" />
                <span>{uploadingImage === 'campusExperience' ? 'Uploading...' : 'Change Image'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'campusExperience', setCampusExperience)}
                  className="hidden"
                  disabled={uploadingImage === 'campusExperience'}
                />
              </label>

              <span className="text-[11px] text-[#77736D] italic">
                Fills right-side container
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-[#DDD7CD]">
          <button
            onClick={() => handleSaveSection('campusExperience', campusExperience)}
            disabled={savingSection === 'campusExperience'}
            className="px-6 py-2.5 rounded-lg bg-[#B9684D] hover:bg-[#A35940] text-[#FFFFFF] text-xs font-bold flex items-center gap-2 shadow-xs transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{savingSection === 'campusExperience' ? 'Saving Campus Experience...' : 'Save Changes'}</span>
          </button>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 3. SYNERGY SECTION */}
      {/* ==================================================== */}
      <section className="bg-[#FFFFFF] rounded-xl border border-[#DDD7CD] p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#DDD7CD] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#202020] text-[#B9684D] flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div>
              <h2 className="font-display font-semibold text-lg text-[#202020]">Synergy Showcase Section</h2>
              <p className="text-xs text-[#77736D]">Monthly student talent banner content, tagline, and stage image</p>
            </div>
          </div>
          <span className="text-[10px] px-2.5 py-1 rounded bg-[#F5F1E8] text-[#202020] border border-[#DDD7CD] font-semibold uppercase">
            Synergy Showcase
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#202020] uppercase tracking-wider mb-1.5">
                Section Label
              </label>
              <input
                type="text"
                value={synergy.sectionLabel}
                onChange={(e) => setSynergy({ ...synergy, sectionLabel: e.target.value })}
                placeholder="Monthly Student Talent Showcase"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDD7CD] bg-[#F5F1E8] text-[#202020] text-xs sm:text-sm font-medium focus:outline-none focus:border-[#B9684D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#202020] uppercase tracking-wider mb-1.5">
                Heading
              </label>
              <input
                type="text"
                value={synergy.heading}
                onChange={(e) => setSynergy({ ...synergy, heading: e.target.value })}
                placeholder="SYNERGY"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDD7CD] bg-[#F5F1E8] text-[#202020] text-xs sm:text-sm font-medium focus:outline-none focus:border-[#B9684D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#202020] uppercase tracking-wider mb-1.5">
                Tagline / Quote
              </label>
              <input
                type="text"
                value={synergy.tagline}
                onChange={(e) => setSynergy({ ...synergy, tagline: e.target.value })}
                placeholder='"One Stage. Infinite Possibilities."'
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDD7CD] bg-[#F5F1E8] text-[#202020] text-xs sm:text-sm font-medium focus:outline-none focus:border-[#B9684D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#202020] uppercase tracking-wider mb-1.5">
                Description
              </label>
              <textarea
                rows={3}
                value={synergy.description}
                onChange={(e) => setSynergy({ ...synergy, description: e.target.value })}
                placeholder="Synergy is a monthly MHP student talent showcase..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDD7CD] bg-[#F5F1E8] text-[#202020] text-xs sm:text-sm font-medium focus:outline-none focus:border-[#B9684D]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#202020] uppercase tracking-wider mb-1.5">
                  Button Text
                </label>
                <input
                  type="text"
                  value={synergy.buttonText}
                  onChange={(e) => setSynergy({ ...synergy, buttonText: e.target.value })}
                  placeholder="Discover Synergy"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDD7CD] bg-[#F5F1E8] text-[#202020] text-xs font-medium focus:outline-none focus:border-[#B9684D]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#202020] uppercase tracking-wider mb-1.5">
                  Button Link
                </label>
                <input
                  type="text"
                  value={synergy.buttonLink}
                  onChange={(e) => setSynergy({ ...synergy, buttonLink: e.target.value })}
                  placeholder="/about"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDD7CD] bg-[#F5F1E8] text-[#202020] text-xs font-medium focus:outline-none focus:border-[#B9684D]"
                />
              </div>
            </div>
          </div>

          {/* Image Control for Synergy */}
          <div className="space-y-3 bg-[#F5F1E8] p-5 rounded-xl border border-[#DDD7CD]">
            <label className="block text-xs font-bold text-[#202020] uppercase tracking-wider">
              Current Image Preview (Synergy Stage)
            </label>
            
            <div className="h-56 rounded-lg overflow-hidden border border-[#DDD7CD] bg-[#202020] relative">
              {synergy.image ? (
                <img
                  src={synergy.image}
                  alt="Synergy Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="h-full flex items-center justify-center text-[#77736D] p-4 text-center">
                  <p className="text-xs">No image selected</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="cursor-pointer px-4 py-2 rounded-lg bg-[#202020] hover:bg-[#2A2927] text-[#F5F1E8] text-xs font-semibold flex items-center gap-2 transition-all">
                <Upload className="w-3.5 h-3.5 text-[#B9684D]" />
                <span>{uploadingImage === 'synergy' ? 'Uploading...' : 'Change Image'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'synergy', setSynergy)}
                  className="hidden"
                  disabled={uploadingImage === 'synergy'}
                />
              </label>

              <span className="text-[11px] text-[#77736D] italic">
                Fills Synergy stage card
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-[#DDD7CD]">
          <button
            onClick={() => handleSaveSection('synergy', synergy)}
            disabled={savingSection === 'synergy'}
            className="px-6 py-2.5 rounded-lg bg-[#B9684D] hover:bg-[#A35940] text-[#FFFFFF] text-xs font-bold flex items-center gap-2 shadow-xs transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{savingSection === 'synergy' ? 'Saving Synergy Section...' : 'Save Changes'}</span>
          </button>
        </div>
      </section>

    </div>
  );
};

export default AdminHomeSettings;
