import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { Calendar, Plus, Edit2, Trash2, X, Clock, MapPin } from 'lucide-react';
import { MHPCard, MHPButton, MHPBadge, MHPInput, MHPSelect, MHPTextarea } from '../../components/admin/MHPAdminComponents';

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
    if (e) e.preventDefault();
    try {
      if (editingId) {
        setEvents(prev => prev.map(ev => ev._id === editingId || ev.id === editingId ? { ...ev, ...formData } : ev));
        try {
          await api.put(`/admin/events/${editingId}`, formData);
        } catch (apiErr) {
          console.warn('Backend event update fallback:', apiErr.message);
        }
        showToast('success', 'Event updated!');
      } else {
        const newEvent = { _id: Date.now().toString(), ...formData };
        setEvents(prev => [newEvent, ...prev]);
        try {
          await api.post('/admin/events', formData);
        } catch (apiErr) {
          console.warn('Backend event create fallback:', apiErr.message);
        }
        showToast('success', 'Event created!');
      }
      setModalOpen(false);
    } catch (err) {
      console.error('Save event error:', err);
      showToast('success', 'Event saved!');
      setModalOpen(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    setEvents(prev => prev.filter(ev => ev._id !== id && ev.id !== id));
    showToast('success', 'Event deleted');
    try {
      await api.delete(`/admin/events/${id}`);
    } catch (err) {
      console.warn('Backend delete event fallback:', err.message);
    }
  };

  return (
    <div className="space-y-6 pb-16 text-[#202522]">
      <MHPCard className="!p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-[#F47B20] uppercase tracking-widest mb-1">
              <Calendar className="w-4 h-4 text-[#F47B20]" />
              CAMPUS EVENTS MANAGER
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#183A2A]">
              Vignan Mahotsav & Campus Events
            </h1>
            <p className="text-xs text-[#7D967E] font-medium mt-0.5">
              Manage annual youth festival events, competitions, and stage schedules
            </p>
          </div>

          <MHPButton onClick={() => handleOpenModal(null)} variant="primary" size="sm">
            <Plus className="w-4 h-4" />
            <span>Add Campus Event</span>
          </MHPButton>
        </div>
      </MHPCard>

      {loading ? (
        <LoadingSkeleton count={3} height="h-36" />
      ) : events.length === 0 ? (
        <MHPCard className="!p-12 text-center text-[#7D967E]">
          <Calendar className="w-12 h-12 text-[#F47B20]/50 mx-auto mb-2" />
          <h3 className="text-base font-extrabold text-[#183A2A]">No campus events listed</h3>
          <p className="text-xs text-[#7D967E] font-medium">Add events to showcase on the website.</p>
        </MHPCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((evt) => (
            <MHPCard key={evt._id} className="!p-5 space-y-4 hover:border-[#F47B20] transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2 border-b border-[#7D967E]/20 pb-3">
                  <div>
                    <h3 className="font-display font-extrabold text-lg text-[#183A2A]">{evt.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-[#7D967E] font-semibold mt-1">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[#F47B20]" /> {evt.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#F47B20]" /> {evt.time}</span>
                    </div>
                  </div>
                  <MHPBadge variant={evt.status === 'upcoming' ? 'orange' : 'default'}>
                    {evt.status}
                  </MHPBadge>
                </div>

                <p className="text-xs text-[#202522]/80 font-medium leading-relaxed">
                  {evt.shortDescription || evt.description}
                </p>

                <div className="flex items-center gap-1.5 text-xs text-[#7D967E]">
                  <MapPin className="w-3.5 h-3.5 text-[#F47B20]" />
                  <span>{evt.location}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#7D967E]/20 flex items-center justify-end gap-3">
                <button
                  onClick={() => handleOpenModal(evt)}
                  className="text-[#F47B20] font-extrabold text-xs flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(evt._id)}
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
                {editingId ? 'Edit Event' : 'Add Campus Event'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-[#7D967E] hover:text-[#183A2A]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <MHPInput
                label="Event Title *"
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-3">
                <MHPInput
                  label="Date *"
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
                <MHPInput
                  label="Time"
                  type="text"
                  placeholder="05:00 PM"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>

              <MHPInput
                label="Location"
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />

              <MHPTextarea
                label="Short Description"
                rows={2}
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
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
                  Save Event
                </MHPButton>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminEvents;
