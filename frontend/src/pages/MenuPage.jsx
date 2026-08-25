import React, { useEffect, useState } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import ThreeDTiltCard from '../components/common/ThreeDTiltCard';
import ThreeDLogoEmblem from '../components/common/ThreeDLogoEmblem';
import ThreeDSpatialCard from '../components/common/ThreeDSpatialCard';
import { getImageUrl, handleImageError } from '../utils/imageUtils';
import { 
  Search, 
  ShoppingBag, 
  Plus, 
  Minus, 
  CheckCircle2, 
  Clock, 
  Utensils, 
  Truck, 
  AlertCircle,
  Sparkles,
  MapPin,
  ArrowRight,
  Eye,
  X,
  CreditCard,
  ChefHat,
  Trash2
} from 'lucide-react';

const MenuPage = () => {
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalCartCount, totalCartAmount } = useCart();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const urlMode = searchParams.get('mode');

  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected Mode: null (Landing) | 'dining' | 'delivery'
  const [selectedMode, setSelectedMode] = useState(urlMode || null);

  const location = useLocation();

  useEffect(() => {
    if (urlMode && (urlMode === 'dining' || urlMode === 'delivery')) {
      setSelectedMode(urlMode);
    }
  }, [urlMode]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('openCart') === 'true') {
      setCartModalOpen(true);
      if (!selectedMode) {
        setSelectedMode('delivery');
      }
    }
  }, [location.search]);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState('All');
  const [foodTypeFilter, setFoodTypeFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Item options selection
  const [itemOptions, setItemOptions] = useState({});

  // Ordering Slot Info
  const [orderingSlot, setOrderingSlot] = useState(null);

  // Cart Modal & Checkout Form State
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    pickupPoint: 'N Block',
    notes: '',
    customerName: user?.name || '',
    customerPhone: user?.phone || '',
    studentId: user?.studentId || user?._id || ''
  });
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  // Compute parcel charge: ₹10 per item, EXCEPT Shakes, Mocktails, Juices
  const parcelCharge = cartItems.reduce((acc, item) => {
    const cat = (item.category || '').toLowerCase();
    const isExempt = cat.includes('shake') || cat.includes('mocktail') || cat.includes('juice');
    return acc + (isExempt ? 0 : 10 * item.quantity);
  }, 0);

  const grandTotalAmount = totalCartAmount + parcelCharge;

  useEffect(() => {
    fetchFoodItems();
    fetchOrderingSlot();
  }, []);

  const fetchFoodItems = async () => {
    try {
      setLoading(true);
      const res = await api.get('/future-menu/items');
      setFoodItems(res.data);
    } catch (err) {
      console.error('Failed to load menu items:', err);
      showToast('error', 'Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderingSlot = async () => {
    try {
      const res = await api.get('/ordering-slot');
      setOrderingSlot(res.data);
    } catch (err) {
      console.error('Failed to load ordering slot:', err);
    }
  };

  const categories = React.useMemo(() => {
    const cats = ['All'];
    foodItems.forEach(item => {
      if (item.category && !cats.includes(item.category)) {
        cats.push(item.category);
      }
    });
    return cats;
  }, [foodItems]);

  const subcategories = React.useMemo(() => {
    if (selectedCategory === 'All') return ['All'];
    const subs = ['All'];
    foodItems
      .filter(item => item.category === selectedCategory && item.subcategory)
      .forEach(item => {
        if (!subs.includes(item.subcategory)) {
          subs.push(item.subcategory);
        }
      });
    return subs;
  }, [foodItems, selectedCategory]);

  const filteredItems = React.useMemo(() => {
    return foodItems.filter(item => {
      // 1. Availability check: safely handle isAvailable (boolean / string) and available
      const isAvail = item.isAvailable !== false && item.isAvailable !== 'false' && item.available !== false && item.available !== 'false';
      if (!isAvail) return false;

      // 2. Mode filtering (Dining vs Delivery)
      // Dining mode is VIEW-ONLY and shows all dining-eligible items
      // Delivery mode shows delivery-eligible items and excludes Breakfast per business rule
      if (selectedMode === 'delivery') {
        if (item.serviceType === 'dining') return false;
        if (item.category === 'Breakfast') return false;
      } else if (selectedMode === 'dining') {
        if (item.serviceType === 'delivery') return false;
      }

      // 3. Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;

      // 4. Subcategory filter
      if (selectedSubcategory !== 'All' && item.subcategory !== selectedSubcategory) return false;

      // 5. Veg / Non-Veg / Seafood filter
      if (foodTypeFilter !== 'All') {
        const itemFt = (item.foodType || '').toLowerCase();
        const itemSub = (item.subcategory || '').toLowerCase();
        if (foodTypeFilter === 'Veg' && itemFt !== 'veg') return false;
        if (foodTypeFilter === 'Non-Veg' && (itemFt !== 'non-veg' || itemFt.includes('seafood') || itemSub.includes('sea food'))) return false;
        if (foodTypeFilter === 'Seafood' && !(itemFt.includes('seafood') || itemFt.includes('sea food') || itemSub.includes('sea food'))) return false;
      }

      // 6. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = (item.name || '').toLowerCase().includes(q);
        const matchDesc = (item.description || '').toLowerCase().includes(q);
        const matchCat = (item.category || '').toLowerCase().includes(q);
        const matchSub = (item.subcategory || '').toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchCat && !matchSub) return false;
      }

      return true;
    });
  }, [foodItems, selectedMode, selectedCategory, selectedSubcategory, foodTypeFilter, searchQuery]);

  const handleOptionChange = (itemId, option) => {
    setItemOptions(prev => ({
      ...prev,
      [itemId]: option
    }));
  };

  const handleAddToCart = (item) => {
    if (selectedMode !== 'delivery') return;
    
    if (orderingSlot && orderingSlot.isOpen === false) {
      showToast('error', orderingSlot.message || 'Ordering window is currently closed.');
      return;
    }

    const hasOptions = item.priceOptions && item.priceOptions.length > 0;
    const selectedOpt = hasOptions ? (itemOptions[item._id] || item.priceOptions[0]) : null;

    const cartItemPayload = {
      _id: item._id,
      name: item.name,
      category: item.category,
      subcategory: item.subcategory,
      foodType: item.foodType,
      image: item.image,
      price: hasOptions ? selectedOpt.price : item.price,
      selectedOptionLabel: hasOptions ? selectedOpt.label : null,
      serviceType: item.serviceType
    };

    addToCart(cartItemPayload);
    showToast('success', `Added ${item.name} to cart`);
  };

  const handlePlaceOrderSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    if (orderingSlot && orderingSlot.isOpen === false) {
      showToast('error', 'Ordering is currently closed.');
      return;
    }

    try {
      setOrderSubmitting(true);
      const orderPayload = {
        studentName: checkoutForm.customerName || user?.name || 'Student',
        studentPhone: checkoutForm.customerPhone || user?.phone || '',
        studentId: user?._id || user?.studentId || checkoutForm.studentId || '',
        pickupPoint: checkoutForm.pickupPoint || 'N Block',
        items: cartItems,
        orderType: selectedMode === 'delivery' ? 'Parcel' : 'Pickup',
        paymentMethod: paymentMethod || 'UPI',
        paymentStatus: 'PAID',
        notes: checkoutForm.notes
      };

      const res = await api.post('/future-menu/orders', orderPayload);
      setPlacedOrder(res.data);
      setCartModalOpen(false);
      clearCart();
      showToast('success', 'Order placed successfully!');
    } catch (err) {
      console.error('Place order error:', err);
      showToast('error', 'Failed to place order. Please try again.');
    } finally {
      setOrderSubmitting(false);
    }
  };

  // Clean 2D Food Card Renderer for Fast Usability
  const renderFoodCard = (item) => {
    const hasOptions = item.priceOptions && item.priceOptions.length > 0;
    const currentOption = hasOptions ? (itemOptions[item._id] || item.priceOptions[0]) : null;
    const displayPrice = hasOptions ? currentOption.price : item.price;

    const itemFt = (item.foodType || '').toLowerCase();
    const itemSub = (item.subcategory || '').toLowerCase();
    const isSeafood = itemFt.includes('seafood') || itemFt.includes('sea food') || itemSub.includes('sea food');
    const isNonVeg = itemFt === 'non-veg' && !isSeafood;

    const inCart = cartItems.find(c => c._id === item._id);

    return (
      <div 
        key={item._id} 
        className="mhp-food-card group flex flex-col justify-between overflow-hidden relative"
      >
        {/* Food Image Header */}
        <div className="h-44 overflow-hidden relative bg-[#121113]">
          <img
            src={getImageUrl(item.image, item.category)}
            alt={item.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => handleImageError(e, item.category)}
          />

          {/* Veg / Non-Veg / Seafood Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#121113]/90 text-[10px] font-extrabold uppercase border border-[#4A1F31] backdrop-blur-md shadow-sm">
            <span className={`w-2 h-2 rounded-full ${
              isSeafood ? 'bg-cyan-400' : isNonVeg ? 'bg-rose-500' : 'bg-emerald-400'
            }`} />
            <span className="text-[#F4ECE4]">{isSeafood ? 'Seafood' : isNonVeg ? 'Non-Veg' : 'Veg'}</span>
          </div>

          {/* Category Pill */}
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#121113]/90 text-[#C86F4D] text-[10px] font-extrabold uppercase border border-[#4A1F31] shadow-sm">
            {item.category}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="font-bold text-base text-[#F4ECE4] group-hover:text-[#C86F4D] transition-colors leading-snug">
              {item.name}
            </h3>
            {item.subcategory && (
              <span className="text-[10px] text-[#78806F] font-bold uppercase tracking-wider block">
                {item.subcategory}
              </span>
            )}
            <p className="text-xs text-[#C8BDB6] line-clamp-2 leading-relaxed pt-1 font-normal">
              {item.description}
            </p>
          </div>

          {/* Price Options Dropdown (if multiple prices exist) */}
          {hasOptions && (
            <div className="pt-2">
              <label className="text-[10px] font-bold text-[#C8BDB6] block mb-1">Portion / Option:</label>
              <select
                value={currentOption?.label}
                onChange={(e) => {
                  const opt = item.priceOptions.find(o => o.label === e.target.value);
                  handleOptionChange(item._id, opt);
                }}
                className="w-full text-xs bg-[#121113] border border-[#4A1F31] text-[#F4ECE4] rounded-xl px-2.5 py-1.5 font-bold focus:outline-none focus:border-[#C86F4D]"
              >
                {item.priceOptions.map((opt, idx) => (
                  <option key={idx} value={opt.label}>
                    {opt.label} — ₹{opt.price}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Card Footer Actions */}
          <div className="pt-3 border-t border-[#4A1F31]/60 flex items-center justify-between gap-2 mt-auto">
            <div>
              <span className="text-[10px] text-[#C8BDB6] font-bold block uppercase">Price</span>
              <span className="text-lg font-mono font-black text-[#C86F4D]">
                ₹ {displayPrice}
              </span>
            </div>

            {/* Mode-Dependent Actions */}
            {selectedMode === 'delivery' ? (
              <div>
                {inCart ? (
                  <div className="flex items-center gap-1.5 bg-[#4A1F31] p-1 rounded-xl border border-[#C86F4D]">
                    <button
                      onClick={() => updateQuantity(item._id, inCart.quantity - 1)}
                      className="p-1.5 rounded-lg bg-[#291620] text-[#F4ECE4] hover:bg-[#121113]"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 text-xs font-black text-[#F4ECE4]">{inCart.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, inCart.quantity + 1)}
                      className="p-1.5 rounded-lg bg-[#C86F4D] text-white hover:bg-[#D87F5D]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={orderingSlot && orderingSlot.isOpen === false}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
                      orderingSlot && orderingSlot.isOpen === false
                        ? 'bg-[#121113] text-[#C8BDB6] border border-[#4A1F31] cursor-not-allowed opacity-60'
                        : 'btn-mhp-primary'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{orderingSlot && orderingSlot.isOpen === false ? 'Closed' : 'Add to Cart'}</span>
                  </button>
                )}
              </div>
            ) : (
              <span className="text-[11px] font-bold text-[#78806F] bg-[#121113] px-3 py-1.5 rounded-xl border border-[#4A1F31]">
                View Only
              </span>
            )}
          </div>

        </div>
      </div>
    );
  };


  // =========================================================================
  // 1. SELECTION LANDING SCREEN (when no mode is selected)
  // =========================================================================
  if (selectedMode === null) {
    return (
      <div className="bg-[#121113] text-[#F4ECE4] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12 pb-32">
          
          {/* Header Banner */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#291620] text-[#C86F4D] text-xs font-bold border border-[#4A1F31]">
              <ChefHat className="w-4 h-4 text-[#C86F4D]" />
              Official Campus Cafeteria
            </div>
            <div className="flex items-center justify-center gap-3">
              <ThreeDLogoEmblem size="medium" />
              <h1 className="font-display font-bold text-4xl sm:text-5xl text-[#F4ECE4]">
                MHP <span className="text-[#C86F4D]">Menu Services</span>
              </h1>
            </div>
            <p className="text-[#C8BDB6] text-xs sm:text-sm leading-relaxed max-w-xl mx-auto font-medium">
              VFSTR Campus • Select a menu experience below to explore available dishes, counters, and pricing.
            </p>
          </div>

          {/* Two Visually Distinct Separate Menu Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto pt-4">
            
            {/* DINING MENU CARD */}
            <ThreeDTiltCard 
              maxTilt={6}
              scale={1.02}
              onClick={() => { setSelectedMode('dining'); setSelectedCategory('All'); setSelectedSubcategory('All'); setSearchQuery(''); }}
              className="bg-[#291620] rounded-3xl border-2 border-[#4A1F31] hover:border-[#C86F4D] transition-all duration-300 p-8 sm:p-10 flex flex-col justify-between cursor-pointer group shadow-xl relative overflow-hidden"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-[#4A1F31] text-[#F4ECE4] flex items-center justify-center shadow-md border border-[#4A1F31]">
                    <Utensils className="w-7 h-7 text-[#C86F4D]" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-[#4A1F31] text-[#F4ECE4] border border-[#4A1F31] flex items-center gap-1.5 shadow-xs">
                    <Eye className="w-3.5 h-3.5 text-[#C86F4D]" />
                    <span>View Menu Only</span>
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#F4ECE4] group-hover:text-[#C86F4D] transition-colors">
                    DINING MENU
                  </h2>
                  <p className="text-[#C86F4D] font-extrabold text-xs uppercase tracking-wider">
                    View Full Campus Offerings
                  </p>
                  <p className="text-[#C8BDB6] text-xs sm:text-sm leading-relaxed pt-2 font-normal">
                    Browse the complete campus cafeteria menu featuring all 206 dishes across 14 categories for in-person dining reference.
                  </p>
                </div>

                {/* Highlights */}
                <div className="space-y-2.5 pt-4 border-t border-[#4A1F31]">
                  <div className="flex items-center gap-2.5 text-xs text-[#F4ECE4] font-bold">
                    <CheckCircle2 className="w-4 h-4 text-[#78806F]" />
                    <span>Full Menu View (206 Items)</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#F4ECE4] font-bold">
                    <CheckCircle2 className="w-4 h-4 text-[#78806F]" />
                    <span>All 14 Categories Included (inc. Breakfast)</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#C86F4D] font-extrabold">
                    <Eye className="w-4 h-4 text-[#C86F4D]" />
                    <span>View-Only Menu (No Online Checkout)</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button className="btn-mhp-secondary w-full text-xs font-bold">
                  <span>View Full Dining Menu</span>
                  <ArrowRight className="w-4 h-4 text-[#C86F4D]" />
                </button>
              </div>
            </ThreeDTiltCard>

            {/* DELIVERY MENU CARD */}
            <ThreeDTiltCard 
              maxTilt={6}
              scale={1.02}
              onClick={() => { setSelectedMode('delivery'); setSelectedCategory('All'); setSelectedSubcategory('All'); setSearchQuery(''); }}
              className="bg-[#291620] rounded-3xl border-2 border-[#C86F4D] hover:border-[#C86F4D] transition-all duration-300 p-8 sm:p-10 flex flex-col justify-between cursor-pointer group shadow-2xl relative overflow-hidden"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-[#C86F4D] text-[#F4ECE4] flex items-center justify-center shadow-md">
                    <Truck className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700 flex items-center gap-1.5 shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Order Available</span>
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#F4ECE4] group-hover:text-[#C86F4D] transition-colors">
                    DELIVERY / PARCEL
                  </h2>
                  <p className="text-[#C86F4D] font-extrabold text-xs uppercase tracking-wider">
                    Online Order Placement Active
                  </p>
                  <p className="text-[#C8BDB6] text-xs sm:text-sm leading-relaxed pt-2 font-normal">
                    Pre-order parcel takeaway online during daily active slots and collect from MHP Parcel Counter near N Block.
                  </p>
                </div>

                {/* Highlights */}
                <div className="space-y-2.5 pt-4 border-t border-[#4A1F31]">
                  <div className="flex items-center gap-2.5 text-xs text-[#F4ECE4] font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>35 Delivery-Eligible Items</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#F4ECE4] font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Fixed Pickup Window & Token</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#C86F4D] font-extrabold">
                    <ShoppingBag className="w-4 h-4 text-[#C86F4D]" />
                    <span>Prepaid UPI / Net Banking Order</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button className="btn-mhp-primary w-full text-xs font-bold">
                  <span>Order Parcel Online Now</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </ThreeDTiltCard>

          </div>

        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. MAIN MENU VIEW (Dining or Delivery Mode)
  // =========================================================================
  return (
    <div className="bg-[#121113] text-[#F4ECE4] min-h-screen pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Mode Switch Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#291620] p-5 rounded-2xl border border-[#4A1F31] shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setSelectedMode(null); setSelectedCategory('All'); setSelectedSubcategory('All'); setFoodTypeFilter('All'); setSearchQuery(''); }}
              className="px-3.5 py-1.5 rounded-xl bg-[#4A1F31] text-[#F4ECE4] text-xs font-bold hover:bg-[#C86F4D] transition-all"
            >
              ← Change Mode
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-[#C86F4D] uppercase tracking-wider">Active Mode:</span>
                <span className="font-extrabold text-[#F4ECE4] text-sm uppercase">
                  {selectedMode === 'delivery' ? '📦 DELIVERY / PARCEL MODE' : '🎒 DINING MODE (VIEW-ONLY)'}
                </span>
              </div>
              <p className="text-[11px] text-[#C8BDB6]">
                {selectedMode === 'delivery' 
                  ? 'Showing 35 delivery-eligible items (Breakfast excluded)' 
                  : 'Showing complete 206 full-menu items for in-person dining reference'}
              </p>
            </div>
          </div>

          {/* Mode Switch Pills */}
          <div className="flex items-center gap-1.5 bg-[#121113] p-1 rounded-xl border border-[#4A1F31] self-stretch sm:self-auto">
            <button
              onClick={() => { setSelectedMode('dining'); setSelectedCategory('All'); setSelectedSubcategory('All'); setSearchQuery(''); }}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedMode === 'dining'
                  ? 'bg-[#4A1F31] text-[#F4ECE4] shadow-xs'
                  : 'text-[#C8BDB6] hover:text-[#F4ECE4]'
              }`}
            >
              Dining (View)
            </button>
            <button
              onClick={() => { setSelectedMode('delivery'); setSelectedCategory('All'); setSelectedSubcategory('All'); setSearchQuery(''); }}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedMode === 'delivery'
                  ? 'bg-[#C86F4D] text-white shadow-xs'
                  : 'text-[#C8BDB6] hover:text-[#F4ECE4]'
              }`}
            >
              Delivery (Order)
            </button>
          </div>
        </div>

        {/* Compact Daily Window & Status Bar */}
        <div className="bg-[#291620] p-4 rounded-2xl border border-[#4A1F31] flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 font-bold text-[#F4ECE4]">
              <Clock className="w-4 h-4 text-[#C86F4D]" />
              <span>Ordering Slot: {orderingSlot?.orderingWindow || '09:30 — 10:30 AM'}</span>
            </div>
            <span className="text-[#4A1F31]">|</span>
            <div className="text-[#C8BDB6]">
              Pickup Window: <strong className="text-[#F4ECE4]">{orderingSlot?.pickupWindow || '12:00 — 13:00 PM'}</strong>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold border ${
              orderingSlot?.isOpen 
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700' 
                : 'bg-rose-950/80 text-rose-300 border-rose-800'
            }`}>
              {orderingSlot?.isOpen ? '🟢 ORDERING OPEN' : '🔴 ORDERING CLOSED'}
            </span>

            {selectedMode === 'delivery' && totalCartCount > 0 && (
              <button
                onClick={() => setCartModalOpen(true)}
                className="btn-mhp-primary text-xs py-1.5 px-3.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>View Cart ({totalCartCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls (Search + Veg/Non-Veg + Categories) */}
        <div className="bg-[#291620] p-5 rounded-2xl border border-[#4A1F31] space-y-4 shadow-sm">
          
          {/* Top Bar: Search Query & Veg/Non-Veg Pills */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#C8BDB6] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search dishes by name, category, or ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#121113] border border-[#4A1F31] text-xs font-medium text-[#F4ECE4] placeholder-[#C8BDB6] focus:outline-none focus:border-[#C86F4D]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C8BDB6] hover:text-[#F4ECE4]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Veg / Non-Veg / Seafood Filter Pills */}
            <div className="flex items-center gap-1.5 bg-[#121113] p-1 rounded-xl border border-[#4A1F31] shrink-0">
              {['All', 'Veg', 'Non-Veg', 'Seafood'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFoodTypeFilter(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    foodTypeFilter === type
                      ? 'bg-[#C86F4D] text-white shadow-xs'
                      : 'text-[#C8BDB6] hover:text-[#F4ECE4]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedSubcategory('All');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#C86F4D] text-white shadow-sm'
                    : 'bg-[#121113] text-[#C8BDB6] border border-[#4A1F31] hover:text-[#F4ECE4] hover:border-[#C86F4D]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Subcategory Pills (if category selected) */}
          {subcategories.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-[#4A1F31]">
              <span className="text-[10px] font-extrabold text-[#C8BDB6] uppercase shrink-0">Subcategory:</span>
              {subcategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubcategory(sub)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                    selectedSubcategory === sub
                      ? 'bg-[#4A1F31] text-[#F4ECE4] border border-[#C86F4D]'
                      : 'bg-[#121113] text-[#C8BDB6] hover:text-[#F4ECE4]'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Food Items Grid Section */}
        {loading ? (
          <LoadingSkeleton count={8} />
        ) : filteredItems.length === 0 ? (
          <div className="bg-[#291620] p-12 text-center rounded-3xl border border-[#4A1F31] space-y-3 max-w-md mx-auto">
            <AlertCircle className="w-10 h-10 text-[#C86F4D] mx-auto" />
            <h3 className="font-display font-bold text-lg text-[#F4ECE4]">No Dishes Match Filter</h3>
            <p className="text-xs text-[#C8BDB6]">
              No items match your active filters ({selectedCategory}, {foodTypeFilter}). Click below to clear all filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedSubcategory('All');
                setFoodTypeFilter('All');
                setSearchQuery('');
              }}
              className="btn-mhp-primary text-xs py-2 px-4 mt-2"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-[#C8BDB6] px-1">
              <span>Showing {filteredItems.length} available dishes</span>
              <span>Mode: {selectedMode === 'delivery' ? 'Parcel Ordering' : 'Dining View'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map(item => renderFoodCard(item))}
            </div>
          </div>
        )}

      </div>

      {/* Floating Cart Button for Delivery Mode */}
      {selectedMode === 'delivery' && totalCartCount > 0 && !cartModalOpen && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setCartModalOpen(true)}
            className="btn-mhp-primary text-sm px-6 py-3.5 shadow-2xl flex items-center gap-3 animate-bounce"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Cart ({totalCartCount} items) • ₹{grandTotalAmount}</span>
          </button>
        </div>
      )}

      {/* Cart & Checkout Modal */}
      {cartModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121113]/80 backdrop-blur-md">
          <div className="max-w-lg w-full bg-[#291620] border border-[#4A1F31] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[#4A1F31] pb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#C86F4D]" />
                <h2 className="font-display font-bold text-xl text-[#F4ECE4]">Your Parcel Cart</h2>
              </div>
              <button
                onClick={() => setCartModalOpen(false)}
                className="text-[#C8BDB6] hover:text-[#F4ECE4] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {placedOrder ? (
              <div className="text-center space-y-4 py-6">
                <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
                <h3 className="font-display font-bold text-2xl text-[#F4ECE4]">ORDER CONFIRMED</h3>
                <div className="bg-[#121113] p-4 rounded-2xl border border-[#4A1F31] space-y-2">
                  <span className="text-xs text-[#C8BDB6] font-bold block uppercase">Your Official Billing Token</span>
                  <span className="text-2xl font-mono font-black text-[#C86F4D] tracking-widest block">
                    {placedOrder.billingNumber || placedOrder._id?.slice(-6).toUpperCase()}
                  </span>
                  <span className="text-[11px] text-emerald-300 font-bold block">Status: ORDER CONFIRMED</span>
                </div>
                <p className="text-xs text-[#C8BDB6]">
                  Collect your order from <strong>{placedOrder.pickupPoint}</strong> during pickup window 12:00 — 1:00 PM.
                </p>
                <button
                  onClick={() => {
                    setPlacedOrder(null);
                    setCartModalOpen(false);
                  }}
                  className="btn-mhp-primary text-xs w-full py-2.5"
                >
                  Done
                </button>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-10 space-y-4">
                <ShoppingBag className="w-12 h-12 text-[#C8BDB6] mx-auto opacity-60" />
                <div>
                  <h4 className="font-bold text-base text-[#F4ECE4]">Your cart is currently empty</h4>
                  <p className="text-xs text-[#C8BDB6] mt-1">Explore our menu to add delicious parcel takeaway items.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCartModalOpen(false)}
                  className="btn-mhp-secondary text-xs px-6 py-2.5"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <form onSubmit={handlePlaceOrderSubmit} className="space-y-5 text-xs text-[#F4ECE4]">
                
                {/* Cart Items List */}
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {cartItems.map((item) => {
                    const itemId = item.cartId || item.foodId || item._id;
                    const itemUnitPrice = item.unitPrice || item.price || 0;
                    return (
                      <div key={itemId} className="flex items-center justify-between bg-[#121113] p-3 rounded-xl border border-[#4A1F31]">
                        <div className="flex-1 pr-3">
                          <h4 className="font-bold text-sm text-[#F4ECE4]">{item.name}</h4>
                          <p className="text-[11px] text-[#C8BDB6]">
                            ₹{itemUnitPrice} × {item.quantity} = <strong className="text-[#C86F4D]">₹{itemUnitPrice * item.quantity}</strong>
                            {item.selectedOptionLabel && <span className="text-[#C86F4D] ml-1">({item.selectedOptionLabel})</span>}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-1.5 bg-[#291620] px-2 py-1 rounded-lg border border-[#4A1F31]">
                            <button
                              type="button"
                              onClick={() => updateQuantity(itemId, -1)}
                              className="p-1 rounded text-[#F4ECE4] hover:text-[#C86F4D] transition-colors cursor-pointer"
                              title="Decrease Quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-bold text-xs px-1 text-[#F4ECE4]">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(itemId, 1)}
                              className="p-1 rounded text-[#F4ECE4] hover:text-[#C86F4D] transition-colors cursor-pointer"
                              title="Increase Quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Explicit Item Remove / Delete Button */}
                          <button
                            type="button"
                            onClick={() => removeFromCart(itemId)}
                            className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/60 transition-all cursor-pointer shadow-xs"
                            title="Remove item from cart"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pickup Point Selection */}
                <div className="space-y-1.5">
                  <label className="font-bold text-[#F4ECE4] block">Select Campus Pickup Point:</label>
                  <select
                    value={checkoutForm.pickupPoint}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, pickupPoint: e.target.value })}
                    className="w-full bg-[#121113] border border-[#4A1F31] text-[#F4ECE4] rounded-xl px-3 py-2 font-bold focus:outline-none focus:border-[#C86F4D]"
                  >
                    <option value="P Block">P Block Counter</option>
                    <option value="N Block">N Block Counter (Main)</option>
                    <option value="H Block">H Block Counter</option>
                    <option value="U Block">U Block Counter</option>
                    <option value="A Block">A Block Counter</option>
                  </select>
                </div>

                {/* Payment Options (Placeholders) */}
                <div className="space-y-1.5">
                  <label className="font-bold text-[#F4ECE4] block">Select Payment Method:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('UPI')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${
                        paymentMethod === 'UPI'
                          ? 'bg-[#C86F4D] text-white border-[#C86F4D]'
                          : 'bg-[#121113] text-[#C8BDB6] border-[#4A1F31]'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>UPI (Instant)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Net Banking')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${
                        paymentMethod === 'Net Banking'
                          ? 'bg-[#C86F4D] text-white border-[#C86F4D]'
                          : 'bg-[#121113] text-[#C8BDB6] border-[#4A1F31]'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Net Banking</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-[#C8BDB6] italic pt-0.5">* No Cash on Delivery supported for parcel takeaway.</p>
                </div>

                {/* Billing Summary */}
                <div className="bg-[#121113] p-4 rounded-xl border border-[#4A1F31] space-y-1.5 font-semibold text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#C8BDB6]">Food Subtotal:</span>
                    <span>₹ {totalCartAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#C8BDB6]">Parcel Charge (₹10/item, ex. beverages):</span>
                    <span>₹ {parcelCharge}</span>
                  </div>
                  <div className="flex justify-between border-t border-[#4A1F31] pt-2 text-sm font-black text-[#C86F4D]">
                    <span>Total Amount Payable:</span>
                    <span>₹ {grandTotalAmount}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={orderSubmitting}
                  className="btn-mhp-primary text-xs w-full py-3 font-bold"
                >
                  {orderSubmitting ? 'Processing Order...' : `Confirm & Pay ₹${grandTotalAmount}`}
                </button>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default MenuPage;
