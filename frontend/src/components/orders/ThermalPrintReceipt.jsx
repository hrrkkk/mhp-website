import React, { useEffect, useState } from 'react';
import { Printer, X, Check, Copy, Settings, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { getPrinterSettings, savePrinterSettings, triggerBrowserPrint, printThermalReceipt } from '../../services/printerService';
import { useToast } from '../../context/ToastContext';

/**
 * ThermalPrintReceipt Component
 * Renders a pixel-perfect 80mm / 58mm POS thermal receipt with custom @media print rules
 * to interface directly with any USB / Ethernet connected thermal bill printer.
 */
const ThermalPrintReceipt = ({ order, onClose, autoPrint = false }) => {
  const { showToast } = useToast();
  const [settings, setSettings] = useState(getPrinterSettings());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (autoPrint || settings.autoPrintOnOrder) {
      const timer = setTimeout(() => {
        handlePrint();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!order) return null;

  const billNo = order.billingNumber || order.orderNumber || (order._id ? `mhp${order._id.slice(-3)}` : 'mhp001');
  const isDelivery = order.orderType === 'Delivery' || order.orderType === 'Parcel' || order.orderMode === 'Parcel';
  const orderTypeDisplay = isDelivery ? 'PARCEL / TAKEAWAY' : 'DINING COUNTER';
  const pickupPoint = order.pickupPoint || order.pickupLocation || (isDelivery ? 'N BLOCK Counter' : 'Dining Area');
  
  const items = order.items || [];
  const subtotal = order.subtotal !== undefined ? order.subtotal : items.reduce((sum, i) => sum + ((i.unitPrice || i.price || 0) * (i.quantity || 1)), 0);
  const parcelCharge = order.parcelCharge !== undefined ? order.parcelCharge : (isDelivery ? items.reduce((sum, i) => sum + ((i.quantity || 1) * 10), 0) : 0);
  const totalAmount = order.totalAmount !== undefined ? order.totalAmount : (order.total !== undefined ? order.total : (subtotal + parcelCharge));
  
  const dateObj = order.placedAt ? new Date(order.placedAt) : (order.createdAt ? new Date(order.createdAt) : new Date());
  const formattedDate = dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const formattedTime = dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  const handlePrint = () => {
    printThermalReceipt(order, settings);
    showToast('info', 'Opening printer dialog for connected printer!');
  };

  const handleToggleWidth = (w) => {
    const updated = savePrinterSettings({ paperWidth: w });
    setSettings(updated);
    showToast('success', `Paper width set to ${w}`);
  };

  const handleCopyText = () => {
    const textReceipt = `
========================================
         ${settings.storeTitle}
     ${settings.storeSubtitle}
       Helpline: ${settings.storePhone}
========================================
OFFICIAL TAX INVOICE - TEST / LIVE BILL
BILL NO     : ${billNo}
DATE        : ${formattedDate} ${formattedTime}
ORDER TYPE  : ${orderTypeDisplay}
PICKUP POINT: ${pickupPoint}
CUSTOMER    : ${order.customerName || 'Campus Student'}
PHONE / ID  : ${order.customerPhone || 'N/A'} (${order.studentId || 'N/A'})
PAYMENT     : ${order.paymentMethod || 'UPI / TEST_MODE'} (${order.paymentStatus || 'PAID'})
----------------------------------------
ITEMS BREAKDOWN:
${items.map(i => `${(i.quantity || 1)}x ${(i.name || '').padEnd(20)} ₹${((i.unitPrice || i.price || 0) * (i.quantity || 1))}`).join('\n')}
----------------------------------------
Subtotal     : ₹${subtotal}
${parcelCharge > 0 ? `Parcel Charge: ₹${parcelCharge}\n` : ''}GRAND TOTAL  : ₹${totalAmount}
========================================
${settings.footerNote}
========================================
`.trim();

    navigator.clipboard.writeText(textReceipt);
    setCopied(true);
    showToast('success', 'Receipt text copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const is58mm = settings.paperWidth === '58mm';

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans">
      
      {/* GLOBAL PRINT CSS RULES TARGETING THERMAL PRINTER */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #thermal-print-area, #thermal-print-area * {
            visibility: visible !important;
          }
          #thermal-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: ${is58mm ? '58mm' : '80mm'} !important;
            margin: 0 !important;
            padding: 4mm !important;
            background: #ffffff !important;
            color: #000000 !important;
            box-shadow: none !important;
            border: none !important;
            font-family: 'Courier New', Courier, monospace !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="bg-[#14231C] border-2 border-[#7D967E]/40 rounded-3xl max-w-lg w-full p-5 sm:p-6 space-y-6 shadow-2xl text-[#FFF7E8] relative max-h-[92vh] flex flex-col justify-between">
        
        {/* HEADER CONTROLS (NO PRINT) */}
        <div className="no-print space-y-4">
          <div className="flex items-center justify-between border-b border-[#7D967E]/30 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#F47B20] text-white flex items-center justify-center font-black shadow-md">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-lg text-white leading-none">
                  Thermal Bill Printer
                </h3>
                <span className="text-[10px] text-[#7D967E] font-bold block mt-0.5">
                  Direct USB / LAN Receipt Spooler
                </span>
              </div>
            </div>

            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* PAPER SIZE SELECTOR TOGGLE */}
          <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-2xl border border-[#7D967E]/30 text-xs">
            <span className="text-[#7D967E] font-extrabold uppercase text-[10px] tracking-wider">
              Connected Printer Paper Width:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleToggleWidth('80mm')}
                className={`px-3 py-1 rounded-xl font-mono font-black text-xs transition-all ${
                  settings.paperWidth === '80mm'
                    ? 'bg-[#F47B20] text-white shadow-md'
                    : 'bg-white/10 text-gray-400 hover:text-white'
                }`}
              >
                80mm (3") Standard
              </button>
              <button
                onClick={() => handleToggleWidth('58mm')}
                className={`px-3 py-1 rounded-xl font-mono font-black text-xs transition-all ${
                  settings.paperWidth === '58mm'
                    ? 'bg-[#F47B20] text-white shadow-md'
                    : 'bg-white/10 text-gray-400 hover:text-white'
                }`}
              >
                58mm (2") Mini
              </button>
            </div>
          </div>
        </div>

        {/* RECEIPT PAPER PREVIEW CONTAINER */}
        <div className="overflow-y-auto flex-1 py-2 flex justify-center bg-zinc-900/60 p-4 rounded-2xl border border-white/10">
          
          {/* THE THERMAL RECEIPT AREA (TARGETED BY @MEDIA PRINT) */}
          <div
            id="thermal-print-area"
            className={`bg-white text-black font-mono shadow-2xl p-4 transition-all duration-300 ${
              is58mm ? 'w-[240px] text-[11px] leading-tight' : 'w-[320px] text-xs leading-normal'
            } rounded-sm border-t-8 border-b-8 border-dashed border-gray-300 select-all`}
          >
            {/* STORE LOGO & HEADER */}
            <div className="text-center space-y-1 pb-2 border-b border-dashed border-black">
              <div className="font-black text-base tracking-wider uppercase">
                *** {settings.storeTitle} ***
              </div>
              <div className="text-[10px] font-bold">
                {settings.storeSubtitle}
              </div>
              <div className="text-[10px]">
                Campus Helpline: {settings.storePhone}
              </div>
              <div className="text-[9px] font-black uppercase pt-1 tracking-widest bg-gray-100 py-0.5 rounded">
                OFFICIAL TAX RECEIPT
              </div>
            </div>

            {/* BILL METADATA */}
            <div className="py-2 border-b border-dashed border-black space-y-1">
              <div className="flex justify-between font-black text-sm">
                <span>BILL NO:</span>
                <span className="font-extrabold">{billNo}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span>DATE:</span>
                <span>{formattedDate} {formattedTime}</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold">
                <span>MODE:</span>
                <span>{orderTypeDisplay}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span>PICKUP:</span>
                <span className="font-bold">{pickupPoint}</span>
              </div>
            </div>

            {/* CUSTOMER INFO */}
            <div className="py-2 border-b border-dashed border-black text-[10px] space-y-0.5">
              <div><strong>CUSTOMER:</strong> {order.customerName || 'Campus Student'}</div>
              <div><strong>PHONE/ID:</strong> {order.customerPhone || 'N/A'} ({order.studentId || 'N/A'})</div>
              <div><strong>PAYMENT:</strong> {order.paymentMethod || 'UPI / TEST'} <span className="font-black">[{order.paymentStatus || 'PAID'}]</span></div>
            </div>

            {/* ITEMIZED TABLE */}
            <div className="py-2 border-b border-dashed border-black space-y-1">
              <div className="flex justify-between font-black text-[10px] uppercase border-b border-black pb-1">
                <span>QTY & ITEM DESCRIPTION</span>
                <span>AMT(₹)</span>
              </div>

              {items.map((item, idx) => {
                const qty = item.quantity || 1;
                const price = item.unitPrice || item.price || 0;
                const lineTotal = qty * price;

                return (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between font-bold">
                      <span className="truncate max-w-[200px]">{qty}x {item.name}</span>
                      <span>₹{lineTotal}</span>
                    </div>
                    <div className="text-[9px] text-gray-700 pl-4">
                      @ ₹{price} / item
                    </div>
                  </div>
                );
              })}
            </div>

            {/* SUMMARY & TOTAL */}
            <div className="py-2 border-b border-dashed border-black space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span>₹{subtotal}</span>
              </div>
              {parcelCharge > 0 && (
                <div className="flex justify-between text-[10px]">
                  <span>Parcel Packaging Charge:</span>
                  <span>₹{parcelCharge}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-sm pt-1 border-t border-black">
                <span>GRAND TOTAL:</span>
                <span className="text-base">₹{totalAmount}</span>
              </div>
            </div>

            {/* BARCODE / VERIFICATION STAMP */}
            <div className="py-3 text-center space-y-1.5">
              <div className="font-mono font-black text-xs tracking-widest border-2 border-black p-1 inline-block">
                |||| ||| |||||| ||| |||||||
              </div>
              <div className="text-[9px] font-bold">
                TOKEN VERIFICATION: #{billNo.slice(-6).toUpperCase()}
              </div>
              <p className="text-[8px] text-gray-600 leading-tight pt-1 border-t border-dotted border-black">
                {settings.footerNote}
              </p>
            </div>

          </div>
        </div>

        {/* ACTION BUTTONS (NO PRINT) */}
        <div className="no-print pt-2 space-y-2">
          
          <button
            onClick={handlePrint}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#F47B20] hover:bg-[#FF882E] text-white text-xs font-black uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer scale-[1.01]"
          >
            <Printer className="w-5 h-5" />
            <span>Send Job to Connected Printer (Print Now)</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopyText}
              className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-gray-200 transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/20"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gray-300" />}
              <span>{copied ? 'Copied!' : 'Copy Bill Text'}</span>
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-bold text-gray-300 transition-all cursor-pointer border border-gray-600"
              >
                Close Window
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default ThermalPrintReceipt;
