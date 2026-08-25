import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Sparkles } from 'lucide-react';
import ThreeDLogoEmblem from '../common/ThreeDLogoEmblem';
import { handleImageError } from '../../utils/imageUtils';

/**
 * CulinaryShowcase - Physical Food Envelope / Sleeve Reveal Showcase
 *
 * PHYSICAL ARCHITECTURE:
 * - REALISTIC PHYSICAL SLEEVE: Anchored on the LEFT with a RIGHT-FACING pocket opening.
 * - ZERO INSTRUCTIONAL TEXT / REVEAL BADGES: All reveal-related text instructions, buttons,
 *   and "REVEALED" labels have been completely removed.
 * - PARTIALLY TUCKED DISHES: 5 dishes are partially tucked inside the sleeve cavity,
 *   overlapping naturally. User clicks directly on any partially exposed food dish.
 * - PHYSICAL REVEAL (LEFT -> RIGHT): Selected food slides out of the right-facing sleeve opening,
 *   elevating onto the center 3D pedestal stage as the main hero food.
 * - PHYSICAL OCCLUSION (RIGHT -> LEFT): Returning dish slides back behind the sleeve front plate into the cavity.
 * - RIGHT EDITORIAL PANEL: Category, Name, Price, Description, Order CTA.
 */
const CulinaryShowcase = ({ featuredItems = [], foodItems = [] }) => {
  // 1. Master List of 5 Featured Dishes (mapping project database items)
  const masterDishes = [
    {
      id: 'dosa',
      name: featuredItems.find(i => i.name?.toLowerCase().includes('karam dosa'))?.name || "Ghee Karam Dosa",
      category: "Breakfast",
      price: featuredItems.find(i => i.name?.toLowerCase().includes('karam dosa'))?.price || 50,
      foodType: "Veg",
      isPopular: true,
      description: "Crispy dosa roasted in pure ghee and finished with spicy karam podi, served with authentic coconut and red karam chutneys.",
      image: "/assets/ghee_karam_dosa_hero.jpg"
    },
    {
      id: 'masala_dosa',
      name: featuredItems.find(i => i.name?.toLowerCase().includes('masala dosa'))?.name || "Special Masala Dosa",
      category: "Breakfast",
      price: featuredItems.find(i => i.name?.toLowerCase().includes('masala dosa'))?.price || 60,
      foodType: "Veg",
      isPopular: true,
      description: "Crispy golden dosa filled with authentic spiced potato masala and served with traditional sambar and chutney.",
      image: "/assets/masala_dosa_hero.jpg"
    },
    {
      id: 'idly',
      name: featuredItems.find(i => i.name?.toLowerCase().includes('idly') || i.name?.toLowerCase().includes('idli'))?.name || "Ghee Karam Idly",
      category: "Breakfast",
      price: featuredItems.find(i => i.name?.toLowerCase().includes('idly'))?.price || 40,
      foodType: "Veg",
      isPopular: true,
      description: "Soft, fluffy steamed idlis tossed in pure desi ghee and seasoned with spiced karam podi, served with coconut chutney.",
      image: "/assets/ghee_karam_idly_hero.jpg"
    },
    {
      id: 'biryani',
      name: featuredItems.find(i => i.category === 'Biryani' || i.name?.toLowerCase().includes('biryani'))?.name || "Chicken Dum Biryani",
      category: "Biryani",
      price: featuredItems.find(i => i.category === 'Biryani')?.price || 179,
      foodType: "Non-Veg",
      isPopular: true,
      description: "Aromatic Hyderabadi chicken dum biryani prepared with aged basmati rice, tender seasoned chicken, and traditional spices.",
      image: "/assets/biryani_hero.jpg"
    },
    {
      id: 'shake',
      name: featuredItems.find(i => i.category === 'Shakes' || i.name?.toLowerCase().includes('shake'))?.name || "Chocolate Caramel Shake",
      category: "Shakes",
      price: featuredItems.find(i => i.category === 'Shakes')?.price || 80,
      foodType: "Veg",
      isPopular: true,
      description: "Rich thick chocolate caramel milkshake topped with fluffy whipped cream, chocolate drizzle, and dark cocoa shavings.",
      image: "/assets/milkshake_hero.jpg"
    }
  ];

  // State Management
  const [activeIdx, setActiveIdx] = useState(0);
  const [isSwitching, setIsSwitching] = useState(false);
  const [isEmerged, setIsEmerged] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();
  }, []);

  const activeDish = masterDishes[activeIdx];

  // Dish Selection Handler (Physical Reveal Motion)
  const handleSelectDish = (index) => {
    if (index === activeIdx || isSwitching) return;
    setIsSwitching(true);
    setIsEmerged(false);

    // 350ms switch timeline: Outgoing returns behind sleeve front plate, incoming emerges
    setTimeout(() => {
      setActiveIdx(index);
      setIsSwitching(false);
    }, 350);
  };

  // Keyboard Accessibility
  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelectDish(index);
    }
  };

  // Tap Emergence Toggle
  const handleDishClick = () => {
    setIsEmerged(prev => !prev);
  };

  // Desktop Mouse Parallax
  const handleMouseMove = (e) => {
    if (isTouchDevice) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  return (
    <section className="bg-[#0B0909] text-[#F4E5D5] py-16 sm:py-20 lg:py-28 border-b border-[#3A191A] relative overflow-hidden preserve-3d">
      {/* Ambient Warm Studio Spotlight Background Glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[36rem] sm:w-[50rem] h-[36rem] sm:h-[50rem] bg-[#D77A4D]/15 rounded-full blur-[170px]" />
      <div className="pointer-events-none absolute bottom-4 right-1/4 w-[24rem] sm:w-[32rem] h-[24rem] sm:h-[32rem] bg-[#D8A04D]/10 rounded-full blur-[140px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 preserve-3d space-y-10 sm:space-y-12">
        
        {/* Section Header Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-[#3A191A]/80 pb-6">
          <div>
            <span className="text-xs font-extrabold text-[#D77A4D] uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D8A04D]" />
              <span>CULINARY SELECTIONS</span>
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#F4E5D5] mt-1">
              Popular Campus Favorites
            </h2>
          </div>

          <Link
            to="/menu"
            className="text-xs font-extrabold text-[#D77A4D] hover:text-[#D8A04D] flex items-center gap-1.5 transition-colors group"
          >
            <span>Explore Full Menu ({foodItems.length || 206}+ items) →</span>
          </Link>
        </div>

        {/* ================= MAIN PHYSICAL SLEEVE SHOWCASE COMPOSITION ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center preserve-3d min-h-[520px]">
          
          {/* ---------------- 1. LEFT: REALISTIC PHYSICAL FOOD SLEEVE / ENVELOPE (OPENING FACES RIGHT) ---------------- */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start justify-center preserve-3d z-30">
            
            {/* Physical 3D Sleeve Object Container */}
            <div className="relative w-full max-w-md h-[440px] sm:h-[480px] preserve-3d select-none">
              
              {/* Back Plate Layer (z-10): Dark Textured Inner Backing */}
              <div className="absolute inset-y-0 left-0 right-12 bg-gradient-to-br from-[#1C0F0F] via-[#140D0D] to-[#0B0606] border-l-4 border-t-2 border-b-2 border-[#D77A4D]/50 rounded-l-3xl shadow-2xl z-10 preserve-3d">
                {/* Hollow Pocket Inner Shadow Cavity */}
                <div className="absolute inset-0 rounded-l-3xl shadow-[inset_30px_0_50px_rgba(0,0,0,0.98)] pointer-events-none" />
              </div>

              {/* Tucked Food Dish Visuals (z-20): Partially exposed food visuals inside right sleeve opening */}
              <div className="absolute inset-0 z-20 preserve-3d flex flex-col justify-center gap-2 pl-4 pr-0">
                {masterDishes.map((item, idx) => {
                  const isSelected = activeIdx === idx;
                  // Vertical staggered offset inside sleeve pocket
                  const topOffset = (idx - 2) * 55;
                  
                  return (
                    <div
                      key={item.id}
                      role="tab"
                      aria-selected={isSelected}
                      aria-label={item.name}
                      tabIndex={0}
                      onClick={() => handleSelectDish(idx)}
                      onKeyDown={(e) => handleKeyDown(e, idx)}
                      className={`absolute right-0 w-[230px] sm:w-[260px] h-20 flex items-center justify-between pl-4 pr-3 rounded-r-2xl border-r-2 border-t border-b cursor-pointer transition-all duration-500 ease-out focus:outline-none ${
                        isSelected
                          ? 'bg-[#2A1515] border-[#D77A4D] shadow-[0_10px_25px_rgba(215,122,77,0.4)] translate-x-6 z-30 ring-1 ring-[#D77A4D]/60'
                          : 'bg-[#160D0D]/90 border-[#3A191A] hover:bg-[#241313] hover:translate-x-3 hover:border-[#D77A4D]/40 z-20 opacity-85 hover:opacity-100'
                      }`}
                      style={{
                        top: `calc(50% + ${topOffset}px - 40px)`,
                        transform: isSelected
                          ? 'translateX(24px) translateZ(30px) scale(1.04)'
                          : `translateX(${isSelected ? 24 : 0}px) translateZ(${10 - idx * 2}px)`
                      }}
                      title={item.name}
                    >
                      {/* Partially Exposed Food Dish Image */}
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className={`w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 p-0.5 shadow-md ${
                          isSelected ? 'border-[#D77A4D] ring-2 ring-[#D77A4D]/50' : 'border-[#3A191A]'
                        }`}>
                          <img
                            src={item.image}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover rounded-full filter contrast-105"
                            onError={(e) => handleImageError(e, item.category)}
                          />
                        </div>

                        <div>
                          <span className={`text-xs font-bold block leading-tight ${
                            isSelected ? 'text-[#F4E5D5]' : 'text-[#B9A9A2]'
                          }`}>
                            {item.name}
                          </span>
                          <span className="text-[11px] font-mono font-extrabold text-[#D77A4D]">
                            ₹{item.price}
                          </span>
                        </div>
                      </div>

                      {/* Subtle Active Indicator Dot */}
                      <span className={`w-2 h-2 rounded-full transition-all ${
                        isSelected ? 'bg-[#D77A4D] shadow-[0_0_10px_#D77A4D]' : 'bg-transparent'
                      }`} />
                    </div>
                  );
                })}
              </div>

              {/* Front Cover Plate (z-30): Extruded Front Sleeve Cover with Right Cutout Edge */}
              <div 
                className="absolute inset-y-0 left-0 right-14 bg-gradient-to-tr from-[#261414] via-[#1A0E0E] to-[#120A0A] border-l-4 border-t-2 border-b-2 border-[#D77A4D] rounded-l-3xl shadow-[15px_30px_60px_rgba(0,0,0,0.95)] z-30 preserve-3d flex flex-col justify-between p-6 pointer-events-none"
                style={{
                  clipPath: 'polygon(0 0, 88% 0, 100% 15%, 100% 85%, 88% 100%, 0 100%)'
                }}
              >
                {/* Embossed Metallic MHP Logo Emblem */}
                <div className="flex items-center gap-3">
                  <ThreeDLogoEmblem size="medium" />
                  <div>
                    <span className="font-display font-bold text-[#F4E5D5] text-lg block leading-none">
                      MHP SLEEVE
                    </span>
                    <span className="text-[9px] font-extrabold text-[#D77A4D] uppercase tracking-widest block mt-1">
                      AUTHENTIC CAMPUS DISHES
                    </span>
                  </div>
                </div>

                {/* Sleeve Base Foil Stamp */}
                <div className="pt-4 border-t border-[#3A191A] flex items-center justify-between text-[9px] font-extrabold text-[#B9A9A2] tracking-widest uppercase">
                  <span>VFSTR CAMPUS</span>
                  <span className="text-[#D8A04D]">CAMPUS SELECTIONS</span>
                </div>
              </div>

            </div>

          </div>

          {/* ---------------- 2. CENTER / RIGHT: DISH REVEALING OUT OF SLEEVE (LEFT -> RIGHT MOTION) ---------------- */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center relative min-h-[360px] sm:min-h-[460px] preserve-3d">
            
            {/* Stage Pedestal Container */}
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={handleDishClick}
              className="relative w-full max-w-md aspect-[4/3] flex items-center justify-center preserve-3d cursor-pointer select-none group focus:outline-none"
            >
              
              {/* Realistic Soft Contact Shadow Underneath Food */}
              <div 
                className="absolute bottom-6 w-[80%] h-16 rounded-[100%] bg-black/90 filter blur-[22px] pointer-events-none transition-all duration-700" 
                style={{
                  transform: isEmerged ? 'scale(1.1) translateY(10px)' : 'scale(1)',
                  opacity: isEmerged ? 0.95 : 0.75
                }} 
              />

              {/* ---------------- THE EMERGING FOOD VISUAL (LEFT -> RIGHT MOTION) ---------------- */}
              <div
                className="relative z-20 w-full h-full preserve-3d transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) flex items-center justify-center"
                style={{
                  transform: isSwitching
                    ? 'translate3d(-220px, 0, -80px) scale(0.65)' // Physical return INTO sleeve on left
                    : `translate3d(${mouseOffset.x * 0.8}px, ${mouseOffset.y * 0.8 + (isEmerged ? -18 : 0)}px, ${isEmerged ? 60 : 20}px) scale(${isEmerged ? 1.06 : 1})`,
                  opacity: isSwitching ? 0.1 : 1,
                  filter: isEmerged
                    ? 'drop-shadow(0 45px 75px rgba(215, 122, 77, 0.45))'
                    : 'drop-shadow(0 25px 45px rgba(0, 0, 0, 0.95))'
                }}
              >
                {/* Photorealistic Culinary Food Visual */}
                <img
                  src={activeDish.image}
                  alt={`Photorealistic visual of ${activeDish.name}`}
                  className="w-[95%] h-[95%] object-contain filter contrast-[1.04] brightness-[1.02] transition-transform duration-700 group-hover:scale-[1.02]"
                />
              </div>

            </div>

          </div>

          {/* ---------------- 3. RIGHT: INTEGRATED EDITORIAL TYPOGRAPHY & ORDER CTA ---------------- */}
          <div className={`lg:col-span-3 space-y-5 preserve-3d text-center lg:text-left transition-all duration-500 ${
            isSwitching ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'
          }`}>
            
            {/* Category & FoodType Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <span className="px-3.5 py-1 rounded-full bg-[#241313] border border-[#3A191A] text-[#D8A04D] text-xs font-extrabold tracking-wider uppercase">
                {activeDish.category}
              </span>
              <span className={`px-3.5 py-1 rounded-full text-xs font-extrabold tracking-wider uppercase border ${
                activeDish.foodType === 'Non-Veg'
                  ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                  : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
              }`}>
                {activeDish.foodType}
              </span>
              {activeDish.isPopular && (
                <span className="px-3.5 py-1 rounded-full bg-[#D77A4D]/20 text-[#D77A4D] border border-[#D77A4D]/40 text-xs font-extrabold tracking-wider uppercase">
                  POPULAR
                </span>
              )}
            </div>

            {/* Dish Name */}
            <h3 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#F4E5D5] leading-[1.05] drop-shadow-md">
              {activeDish.name}
            </h3>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-[#B9A9A2] font-sans font-normal leading-relaxed max-w-md mx-auto lg:mx-0">
              {activeDish.description}
            </p>

            {/* Price Display */}
            <div className="flex items-baseline justify-center lg:justify-start gap-2 pt-1">
              <span className="text-xs font-bold text-[#B9A9A2] uppercase tracking-wider">Price:</span>
              <span className="text-3xl sm:text-4xl font-mono font-black text-[#D77A4D] drop-shadow-sm">
                ₹ {activeDish.price}
              </span>
            </div>

            {/* Call to Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <Link
                to="/menu"
                className="btn-mhp-primary text-xs px-7 py-3 shadow-xl"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>ORDER THIS DISH</span>
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default CulinaryShowcase;
