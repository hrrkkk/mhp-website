import React, { useEffect, useState } from 'react';
import api from '../services/api';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { Calendar, Clock, MapPin, Sparkles, X, Award, CheckCircle2, Mic, ArrowRight } from 'lucide-react';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [synergyList, setSynergyList] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const [evtRes, synRes] = await Promise.all([
        api.get('/events'),
        api.get('/synergy')
      ]);
      setEvents(evtRes.data);
      setSynergyList(synRes.data);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  const mahotsav = events.find(e => e.title.includes("Mahotsav")) || events[0];
  const filteredEvents = events.filter(e => e.status === activeTab);

  return (
    <div className="space-y-16 pb-16">
      
      {/* Page Header */}
      <div className="pt-8 text-center space-y-4 max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F4A62A]/10 text-[#F4A62A] text-xs font-bold uppercase tracking-wider border border-[#F4A62A]/20">
          <Calendar className="w-4 h-4" />
          MHP Events Hub
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#FFFDF8]">
          Campus <span className="mhp-gradient-text">Events & Festivals</span>
        </h1>
        <p className="text-[#BDB7AD] text-sm sm:text-base">
          From Vignan's Mahotsav National Festival to Synergy monthly open mic talent showcases at MHP.
        </p>
      </div>

      {/* ================= 1. HERO FEATURED EVENT: VIGNAN'S MAHOTSAV ================= */}
      {mahotsav && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mhp-card-dark rounded-3xl p-8 sm:p-12 border border-[#F4A62A]/40 relative overflow-hidden space-y-8 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#2E2A27] pb-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4A62A]/20 text-[#F4A62A] text-xs font-extrabold uppercase tracking-widest border border-[#F4A62A]/30 mb-2">
                  <Award className="w-4 h-4 text-[#F4A62A]" />
                  Featured Hero Event
                </div>
                <h2 className="text-4xl sm:text-5xl font-black text-[#FFFDF8] tracking-tight">
                  {mahotsav.title}
                </h2>
                <p className="text-[#F4A62A] font-bold text-lg mt-1">
                  {mahotsav.subtitle || "National Level Youth Festival"}
                </p>
              </div>
              
              <button
                onClick={() => setSelectedEvent(mahotsav)}
                className="btn-mhp-primary px-6 py-3 text-xs flex items-center gap-2"
              >
                <span>View Full Festival Guide</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <p className="text-[#BDB7AD] text-base leading-relaxed font-medium">
                  {mahotsav.description}
                </p>

                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold text-[#F4A62A] uppercase tracking-wider">
                    Festival Competitions & Celebrations:
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {(mahotsav.highlights || [
                      "Culture & Dance",
                      "Technical Talent",
                      "Sports Tournaments",
                      "Fine Arts",
                      "Literary Debates",
                      "Pro Nights & Celebrities"
                    ]).map((hl, idx) => (
                      <div key={idx} className="bg-[#171717] p-3 rounded-xl border border-[#2E2A27] flex items-center gap-2 text-[#FFFDF8]">
                        <CheckCircle2 className="w-4 h-4 text-[#F4A62A] shrink-0" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-xs text-[#BDB7AD] pt-2 border-t border-[#2E2A27]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#F4A62A]" />
                    <span>{mahotsav.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#F4A62A]" />
                    <span>{mahotsav.location}</span>
                  </div>
                </div>
              </div>

              {/* Festival Imagery Grid with Object-Fit Cover */}
              <div className="grid grid-cols-2 gap-4">
                <div className="h-48 sm:h-56 rounded-2xl overflow-hidden border border-[#2E2A27] shadow-md">
                  <img
                    src={mahotsav.image}
                    alt="Vignan Mahotsav Stage"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                {(mahotsav.secondaryImages || [
                  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
                  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
                  "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80"
                ]).map((img, idx) => (
                  <div key={idx} className="h-48 sm:h-56 rounded-2xl overflow-hidden border border-[#2E2A27] shadow-md">
                    <img
                      src={img}
                      alt={`Vignan Mahotsav ${idx + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 2. SYNERGY FEATURE HIGHLIGHT (Warm Cream Section) ================= */}
      <section className="bg-[#FFF7E8] py-12 text-[#25221E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mhp-card-light p-8 rounded-3xl border border-[#EFE4D2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D96B32]/10 text-[#D96B32] text-xs font-bold uppercase border border-[#D96B32]/30">
                <Mic className="w-3.5 h-3.5 text-[#D96B32]" />
                Recurring Monthly Talent Stage
              </div>
              <h3 className="text-2xl font-bold text-[#25221E]">SYNERGY — Student Talent Showcase</h3>
              <p className="text-xs text-[#6B645B]">
                "One Stage. Infinite Possibilities." Monthly platform for singing, dancing, poetry, stand-up comedy, instrumental music & public speaking at MHP stage near N Block.
              </p>
            </div>
            <div className="px-5 py-3 rounded-xl bg-[#FFFDF8] border border-[#EFE4D2] text-[#D96B32] text-xs font-bold shrink-0 shadow-2xs">
              Monthly Stage • Near N Block
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center border-b border-[#2E2A27]">
          <div className="flex gap-4">
            {['upcoming', 'ongoing', 'past'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-4 text-sm font-bold capitalize transition-all border-b-2 ${
                  activeTab === tab
                    ? 'border-[#F4A62A] text-[#F4A62A]'
                    : 'border-transparent text-[#BDB7AD] hover:text-[#FFFDF8]'
                }`}
              >
                {tab} Events
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <LoadingSkeleton count={2} height="h-64" />
        ) : filteredEvents.length === 0 ? (
          <div className="mhp-card-dark p-12 text-center rounded-3xl border border-[#2E2A27] space-y-2 max-w-lg mx-auto">
            <Calendar className="w-10 h-10 text-[#F4A62A]/50 mx-auto" />
            <h3 className="text-lg font-bold text-[#FFFDF8]">No {activeTab} events listed</h3>
            <p className="text-xs text-[#BDB7AD]">Check back soon for new MHP campus gatherings!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredEvents.map((evt) => (
              <div
                key={evt._id}
                onClick={() => setSelectedEvent(evt)}
                className="mhp-card-dark rounded-3xl overflow-hidden border border-[#2E2A27] hover:border-[#F4A62A]/40 transition-all cursor-pointer group flex flex-col sm:flex-row shadow-lg"
              >
                {evt.image && (
                  <div className="sm:w-2/5 h-56 sm:h-auto overflow-hidden relative shrink-0">
                    <img
                      src={evt.image}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {evt.featured && (
                      <span className="absolute top-3 left-3 bg-[#F4A62A] text-[#25221E] font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase">
                        Featured
                      </span>
                    )}
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#FFFDF8] group-hover:text-[#F4A62A] transition-colors leading-snug">
                      {evt.title}
                    </h3>
                    <p className="text-[#F4A62A] text-xs font-semibold mt-0.5">{evt.subtitle}</p>
                    <p className="text-[#BDB7AD] text-xs mt-2 leading-relaxed line-clamp-3">
                      {evt.shortDescription || evt.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-[#2E2A27] text-xs text-[#BDB7AD]">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#F4A62A] shrink-0" />
                      <span>{evt.date} • {evt.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#F4A62A] shrink-0" />
                      <span>{evt.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#131211]/90 backdrop-blur-md animate-fadeIn">
          <div className="max-w-2xl w-full bg-[#1D1B19] border border-[#2E2A27] rounded-3xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#171717]/80 text-[#BDB7AD] hover:text-[#FFFDF8] border border-[#2E2A27] z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {selectedEvent.image && (
              <div className="h-64 overflow-hidden relative shrink-0">
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
              <span className="px-3 py-1 bg-[#F4A62A]/20 text-[#F4A62A] border border-[#F4A62A]/30 text-xs font-bold rounded-full uppercase">
                {selectedEvent.status} Event
              </span>
              <h2 className="text-3xl font-bold text-[#FFFDF8]">{selectedEvent.title}</h2>
              {selectedEvent.subtitle && (
                <p className="text-[#F4A62A] font-semibold text-sm">{selectedEvent.subtitle}</p>
              )}

              <div className="flex flex-wrap gap-4 text-xs text-[#BDB7AD] py-2 border-y border-[#2E2A27]">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#F4A62A]" />
                  <span>{selectedEvent.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#F4A62A]" />
                  <span>{selectedEvent.time}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#F4A62A]" />
                  <span>{selectedEvent.location}</span>
                </div>
              </div>

              <p className="text-[#BDB7AD] text-sm leading-relaxed whitespace-pre-line">
                {selectedEvent.description || selectedEvent.shortDescription}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Events;
