import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { UtensilsCrossed, Plus, Edit2, Trash2, X } from 'lucide-react';

const AdminFacilities = () => {
  const { showToast } = useToast();
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'Utensils',
    image: '',
    status: 'active'
  });

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/facilities');
      setFacilities(res.data);
    } catch (err) {
      console.error('Failed to load facilities:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (fac = null) => {
    if (fac) {
      setEditingId(fac._id);
      setFormData({
        title: fac.title,
        description: fac.description || '',
        icon: fac.icon || 'Utensils',
        image: fac.image || '',
        status: fac.status || 'active'
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        description: '',
        icon: 'Utensils',
        image: '',
        status: 'active'
      });
    }
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/facilities/${editingId}`, formData);
        showToast('success', 'Facility updated!');
      } else {
        await api.post('/facilities', formData);
        showToast('success', 'Facility added!');
      }
      setModalOpen(false);
      fetchFacilities();
    } catch (err) {
      console.error('Save facility error:', err);
      showToast('error', 'Failed to save');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete facility card?')) return;
    try {
      await api.delete(`/facilities/${id}`);
      showToast('success', 'Facility deleted');
      fetchFacilities();
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
            <UtensilsCrossed className="w-6 h-6 text-[#F4A62A]" />
            Facilities & Services Cards Manager
          </h1>
          <p className="text-xs text-[#BDB7AD] mt-1">Manage editable cards displayed on the About and Facilities pages</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="btn-mhp-primary px-4 py-2.5 text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Facility Card</span>
        </button>
      </div>

      {loading ? (
        <LoadingSkeleton count={2} />
      ) : facilities.length === 0 ? (
        <div className="mhp-card-dark p-12 text-center rounded-3xl border border-[#2E2A27] text-[#BDB7AD] text-sm">
          No facility cards created yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {facilities.map((fac) => (
            <div key={fac._id} className="mhp-card-dark p-6 rounded-2xl border border-[#2E2A27] hover:border-[#F4A62A]/40 space-y-3 shadow-lg">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-bold text-[#FFFDF8]">{fac.title}</h3>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleOpenModal(fac)} className="p-1.5 text-[#F4A62A]">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(fac._id)} className="p-1.5 text-rose-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-[#BDB7AD] leading-relaxed">{fac.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#131211]/80 backdrop-blur-md">
          <div className="max-w-lg w-full bg-[#1D1B19] border border-[#2E2A27] rounded-3xl p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#2E2A27] pb-3">
              <h2 className="text-lg font-bold text-[#FFFDF8]">{editingId ? 'Edit Card' : 'Add Facility Card'}</h2>
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
                  rows={3}
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
                  Save Facility
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminFacilities;
