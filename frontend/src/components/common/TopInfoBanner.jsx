import React from 'react';
import { MapPin, Clock, Phone, HelpCircle } from 'lucide-react';

/**
 * TopInfoBanner — Real-world Info & Quick Contact Bar
 * Displays:
 * 📍 MHP — VFSTR Campus
 * 🕐 9:00 AM – 6:00 PM (Monday–Saturday | Sunday when college is open)
 * 📞 Helpdesk: +91 91234 56789
 */
const TopInfoBanner = () => {
  return (
    <div className="bg-[#10271C] text-[#FFF7E8] py-1.5 px-4 border-b border-[#7D967E]/30 text-[11px] font-sans">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        
        {/* Left: Location & Hours */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 font-semibold">
          <div className="flex items-center gap-1.5 text-[#F47B20]">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[#FFF7E8] font-bold">📍 MHP — VFSTR Campus</span>
          </div>

          <span className="hidden md:inline text-[#7D967E]">|</span>

          <div className="flex items-center gap-1.5 text-[#FFF7E8]/90">
            <Clock className="w-3.5 h-3.5 text-[#F47B20] shrink-0" />
            <span>
              <strong>🕐 9:00 AM – 6:00 PM</strong> (Mon–Sat · Sunday when college is open)
            </span>
          </div>
        </div>

        {/* Right: Contact / Help for Order Problems */}
        <div className="flex items-center gap-3 shrink-0">
          <a 
            href="tel:+919123456789"
            className="flex items-center gap-1.5 text-[#F47B20] hover:text-white font-extrabold transition-colors bg-[#183A2A] px-2.5 py-0.5 rounded-full border border-[#7D967E]/30"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Order Help: +91 91234 56789</span>
          </a>
        </div>

      </div>
    </div>
  );
};

export default TopInfoBanner;
