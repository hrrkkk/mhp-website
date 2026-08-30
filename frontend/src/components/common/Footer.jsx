import React from 'react';
import { Link } from 'react-router-dom';
import ThreeDLogoEmblem from './ThreeDLogoEmblem';
import { MapPin, Phone, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#183A2A] text-[#FFF7E8] border-t border-[#7D967E]/30 relative z-10 pt-16 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <ThreeDLogoEmblem size="small" className="w-10 h-10" />
              <div>
                <span className="font-display font-bold text-xl text-[#FFF7E8]">MHP</span>
                <span className="text-[9px] text-[#7D967E] font-bold block uppercase tracking-wider">THE MOST HAPPENING PLACE</span>
              </div>
            </div>
            <p className="text-xs text-[#FFF7E8]/70 leading-relaxed">
              The heartbeat of VFSTR — Primary on-campus dining, social, and student activity space near N Block.
            </p>
          </div>

          {/* Col 2: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-[#F47B20] uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-xs text-[#FFF7E8]/80 font-medium">
              <li><Link to="/" className="hover:text-[#F47B20] transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-[#F47B20] transition-colors">About MHP</Link></li>
              <li><Link to="/menu" className="hover:text-[#F47B20] transition-colors">Food Menu</Link></li>
              <li><Link to="/facilities" className="hover:text-[#F47B20] transition-colors">Explore Facilities</Link></li>
              <li><Link to="/feedback" className="hover:text-[#F47B20] transition-colors">Student Feedback</Link></li>
            </ul>
          </div>

          {/* Col 3: Services & Modes */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-[#F47B20] uppercase tracking-wider">Services</h4>
            <ul className="space-y-2 text-xs text-[#FFF7E8]/80 font-medium">
              <li><Link to="/menu?mode=dining" className="hover:text-[#F47B20] transition-colors">🎒 Dining Mode (View-Only)</Link></li>
              <li><Link to="/menu?mode=delivery" className="hover:text-[#F47B20] transition-colors">📦 Delivery / Parcel Takeaway</Link></li>
              <li><Link to="/profile" className="hover:text-[#F47B20] transition-colors">👤 Student Profile & Orders</Link></li>
              <li><Link to="/admin/login" className="hover:text-[#F47B20] transition-colors">🔐 Admin Portal</Link></li>
            </ul>
          </div>

          {/* Col 4: Campus Location */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-[#F47B20] uppercase tracking-wider">Campus Location</h4>
            <div className="space-y-2.5 text-xs text-[#FFF7E8]/80 leading-relaxed">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#F47B20] shrink-0 mt-0.5" />
                <span>VFSTR Campus, Near N Block, Vadlamudi, Guntur, AP - 522213</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F47B20] shrink-0" />
                <span>+91 863 2344700</span>
              </p>
            </div>
          </div>

        </div>

        <div className="border-t border-[#7D967E]/30 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#FFF7E8]/70 gap-4">
          <p>© {new Date().getFullYear()} MHP Cafeteria • VFSTR Campus Vadlamudi. All rights reserved.</p>
          <p className="flex items-center gap-1.5 font-semibold text-[#FFF7E8]/90">
            <span>Designed for VFSTR Student Community</span>
            <Sparkles className="w-3.5 h-3.5 text-[#F47B20]" />
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

