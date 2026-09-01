import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { getImageUrl } from '../../utils/imageUtils';
import { FALLBACK_FOOD_ITEMS } from '../../data/fallbackMenu';
import { 
  ShoppingBag, 
  Clock, 
  Plus, 
  Check, 
  ArrowRight,
  Utensils,
  Users,
  MapPin,
  Flame,
  Store
} from 'lucide-react';

const TodayAtMhpSection = ({ featuredItems = [], orderingSlot = null }) => {
  const { addToCart } = useCart();
  const toast = useToast();
  const navigate = useNavigate();
  const [addedItems, setAddedItems] = useState({});

  const displayItems = (featuredItems && featuredItems.length > 0) ? featuredItems : FALLBACK_FOOD_ITEMS.slice(0, 4);

  const isOpen = orderingSlot?.isOpen !== false;

  const handleAddToCart = (e, item) => {
    e.stopPropagation();
    addToCart(item);
    
    setAddedItems(prev => ({ ...prev, [item._id || item.foodId]: true }));
    if (toast?.showToast) {
      toast.showToast('success', `Added ${item.name} to your order!`);
    }

    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [item._id || item.foodId]: false }));
    }, 1500);
  };

  const handleQuickOrderNow = (e, item) => {
    e.stopPropagation();
    addToCart(item);
    navigate('/cart');
  };

  return (
    <section className="bg-[#183A2A] text-[#FFF7E8] py-14 px-4 sm:px-6 lg:px-8 border-b border-[#7D967E]/30 relative overflow-hidden preserve-3d">
      
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-[#F47B20]/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 bg-[#F47B20]/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        {/* ================= 1. TODAY AT MHP USEFUL INFO DASHBOARD CARD ================= */}
        <div className="bg-[#FFF7E8]/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-[#7D967E]/40 shadow-2xl space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#7D967E]/30 pb-4">
            <div>
              <span className="text-[10px] font-black text-[#F47B20] tracking-widest uppercase block">
                LIVE CAMPUS DASHBOARD
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-[#FFF7E8] tracking-tight">
                TODAY AT MHP
              </h2>
            </div>

            {/* Live Open / Closed Status Indicator */}
            <div className="flex items-center gap-2 shrink-0">
              <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold border ${
                isOpen 
                  ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50 shadow-md shadow-emerald-900/30' 
                  : 'bg-rose-950/90 text-rose-300 border-rose-500/50'
              }`}>
                <span className={`w-2.5 h-2.5 rounded-full ${isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                <span>{isOpen ? '🟢 Open Now' : '🔴 Closed'}</span>
              </span>
            </div>
          </div>

          {/* Quick Metrics Bar & Real-World Information */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            
            {/* 📍 Location */}
            <div className="bg-[#183A2A]/90 p-4 rounded-2xl border border-[#7D967E]/40 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F47B20]/20 text-[#F47B20] flex items-center justify-center shrink-0 font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-extrabold text-[#7D967E] uppercase block tracking-wider">CAMPUS LOCATION</span>
                <h4 className="text-sm font-extrabold text-[#FFF7E8]">📍 MHP — VFSTR Campus</h4>
                <p className="text-[11px] text-[#7D967E] font-medium">Near N Block · Vadlamudi, Guntur AP</p>
              </div>
            </div>

            {/* 🕐 Operating Timings */}
            <div className="bg-[#183A2A]/90 p-4 rounded-2xl border border-[#7D967E]/40 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F47B20]/20 text-[#F47B20] flex items-center justify-center shrink-0 font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-extrabold text-[#7D967E] uppercase block tracking-wider">CAFETERIA HOURS</span>
                <h4 className="text-sm font-extrabold text-[#FFF7E8]">🕐 9:00 AM – 6:00 PM</h4>
                <p className="text-[11px] text-[#FFF7E8]/90 font-bold">
                  Mon–Sat <span className="text-[#7D967E] font-normal">| Sunday (when college open)</span>
                </p>
              </div>
            </div>

            {/* 📞 Contact / Help Desk for Order Problems */}
            <div className="bg-[#183A2A]/90 p-4 rounded-2xl border-2 border-[#F47B20]/50 flex items-start gap-3 shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-[#F47B20] text-white flex items-center justify-center shrink-0 font-bold shadow-md">
                <Store className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-black text-[#F47B20] uppercase block tracking-wider">ORDER PROBLEM? CONTACT HELP</span>
                <a href="tel:+919123456789" className="text-sm font-extrabold text-[#FFF7E8] hover:text-[#F47B20] block transition-colors">
                  📞 +91 91234 56789
                </a>
                <p className="text-[11px] text-[#7D967E] font-medium">Parcel & Billing Counter near N Block</p>
              </div>
            </div>

          </div>

          {/* Primary Action Button: ORDER FOOD */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#183A2A]/60 p-4 rounded-2xl border border-[#7D967E]/30">
            <div className="text-xs text-[#FFF7E8]/80 font-medium">
              <span>Ordering Window: <strong className="text-[#F47B20]">{orderingSlot?.orderingWindow || '9:30 AM – 10:30 AM'}</strong></span>
              <span className="mx-2 text-[#7D967E]">|</span>
              <span>Parcel Pickup: <strong className="text-[#FFF7E8]">{orderingSlot?.pickupWindow || '12:00 PM – 1:00 PM'}</strong></span>
            </div>

            <Link
              to="/menu?mode=delivery"
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#F47B20] hover:bg-[#FF882E] text-white text-xs sm:text-sm font-black tracking-wider flex items-center justify-center gap-2.5 shadow-xl shadow-[#F47B20]/40 transition-all hover:scale-105 shrink-0"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>ORDER FOOD</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

        {/* ================= 2. TODAY'S QUICK ORDER DISHES GRID ================= */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#F47B20] fill-[#F47B20]" />
              <h3 className="font-display font-extrabold text-xl sm:text-2xl text-[#FFF7E8]">
                Today's Special Dishes
              </h3>
            </div>
            <Link to="/menu" className="text-xs font-bold text-[#F47B20] hover:underline flex items-center gap-1">
              <span>View All Menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {displayItems && displayItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayItems.map((item) => {
                const isAdded = addedItems[item._id || item.foodId];
                const isNonVeg = item.foodType === 'Non-Veg';

                return (
                  <div
                    key={item._id || item.foodId}
                    className="bg-[#204935]/80 hover:bg-[#204935] border border-[#7D967E]/40 hover:border-[#F47B20]/60 rounded-3xl p-4 flex flex-col justify-between transition-all duration-300 shadow-xl group hover:-translate-y-1"
                  >
                    <div className="space-y-3">
                      {/* Item Image */}
                      <div className="relative h-44 rounded-2xl overflow-hidden bg-[#183A2A]">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";
                          }}
                        />
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#183A2A]/90 border border-[#7D967E]/40 text-[10px] font-bold text-[#FFF7E8] backdrop-blur-xs">
                          <span className={`w-2 h-2 rounded-full ${isNonVeg ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                          <span>{item.foodType || 'Veg'}</span>
                        </div>
                        
                        {item.popular && (
                          <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-[#F47B20] text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                            POPULAR
                          </div>
                        )}
                      </div>

                      {/* Item Details */}
                      <div>
                        <span className="text-[10px] font-extrabold text-[#7D967E] uppercase tracking-wider block">
                          {item.category || 'Special'}
                        </span>
                        <h3 className="font-display font-extrabold text-lg text-[#FFF7E8] group-hover:text-[#F47B20] transition-colors line-clamp-1">
                          {item.name}
                        </h3>
                        {item.description && (
                          <p className="text-xs text-[#7D967E] line-clamp-2 mt-1 font-medium">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Price & Action CTAs */}
                    <div className="pt-4 mt-4 border-t border-[#7D967E]/30 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-[#7D967E] uppercase block font-bold">PRICE</span>
                        <span className="font-display font-extrabold text-xl text-[#F47B20]">
                          ₹{item.price || item.unitPrice || 0}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleAddToCart(e, item)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                            isAdded
                              ? 'bg-emerald-600 text-white shadow-md'
                              : 'bg-[#183A2A] hover:bg-[#F47B20] text-[#FFF7E8] hover:text-white border border-[#7D967E]/40'
                          }`}
                          title="Add to Cart"
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>ADDED</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5 text-[#F47B20] group-hover:text-white" />
                              <span>ADD</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={(e) => handleQuickOrderNow(e, item)}
                          className="px-3.5 py-2 rounded-xl bg-[#F47B20] hover:bg-[#FF882E] text-white text-xs font-extrabold shadow-md transition-all flex items-center gap-1 hover:scale-105"
                        >
                          <span>ORDER</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-[#204935]/40 rounded-3xl border border-[#7D967E]/30 space-y-3">
              <Utensils className="w-10 h-10 text-[#F47B20] mx-auto opacity-80" />
              <p className="text-sm font-bold text-[#FFF7E8]">Loading today's fresh menu specials...</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default TodayAtMhpSection;
