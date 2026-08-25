import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { MessageSquare, Star, CheckCircle, Archive, Filter } from 'lucide-react';

const AdminFeedback = () => {
  const { showToast } = useToast();
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/feedback');
      setFeedbackList(res.data);
    } catch (err) {
      console.error('Failed to load feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status, notes = '') => {
    try {
      await api.put(`/admin/feedback/${id}`, { status, adminNotes: notes });
      showToast('success', `Status updated to ${status}`);
      fetchFeedback();
    } catch (err) {
      console.error('Update error:', err);
      showToast('error', 'Failed to update status');
    }
  };

  const filtered = statusFilter === 'All'
    ? feedbackList
    : feedbackList.filter(f => f.status === statusFilter);

  return (
    <div className="space-y-6 pb-16">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#FFFDF8] flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-[#F4A62A]" />
            Customer Feedback Submissions
          </h1>
          <p className="text-xs text-[#BDB7AD] mt-1">Review ratings, categories, and student suggestions</p>
        </div>

        <div className="flex items-center gap-2">
          {['All', 'new', 'reviewed', 'archived'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                statusFilter === st ? 'bg-[#F4A62A] text-[#25221E] shadow-sm' : 'bg-[#171717] text-[#BDB7AD] border border-[#2E2A27] hover:text-[#FFFDF8]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} height="h-32" />
      ) : filtered.length === 0 ? (
        <div className="mhp-card-dark p-12 text-center rounded-3xl border border-[#2E2A27] text-[#BDB7AD] text-sm">
          No feedback submissions found.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div key={item._id} className="mhp-card-dark p-6 rounded-2xl border border-[#2E2A27] hover:border-[#F4A62A]/40 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#F4A62A]/20 text-[#F4A62A] font-bold text-[10px] uppercase border border-[#F4A62A]/30">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1 text-[#F4A62A] text-xs">
                    <Star className="w-3.5 h-3.5 fill-[#F4A62A]" />
                    <span className="font-bold">{item.rating} / 5</span>
                  </div>
                  <span className="text-xs text-[#BDB7AD]">By: {item.name || 'Anonymous Student'}</span>
                </div>
                
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                  item.status === 'new'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : item.status === 'reviewed'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-[#171717] text-[#BDB7AD] border border-[#2E2A27]'
                }`}>
                  {item.status}
                </span>
              </div>

              <p className="text-xs text-[#FFFDF8] leading-relaxed font-medium">"{item.comment}"</p>

              {(item.email || item.phone) && (
                <div className="text-[11px] text-[#BDB7AD]">
                  Contact Info (Internal): {item.email} {item.phone && `• ${item.phone}`}
                </div>
              )}

              <div className="pt-3 border-t border-[#2E2A27] flex items-center justify-between">
                <span className="text-[10px] text-[#6B645B]">Submitted: {item.createdAt?.split('T')[0]}</span>
                
                <div className="flex items-center gap-2">
                  {item.status !== 'reviewed' && (
                    <button
                      onClick={() => handleUpdateStatus(item._id, 'reviewed')}
                      className="px-3 py-1 rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-900/50 text-xs font-bold flex items-center gap-1 hover:bg-emerald-900/60"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Mark Reviewed
                    </button>
                  )}
                  {item.status !== 'archived' && (
                    <button
                      onClick={() => handleUpdateStatus(item._id, 'archived')}
                      className="px-3 py-1 rounded-lg bg-[#171717] text-[#BDB7AD] border border-[#2E2A27] text-xs font-bold flex items-center gap-1 hover:bg-[#22201D]"
                    >
                      <Archive className="w-3.5 h-3.5" />
                      Archive
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default AdminFeedback;
