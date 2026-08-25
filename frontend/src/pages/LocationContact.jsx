import React from 'react';
import ThreeDSpatialCard from '../components/common/ThreeDSpatialCard';
import { MapPin, Phone, Mail, Clock, ArrowRight, Navigation } from 'lucide-react';

const LocationContact = () => {
  return (
    <div className="bg-[#0D0B0C] text-[#F4ECE4] min-h-screen py-14 pb-32 space-y-12 preserve-3d">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
        <span className="text-xs font-extrabold text-[#C96F4F] uppercase tracking-widest block">CAMPUS NAVIGATION</span>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-[#F4ECE4]">
          Location & <span className="text-[#C96F4F]">Campus Guide</span>
        </h1>
        <p className="text-xs text-[#B9A9A2] max-w-xl mx-auto leading-relaxed font-medium">
          Find MHP at VFSTR Campus, Vadlamudi, Guntur District, Andhra Pradesh.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-6 space-y-6">
            <ThreeDSpatialCard depth={30} className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#C96F4F] text-white flex items-center justify-center font-bold shadow-lg shadow-[#C96F4F]/40">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-2xl text-[#F4ECE4]">MHP Campus Landmark</h2>
                  <p className="text-xs text-[#B9A9A2]">Near N Block Quadrangle</p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-[#B9A9A2] font-medium border-t border-[#3A1822] pt-4">
                <div className="flex items-start gap-3">
                  <Navigation className="w-4 h-4 text-[#C96F4F] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#F4ECE4] block">Address:</strong>
                    Vignan's Foundation for Science, Technology & Research (VFSTR), Vadlamudi, Chebrolu Mandal, Guntur District, AP - 522213.
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#C96F4F] shrink-0" />
                  <div>
                    <strong className="text-[#F4ECE4] block">Working Hours:</strong>
                    Monday – Saturday: 8:00 AM – 6:00 PM
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#C96F4F] shrink-0" />
                  <div>
                    <strong className="text-[#F4ECE4] block">Campus Helpdesk:</strong>
                    +91 863 2344700 / 01
                  </div>
                </div>
              </div>
            </ThreeDSpatialCard>
          </div>

          <div className="lg:col-span-6">
            <ThreeDSpatialCard depth={30} className="p-8 space-y-5">
              <h3 className="font-display font-bold text-xl text-[#F4ECE4]">Pickup Points Map</h3>
              <p className="text-xs text-[#B9A9A2]">
                All online parcel pre-orders can be collected from MHP Parcel Counter near N Block or designated counters at P Block, H Block, U Block, and A Block.
              </p>
              
              <div className="grid grid-cols-2 gap-3 text-xs font-bold text-[#F4ECE4] pt-2">
                <div className="p-3 bg-[#0D0B0C] rounded-xl border border-[#3A1822]">📍 N Block Main Counter</div>
                <div className="p-3 bg-[#0D0B0C] rounded-xl border border-[#3A1822]">📍 P Block Express Counter</div>
                <div className="p-3 bg-[#0D0B0C] rounded-xl border border-[#3A1822]">📍 H Block Hostel Hub</div>
                <div className="p-3 bg-[#0D0B0C] rounded-xl border border-[#3A1822]">📍 U Block Quadrangle</div>
              </div>
            </ThreeDSpatialCard>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LocationContact;
