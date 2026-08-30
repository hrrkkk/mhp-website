import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ThreeDLogoEmblem from '../common/ThreeDLogoEmblem';
import AtmosphericParticles from '../common/AtmosphericParticles';
import { UtensilsCrossed, Clock, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';

const CinematicHero = ({ heroData, orderingSlot = null }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const mainVideoRef = useRef(null);
  const bgVideoRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Ensure 100% guaranteed autoplay for background & hero video loop
  useEffect(() => {
    if (mainVideoRef.current) {
      mainVideoRef.current.play().catch(() => {});
    }
    if (bgVideoRef.current) {
      bgVideoRef.current.play().catch(() => {});
    }
  }, []);

  const handleMouseMove = (e) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const videoSrc = "/videos/mhp_hero_video.mp4";
  const fallbackVideoSrc = "/videos/WhatsApp%20Video%202026-08-27%20at%209.02.26%20PM.mp4";

  return (
    <section 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[88vh] flex items-center justify-center pt-8 pb-16 overflow-hidden bg-[#183A2A] text-[#FFF7E8] border-b border-[#7D967E]/30 preserve-3d select-none"
    >
      {/* BACKGROUND HERO VIDEO AT 100% OPACITY */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-100 z-0">
        <video
          ref={bgVideoRef}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          className="w-full h-full object-cover pointer-events-none opacity-100"
        >
          <source src={videoSrc} type="video/mp4" />
          <source src={fallbackVideoSrc} type="video/mp4" />
        </video>
      </div>

      {/* GREEN COLOR OVERLAY AT EXACTLY 20% OPACITY */}
      <div className="pointer-events-none absolute inset-0 bg-[#183A2A]/20 z-10" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#183A2A]/20 via-transparent to-[#183A2A]/40 z-10" />

      {/* 3D Atmospheric Particles */}
      <AtmosphericParticles />

      {/* Warm Ambient Spotlight Focus */}
      <div 
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[48rem] h-[48rem] bg-[#F47B20]/15 rounded-full blur-[160px]"
      />

      {/* FOREGROUND HERO CONTENT */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30 py-12 preserve-3d">
        <div className="max-w-3xl space-y-6 text-center lg:text-left preserve-3d">
          
          {/* Campus Landmark Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF7E8]/10 border border-[#7D967E]/40 text-[#FFF7E8] text-xs font-extrabold tracking-wider uppercase backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#F47B20]" />
            <span>VFSTR CAMPUS · NEAR N BLOCK</span>
          </div>

          {/* Headline Hierarchy */}
          <div className="space-y-3 preserve-3d">
            <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-[#FFF7E8] leading-[1.05] drop-shadow-md">
              MORE THAN FOOD.
            </h1>
            
            <h2 className="font-display font-bold text-2xl sm:text-4xl text-[#F47B20] tracking-tight">
              The heartbeat of VFSTR.
            </h2>

            <p className="text-sm sm:text-lg text-[#FFF7E8]/90 font-sans font-semibold tracking-wide pt-1">
              Good Food • Great Vibes • Best Memories
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 preserve-3d">
            <Link
              to="/menu?mode=delivery"
              className="btn-mhp-primary text-xs sm:text-sm px-8 py-3.5 shadow-xl"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>ORDER NOW</span>
            </Link>

            <Link
              to="/menu"
              className="btn-mhp-secondary text-xs sm:text-sm px-8 py-3.5 shadow-xl"
            >
              <UtensilsCrossed className="w-4 h-4 text-[#F47B20]" />
              <span>EXPLORE MENU</span>
            </Link>
          </div>

          {/* Translucent Ordering Status Panel */}
          {orderingSlot && (
            <div className="pt-3">
              <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-4 bg-[#FFF7E8]/10 px-4 py-2.5 rounded-2xl border border-[#7D967E]/30 backdrop-blur-md text-xs text-[#FFF7E8]/90">
                <div className="flex items-center gap-2 font-bold">
                  <Clock className="w-4 h-4 text-[#F47B20]" />
                  <span>Ordering: {orderingSlot.orderingWindow || '09:30 AM – 10:30 AM'}</span>
                </div>
                <span className="hidden sm:inline text-[#7D967E]">|</span>
                <div className="flex items-center gap-2">
                  <span>Pickup: <strong className="text-[#FFF7E8]">{orderingSlot.pickupWindow || '12:00 PM – 1:00 PM'}</strong></span>
                  <span className={`ml-1 px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                    orderingSlot.isOpen 
                      ? 'bg-emerald-900/80 text-emerald-200 border-emerald-600' 
                      : orderingSlot.status === 'BEFORE'
                        ? 'bg-amber-900/80 text-amber-200 border-amber-600'
                        : 'bg-rose-900/80 text-rose-200 border-rose-600'
                  }`}>
                    {orderingSlot.isOpen 
                      ? '🟢 ORDERING OPEN' 
                      : orderingSlot.status === 'BEFORE'
                        ? `🔵 OPENS AT ${orderingSlot.orderingStartFormatted || '9:30 AM'}`
                        : '🔴 ORDERING CLOSED'}
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default CinematicHero;

