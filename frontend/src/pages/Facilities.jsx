import React, { useEffect, useState } from 'react';
import api from '../services/api';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import ThreeDSpatialCard from '../components/common/ThreeDSpatialCard';
import { getImageUrl } from '../utils/imageUtils';
import { UtensilsCrossed, Users, Sparkles, Coffee, ShieldCheck } from 'lucide-react';

const Facilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const res = await api.get('/facilities');
      setFacilities(res.data);
    } catch (err) {
      console.error('Failed to fetch facilities:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0D0B0C] text-[#F4ECE4] min-h-screen py-14 pb-32 space-y-12 preserve-3d">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
        <span className="text-xs font-extrabold text-[#C96F4F] uppercase tracking-widest block">CAMPUS AMENITIES</span>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-[#F4ECE4]">
          MHP <span className="text-[#C96F4F]">Facilities & Services</span>
        </h1>
        <p className="text-xs text-[#B9A9A2] max-w-xl mx-auto leading-relaxed font-medium">
          Comprehensive cafeteria facilities, dining seating, and activity infrastructure at VFSTR Vadlamudi.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <LoadingSkeleton count={4} />
        ) : facilities.length === 0 ? (
          <div className="bg-[#171315] p-10 text-center rounded-3xl border border-[#3A1822] space-y-2 max-w-md mx-auto">
            <UtensilsCrossed className="w-8 h-8 text-[#C96F4F] mx-auto" />
            <h3 className="font-display font-bold text-base text-[#F4ECE4]">Facilities Loaded</h3>
            <p className="text-xs text-[#B9A9A2]">Official MHP campus infrastructure list.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {facilities.map((fac) => (
              <ThreeDSpatialCard
                key={fac._id}
                depth={25}
                className="p-6 space-y-4 flex flex-col justify-between"
              >
                <div className="flex items-start gap-4">
                  {fac.image ? (
                    <img
                      src={getImageUrl(fac.image)}
                      alt={fac.title}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-[#3A1822] shadow-md"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-[#3A1822] text-[#C96F4F] flex items-center justify-center shrink-0 border border-[#3A1822] shadow-md">
                      <UtensilsCrossed className="w-6 h-6" />
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <h3 className="font-display font-bold text-xl text-[#F4ECE4]">{fac.title}</h3>
                    <p className="text-xs text-[#B9A9A2] leading-relaxed">{fac.description}</p>
                  </div>
                </div>
              </ThreeDSpatialCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Facilities;
