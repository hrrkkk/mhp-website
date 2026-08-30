import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Clock, Edit2, RotateCw, X, CheckCircle2, RotateCcw, Save, Calendar } from 'lucide-react';

const AdminSlotTimingControl = () => {
  const { showToast } = useToast();
  const [slotStatus, setSlotStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  // Today's Form State
  const [todayForm, setTodayForm] = useState({
    orderingStartTime: '09:30',
    orderingEndTime: '10:30',
    pickupStartTime: '12:00',
    pickupEndTime: '01:00' // display string
  });

  const [editModal, setEditModal] = useState(null); // 'ordering' | 'pickup' | null

  useEffect(() => {
    fetchSlotStatus();
  }, []);

  const fetchSlotStatus = async () => {
    try {
      setLoading(true);
      const res = await api.get('/ordering-slot');
      setSlotStatus(res.data);
      if (res.data) {
        setTodayForm({
          orderingStartTime: res.data.orderingStartTime || '09:30',
          orderingEndTime: res.data.orderingEndTime || '10:30',
          pickupStartTime: res.data.pickupStartTime || '12:00',
          pickupEndTime: res.data.pickupEndTime || '13:00'
        });
      }
    } catch (err) {
      console.error('Failed to load slot status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTodaySlot = async (e) => {
    if (e) e.preventDefault();

    const [ordStartH, ordStartM] = (todayForm.orderingStartTime || '').split(':').map(Number);
    const [ordEndH, ordEndM] = (todayForm.orderingEndTime || '').split(':').map(Number);
    
    if (isNaN(ordStartH) || isNaN(ordStartM) || isNaN(ordEndH) || isNaN(ordEndM)) {
      showToast('error', 'Ordering Slot: Please enter valid start and end times');
      return;
    }
    if (ordStartH * 60 + ordStartM >= ordEndH * 60 + ordEndM) {
      showToast('error', `Ordering Slot: End time (${todayForm.orderingEndTime}) must be after Start time (${todayForm.orderingStartTime})`);
      return;
    }

    const [picStartH, picStartM] = (todayForm.pickupStartTime || '').split(':').map(Number);
    const [picEndH, picEndM] = (todayForm.pickupEndTime || '').split(':').map(Number);

    if (isNaN(picStartH) || isNaN(picStartM) || isNaN(picEndH) || isNaN(picEndM)) {
      showToast('error', 'Pickup Slot: Please enter valid start and end times');
      return;
    }
    if (picStartH * 60 + picStartM >= picEndH * 60 + picEndM) {
      showToast('error', `Pickup Slot: End time (${todayForm.pickupEndTime}) must be after Start time (${todayForm.pickupStartTime})`);
      return;
    }

    try {
      setSaving(true);
      const payload = {
        target: 'today',
        orderingStartTime: todayForm.orderingStartTime,
        orderingEndTime: todayForm.orderingEndTime,
        pickupStartTime: todayForm.pickupStartTime,
        pickupEndTime: todayForm.pickupEndTime
      };

      const res = await api.put('/ordering-slot', payload);
      setSlotStatus(res.data);
      setEditModal(null);
      showToast('success', "Saved today's custom ordering & pickup slots successfully!");
    } catch (err) {
      console.error('Failed to save today slot timing:', err);
      const errorMsg = err.response?.data?.error || err.response?.data?.message || "Failed to save today's slot timings";
      showToast('error', errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefaults = async () => {
    try {
      setResetting(true);
      const res = await api.post('/ordering-slot/reset');
      setSlotStatus(res.data);
      if (res.data) {
        setTodayForm({
          orderingStartTime: res.data.orderingStartTime || '09:30',
          orderingEndTime: res.data.orderingEndTime || '10:30',
          pickupStartTime: res.data.pickupStartTime || '12:00',
          pickupEndTime: res.data.pickupEndTime || '13:00'
        });
      }
      showToast('success', "Reset today's slots to default timings!");
    } catch (err) {
      console.error('Failed to reset slot timings:', err);
      showToast('error', 'Failed to reset today slot timings');
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-3xl border border-[#7D967E]/30 text-xs text-[#7D967E]">
        Loading Today's Slot Configuration...
      </div>
    );
  }

  const isCustom = Boolean(slotStatus?.isCustom || slotStatus?.hasTodayOverride);

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#7D967E]/30 space-y-6 shadow-xl font-sans">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#7D967E]/20 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#183A2A]/5 border border-[#183A2A]/10 text-[#183A2A] text-[10px] font-extrabold tracking-widest uppercase mb-1">
            <Clock className="w-3 h-3 text-[#F47B20]" />
            <span>DAILY SLOT CONTROL</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl text-[#183A2A]">
            TODAY'S SLOTS
          </h2>
          <p className="text-xs text-[#7D967E] font-medium mt-0.5">
            Manage today's active ordering and pickup windows (Date: <strong className="text-[#183A2A]">{slotStatus?.todayDate}</strong> IST)
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Badge: DEFAULT vs CUSTOM */}
          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border flex items-center gap-1.5 ${
            isCustom
              ? 'bg-[#F47B20]/10 text-[#F47B20] border-[#F47B20]/30'
              : 'bg-[#183A2A]/10 text-[#183A2A] border-[#183A2A]/30'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isCustom ? 'bg-[#F47B20]' : 'bg-[#183A2A]'}`} />
            <span>{isCustom ? 'CUSTOM TODAY' : 'DEFAULT'}</span>
          </span>

          <button 
            onClick={fetchSlotStatus}
            className="p-2 rounded-xl bg-[#FFF7E8] hover:bg-[#183A2A] hover:text-white text-[#183A2A] transition-all cursor-pointer border border-[#7D967E]/30 shadow-xs"
            title="Refresh slot status"
          >
            <RotateCw className="w-4 h-4 text-[#F47B20]" />
          </button>
        </div>
      </div>

      {/* Main Slots Management Card */}
      <form onSubmit={handleSaveTodaySlot} className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 1. ORDERING SLOT CARD */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#FFF7E8]/60 border border-[#7D967E]/30 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#7D967E]/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#183A2A] text-[#FFF7E8] flex items-center justify-center font-extrabold text-xs shadow-xs">
                  ORD
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-sm text-[#183A2A] uppercase tracking-wider">
                    ORDERING SLOT
                  </h3>
                  <span className="text-[10px] text-[#7D967E] font-medium block">
                    Online customer ordering window
                  </span>
                </div>
              </div>

              <span className="text-xs font-mono font-black text-[#F47B20] bg-white px-2.5 py-1 rounded-lg border border-[#7D967E]/30">
                {slotStatus?.orderingWindow || '9:30 AM – 10:30 AM'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-extrabold text-[#183A2A] uppercase tracking-wider block text-[10px]">
                  Start Time *
                </label>
                <input
                  type="time"
                  required
                  value={todayForm.orderingStartTime}
                  onChange={(e) => setTodayForm({ ...todayForm, orderingStartTime: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#7D967E]/40 text-[#202522] font-bold focus:outline-none focus:border-[#F47B20]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-[#183A2A] uppercase tracking-wider block text-[10px]">
                  End Time *
                </label>
                <input
                  type="time"
                  required
                  value={todayForm.orderingEndTime}
                  onChange={(e) => setTodayForm({ ...todayForm, orderingEndTime: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#7D967E]/40 text-[#202522] font-bold focus:outline-none focus:border-[#F47B20]"
                />
              </div>
            </div>

            <p className="text-[11px] text-[#7D967E] font-medium pt-1">
              Formatted: <strong className="text-[#183A2A]">{slotStatus?.orderingStartFormatted || '9:30 AM'} – {slotStatus?.orderingEndFormatted || '10:30 AM'}</strong>
            </p>
          </div>

          {/* 2. PICKUP SLOT CARD */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#FFF7E8]/60 border border-[#7D967E]/30 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#7D967E]/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#F47B20] text-white flex items-center justify-center font-extrabold text-xs shadow-xs">
                  PIC
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-sm text-[#183A2A] uppercase tracking-wider">
                    PICKUP SLOT
                  </h3>
                  <span className="text-[10px] text-[#7D967E] font-medium block">
                    Food collection at counter
                  </span>
                </div>
              </div>

              <span className="text-xs font-mono font-black text-[#183A2A] bg-white px-2.5 py-1 rounded-lg border border-[#7D967E]/30">
                {slotStatus?.pickupWindow || '12:00 PM – 1:00 PM'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-extrabold text-[#183A2A] uppercase tracking-wider block text-[10px]">
                  Start Time *
                </label>
                <input
                  type="time"
                  required
                  value={todayForm.pickupStartTime}
                  onChange={(e) => setTodayForm({ ...todayForm, pickupStartTime: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#7D967E]/40 text-[#202522] font-bold focus:outline-none focus:border-[#F47B20]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-[#183A2A] uppercase tracking-wider block text-[10px]">
                  End Time *
                </label>
                <input
                  type="time"
                  required
                  value={todayForm.pickupEndTime}
                  onChange={(e) => setTodayForm({ ...todayForm, pickupEndTime: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#7D967E]/40 text-[#202522] font-bold focus:outline-none focus:border-[#F47B20]"
                />
              </div>
            </div>

            <p className="text-[11px] text-[#7D967E] font-medium pt-1">
              Formatted: <strong className="text-[#183A2A]">{slotStatus?.pickupStartFormatted || '12:00 PM'} – {slotStatus?.pickupEndFormatted || '1:00 PM'}</strong>
            </p>
          </div>

        </div>

        {/* Action Controls & Defaults Reference */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#7D967E]/20">
          
          <div className="text-xs text-[#7D967E] font-medium">
            <span>Default Reference: </span>
            <strong className="text-[#183A2A]">Ordering: 9:30 AM–10:30 AM</strong> • <strong className="text-[#183A2A]">Pickup: 12:00 PM–1:00 PM</strong>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {isCustom && (
              <button
                type="button"
                onClick={handleResetToDefaults}
                disabled={resetting}
                className="flex-1 sm:flex-none py-3 px-5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{resetting ? 'Resetting...' : 'Reset to Defaults'}</span>
              </button>
            )}

            <button
              type="submit"
              disabled={saving}
              className="flex-1 sm:flex-none py-3 px-6 rounded-xl bg-[#F47B20] hover:bg-[#FF882E] text-white text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving Timings...' : "Save Today's Timings"}</span>
            </button>
          </div>

        </div>

      </form>

    </div>
  );
};

export default AdminSlotTimingControl;
