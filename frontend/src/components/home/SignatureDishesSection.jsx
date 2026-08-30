import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Sparkles, Utensils } from 'lucide-react';
import ThreeDLogoEmblem from '../common/ThreeDLogoEmblem';
import { handleImageError } from '../../utils/imageUtils';

/**
 * SignatureDishesSection — Redesigned into a Luxury Side-Opening Food Envelope Experience
 * 
 * Directly inspired by the reference composition:
 * - LEFT: Deep Forest Green (#183A2A) Ornate Physical Food Sleeve with embossed pattern, 
 *         gold trim, gold MHP emblem, and 4-5 vertical protruding dish cards tucked into the side slit.
 * - CENTER: Selected dish physically sliding OUT HORIZONTALLY FROM THE SIDE SLIT of the sleeve.
 * - RIGHT: Refined typography showing dish label, title, description, price (₹), badges, and Order CTA.
 * - PALETTE: Strict MHP Palette (#FFF7E8 Warm Cream background, #183A2A Deep Forest Green, #F47B20 Food Orange).
 */
const SignatureDishesSection = ({ featuredItems = [] }) => {
  const signatureDishes = [
    {
      id: 'ghee_karam_dosa',
      name: featuredItems.find(i => i.name?.toLowerCase().includes('karam dosa'))?.name || "Ghee Karam Dosa",
      category: "BREAKFAST",
      foodType: "VEG",
      price: featuredItems.find(i => i.name?.toLowerCase().includes('karam dosa'))?.price || 50,
      description: "Crispy dosa roasted in pure ghee and finished with our signature spicy karam podi.",
      image: "/assets/ghee_karam_dosa_hero.jpg"
    },
    {
      id: 'masala_dosa',
      name: featuredItems.find(i => i.name?.toLowerCase().includes('masala dosa'))?.name || "Special Masala Dosa",
      category: "BREAKFAST",
      foodType: "VEG",
      price: featuredItems.find(i => i.name?.toLowerCase().includes('masala dosa'))?.price || 60,
      description: "Crispy golden dosa filled with authentic spiced potato masala and served with traditional sambar.",
      image: "/assets/masala_dosa_hero.jpg"
    },
    {
      id: 'ghee_karam_idly',
      name: featuredItems.find(i => i.name?.toLowerCase().includes('idly') || i.name?.toLowerCase().includes('idli'))?.name || "Ghee Karam Idly",
      category: "BREAKFAST",
      foodType: "VEG",
      price: featuredItems.find(i => i.name?.toLowerCase().includes('idly'))?.price || 40,
      description: "Soft, fluffy steamed idlis tossed in pure desi ghee and seasoned with spiced karam podi.",
      image: "/assets/ghee_karam_idly_hero.jpg"
    },
    {
      id: 'chicken_biryani',
      name: featuredItems.find(i => i.category === 'Biryani' || i.name?.toLowerCase().includes('biryani'))?.name || "Chicken Dum Biryani",
      category: "BIRYANI",
      foodType: "NON-VEG",
      price: featuredItems.find(i => i.category === 'Biryani')?.price || 179,
      description: "Aromatic Hyderabadi chicken dum biryani prepared with aged basmati rice and traditional spices.",
      image: "/assets/biryani_hero.jpg"
    },
    {
      id: 'caramel_shake',
      name: featuredItems.find(i => i.category === 'Shakes' || i.name?.toLowerCase().includes('shake'))?.name || "Chocolate Caramel Shake",
      category: "SHAKES",
      foodType: "VEG",
      price: featuredItems.find(i => i.category === 'Shakes')?.price || 80,
      description: "Rich thick chocolate caramel milkshake topped with fluffy whipped cream and dark cocoa shavings.",
      image: "/assets/milkshake_hero.jpg"
    }
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);

  const selectedDish = signatureDishes[selectedIndex];

  const handleSelectDish = (index) => {
    if (index === selectedIndex || isSliding) return;
    setIsSliding(true);
    setSelectedIndex(index);
    setTimeout(() => {
      setIsSliding(false);
    }, 600);
  };

  return (
    <section className="bg-[#FFF7E8] text-[#202522] py-20 lg:py-28 border-b border-[#7D967E]/20 relative overflow-hidden font-sans select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* SECTION HEADER */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold text-[#F47B20] uppercase tracking-widest block font-sans">
            MHP CAMPUS FAVORITES
          </span>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-[#183A2A] leading-[1.15] tracking-tight">
            SIGNATURE DISHES
          </h2>
          <p className="text-xs sm:text-sm text-[#7D967E] font-sans font-semibold">
            Discover the flavors everyone comes back for.
          </p>
        </div>

        {/* CORE SIDE-OPENING SLEEVE COMPOSITION GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center pt-2">
          
          {/* ================= LEFT + CENTER: EMBOSSED PHYSICAL SLEEVE & EMERGING DISH (Col-Span 7) ================= */}
          <div className="lg:col-span-7 relative flex flex-col md:flex-row items-center justify-start min-h-[26rem] sm:min-h-[32rem] px-2 py-4">
            
            {/* PHYSICAL ENVELOPE SLEEVE (Left side fixed ornate container) */}
            <div className="relative w-full max-w-xs sm:max-w-[17rem] bg-gradient-to-b from-[#10271C] via-[#183A2A] to-[#0D2017] rounded-3xl border-2 border-[#F47B20]/40 shadow-2xl p-6 z-20 space-y-6 border-r-0 relative overflow-visible">
              
              {/* Sleeve Gold Trim & Curved Slit Cutout Accent */}
              <div 
                className="absolute top-0 bottom-0 -right-5 w-8 bg-[#183A2A] border-2 border-l-0 border-[#F47B20]/50 rounded-r-3xl z-30 shadow-xl flex flex-col items-center justify-center pointer-events-none"
                style={{ clipPath: 'polygon(0 0, 100% 15%, 100% 85%, 0 100%)' }}
              />

              {/* Central Gold MHP Emblem & Crown Branding */}
              <div className="text-center space-y-2 border-b border-[#7D967E]/30 pb-5">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#183A2A] border-2 border-[#F47B20] flex items-center justify-center shadow-lg p-1">
                  <ThreeDLogoEmblem size="small" className="w-10 h-10" />
                </div>
                <div>
                  <span className="font-display font-black text-[#FFF7E8] text-base tracking-wider block">
                    MHP
                  </span>
                  <span className="text-[8px] text-[#F47B20] font-extrabold tracking-widest uppercase block">
                    VFSTR CAMPUS · SLEEVE
                  </span>
                </div>
              </div>

              {/* Stacked Vertical Dish Cards Tucked Inside Sleeve Slit */}
              <div className="relative h-44 flex items-center justify-center gap-1.5 overflow-hidden px-1">
                {signatureDishes.map((dish, idx) => {
                  const isSelected = selectedIndex === idx;

                  return (
                    <div
                      key={dish.id}
                      onClick={() => handleSelectDish(idx)}
                      role="button"
                      tabIndex={0}
                      className={`relative h-40 w-12 sm:w-14 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 border shadow-lg flex-shrink-0 ${
                        isSelected
                          ? 'border-[#F47B20] ring-2 ring-[#F47B20] -translate-y-2 z-30 opacity-100 scale-105'
                          : 'border-[#7D967E]/40 hover:-translate-y-1 opacity-70 hover:opacity-90 z-20'
                      }`}
                    >
                      <img
                        src={dish.image}
                        alt={dish.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover filter contrast-[1.05]"
                        onError={(e) => handleImageError(e, dish.category)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      
                      {/* Vertical Dish Name along card edge */}
                      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 writing-mode-vertical text-[9px] font-extrabold text-[#FFF7E8] tracking-wider uppercase whitespace-nowrap rotate-180">
                        {dish.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Sleeve Footer Guide Text */}
              <div className="pt-2 text-center border-t border-[#7D967E]/30">
                <span className="text-[10px] font-extrabold text-[#F47B20] tracking-widest uppercase block">
                  ← SLIDE TO OPEN
                </span>
                <span className="text-[9px] text-[#FFF7E8]/70 font-semibold block mt-0.5">
                  👆 Tap a dish card from sleeve
                </span>
              </div>

            </div>

            {/* EMERGING HERO DISH (Physically slides OUT FROM THE SIDE SLIT of the sleeve into center) */}
            <div className="relative md:absolute md:left-[36%] lg:left-[38%] z-30 mt-6 md:mt-0 transition-all duration-700 ease-out">
              <div 
                className={`relative w-64 sm:w-80 h-64 sm:h-80 rounded-3xl overflow-hidden transition-all duration-700 ease-out shadow-2xl border-4 border-[#FFF7E8] bg-[#FFF7E8] ${
                  isSliding 
                    ? 'translate-x-16 opacity-30 scale-95' 
                    : 'translate-x-0 opacity-100 scale-105 shadow-[0_25px_60px_rgba(244,123,32,0.35)]'
                }`}
              >
                <img
                  src={selectedDish.image}
                  alt={selectedDish.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover filter contrast-[1.06]"
                  onError={(e) => handleImageError(e, selectedDish.category)}
                />
                
                {/* Soft Edge Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                {/* Floating Badge */}
                <div className="absolute top-4 left-4 bg-[#183A2A]/90 text-[#FFF7E8] text-[10px] font-extrabold tracking-wider uppercase px-3.5 py-1 rounded-full border border-[#F47B20]/50 backdrop-blur-md shadow-md">
                  ★ SELECTED SIGNATURE
                </div>
              </div>
            </div>

          </div>

          {/* ================= RIGHT COLUMN: SELECTED DISH TYPOGRAPHY & DETAILS (Col-Span 5) ================= */}
          <div className="lg:col-span-5 space-y-6 pt-4 lg:pt-0">
            <div className={`space-y-6 transition-all duration-500 ${
              isSliding ? 'opacity-30 translate-x-4' : 'opacity-100 translate-x-0'
            }`}>
              
              {/* Small Eyebrow Label */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-[#F47B20] tracking-widest uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>SIGNATURE DISH</span>
                </span>
              </div>

              {/* Dish Name */}
              <h3 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#183A2A] leading-[1.05] tracking-tight">
                {selectedDish.name}
              </h3>

              {/* Accent Line */}
              <div className="w-16 h-1 bg-[#F47B20] rounded-full" />

              {/* Short Description */}
              <p className="text-sm sm:text-base text-[#202522]/85 font-sans font-medium leading-relaxed max-w-md">
                {selectedDish.description}
              </p>

              {/* Price & Badges */}
              <div className="pt-2 space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-mono font-black text-[#F47B20]">
                    ₹ {selectedDish.price}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold border border-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    <span>{selectedDish.foodType}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#183A2A] text-[#FFF7E8] text-[11px] font-extrabold">
                    <Utensils className="w-3 h-3 text-[#F47B20]" />
                    <span>{selectedDish.category}</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-wrap items-center gap-4">
                <Link
                  to="/menu?mode=delivery"
                  className="btn-mhp-primary text-xs py-3.5 px-7 rounded-full shadow-xl inline-flex items-center gap-2 font-extrabold tracking-wider uppercase hover:scale-105 transition-all"
                >
                  <ShoppingBag className="w-4 h-4 text-white" />
                  <span>ORDER NOW</span>
                </Link>

                <Link
                  to="/menu"
                  className="btn-mhp-secondary text-xs py-3.5 px-6 rounded-full inline-flex items-center gap-2 font-extrabold tracking-wider uppercase"
                >
                  <span>EXPLORE FULL MENU</span>
                  <ArrowRight className="w-4 h-4 text-[#F47B20]" />
                </Link>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default SignatureDishesSection;
