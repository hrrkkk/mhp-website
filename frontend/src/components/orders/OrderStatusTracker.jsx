import React from 'react';
import { Check, ArrowRight, Circle, Clock, Package, CheckCircle2 } from 'lucide-react';

/**
 * OrderStatusTracker Component
 * 
 * Progress stages:
 * 1. Order Placed
 * 2. Preparing
 * 3. Ready for Pickup
 * 4. Completed
 */
const OrderStatusTracker = ({ order, compact = false }) => {
  if (!order) return null;

  const orderNumber = order.orderNumber || order.billingNumber || (order._id ? `#MHP${order._id.slice(-4).toUpperCase()}` : '#MHP0001');

  // Determine current active step index (0, 1, 2, or 3)
  const getStepIndex = (statusStr) => {
    const s = (statusStr || '').toUpperCase().trim();
    if (s.includes('COMPLETED') || s.includes('RECEIVED') || s.includes('DELIVERED') || s.includes('COLLECTED')) {
      return 3;
    }
    if (s.includes('READY')) {
      return 2;
    }
    if (s.includes('PREPARING') || s.includes('KITCHEN')) {
      return 1;
    }
    // Default to Order Placed / Confirmed
    return 0;
  };

  const activeStep = getStepIndex(order.orderStatus || order.status);

  const steps = [
    {
      id: 0,
      label: 'Order Placed',
      sublabel: 'Payment verified & sent to kitchen'
    },
    {
      id: 1,
      label: 'Preparing',
      sublabel: 'Chef is preparing fresh parcel'
    },
    {
      id: 2,
      label: 'Ready for Pickup',
      sublabel: `Waiting at ${order.pickupPoint || order.pickupLocation || 'N Block'} counter`
    },
    {
      id: 3,
      label: 'Completed',
      sublabel: 'Parcel collected by student'
    }
  ];

  if (compact) {
    return (
      <div className="bg-[#10271C] text-[#FFF7E8] p-3.5 rounded-2xl border border-[#7D967E]/30 space-y-2 font-sans">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-[#F47B20] font-mono tracking-wider font-extrabold">{orderNumber}</span>
          <span className="text-[#7D967E] text-[10px] uppercase font-bold">LIVE TRACKER</span>
        </div>

        <div className="space-y-1.5 pt-1">
          {steps.map((step) => {
            const isPassed = activeStep > step.id;
            const isCurrent = activeStep === step.id;

            return (
              <div key={step.id} className="flex items-center gap-2 text-xs">
                {isPassed && (
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 border border-emerald-500/40">
                    ✓
                  </span>
                )}
                {isCurrent && (
                  <span className="w-5 h-5 rounded-full bg-[#F47B20] text-white flex items-center justify-center font-bold text-[11px] shrink-0 animate-pulse shadow-md">
                    →
                  </span>
                )}
                {!isPassed && !isCurrent && (
                  <span className="w-5 h-5 rounded-full bg-white/10 text-white/40 flex items-center justify-center font-bold text-[11px] shrink-0">
                    ○
                  </span>
                )}

                <span className={`font-bold ${
                  isPassed 
                    ? 'text-emerald-300' 
                    : isCurrent 
                      ? 'text-[#F47B20] font-black' 
                      : 'text-white/40 font-normal'
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#183A2A] text-[#FFF7E8] p-6 sm:p-7 rounded-3xl border-2 border-[#7D967E]/40 shadow-xl space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#7D967E]/30 pb-4">
        <div>
          <span className="text-[10px] font-black text-[#F47B20] uppercase tracking-widest block">
            LIVE ORDER TRACKING
          </span>
          <h3 className="font-display font-extrabold text-2xl text-white tracking-tight">
            Order {orderNumber}
          </h3>
        </div>

        {order.pickupLocation && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10271C] border border-[#7D967E]/40 text-xs text-[#FFF7E8]">
            <span className="text-xs">📍</span>
            <span>Pickup: <strong className="text-[#F47B20]">{order.pickupLocation || order.pickupPoint}</strong></span>
          </div>
        )}
      </div>

      {/* Progress Bar / Step List */}
      <div className="space-y-4">
        {steps.map((step) => {
          const isPassed = activeStep > step.id;
          const isCurrent = activeStep === step.id;
          const isPending = activeStep < step.id;

          return (
            <div 
              key={step.id} 
              className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                isPassed
                  ? 'bg-[#10271C]/90 border-emerald-500/40 text-emerald-200'
                  : isCurrent
                    ? 'bg-[#204935] border-[#F47B20] text-white shadow-lg ring-2 ring-[#F47B20]/30'
                    : 'bg-[#10271C]/40 border-[#7D967E]/20 text-white/50 opacity-60'
              }`}
            >
              {/* Icon Marker */}
              <div className="pt-0.5 shrink-0">
                {isPassed && (
                  <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-sm shadow-md">
                    ✓
                  </div>
                )}
                {isCurrent && (
                  <div className="w-7 h-7 rounded-full bg-[#F47B20] text-white flex items-center justify-center font-black text-sm animate-pulse shadow-lg">
                    →
                  </div>
                )}
                {isPending && (
                  <div className="w-7 h-7 rounded-full border-2 border-white/20 text-white/40 flex items-center justify-center font-bold text-sm">
                    ○
                  </div>
                )}
              </div>

              {/* Text Info */}
              <div className="space-y-0.5 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className={`text-base font-extrabold ${
                    isPassed ? 'text-emerald-300' : isCurrent ? 'text-white' : 'text-white/50'
                  }`}>
                    {step.label}
                  </h4>
                  {isCurrent && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F47B20] text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
                      CURRENT STATUS
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#7D967E] font-medium leading-relaxed">
                  {step.sublabel}
                </p>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default OrderStatusTracker;
