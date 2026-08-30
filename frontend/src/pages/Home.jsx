import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import CinematicHero from '../components/home/CinematicHero';
import SignatureDishesSection from '../components/home/SignatureDishesSection';
import ThreeDSpatialCard from '../components/common/ThreeDSpatialCard';

import { getImageUrl } from '../utils/imageUtils';
import { 
  MapPin, 
  UtensilsCrossed, 
  ArrowRight,
  CheckCircle2,
  Package,
  Heart
} from 'lucide-react';

/**
 * Home — MHP Home Page Component
 * Structure:
 * 1. Hero Section (Cinematic Hero with Video)
 * 2. Dining vs Delivery Mode Experience
 * 3. Signature Dishes Section
 * 4. MHP Story & Campus Purpose
 * 5. Supporting Highlights & Editorial Statistics
 * 6. Facilities & Infrastructure
 * 7. Campus Location Landmark
 */
const Home = () => {
  const [homeContent, setHomeContent] = useState(null);
  const [orderingSlot, setOrderingSlot] = useState(null);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const [homeRes, slotRes, menuRes] = await Promise.all([
        api.get('/home-content').catch(() => null),
        api.get('/ordering-slot').catch(() => null),
        api.get('/future-menu/items').catch(() => null)
      ]);

      if (homeRes?.data) setHomeContent(homeRes.data);
      if (slotRes?.data) setOrderingSlot(slotRes.data);
      
      if (menuRes?.data) {
        setFoodItems(menuRes.data);
        const popular = menuRes.data.filter(item => item.popular).slice(0, 4);
        setFeaturedItems(popular.length >= 2 ? popular : menuRes.data.slice(0, 4));
      }
    } catch (err) {
      console.error('Failed to load home data:', err);
    } finally {
      setLoading(false);
    }
  };

  const heroData = homeContent?.hero || {
    heading: "MORE THAN FOOD.",
    subtitle: "The heartbeat of VFSTR.",
    description: "Good Food • Great Vibes • Best Memories",
    primaryBtnText: "ORDER NOW",
    primaryBtnLink: "/menu?mode=delivery",
    secondaryBtnText: "EXPLORE MENU",
    secondaryBtnLink: "/menu"
  };

  const sectionVisibility = homeContent?.sectionVisibility || {
    hero: true,
    diningDelivery: true,
    signatureDishes: true,
    campusExperience: true,
    synergy: true
  };

  return (
    <div className="space-y-0 bg-[#FFF7E8] text-[#202522] overflow-x-hidden font-sans preserve-3d">
      
      {/* ================= 1. HERO SECTION ================= */}
      {sectionVisibility.hero !== false && (
        <CinematicHero heroData={heroData} orderingSlot={orderingSlot} />
      )}

      {/* ================= TODAY'S TIMINGS SECTION ================= */}
      <section className="bg-[#183A2A] text-[#FFF7E8] py-8 border-b border-[#7D967E]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#FFF7E8]/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#7D967E]/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F47B20] text-white flex items-center justify-center font-bold shadow-md shrink-0">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black text-[#F47B20] uppercase tracking-widest block">
                  TODAY'S OPERATIONAL SCHEDULE
                </span>
                <h3 className="font-display font-extrabold text-xl text-[#FFF7E8]">
                  TODAY'S TIMINGS
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-auto text-xs">
              <div className="bg-white/10 px-5 py-3.5 rounded-2xl border border-[#7D967E]/30 space-y-0.5">
                <span className="text-[10px] font-extrabold text-[#7D967E] uppercase tracking-wider block">
                  ORDERING
                </span>
                <span className="font-display font-extrabold text-base sm:text-lg text-[#F47B20]">
                  {orderingSlot?.orderingWindow || '9:30 AM – 10:30 AM'}
                </span>
              </div>

              <div className="bg-white/10 px-5 py-3.5 rounded-2xl border border-[#7D967E]/30 space-y-0.5">
                <span className="text-[10px] font-extrabold text-[#7D967E] uppercase tracking-wider block">
                  PICKUP
                </span>
                <span className="font-display font-extrabold text-base sm:text-lg text-[#FFF7E8]">
                  {orderingSlot?.pickupWindow || '12:00 PM – 1:00 PM'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ================= 2. DINING VS DELIVERY MODE EXPERIENCE ================= */}
      {sectionVisibility.diningDelivery !== false && (
        <section className="bg-[#FFF7E8] text-[#202522] py-24 border-b border-[#7D967E]/30 preserve-3d">
          <div className="max-w-7xl mx-auto px-4 sm:gm-6 lg:px-8 space-y-12">
            
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="text-xs font-extrabold text-[#F47B20] uppercase tracking-widest">
                TWO DISTINCT EXPERIENCES
              </span>
              <h2 className="font-display font-bold text-4xl sm:text-5xl text-[#183A2A]">
                Dining vs Delivery Mode
              </h2>
              <p className="text-xs sm:text-sm text-[#7D967E] font-medium">
                Choose how you want to experience MHP today
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* LEFT: DINING CARD */}
              <ThreeDSpatialCard depth={20} className="p-8 sm:p-10 space-y-6 flex flex-col justify-between bg-[#FFFFFF] border-2 border-[#7D967E]/30 shadow-lg">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="px-3.5 py-1 rounded-full bg-[#183A2A] text-[#FFF7E8] text-[10px] font-extrabold uppercase tracking-wider">
                      🎒 DINING MODE
                    </span>
                    <span className="text-xs font-bold text-[#183A2A] bg-[#FFF7E8] px-3 py-1 rounded-lg border border-[#7D967E]/40">
                      VIEW-ONLY MENU
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-3xl text-[#183A2A]">
                    On-Campus Dining Experience
                  </h3>
                  <p className="text-xs text-[#202522]/80 leading-relaxed">
                    Browse our complete full-menu offerings (all 206 items across 14 categories) for in-person dining reference at the MHP seating area near N Block.
                  </p>

                  <ul className="space-y-2.5 text-xs text-[#183A2A] font-semibold">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#F47B20]" />
                      <span>Complete 206 items visible (including Breakfast)</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#F47B20]" />
                      <span>View-only mode (No online checkout)</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6 border-t border-[#7D967E]/30">
                  <Link
                    to="/menu?mode=dining"
                    className="btn-mhp-secondary w-full text-xs font-bold"
                  >
                    <span>VIEW DINING MENU</span>
                    <ArrowRight className="w-4 h-4 text-[#F47B20]" />
                  </Link>
                </div>
              </ThreeDSpatialCard>

              {/* RIGHT: DELIVERY / PARCEL CARD */}
              <ThreeDSpatialCard depth={30} glowColor="rgba(244, 123, 32, 0.4)" className="p-8 sm:p-10 space-y-6 flex flex-col justify-between bg-[#FFFFFF] border-2 border-[#F47B20] shadow-xl">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="px-3.5 py-1 rounded-full bg-[#F47B20] text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                      📦 DELIVERY / PARCEL MODE
                    </span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-300">
                      ONLINE ORDERING ACTIVE
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-3xl text-[#183A2A]">
                    Online Order & Parcel Pickup
                  </h3>
                  <p className="text-xs text-[#202522]/80 leading-relaxed">
                    Place prepaid takeaway parcel orders directly from your phone during daily active ordering slots, then collect from MHP Parcel Counter near N Block.
                  </p>

                  <ul className="space-y-2.5 text-xs text-[#183A2A] font-semibold">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Prepaid UPI / Net Banking checkout</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Fixed daily pickup window & official billing token</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6 border-t border-[#7D967E]/30">
                  <Link
                    to="/menu?mode=delivery"
                    className="btn-mhp-primary w-full text-xs font-bold"
                  >
                    <span>ORDER PARCEL ONLINE</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </Link>
                </div>
              </ThreeDSpatialCard>

            </div>

          </div>
        </section>
      )}

      {/* ================= 3. SIGNATURE DISHES ================= */}
      {sectionVisibility.signatureDishes !== false && (
        <SignatureDishesSection featuredItems={featuredItems} />
      )}


      {/* ================= 4. MHP STORY & PURPOSE ================= */}
      <section className="bg-[#FFF7E8] text-[#202522] py-20 lg:py-24 border-b border-[#7D967E]/30 relative preserve-3d">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-extrabold text-[#F47B20] uppercase tracking-widest block">
                OUR PURPOSE & CAMPUS ROLE
              </span>
              
              <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-[#183A2A] leading-[1.1]">
                MORE THAN JUST FOOD. <br />
                <span className="text-[#F47B20]">THE HEARTBEAT OF VFSTR CAMPUS.</span>
              </h2>

              <p className="text-sm text-[#202522]/80 leading-relaxed max-w-xl">
                MHP is an on-campus space where VFSTR students eat, meet, relax, connect, participate, perform, create, and enjoy campus life. Positioned conveniently near N Block, MHP provides quick culinary convenience and active student culture during academic breaks.
              </p>

              <div className="pt-2 flex flex-wrap gap-4 text-xs font-extrabold text-[#183A2A]">
                <span className="px-4 py-2 rounded-full bg-[#FFFFFF] border border-[#7D967E]/30 shadow-sm flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#F47B20]" />
                  <span>500+ Campus Seating</span>
                </span>
                <span className="px-4 py-2 rounded-full bg-[#FFFFFF] border border-[#7D967E]/30 shadow-sm flex items-center gap-2">
                  <UtensilsCrossed className="w-4 h-4 text-[#F47B20]" />
                  <span>14 Menu Categories</span>
                </span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <ThreeDSpatialCard depth={25} className="p-2.5 overflow-hidden shadow-xl bg-[#FFFFFF] border-2 border-[#7D967E]/30">
                <div className="arch-frame h-80 rounded-2xl overflow-hidden relative group bg-[#183A2A]">
                  <img
                    src={getImageUrl("/assets/mhp_hero_atmosphere.jpg")}
                    alt="MHP Student Gathering at VFSTR Campus"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#183A2A] via-transparent to-transparent opacity-75" />
                  <div className="absolute bottom-4 left-4 right-4 text-center bg-[#183A2A]/90 p-3 rounded-2xl border border-[#7D967E]/40 backdrop-blur-xs">
                    <span className="text-xs font-extrabold text-[#FFF7E8]">Central Student Hub near N Block</span>
                  </div>
                </div>
              </ThreeDSpatialCard>
            </div>

          </div>
        </div>
      </section>


      {/* ================= 6. FACILITIES & INFRASTRUCTURE ================= */}
      <section className="bg-[#FFF7E8] text-[#202522] py-24 border-b border-[#7D967E]/30 preserve-3d">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold text-[#F47B20] uppercase tracking-widest">CAMPUS AMENITIES</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#183A2A]">
              Facilities & Infrastructure
            </h2>
            <p className="text-xs text-[#7D967E]">
              Modern amenities provided at MHP for the VFSTR campus community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <ThreeDSpatialCard depth={20} className="p-8 space-y-4 bg-[#FFFFFF] border-2 border-[#7D967E]/30 shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-[#183A2A] text-[#F47B20] flex items-center justify-center font-bold shadow-md">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-[#183A2A]">500+ Seating</h3>
              <p className="text-xs text-[#202522]/80 leading-relaxed">
                Spacious indoor seating & quadrangle outdoor seating accommodating 500+ guests during peak break hours.
              </p>
            </ThreeDSpatialCard>

            <ThreeDSpatialCard depth={20} className="p-8 space-y-4 bg-[#FFFFFF] border-2 border-[#7D967E]/30 shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-[#183A2A] text-[#F47B20] flex items-center justify-center font-bold shadow-md">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-[#183A2A]">Multi-Cuisine</h3>
              <p className="text-xs text-[#202522]/80 leading-relaxed">
                14 specialized food categories serving freshly prepared biryanis, starters, drinks, and fast food.
              </p>
            </ThreeDSpatialCard>

            <ThreeDSpatialCard depth={20} className="p-8 space-y-4 bg-[#FFFFFF] border-2 border-[#7D967E]/30 shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-[#183A2A] text-[#F47B20] flex items-center justify-center font-bold shadow-md">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-[#183A2A]">Near N Block</h3>
              <p className="text-xs text-[#202522]/80 leading-relaxed">
                Central campus landmark positioned near N Block within easy walking distance from academic departments.
              </p>
            </ThreeDSpatialCard>

          </div>

        </div>
      </section>


      {/* ================= 7. CAMPUS LOCATION LANDMARK ================= */}
      <section className="bg-[#FFF7E8] text-[#202522] py-24 preserve-3d">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="max-w-xl mx-auto space-y-3">
            <span className="text-xs font-extrabold text-[#F47B20] uppercase tracking-widest block">
              PRIMARY CAMPUS LANDMARK
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-5xl text-[#183A2A]">
              MHP • NEAR N BLOCK
            </h2>
            <p className="text-xs text-[#7D967E] leading-relaxed font-semibold uppercase tracking-wider">
              VFSTR CAMPUS · VADLAMUDI · GUNTUR DISTRICT
            </p>
          </div>

          <ThreeDSpatialCard depth={30} className="p-8 sm:p-12 max-w-3xl mx-auto space-y-6 shadow-xl bg-[#FFFFFF] border-2 border-[#7D967E]/30">
            <div className="w-16 h-16 rounded-2xl bg-[#F47B20] text-white flex items-center justify-center mx-auto shadow-lg">
              <MapPin className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="font-display font-bold text-2xl text-[#183A2A]">VFSTR Campus, Vadlamudi</h3>
              <p className="text-xs text-[#7D967E]">Guntur District, Andhra Pradesh - 522213</p>
            </div>
            <div>
              <Link to="/explore" className="btn-mhp-primary text-xs">
                <span>Explore Location & Atmosphere</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ThreeDSpatialCard>
        </div>
      </section>

    </div>
  );
};

export default Home;
