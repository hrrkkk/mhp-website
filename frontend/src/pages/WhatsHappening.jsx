import React, { useEffect, useState } from 'react';
import api from '../services/api';
import LightboxModal from '../components/common/LightboxModal';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { Sparkles, Calendar, Tag, Filter } from 'lucide-react';

const WhatsHappening = () => {
  const [happenings, setHappenings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchHappenings();
  }, []);

  const fetchHappenings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/happenings');
      setHappenings(res.data);
    } catch (err) {
      console.error('Failed to load happenings:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'MHP Activity', 'Fest Activity', 'Food Launch', 'Special Stall', 'Notice'];

  const filteredHappenings = selectedCategory === 'All'
    ? happenings
    : happenings.filter(h => h.category === selectedCategory);

  return (
    <div className="space-y-12 pb-16">
      
      {/* Page Header */}
      <div className="pt-8 text-center space-y-4 max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F4A62A]/10 text-[#F4A62A] text-xs font-bold uppercase tracking-wider border border-[#F4A62A]/20">
          <Sparkles className="w-4 h-4" />
          Dynamic Feed
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#FFFDF8]">
          What's Happening at <span className="mhp-gradient-text">MHP</span>
        </h1>
        <p className="text-[#BDB7AD] text-sm sm:text-base">
          Real-time updates, Synergy talent showcase announcements, Vignan's Mahotsav stall updates, and campus activities near N Block.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none px-4">
        <Filter className="w-4 h-4 text-[#BDB7AD] mr-2 shrink-0 hidden sm:block" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-[#F4A62A] text-[#25221E] shadow-sm'
                : 'bg-[#171717] text-[#BDB7AD] hover:text-[#FFFDF8] border border-[#2E2A27]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Happenings List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <LoadingSkeleton count={3} />
        ) : filteredHappenings.length === 0 ? (
          <div className="mhp-card-dark p-12 text-center rounded-3xl border border-[#2E2A27] space-y-3 max-w-xl mx-auto">
            <Sparkles className="w-10 h-10 text-[#F4A62A]/50 mx-auto" />
            <h3 className="text-lg font-bold text-[#FFFDF8]">No Updates Published Yet</h3>
            <p className="text-xs text-[#BDB7AD]">
              Content will be updated by MHP administration. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredHappenings.map((item) => (
              <div
                key={item._id}
                onClick={() => setSelectedItem(item)}
                className="mhp-card-dark rounded-2xl overflow-hidden border border-[#2E2A27] hover:border-[#F4A62A]/40 transition-all cursor-pointer group flex flex-col justify-between shadow-lg"
              >
                {item.image && (
                  <div className="h-52 overflow-hidden relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-[#131211]/80 backdrop-blur-md text-[#F4A62A] border border-[#F4A62A]/30 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase">
                      {item.category}
                    </span>
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#BDB7AD] mb-2">
                      <Calendar className="w-3.5 h-3.5 text-[#F4A62A]" />
                      <span>{item.date} {item.time && `• ${item.time}`}</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#FFFDF8] group-hover:text-[#F4A62A] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[#BDB7AD] text-xs mt-2 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#2E2A27] text-xs font-bold text-[#F4A62A] flex items-center gap-1">
                    <span>View Details</span>
                    <Tag className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
        image={selectedItem}
      />
    </div>
  );
};

export default WhatsHappening;
