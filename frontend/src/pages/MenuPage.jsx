import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import api from '../services/api';
import { FALLBACK_FOOD_ITEMS } from '../data/fallbackMenu';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import SmartImage from '../components/common/SmartImage';
import EmptyMenuState from '../components/common/EmptyMenuState';
import ApiFailureNotice from '../components/common/ApiFailureNotice';
import { getImageUrl, handleImageError } from '../utils/imageUtils';
import { 
  Search, 
  ShoppingBag, 
  Plus, 
  Minus, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  X,
  CreditCard,
  ChefHat,
  Trash2,
  Flame,
  Star
} from 'lucide-react';

/**
 * MenuPage — Streamlined Fast Ordering Menu Experience with Dynamic Favorites
 * Features:
 * 1. Search 🔍 + Fast Category Pills (All | Rice | Biryani | Starters | Noodles | Beverages | ...)
 * 2. 🔥 STUDENT FAVORITES (if order data exists) or 🔥 MHP PICKS (if no order data yet)
 * 3. Instant Food Cards:
 *    - IMAGE
 *    - Title (e.g. Chicken 65)
 *    - Short Description
 *    - Price (₹XX)
 *    - Inline [- 1 +] / [ADD] controls
 * 4. Instant Floating Cart Bar for 1-click checkout
 */
const DINING_CATEGORIES = [
  { id: 'All', label: 'All Dishes' },
  { id: 'Starters', label: 'Starters' },
  { id: 'Biryani', label: 'Biryani' },
  { id: 'Rice', label: 'Rice Bowls' },
  { id: 'Noodles', label: 'Noodles' },
  { id: 'Beverages', label: 'Beverages' },
  { id: 'Burgers & Pizza', label: 'Burgers & Pizza' },
  { id: 'Curries & Breads', label: 'Curries & Breads' },
  { id: 'Breakfast', label: 'Breakfast' }
];

const DELIVERY_CATEGORIES = [
  { id: 'All', label: 'All Delivery Items' },
  { id: 'Starters', label: 'Starters (Veg & Non-Veg)' },
  { id: 'Rice', label: 'Rice Bowls (Veg & Non-Veg)' },
  { id: 'Biryani', label: 'Biryanis (Veg & Non-Veg)' }
];

const MenuPage = () => {
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalCartCount, totalCartAmount, isOrderingOpen } = useCart();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const urlMode = searchParams.get('mode');

  const [foodItems, setFoodItems] = useState([]);
  const [favoritesData, setFavoritesData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Default mode to 'delivery' so users land directly on the menu without blocking screens
  const [selectedMode, setSelectedMode] = useState(urlMode || 'delivery');

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
    }
  }, [location.search]);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [foodTypeFilter, setFoodTypeFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Item portion options selection
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
    fetchFavorites();
  }, []);

  const fetchFoodItems = async () => {
    try {
      setLoading(true);
      let items = [];
      try {
        const res = await api.get('/menu');
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          items = res.data;
        } else {
          const futureRes = await api.get('/future-menu/items');
          if (futureRes && futureRes.data && Array.isArray(futureRes.data) && futureRes.data.length > 0) {
            items = futureRes.data;
          }
        }
      } catch (e) {
        console.warn('Primary menu endpoint failed, using backup...', e.message);
        try {
          const futureRes = await api.get('/future-menu/items');
          if (futureRes && futureRes.data && Array.isArray(futureRes.data) && futureRes.data.length > 0) {
            items = futureRes.data;
          }
        } catch (err2) {
          console.warn('Backup endpoint failed:', err2.message);
        }
      }

      if (!items || items.length === 0) {
        items = FALLBACK_FOOD_ITEMS;
      }

      setFoodItems(items);
    } catch (err) {
      console.error('Error in fetchFoodItems:', err);
      setFoodItems(FALLBACK_FOOD_ITEMS);
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

  const fetchFavorites = async () => {
    try {
      const res = await api.get('/future-menu/favorites');
      if (res && res.data) {
        setFavoritesData(res.data);
      }
    } catch (err) {
      console.warn('Could not fetch favorites from API:', err);
    }
  };

  // Filtered Food Items logic
  const filteredItems = useMemo(() => {
    return foodItems.filter(item => {
      // 1. Availability check
      const isAvail = item.isAvailable !== false && item.isAvailable !== 'false' && item.available !== false && item.available !== 'false';
      if (!isAvail) return false;

      const cat = (item.category || '').toLowerCase();
      const sub = (item.subcategory || '').toLowerCase();
      const name = (item.name || '').toLowerCase();

      // 2. DELIVERY SECTION STRICT FILTERING
      if (selectedMode === 'delivery') {
        // STRICTLY IGNORE / EXCLUDE: Breakfast, Beverages, Burgers, Pizzas, Sandwiches
        const isExcluded = 
          cat.includes('breakfast') || sub.includes('breakfast') || name.includes('dosa') || name.includes('idly') || name.includes('vada') || name.includes('puri') ||
          cat.includes('beverage') || cat.includes('shake') || cat.includes('mocktail') || cat.includes('juice') || cat.includes('drink') || sub.includes('beverage') ||
          cat.includes('burger') || cat.includes('pizza') || cat.includes('sandwich') || cat.includes('wrap') || sub.includes('burger') || sub.includes('pizza') || sub.includes('sandwich');

        if (isExcluded) return false;

        // STRICTLY INCLUDE ONLY: Starters, Rice Bowls (Rice / Pulao), Biryanis (Veg & Non-Veg)
        const isAllowedDeliveryItem = 
          cat.includes('starter') || sub.includes('starter') ||
          cat.includes('biryani') || sub.includes('biryani') || name.includes('biryani') ||
          cat.includes('rice') || sub.includes('rice') || cat.includes('pulao') || name.includes('pulao') || name.includes('rice bowl') || name.includes('fried rice');

        if (!isAllowedDeliveryItem) return false;
      }

      // 3. Veg / Non-Veg / Seafood filter
      if (foodTypeFilter !== 'All') {
        const itemFt = (item.foodType || '').toLowerCase();
        const itemSub = (item.subcategory || '').toLowerCase();
        if (foodTypeFilter === 'Veg' && itemFt !== 'veg') return false;
        if (foodTypeFilter === 'Non-Veg' && (itemFt !== 'non-veg' || itemFt.includes('seafood') || itemSub.includes('sea food'))) return false;
        if (foodTypeFilter === 'Seafood' && !(itemFt.includes('seafood') || itemFt.includes('sea food') || itemSub.includes('sea food'))) return false;
      }

      // 4. Category Filter
      if (selectedCategory === 'Biryani') {
        if (!cat.includes('biryani') && !cat.includes('pulao')) return false;
      } else if (selectedCategory === 'Rice') {
        if (!cat.includes('rice') && !sub.includes('rice') && !cat.includes('pulao') && !cat.includes('biryani') && !name.includes('rice')) return false;
      } else if (selectedCategory === 'Starters') {
        if (!cat.includes('starter')) return false;
      } else if (selectedCategory === 'Noodles') {
        if (!cat.includes('noodle') && !sub.includes('noodle') && !name.includes('noodle')) return false;
      } else if (selectedCategory === 'Beverages') {
        if (!cat.includes('mocktail') && !cat.includes('juice') && !cat.includes('shake') && !cat.includes('beverage')) return false;
      } else if (selectedCategory === 'Burgers & Pizza') {
        if (!cat.includes('burger') && !cat.includes('pizza') && !cat.includes('sandwich') && !cat.includes('wrap')) return false;
      } else if (selectedCategory === 'Curries & Breads') {
        if (!cat.includes('curry') && !cat.includes('curries') && !cat.includes('bread')) return false;
      } else if (selectedCategory === 'Breakfast') {
        if (!cat.includes('breakfast')) return false;
      } else if (selectedCategory !== 'All') {
        if (item.category !== selectedCategory) return false;
      }

      // 5. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = name.includes(q);
        const matchDesc = (item.description || '').toLowerCase().includes(q);
        const matchCat = cat.includes(q);
        const matchSub = sub.includes(q);
        if (!matchName && !matchDesc && !matchCat && !matchSub) return false;
      }

      return true;
    });
  }, [foodItems, selectedMode, selectedCategory, foodTypeFilter, searchQuery]);

  const handleOptionChange = (itemId, option) => {
    setItemOptions(prev => ({
      ...prev,
      [itemId]: option
    }));
  };

  const handleAddToCart = (item) => {
    if (!isOrderingOpen) {
      showToast('error', 'Ordering is currently closed. Ordering window is 9:30 AM – 10:30 AM.');
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

    const success = addToCart(cartItemPayload);
    if (success !== false) {
      showToast('success', `Added ${item.name} to cart`);
    } else {
      showToast('error', 'Ordering is currently closed. Ordering window is 9:30 AM – 10:30 AM.');
    }
  };

  const handlePlaceOrderSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    if (!isOrderingOpen) {
      showToast('error', 'Ordering window is closed. Place orders between 9:30 AM and 10:30 AM.');
      return;
    }

    try {
      setOrderSubmitting(true);
      const orderPayload = {
        customerName: checkoutForm.customerName || user?.name || 'Campus Student',
        customerPhone: checkoutForm.customerPhone || user?.phone || '9876543210',
        studentPhone: checkoutForm.customerPhone || user?.phone || '9876543210',
        studentId: user?._id || user?.studentId || checkoutForm.studentId || '211FA04001',
        pickupPoint: checkoutForm.pickupPoint || 'N Block',
        pickupLocation: checkoutForm.pickupPoint || 'N Block',
        items: cartItems,
        orderType: selectedMode === 'delivery' ? 'Parcel' : 'Pickup',
        paymentMethod: paymentMethod || 'UPI',
        notes: checkoutForm.notes || '',
        totalAmount: grandTotalAmount
      };

      let res;
      try {
        res = await api.post('/future-menu/orders/initiate-payment', orderPayload);
      } catch (err1) {
        try {
          res = await api.post('/future-menu/orders', orderPayload);
        } catch (err2) {
          throw err1;
        }
      }

      if (res && res.data) {
        const orderData = res.data.order || res.data;
        const paymentSession = res.data.paymentSession;

        const isLiveKey = paymentSession && 
          paymentSession.keyId && 
          paymentSession.keyId.startsWith('rzp_live_');

        if (window.Razorpay && isLiveKey) {
          const options = {
            key: paymentSession.keyId,
            amount: paymentSession.amountInPaise,
            currency: 'INR',
            name: 'MHP Food Court',
            description: `Order ${orderData.orderNumber || 'MHP'}`,
            order_id: paymentSession.razorpayOrderId,
            handler: async function (response) {
              try {
                const confirmRes = await api.post('/future-menu/orders/confirm-payment', {
                  orderId: orderData._id || orderData.id,
                  transactionId: paymentSession.transactionId,
                  signature: response.razorpay_signature || paymentSession.signature,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id
                });
                setPlacedOrder(confirmRes.data.order || confirmRes.data);
                setCartModalOpen(false);
                clearCart();
                fetchFavorites();
                showToast('success', '🎉 Order placed & confirmed!');
              } catch (confirmErr) {
                setPlacedOrder(orderData);
                setCartModalOpen(false);
                clearCart();
                showToast('success', '🎉 Order placed successfully!');
              }
            },
            prefill: {
              name: orderData.customerName || orderData.studentName,
              contact: orderData.customerPhone || orderData.studentPhone
            },
            theme: { color: '#F47B20' }
          };
          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          let confirmedOrder = orderData;
          try {
            const confirmRes = await api.post('/future-menu/orders/confirm-payment', {
              orderId: orderData._id || orderData.id || orderData.orderId,
              transactionId: paymentSession?.transactionId || `TXN-${Date.now()}`,
              signature: paymentSession?.signature || 'simulated_sig',
              razorpayPaymentId: `pay_simulated_${Date.now()}`,
              razorpayOrderId: paymentSession?.razorpayOrderId || `ord_simulated_${Date.now()}`
            });
            if (confirmRes.data && (confirmRes.data.order || confirmRes.data)) {
              confirmedOrder = confirmRes.data.order || confirmRes.data;
            }
          } catch (confirmErr) {}

          setPlacedOrder(confirmedOrder);
          setCartModalOpen(false);
          clearCart();
          fetchFavorites();
          showToast('success', '🎉 Order placed successfully!');
        }
      }
    } catch (err) {
      console.error('Place order error:', err);
      const backendMsg = err.response?.data?.error || err.response?.data?.message;
      showToast('error', backendMsg || 'Failed to place order. Please try again.');
    } finally {
      setOrderSubmitting(false);
    }
  };

  /**
   * Fast Food Card Renderer:
   * IMAGE
   * Item Title (e.g. Chicken 65)
   * Short Description
   * ₹XX
   * [ - 1 + ] or [ ADD ]
   */
  const renderFoodCard = (item) => {
    const hasOptions = item.priceOptions && item.priceOptions.length > 0;
    const currentOption = hasOptions ? (itemOptions[item._id] || item.priceOptions[0]) : null;
    const displayPrice = hasOptions ? currentOption.price : item.price;

    const itemFt = (item.foodType || '').toLowerCase();
    const itemSub = (item.subcategory || '').toLowerCase();
    const isSeafood = itemFt.includes('seafood') || itemFt.includes('sea food') || itemSub.includes('sea food');
    const isNonVeg = itemFt === 'non-veg' && !isSeafood;

    // Check if item is in cart and get current quantity
    const inCart = cartItems.find(c => c._id === item._id || c.foodId === item._id);
    const cartQuantity = inCart ? inCart.quantity : 0;
    const cartItemId = inCart ? (inCart.cartId || inCart._id) : item._id;

    return (
      <div 
        key={item._id} 
        className="bg-[#FFFFFF] border border-[#7D967E]/30 hover:border-[#F47B20]/60 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between overflow-hidden relative"
      >
        {/* Food Image Header */}
        <div className="h-44 overflow-hidden relative bg-[#183A2A]/5">
          <SmartImage
            src={item.image}
            category={item.category}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Veg / Non-Veg / Seafood Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFFFFF]/95 text-[10px] font-extrabold uppercase border border-[#7D967E]/30 backdrop-blur-md shadow-xs text-[#202522]">
            <span className={`w-2 h-2 rounded-full ${
              isSeafood ? 'bg-cyan-500' : isNonVeg ? 'bg-rose-500' : 'bg-emerald-500'
            }`} />
            <span>{isSeafood ? 'Seafood' : isNonVeg ? 'Non-Veg' : 'Veg'}</span>
          </div>

          {/* Category Pill */}
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#183A2A]/90 backdrop-blur-md text-[#FFF7E8] text-[10px] font-extrabold uppercase shadow-xs">
            {item.category}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="font-display font-extrabold text-base text-[#183A2A] group-hover:text-[#F47B20] transition-colors leading-snug">
              {item.name}
            </h3>
            {item.description && (
              <p className="text-xs text-[#202522]/75 line-clamp-2 leading-relaxed font-sans">
                {item.description}
              </p>
            )}
          </div>

          {/* Portion Dropdown (if multiple prices exist) */}
          {hasOptions && (
            <div className="pt-1">
              <select
                value={currentOption?.label}
                onChange={(e) => {
                  const opt = item.priceOptions.find(o => o.label === e.target.value);
                  handleOptionChange(item._id, opt);
                }}
                className="w-full text-xs bg-[#FFF7E8] border border-[#7D967E]/30 text-[#183A2A] rounded-xl px-2 py-1 font-bold focus:outline-none focus:border-[#F47B20]"
              >
                {item.priceOptions.map((opt, idx) => (
                  <option key={idx} value={opt.label}>
                    {opt.label} — ₹{opt.price}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Price & Instant Add / [- 1 +] Controls */}
          <div className="pt-3 border-t border-[#7D967E]/20 flex items-center justify-between gap-2 mt-auto">
            <div>
              <span className="text-[10px] text-[#7D967E] font-bold block uppercase">Price</span>
              <span className="text-xl font-mono font-black text-[#F47B20]">
                ₹{displayPrice}
              </span>
            </div>

            {/* INSTANT INLINE [- 1 +] OR [ ADD ] BUTTON OR CLOSED BADGE */}
            {!isOrderingOpen ? (
              <button
                type="button"
                disabled
                className="px-3 py-2 rounded-xl text-[11px] font-extrabold bg-gray-200 text-gray-500 border border-gray-300 cursor-not-allowed flex items-center gap-1 opacity-80"
                title="Ordering is available strictly from 9:30 AM to 10:30 AM"
              >
                <span>Closed (9:30–10:30 AM)</span>
              </button>
            ) : cartQuantity > 0 ? (
              <div className="flex items-center gap-1.5 bg-[#183A2A] text-white p-1 rounded-2xl shadow-md border border-[#7D967E]/40">
                <button
                  type="button"
                  onClick={() => updateQuantity(cartItemId, cartQuantity - 1)}
                  className="w-7 h-7 rounded-xl bg-[#204935] hover:bg-rose-600 text-white flex items-center justify-center font-black transition-colors"
                  title="Reduce Quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                
                <span className="px-2 text-xs font-black text-[#FFF7E8] min-w-[20px] text-center">
                  {cartQuantity}
                </span>

                <button
                  type="button"
                  onClick={() => updateQuantity(cartItemId, cartQuantity + 1)}
                  className="w-7 h-7 rounded-xl bg-[#F47B20] hover:bg-[#FF882E] text-white flex items-center justify-center font-black transition-colors"
                  title="Increase Quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleAddToCart(item)}
                className="px-4 py-2 rounded-xl text-xs font-extrabold bg-[#F47B20] hover:bg-[#FF882E] text-white shadow-md transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>ADD</span>
              </button>
            )}

          </div>

        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#FFF7E8] text-[#202522] min-h-screen pb-32">
      
      {/* HEADER SECTION: Search Bar & Fast Category Bar */}
      <div className="bg-[#183A2A] text-[#FFF7E8] pt-6 pb-8 px-4 sm:px-6 lg:px-8 shadow-xl relative preserve-3d border-b border-[#7D967E]/30">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Top Title & Search 🔍 Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-[#F47B20]" />
                <span className="text-xs font-black text-[#F47B20] uppercase tracking-widest">
                  VFSTR CAMPUS CAFETERIA
                </span>
              </div>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#FFF7E8] mt-1">
                Explore MHP Menu
              </h1>
            </div>

            {/* Prominent Search 🔍 Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-5 h-5 text-[#7D967E] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search dishes (e.g. Chicken 65, Biryani, Dosa)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-3 rounded-2xl bg-[#FFF7E8]/10 border border-[#7D967E]/40 backdrop-blur-md text-sm font-semibold text-[#FFF7E8] placeholder-[#FFF7E8]/60 focus:outline-none focus:border-[#F47B20] focus:ring-2 focus:ring-[#F47B20]/40 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#FFF7E8]/70 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* 🍽️ SECTION SWITCHER BAR: 1. DINING vs 2. DELIVERY */}
          <div className="bg-[#FFF7E8]/10 p-1.5 rounded-2xl border border-[#7D967E]/40 grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl mx-auto shadow-inner">
            <button
              type="button"
              onClick={() => {
                setSelectedMode('dining');
                setSelectedCategory('All');
              }}
              className={`py-3 px-5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                selectedMode === 'dining'
                  ? 'bg-[#FFF7E8] text-[#183A2A] shadow-md scale-[1.01]'
                  : 'text-[#FFF7E8]/80 hover:text-white hover:bg-[#FFF7E8]/10'
              }`}
            >
              <span className="text-base">🍽️</span>
              <span>1. DINING MENU (ALL ITEMS)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedMode('delivery');
                setSelectedCategory('All');
              }}
              className={`py-3 px-5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                selectedMode === 'delivery'
                  ? 'bg-[#F47B20] text-white shadow-md scale-[1.01]'
                  : 'text-[#FFF7E8]/80 hover:text-white hover:bg-[#FFF7E8]/10'
              }`}
            >
              <span className="text-base">🛵</span>
              <span>2. DELIVERY MENU (SPECIALS ONLY)</span>
            </button>
          </div>

          {/* Delivery Strict Restrictions Notice Banner */}
          {selectedMode === 'delivery' && (
            <div className="bg-[#F47B20]/20 border border-[#F47B20]/50 p-3 rounded-2xl text-center text-xs font-bold text-[#FFF7E8] space-y-0.5">
              <span>🛵 <strong>Delivery Section Active:</strong> Starters, Rice Bowls, and Biryanis (Veg & Non-Veg) only.</span>
              <span className="block text-[11px] text-[#FFF7E8]/80 font-normal">
                (Breakfast, Beverages, Burgers, Pizzas & Sandwiches are strictly available under 🍽️ <strong>Dining Menu</strong>).
              </span>
            </div>
          )}

          {/* 🏷️ FAST CATEGORY PILLS BAR */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {(selectedMode === 'delivery' ? DELIVERY_CATEGORIES : DINING_CATEGORIES).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#F47B20] text-white shadow-lg shadow-[#F47B20]/30 scale-105'
                      : 'bg-[#FFF7E8]/10 text-[#FFF7E8]/90 hover:bg-[#FFF7E8]/20 border border-[#7D967E]/30'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sub-Filters: Veg / Non-Veg / Seafood */}
            <div className="flex items-center justify-between pt-2 border-t border-[#7D967E]/20 text-xs">
              <div className="flex items-center gap-1.5 bg-[#FFF7E8]/10 p-1 rounded-xl border border-[#7D967E]/30">
                <span className="text-[10px] font-bold text-[#7D967E] px-2 uppercase">Dietary:</span>
                {['All', 'Veg', 'Non-Veg', 'Seafood'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFoodTypeFilter(type)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      foodTypeFilter === type
                        ? 'bg-[#FFF7E8] text-[#183A2A] shadow-xs'
                        : 'text-[#FFF7E8]/70 hover:text-[#FFF7E8]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {orderingSlot && (
                <div className="hidden sm:flex items-center gap-2 text-[11px] font-medium text-[#FFF7E8]/80">
                  <Clock className="w-3.5 h-3.5 text-[#F47B20]" />
                  <span>Pickup: <strong>{orderingSlot.pickupWindow || '12:00 — 1:00 PM'}</strong></span>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* FOOD ITEMS MAIN GRID SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* CLOSED ORDERING NOTICE BANNER */}
        {!isOrderingOpen && (
          <div className="bg-[#10271C] border-2 border-rose-500/80 p-4 sm:p-5 rounded-3xl text-[#FFF7E8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/40">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
                  <span>⏰ Ordering is Currently Closed</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 text-[10px] uppercase font-black border border-rose-700">CLOSED</span>
                </h4>
                <p className="text-xs text-[#FFF7E8]/80 font-medium mt-0.5 leading-relaxed">
                  Food ordering is permitted strictly between <strong>9:30 AM and 10:30 AM</strong>. Menu items can be viewed below, but adding to cart is disabled outside ordering hours.
                </p>
              </div>
            </div>
            <div className="shrink-0 bg-[#183A2A] px-4 py-2 rounded-2xl border border-[#7D967E]/40 text-center">
              <span className="text-[10px] text-[#7D967E] font-black uppercase tracking-wider block">Ordering Window</span>
              <span className="text-xs font-mono font-bold text-[#F47B20]">09:30 AM — 10:30 AM</span>
            </div>
          </div>
        )}
        
        {/* ================= 🔥 STUDENT FAVORITES / MHP PICKS SECTION ================= */}
        {selectedCategory === 'All' && !searchQuery && favoritesData && favoritesData.items && favoritesData.items.length > 0 && (
          <div className="bg-[#FFFFFF] p-6 rounded-3xl border-2 border-[#F47B20]/40 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#7D967E]/20 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[#F47B20] fill-[#F47B20]" />
                  <h2 className="font-display font-extrabold text-xl sm:text-2xl text-[#183A2A]">
                    {favoritesData.title}
                  </h2>
                </div>
                <p className="text-xs text-[#7D967E] font-semibold mt-0.5">
                  {favoritesData.subtitle}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                  favoritesData.hasOrderData 
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-[#FFF7E8] text-[#F47B20] border-[#F47B20]/40'
                }`}>
                  {favoritesData.hasOrderData ? '📈 Ranked by Campus Orders' : '✨ MHP PICKS (Honest Selection)'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {favoritesData.items.slice(0, 4).map(item => renderFoodCard(item))}
            </div>
          </div>
        )}

        {loading ? (
          <LoadingSkeleton count={8} />
        ) : filteredItems.length === 0 ? (
          <EmptyMenuState
            search={searchQuery}
            category={selectedCategory}
            onReset={() => {
              setSelectedCategory('All');
              setFoodTypeFilter('All');
              setSearchQuery('');
            }}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-extrabold text-[#7D967E] px-1">
              <span>Showing {filteredItems.length} available dishes</span>
              <span className="text-[#F47B20]">Click + ADD to quickly add items</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map(item => renderFoodCard(item))}
            </div>
          </div>
        )}

      </div>

      {/* FLOATING INSTANT CART BAR (When items exist in cart) */}
      {totalCartCount > 0 && !cartModalOpen && (
        <div className="fixed bottom-16 md:bottom-6 left-4 right-4 max-w-md mx-auto z-40">
          <button
            onClick={() => setCartModalOpen(true)}
            className="w-full bg-[#F47B20] hover:bg-[#FF882E] text-white py-3.5 px-6 rounded-2xl shadow-2xl flex items-center justify-between font-black text-sm tracking-wider transition-all hover:scale-105 active:scale-95 animate-pulse"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-black text-xs">
                {totalCartCount}
              </div>
              <span>VIEW CART</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-base font-mono">₹{grandTotalAmount}</span>
              <span>→</span>
            </div>
          </button>
        </div>
      )}

      {/* Cart & Checkout Modal */}
      {cartModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#183A2A]/70 backdrop-blur-md">
          <div className="max-w-lg w-full bg-[#FFFFFF] border-2 border-[#7D967E]/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[#7D967E]/30 pb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#F47B20]" />
                <h2 className="font-display font-extrabold text-xl text-[#183A2A]">Your Order Cart</h2>
              </div>
              <button
                onClick={() => setCartModalOpen(false)}
                className="text-[#7D967E] hover:text-[#183A2A] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {placedOrder ? (
              <div className="text-center space-y-4 py-6">
                <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
                <h3 className="font-display font-bold text-2xl text-[#183A2A]">ORDER CONFIRMED</h3>
                <div className="bg-[#FFF7E8] p-4 rounded-2xl border border-[#7D967E]/30 space-y-2">
                  <span className="text-xs text-[#7D967E] font-bold block uppercase">Your Billing Token</span>
                  <span className="text-2xl font-mono font-black text-[#F47B20] tracking-widest block">
                    {placedOrder.billingNumber || placedOrder._id?.slice(-6).toUpperCase()}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-bold block">Status: ORDER CONFIRMED</span>
                </div>
                <p className="text-xs text-[#202522]">
                  Collect your order from <strong>{placedOrder.pickupPoint}</strong> counter during pickup window.
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
                <ShoppingBag className="w-12 h-12 text-[#7D967E] mx-auto opacity-60" />
                <div>
                  <h4 className="font-bold text-base text-[#183A2A]">Your cart is currently empty</h4>
                  <p className="text-xs text-[#7D967E] mt-1">Explore our menu to add delicious items.</p>
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
              <form onSubmit={handlePlaceOrderSubmit} className="space-y-5 text-xs text-[#202522]">
                
                {/* Cart Items List */}
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {cartItems.map((item) => {
                    const itemId = item.cartId || item.foodId || item._id;
                    const itemUnitPrice = item.unitPrice || item.price || 0;
                    return (
                      <div key={itemId} className="flex items-center justify-between bg-[#FFF7E8] p-3 rounded-xl border border-[#7D967E]/30">
                        <div className="flex-1 pr-3">
                          <h4 className="font-bold text-sm text-[#183A2A]">{item.name}</h4>
                          <p className="text-[11px] text-[#7D967E]">
                            ₹{itemUnitPrice} × {item.quantity} = <strong className="text-[#F47B20]">₹{itemUnitPrice * item.quantity}</strong>
                            {item.selectedOptionLabel && <span className="text-[#F47B20] ml-1">({item.selectedOptionLabel})</span>}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-1.5 bg-[#FFFFFF] px-2 py-1 rounded-lg border border-[#7D967E]/30">
                            <button
                              type="button"
                              onClick={() => updateQuantity(itemId, item.quantity - 1)}
                              className="p-1 rounded text-[#183A2A] hover:text-[#F47B20] transition-colors cursor-pointer"
                              title="Decrease Quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-bold text-xs px-1 text-[#183A2A]">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(itemId, item.quantity + 1)}
                              className="p-1 rounded text-[#183A2A] hover:text-[#F47B20] transition-colors cursor-pointer"
                              title="Increase Quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(itemId)}
                            className="p-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 border border-rose-300 transition-all cursor-pointer shadow-xs"
                            title="Remove item"
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
                  <label className="font-bold text-[#183A2A] block">Select Campus Pickup Point:</label>
                  <select
                    value={checkoutForm.pickupPoint}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, pickupPoint: e.target.value })}
                    className="w-full bg-[#FFF7E8] border border-[#7D967E]/30 text-[#183A2A] rounded-xl px-3 py-2 font-bold focus:outline-none focus:border-[#F47B20]"
                  >
                    <option value="N Block">N Block Counter (Main)</option>
                    <option value="P Block">P Block Counter</option>
                    <option value="H Block">H Block Counter</option>
                    <option value="U Block">U Block Counter</option>
                    <option value="A Block">A Block Counter</option>
                  </select>
                </div>

                {/* Payment Method */}
                <div className="space-y-1.5">
                  <label className="font-bold text-[#183A2A] block">Select Payment Method:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('UPI')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${
                        paymentMethod === 'UPI'
                          ? 'bg-[#F47B20] text-white border-[#F47B20]'
                          : 'bg-[#FFF7E8] text-[#7D967E] border-[#7D967E]/30'
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
                          ? 'bg-[#F47B20] text-white border-[#F47B20]'
                          : 'bg-[#FFF7E8] text-[#7D967E] border-[#7D967E]/30'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Net Banking</span>
                    </button>
                  </div>
                </div>

                {/* Billing Summary */}
                <div className="bg-[#FFF7E8] p-4 rounded-xl border border-[#7D967E]/30 space-y-1.5 font-semibold text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#7D967E]">Food Subtotal:</span>
                    <span className="text-[#183A2A] font-extrabold">₹ {totalCartAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7D967E]">Parcel Charge:</span>
                    <span className="text-[#183A2A] font-extrabold">₹ {parcelCharge}</span>
                  </div>
                  <div className="flex justify-between border-t border-[#7D967E]/30 pt-2 text-sm font-black text-[#F47B20]">
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
