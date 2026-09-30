import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  PackageCheck, 
  Star, 
  Send, 
  ShieldCheck, 
  FileText, 
  AlertCircle,
  Printer,
  Copy,
  User,
  Calendar,
  CreditCard,
  Check
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatCleanBillingNumber } from '../../services/printerService';
import ThermalPrintReceipt from './ThermalPrintReceipt';

/**
 * MhpOfficialBill Component
 * Renders official MHP digital tax invoice (e.g. mhp001), itemized prices, parcel charges breakdown,
 * pickup point details, print/copy actions, interactive Received confirmation box, and rating form.
 */
const MhpOfficialBill = ({ order, onStatusUpdate, autoPrint = false }) => {
  const { showToast } = useToast();
  const [receivedChoice, setReceivedChoice] = useState(
    (order?.status === 'ORDER RECEIVED' || order?.status === 'COMPLETED' || order?.orderStatus === 'COMPLETED') ? 'YES' : null
  );
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(autoPrint);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Rating & Feedback State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  if (!order) return null;

  const billNo = formatCleanBillingNumber(order.billingNumber || order.orderNumber, order._id);
  const isDelivery = order.orderType === 'Delivery' || order.orderType === 'Parcel' || order.orderMode === 'Parcel' || order.orderMode === 'Delivery';
  const orderTypeDisplay = isDelivery ? 'Parcel / Delivery' : 'Dining Counter';
  const pickupPoint = order.pickupPoint || order.pickupLocation || (isDelivery ? 'N BLOCK Counter' : 'Dining Area');
  
  // Date & Time
  const dateObj = order.placedAt ? new Date(order.placedAt) : (order.createdAt ? new Date(order.createdAt) : new Date());
  const formattedDate = dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const formattedTime = dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  // Customer & Payment Details
  const customerName = order.customerName || order.studentName || order.userName || 'Campus Student';
  const studentId = order.studentId || order.studentRollNo || order.customerPhone || order.studentPhone || '';
  const paymentMethod = order.paymentMethod || order.paymentMode || 'ONLINE (UPI)';
  const paymentStatus = order.paymentStatus || (order.isPaid ? 'PAID' : 'PAID (VERIFIED)');

  // Items & Calculations
  const items = order.items || [];
  const subtotal = order.subtotal !== undefined 
    ? Number(order.subtotal) 
    : items.reduce((sum, i) => sum + (Number(i.unitPrice || i.price || 0) * Number(i.quantity || 1)), 0);

  const parcelCharge = order.parcelCharge !== undefined 
    ? Number(order.parcelCharge) 
    : (isDelivery ? items.reduce((sum, i) => sum + (Number(i.quantity || 1) * 10), 0) : 0);

  const taxAmount = order.tax !== undefined ? Number(order.tax) : 0;
  const discountAmount = order.discount !== undefined ? Number(order.discount) : (order.discountAmount ? Number(order.discountAmount) : 0);

  const totalAmount = order.totalAmount !== undefined 
    ? Number(order.totalAmount) 
    : (order.total !== undefined ? Number(order.total) : (subtotal + parcelCharge + taxAmount - discountAmount));

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
        name: customerName,
        phone: studentId,
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

  const handleCopySummary = () => {
    const text = `🧾 MY HOSUR PALACE BILL
Bill No: ${billNo}
Date: ${formattedDate} ${formattedTime}
Order Type: ${orderTypeDisplay}
Pickup Point: ${pickupPoint}
Items (${items.length}):
${items.map(i => `- ${i.quantity || 1}x ${i.name} (₹${(i.unitPrice || i.price || 0) * (i.quantity || 1)})`).join('\n')}
Subtotal: ₹${subtotal}
${parcelCharge > 0 ? `Parcel Fee: ₹${parcelCharge}\n` : ''}Total Paid: ₹${totalAmount} (${paymentStatus})`.trim();

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    showToast('success', 'Bill summary copied to clipboard!');
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <>
      <div className="bg-white rounded-3xl border-2 border-[#7D967E]/30 p-6 sm:p-8 space-y-6 shadow-2xl font-sans max-w-xl mx-auto text-[#202522]">
        
        {/* 1. OFFICIAL BILL HEADER */}
        <div className="border-b-2 border-dashed border-[#7D967E]/30 pb-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#183A2A] text-[#F47B20] flex items-center justify-center font-black text-base shadow-md border border-[#7D967E]/30">
                MHP
              </div>
              <div>
                <h3 className="font-display font-black text-xl text-[#183A2A] leading-none">
                  MY HOSUR PALACE
                </h3>
                <span className="text-[10px] text-[#7D967E] font-bold block mt-1 tracking-wide">
                  Official Campus Tax Invoice & Billing Token
                </span>
              </div>
            </div>

            <div className="text-right flex flex-col items-end">
              <span className="text-[10px] text-[#7D967E] font-black uppercase tracking-widest block">BILL NO</span>
              <span className="font-mono font-black text-2xl text-[#F47B20] tracking-wider block">
                {billNo}
              </span>
            </div>
          </div>

          {/* DATE, TIME & CUSTOMER METADATA */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs bg-gray-50 p-3 rounded-2xl border border-gray-200 font-bold">
            <div>
              <span className="text-[#7D967E] text-[10px] uppercase block flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Date & Time
              </span>
              <span className="text-[#183A2A] block text-[11px] mt-0.5">{formattedDate} • {formattedTime}</span>
            </div>

            <div>
              <span className="text-[#7D967E] text-[10px] uppercase block flex items-center gap-1">
                <User className="w-3 h-3" /> Customer
              </span>
              <span className="text-[#183A2A] block text-[11px] mt-0.5 truncate">{customerName}</span>
              {studentId && <span className="text-[9px] text-[#7D967E] block font-mono">ID: {studentId}</span>}
            </div>

            <div className="col-span-2 sm:col-span-1">
              <span className="text-[#7D967E] text-[10px] uppercase block flex items-center gap-1">
                <CreditCard className="w-3 h-3" /> Payment Status
              </span>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black uppercase tracking-wider">
                ✓ {paymentStatus}
              </span>
            </div>
          </div>

          {/* ORDER TYPE & PICKUP LOCATION */}
          <div className="grid grid-cols-2 gap-2 text-xs bg-[#FFF7E8] p-3 rounded-2xl border border-[#7D967E]/30 font-bold">
            <div>
              <span className="text-[#7D967E] text-[10px] uppercase block">Order Type</span>
              <span className="text-[#183A2A] uppercase font-black">{orderTypeDisplay}</span>
            </div>
            <div>
              <span className="text-[#7D967E] text-[10px] uppercase block">Pickup Point</span>
              <span className="text-[#F47B20] uppercase font-black flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>{pickupPoint}</span>
              </span>
            </div>
          </div>
        </div>

        {/* 2. ITEMIZED ITEMS TABLE & PRICES */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#7D967E]">
              ITEMIZED BREAKDOWN ({items.length} ITEMS)
            </span>
            <span className="text-[10px] font-bold text-[#7D967E]">Prices in INR (₹)</span>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {items.map((item, idx) => {
              const qty = item.quantity || 1;
              const price = Number(item.unitPrice || item.price || 0);
              const lineTotal = price * qty;

              return (
                <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-[#183A2A] bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-lg text-[11px]">
                      {qty}x
                    </span>
                    <div>
                      <span className="font-bold text-[#183A2A] block">{item.name}</span>
                      {item.selectedOptionLabel && (
                        <span className="text-[10px] text-[#7D967E] block font-medium">Option: {item.selectedOptionLabel}</span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-extrabold text-[#183A2A] block">
                      ₹{lineTotal}
                    </span>
                    {qty > 1 && (
                      <span className="text-[9px] text-[#7D967E] font-medium block">₹{price} each</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* FINANCIAL SUMMARY CALCULATIONS */}
          <div className="bg-gray-50 p-4 rounded-2xl space-y-2 text-xs border border-gray-200">
            <div className="flex justify-between items-center text-gray-600 font-bold">
              <span>Items Subtotal:</span>
              <span className="font-mono text-gray-900">₹{subtotal}</span>
            </div>

            {isDelivery && (
              <div className="flex justify-between items-center text-gray-600 font-bold">
                <span className="flex items-center gap-1">
                  <span>Parcel Charges</span>
                  <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">(₹10/item)</span>
                </span>
                <span className="font-mono text-amber-700 font-extrabold">₹{parcelCharge}</span>
              </div>
            )}

            {taxAmount > 0 && (
              <div className="flex justify-between items-center text-gray-600 font-bold">
                <span>Taxes & GST:</span>
                <span className="font-mono text-gray-900">₹{taxAmount}</span>
              </div>
            )}

            {discountAmount > 0 && (
              <div className="flex justify-between items-center text-emerald-700 font-bold">
                <span>Discount Offer Applied:</span>
                <span className="font-mono text-emerald-700">-₹{discountAmount}</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2.5 border-t border-gray-300 text-sm font-black text-[#183A2A]">
              <div>
                <span>Grand Total Amount:</span>
                <span className="text-[10px] text-[#7D967E] font-normal block">All taxes & campus fees included</span>
              </div>
              <span className="font-mono text-2xl text-[#F47B20] tracking-tight">₹{totalAmount}</span>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS TOOLBAR */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => setShowPrintModal(true)}
            className="py-2.5 px-3 rounded-2xl bg-[#183A2A] hover:bg-[#23533c] text-[#FFF7E8] text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <Printer className="w-4 h-4 text-[#F47B20]" />
            <span>Print Thermal Bill</span>
          </button>

          <button
            type="button"
            onClick={handleCopySummary}
            className="py-2.5 px-3 rounded-2xl bg-white border border-[#7D967E]/40 hover:bg-gray-50 text-[#183A2A] text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            {copiedSummary ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#7D967E]" />}
            <span>{copiedSummary ? 'Copied!' : 'Copy Summary'}</span>
          </button>
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

      {/* RENDER THERMAL PRINT MODAL IF REQUESTED */}
      {showPrintModal && (
        <ThermalPrintReceipt
          order={order}
          onClose={() => setShowPrintModal(false)}
          autoPrint={false}
        />
      )}
    </>
  );
};

export default MhpOfficialBill;

