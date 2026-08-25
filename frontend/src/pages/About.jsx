import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ThreeDSpatialCard from '../components/common/ThreeDSpatialCard';
import ThreeDLogoEmblem from '../components/common/ThreeDLogoEmblem';
import { getImageUrl } from '../utils/imageUtils';
import { 
  Sparkles, 
  MapPin, 
  Users, 
  Clock, 
  Mic, 
  HeartHandshake,
  CheckCircle2,
  UtensilsCrossed
} from 'lucide-react';

const About = () => {
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
    <div className="bg-[#0D0B0C] text-[#F4ECE4] min-h-screen py-14 pb-32 space-y-16 preserve-3d">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Editorial Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#171315] text-[#C96F4F] text-xs font-bold border border-[#3A1822]">
            <Sparkles className="w-3.5 h-3.5 text-[#C96F4F]" />
            Official Campus Landmark
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-6xl text-[#F4ECE4]">
            About <span className="text-[#C96F4F]">MHP Cafeteria</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#B9A9A2] leading-relaxed">
            The Most Happening Place (MHP) is the primary on-campus dining, social, and student activity hub at VFSTR Campus, Vadlamudi.
          </p>
        </div>

        {/* Content Section */}
        <ThreeDSpatialCard depth={25} className="p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-3">
                <ThreeDLogoEmblem size="medium" />
                <div>
                  <h2 className="font-display font-bold text-3xl text-[#F4ECE4]">The Heartbeat of Campus</h2>
                  <span className="text-xs font-bold text-[#D59A42]">VFSTR CAMPUS · NEAR N BLOCK</span>
                </div>
              </div>
              <p className="text-xs text-[#B9A9A2] leading-relaxed">
                MHP provides high-quality hygienic food, quick culinary service, and a vibrant community environment for VFSTR students, faculty, and campus visitors. Located conveniently near N Block, it features multi-cuisine counters, indoor/outdoor seating for 500+ guests, and regular monthly talent events.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs pt-2 font-bold text-[#F4ECE4]">
                {["500+ Seating Capacity", "14 Menu Categories", "Synergy Talent Stage", "Takeaway Parcel Hub"].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-[#0D0B0C] p-3 rounded-xl border border-[#3A1822]">
                    <CheckCircle2 className="w-4 h-4 text-[#C96F4F] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border-2 border-[#C96F4F]/40 shadow-2xl h-80 img-zoom-container bg-[#241613]">
              <img
                src={getImageUrl("/assets/mhp_hero_atmosphere.jpg")}
                alt="MHP Student Hub"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80";
                }}
              />
            </div>

          </div>
        </ThreeDSpatialCard>

        {/* 3D Extruded Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <ThreeDSpatialCard depth={30} className="p-6 space-y-2">
            <span className="font-display font-bold text-5xl text-[#C96F4F] block">500+</span>
            <span className="text-xs font-bold text-[#F4ECE4] uppercase">SEATING CAPACITY</span>
          </ThreeDSpatialCard>

          <ThreeDSpatialCard depth={30} className="p-6 space-y-2">
            <span className="font-display font-bold text-5xl text-[#D59A42] block">14</span>
            <span className="text-xs font-bold text-[#F4ECE4] uppercase">SPECIALIZED CATEGORIES</span>
          </ThreeDSpatialCard>

          <ThreeDSpatialCard depth={30} className="p-6 space-y-2">
            <span className="font-display font-bold text-5xl text-[#C96F4F] block">#1</span>
            <span className="text-xs font-bold text-[#F4ECE4] uppercase">CAMPUS LANDMARK</span>
          </ThreeDSpatialCard>

          <ThreeDSpatialCard depth={30} className="p-6 space-y-2">
            <span className="font-display font-bold text-5xl text-[#F4ECE4] block">100%</span>
            <span className="text-xs font-bold text-[#F4ECE4] uppercase">FRESH & HYGIENIC</span>
          </ThreeDSpatialCard>
        </div>

      </div>
    </div>
  );
};

export default About;
