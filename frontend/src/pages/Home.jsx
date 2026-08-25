import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import CinematicHero from '../components/home/CinematicHero';
import CulinaryShowcase from '../components/home/CulinaryShowcase';
import ThreeDSpatialCard from '../components/common/ThreeDSpatialCard';

import { getImageUrl, handleImageError } from '../utils/imageUtils';
import { 
  Sparkles, 
  MapPin, 
  ChevronRight, 
  UtensilsCrossed, 
  ArrowRight,
  Clock,
  Mic,
  CheckCircle2,
  Package,
  Calendar
} from 'lucide-react';

const Home = () => {
  const [homeContent, setHomeContent] = useState(null);
  const [synergy, setSynergy] = useState(null);
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
      const [homeRes, synRes, slotRes, menuRes] = await Promise.all([
        api.get('/home-content').catch(() => null),
        api.get('/synergy').catch(() => null),
        api.get('/ordering-slot').catch(() => null),
        api.get('/future-menu/items').catch(() => null)
      ]);

      if (homeRes?.data) setHomeContent(homeRes.data);
      if (synRes?.data) setSynergy(synRes.data[0] || null);
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
    heading: "MHP – The Most Happening Place",
    subtitle: '"Where campus life happens."',
    description: "Your primary on-campus dining, social, and student activity space at VFSTR, Vadlamudi.",
    primaryBtnText: "Explore Menu",
    primaryBtnLink: "/menu",
    image: ""
  };

  return (
    <div className="space-y-0 bg-[#0D0B0C] text-[#F4ECE4] overflow-x-hidden font-sans preserve-3d">
      
      {/* ================= HERO SECTION (3D SPATIAL HERO SCENE) ================= */}
      <CinematicHero heroData={heroData} orderingSlot={orderingSlot} />


      {/* ================= SECTION 1: MHP STORY (3D SPATIAL PRESENTATION) ================= */}
      <section className="bg-[#0D0B0C] text-[#F4ECE4] py-24 border-b border-[#171315] relative preserve-3d">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-extrabold text-[#C96F4F] uppercase tracking-widest block">
                OUR PURPOSE & CAMPUS ROLE
              </span>
              
              <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-[#F4ECE4] leading-[1.1]">
                MORE THAN JUST FOOD. <br />
                <span className="text-[#C96F4F]">THE HEARTBEAT OF VFSTR CAMPUS.</span>
              </h2>

              <p className="text-xs sm:text-sm text-[#B9A9A2] leading-relaxed max-w-xl">
                MHP is an on-campus space where VFSTR students eat, meet, relax, connect, participate, perform, create, and enjoy campus life. Positioned conveniently near N Block, MHP provides quick culinary convenience and active student culture during academic breaks.
              </p>
            </div>

            <div className="lg:col-span-5">
              <ThreeDSpatialCard depth={25} className="p-2 overflow-hidden shadow-2xl">
                <div className="h-80 rounded-2xl overflow-hidden relative img-zoom-container bg-[#171315]">
                  <img
                    src={getImageUrl("/assets/mhp_hero_atmosphere.jpg")}
                    alt="MHP Student Gathering at VFSTR Campus"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B0C] via-transparent to-transparent opacity-80" />
                </div>
              </ThreeDSpatialCard>
            </div>

          </div>
        </div>
      </section>


      {/* ================= SECTION 2: CAMPUS NUMBERS (EXTRUDED PHYSICAL 3D NUMBERS) ================= */}
      <section className="bg-[#171315] text-[#F4ECE4] py-20 border-b border-[#3A1822] preserve-3d">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <ThreeDSpatialCard depth={30} className="p-6 space-y-2">
              <span className="font-display font-bold text-5xl sm:text-6xl text-[#C96F4F] block drop-shadow-lg">500+</span>
              <span className="text-xs font-extrabold text-[#F4ECE4] uppercase tracking-wider block">SEATS CAPACITY</span>
              <span className="text-[11px] text-[#B9A9A2] block">Indoor & outdoor seating</span>
            </ThreeDSpatialCard>

            <ThreeDSpatialCard depth={30} className="p-6 space-y-2">
              <span className="font-display font-bold text-5xl sm:text-6xl text-[#D59A42] block drop-shadow-lg">MULTI</span>
              <span className="text-xs font-extrabold text-[#F4ECE4] uppercase tracking-wider block">CUISINE HUB</span>
              <span className="text-[11px] text-[#B9A9A2] block">14 Menu Categories</span>
            </ThreeDSpatialCard>

            <ThreeDSpatialCard depth={30} className="p-6 space-y-2">
              <span className="font-display font-bold text-5xl sm:text-6xl text-[#C96F4F] block drop-shadow-lg">STUDENT</span>
              <span className="text-xs font-extrabold text-[#F4ECE4] uppercase tracking-wider block">CAMPUS HUB</span>
              <span className="text-[11px] text-[#B9A9A2] block">Positioned near N Block</span>
            </ThreeDSpatialCard>

            <ThreeDSpatialCard depth={30} className="p-6 space-y-2">
              <span className="font-display font-bold text-5xl sm:text-6xl text-[#F4ECE4] block drop-shadow-lg">#1</span>
              <span className="text-xs font-extrabold text-[#F4ECE4] uppercase tracking-wider block">CAMPUS LANDMARK</span>
              <span className="text-[11px] text-[#B9A9A2] block">Fresh & hygienic dining</span>
            </ThreeDSpatialCard>

          </div>
        </div>
      </section>


      {/* ================= SECTION 3: DINING VS DELIVERY (SPATIAL SPLIT COMPOSITION) ================= */}
      <section className="bg-[#0D0B0C] text-[#F4ECE4] py-24 border-b border-[#171315] preserve-3d">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold text-[#C96F4F] uppercase tracking-widest">
              TWO DISTINCT EXPERIENCES
            </span>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-[#F4ECE4]">
              Dining vs Delivery Mode
            </h2>
            <p className="text-xs sm:text-sm text-[#B9A9A2]">
              Choose how you want to experience MHP today
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* LEFT: DINING CARD (VIEW ONLY) */}
            <ThreeDSpatialCard depth={20} className="p-8 sm:p-10 space-y-6 flex flex-col justify-between">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="px-3.5 py-1 rounded-xl bg-[#3A1822] text-[#F4ECE4] text-[10px] font-extrabold uppercase tracking-wider">
                    🎒 DINING MODE
                  </span>
                  <span className="text-xs font-bold text-[#C96F4F] bg-[#3A1822]/60 px-3 py-1 rounded-lg border border-[#3A1822]">
                    VIEW-ONLY MENU
                  </span>
                </div>

                <h3 className="font-display font-bold text-3xl text-[#F4ECE4]">
                  On-Campus Dining Experience
                </h3>
                <p className="text-xs text-[#B9A9A2] leading-relaxed">
                  Browse our complete full-menu offerings (all 206 items across 14 categories) for in-person dining reference at the MHP seating area near N Block.
                </p>

                <ul className="space-y-2.5 text-xs text-[#F4ECE4] font-semibold">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#D59A42]" />
                    <span>Complete 206 items visible (including Breakfast)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#D59A42]" />
                    <span>View-only mode (No online checkout)</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 border-t border-[#3A1822]">
                <Link
                  to="/menu?mode=dining"
                  className="btn-mhp-secondary w-full text-xs font-bold"
                >
                  <span>VIEW DINING MENU</span>
                  <ArrowRight className="w-4 h-4 text-[#C96F4F]" />
                </Link>
              </div>
            </ThreeDSpatialCard>

            {/* RIGHT: DELIVERY / PARCEL CARD (ONLINE ORDERING - VISUALLY MORE ACTIONABLE) */}
            <ThreeDSpatialCard depth={35} glowColor="rgba(201, 111, 79, 0.45)" className="p-8 sm:p-10 space-y-6 flex flex-col justify-between border-2 border-[#C96F4F]">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="px-3.5 py-1 rounded-xl bg-gradient-to-r from-[#C96F4F] to-[#D59A42] text-[#F4ECE4] text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                    📦 DELIVERY / PARCEL MODE
                  </span>
                  <span className="text-xs font-bold text-emerald-300 bg-emerald-950/60 px-3 py-1 rounded-lg border border-emerald-700">
                    ONLINE ORDERING ACTIVE
                  </span>
                </div>

                <h3 className="font-display font-bold text-3xl text-[#F4ECE4]">
                  Online Order & Parcel Pickup
                </h3>
                <p className="text-xs text-[#B9A9A2] leading-relaxed">
                  Place prepaid takeaway parcel orders directly from your phone during daily active ordering slots, then collect from MHP Parcel Counter near N Block.
                </p>

                <ul className="space-y-2.5 text-xs text-[#F4ECE4] font-semibold">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Prepaid UPI / Net Banking checkout</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Fixed daily pickup window & official billing token</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 border-t border-[#3A1822]">
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


      {/* ================= SECTION 4: MHP DAILY ORDERING WINDOW ================= */}
      <section className="bg-[#0D0B0C] text-[#F4ECE4] py-14 border-b border-[#171315] preserve-3d">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <ThreeDSpatialCard depth={20} className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-[11px] font-extrabold text-[#C96F4F] uppercase tracking-widest block">MHP DAILY WINDOW</span>
              <h3 className="font-display font-bold text-2xl text-[#F4ECE4]">Operational Schedule & Status</h3>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs">
              <div className="bg-[#0D0B0C] px-5 py-3 rounded-2xl border border-[#3A1822] text-center space-y-0.5">
                <span className="text-[10px] text-[#B9A9A2] uppercase font-bold block">ORDERING</span>
                <span className="text-base font-extrabold text-[#C96F4F]">{orderingSlot?.orderingWindow || '09:30 AM — 10:30 AM'}</span>
              </div>

              <div className="bg-[#0D0B0C] px-5 py-3 rounded-2xl border border-[#3A1822] text-center space-y-0.5">
                <span className="text-[10px] text-[#B9A9A2] uppercase font-bold block">PICKUP</span>
                <span className="text-base font-extrabold text-[#F4ECE4]">{orderingSlot?.pickupWindow || '12:00 PM — 01:00 PM'}</span>
              </div>

              <div className="flex items-center">
                <span className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold border shadow-sm ${
                  orderingSlot?.isOpen 
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700' 
                    : 'bg-rose-950/80 text-rose-300 border-rose-800'
                }`}>
                  {orderingSlot?.isOpen ? '🟢 ORDERING OPEN' : '🔴 ORDERING CLOSED'}
                </span>
              </div>
            </div>
          </ThreeDSpatialCard>

        </div>
      </section>


      {/* ================= SECTION 5: 3D CULINARY SHOWCASE FOUNDATION (STEP 1) ================= */}
      <CulinaryShowcase featuredItems={featuredItems} />



      {/* ================= SECTION 6: SYNERGY SHOWCASE (3D STAGE PRESENTATION) ================= */}
      <section className="bg-gradient-to-b from-[#0D0B0C] via-[#171315] to-[#0D0B0C] text-[#F4ECE4] py-24 border-b border-[#3A1822] preserve-3d">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ThreeDSpatialCard depth={25} className="p-8 sm:p-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0D0B0C] border border-[#3A1822] text-[#C96F4F] text-xs font-bold">
                  <Mic className="w-4 h-4 text-[#C96F4F]" />
                  <span>STUDENT TALENT SHOWCASE</span>
                </div>

                <div className="space-y-2">
                  <h2 className="font-display font-bold text-4xl sm:text-6xl text-[#F4ECE4] tracking-tight">
                    SYNERGY
                  </h2>
                  <p className="font-display italic text-2xl sm:text-3xl text-[#C96F4F]">
                    "One Stage. Infinite Possibilities."
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-[#B9A9A2] leading-relaxed">
                  Synergy is a monthly MHP student talent showcase where VFSTR students present singing, dancing, poetry, comedy, and fine arts live at the MHP stage near N Block.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
                  {["Singing", "Dancing", "Poetry", "Comedy"].map((t, idx) => (
                    <div key={idx} className="bg-[#0D0B0C] p-3 rounded-xl border border-[#3A1822] text-center font-bold text-[#F4ECE4]">
                      {t}
                    </div>
                  ))}
                </div>

                <div className="pt-3">
                  <Link
                    to="/about"
                    className="btn-mhp-primary text-xs"
                  >
                    <span>Discover Synergy</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="h-80 rounded-2xl overflow-hidden border-2 border-[#C96F4F]/50 relative img-zoom-container shadow-2xl bg-[#0D0B0C]">
                  <img
                    src={synergy?.image || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80"}
                    alt="Synergy Monthly Talent Stage"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B0C] via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-center bg-[#0D0B0C]/95 p-3 rounded-2xl border border-[#3A1822] backdrop-blur-xs">
                    <span className="text-xs font-bold text-[#F4ECE4]">Monthly MHP Campus Stage</span>
                  </div>
                </div>
              </div>

            </div>
          </ThreeDSpatialCard>
        </div>
      </section>


      {/* ================= SECTION 7: VIGNAN MAHOTSAV EVENT (3D EVENT SECTION) ================= */}
      <section className="bg-gradient-to-b from-[#0D0B0C] via-[#171315] to-[#0D0B0C] text-[#F4ECE4] py-24 border-b border-[#3A1822] preserve-3d">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ThreeDSpatialCard depth={25} className="p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#0D0B0C] text-[#C96F4F] text-xs font-extrabold border border-[#3A1822]">
                  <Calendar className="w-4 h-4 text-[#C96F4F]" />
                  NATIONAL LEVEL YOUTH FESTIVAL
                </div>

                <h2 className="font-display font-bold text-3xl sm:text-5xl text-[#F4ECE4]">
                  Vignan's Mahotsav
                </h2>

                <p className="text-xs sm:text-sm text-[#B9A9A2] leading-relaxed">
                  The premier annual national-level youth festival celebrating student talent across culture, technical hackathons, sports tournaments, literary debates, and fine arts at VFSTR. MHP central plaza serves as the official student activity zone during festival days.
                </p>

                <div className="flex flex-wrap gap-2 text-xs font-semibold text-[#F4ECE4]">
                  <span className="px-3.5 py-1.5 bg-[#0D0B0C] rounded-xl border border-[#3A1822]">Cultural Stage</span>
                  <span className="px-3.5 py-1.5 bg-[#0D0B0C] rounded-xl border border-[#3A1822]">Hackathons</span>
                  <span className="px-3.5 py-1.5 bg-[#0D0B0C] rounded-xl border border-[#3A1822]">Pro Nights</span>
                  <span className="px-3.5 py-1.5 bg-[#0D0B0C] rounded-xl border border-[#3A1822]">Food Stalls</span>
                </div>
              </div>

              <div className="lg:col-span-4 h-64 rounded-2xl overflow-hidden border-2 border-[#C96F4F]/40 img-zoom-container shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80"
                  alt="Vignan Mahotsav Youth Festival"
                  className="w-full h-full object-cover"
                />
              </div>

            </div>
          </ThreeDSpatialCard>
        </div>
      </section>


      {/* ================= SECTION 8: FACILITIES (3D FEATURE OBJECTS) ================= */}
      <section className="bg-[#0D0B0C] text-[#F4ECE4] py-24 border-b border-[#171315] preserve-3d">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold text-[#C96F4F] uppercase tracking-widest">CAMPUS AMENITIES</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#F4ECE4]">
              Facilities & Infrastructure
            </h2>
            <p className="text-xs text-[#B9A9A2]">
              Modern amenities provided at MHP for the VFSTR campus community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <ThreeDSpatialCard depth={20} className="p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#3A1822] text-[#C96F4F] flex items-center justify-center font-bold shadow-md">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-[#F4ECE4]">500+ Seating</h3>
              <p className="text-xs text-[#B9A9A2] leading-relaxed">
                Spacious indoor seating & quadrangle outdoor seating accommodating 500+ guests during peak break hours.
              </p>
            </ThreeDSpatialCard>

            <ThreeDSpatialCard depth={20} className="p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#3A1822] text-[#C96F4F] flex items-center justify-center font-bold shadow-md">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-[#F4ECE4]">Student Hub</h3>
              <p className="text-xs text-[#B9A9A2] leading-relaxed">
                Central campus landmark near N Block featuring monthly Synergy talent stage & open activity zone.
              </p>
            </ThreeDSpatialCard>

            <ThreeDSpatialCard depth={20} className="p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#3A1822] text-[#C96F4F] flex items-center justify-center font-bold shadow-md">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-[#F4ECE4]">Multi-Cuisine</h3>
              <p className="text-xs text-[#B9A9A2] leading-relaxed">
                14 specialized food categories serving freshly prepared biryanis, starters, drinks, and fast food.
              </p>
            </ThreeDSpatialCard>

          </div>

        </div>
      </section>


      {/* ================= SECTION 9: LOCATION (3D SPATIAL PRESENTATION) ================= */}
      <section className="bg-[#0D0B0C] text-[#F4ECE4] py-24 border-b border-[#171315] preserve-3d">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="max-w-xl mx-auto space-y-3">
            <span className="text-xs font-extrabold text-[#C96F4F] uppercase tracking-widest block">
              PRIMARY CAMPUS LANDMARK
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-5xl text-[#F4ECE4]">
              MHP • NEAR N BLOCK
            </h2>
            <p className="text-xs text-[#B9A9A2] leading-relaxed">
              VFSTR CAMPUS · VADLAMUDI · GUNTUR DISTRICT
            </p>
          </div>

          <ThreeDSpatialCard depth={30} className="p-8 sm:p-12 max-w-3xl mx-auto space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-[#C96F4F] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#C96F4F]/40">
              <MapPin className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="font-display font-bold text-2xl text-[#F4ECE4]">VFSTR Campus, Vadlamudi</h3>
              <p className="text-xs text-[#B9A9A2]">Guntur District, Andhra Pradesh - 522213</p>
            </div>
            <div>
              <Link to="/location" className="btn-mhp-primary text-xs">
                <span>Explore Location & Map</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ThreeDSpatialCard>
        </div>
      </section>


      {/* ================= SECTION 10: FINAL CTA (3D PHYSICAL CTA) ================= */}
      <section className="bg-[#171315] text-[#F4ECE4] py-24 preserve-3d">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ThreeDSpatialCard depth={35} className="p-8 sm:p-14 max-w-2xl mx-auto space-y-6">
            <h2 className="font-display font-bold text-4xl text-[#F4ECE4]">SEE YOU AT MHP.</h2>
            <p className="text-[#C96F4F] font-extrabold text-sm uppercase tracking-wider">
              Good Food. Great Vibes. Best Memories.
            </p>
            <p className="text-[#B9A9A2] text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              Browse our complete food menu or order parcel pre-takeaway for express pickup near N Block.
            </p>
            <div>
              <Link
                to="/menu"
                className="btn-mhp-primary text-xs inline-flex items-center gap-2"
              >
                <span>EXPLORE MENU</span>
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
