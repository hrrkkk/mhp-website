import React, { useState } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { Star, Send, CheckCircle2, MessageSquare, HeartHandshake, Sparkles, User, Mail, Tag, ShieldCheck } from 'lucide-react';
import ThreeDLogoEmblem from '../components/common/ThreeDLogoEmblem';

const Feedback = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    category: 'Food Quality',
    message: ''
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const ratingLabels = {
    1: 'Poor',
    2: 'Needs Improvement',
    3: 'Average',
    4: 'Good',
    5: 'Excellent'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.message.trim()) {
      showToast('error', 'Please enter your feedback message.');
      return;
    }

    try {
      setSubmitting(true);
      // Send payload supporting backend API fields (comment and rating required)
      const payload = {
        name: formData.name.trim() || 'Anonymous Student',
        email: formData.email.trim(),
        rating: Number(formData.rating) || 5,
        category: formData.category,
        comment: formData.message.trim(),
        message: formData.message.trim()
      };

      await api.post('/feedback', payload);
      setSubmitted(true);
      showToast('success', 'Feedback submitted successfully!');
    } catch (err) {
      console.error('Feedback submit error:', err);
      const errMsg = err.response?.data?.error || err.response?.data?.message || 'Failed to submit feedback. Please try again.';
      showToast('error', errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FFF7E8] text-[#202522] min-h-screen selection:bg-[#F47B20] selection:text-white font-sans">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-24">
        
        {/* Main 2-Column Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: Page Opening & Brand Message */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
            
            <div className="space-y-4">
              {/* Small Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#183A2A]/5 border border-[#183A2A]/10 text-[#183A2A] text-xs font-extrabold tracking-widest uppercase">
                <MessageSquare className="w-3.5 h-3.5 text-[#F47B20]" />
                <span>YOUR VOICE MATTERS</span>
              </div>

              {/* Main Heading */}
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#183A2A] tracking-tight leading-[1.08]">
                SHARE YOUR <br className="hidden sm:inline" />
                <span className="text-[#F47B20]">MHP EXPERIENCE</span>
              </h1>

              {/* Supporting Text */}
              <p className="text-sm sm:text-base text-[#7D967E] font-medium leading-relaxed max-w-md pt-1">
                Tell us what you loved, what could be better, and what you'd like to see next at MHP.
              </p>
            </div>

            {/* Value Props & Impact Badges */}
            <div className="space-y-4 pt-2 border-t border-[#7D967E]/20">
              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/60 border border-[#7D967E]/20 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-[#183A2A]/10 text-[#183A2A] flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 text-[#F47B20]" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#183A2A]">Direct Impact</h4>
                  <p className="text-[11px] text-[#7D967E] font-medium mt-0.5">
                    Your suggestions directly influence our daily food menu, seating, and campus event schedules.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/60 border border-[#7D967E]/20 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-[#183A2A]/10 text-[#183A2A] flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4 text-[#F47B20]" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#183A2A]">Reviewed by Management</h4>
                  <p className="text-[11px] text-[#7D967E] font-medium mt-0.5">
                    Every piece of feedback is reviewed directly by the VFSTR MHP administrative team.
                  </p>
                </div>
              </div>
            </div>

            {/* Emotional Brand Element */}
            <div className="p-4 rounded-2xl bg-[#183A2A] text-[#FFF7E8] space-y-2 shadow-md">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#F47B20]">
                <HeartHandshake className="w-4 h-4" />
                <span>MHP COMMUNITY COMMITMENT</span>
              </div>
              <p className="text-xs text-[#FFF7E8]/90 font-medium leading-relaxed">
                "Every review helps us make MHP better."
              </p>
            </div>

          </div>

          {/* RIGHT COLUMN: Feedback Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-[#7D967E]/30 p-6 sm:p-10 shadow-xl transition-all duration-300">
              
              {submitted ? (
                /* SUCCESS STATE */
                <div className="text-center space-y-6 py-8">
                  <div className="w-16 h-16 rounded-full bg-[#183A2A]/10 text-[#F47B20] border border-[#F47B20]/30 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-8 h-8 text-[#F47B20]" />
                  </div>

                  <div className="space-y-2 max-w-sm mx-auto">
                    <h2 className="font-display font-extrabold text-3xl text-[#183A2A] uppercase tracking-tight">
                      THANK YOU.
                    </h2>
                    <p className="text-xs sm:text-sm text-[#7D967E] font-medium leading-relaxed">
                      Your feedback helps shape the MHP experience.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#7D967E]/20 max-w-xs mx-auto">
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: '', email: '', rating: 5, category: 'Food Quality', message: '' });
                      }}
                      className="w-full py-3 px-6 rounded-xl bg-[#F47B20] hover:bg-[#FF882E] text-white text-xs font-extrabold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Submit Another Response</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* FEEDBACK FORM */
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Section Title */}
                  <div className="border-b border-[#7D967E]/20 pb-4 flex items-center justify-between">
                    <h3 className="font-display font-extrabold text-lg text-[#183A2A] uppercase tracking-wider">
                      Feedback Form
                    </h3>
                    <ThreeDLogoEmblem size="small" interactive={false} />
                  </div>

                  {/* Rating Selector */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-extrabold text-[#183A2A] uppercase tracking-wider block">
                      Overall Experience Rating *
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 bg-[#FFF7E8] p-2 rounded-2xl border border-[#7D967E]/30">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const active = star <= (hoverRating || formData.rating);
                          return (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setFormData({ ...formData, rating: star })}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="p-1 rounded-lg transition-transform transform hover:scale-110 focus:outline-none cursor-pointer"
                              aria-label={`Rate ${star} stars out of 5`}
                            >
                              <Star
                                className={`w-6 h-6 transition-colors ${
                                  active
                                    ? 'text-[#F47B20] fill-[#F47B20]'
                                    : 'text-[#7D967E]/40 fill-transparent'
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>

                      <span className="text-xs font-extrabold text-[#183A2A] bg-[#183A2A]/5 px-3 py-1.5 rounded-xl border border-[#183A2A]/10">
                        {ratingLabels[hoverRating || formData.rating] || 'Select Rating'}
                      </span>
                    </div>
                  </div>

                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold text-[#183A2A] uppercase tracking-wider flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#F47B20]" />
                        <span>Your Name</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter full name (optional)"
                        className="w-full px-4 py-3 rounded-xl bg-[#FFF7E8]/50 border border-[#7D967E]/40 text-[#202522] text-xs font-medium placeholder-[#7D967E]/70 focus:outline-none focus:border-[#F47B20] focus:bg-white transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold text-[#183A2A] uppercase tracking-wider flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#F47B20]" />
                        <span>Email Address</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="student@vignan.ac.in"
                        className="w-full px-4 py-3 rounded-xl bg-[#FFF7E8]/50 border border-[#7D967E]/40 text-[#202522] text-xs font-medium placeholder-[#7D967E]/70 focus:outline-none focus:border-[#F47B20] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Category Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-[#183A2A] uppercase tracking-wider flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#F47B20]" />
                      <span>Feedback Category</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#FFF7E8]/50 border border-[#7D967E]/40 text-[#202522] text-xs font-bold focus:outline-none focus:border-[#F47B20] focus:bg-white transition-all cursor-pointer"
                    >
                      <option value="Food Quality">Food Quality & Taste</option>
                      <option value="Dining Hygiene">Dining Seating & Hygiene</option>
                      <option value="Parcel Takeaway">Parcel Pickup Experience</option>
                      <option value="Synergy Showcase">Synergy Talent Events</option>
                      <option value="General Suggestion">General Suggestion</option>
                    </select>
                  </div>

                  {/* Feedback Message */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-[#183A2A] uppercase tracking-wider block">
                      Your Feedback / Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us what you loved, what could be better, or what you'd like to see next at MHP..."
                      className="w-full px-4 py-3 rounded-xl bg-[#FFF7E8]/50 border border-[#7D967E]/40 text-[#202522] text-xs font-medium placeholder-[#7D967E]/70 focus:outline-none focus:border-[#F47B20] focus:bg-white transition-all leading-relaxed"
                    />
                  </div>

                  {/* Primary CTA Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#F47B20] hover:bg-[#FF882E] text-white text-xs font-extrabold uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'SUBMITTING FEEDBACK...' : 'SUBMIT FEEDBACK'}</span>
                  </button>

                  <p className="text-[11px] text-[#7D967E] text-center font-medium pt-1">
                    Every review helps us make MHP better.
                  </p>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Feedback;
