import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ThreeDLogoEmblem from '../components/common/ThreeDLogoEmblem';
import { getImageUrl } from '../utils/imageUtils';
import api from '../services/api';
import { 
  Sparkles, 
  MapPin, 
  UtensilsCrossed, 
  ArrowRight,
  CheckCircle2,
  Mic,
  Calendar,
  Heart
} from 'lucide-react';

const About = () => {
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    api.get('/about-content')
      .then(res => {
        if (res.data) setAboutData(res.data);
      })
      .catch(() => {});
  }, []);

  const heading = aboutData?.heading || "More Than Just a Food Court";
  const subheading = aboutData?.subheading || "THE HEARTBEAT OF VFSTR CAMPUS.";
  const description = aboutData?.description || "MHP — The Most Happening Place — is the student food hub at VFSTR, Vadlamudi, where food, friendship and campus life come together.";
  const seatingCount = aboutData?.seatingCount || "500+";
  const categoriesCount = aboutData?.categoriesCount || "14";
  const aboutImage = aboutData?.image || "/assets/mhp_building.jpg";

  return (
    <div className="bg-[#FFF7E8] text-[#202522] min-h-screen py-12 lg:py-20 pb-32 font-sans overflow-x-hidden preserve-3d">
      
      {/* Background Subtle Ambient Glows */}
      <div className="pointer-events-none absolute top-20 left-10 w-[35rem] h-[35rem] bg-[#183A2A]/5 rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute top-1/2 right-10 w-[30rem] h-[30rem] bg-[#F47B20]/8 rounded-full blur-[150px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 relative z-10">
        
        {/* ================= FIRST VIEWPORT / HERO COMPOSITION ================= */}
        <div className="space-y-12">
          
          {/* Header Copy Block */}
          <div className="max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#183A2A] text-[#FFF7E8] text-xs font-extrabold tracking-[0.18em] uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#F47B20]" />
              <span>ABOUT MHP</span>
            </div>

            <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-[#183A2A] tracking-tight leading-[1.08]">
              {heading}
            </h1>

            <p className="text-base sm:text-xl text-[#525B56] font-sans font-medium leading-relaxed max-w-3xl pt-1">
              {description}
            </p>
          </div>

          {/* ASYMMETRIC EDITORIAL HERO: DOMINANT MHP BUILDING PHOTO (60-70% HIERARCHY) + STORY */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center preserve-3d">
            
            {/* LEFT / DOMINANT AREA: REAL MHP BUILDING PHOTOGRAPH */}
            <div className="lg:col-span-7 relative group preserve-3d">
              
              {/* Main Building Photograph Card */}
              <div className="relative rounded-[36px] overflow-hidden border-2 border-[#7D967E]/30 shadow-[0_25px_60px_rgba(24,58,42,0.18)] bg-[#183A2A] aspect-[4/3] sm:aspect-[16/11]">
                <img
                  src="/assets/mhp_building.jpg"
                  alt="Official MHP Building - The Most Happening Place at VFSTR Vadlamudi"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover filter contrast-[1.03] brightness-[1.01] group-hover:scale-105 transition-transform duration-700 ease-out"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getImageUrl("/assets/mhp_hero_atmosphere.jpg");
                  }}
                />
                
                {/* Subtle Image Vignette Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#183A2A]/80 via-transparent to-transparent pointer-events-none" />

                {/* Floating Emblem Stamp on Photograph */}
                <div className="absolute bottom-6 left-6 right-6 bg-[#183A2A]/90 p-4 rounded-2xl border border-[#7D967E]/40 backdrop-blur-md flex items-center justify-between text-[#FFF7E8] shadow-lg">
                  <div className="flex items-center gap-3.5">
                    <ThreeDLogoEmblem size="small" className="w-11 h-11 shrink-0" />
                    <div>
                      <span className="font-display font-extrabold text-base block leading-tight text-[#FFF7E8]">
                        THE MOST HAPPENING PLACE
                      </span>
                      <span className="text-[10px] text-[#F47B20] font-extrabold uppercase tracking-widest block mt-0.5">
                        VFSTR CAMPUS · NEAR N BLOCK
                      </span>
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center gap-1.5 text-xs font-extrabold text-[#183A2A] bg-[#FFF7E8] px-4 py-2 rounded-full shadow-sm">
                    <MapPin className="w-4 h-4 text-[#F47B20]" />
                    <span>Vadlamudi</span>
                  </div>
                </div>
              </div>

              {/* Overlapping Secondary Campus Atmosphere Card */}
              <div className="hidden sm:block absolute -bottom-8 -right-6 w-52 h-40 rounded-2xl overflow-hidden border-4 border-[#FFF7E8] shadow-2xl bg-[#183A2A] z-20 hover:scale-105 transition-transform duration-300">
                <img
                  src={getImageUrl("/assets/mhp-gathering.jpg")}
                  alt="Student Gathering at MHP Campus Landmark"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getImageUrl("/assets/mhp_hero_atmosphere.jpg");
                  }}
                />
              </div>

            </div>

            {/* RIGHT / SUPPORTING AREA: EDITORIAL STORY & DESCRIPTION */}
            <div className="lg:col-span-5 space-y-6 preserve-3d">
              
              <div className="space-y-4">
                <span className="text-xs font-black text-[#F47B20] uppercase tracking-widest block font-sans">
                  OUR STORY
                </span>

                <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#183A2A] leading-tight">
                  The Heart of Everyday Campus Life
                </h2>

                {/* Exact 5-6 Line Story Description */}
                <p className="text-sm text-[#202522]/85 font-sans leading-relaxed font-normal">
                  MHP is the heart of everyday campus life at VFSTR, Vadlamudi. It brings students together through a wide variety of food and refreshments in one vibrant space. With multiple counters and seating for 500+ students, it serves as both a food destination and a social hub. From quick breakfasts and snacks to satisfying meals and drinks, MHP offers something for every campus moment. More than a place to eat, it is a space to meet friends, take a break, celebrate moments and create memories. MHP represents the energy and everyday spirit of the VFSTR student community.
                </p>
              </div>

              {/* Features & Action Link */}
              <div className="pt-2 space-y-6">
                <div className="grid grid-cols-2 gap-3 text-xs font-extrabold text-[#183A2A]">
                  <div className="flex items-center gap-2 bg-[#FFFFFF] p-3.5 rounded-xl border border-[#7D967E]/30 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-[#F47B20] shrink-0" />
                    <span>500+ Campus Seating</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#FFFFFF] p-3.5 rounded-xl border border-[#7D967E]/30 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-[#F47B20] shrink-0" />
                    <span>Multiple Counters</span>
                  </div>
                </div>

                <div>
                  <Link
                    to="/menu"
                    className="btn-mhp-primary text-xs py-3.5 px-8 rounded-full shadow-lg inline-flex items-center gap-2.5 font-extrabold"
                  >
                    <span>EXPLORE MENU</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </Link>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* ================= EDITORIAL HIGHLIGHTS & STATISTICS STRIP ================= */}
        <div className="border-y border-[#7D967E]/30 py-14 bg-[#FFFFFF] rounded-[32px] shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center max-w-5xl mx-auto px-6">
            
            <div className="space-y-1.5">
              <span className="font-display font-extrabold text-5xl sm:text-6xl text-[#F47B20] block tracking-tight">
                500+
              </span>
              <span className="text-xs font-black text-[#183A2A] uppercase tracking-widest block font-sans">
                SEATS
              </span>
              <span className="text-xs text-[#7D967E] block font-medium">Indoor & Outdoor Quadrangle Seating</span>
            </div>

            <div className="space-y-1.5 border-y sm:border-y-0 sm:border-x border-[#7D967E]/20 py-8 sm:py-0">
              <span className="font-display font-extrabold text-5xl sm:text-6xl text-[#183A2A] block tracking-tight">
                MULTIPLE
              </span>
              <span className="text-xs font-black text-[#183A2A] uppercase tracking-widest block font-sans">
                COUNTERS
              </span>
              <span className="text-xs text-[#7D967E] block font-medium">14 Specialized Food Categories</span>
            </div>

            <div className="space-y-1.5">
              <span className="font-display font-extrabold text-5xl sm:text-6xl text-[#F47B20] block tracking-tight">
                STUDENT
              </span>
              <span className="text-xs font-black text-[#183A2A] uppercase tracking-widest block font-sans">
                HUB
              </span>
              <span className="text-xs text-[#7D967E] block font-medium">Central Campus Landmark near N Block</span>
            </div>

          </div>
        </div>

        {/* ================= THE MHP STORY & COMMUNITY EXPERIENCE ================= */}
        <div className="bg-[#183A2A] text-[#FFF7E8] rounded-[40px] p-8 sm:p-14 lg:p-16 border-2 border-[#7D967E]/40 shadow-2xl space-y-10 preserve-3d">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF7E8]/10 text-[#F47B20] text-xs font-extrabold border border-[#7D967E]/40">
                <Mic className="w-4 h-4 text-[#F47B20]" />
                <span>STUDENT COMMUNITY & EVENTS</span>
              </div>

              <h2 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#FFF7E8] tracking-tight">
                The MHP Story
              </h2>

              <p className="text-sm sm:text-base text-[#FFF7E8]/85 font-sans leading-relaxed">
                MHP was created to be more than a place to grab a quick bite. It is the central nervous system of campus life at VFSTR, Vadlamudi. From early morning breakfast breaks with steaming hot ghee karam dosas to lively afternoon lunches and evening milkshakes, MHP provides a welcoming space for every student moment.
              </p>

              <p className="text-sm text-[#FFF7E8]/80 font-sans leading-relaxed">
                 MHP hosts monthly <strong className="text-[#F47B20]">Synergy student talent stages</strong> featuring live music, dance, poetry, and comedy. During annual events like <strong className="text-[#F47B20]">Vignan's Mahotsav</strong>, MHP serves as the official student activity zone, creating unforgettable campus memories.
              </p>

              <div className="flex flex-wrap gap-3 pt-2 text-xs font-bold text-[#FFF7E8]">
                <div className="px-4 py-2 bg-[#FFF7E8]/10 rounded-full border border-[#7D967E]/30 flex items-center gap-2">
                  <UtensilsCrossed className="w-4 h-4 text-[#F47B20]" />
                  <span>14 Food Counters</span>
                </div>
                <div className="px-4 py-2 bg-[#FFF7E8]/10 rounded-full border border-[#7D967E]/30 flex items-center gap-2">
                  <Mic className="w-4 h-4 text-[#F47B20]" />
                  <span>Synergy Talent Stage</span>
                </div>
                <div className="px-4 py-2 bg-[#FFF7E8]/10 rounded-full border border-[#7D967E]/30 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#F47B20]" />
                  <span>Vignan Mahotsav Hub</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="arch-frame h-80 sm:h-96 rounded-[32px] overflow-hidden border-2 border-[#F47B20] shadow-2xl relative bg-[#183A2A]">
                <img
                  src={getImageUrl("/assets/mhp_hero_atmosphere.jpg")}
                  alt="MHP Student Community & Atmosphere at VFSTR Campus"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#183A2A] via-transparent to-transparent opacity-85" />
                <div className="absolute bottom-4 left-4 right-4 text-center bg-[#183A2A]/90 p-3.5 rounded-2xl border border-[#7D967E]/40 backdrop-blur-xs">
                  <span className="text-xs font-extrabold text-[#FFF7E8]">Monthly Synergy Talent Stage</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
