import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ThreeDLogoEmblem from '../common/ThreeDLogoEmblem';
import AtmosphericParticles from '../common/AtmosphericParticles';
import { UtensilsCrossed, Clock, ShoppingBag } from 'lucide-react';

/**
 * CinematicHero - Home Page Cinematic Restaurant Hero (Rollback to Pre-Logo State)
 */
const CinematicHero = ({ heroData, foodItems = [], orderingSlot = null }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <section 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[92vh] flex items-center justify-center pt-8 pb-16 overflow-hidden bg-[#0B0909] text-[#F4E5D5] border-b border-[#3A191A] preserve-3d select-none"
    >
      {/* LAYER 1: FULL-SCREEN CINEMATIC RESTAURANT BACKGROUND (OPACITY ~80%, BLUR 2PX ONLY ON BACKGROUND) */}
      <div 
        className="pointer-events-none absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out opacity-80 filter blur-[2px] contrast-[1.05] brightness-[0.92]"
        style={{ 
          backgroundImage: `url('/assets/mhp_hero_atmosphere.jpg')`,
          transform: isMobile ? 'none' : `scale(1.04) translate3d(${mousePos.x * -0.5}px, ${mousePos.y * -0.5}px, 0)`
        }}
      />

      {/* LAYER 2: SUBTLE DARK CINEMATIC OVERLAYS & VIGNETTE FOR OPTIMAL TEXT READABILITY */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0B0909]/80 via-[#140D0D]/60 to-[#0B0909]/95" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0B0909]/45 to-[#0B0909]/90" />

      {/* 3D Atmospheric Dust Particles */}
      <AtmosphericParticles />

      {/* Warm Ambient Spotlight Focus */}
      <div 
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[44rem] h-[44rem] bg-[#D77A4D]/20 rounded-full blur-[150px]"
      />

      {/* LAYER 3+: CENTERED FOREGROUND HERO CONTENT (100% SHARP, 100% OPACITY, 0% BLUR) */}
      <div className="max-w-4xl mx-auto px-4 text-center relative z-30 space-y-5 preserve-3d py-4">
        
        {/* Headline & Tagline Hierarchy (100% Crisp) */}
        <div className="space-y-2 preserve-3d">
          {/* Primary Headline */}
          <h1 className="font-display font-bold text-4xl sm:text-6xl md:text-7xl tracking-tight text-[#F4E5D5] leading-[1.05] drop-shadow-[0_12px_28px_rgba(0,0,0,0.98)]">
            MORE THAN FOOD.
          </h1>
          
          {/* Secondary Headline */}
          <h2 className="font-display font-bold text-2xl sm:text-4xl text-[#D77A4D] tracking-tight drop-shadow-md">
            THE HEARTBEAT OF VFSTR.
          </h2>

          {/* Tagline */}
          <p className="text-xs sm:text-base text-[#D8A04D] font-sans font-semibold tracking-wider pt-1 drop-shadow-sm">
            Good Food • Great Vibes • Best Memories
          </p>
        </div>

        {/* 3. High-Conversion CTA Buttons (100% Crisp) */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-3 preserve-3d">
          <Link
            to="/menu?mode=delivery"
            className="btn-mhp-primary text-xs sm:text-sm px-9 py-3.5 shadow-2xl"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>ORDER NOW</span>
          </Link>

          <Link
            to="/menu"
            className="btn-mhp-secondary text-xs sm:text-sm px-9 py-3.5 shadow-2xl"
          >
            <UtensilsCrossed className="w-4 h-4 text-[#D77A4D]" />
            <span>EXPLORE MENU</span>
          </Link>
        </div>

        {/* 4. Translucent Ordering Status Panel (100% Crisp) */}
        {orderingSlot && (
          <div className="pt-4 border-t border-[#3A191A]/80 text-xs text-[#B9A9A2] flex flex-wrap items-center justify-center gap-5 bg-[#140D0D]/90 p-4 rounded-2xl border border-[#3A191A] shadow-xl backdrop-blur-md max-w-xl mx-auto mt-2">
            <div className="flex items-center gap-2 text-[#F4E5D5] font-bold">
              <Clock className="w-4 h-4 text-[#D77A4D]" />
              <span>Ordering Window: {orderingSlot.orderingWindow || '09:30 AM – 10:30 AM'}</span>
            </div>
            <span className="hidden sm:inline text-[#3A191A]">|</span>
            <div className="flex items-center gap-2">
              <span>Pickup: <strong className="text-[#F4E5D5]">{orderingSlot.pickupWindow || '12:00 PM – 1:00 PM'}</strong></span>
              <span className={`ml-2 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                orderingSlot.isOpen 
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700' 
                  : 'bg-rose-950/80 text-rose-300 border-rose-800'
              }`}>
                {orderingSlot.isOpen ? '🟢 OPEN' : '🔴 CLOSED'}
              </span>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default CinematicHero;
