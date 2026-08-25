import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { Sparkles, Plus, Edit2, Trash2, Check, X, Image as ImageIcon, Eye } from 'lucide-react';

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
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#FFFDF8] flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#F4A62A]" />
            What's Happening Posts Manager
          </h1>
          <p className="text-xs text-[#BDB7AD] mt-1">
            Publish dynamic updates, fest stalls, specials, and announcements to the customer feed
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="btn-mhp-primary px-4 py-2.5 text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Update Post</span>
        </button>
      </div>

      {/* List */}
      {loading ? (
        <LoadingSkeleton count={3} />
      ) : happenings.length === 0 ? (
        <div className="mhp-card-dark p-12 text-center rounded-3xl border border-[#2E2A27] text-[#BDB7AD] text-sm">
          No updates published yet. Click "New Update Post" to publish the first one!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {happenings.map((item) => (
            <div
              key={item._id}
              className="mhp-card-dark rounded-2xl overflow-hidden border border-[#2E2A27] hover:border-[#F4A62A]/40 flex flex-col justify-between shadow-lg"
            >
              {item.image && (
                <div className="h-44 overflow-hidden relative">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <span className={`absolute top-3 left-3 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                    item.status === 'published' ? 'bg-emerald-600 text-white' : 'bg-[#171717] text-[#BDB7AD]'
                  }`}>
                    {item.status}
                  </span>
                  {item.featured && (
                    <span className="absolute top-3 right-3 bg-[#F4A62A] text-[#25221E] text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">
                      Featured
                    </span>
                  )}
                </div>
              )}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-[#BDB7AD] mb-1">
                    <span className="text-[#F4A62A] font-bold">{item.category}</span>
                    <span>{item.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-[#FFFDF8] line-clamp-2">{item.title}</h3>
                  <p className="text-xs text-[#BDB7AD] mt-2 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#2E2A27]">
                  <button
                    onClick={() => handleOpenModal(item)}
                    className="px-3 py-1.5 rounded-lg bg-[#171717] text-[#F4A62A] border border-[#2E2A27] text-xs font-bold flex items-center gap-1.5 hover:bg-[#22201D]"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="px-3 py-1.5 rounded-lg bg-rose-950/40 text-rose-300 border border-rose-900/50 text-xs font-bold flex items-center gap-1.5 hover:bg-rose-900/50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#131211]/80 backdrop-blur-md">
          <div className="max-w-xl w-full bg-[#1D1B19] border border-[#2E2A27] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#2E2A27] pb-4">
              <h2 className="text-xl font-bold text-[#FFFDF8]">
                {editingId ? 'Edit Update Post' : 'Create New Update Post'}
              </h2>
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
                  className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#2E2A27] text-[#FFFDF8] text-xs focus:outline-none focus:border-[#F4A62A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#BDB7AD]">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#171717] border border-[#2E2A27] text-[#FFFDF8] text-xs focus:outline-none focus:border-[#F4A62A]"
                  >
                    <option value="MHP Update">MHP Update</option>
                    <option value="Fest Activity">Fest Activity</option>
                    <option value="Food Launch">Food Launch</option>
                    <option value="Special Stall">Special Stall</option>
                    <option value="Notice">Notice</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#BDB7AD]">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#171717] border border-[#2E2A27] text-[#FFFDF8] text-xs focus:outline-none focus:border-[#F4A62A]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#BDB7AD]">Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#2E2A27] text-[#FFFDF8] text-xs focus:outline-none focus:border-[#F4A62A]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#BDB7AD]">Description *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#2E2A27] text-[#FFFDF8] text-xs focus:outline-none focus:border-[#F4A62A]"
                ></textarea>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs text-[#BDB7AD] font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded text-[#F4A62A] focus:ring-0"
                  />
                  <span>Mark as Featured</span>
                </label>

                <div className="flex items-center gap-2">
                  <label className="text-xs text-[#BDB7AD] font-semibold">Publication Status:</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="px-3 py-1.5 rounded-lg bg-[#171717] border border-[#2E2A27] text-[#FFFDF8] text-xs"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-[#2E2A27] flex justify-end gap-3">
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
                  Save Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminHappenings;
