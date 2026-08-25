import React from 'react';
import { Link } from 'react-router-dom';
import ThreeDLogoEmblem from './ThreeDLogoEmblem';
import { MapPin, Phone, Mail, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0D0C0E] text-[#F4ECE4] border-t border-[#291620] relative z-10 pt-16 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <ThreeDLogoEmblem size="medium" />
              <div>
                <span className="font-display font-bold text-xl text-[#F4ECE4]">MHP</span>
                <span className="text-[10px] text-[#C8BDB6] font-bold block uppercase">VFSTR Vadlamudi</span>
              </div>
            </div>
            <p className="text-xs text-[#C8BDB6] leading-relaxed">
              The Most Happening Place — Primary on-campus cafeteria and student social hub near N Block.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-[#F4ECE4] uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-xs text-[#C8BDB6] font-medium">
              <li><Link to="/" className="hover:text-[#C86F4D]">Home</Link></li>
              <li><Link to="/about" className="hover:text-[#C86F4D]">About MHP</Link></li>
              <li><Link to="/menu" className="hover:text-[#C86F4D]">Food Menu</Link></li>
              <li><Link to="/facilities" className="hover:text-[#C86F4D]">Facilities</Link></li>
              <li><Link to="/location" className="hover:text-[#C86F4D]">Location & Map</Link></li>
              <li><Link to="/feedback" className="hover:text-[#C86F4D]">Student Feedback</Link></li>
            </ul>
          </div>

          {/* Col 3: Menu Modes */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-[#F4ECE4] uppercase tracking-wider">Services</h4>
            <ul className="space-y-2 text-xs text-[#C8BDB6] font-medium">
              <li><Link to="/menu?mode=dining" className="hover:text-[#C86F4D]">🎒 Dining Mode (View-Only)</Link></li>
              <li><Link to="/menu?mode=delivery" className="hover:text-[#C86F4D]">📦 Delivery / Parcel Takeaway</Link></li>
              <li><Link to="/profile" className="hover:text-[#C86F4D]">👤 Student Profile & Orders</Link></li>
              <li><Link to="/admin/login" className="hover:text-[#C86F4D]">🔐 Admin Portal Login</Link></li>
            </ul>
          </div>

          {/* Col 4: Location */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-[#F4ECE4] uppercase tracking-wider">Campus Location</h4>
            <div className="space-y-2 text-xs text-[#C8BDB6] leading-relaxed">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C86F4D] shrink-0 mt-0.5" />
                <span>VFSTR Campus, Near N Block, Vadlamudi, Guntur, AP - 522213</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C86F4D] shrink-0" />
                <span>+91 863 2344700</span>
              </p>
            </div>
          </div>

        </div>

        <div className="border-t border-[#291620] pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#C8BDB6]">
          <p>© {new Date().getFullYear()} MHP Cafeteria • VFSTR Campus Vadlamudi. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Designed for VFSTR Student Community</span>
            <Sparkles className="w-3 h-3 text-[#C86F4D]" />
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
