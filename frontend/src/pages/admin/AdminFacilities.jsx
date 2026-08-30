import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { UtensilsCrossed, Plus, Edit2, Trash2, X } from 'lucide-react';
import { MHPCard, MHPButton, MHPBadge, MHPInput, MHPTextarea } from '../../components/admin/MHPAdminComponents';

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
    <div className="space-y-6 pb-16 text-[#202522]">
      <MHPCard className="!p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-[#F47B20] uppercase tracking-widest mb-1">
              <UtensilsCrossed className="w-4 h-4 text-[#F47B20]" />
              FACILITIES & AMENITIES
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#183A2A]">
              Facilities & Infrastructure Cards
            </h1>
            <p className="text-xs text-[#7D967E] font-medium mt-0.5">
              Manage editable cards displayed on the About and Facilities pages
            </p>
          </div>

          <MHPButton onClick={() => handleOpenModal(null)} variant="primary" size="sm">
            <Plus className="w-4 h-4" />
            <span>Add Facility Card</span>
          </MHPButton>
        </div>
      </MHPCard>

      {loading ? (
        <LoadingSkeleton count={3} height="h-32" />
      ) : facilities.length === 0 ? (
        <MHPCard className="!p-12 text-center text-[#7D967E]">
          <UtensilsCrossed className="w-12 h-12 text-[#F47B20]/50 mx-auto mb-2" />
          <h3 className="text-base font-extrabold text-[#183A2A]">No facilities cards added</h3>
          <p className="text-xs text-[#7D967E] font-medium">Add facilities to showcase campus amenities.</p>
        </MHPCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {facilities.map((fac) => (
            <MHPCard key={fac._id} className="!p-5 space-y-4 hover:border-[#F47B20] transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2 border-b border-[#7D967E]/20 pb-3">
                  <h3 className="font-display font-extrabold text-lg text-[#183A2A]">{fac.title}</h3>
                  <MHPBadge variant="success">Active</MHPBadge>
                </div>
                <p className="text-xs text-[#202522]/80 font-medium leading-relaxed">
                  {fac.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#7D967E]/20 flex items-center justify-end gap-3">
                <button
                  onClick={() => handleOpenModal(fac)}
                  className="text-[#F47B20] font-extrabold text-xs flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(fac._id)}
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
                {editingId ? 'Edit Facility Card' : 'Add Facility Card'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-[#7D967E] hover:text-[#183A2A]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <MHPInput
                label="Facility Title *"
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

              <div className="pt-3 border-t border-[#7D967E]/20 flex justify-end gap-3">
                <MHPButton type="button" variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </MHPButton>
                <MHPButton type="submit" variant="primary">
                  Save Facility
                </MHPButton>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminFacilities;
