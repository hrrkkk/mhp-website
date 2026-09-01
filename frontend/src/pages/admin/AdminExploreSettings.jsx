import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { Compass, Save, RefreshCw, Plus, Trash2, Video, Image as ImageIcon, Upload, Eye, EyeOff, X } from 'lucide-react';
import { MHPCard, MHPButton, MHPBadge, MHPInput } from '../../components/admin/MHPAdminComponents';
import { getImageUrl } from '../../utils/imageUtils';

const AdminExploreSettings = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingThumbIdx, setUploadingThumbIdx] = useState(null);
  const [exploreData, setExploreData] = useState({
    gallery: {
      eyebrow: 'INSIDE MHP',
      heading: 'GALLERY',
      subtitle: 'A glimpse into the food, people and moments that make MHP special.',
      instagramHandle: '@mhp_vfstr',
      instagramSub: 'Official Campus Handle',
      items: [
        { id: 1, title: 'MHP Central Plaza', category: 'Quadrangle Dining & Atmosphere', sub: 'The Heartbeat Near N Block', image: '' },
        { id: 2, title: "Chef's Special Counters", category: 'Signature Prep', sub: 'Fresh Daily', image: '' },
        { id: 3, title: 'Student Gatherings', category: 'Campus Break', sub: 'Afternoon Chai & Snack', image: '' },
        { id: 4, title: 'Authentic Campus Moments', category: 'Editorial Portrait', sub: 'VFSTR Life', image: '' },
        { id: 5, title: 'Flavors & Good Vibes', category: 'Refreshed Daily', sub: 'Specialty Cuisine', image: '' }
      ]
    },
    reels: {
      eyebrow: 'THE MOMENTS WE KEEP',
      heading: 'Events & Memories',
      subtitle: 'From celebrations and campus events to everyday moments, these are the memories that make MHP more than a place to eat.',
      videos: [
        { id: 1, title: 'Campus Evening Vibes', tag: 'DAILY MOMENTS', src: '/videos/mhp_hero_video.mp4', thumbnail: '', visible: true, order: 1 },
        { id: 2, title: 'Biryani & Conversations', tag: 'SIGNATURE DISHES', src: '/videos/WhatsApp%20Video%202026-08-27%20at%209.02.26%20PM.mp4', thumbnail: '', visible: true, order: 2 },
        { id: 3, title: 'Synergy Open Mic Night', tag: 'STUDENT STAGE', src: '/videos/mhp_hero_video.mp4', thumbnail: '', visible: true, order: 3 },
        { id: 4, title: 'Mahotsav Prep & Fest Stalls', tag: 'CAMPUS FESTIVAL', src: '/videos/WhatsApp%20Video%202026-08-27%20at%209.02.26%20PM.mp4', thumbnail: '', visible: true, order: 4 }
      ]
    },
    brandStatement: {
      heading: "EAT. MEET. REMEMBER. THAT'S MHP.",
      tagline: 'More than a place to eat. A part of campus life.'
    }
  });

  useEffect(() => {
    fetchExploreContent();
  }, []);

  const fetchExploreContent = async () => {
    try {
      setLoading(true);
      const res = await api.get('/explore-content');
      if (res.data) {
        setExploreData(prev => ({
          gallery: { ...prev.gallery, ...(res.data.gallery || {}) },
          reels: { ...prev.reels, ...(res.data.reels || {}) },
          brandStatement: { ...prev.brandStatement, ...(res.data.brandStatement || {}) }
        }));
      }
    } catch (err) {
      console.warn('Using default Explore content:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.put('/explore-content', exploreData);
      if (res.data) {
        setExploreData(prev => ({
          gallery: { ...prev.gallery, ...(res.data.gallery || {}) },
          reels: { ...prev.reels, ...(res.data.reels || {}) },
          brandStatement: { ...prev.brandStatement, ...(res.data.brandStatement || {}) }
        }));
      }
      showToast('success', 'Explore page content & reel thumbnails updated!');
    } catch (err) {
      console.error('Save error:', err);
      showToast('error', 'Failed to save Explore page settings');
    } finally {
      setSaving(false);
    }
  };

  const handleAddReelVideo = () => {
    const newVideo = {
      id: Date.now(),
      title: 'New Reel Video',
      tag: 'CAMPUS MOMENT',
      src: '/videos/mhp_hero_video.mp4',
      thumbnail: '',
      visible: true,
      order: (exploreData.reels?.videos || []).length + 1
    };
    setExploreData(prev => ({
      ...prev,
      reels: {
        ...prev.reels,
        videos: [...(prev.reels?.videos || []), newVideo]
      }
    }));
  };

  const handleRemoveReelVideo = (id) => {
    setExploreData(prev => ({
      ...prev,
      reels: {
        ...prev.reels,
        videos: prev.reels.videos.filter(v => v.id !== id)
      }
    }));
  };

  const handleThumbnailUpload = async (idx, e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingThumbIdx(idx);
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data && res.data.imageUrl) {
        const updatedVids = [...(exploreData.reels?.videos || [])];
        updatedVids[idx] = { ...updatedVids[idx], thumbnail: res.data.imageUrl };
        setExploreData(prev => ({
          ...prev,
          reels: { ...prev.reels, videos: updatedVids }
        }));
        showToast('success', `Thumbnail uploaded for Reel #${idx + 1}!`);
      }
    } catch (err) {
      console.error('Thumbnail upload error:', err);
      showToast('error', 'Failed to upload thumbnail image');
    } finally {
      setUploadingThumbIdx(null);
    }
  };

  const handleRemoveThumbnail = (idx) => {
    const updatedVids = [...(exploreData.reels?.videos || [])];
    updatedVids[idx] = { ...updatedVids[idx], thumbnail: '' };
    setExploreData(prev => ({
      ...prev,
      reels: { ...prev.reels, videos: updatedVids }
    }));
    showToast('info', `Thumbnail removed for Reel #${idx + 1}`);
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
              <Compass className="w-4 h-4 text-[#F47B20]" />
              EXPLORE PAGE CONTROL
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#183A2A]">
              Explore Page & Media Showcase Manager
            </h1>
            <p className="text-xs text-[#7D967E] font-medium mt-0.5">
              Manage Editorial Gallery slots, Instagram post handles, Events & Memories vertical reel videos with thumbnails, and final brand statement.
            </p>
          </div>

          <MHPButton onClick={fetchExploreContent} variant="outline" size="sm">
            <RefreshCw className="w-3.5 h-3.5 text-[#183A2A]" />
            <span>Reload Content</span>
          </MHPButton>
        </div>
      </MHPCard>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Gallery Section Header & Instagram */}
        <MHPCard className="!p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#7D967E]/20 pb-4">
            <h2 className="text-base font-display font-extrabold text-[#183A2A] uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#F47B20]" />
              Gallery Headers & Instagram Settings
            </h2>
            <MHPBadge variant="orange">Editorial Masonry</MHPBadge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MHPInput
              label="Gallery Section Eyebrow"
              type="text"
              value={exploreData.gallery?.eyebrow || ''}
              onChange={(e) => setExploreData({
                ...exploreData,
                gallery: { ...exploreData.gallery, eyebrow: e.target.value }
              })}
            />

            <MHPInput
              label="Gallery Section Heading"
              type="text"
              value={exploreData.gallery?.heading || ''}
              onChange={(e) => setExploreData({
                ...exploreData,
                gallery: { ...exploreData.gallery, heading: e.target.value }
              })}
            />
          </div>

          <MHPInput
            label="Gallery Section Subtitle"
            type="text"
            value={exploreData.gallery?.subtitle || ''}
            onChange={(e) => setExploreData({
              ...exploreData,
              gallery: { ...exploreData.gallery, subtitle: e.target.value }
            })}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#7D967E]/20">
            <MHPInput
              label="Instagram Handle Reference"
              type="text"
              value={exploreData.gallery?.instagramHandle || ''}
              onChange={(e) => setExploreData({
                ...exploreData,
                gallery: { ...exploreData.gallery, instagramHandle: e.target.value }
              })}
            />

            <MHPInput
              label="Instagram Subtitle Label"
              type="text"
              value={exploreData.gallery?.instagramSub || ''}
              onChange={(e) => setExploreData({
                ...exploreData,
                gallery: { ...exploreData.gallery, instagramSub: e.target.value }
              })}
            />
          </div>
        </MHPCard>

        {/* 2. Gallery Slot Items */}
        <MHPCard className="!p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#7D967E]/20 pb-4">
            <h2 className="text-base font-display font-extrabold text-[#183A2A] uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#F47B20]" />
              Gallery Item Cards (5 Slots)
            </h2>
            <MHPBadge variant="default">Visual Cards</MHPBadge>
          </div>

          <div className="space-y-4">
            {(exploreData.gallery?.items || []).map((item, idx) => (
              <div key={item.id || idx} className="p-4 rounded-2xl border border-[#7D967E]/30 bg-[#FFF7E8]/40 space-y-3">
                <span className="text-xs font-black text-[#F47B20] uppercase tracking-wider block">
                  Gallery Slot #{idx + 1}
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <MHPInput
                    label="Item Title"
                    type="text"
                    value={item.title || ''}
                    onChange={(e) => {
                      const newItems = [...exploreData.gallery.items];
                      newItems[idx] = { ...newItems[idx], title: e.target.value };
                      setExploreData({ ...exploreData, gallery: { ...exploreData.gallery, items: newItems } });
                    }}
                  />

                  <MHPInput
                    label="Category Tag"
                    type="text"
                    value={item.category || ''}
                    onChange={(e) => {
                      const newItems = [...exploreData.gallery.items];
                      newItems[idx] = { ...newItems[idx], category: e.target.value };
                      setExploreData({ ...exploreData, gallery: { ...exploreData.gallery, items: newItems } });
                    }}
                  />

                  <MHPInput
                    label="Sub-caption / Badge"
                    type="text"
                    value={item.sub || ''}
                    onChange={(e) => {
                      const newItems = [...exploreData.gallery.items];
                      newItems[idx] = { ...newItems[idx], sub: e.target.value };
                      setExploreData({ ...exploreData, gallery: { ...exploreData.gallery, items: newItems } });
                    }}
                  />

                  <MHPInput
                    label="Image URL (Optional)"
                    type="text"
                    value={item.image || ''}
                    onChange={(e) => {
                      const newItems = [...exploreData.gallery.items];
                      newItems[idx] = { ...newItems[idx], image: e.target.value };
                      setExploreData({ ...exploreData, gallery: { ...exploreData.gallery, items: newItems } });
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </MHPCard>

        {/* 3. Events & Memories Reel Videos & Thumbnails */}
        <MHPCard className="!p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#7D967E]/20 pb-4">
            <div>
              <h2 className="text-base font-display font-extrabold text-[#183A2A] uppercase tracking-wider flex items-center gap-2">
                <Video className="w-4 h-4 text-[#F47B20]" />
                Events & Memories (Reels & Thumbnail Manager)
              </h2>
              <p className="text-xs text-[#7D967E]">Manage reel video headers, thumbnails, visibility, and display ordering</p>
            </div>
            <MHPButton type="button" onClick={handleAddReelVideo} variant="outline" size="sm">
              <Plus className="w-4 h-4" />
              <span>Add Reel Video</span>
            </MHPButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-[#7D967E]/20">
            <MHPInput
              label="Reels Section Eyebrow"
              type="text"
              value={exploreData.reels?.eyebrow || ''}
              onChange={(e) => setExploreData({
                ...exploreData,
                reels: { ...exploreData.reels, eyebrow: e.target.value }
              })}
            />

            <MHPInput
              label="Reels Section Heading"
              type="text"
              value={exploreData.reels?.heading || ''}
              onChange={(e) => setExploreData({
                ...exploreData,
                reels: { ...exploreData.reels, heading: e.target.value }
              })}
            />
          </div>

          <MHPInput
            label="Reels Section Subtitle"
            type="text"
            value={exploreData.reels?.subtitle || ''}
            onChange={(e) => setExploreData({
              ...exploreData,
              reels: { ...exploreData.reels, subtitle: e.target.value }
            })}
          />

          <div className="space-y-6 pt-2">
            {(exploreData.reels?.videos || []).map((video, idx) => (
              <div key={video.id || idx} className="p-5 rounded-2xl border border-[#7D967E]/30 bg-[#FFF7E8]/40 space-y-4">
                
                {/* Header Row */}
                <div className="flex items-center justify-between pb-2 border-b border-[#7D967E]/20">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-[#F47B20] uppercase tracking-wider">
                      Reel #{idx + 1}
                    </span>
                    
                    {/* Visibility Toggle */}
                    <button
                      type="button"
                      onClick={() => {
                        const newVids = [...exploreData.reels.videos];
                        newVids[idx] = { ...newVids[idx], visible: !(newVids[idx].visible !== false) };
                        setExploreData({ ...exploreData, reels: { ...exploreData.reels, videos: newVids } });
                      }}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold transition-all cursor-pointer ${
                        video.visible !== false
                          ? 'bg-[#183A2A] text-[#FFF7E8]'
                          : 'bg-rose-100 text-rose-700 border border-rose-300'
                      }`}
                    >
                      {video.visible !== false ? (
                        <>
                          <Eye className="w-3 h-3 text-[#F47B20]" />
                          <span>Visible</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          <span>Hidden</span>
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveReelVideo(video.id)}
                    className="text-rose-600 hover:text-rose-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Reel</span>
                  </button>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <MHPInput
                    label="Reel Title"
                    type="text"
                    value={video.title || ''}
                    onChange={(e) => {
                      const newVids = [...exploreData.reels.videos];
                      newVids[idx] = { ...newVids[idx], title: e.target.value };
                      setExploreData({ ...exploreData, reels: { ...exploreData.reels, videos: newVids } });
                    }}
                  />

                  <MHPInput
                    label="Tag Label"
                    type="text"
                    value={video.tag || ''}
                    onChange={(e) => {
                      const newVids = [...exploreData.reels.videos];
                      newVids[idx] = { ...newVids[idx], tag: e.target.value };
                      setExploreData({ ...exploreData, reels: { ...exploreData.reels, videos: newVids } });
                    }}
                  />

                  <MHPInput
                    label="Display Order"
                    type="number"
                    value={video.order !== undefined ? video.order : idx + 1}
                    onChange={(e) => {
                      const newVids = [...exploreData.reels.videos];
                      newVids[idx] = { ...newVids[idx], order: Number(e.target.value) || 0 };
                      setExploreData({ ...exploreData, reels: { ...exploreData.reels, videos: newVids } });
                    }}
                  />
                </div>

                <MHPInput
                  label="Video File Path / Link"
                  type="text"
                  value={video.src || ''}
                  onChange={(e) => {
                    const newVids = [...exploreData.reels.videos];
                    newVids[idx] = { ...newVids[idx], src: e.target.value };
                    setExploreData({ ...exploreData, reels: { ...exploreData.reels, videos: newVids } });
                  }}
                />

                {/* THUMBNAIL MANAGEMENT BOX */}
                <div className="p-4 rounded-xl bg-white border border-[#7D967E]/30 space-y-3">
                  <label className="text-xs font-extrabold text-[#183A2A] uppercase tracking-wider block">
                    Reel Thumbnail Poster Image
                  </label>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* Thumbnail Preview Window */}
                    <div className="w-24 h-36 rounded-xl bg-[#183A2A]/5 border border-[#7D967E]/30 overflow-hidden relative flex-shrink-0 flex items-center justify-center shadow-xs">
                      {video.thumbnail ? (
                        <img
                          src={getImageUrl(video.thumbnail)}
                          alt={`Thumbnail preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80';
                          }}
                        />
                      ) : (
                        <div className="text-center p-2 space-y-1">
                          <ImageIcon className="w-6 h-6 text-[#7D967E] mx-auto" />
                          <span className="text-[10px] text-[#7D967E] font-medium block">No Poster</span>
                        </div>
                      )}
                    </div>

                    {/* Actions & File Upload */}
                    <div className="space-y-2 flex-1 w-full">
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          id={`thumb-input-${idx}`}
                          className="hidden"
                          onChange={(e) => handleThumbnailUpload(idx, e)}
                        />

                        <label
                          htmlFor={`thumb-input-${idx}`}
                          className="px-3 py-1.5 rounded-xl bg-[#183A2A] hover:bg-[#204935] text-[#FFF7E8] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Upload className="w-3.5 h-3.5 text-[#F47B20]" />
                          <span>{uploadingThumbIdx === idx ? 'Uploading...' : video.thumbnail ? 'Replace Thumbnail' : 'Upload Thumbnail'}</span>
                        </label>

                        {video.thumbnail && (
                          <button
                            type="button"
                            onClick={() => handleRemoveThumbnail(idx)}
                            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Remove Thumbnail</span>
                          </button>
                        )}
                      </div>

                      <MHPInput
                        label="Thumbnail Image URL / Path"
                        type="text"
                        placeholder="/uploads/event-01-thumb.webp"
                        value={video.thumbnail || ''}
                        onChange={(e) => {
                          const newVids = [...exploreData.reels.videos];
                          newVids[idx] = { ...newVids[idx], thumbnail: e.target.value };
                          setExploreData({ ...exploreData, reels: { ...exploreData.reels, videos: newVids } });
                        }}
                      />
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </MHPCard>

        {/* 4. Final Brand Statement */}
        <MHPCard className="!p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#7D967E]/20 pb-4">
            <h2 className="text-base font-display font-extrabold text-[#183A2A] uppercase tracking-wider">
              Visual Climax & Final Brand Statement
            </h2>
            <MHPBadge variant="default">End Card Statement</MHPBadge>
          </div>

          <MHPInput
            label="Final Statement Heading *"
            type="text"
            required
            value={exploreData.brandStatement?.heading || ''}
            onChange={(e) => setExploreData({
              ...exploreData,
              brandStatement: { ...exploreData.brandStatement, heading: e.target.value }
            })}
          />

          <MHPInput
            label="Tagline / Subtext *"
            type="text"
            required
            value={exploreData.brandStatement?.tagline || ''}
            onChange={(e) => setExploreData({
              ...exploreData,
              brandStatement: { ...exploreData.brandStatement, tagline: e.target.value }
            })}
          />
        </MHPCard>

        <div className="flex justify-end">
          <MHPButton
            type="submit"
            loading={saving}
            variant="primary"
            size="lg"
          >
            <Save className="w-4 h-4" />
            <span>Save Explore Page Content</span>
          </MHPButton>
        </div>
      </form>
    </div>
  );
};

export default AdminExploreSettings;
