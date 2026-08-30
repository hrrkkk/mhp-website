import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { MessageSquare, Star, CheckCircle, Archive, Filter } from 'lucide-react';
import { MHPCard, MHPButton, MHPBadge } from '../../components/admin/MHPAdminComponents';

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
    <div className="space-y-6 pb-16 text-[#202522]">
      <MHPCard className="!p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-[#F47B20] uppercase tracking-widest mb-1">
              <MessageSquare className="w-4 h-4 text-[#F47B20]" />
              FEEDBACK & REVIEWS
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#183A2A]">
              Customer Feedback Submissions
            </h1>
            <p className="text-xs text-[#7D967E] font-medium mt-0.5">
              Review ratings, category feedback, and student suggestions
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#FFF7E8] p-1 rounded-xl border border-[#7D967E]/30">
            {['All', 'new', 'reviewed', 'archived'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold capitalize transition-all cursor-pointer ${
                  statusFilter === st ? 'bg-[#F47B20] text-white shadow-xs' : 'text-[#7D967E] hover:text-[#183A2A]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </MHPCard>

      {loading ? (
        <LoadingSkeleton count={3} height="h-32" />
      ) : filtered.length === 0 ? (
        <MHPCard className="!p-12 text-center text-[#7D967E]">
          <MessageSquare className="w-12 h-12 text-[#F47B20]/50 mx-auto mb-2" />
          <h3 className="text-base font-extrabold text-[#183A2A]">No feedback submissions found</h3>
          <p className="text-xs text-[#7D967E] font-medium">Customer reviews submitted on the site will appear here.</p>
        </MHPCard>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <MHPCard key={item._id} className="!p-6 space-y-3 hover:border-[#F47B20] transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#7D967E]/20 pb-3">
                <div className="flex items-center gap-3">
                  <MHPBadge variant="orange">{item.category}</MHPBadge>
                  <div className="flex items-center gap-1 text-[#F47B20] text-xs font-black">
                    <Star className="w-3.5 h-3.5 fill-[#F47B20]" />
                    <span>{item.rating} / 5</span>
                  </div>
                  <span className="text-xs text-[#7D967E] font-semibold">By: {item.name || 'Anonymous Student'}</span>
                </div>
                
                <MHPBadge variant={item.status === 'new' ? 'danger' : item.status === 'reviewed' ? 'success' : 'default'}>
                  {item.status}
                </MHPBadge>
              </div>

              <p className="text-xs sm:text-sm text-[#202522] font-medium leading-relaxed">
                "{item.message}"
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-[#7D967E]/20">
                <span className="text-[11px] text-[#7D967E] font-medium">
                  Submitted: {new Date(item.createdAt).toLocaleString()}
                </span>

                <div className="flex items-center gap-2">
                  {item.status !== 'reviewed' && (
                    <MHPButton
                      onClick={() => handleUpdateStatus(item._id, 'reviewed')}
                      variant="primary"
                      size="sm"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Mark Reviewed</span>
                    </MHPButton>
                  )}
                  {item.status !== 'archived' && (
                    <MHPButton
                      onClick={() => handleUpdateStatus(item._id, 'archived')}
                      variant="ghost"
                      size="sm"
                    >
                      <Archive className="w-3.5 h-3.5 text-[#7D967E]" />
                      <span>Archive</span>
                    </MHPButton>
                  )}
                </div>
              </div>
            </MHPCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminFeedback;
