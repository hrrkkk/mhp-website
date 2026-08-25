import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { Calendar, Plus, Edit2, Trash2, X, Clock, MapPin } from 'lucide-react';

const AdminEvents = () => {
  const { showToast } = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    image: '',
    date: new Date().toISOString().split('T')[0],
    time: '05:00 PM',
    location: 'MHP Open Plaza, VFSTR Campus',
    status: 'upcoming',
    featured: true,
    published: true
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/events');
      setEvents(res.data);
    } catch (err) {
      console.error('Failed to load admin events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (evt = null) => {
    if (evt) {
      setEditingId(evt._id);
      setFormData({
        title: evt.title,
        shortDescription: evt.shortDescription || '',
        description: evt.description || '',
        image: evt.image || '',
        date: evt.date || new Date().toISOString().split('T')[0],
        time: evt.time || '',
        location: evt.location || 'MHP Open Plaza, VFSTR Campus',
        status: evt.status || 'upcoming',
        featured: Boolean(evt.featured),
        published: evt.published !== false
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        shortDescription: '',
        description: '',
        image: '',
        date: new Date().toISOString().split('T')[0],
        time: '05:00 PM',
        location: 'MHP Open Plaza, VFSTR Campus',
        status: 'upcoming',
        featured: true,
        published: true
      });
    }
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/events/${editingId}`, formData);
        showToast('success', 'Event updated!');
      } else {
        await api.post('/events', formData);
        showToast('success', 'Event created!');
      }
      setModalOpen(false);
      fetchEvents();
    } catch (err) {
      console.error('Save event error:', err);
      showToast('error', 'Failed to save event');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await api.delete(`/events/${id}`);
      showToast('success', 'Event deleted');
      fetchEvents();
    } catch (err) {
      console.error('Delete event error:', err);
      showToast('error', 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#FFFDF8] flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#F4A62A]" />
            Events Management
          </h1>
          <p className="text-xs text-[#BDB7AD] mt-1">Manage upcoming, ongoing, and past campus events at MHP</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="btn-mhp-primary px-4 py-2.5 text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Event</span>
        </button>
      </div>

      {loading ? (
        <LoadingSkeleton count={2} height="h-48" />
      ) : events.length === 0 ? (
        <div className="mhp-card-dark p-12 text-center rounded-3xl border border-[#2E2A27] text-[#BDB7AD] text-sm">
          No events created yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((evt) => (
            <div key={evt._id} className="mhp-card-dark p-6 rounded-2xl border border-[#2E2A27] hover:border-[#F4A62A]/40 space-y-4 shadow-lg">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F4A62A]/20 text-[#F4A62A] text-[10px] font-bold uppercase">
                    {evt.status}
                  </span>
                  <h3 className="text-lg font-bold text-[#FFFDF8] mt-1">{evt.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenModal(evt)}
                    className="p-2 rounded-lg bg-[#171717] text-[#F4A62A] border border-[#2E2A27]"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(evt._id)}
                    className="p-2 rounded-lg bg-rose-950/40 text-rose-300 border border-rose-900/50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-[#BDB7AD] line-clamp-2 leading-relaxed">{evt.shortDescription || evt.description}</p>

              <div className="text-xs text-[#BDB7AD] space-y-1 pt-2 border-t border-[#2E2A27]">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#F4A62A]" />
                  <span>{evt.date} • {evt.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#F4A62A]" />
                  <span>{evt.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#131211]/80 backdrop-blur-md">
          <div className="max-w-xl w-full bg-[#1D1B19] border border-[#2E2A27] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#2E2A27] pb-4">
              <h2 className="text-xl font-bold text-[#FFFDF8]">{editingId ? 'Edit Event' : 'Create Event'}</h2>
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
                  className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#2E2A27] text-[#FFFDF8] text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#BDB7AD]">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#171717] border border-[#2E2A27] text-[#FFFDF8] text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#BDB7AD]">Time</label>
                  <input
                    type="text"
                    placeholder="05:00 PM"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#171717] border border-[#2E2A27] text-[#FFFDF8] text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#BDB7AD]">Location / Venue</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#2E2A27] text-[#FFFDF8] text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#BDB7AD]">Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#2E2A27] text-[#FFFDF8] text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#BDB7AD]">Short Description</label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#2E2A27] text-[#FFFDF8] text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#BDB7AD]">Full Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#2E2A27] text-[#FFFDF8] text-xs"
                ></textarea>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-[#BDB7AD] font-semibold">Status:</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="px-3 py-1.5 rounded-lg bg-[#171717] border border-[#2E2A27] text-[#FFFDF8] text-xs"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="past">Past</option>
                  </select>
                </div>

                <label className="flex items-center gap-2 text-xs text-[#BDB7AD] font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  />
                  <span>Featured</span>
                </label>
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
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminEvents;
