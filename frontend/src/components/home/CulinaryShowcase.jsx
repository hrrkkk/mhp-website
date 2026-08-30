import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Sparkles, ChevronRight } from 'lucide-react';
import ThreeDLogoEmblem from '../common/ThreeDLogoEmblem';
import { handleImageError } from '../../utils/imageUtils';

const CulinaryShowcase = ({ featuredItems = [], foodItems = [] }) => {
  // Master List of Featured Dishes mapped from database or fallbacks
  const masterDishes = [
    {
      id: 'dosa',
      name: featuredItems.find(i => i.name?.toLowerCase().includes('karam dosa'))?.name || "Ghee Karam Dosa",
      category: "Breakfast",
      price: featuredItems.find(i => i.name?.toLowerCase().includes('karam dosa'))?.price || 50,
      foodType: "Veg",
      isPopular: true,
      description: "Crispy dosa roasted in pure ghee and finished with spicy karam podi, served with coconut and red karam chutneys.",
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

  const handleSelectDish = (index) => {
    if (index === activeIdx || isSwitching) return;
    setIsSwitching(true);
    setIsEmerged(false);

    setTimeout(() => {
      setActiveIdx(index);
      setIsSwitching(false);
    }, 350);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelectDish(index);
    }
  };

  const handleDishClick = () => {
    setIsEmerged(prev => !prev);
  };

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
    <section className="bg-[#FFF7E8] text-[#202522] py-16 sm:py-20 lg:py-24 border-b border-[#7D967E]/30 relative overflow-hidden preserve-3d">
      {/* Ambient Backdrop Highlights */}
      <div className="pointer-events-none absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[36rem] sm:w-[50rem] h-[36rem] sm:h-[50rem] bg-[#F47B20]/10 rounded-full blur-[170px]" />
      <div className="pointer-events-none absolute bottom-4 right-1/4 w-[24rem] sm:w-[32rem] h-[24rem] sm:h-[32rem] bg-[#183A2A]/5 rounded-full blur-[140px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 preserve-3d space-y-10 sm:space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-[#7D967E]/30 pb-6">
          <div>
            <span className="text-xs font-extrabold text-[#F47B20] uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#F47B20]" />
              <span>CAMPUS SPECIALTIES</span>
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#183A2A] mt-1">
              Popular Campus Favorites
            </h2>
          </div>

          <Link
            to="/menu"
            className="text-xs font-extrabold text-[#F47B20] hover:text-[#D6620C] flex items-center gap-1.5 transition-colors group"
          >
            <span>Explore Full Menu ({foodItems.length || 206}+ items)</span>
            <ChevronRight className="w-4 h-4 text-[#F47B20]" />
          </Link>
        </div>

        {/* CULINARY SHOWCASE CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center preserve-3d min-h-[500px]">
          
          {/* LEFT: PHYSICAL SLEEVE SELECTOR */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start justify-center preserve-3d z-30">
            <div className="relative w-full max-w-md h-[440px] preserve-3d select-none">
              
              {/* Back Plate Layer */}
              <div className="absolute inset-y-0 left-0 right-12 bg-gradient-to-br from-[#183A2A] via-[#122A1E] to-[#0A1711] border-l-4 border-t-2 border-b-2 border-[#7D967E]/40 rounded-l-3xl shadow-xl z-10 preserve-3d">
                <div className="absolute inset-0 rounded-l-3xl shadow-[inset_30px_0_50px_rgba(0,0,0,0.6)] pointer-events-none" />
              </div>

              {/* Tucked Food Items */}
              <div className="absolute inset-0 z-20 preserve-3d flex flex-col justify-center gap-2 pl-4 pr-0">
                {masterDishes.map((item, idx) => {
                  const isSelected = activeIdx === idx;
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
                          ? 'bg-[#FFFFFF] border-[#F47B20] text-[#202522] shadow-[0_10px_25px_rgba(244,123,32,0.25)] translate-x-6 z-30 ring-2 ring-[#F47B20]/40'
                          : 'bg-[#183A2A]/90 border-[#7D967E]/30 text-[#FFF7E8] hover:bg-[#204935] hover:translate-x-3 z-20 opacity-90'
                      }`}
                      style={{
                        top: `calc(50% + ${topOffset}px - 40px)`,
                        transform: isSelected
                          ? 'translateX(24px) translateZ(30px) scale(1.04)'
                          : `translateX(${isSelected ? 24 : 0}px) translateZ(${10 - idx * 2}px)`
                      }}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className={`w-13 h-13 rounded-full overflow-hidden shrink-0 border-2 p-0.5 shadow-md ${
                          isSelected ? 'border-[#F47B20]' : 'border-[#7D967E]'
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
                            isSelected ? 'text-[#202522]' : 'text-[#FFF7E8]'
                          }`}>
                            {item.name}
                          </span>
                          <span className="text-[11px] font-mono font-extrabold text-[#F47B20]">
                            ₹{item.price}
                          </span>
                        </div>
                      </div>

                      <span className={`w-2.5 h-2.5 rounded-full transition-all ${
                        isSelected ? 'bg-[#F47B20] shadow-[0_0_8px_#F47B20]' : 'bg-transparent'
                      }`} />
                    </div>
                  );
                })}
              </div>

              {/* Front Cover Plate */}
              <div 
                className="absolute inset-y-0 left-0 right-14 bg-gradient-to-tr from-[#183A2A] via-[#204935] to-[#183A2A] border-l-4 border-t-2 border-b-2 border-[#F47B20] rounded-l-3xl shadow-xl z-30 preserve-3d flex flex-col justify-between p-6 pointer-events-none"
                style={{
                  clipPath: 'polygon(0 0, 88% 0, 100% 15%, 100% 85%, 88% 100%, 0 100%)'
                }}
              >
                <div className="flex items-center gap-3">
                  <ThreeDLogoEmblem size="small" className="w-10 h-10" />
                  <div>
                    <span className="font-display font-bold text-[#FFF7E8] text-lg block leading-none">
                      MHP MENU
                    </span>
                    <span className="text-[8px] font-extrabold text-[#F47B20] uppercase tracking-widest block mt-1">
                      VFSTR FAVORITES
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#7D967E]/40 flex items-center justify-between text-[9px] font-extrabold text-[#FFF7E8]/80 tracking-widest uppercase">
                  <span>VFSTR CAMPUS</span>
                  <span className="text-[#F47B20]">FRESH DAILY</span>
                </div>
              </div>

            </div>
          </div>

          {/* CENTER: REVEALED DISH VISUAL */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center relative min-h-[360px] preserve-3d">
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={handleDishClick}
              className="relative w-full max-w-md aspect-[4/3] flex items-center justify-center preserve-3d cursor-pointer select-none group focus:outline-none"
            >
              <div 
                className="absolute bottom-6 w-[80%] h-14 rounded-[100%] bg-[#183A2A]/30 filter blur-[20px] pointer-events-none transition-all duration-700" 
                style={{
                  transform: isEmerged ? 'scale(1.1) translateY(8px)' : 'scale(1)',
                  opacity: isEmerged ? 0.9 : 0.6
                }} 
              />

              <div
                className="relative z-20 w-full h-full preserve-3d transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) flex items-center justify-center"
                style={{
                  transform: isSwitching
                    ? 'translate3d(-200px, 0, -60px) scale(0.7)'
                    : `translate3d(${mouseOffset.x * 0.8}px, ${mouseOffset.y * 0.8 + (isEmerged ? -16 : 0)}px, ${isEmerged ? 50 : 20}px) scale(${isEmerged ? 1.05 : 1})`,
                  opacity: isSwitching ? 0.1 : 1,
                  filter: isEmerged
                    ? 'drop-shadow(0 35px 55px rgba(244, 123, 32, 0.35))'
                    : 'drop-shadow(0 20px 35px rgba(24, 58, 42, 0.25))'
                }}
              >
                <img
                  src={activeDish.image}
                  alt={`Photorealistic visual of ${activeDish.name}`}
                  className="w-[95%] h-[95%] object-contain filter contrast-[1.04] brightness-[1.02] transition-transform duration-700 group-hover:scale-[1.02]"
                />
              </div>
            </div>
          </div>

          {/* RIGHT: EDITORIAL & ORDER CTA */}
          <div className={`lg:col-span-3 space-y-5 preserve-3d text-center lg:text-left transition-all duration-500 ${
            isSwitching ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'
          }`}>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <span className="px-3.5 py-1 rounded-full bg-[#183A2A] text-[#FFF7E8] text-xs font-extrabold tracking-wider uppercase">
                {activeDish.category}
              </span>
              <span className={`px-3.5 py-1 rounded-full text-xs font-extrabold tracking-wider uppercase border ${
                activeDish.foodType === 'Non-Veg'
                  ? 'bg-rose-100 text-rose-800 border-rose-300'
                  : 'bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}>
                {activeDish.foodType}
              </span>
            </div>

            <h3 className="font-display font-bold text-3xl sm:text-4xl text-[#183A2A] leading-[1.05]">
              {activeDish.name}
            </h3>

            <p className="text-xs sm:text-sm text-[#525B56] font-sans leading-relaxed max-w-md mx-auto lg:mx-0">
              {activeDish.description}
            </p>

            <div className="flex items-baseline justify-center lg:justify-start gap-2 pt-1">
              <span className="text-xs font-bold text-[#7D967E] uppercase tracking-wider">Price:</span>
              <span className="text-3xl sm:text-4xl font-mono font-black text-[#F47B20]">
                ₹ {activeDish.price}
              </span>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <Link
                to="/menu"
                className="btn-mhp-primary text-xs px-7 py-3 shadow-lg"
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

