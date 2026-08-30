import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  CreditCard, 
  ArrowRight, 
  ArrowLeft,
  UtensilsCrossed,
  Sparkles,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import ThreeDLogoEmblem from '../components/common/ThreeDLogoEmblem';
import { getImageUrl, handleImageError } from '../utils/imageUtils';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalCartCount, totalCartAmount } = useCart();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const urlMode = searchParams.get('mode');

  const [orderMode, setOrderMode] = useState(urlMode === 'dining' ? 'Dining' : 'Delivery');
  const [orderingSlot, setOrderingSlot] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [selectedPickupLocation, setSelectedPickupLocation] = useState('N BLOCK');
  const [checkoutForm, setCheckoutForm] = useState({
    customerName: user?.name || '',
    customerPhone: user?.phone || '',
    studentId: user?.studentId || '',
    notes: ''
  });

  const [activePaymentSession, setActivePaymentSession] = useState(null);

  const isRestrictedForDining = (categoryName, subcategoryName = '', itemTitle = '') => {
    const cat = (categoryName || '').toLowerCase().trim();
    const sub = (subcategoryName || '').toLowerCase().trim();
    const title = (itemTitle || '').toLowerCase().trim();

    if (cat.includes('breakfast') || sub.includes('breakfast') || title.includes('breakfast')) return true;
    if (cat.includes('burger') || sub.includes('burger') || title.includes('burger')) return true;
    if (cat.includes('pizza') || sub.includes('pizza') || title.includes('pizza')) return true;
    if (cat.includes('sandwich') || sub.includes('sandwich') || title.includes('sandwich')) return true;
    return false;
  };

  useEffect(() => {
    fetchOrderingSlot();
  }, []);

  const fetchOrderingSlot = async () => {
    try {
      const res = await api.get('/ordering-slot');
      setOrderingSlot(res.data);
    } catch (err) {
      console.error('Failed to load ordering slot:', err);
    }
  };

  // Delivery/parcel charge logic: ₹10 per food item for Delivery/Parcel orders (excluding beverages)
  const deliveryCharges = orderMode === 'Dining' ? 0 : cartItems.reduce((acc, item) => {
    const isBeverage = item.category === 'Shakes' || item.category === 'Mocktails' || item.category === 'Juices' || item.category === 'Beverages';
    return isBeverage ? acc : acc + (10 * item.quantity);
  }, 0);

  const grandTotalAmount = totalCartAmount + deliveryCharges;

  const handlePlaceOrderSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    if (orderingSlot && orderingSlot.isOpen === false) {
      showToast('error', orderingSlot?.message || 'Ordering window is currently closed.');
      return;
    }

    if (orderMode === 'Dining') {
      const restrictedItem = cartItems.find(item => isRestrictedForDining(item.category, item.subcategory, item.name));
      if (restrictedItem) {
        showToast('error', `${restrictedItem.name} is not available for Dining orders. Please remove it or switch to Delivery.`);
        return;
      }
    } else {
      if (!selectedPickupLocation) {
        showToast('error', 'Please select a pickup location.');
        return;
      }
    }

    try {
      setOrderSubmitting(true);
      const orderPayload = {
        studentName: checkoutForm.customerName || user?.name || 'Student',
        studentPhone: checkoutForm.customerPhone || user?.phone || '',
        studentId: user?._id || user?.studentId || checkoutForm.studentId || '',
        pickupLocation: orderMode === 'Dining' ? null : selectedPickupLocation,
        pickupPoint: orderMode === 'Dining' ? null : selectedPickupLocation,
        items: cartItems,
        orderType: orderMode === 'Dining' ? 'Dining' : 'Parcel',
        orderMode: orderMode,
        paymentMethod: paymentMethod || 'UPI',
        notes: checkoutForm.notes,
        totalAmount: grandTotalAmount
      };

      const res = await api.post('/future-menu/orders/initiate-payment', orderPayload);
      if (res.data && res.data.paymentSession) {
        setActivePaymentSession({
          order: res.data.order,
          paymentSession: res.data.paymentSession
        });
      } else {
        // Fallback for direct confirmation
        const orderRes = await api.post('/future-menu/orders', orderPayload);
        setPlacedOrder(orderRes.data.order || orderRes.data);
        clearCart();
        showToast('success', 'Order placed successfully!');
      }
    } catch (err) {
      console.error('Place order error:', err);
      const backendMsg = err.response?.data?.error || err.response?.data?.message;
      showToast('error', backendMsg || 'Failed to initiate payment session. Please try again.');
    } finally {
      setOrderSubmitting(false);
    }
  };

  const handleSimulatePaymentSuccess = async () => {
    if (!activePaymentSession) return;
    try {
      setOrderSubmitting(true);
      const { order, paymentSession } = activePaymentSession;
      const res = await api.post('/future-menu/orders/confirm-payment', {
        orderId: order._id || order.orderId,
        transactionId: paymentSession.transactionId,
        signature: paymentSession.signature,
        paymentReference: paymentSession.transactionId
      });

      const confirmedOrder = res.data.order || res.data;
      setPlacedOrder(confirmedOrder);
      clearCart();
      setActivePaymentSession(null);
      showToast('success', 'Payment verified and order automatically confirmed!');
    } catch (err) {
      console.error('Payment confirmation error:', err);
      const backendMsg = err.response?.data?.error || err.response?.data?.message;
      showToast('error', backendMsg || 'Payment verification failed.');
    } finally {
      setOrderSubmitting(false);
    }
  };

  const handleSimulatePaymentFailure = async (reason = 'Payment cancelled by user') => {
    if (!activePaymentSession) return;
    try {
      setOrderSubmitting(true);
      const { order, paymentSession } = activePaymentSession;
      await api.post('/future-menu/orders/fail-payment', {
        orderId: order._id || order.orderId,
        transactionId: paymentSession?.transactionId,
        reason
      });
      setActivePaymentSession(null);
      showToast('error', 'Payment was cancelled/failed. Your cart items are preserved for retry.');
    } catch (err) {
      console.error('Payment cancellation error:', err);
      setActivePaymentSession(null);
    } finally {
      setOrderSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FFF7E8] text-[#202522] min-h-screen selection:bg-[#F47B20] selection:text-white font-sans">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-24 space-y-8">
        
        {/* Page Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#7D967E]/20">
          <div className="flex items-center gap-3">
            <Link 
              to="/menu"
              className="p-2.5 rounded-2xl bg-white border border-[#7D967E]/30 text-[#183A2A] hover:bg-[#183A2A] hover:text-[#FFF7E8] transition-all shadow-xs"
              title="Back to Menu"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#183A2A]/5 border border-[#183A2A]/10 text-[#183A2A] text-[10px] font-extrabold tracking-widest uppercase mb-0.5">
                <ShoppingBag className="w-3 h-3 text-[#F47B20]" />
                <span>YOUR SELECTION</span>
              </div>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#183A2A]">
                YOUR CART
              </h1>
            </div>
          </div>

          {/* Ordering Window Slot Info */}
          {orderingSlot && (
            <div className="flex items-center gap-2 text-xs bg-white px-4 py-2 rounded-2xl border border-[#7D967E]/30 shadow-xs">
              <Clock className="w-4 h-4 text-[#F47B20]" />
              <span className="font-bold text-[#183A2A]">{orderingSlot.orderingWindow || '09:30 AM — 10:30 AM'}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                orderingSlot.isOpen ? 'bg-[#183A2A] text-[#FFF7E8]' : 'bg-rose-100 text-rose-700 border border-rose-300'
              }`}>
                {orderingSlot.isOpen ? 'OPEN' : 'CLOSED'}
              </span>
            </div>
          )}
        </div>

        {/* ORDER CONFIRMED VIEW */}
        {placedOrder ? (
          <div className="max-w-xl mx-auto bg-white p-8 sm:p-10 rounded-3xl border border-[#7D967E]/30 text-center space-y-6 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-[#183A2A]/10 text-[#F47B20] border border-[#F47B20]/30 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8 text-[#F47B20]" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black text-[#F47B20] uppercase tracking-widest block">
                PAYMENT CONFIRMED
              </span>
              <h2 className="font-display font-extrabold text-3xl text-[#183A2A] tracking-tight">
                ORDER CONFIRMED
              </h2>
            </div>

            <div className="bg-[#FFF7E8] p-5 rounded-2xl border border-[#7D967E]/30 space-y-1.5 max-w-md mx-auto">
              <span className="text-[10px] text-[#7D967E] font-black uppercase tracking-wider block">Official Billing Token</span>
              <span className="text-3xl font-mono font-black text-[#F47B20] tracking-widest block">
                {placedOrder.billingNumber || placedOrder._id?.slice(-6).toUpperCase()}
              </span>
              <span className="text-xs text-[#183A2A] font-extrabold block pt-1">
                Status: 🟢 ORDER CONFIRMED
              </span>
            </div>

            <div className="text-xs text-[#183A2A] space-y-1 bg-gray-50 p-4 rounded-xl text-left border border-gray-200">
              <div className="flex justify-between border-b pb-1">
                <span className="font-bold text-[#7D967E]">Order Number:</span>
                <span className="font-mono font-bold">{placedOrder.orderNumber || placedOrder.orderId}</span>
              </div>
              <div className="flex justify-between border-b py-1">
                <span className="font-bold text-[#7D967E]">Order Mode:</span>
                <span className="font-bold uppercase">{placedOrder.orderType || placedOrder.orderMode}</span>
              </div>
              <div className="flex justify-between border-b py-1">
                <span className="font-bold text-[#7D967E]">Pickup Location:</span>
                <span className="font-bold text-[#F47B20]">{placedOrder.pickupLocation || placedOrder.pickupPoint || 'Not applicable'}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="font-bold text-[#7D967E]">Amount Paid:</span>
                <span className="font-mono font-black text-[#183A2A]">₹ {placedOrder.totalAmount || placedOrder.total}</span>
              </div>
            </div>

            {placedOrder.orderType !== 'Dining' && placedOrder.pickupLocation && (
              <p className="text-xs text-[#7D967E] max-w-md mx-auto leading-relaxed font-medium">
                Please collect your order from <strong className="text-[#183A2A]">{placedOrder.pickupLocation || placedOrder.pickupPoint}</strong> counter during the pickup window.
              </p>
            )}

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link 
                to="/profile" 
                className="w-full sm:w-auto py-3 px-8 rounded-xl bg-[#F47B20] hover:bg-[#FF882E] text-white text-xs font-extrabold transition-all shadow-md text-center"
              >
                View My Orders
              </Link>
              <Link 
                to="/menu" 
                className="w-full sm:w-auto py-3 px-6 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#183A2A] text-xs font-extrabold transition-all text-center"
              >
                Back to Menu
              </Link>
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          /* EMPTY CART VIEW */
          <div className="max-w-md mx-auto bg-white p-10 sm:p-12 rounded-3xl border border-[#7D967E]/30 text-center space-y-6 shadow-xl">
            <div className="w-20 h-20 rounded-full bg-[#FFF7E8] border border-[#7D967E]/30 flex items-center justify-center mx-auto text-[#7D967E]">
              <ShoppingBag className="w-10 h-10 text-[#7D967E]" />
            </div>

            <div className="space-y-2">
              <h3 className="font-display font-extrabold text-2xl text-[#183A2A]">
                YOUR CART IS EMPTY
              </h3>
              <p className="text-xs text-[#7D967E] font-medium leading-relaxed">
                Looks like you haven't added anything yet.
              </p>
            </div>

            <Link 
              to="/menu" 
              className="w-full py-3.5 px-8 rounded-xl bg-[#F47B20] hover:bg-[#FF882E] text-white text-xs font-extrabold uppercase tracking-wider transition-all shadow-md inline-flex items-center justify-center gap-2"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>EXPLORE MENU</span>
            </Link>
          </div>
        ) : (
          /* 2-COLUMN CART VIEW (ITEMS + ORDER SUMMARY & PAYMENT) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT / MAIN COLUMN: CART ITEMS */}
            <div className="lg:col-span-7 space-y-4">
              
              <div className="bg-white rounded-3xl border border-[#7D967E]/30 p-6 sm:p-8 shadow-xl space-y-6">
                
                <div className="flex items-center justify-between border-b border-[#7D967E]/20 pb-4">
                  <h2 className="font-display font-extrabold text-lg text-[#183A2A] uppercase tracking-wider flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#F47B20]" />
                    <span>Cart Items ({cartItems.length})</span>
                  </h2>

                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-xs text-rose-600 hover:text-rose-800 font-extrabold transition-colors cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                {/* Items List */}
                <div className="space-y-4">
                  {cartItems.map((item) => {
                    const itemId = item.cartId || item.foodId || item._id;
                    const itemUnitPrice = item.unitPrice || item.price || 0;
                    const itemSubtotal = itemUnitPrice * item.quantity;

                    return (
                      <div 
                        key={itemId} 
                        className="p-4 sm:p-5 rounded-2xl bg-[#FFF7E8]/50 border border-[#7D967E]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#183A2A]/40 transition-all shadow-xs"
                      >
                        {/* Food Image & Details */}
                        <div className="flex items-center gap-3.5 flex-1">
                          <img
                            src={getImageUrl(item.image, item.category)}
                            alt={item.name}
                            onError={(e) => handleImageError(e, item.category)}
                            className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border border-[#7D967E]/30 shrink-0 shadow-xs"
                          />

                          <div className="space-y-1">
                            <h3 className="font-display font-extrabold text-base text-[#183A2A]">
                              {item.name}
                            </h3>
                            
                            <p className="text-xs text-[#7D967E] font-medium">
                              ₹{itemUnitPrice} / item
                              {item.selectedOptionLabel && (
                                <span className="text-[#F47B20] font-extrabold ml-1.5">
                                  ({item.selectedOptionLabel})
                                </span>
                              )}
                            </p>

                            <p className="text-xs font-bold text-[#183A2A] pt-0.5">
                              Subtotal: <span className="font-mono font-black text-[#F47B20]">₹{itemSubtotal}</span>
                            </p>
                          </div>
                        </div>

                        {/* Quantity Controls & Remove */}
                        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#7D967E]/20">
                          
                          {/* Quantity Counter (− 2 +) */}
                          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#7D967E]/30 shadow-xs">
                            <button
                              type="button"
                              onClick={() => updateQuantity(itemId, -1)}
                              className="p-1 rounded-lg text-[#183A2A] hover:bg-[#183A2A]/10 transition-colors cursor-pointer"
                              title="Decrease Quantity"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>

                            <span className="font-mono font-black text-sm text-[#183A2A] px-2 min-w-[1.25rem] text-center">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() => updateQuantity(itemId, 1)}
                              className="p-1 rounded-lg text-[#183A2A] hover:bg-[#183A2A]/10 transition-colors cursor-pointer"
                              title="Increase Quantity"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            type="button"
                            onClick={() => removeFromCart(itemId)}
                            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-all cursor-pointer shadow-xs"
                            title="Remove item"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>

                {/* Bottom Action Bar */}
                <div className="pt-3 border-t border-[#7D967E]/20 flex items-center justify-between">
                  <Link 
                    to="/menu" 
                    className="text-xs text-[#F47B20] hover:text-[#183A2A] font-extrabold transition-colors inline-flex items-center gap-1"
                  >
                    <span>+ Add More Items from Menu</span>
                  </Link>

                  <span className="text-xs text-[#7D967E] font-medium">
                    {totalCartCount} total items in cart
                  </span>
                </div>

              </div>

            </div>

            {/* RIGHT COLUMN: STICKY ORDER SUMMARY & PAYMENT */}
            <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
              
              <div className="bg-white rounded-3xl border border-[#7D967E]/30 p-6 sm:p-8 shadow-xl space-y-6">
                
                <div className="flex items-center justify-between border-b border-[#7D967E]/20 pb-4">
                  <h2 className="font-display font-extrabold text-lg text-[#183A2A] uppercase tracking-wider">
                    ORDER SUMMARY
                  </h2>
                  <ThreeDLogoEmblem size="small" interactive={false} />
                </div>

                {/* Form Controls for Counter & Payment Method */}
                <form onSubmit={handlePlaceOrderSubmit} className="space-y-5">
                  
                  {/* ORDER TYPE SELECTOR */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-[#183A2A] uppercase tracking-wider flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <UtensilsCrossed className="w-3.5 h-3.5 text-[#F47B20]" />
                        <span>ORDER TYPE</span>
                      </div>
                      <span className="text-[10px] text-[#F47B20] font-black uppercase tracking-wider">{orderMode}</span>
                    </label>

                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setOrderMode('Delivery')}
                        className={`p-3 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          orderMode === 'Delivery'
                            ? 'bg-[#183A2A] text-[#FFF7E8] border-[#183A2A] shadow-xs'
                            : 'bg-[#FFF7E8]/50 text-[#7D967E] border-[#7D967E]/40 hover:text-[#183A2A]'
                        }`}
                      >
                        <ShoppingBag className="w-4 h-4 text-[#F47B20]" />
                        <span>DELIVERY / TAKEAWAY</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setOrderMode('Dining')}
                        className={`p-3 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          orderMode === 'Dining'
                            ? 'bg-[#183A2A] text-[#FFF7E8] border-[#183A2A] shadow-xs'
                            : 'bg-[#FFF7E8]/50 text-[#7D967E] border-[#7D967E]/40 hover:text-[#183A2A]'
                        }`}
                      >
                        <UtensilsCrossed className="w-4 h-4 text-[#F47B20]" />
                        <span>IN-PERSON DINING</span>
                      </button>
                    </div>
                  </div>

                  {/* CONDITIONAL PICKUP LOCATION SELECTOR (ONLY FOR DELIVERY/PICKUP MODE) */}
                  {orderMode !== 'Dining' && (
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-[#183A2A] uppercase tracking-wider flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#F47B20]" />
                          <span>PICKUP LOCATION</span>
                        </div>
                        <span className="text-[10px] text-[#F47B20] font-black uppercase tracking-wider">Required</span>
                      </label>

                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {['A BLOCK', 'N BLOCK', 'P BLOCK', 'H BLOCK', 'U BLOCK'].map((location) => {
                          const isSelected = selectedPickupLocation === location;
                          return (
                            <button
                              key={location}
                              type="button"
                              onClick={() => setSelectedPickupLocation(location)}
                              className={`py-3 px-2 rounded-xl text-xs font-extrabold transition-all border text-center cursor-pointer ${
                                isSelected
                                  ? 'bg-[#F47B20] text-white border-[#F47B20] shadow-md scale-[1.03]'
                                  : 'bg-[#FFF7E8]/60 text-[#183A2A] border-[#7D967E]/30 hover:border-[#183A2A] hover:bg-white'
                              }`}
                            >
                              {location}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Payment Method Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-[#183A2A] uppercase tracking-wider flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-[#F47B20]" />
                      <span>Payment Method</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('UPI')}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          paymentMethod === 'UPI'
                            ? 'bg-[#183A2A] text-[#FFF7E8] border-[#183A2A] shadow-xs'
                            : 'bg-[#FFF7E8]/50 text-[#7D967E] border-[#7D967E]/40 hover:text-[#183A2A]'
                        }`}
                      >
                        <CreditCard className="w-3.5 h-3.5 text-[#F47B20]" />
                        <span>UPI Payment</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('Net Banking')}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          paymentMethod === 'Net Banking'
                            ? 'bg-[#183A2A] text-[#FFF7E8] border-[#183A2A] shadow-xs'
                            : 'bg-[#FFF7E8]/50 text-[#7D967E] border-[#7D967E]/40 hover:text-[#183A2A]'
                        }`}
                      >
                        <CreditCard className="w-3.5 h-3.5 text-[#F47B20]" />
                        <span>Net Banking</span>
                      </button>
                    </div>
                  </div>

                  {/* Financial Breakdown Table */}
                  <div className="p-4 rounded-2xl bg-[#FFF7E8] border border-[#7D967E]/30 space-y-2.5 text-xs font-medium text-[#7D967E]">
                    <div className="flex justify-between items-center">
                      <span>Total Items</span>
                      <span className="font-bold text-[#183A2A]">{totalCartCount}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Total Cost</span>
                      <span className="font-mono font-bold text-[#183A2A]">₹{totalCartAmount}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Delivery / Parcel Charges</span>
                      <span className="font-mono font-bold text-[#183A2A]">₹{deliveryCharges}</span>
                    </div>

                    <div className="border-t border-[#7D967E]/30 pt-2.5 flex justify-between items-center text-sm font-extrabold text-[#183A2A]">
                      <span>Grand Total</span>
                      <span className="font-mono font-black text-base text-[#F47B20]">₹{grandTotalAmount}</span>
                    </div>
                  </div>

                  {/* PAYMENT ACTION */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-xs font-extrabold text-[#7D967E] uppercase tracking-wider">
                        TOTAL TO PAY
                      </span>
                      <span className="font-mono font-black text-xl text-[#183A2A]">
                        ₹{grandTotalAmount}
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={orderSubmitting}
                      className="w-full py-4 px-6 rounded-xl bg-[#F47B20] hover:bg-[#FF882E] text-white text-xs font-extrabold uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <span>{orderSubmitting ? 'PROCESSING PAYMENT...' : 'PROCEED TO PAYMENT'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </form>

              </div>

            </div>

          </div>
        )}

      {/* TEST PAYMENT GATEWAY MODAL (SANDBOX MODE) */}
      {activePaymentSession && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#7D967E]/30 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 relative animate-fadeIn">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#7D967E]/20 pb-4">
              <div>
                <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-[#F47B20] tracking-widest">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>TEST / SANDBOX GATEWAY</span>
                </div>
                <h3 className="font-display font-extrabold text-xl text-[#183A2A]">
                  MHP Secure Checkout
                </h3>
              </div>
              <ThreeDLogoEmblem size="small" interactive={false} />
            </div>

            {/* Session Info */}
            <div className="bg-[#FFF7E8] p-4 rounded-2xl border border-[#7D967E]/30 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#7D967E] font-bold">Order ID:</span>
                <span className="font-mono font-bold text-[#183A2A]">{activePaymentSession.order?.orderNumber || activePaymentSession.order?.orderId}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#7D967E] font-bold">Order Mode:</span>
                <span className="font-bold text-[#183A2A] uppercase">{activePaymentSession.order?.orderType || activePaymentSession.order?.orderMode}</span>
              </div>
              {activePaymentSession.order?.pickupLocation && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#7D967E] font-bold">Pickup Location:</span>
                  <span className="font-bold text-[#F47B20]">{activePaymentSession.order?.pickupLocation}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-[#7D967E]/20">
                <span className="text-xs font-extrabold text-[#183A2A] uppercase">Total Payable:</span>
                <span className="text-xl font-mono font-black text-[#F47B20]">₹ {activePaymentSession.paymentSession?.amount}</span>
              </div>
            </div>

            {/* Simulated Payment Actions */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleSimulatePaymentSuccess}
                disabled={orderSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-[#183A2A] hover:bg-[#204935] text-[#FFF7E8] text-xs font-extrabold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4 text-[#F47B20]" />
                <span>{orderSubmitting ? 'Verifying Signature...' : 'Simulate Payment Success'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSimulatePaymentFailure('Payment cancelled by user')}
                disabled={orderSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#183A2A] text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <AlertCircle className="w-4 h-4 text-gray-500" />
                <span>Cancel / Abandon Payment</span>
              </button>
            </div>

            <p className="text-[10px] text-center text-[#7D967E] font-medium">
              Mode: <strong className="uppercase">{activePaymentSession.paymentSession?.paymentMode || 'test'}</strong> — Cryptographic HMAC signature verification active.
            </p>
          </div>
        </div>
      )}

      </div>

    </div>
  );
};

export default CartPage;
