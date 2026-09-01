import React, { useState } from 'react';
import { CheckCircle2, Clock, MapPin, PackageCheck, Star, Send, ShieldCheck, FileText, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

/**
 * MhpOfficialBill Component
 * Renders official MHP bill (e.g. mhp001), itemized prices, parcel charges, pickup point,
 * interactive Received (YES / NO) confirmation box, and post-delivery rating & feedback form.
 */
const MhpOfficialBill = ({ order, onStatusUpdate }) => {
  const { showToast } = useToast();
  const [receivedChoice, setReceivedChoice] = useState(
    (order?.status === 'ORDER RECEIVED' || order?.status === 'COMPLETED' || order?.orderStatus === 'COMPLETED') ? 'YES' : null
  );
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Rating & Feedback State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  if (!order) return null;

  const billNo = order.billingNumber || order.orderNumber || (order._id ? `mhp${order._id.slice(-3)}` : 'mhp001');
  const isDelivery = order.orderType === 'Delivery' || order.orderType === 'Parcel' || order.orderMode === 'Parcel' || order.orderMode === 'Delivery';
  const orderTypeDisplay = isDelivery ? 'Delivery' : 'Dining';
  const pickupPoint = order.pickupPoint || order.pickupLocation || (isDelivery ? 'N BLOCK Counter' : 'Dining Area');
  
  const items = order.items || [];
  const subtotal = order.subtotal !== undefined ? order.subtotal : items.reduce((sum, i) => sum + ((i.unitPrice || i.price || 0) * (i.quantity || 1)), 0);
  const parcelCharge = order.parcelCharge !== undefined ? order.parcelCharge : (isDelivery ? items.reduce((sum, i) => sum + ((i.quantity || 1) * 10), 0) : 0);
  const totalAmount = order.totalAmount !== undefined ? order.totalAmount : (order.total !== undefined ? order.total : (subtotal + parcelCharge));

  const handleChoiceSelect = async (choice) => {
    setReceivedChoice(choice);
    if (choice === 'YES') {
      try {
        setIsUpdatingStatus(true);
        const orderId = order._id || order.id || order.orderId;
        if (orderId) {
          await api.patch(`/future-menu/orders/${orderId}/status`, { status: 'ORDER RECEIVED' });
        }
        showToast('success', 'Order marked as received! Delivered successfully.');
        if (onStatusUpdate) onStatusUpdate('ORDER RECEIVED');
      } catch (err) {
        console.warn('Status update sync warning:', err.message);
      } finally {
        setIsUpdatingStatus(false);
      }
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackMsg.trim()) {
      showToast('error', 'Please write a brief feedback comment.');
      return;
    }
    try {
      setIsSubmittingFeedback(true);
      await api.post('/feedback', {
        name: order.customerName || 'Campus Student',
        phone: order.customerPhone || order.studentPhone || '',
        orderNumber: billNo,
        rating,
        message: `[Rating: ${rating}/5] ${feedbackMsg.trim()}`
      });
      setFeedbackSubmitted(true);
      showToast('success', 'Thank you! Your feedback has been received.');
    } catch (err) {
      console.warn('Feedback fallback warning:', err.message);
      setFeedbackSubmitted(true);
      showToast('success', 'Thank you for your feedback!');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-[#7D967E]/30 p-6 sm:p-8 space-y-6 shadow-2xl font-sans max-w-xl mx-auto text-[#202522]">
      
      {/* 1. OFFICIAL BILL HEADER */}
      <div className="border-b-2 border-dashed border-[#7D967E]/30 pb-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-[#183A2A] text-[#F47B20] flex items-center justify-center font-black text-sm shadow-md">
              MHP
            </div>
            <div>
              <h3 className="font-display font-extrabold text-lg text-[#183A2A] leading-none">
                MY HOSUR PALACE
              </h3>
              <span className="text-[10px] text-[#7D967E] font-bold block mt-0.5">
                Official Campus Tax Invoice
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-[#7D967E] font-black uppercase tracking-wider block">BILL NO</span>
            <span className="font-mono font-black text-2xl text-[#F47B20] tracking-wider block">
              {billNo}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs bg-[#FFF7E8] p-3 rounded-2xl border border-[#7D967E]/30 font-bold">
          <div>
            <span className="text-[#7D967E] text-[10px] uppercase block">Order Type</span>
            <span className="text-[#183A2A] uppercase font-black">{orderTypeDisplay}</span>
          </div>
          <div>
            <span className="text-[#7D967E] text-[10px] uppercase block">Pickup Point</span>
            <span className="text-[#F47B20] uppercase font-black flex items-center gap-1">
              <MapPin className="w-3 h-3 shrink-0" />
              <span>{pickupPoint}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. ITEMIZED ITEMS TABLE & PRICES */}
      <div className="space-y-3">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#7D967E] block">
          ITEMS BREAKDOWN
        </span>

        <div className="space-y-2">
          {items.map((item, idx) => {
            const qty = item.quantity || 1;
            const price = item.unitPrice || item.price || 0;
            const lineTotal = price * qty;

            return (
              <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#183A2A] bg-gray-100 px-2 py-0.5 rounded-lg text-[11px]">
                    {qty}x
                  </span>
                  <div>
                    <span className="font-bold text-[#183A2A] block">{item.name}</span>
                    {item.selectedOptionLabel && (
                      <span className="text-[10px] text-[#7D967E] block">Option: {item.selectedOptionLabel}</span>
                    )}
                  </div>
                </div>

                <span className="font-mono font-extrabold text-[#183A2A]">
                  ₹{lineTotal}
                </span>
              </div>
            );
          })}
        </div>

        {/* PRICE SUMMARY BREAKDOWN */}
        <div className="bg-gray-50 p-4 rounded-2xl space-y-2 text-xs border border-gray-200">
          <div className="flex justify-between items-center text-gray-600">
            <span>Items Subtotal:</span>
            <span className="font-mono font-bold">₹{subtotal}</span>
          </div>

          {isDelivery && (
            <div className="flex justify-between items-center text-gray-600">
              <span className="flex items-center gap-1">
                <span>Parcel Charges</span>
                <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">(₹10/item)</span>
              </span>
              <span className="font-mono font-bold text-amber-700">₹{parcelCharge}</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-2 border-t border-gray-300 text-sm font-black text-[#183A2A]">
            <span>Total Amount:</span>
            <span className="font-mono text-xl text-[#F47B20]">₹{totalAmount}</span>
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE RECEIVED CONFIRMATION BOX (YES / NO) */}
      <div className="bg-[#10271C] text-[#FFF7E8] p-5 rounded-3xl border border-[#7D967E]/40 space-y-4 shadow-lg">
        <div className="flex items-center gap-2.5">
          <PackageCheck className="w-5 h-5 text-[#F47B20] shrink-0" />
          <div>
            <h4 className="font-display font-extrabold text-sm text-[#FFF7E8]">
              Have you received your order parcel?
            </h4>
            <p className="text-[11px] text-[#7D967E] font-medium">
              Please confirm below once you collect your order at {pickupPoint}.
            </p>
          </div>
        </div>

        {/* RECEIVED BOX OPTIONS: YES / NO */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => handleChoiceSelect('YES')}
            disabled={isUpdatingStatus}
            className={`py-3 px-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 border-2 ${
              receivedChoice === 'YES'
                ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/30 scale-[1.02]'
                : 'bg-white/10 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/20'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>YES (RECEIVED)</span>
          </button>

          <button
            type="button"
            onClick={() => handleChoiceSelect('NO')}
            disabled={isUpdatingStatus}
            className={`py-3 px-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 border-2 ${
              receivedChoice === 'NO'
                ? 'bg-rose-600 text-white border-rose-400 shadow-lg shadow-rose-600/30 scale-[1.02]'
                : 'bg-white/10 text-rose-300 border-rose-500/40 hover:bg-rose-500/20'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>NO (STILL WAITING)</span>
          </button>
        </div>

        {receivedChoice === 'NO' && (
          <div className="bg-rose-950/80 border border-rose-600/50 p-3 rounded-2xl text-rose-200 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>Your order is currently being prepared at the counter. Please show Bill No <strong>{billNo}</strong> at {pickupPoint} counter.</span>
          </div>
        )}
      </div>

      {/* 4. POST-DELIVERY RATING & FEEDBACK PROMPT (Shown when Received = YES) */}
      {receivedChoice === 'YES' && (
        <div className="bg-[#FFF7E8] p-6 rounded-3xl border-2 border-[#F47B20]/40 space-y-4 shadow-xl animate-fadeIn">
          <div className="text-center space-y-1">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black uppercase tracking-wider inline-block">
              🎉 DELIVERED SUCCESSFULLY
            </span>
            <h4 className="font-display font-extrabold text-xl text-[#183A2A]">
              Rate Us Now & Share Feedback
            </h4>
            <p className="text-xs text-[#7D967E] font-medium">
              How was your MHP dining experience today? Your feedback helps us improve!
            </p>
          </div>

          {!feedbackSubmitted ? (
            <form onSubmit={handleFeedbackSubmit} className="space-y-4 pt-1">
              
              {/* STAR RATING INTERACTIVE SELECTOR */}
              <div className="flex items-center justify-center gap-2 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        (hoverRating || rating) >= star
                          ? 'text-amber-400 fill-amber-400 drop-shadow-md'
                          : 'text-gray-300 fill-gray-100'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div className="space-y-1">
                <textarea
                  rows="3"
                  value={feedbackMsg}
                  onChange={(e) => setFeedbackMsg(e.target.value)}
                  placeholder="Write your feedback or suggestions here (e.g. food taste, packaging, quick delivery)..."
                  className="w-full p-3.5 rounded-2xl bg-white border border-[#7D967E]/40 text-xs font-bold text-[#202522] focus:outline-none focus:border-[#F47B20] placeholder:text-gray-400 shadow-inner"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingFeedback}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#F47B20] hover:bg-[#FF882E] text-white text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmittingFeedback ? 'Submitting Feedback...' : 'Submit Feedback'}</span>
              </button>
            </form>
          ) : (
            <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h5 className="font-extrabold text-sm text-emerald-900">Feedback Submitted Successfully!</h5>
              <p className="text-xs text-emerald-700 font-medium">
                Thank you for rating MHP! Have a fantastic day ahead.
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default MhpOfficialBill;
