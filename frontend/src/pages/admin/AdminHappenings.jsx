import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { Sparkles, Plus, Edit2, Trash2, Check, X, Image as ImageIcon } from 'lucide-react';
import { MHPCard, MHPButton, MHPBadge, MHPInput, MHPTextarea } from '../../components/admin/MHPAdminComponents';

const AdminHappenings = () => {
  const { showToast } = useToast();
  const [happenings, setHappenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    category: 'MHP Update',
    date: new Date().toISOString().split('T')[0],
    time: '',
    status: 'published',
    featured: false
  });

  useEffect(() => {
    fetchHappenings();
  }, []);

  const fetchHappenings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/happenings');
      setHappenings(res.data);
    } catch (err) {
      console.error('Failed to load happenings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingId(item._id);
      setFormData({
        title: item.title,
        description: item.description,
        image: item.image || '',
        category: item.category || 'MHP Update',
        date: item.date || new Date().toISOString().split('T')[0],
        time: item.time || '',
        status: item.status || 'published',
        featured: Boolean(item.featured)
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        description: '',
        image: '',
        category: 'MHP Update',
        date: new Date().toISOString().split('T')[0],
        time: '',
        status: 'published',
        featured: false
      });
    }
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/happenings/${editingId}`, formData);
        showToast('success', 'Update saved successfully!');
      } else {
        await api.post('/happenings', formData);
        showToast('success', 'New update created!');
      }
      setModalOpen(false);
      fetchHappenings();
    } catch (err) {
      console.error('Save happening error:', err);
      showToast('error', 'Failed to save item');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this update?')) return;
    try {
      await api.delete(`/happenings/${id}`);
      showToast('success', 'Update deleted successfully');
      fetchHappenings();
    } catch (err) {
      console.error('Delete error:', err);
      showToast('error', 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6 pb-16 text-[#202522]">
      <MHPCard className="!p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-[#F47B20] uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4 text-[#F47B20]" />
              CAMPUS UPDATES & ANNOUNCEMENTS
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#183A2A]">
              What's Happening Manager
            </h1>
            <p className="text-xs text-[#7D967E] font-medium mt-0.5">
              Post real-time news, specials, and campus updates to the website ticker
            </p>
          </div>

          <MHPButton onClick={() => handleOpenModal(null)} variant="primary" size="sm">
            <Plus className="w-4 h-4" />
            <span>Add Campus Update</span>
          </MHPButton>
        </div>
      </MHPCard>

      {loading ? (
        <LoadingSkeleton count={3} height="h-32" />
      ) : happenings.length === 0 ? (
        <MHPCard className="!p-12 text-center text-[#7D967E]">
          <Sparkles className="w-12 h-12 text-[#F47B20]/50 mx-auto mb-2" />
          <h3 className="text-base font-extrabold text-[#183A2A]">No campus updates posted</h3>
          <p className="text-xs text-[#7D967E] font-medium">Add updates to broadcast news on the site.</p>
        </MHPCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {happenings.map((item) => (
            <MHPCard key={item._id} className="!p-5 space-y-4 hover:border-[#F47B20] transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2 border-b border-[#7D967E]/20 pb-3">
                  <div>
                    <span className="text-[10px] font-extrabold text-[#F47B20] uppercase tracking-widest block">{item.category}</span>
                    <h3 className="font-display font-extrabold text-lg text-[#183A2A]">{item.title}</h3>
                  </div>
                  <MHPBadge variant="success">Published</MHPBadge>
                </div>

                <p className="text-xs text-[#202522]/80 font-medium leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#7D967E]/20 flex items-center justify-between">
                <span className="text-[11px] text-[#7D967E] font-medium">{item.date}</span>
                <div className="flex items-center gap-3">
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
                {editingId ? 'Edit Update' : 'Add Campus Update'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-[#7D967E] hover:text-[#183A2A]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <MHPInput
                label="Update Title *"
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />

              <MHPTextarea
                label="Description *"
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />

              <MHPInput
                label="Image URL"
                type="text"
                placeholder="https://..."
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />

              <div className="pt-3 border-t border-[#7D967E]/20 flex justify-end gap-3">
                <MHPButton type="button" variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </MHPButton>
                <MHPButton type="submit" variant="primary">
                  Save Update
                </MHPButton>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminHappenings;
