import React, { useState } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import ThreeDSpatialCard from '../components/common/ThreeDSpatialCard';
import { MessageSquare, Send, CheckCircle2 } from 'lucide-react';

const Feedback = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'Food Quality',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.post('/feedback', formData);
      setSubmitted(true);
      showToast('success', 'Feedback submitted successfully!');
    } catch (err) {
      console.error('Feedback submit error:', err);
      showToast('error', 'Failed to submit feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0D0B0C] text-[#F4ECE4] min-h-screen py-14 pb-32 space-y-12 preserve-3d">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
        <span className="text-xs font-extrabold text-[#C96F4F] uppercase tracking-widest block">STUDENT FEEDBACK</span>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-[#F4ECE4]">
          MHP <span className="text-[#C96F4F]">Community Voice</span>
        </h1>
        <p className="text-xs text-[#B9A9A2] max-w-xl mx-auto leading-relaxed font-medium">
          Share your suggestions and feedback on cafeteria food, dining cleanliness, or Synergy talent events.
        </p>
      </div>

      <div className="max-w-xl mx-auto px-4">
        <ThreeDSpatialCard depth={25} className="p-8 sm:p-10">
          {submitted ? (
            <div className="text-center space-y-4 py-6">
              <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
              <h2 className="font-display font-bold text-2xl text-[#F4ECE4]">Thank You For Your Feedback!</h2>
              <p className="text-xs text-[#B9A9A2]">Your input helps us improve MHP facilities and student experience.</p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', category: 'Food Quality', message: '' });
                }}
                className="btn-mhp-primary text-xs py-2.5 px-6"
              >
                Submit Another Response
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-[#B9A9A2] font-bold block mb-1">Your Name:</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                  className="w-full bg-[#0D0B0C] border border-[#3A1822] text-[#F4ECE4] rounded-xl p-3 font-medium focus:outline-none focus:border-[#C96F4F]"
                />
              </div>

              <div>
                <label className="text-[#B9A9A2] font-bold block mb-1">Email Address:</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="student@vignan.ac.in"
                  className="w-full bg-[#0D0B0C] border border-[#3A1822] text-[#F4ECE4] rounded-xl p-3 font-medium focus:outline-none focus:border-[#C96F4F]"
                />
              </div>

              <div>
                <label className="text-[#B9A9A2] font-bold block mb-1">Category:</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#0D0B0C] border border-[#3A1822] text-[#F4ECE4] rounded-xl p-3 font-bold focus:outline-none focus:border-[#C96F4F]"
                >
                  <option value="Food Quality">Food Quality & Taste</option>
                  <option value="Dining Hygiene">Dining Seating & Hygiene</option>
                  <option value="Parcel Takeaway">Parcel Pickup Experience</option>
                  <option value="Synergy Showcase">Synergy Talent Events</option>
                </select>
              </div>

              <div>
                <label className="text-[#B9A9A2] font-bold block mb-1">Your Feedback / Message:</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Write your feedback here..."
                  className="w-full bg-[#0D0B0C] border border-[#3A1822] text-[#F4ECE4] rounded-xl p-3 font-medium focus:outline-none focus:border-[#C96F4F]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-mhp-primary w-full text-xs font-bold py-3 mt-2"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Submitting...' : 'Submit Feedback'}</span>
              </button>
            </form>
          )}
        </ThreeDSpatialCard>
      </div>
    </div>
  );
};

export default Feedback;
