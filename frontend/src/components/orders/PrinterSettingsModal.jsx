import React, { useState } from 'react';
import { Settings, Printer, X, Check, Save, Sparkles, AlertCircle } from 'lucide-react';
import { getPrinterSettings, savePrinterSettings, createMockTestOrder } from '../../services/printerService';
import { useToast } from '../../context/ToastContext';
import ThermalPrintReceipt from './ThermalPrintReceipt';

const PrinterSettingsModal = ({ onClose }) => {
  const { showToast } = useToast();
  const [form, setForm] = useState(getPrinterSettings());
  const [activeTestOrder, setActiveTestOrder] = useState(null);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    savePrinterSettings(form);
    showToast('success', 'Printer settings saved successfully!');
    if (onClose) onClose();
  };

  const handleTriggerTestPrint = () => {
    savePrinterSettings(form);
    const mockOrder = createMockTestOrder();
    setActiveTestOrder(mockOrder);
    showToast('info', 'Generated mock test bill! Ready to print.');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-[#FFFFFF] border-2 border-[#7D967E]/40 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl relative text-[#202522]">
          
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-[#FFF7E8] text-[#7D967E] hover:text-[#183A2A] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-black text-[#F47B20] uppercase tracking-widest">
              <Settings className="w-4 h-4" />
              THERMAL PRINTER CONFIGURATION
            </div>
            <h3 className="font-display font-extrabold text-2xl text-[#183A2A]">
              Printer & Receipt Settings
            </h3>
            <p className="text-xs text-[#7D967E] font-medium">
              Configure paper dimensions and auto-printing for your USB / LAN connected thermal printer.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs font-bold">
            
            {/* PAPER SIZE */}
            <div className="space-y-1.5">
              <label className="text-[#183A2A] uppercase text-[10px] tracking-wider block">
                Thermal Paper Width
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleChange('paperWidth', '80mm')}
                  className={`p-3 rounded-2xl border-2 text-left font-black transition-all cursor-pointer ${
                    form.paperWidth === '80mm'
                      ? 'bg-[#FFF7E8] border-[#F47B20] text-[#183A2A] shadow-xs'
                      : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <div className="text-sm">80mm (3 Inch)</div>
                  <div className="text-[10px] text-[#7D967E] font-normal">Standard POS Billing Receipt</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleChange('paperWidth', '58mm')}
                  className={`p-3 rounded-2xl border-2 text-left font-black transition-all cursor-pointer ${
                    form.paperWidth === '58mm'
                      ? 'bg-[#FFF7E8] border-[#F47B20] text-[#183A2A] shadow-xs'
                      : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <div className="text-sm">58mm (2 Inch)</div>
                  <div className="text-[10px] text-[#7D967E] font-normal">Compact Mini Thermal Printer</div>
                </button>
              </div>
            </div>

            {/* AUTO PRINT TOGGLE */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FFF7E8] border border-[#7D967E]/30">
              <div>
                <span className="text-[#183A2A] font-extrabold block">Auto-Open Print Dialog</span>
                <span className="text-[10px] text-[#7D967E] block font-medium">Trigger thermal printer when order is placed</span>
              </div>
              <input
                type="checkbox"
                checked={form.autoPrintOnOrder}
                onChange={(e) => handleChange('autoPrintOnOrder', e.target.checked)}
                className="w-5 h-5 accent-[#F47B20] rounded cursor-pointer"
              />
            </div>

            {/* STORE TITLE */}
            <div className="space-y-1">
              <label className="text-[#7D967E] uppercase text-[10px] tracking-wider block">
                Header Store Title
              </label>
              <input
                type="text"
                value={form.storeTitle}
                onChange={(e) => handleChange('storeTitle', e.target.value)}
                className="w-full p-3 rounded-xl bg-white border border-[#7D967E]/30 text-xs font-bold text-[#183A2A] focus:outline-none focus:border-[#F47B20]"
                required
              />
            </div>

            {/* SUBTITLE */}
            <div className="space-y-1">
              <label className="text-[#7D967E] uppercase text-[10px] tracking-wider block">
                Campus Location Subtitle
              </label>
              <input
                type="text"
                value={form.storeSubtitle}
                onChange={(e) => handleChange('storeSubtitle', e.target.value)}
                className="w-full p-3 rounded-xl bg-white border border-[#7D967E]/30 text-xs font-bold text-[#183A2A] focus:outline-none focus:border-[#F47B20]"
              />
            </div>

            {/* FOOTER NOTE */}
            <div className="space-y-1">
              <label className="text-[#7D967E] uppercase text-[10px] tracking-wider block">
                Receipt Footer Note
              </label>
              <input
                type="text"
                value={form.footerNote}
                onChange={(e) => handleChange('footerNote', e.target.value)}
                className="w-full p-3 rounded-xl bg-white border border-[#7D967E]/30 text-xs font-bold text-[#183A2A] focus:outline-none focus:border-[#F47B20]"
              />
            </div>

            {/* TEST PRINT TRIGGER BUTTON */}
            <div className="pt-2 border-t border-gray-200 space-y-2">
              
              <button
                type="button"
                onClick={handleTriggerTestPrint}
                className="w-full py-3 px-4 rounded-2xl bg-[#183A2A] hover:bg-[#204a36] text-[#FFF7E8] text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Printer className="w-4 h-4 text-[#F47B20]" />
                <span>🖨️ Generate Test Order & Print Sample Bill</span>
              </button>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-2xl bg-[#F47B20] hover:bg-[#FF882E] text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md"
              >
                Save Printer Settings
              </button>

            </div>

          </form>
        </div>
      </div>

      {/* RENDER TEST THERMAL PRINT RECEIPT MODAL */}
      {activeTestOrder && (
        <ThermalPrintReceipt
          order={activeTestOrder}
          onClose={() => setActiveTestOrder(null)}
          autoPrint={true}
        />
      )}
    </>
  );
};

export default PrinterSettingsModal;
