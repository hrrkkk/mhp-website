import React from 'react';
import ThreeDSpatialCard from '../components/common/ThreeDSpatialCard';
import { MapPin, Phone, Mail, Clock, Navigation, AlertCircle, Store } from 'lucide-react';

const LocationContact = () => {
  return (
    <div className="bg-[#FFF7E8] text-[#202522] min-h-screen py-12 pb-24 space-y-10 preserve-3d font-sans">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
        <span className="text-xs font-black text-[#F47B20] uppercase tracking-widest block">
          VFSTR CAMPUS DIRECTORY
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-[#183A2A]">
          Location & <span className="text-[#F47B20]">Student Helpdesk</span>
        </h1>
        <p className="text-xs text-[#7D967E] max-w-xl mx-auto leading-relaxed font-medium">
          Official campus location, operating hours, and instant order support details for VFSTR students.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Location & Exact Operating Hours */}
          <div className="lg:col-span-6 space-y-6">
            <ThreeDSpatialCard depth={20} className="p-8 space-y-6 bg-white border-2 border-[#7D967E]/30 shadow-xl">
              
              <div className="flex items-center gap-3.5 border-b border-[#7D967E]/20 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#183A2A] text-[#F47B20] flex items-center justify-center font-bold shadow-md shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-display font-extrabold text-2xl text-[#183A2A]">📍 MHP — VFSTR Campus</h2>
                  <p className="text-xs text-[#7D967E] font-medium">Near N Block Quadrangle, Vadlamudi</p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-[#202522] font-medium">
                
                {/* Address */}
                <div className="flex items-start gap-3">
                  <Navigation className="w-4 h-4 text-[#F47B20] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#183A2A] block font-extrabold">Campus Address:</strong>
                    Vignan's Foundation for Science, Technology & Research (VFSTR), Vadlamudi, Chebrolu Mandal, Guntur District, Andhra Pradesh - 522213.
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-start gap-3 bg-[#FFF7E8] p-4 rounded-2xl border border-[#7D967E]/30">
                  <Clock className="w-4 h-4 text-[#F47B20] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="text-[#183A2A] block font-extrabold uppercase tracking-wider text-[11px]">
                      CAFETERIA HOURS
                    </strong>
                    <div className="text-sm font-black text-[#F47B20]">
                      🕐 9:00 AM – 6:00 PM
                    </div>
                    <ul className="text-xs text-[#183A2A] font-bold space-y-0.5 pt-0.5">
                      <li>• Monday – Saturday</li>
                      <li>• Sunday — <span className="text-[#7D967E]">when college is open</span></li>
                    </ul>
                  </div>
                </div>

              </div>
            </ThreeDSpatialCard>
          </div>

          {/* Right: Order Problem & Student Support Helpdesk */}
          <div className="lg:col-span-6 space-y-6">
            <ThreeDSpatialCard depth={20} className="p-8 space-y-6 bg-white border-2 border-[#F47B20]/40 shadow-xl">
              
              <div className="flex items-center gap-3.5 border-b border-[#7D967E]/20 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F47B20] text-white flex items-center justify-center font-bold shadow-md shrink-0">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-display font-extrabold text-2xl text-[#183A2A]">Contact & Order Help</h2>
                  <p className="text-xs text-[#7D967E] font-medium">Instant assistance for order or payment issues</p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-[#183A2A] font-medium">
                <p className="text-[#7D967E] leading-relaxed">
                  If you have any issue with placing an order, payment verification, billing tokens, or takeaway parcel pickup, contact our dedicated student helpdesk:
                </p>

                <div className="space-y-3">
                  
                  {/* Phone Hotline */}
                  <a 
                    href="tel:+919123456789"
                    className="p-4 rounded-2xl bg-[#183A2A] text-white flex items-center justify-between group hover:bg-[#204935] transition-all shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-[#F47B20]" />
                      <div>
                        <span className="text-[10px] text-[#7D967E] font-black uppercase tracking-wider block">STUDENT ORDER HOTLINE</span>
                        <span className="text-sm font-extrabold group-hover:text-[#F47B20] transition-colors">📞 +91 91234 56789</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#F47B20] uppercase">CALL NOW &rarr;</span>
                  </a>

                  {/* Email Support */}
                  <a 
                    href="mailto:mhp.support@vignan.ac.in"
                    className="p-4 rounded-2xl bg-[#FFF7E8] border border-[#7D967E]/30 flex items-center justify-between text-[#183A2A] hover:border-[#F47B20] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-[#F47B20]" />
                      <div>
                        <span className="text-[10px] text-[#7D967E] font-bold uppercase tracking-wider block">STUDENT SUPPORT EMAIL</span>
                        <span className="text-xs font-extrabold">mhp.support@vignan.ac.in</span>
                      </div>
                    </div>
                  </a>

                  {/* In-Person Counter */}
                  <div className="p-4 rounded-2xl bg-[#FFF7E8] border border-[#7D967E]/30 flex items-center gap-3 text-[#183A2A]">
                    <Store className="w-5 h-5 text-[#F47B20] shrink-0" />
                    <div>
                      <span className="text-[10px] text-[#7D967E] font-bold uppercase tracking-wider block">IN-PERSON COUNTER</span>
                      <span className="text-xs font-extrabold">MHP Parcel & Billing Counter, Near N Block</span>
                    </div>
                  </div>

                </div>
              </div>

            </ThreeDSpatialCard>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LocationContact;
