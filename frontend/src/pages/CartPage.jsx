import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import ThreeDSpatialCard from '../components/common/ThreeDSpatialCard';
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
  UtensilsCrossed 
} from 'lucide-react';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalCartCount, totalCartAmount } = useCart();
  const { showToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orderingSlot, setOrderingSlot] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [checkoutForm, setCheckoutForm] = useState({
    customerName: user?.name || '',
    customerPhone: user?.phone || '',
    studentId: user?.studentId || '',
    pickupPoint: 'N Block',
    notes: ''
  });

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

  // Calculate parcel charges: ₹10 per item EXCEPT beverages (Shakes, Mocktails, Juices)
  const parcelCharge = cartItems.reduce((acc, item) => {
    const isBeverage = item.category === 'Shakes' || item.category === 'Mocktails' || item.category === 'Juices' || item.category === 'Beverages';
    return isBeverage ? acc : acc + (10 * item.quantity);
  }, 0);

  const grandTotalAmount = totalCartAmount + parcelCharge;

  const handlePlaceOrderSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    if (orderingSlot && orderingSlot.isOpen === false) {
      showToast('error', orderingSlot?.message || 'Ordering window is currently closed.');
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
        orderType: 'Parcel',
        paymentMethod: paymentMethod || 'UPI',
        paymentStatus: 'PAID',
        notes: checkoutForm.notes
      };

      const res = await api.post('/future-menu/orders', orderPayload);
      setPlacedOrder(res.data);
      clearCart();
      showToast('success', 'Order placed successfully!');
    } catch (err) {
      console.error('Place order error:', err);
      showToast('error', 'Failed to place order. Please try again.');
    } finally {
      setOrderSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#121113] text-[#F4ECE4] py-6 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-3xl mx-auto w-full space-y-5">

        {/* Back Link & Page Title Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#4A1F31]">
          <div className="flex items-center gap-3">
            <Link 
              to="/menu"
              className="p-2 rounded-xl bg-[#291620] border border-[#4A1F31] text-[#C8BDB6] hover:text-[#F4ECE4] transition-colors"
              title="Back to Menu"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="font-display font-bold text-xl sm:text-2xl text-[#F4ECE4] flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-[#C86F4D]" />
                <span>MHP Parcel Cart</span>
              </h1>
              <p className="text-xs text-[#C8BDB6]">
                {totalCartCount > 0 
                  ? `Review your ${totalCartCount} item${totalCartCount === 1 ? '' : 's'} and select takeaway pickup point.`
                  : 'Your cart is empty. Add takeaway items from the menu.'}
              </p>
            </div>
          </div>

          {/* Ordering Slot Badge */}
          {orderingSlot && (
            <div className="hidden sm:flex items-center gap-2 text-xs bg-[#291620] px-3.5 py-1.5 rounded-full border border-[#4A1F31]">
              <Clock className="w-3.5 h-3.5 text-[#C86F4D]" />
              <span className="font-bold">{orderingSlot.orderingWindow || '09:30 AM — 10:30 AM'}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                orderingSlot.isOpen ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-rose-950 text-rose-300 border border-rose-800'
              }`}>
                {orderingSlot.isOpen ? 'OPEN' : 'CLOSED'}
              </span>
            </div>
          )}
        </div>

        {/* ORDER PLACED SUCCESS VIEW */}
        {placedOrder ? (
          <ThreeDSpatialCard className="p-8 text-center space-y-5 bg-[#291620] border border-[#4A1F31]">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
            <h2 className="font-display font-bold text-3xl text-[#F4ECE4]">ORDER CONFIRMED</h2>
            <div className="bg-[#121113] p-5 rounded-2xl border border-[#4A1F31] space-y-2 max-w-md mx-auto">
              <span className="text-xs text-[#C8BDB6] font-bold block uppercase tracking-wider">Your Official Billing Token</span>
              <span className="text-3xl font-mono font-black text-[#C86F4D] tracking-widest block">
                {placedOrder.billingNumber || placedOrder._id?.slice(-6).toUpperCase()}
              </span>
              <span className="text-xs text-emerald-300 font-bold block">Status: ORDER CONFIRMED</span>
            </div>
            <p className="text-xs text-[#C8BDB6] max-w-md mx-auto">
              Please collect your parcel order from <strong className="text-[#F4ECE4]">{placedOrder.pickupPoint}</strong> counter during pickup window 12:00 PM — 1:00 PM.
            </p>
            <div className="pt-2 flex justify-center gap-4">
              <Link to="/profile" className="btn-mhp-primary text-xs px-8 py-3">
                View My Orders
              </Link>
              <button 
                onClick={() => setPlacedOrder(null)} 
                className="btn-mhp-secondary text-xs px-6 py-3"
              >
                Done
              </button>
            </div>
          </ThreeDSpatialCard>
        ) : cartItems.length === 0 ? (
          /* EMPTY CART VIEW */
          <ThreeDSpatialCard className="p-12 text-center space-y-4 bg-[#291620] border border-[#4A1F31] max-w-lg mx-auto">
            <ShoppingBag className="w-16 h-16 text-[#C8BDB6] mx-auto opacity-50" />
            <div className="space-y-1">
              <h3 className="font-display font-bold text-xl text-[#F4ECE4]">Your cart is currently empty</h3>
              <p className="text-xs text-[#C8BDB6]">
                You haven't added any parcel takeaway dishes yet. Browse our menu to add items.
              </p>
            </div>
            <Link to="/menu?mode=delivery" className="btn-mhp-primary text-xs px-8 py-3 inline-flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-white" />
              <span>Browse Menu & Order</span>
            </Link>
          </ThreeDSpatialCard>
        ) : (
          /* COMPACT FULL FUNCTIONAL CART VIEW */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* Left Column: Items List */}
            <div className="lg:col-span-7 bg-[#291620] p-5 rounded-2xl border border-[#4A1F31] space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#4A1F31] pb-2 text-xs font-bold text-[#C8BDB6]">
                <span>SELECTED DISHES ({cartItems.length})</span>
                <span>QTY & PRICE</span>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {cartItems.map((item) => {
                  const itemId = item.cartId || item.foodId || item._id;
                  const itemUnitPrice = item.unitPrice || item.price || 0;
                  return (
                    <div key={itemId} className="flex items-center justify-between bg-[#121113] p-3 rounded-xl border border-[#4A1F31] hover:border-[#C86F4D]/50 transition-all">
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

                        {/* Trash Remove Button */}
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

              <div className="pt-2 flex items-center justify-between text-xs text-[#C8BDB6]">
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-rose-400 hover:text-rose-300 font-bold transition-colors"
                >
                  Clear Entire Cart
                </button>
                <Link to="/menu?mode=delivery" className="text-[#C86F4D] hover:text-[#F4ECE4] font-bold transition-colors">
                  + Add More Dishes
                </Link>
              </div>
            </div>

            {/* Right Column: Checkout Controls & Billing Summary */}
            <div className="lg:col-span-5 bg-[#291620] p-5 rounded-2xl border border-[#4A1F31] space-y-4 shadow-xl">
              <form onSubmit={handlePlaceOrderSubmit} className="space-y-4 text-xs">
                
                {/* Campus Pickup Point */}
                <div className="space-y-1.5">
                  <label className="font-bold text-[#F4ECE4] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#C86F4D]" />
                    <span>Campus Pickup Counter:</span>
                  </label>
                  <select
                    value={checkoutForm.pickupPoint}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, pickupPoint: e.target.value })}
                    className="w-full bg-[#121113] border border-[#4A1F31] text-[#F4ECE4] rounded-xl px-3 py-2.5 font-bold focus:outline-none focus:border-[#C86F4D]"
                  >
                    <option value="P Block">P Block Counter</option>
                    <option value="N Block">N Block Counter (Main)</option>
                    <option value="H Block">H Block Counter</option>
                    <option value="U Block">U Block Counter</option>
                    <option value="A Block">A Block Counter</option>
                  </select>
                </div>

                {/* Payment Method */}
                <div className="space-y-1.5">
                  <label className="font-bold text-[#F4ECE4] flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-[#C86F4D]" />
                    <span>Payment Method:</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('UPI')}
                      className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        paymentMethod === 'UPI'
                          ? 'bg-[#C86F4D] text-white border-[#C86F4D] shadow-sm'
                          : 'bg-[#121113] text-[#C8BDB6] border-[#4A1F31]'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>UPI</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Net Banking')}
                      className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        paymentMethod === 'Net Banking'
                          ? 'bg-[#C86F4D] text-white border-[#C86F4D] shadow-sm'
                          : 'bg-[#121113] text-[#C8BDB6] border-[#4A1F31]'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Net Banking</span>
                    </button>
                  </div>
                </div>

                {/* Billing Summary */}
                <div className="bg-[#121113] p-3.5 rounded-xl border border-[#4A1F31] space-y-1.5 font-semibold text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#C8BDB6]">Subtotal ({totalCartCount} items):</span>
                    <span>₹ {totalCartAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#C8BDB6]">Parcel Charge (₹10/item):</span>
                    <span>₹ {parcelCharge}</span>
                  </div>
                  <div className="flex justify-between border-t border-[#4A1F31] pt-2 text-sm font-black text-[#C86F4D]">
                    <span>Total Payable:</span>
                    <span>₹ {grandTotalAmount}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={orderSubmitting}
                  className="btn-mhp-primary text-xs w-full py-3.5 font-bold shadow-xl flex items-center justify-center gap-2"
                >
                  <span>{orderSubmitting ? 'Processing Order...' : `Confirm & Pay ₹${grandTotalAmount}`}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default CartPage;
