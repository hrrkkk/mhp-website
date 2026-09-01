import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Sparkles, Utensils, Check, Plus } from 'lucide-react';
import ThreeDLogoEmblem from '../common/ThreeDLogoEmblem';
import { handleImageError } from '../../utils/imageUtils';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

const SignatureDishesSection = ({ featuredItems = [] }) => {
  const { addToCart } = useCart();
  const toast = useToast();
  const [isAdded, setIsAdded] = useState(false);

  const signatureDishes = [
    {
      id: 'ghee_karam_dosa',
      foodId: 'ghee_karam_dosa',
      name: featuredItems.find(i => i.name?.toLowerCase().includes('karam dosa'))?.name || "Ghee Karam Dosa",
      category: "BREAKFAST",
      foodType: "Veg",
      price: featuredItems.find(i => i.name?.toLowerCase().includes('karam dosa'))?.price || 50,
      description: "Crispy dosa roasted in pure ghee and finished with our signature spicy karam podi.",
      image: "/assets/ghee_karam_dosa_hero.jpg"
    },
    {
      id: 'masala_dosa',
      foodId: 'masala_dosa',
      name: featuredItems.find(i => i.name?.toLowerCase().includes('masala dosa'))?.name || "Special Masala Dosa",
      category: "BREAKFAST",
      foodType: "Veg",
      price: featuredItems.find(i => i.name?.toLowerCase().includes('masala dosa'))?.price || 60,
      description: "Crispy golden dosa filled with authentic spiced potato masala and served with traditional sambar.",
      image: "/assets/masala_dosa_hero.jpg"
    },
    {
      id: 'ghee_karam_idly',
      foodId: 'ghee_karam_idly',
      name: featuredItems.find(i => i.name?.toLowerCase().includes('idly') || i.name?.toLowerCase().includes('idli'))?.name || "Ghee Karam Idly",
      category: "BREAKFAST",
      foodType: "Veg",
      price: featuredItems.find(i => i.name?.toLowerCase().includes('idly'))?.price || 40,
      description: "Soft, fluffy steamed idlis tossed in pure desi ghee and seasoned with spiced karam podi.",
      image: "/assets/ghee_karam_idly_hero.jpg"
    },
    {
      id: 'chicken_biryani',
      foodId: 'chicken_biryani',
      name: featuredItems.find(i => i.category === 'Biryani' || i.name?.toLowerCase().includes('biryani'))?.name || "Chicken Dum Biryani",
      category: "BIRYANI",
      foodType: "Non-Veg",
      price: featuredItems.find(i => i.category === 'Biryani')?.price || 179,
      description: "Aromatic Hyderabadi chicken dum biryani prepared with aged basmati rice and traditional spices.",
      image: "/assets/biryani_hero.jpg"
    },
    {
      id: 'caramel_shake',
      foodId: 'caramel_shake',
      name: featuredItems.find(i => i.category === 'Shakes' || i.name?.toLowerCase().includes('shake'))?.name || "Chocolate Caramel Shake",
      category: "SHAKES",
      foodType: "Veg",
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
    }, 400);
  };

  const handleAddToCart = () => {
    addToCart(selectedDish);
    setIsAdded(true);
    if (toast?.showToast) {
      toast.showToast('success', `Added ${selectedDish.name} (₹${selectedDish.price}) to cart!`);
    }
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  return (
    <section className="bg-[#FFF7E8] text-[#202522] py-16 lg:py-24 border-b border-[#7D967E]/20 relative overflow-hidden font-sans select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* SECTION HEADER WITH 3-STEP USER GUIDANCE */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold text-[#F47B20] uppercase tracking-widest block font-sans">
            MHP CAMPUS FAVORITES
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-[#183A2A] leading-[1.15] tracking-tight">
            SIGNATURE DISHES
          </h2>
          
          {/* 3-Step Clear Micro-Flow: Swipe → Choose a dish → Add to cart */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#183A2A]/5 border border-[#7D967E]/30 text-xs font-extrabold text-[#183A2A]">
            <span>Tap / Select Card</span>
            <span className="text-[#F47B20]">→</span>
            <span>Choose Dish</span>
            <span className="text-[#F47B20]">→</span>
            <span className="text-[#F47B20] font-black">Add to Cart</span>
          </div>
        </div>

        {/* CORE SIDE-OPENING SLEEVE COMPOSITION GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center pt-2">
          
          {/* ================= LEFT + CENTER: EMBOSSED PHYSICAL SLEEVE & EMERGING DISH (Col-Span 7) ================= */}
          <div className="lg:col-span-7 relative flex flex-col md:flex-row items-center justify-start min-h-[24rem] sm:min-h-[30rem] px-2 py-4">
            
            {/* PHYSICAL ENVELOPE SLEEVE (Left side fixed ornate container) */}
            <div className="relative w-full max-w-xs sm:max-w-[17rem] bg-gradient-to-b from-[#10271C] via-[#183A2A] to-[#0D2017] rounded-3xl border-2 border-[#F47B20]/40 shadow-xl p-6 z-20 space-y-5 border-r-0 relative overflow-visible">
              
              {/* Sleeve Gold Trim Accent */}
              <div 
                className="absolute top-0 bottom-0 -right-5 w-8 bg-[#183A2A] border-2 border-l-0 border-[#F47B20]/50 rounded-r-3xl z-30 shadow-md flex flex-col items-center justify-center pointer-events-none"
                style={{ clipPath: 'polygon(0 0, 100% 15%, 100% 85%, 0 100%)' }}
              />

              {/* Central Emblem */}
              <div className="text-center space-y-1.5 border-b border-[#7D967E]/30 pb-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#183A2A] border-2 border-[#F47B20] flex items-center justify-center shadow-md p-1">
                  <ThreeDLogoEmblem size="small" className="w-9 h-9" />
                </div>
                <div>
                  <span className="font-display font-black text-[#FFF7E8] text-sm tracking-wider block">
                    MHP MENU SLEEVE
                  </span>
                  <span className="text-[8px] text-[#F47B20] font-extrabold tracking-widest uppercase block">
                    TAP ANY CARD BELOW
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
                      className={`relative h-40 w-12 sm:w-14 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border shadow-md flex-shrink-0 ${
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
                      
                      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 writing-mode-vertical text-[9px] font-extrabold text-[#FFF7E8] tracking-wider uppercase whitespace-nowrap rotate-180">
                        {dish.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Sleeve Footer Clear Action Text */}
              <div className="pt-2 text-center border-t border-[#7D967E]/30">
                <span className="text-[10px] font-black text-[#F47B20] tracking-wider uppercase block">
                  👆 TAP CARD TO SWITCH DISH
                </span>
              </div>

            </div>

            {/* SELECTED DISH PREVIEW IMAGE */}
            <div className="relative md:absolute md:left-[36%] lg:left-[38%] z-30 mt-6 md:mt-0 transition-all duration-500 ease-out">
              <div 
                className={`relative w-64 sm:w-80 h-64 sm:h-80 rounded-3xl overflow-hidden transition-all duration-500 ease-out shadow-xl border-4 border-[#FFF7E8] bg-[#FFF7E8] ${
                  isSliding 
                    ? 'opacity-40 scale-95' 
                    : 'opacity-100 scale-100 shadow-[0_20px_40px_rgba(244,123,32,0.25)]'
                }`}
              >
                <img
                  src={selectedDish.image}
                  alt={selectedDish.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover filter contrast-[1.06]"
                  onError={(e) => handleImageError(e, selectedDish.category)}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-4 left-4 bg-[#183A2A]/90 text-[#FFF7E8] text-[10px] font-extrabold tracking-wider uppercase px-3.5 py-1 rounded-full border border-[#F47B20]/50 backdrop-blur-md shadow-md">
                  ★ SELECTED DISH
                </div>
              </div>
            </div>

          </div>

          {/* ================= RIGHT COLUMN: SELECTED DISH DETAILS & VERY OBVIOUS ADD TO CART BUTTON ================= */}
          <div className="lg:col-span-5 space-y-6 pt-4 lg:pt-0">
            <div className={`space-y-6 transition-all duration-300 ${
              isSliding ? 'opacity-40 translate-x-2' : 'opacity-100 translate-x-0'
            }`}>
              
              {/* Category & Type */}
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#183A2A] text-[#FFF7E8] text-xs font-extrabold flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-[#F47B20]" />
                  <span>{selectedDish.category}</span>
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                  selectedDish.foodType === 'Non-Veg'
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}>
                  {selectedDish.foodType}
                </span>
              </div>

              {/* Dish Name */}
              <h3 className="font-display font-extrabold text-3xl sm:text-5xl text-[#183A2A] leading-[1.1] tracking-tight">
                {selectedDish.name}
              </h3>

              {/* Short Description */}
              <p className="text-sm text-[#202522]/85 font-sans font-medium leading-relaxed max-w-md">
                {selectedDish.description}
              </p>

              {/* Price Display */}
              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-sm text-[#7D967E] font-bold uppercase tracking-wider">PRICE:</span>
                <span className="text-3xl sm:text-4xl font-mono font-black text-[#F47B20]">
                  ₹ {selectedDish.price}
                </span>
              </div>

              {/* ================= PROMINENT ADD TO CART + PRICE BUTTON ================= */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                
                {/* VERY OBVIOUS ADD TO CART + ₹PRICE CTA */}
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-4 px-8 rounded-2xl text-sm sm:text-base font-black tracking-wider flex items-center justify-center gap-3 shadow-xl transition-all hover:scale-105 active:scale-100 ${
                    isAdded
                      ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                      : 'bg-[#F47B20] hover:bg-[#FF882E] text-white shadow-[#F47B20]/40'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>ADDED TO CART!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>ADD TO CART • ₹{selectedDish.price}</span>
                    </>
                  )}
                </button>

                {/* VIEW FULL MENU SECONDARY */}
                <Link
                  to="/menu"
                  className="px-6 py-4 rounded-2xl bg-[#183A2A] hover:bg-[#204935] text-[#FFF7E8] text-xs sm:text-sm font-extrabold tracking-wider flex items-center justify-center gap-2 border border-[#7D967E]/40 transition-all shrink-0"
                >
                  <span>VIEW MENU</span>
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
