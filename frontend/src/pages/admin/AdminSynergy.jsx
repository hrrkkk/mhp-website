import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { Mic, Plus, Edit2, Trash2, X, Sparkles, CheckCircle2 } from 'lucide-react';

const AdminSynergy = () => {
  const { showToast } = useToast();
  const [synergyList, setSynergyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: 'Synergy Student Talent Stage',
    tagline: 'One Stage. Infinite Possibilities.',
    description: 'Synergy is a monthly MHP student talent showcase where students get a small stage to present their talents, creativity and passion.',
    talentTypes: ['Singing', 'Dancing', 'Instrumental', 'Poetry', 'Stand-Up Comedy', 'Art'],
    date: 'Monthly Showcase',
    time: 'Every Last Friday of the Month',
    status: 'published',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80'
  });

  useEffect(() => {
    fetchSynergy();
  }, []);

  const fetchSynergy = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/synergy');
      setSynergyList(res.data);
    } catch (err) {
      console.error('Failed to load Synergy showcase entries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingId(item._id);
      setFormData({
        title: item.title,
        tagline: item.tagline || 'One Stage. Infinite Possibilities.',
        description: item.description || '',
        talentTypes: item.talentTypes || ['Singing', 'Dancing', 'Poetry'],
        date: item.date || 'Monthly Showcase',
        time: item.time || '',
        status: item.status || 'published',
        image: item.image || ''
      });
    } else {
      setEditingId(null);
      setFormData({
        title: 'Synergy Student Talent Stage',
        tagline: 'One Stage. Infinite Possibilities.',
        description: 'Synergy is a monthly MHP student talent showcase where students get a small stage to present their talents, creativity and passion.',
        talentTypes: ['Singing', 'Dancing', 'Instrumental', 'Poetry', 'Stand-Up Comedy', 'Art'],
        date: 'Monthly Showcase',
        time: 'Every Last Friday of the Month',
        status: 'published',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80'
      });
    }
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/synergy/${editingId}`, formData);
        showToast('success', 'Synergy showcase updated!');
      } else {
        await api.post('/synergy', formData);
        showToast('success', 'Synergy entry created!');
      }
      setModalOpen(false);
      fetchSynergy();
    } catch (err) {
      console.error('Save error:', err);
      showToast('error', 'Failed to save Synergy item');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this Synergy showcase entry?')) return;
    try {
      await api.delete(`/synergy/${id}`);
      showToast('success', 'Synergy entry deleted');
      fetchSynergy();
    } catch (err) {
      console.error('Delete error:', err);
      showToast('error', 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#FFFDF8] flex items-center gap-2">
            <Mic className="w-6 h-6 text-[#F4A62A]" />
            Synergy Talent Showcase Manager
          </h1>
          <p className="text-xs text-[#BDB7AD] mt-1">Manage monthly student talent stage themes, talent categories, and performance dates</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="btn-mhp-primary px-4 py-2.5 text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Synergy Edition</span>
        </button>
      </div>

      {loading ? (
        <LoadingSkeleton count={2} />
      ) : synergyList.length === 0 ? (
        <div className="mhp-card-dark p-12 text-center rounded-3xl border border-[#2E2A27] text-[#BDB7AD] text-sm">
          No Synergy showcases created yet. Click "New Synergy Edition" to publish.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {synergyList.map((item) => (
            <div key={item._id} className="mhp-card-dark p-6 rounded-2xl border border-[#2E2A27] hover:border-[#F4A62A]/40 space-y-4 shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F4A62A]/20 text-[#F4A62A] text-[10px] font-bold uppercase border border-[#F4A62A]/30">
                    {item.status}
                  </span>
                  <h3 className="text-xl font-bold text-[#FFFDF8] mt-1">{item.title}</h3>
                  <p className="text-xs text-[#F4A62A] font-extrabold italic">{item.tagline}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleOpenModal(item)} className="p-2 rounded-lg bg-[#171717] text-[#F4A62A] border border-[#2E2A27]">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(item._id)} className="p-2 rounded-lg bg-rose-950/40 text-rose-300 border border-rose-900/50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-[#BDB7AD] leading-relaxed">{item.description}</p>

              <div className="pt-2 border-t border-[#2E2A27] flex items-center justify-between text-xs text-[#BDB7AD]">
                <span>Schedule: {item.time}</span>
                <span>Date: {item.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#131211]/80 backdrop-blur-md">
          <div className="max-w-xl w-full bg-[#1D1B19] border border-[#2E2A27] rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#2E2A27] pb-3">
              <h2 className="text-lg font-bold text-[#FFFDF8]">{editingId ? 'Edit Synergy Entry' : 'New Synergy Entry'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-[#BDB7AD] hover:text-[#FFFDF8]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#BDB7AD]">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#171717] border border-[#2E2A27] text-[#FFFDF8] text-xs focus:outline-none focus:border-[#F4A62A]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#BDB7AD]">Tagline *</label>
                <input
                  type="text"
                  required
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#171717] border border-[#2E2A27] text-[#F4A62A] font-bold text-xs focus:outline-none focus:border-[#F4A62A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#BDB7AD]">Showcase Date</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#171717] border border-[#2E2A27] text-[#FFFDF8] text-xs focus:outline-none focus:border-[#F4A62A]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#BDB7AD]">Schedule / Frequency</label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#171717] border border-[#2E2A27] text-[#FFFDF8] text-xs focus:outline-none focus:border-[#F4A62A]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#BDB7AD]">Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#171717] border border-[#2E2A27] text-[#FFFDF8] text-xs focus:outline-none focus:border-[#F4A62A]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#BDB7AD]">Description *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#171717] border border-[#2E2A27] text-[#FFFDF8] text-xs focus:outline-none focus:border-[#F4A62A]"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-[#2E2A27] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#22201D] text-[#BDB7AD] text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-mhp-primary px-6 py-2 text-xs"
                >
                  Save Showcase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminSynergy;
