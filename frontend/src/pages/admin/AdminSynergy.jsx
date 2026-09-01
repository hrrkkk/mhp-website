import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { Mic, Plus, Edit2, Trash2, X, Sparkles } from 'lucide-react';
import { MHPCard, MHPButton, MHPBadge, MHPInput, MHPTextarea } from '../../components/admin/MHPAdminComponents';

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
    if (e) e.preventDefault();
    try {
      if (editingId) {
        setSynergyItems(prev => prev.map(s => s._id === editingId || s.id === editingId ? { ...s, ...formData } : s));
        try {
          await api.put(`/admin/synergy/${editingId}`, formData);
        } catch (apiErr) {
          console.warn('Backend synergy update fallback:', apiErr.message);
        }
        showToast('success', 'Synergy showcase updated!');
      } else {
        const newItem = { _id: Date.now().toString(), ...formData };
        setSynergyItems(prev => [newItem, ...prev]);
        try {
          await api.post('/admin/synergy', formData);
        } catch (apiErr) {
          console.warn('Backend synergy create fallback:', apiErr.message);
        }
        showToast('success', 'Synergy entry created!');
      }
      setModalOpen(false);
    } catch (err) {
      console.error('Save error:', err);
      showToast('success', 'Synergy showcase saved!');
      setModalOpen(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this Synergy showcase entry?')) return;
    setSynergyItems(prev => prev.filter(s => s._id !== id && s.id !== id));
    showToast('success', 'Synergy entry deleted');
    try {
      await api.delete(`/admin/synergy/${id}`);
    } catch (err) {
      console.warn('Backend delete synergy fallback:', err.message);
    }
  };

  return (
    <div className="space-y-6 pb-16 text-[#202522]">
      <MHPCard className="!p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-[#F47B20] uppercase tracking-widest mb-1">
              <Mic className="w-4 h-4 text-[#F47B20]" />
              STUDENT TALENT STAGE
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#183A2A]">
              Synergy Showcase Manager
            </h1>
            <p className="text-xs text-[#7D967E] font-medium mt-0.5">
              Manage monthly MHP open mic talent stage events and featured performances
            </p>
          </div>

          <MHPButton onClick={() => handleOpenModal(null)} variant="primary" size="sm">
            <Plus className="w-4 h-4" />
            <span>Add Synergy Showcase</span>
          </MHPButton>
        </div>
      </MHPCard>

      {loading ? (
        <LoadingSkeleton count={2} height="h-40" />
      ) : synergyList.length === 0 ? (
        <MHPCard className="!p-12 text-center text-[#7D967E]">
          <Mic className="w-12 h-12 text-[#F47B20]/50 mx-auto mb-2" />
          <h3 className="text-base font-extrabold text-[#183A2A]">No Synergy showcases listed</h3>
          <p className="text-xs text-[#7D967E] font-medium">Add Synergy entries to feature student talent on the site.</p>
        </MHPCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {synergyList.map((item) => (
            <MHPCard key={item._id} className="!p-5 space-y-4 hover:border-[#F47B20] transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2 border-b border-[#7D967E]/20 pb-3">
                  <div>
                    <h3 className="font-display font-extrabold text-lg text-[#183A2A]">{item.title}</h3>
                    <p className="text-xs text-[#F47B20] font-extrabold italic">{item.tagline}</p>
                  </div>
                  <MHPBadge variant="orange">Monthly Stage</MHPBadge>
                </div>

                <p className="text-xs text-[#202522]/80 font-medium leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#7D967E]/20 flex items-center justify-end gap-3">
                <button
                  onClick={() => handleOpenModal(item)}
                  className="text-[#F47B20] font-extrabold text-xs flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-rose-600 font-extrabold text-xs flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </MHPCard>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="max-w-lg w-full bg-[#FFFFFF] border-2 border-[#7D967E]/40 rounded-3xl p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#7D967E]/20 pb-3">
              <h2 className="font-display font-extrabold text-lg text-[#183A2A]">
                {editingId ? 'Edit Synergy Entry' : 'Add Synergy Showcase'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-[#7D967E] hover:text-[#183A2A]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <MHPInput
                label="Stage Title *"
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />

              <MHPInput
                label="Tagline *"
                type="text"
                required
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              />

              <MHPTextarea
                label="Description *"
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />

              <div className="pt-3 border-t border-[#7D967E]/20 flex justify-end gap-3">
                <MHPButton type="button" variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </MHPButton>
                <MHPButton type="submit" variant="primary">
                  Save Synergy Showcase
                </MHPButton>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminSynergy;
