import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Clock, Edit2, RotateCw, X, CheckCircle2, AlertCircle } from 'lucide-react';

const AdminSlotTimingControl = () => {
  const { showToast } = useToast();
  const [slotStatus, setSlotStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Edit Modal State: null | 'today_ordering' | 'today_pickup' | 'default_ordering' | 'default_pickup'
  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm] = useState({
    orderingStartTime: '09:30',
    orderingEndTime: '10:30',
    pickupStartTime: '12:00',
    pickupEndTime: '13:00'
  });

  useEffect(() => {
    fetchSlotStatus();
  }, []);

  const fetchSlotStatus = async () => {
    try {
      setLoading(true);
      const res = await api.get('/ordering-slot');
      setSlotStatus(res.data);
    } catch (err) {
      console.error('Failed to load slot status:', err);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (mode) => {
    setEditModal(mode);
    if (!slotStatus) return;

    if (mode === 'today_ordering' || mode === 'today_pickup') {
      setEditForm({
        orderingStartTime: slotStatus.orderingStartTime || '09:30',
        orderingEndTime: slotStatus.orderingEndTime || '10:30',
        pickupStartTime: slotStatus.pickupStartTime || '12:00',
        pickupEndTime: slotStatus.pickupEndTime || '13:00'
      });
    } else if (mode === 'default_ordering' || mode === 'default_pickup') {
      const defs = slotStatus.defaults || {};
      setEditForm({
        orderingStartTime: defs.orderingStartTime || '09:30',
        orderingEndTime: defs.orderingEndTime || '10:30',
        pickupStartTime: defs.pickupStartTime || '12:00',
        pickupEndTime: defs.pickupEndTime || '13:00'
      });
    }
  };

  const handleSaveSlot = async (e) => {
    e.preventDefault();
    const isDefault = editModal?.startsWith('default_');
    const isOrdering = editModal?.endsWith('_ordering');
    const isPickup = editModal?.endsWith('_pickup');

    const startVal = isOrdering ? editForm.orderingStartTime : editForm.pickupStartTime;
    const endVal = isOrdering ? editForm.orderingEndTime : editForm.pickupEndTime;

    // Validation
    const [startH, startM] = (startVal || '').split(':').map(Number);
    const [endH, endM] = (endVal || '').split(':').map(Number);
    
    if (isNaN(startH) || isNaN(startM) || isNaN(endH) || isNaN(endM)) {
      showToast('error', 'Please enter a valid time range');
      return;
    }
    if (startH * 60 + startM >= endH * 60 + endM) {
      showToast('error', 'End time must be after Start time');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        target: isDefault ? 'default' : 'today',
        ...(isOrdering && {
          orderingStartTime: editForm.orderingStartTime,
          orderingEndTime: editForm.orderingEndTime
        }),
        ...(isPickup && {
          pickupStartTime: editForm.pickupStartTime,
          pickupEndTime: editForm.pickupEndTime
        })
      };

      const res = await api.put('/ordering-slot', payload);
      setSlotStatus(res.data);
      setEditModal(null);
      showToast('success', `Updated ${isDefault ? 'Default' : "Today's Active"} ${isOrdering ? 'Ordering' : 'Pickup'} Slot successfully!`);
    } catch (err) {
      console.error('Failed to save slot timing:', err);
      const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Failed to save slot timings';
      showToast('error', errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#DDD7CD] text-xs text-[#77736D]">
        Loading Ordering & Pickup Slots...
      </div>
    );
  }

  return (
    <div className="bg-[#FFFFFF] p-6 rounded-2xl border-2 border-[#B9684D]/30 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#DDD7CD] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#B9684D] uppercase tracking-wider mb-1">
            <Clock className="w-4 h-4" />
            OPERATIONAL SCHEDULE
          </div>
          <h2 className="text-xl font-bold text-[#202020]">ORDERING & PICKUP SLOTS</h2>
          <p className="text-xs text-[#77736D] mt-0.5">
            Manage daily active ordering windows and default campus cafeteria schedules
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
            slotStatus?.isOpen 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
              : 'bg-rose-50 text-rose-800 border-rose-300'
          }`}>
            <span className={`w-2 h-2 rounded-full ${slotStatus?.isOpen ? 'bg-emerald-600' : 'bg-rose-600'}`} />
            <span>{slotStatus?.isOpen ? '🟢 ORDERING OPEN' : '🔴 ORDERING CLOSED'}</span>
          </span>
          <button 
            onClick={fetchSlotStatus}
            className="p-2 rounded-lg bg-[#F5F1E8] hover:bg-[#DDD7CD] text-[#202020] transition-colors cursor-pointer border border-[#DDD7CD]"
            title="Refresh slot status"
          >
            <RotateCw className="w-4 h-4 text-[#B9684D]" />
          </button>
        </div>
      </div>

      {/* Slots Control Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 1. ORDERING SLOT SECTION */}
        <div className="bg-[#F5F1E8] p-5 rounded-2xl border border-[#DDD7CD] space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#DDD7CD] pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#B9684D] text-white flex items-center justify-center font-bold text-xs">
                ORD
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#202020] uppercase tracking-wider">ORDERING SLOT</h3>
                <span className="text-[10px] text-[#77736D] font-medium">Controls student online ordering window</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {/* Default Ordering Slot */}
            <div className="bg-[#FFFFFF] p-3.5 rounded-xl border border-[#DDD7CD] flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] font-bold text-[#77736D] uppercase block">DEFAULT ORDERING SLOT:</span>
                <span className="font-extrabold text-[#202020] text-sm">{slotStatus?.defaultOrderingWindow || '9:30 AM – 10:30 AM'}</span>
              </div>
              <button
                onClick={() => openEditModal('default_ordering')}
                className="px-3 py-1.5 rounded-lg bg-[#F5F1E8] hover:bg-[#DDD7CD] text-[#202020] text-xs font-semibold border border-[#DDD7CD] transition-all cursor-pointer flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5 text-[#B9684D]" />
                <span>Edit Default</span>
              </button>
            </div>

            {/* Today's Active Ordering Slot */}
            <div className="bg-[#FFFFFF] p-3.5 rounded-xl border-2 border-[#B9684D]/40 flex items-center justify-between text-xs shadow-xs">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-[#B9684D] uppercase block">TODAY'S ACTIVE SLOT:</span>
                  {slotStatus?.hasTodayOverride && (
                    <span className="text-[9px] font-bold bg-[#B9684D] text-white px-1.5 py-0.2 rounded-md">OVERRIDDEN TODAY</span>
                  )}
                </div>
                <span className="font-black text-[#B9684D] text-base">{slotStatus?.orderingWindow || '9:30 AM – 10:30 AM'}</span>
              </div>
              <button
                onClick={() => openEditModal('today_ordering')}
                className="px-3 py-1.5 rounded-lg bg-[#B9684D] hover:bg-[#B35835] text-[#FFFFFF] text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Today's Slot</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. PICKUP SLOT SECTION */}
        <div className="bg-[#F5F1E8] p-5 rounded-2xl border border-[#DDD7CD] space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#DDD7CD] pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#18251F] text-[#F8F5ED] flex items-center justify-center font-bold text-xs">
                PIC
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#202020] uppercase tracking-wider">PICKUP SLOT</h3>
                <span className="text-[10px] text-[#77736D] font-medium">Controls counter food collection window</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {/* Default Pickup Slot */}
            <div className="bg-[#FFFFFF] p-3.5 rounded-xl border border-[#DDD7CD] flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] font-bold text-[#77736D] uppercase block">DEFAULT PICKUP SLOT:</span>
                <span className="font-extrabold text-[#202020] text-sm">{slotStatus?.defaultPickupWindow || '12:00 PM – 1:00 PM'}</span>
              </div>
              <button
                onClick={() => openEditModal('default_pickup')}
                className="px-3 py-1.5 rounded-lg bg-[#F5F1E8] hover:bg-[#DDD7CD] text-[#202020] text-xs font-semibold border border-[#DDD7CD] transition-all cursor-pointer flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5 text-[#B9684D]" />
                <span>Edit Default</span>
              </button>
            </div>

            {/* Today's Active Pickup Slot */}
            <div className="bg-[#FFFFFF] p-3.5 rounded-xl border-2 border-[#18251F]/40 flex items-center justify-between text-xs shadow-xs">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-[#18251F] uppercase block">TODAY'S ACTIVE SLOT:</span>
                  {slotStatus?.hasTodayOverride && (
                    <span className="text-[9px] font-bold bg-[#18251F] text-white px-1.5 py-0.2 rounded-md">OVERRIDDEN TODAY</span>
                  )}
                </div>
                <span className="font-black text-[#18251F] text-base">{slotStatus?.pickupWindow || '12:00 PM – 1:00 PM'}</span>
              </div>
              <button
                onClick={() => openEditModal('today_pickup')}
                className="px-3 py-1.5 rounded-lg bg-[#18251F] hover:bg-[#283830] text-[#F8F5ED] text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <Edit2 className="w-3.5 h-3.5 text-[#C86B45]" />
                <span>Edit Today's Slot</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Edit Slot Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#131211]/80 backdrop-blur-md">
          <div className="max-w-md w-full bg-[#FFFFFF] border border-[#DDD7CD] rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#DDD7CD] pb-4">
              <div>
                <h3 className="text-base font-bold text-[#202020]">
                  {editModal.startsWith('default_') ? 'Edit Default Schedule' : "Edit Today's Active Slot"}
                </h3>
                <p className="text-xs text-[#77736D] mt-0.5">
                  {editModal.endsWith('_ordering') ? 'Ordering Slot (Student Orders)' : 'Pickup Slot (Food Collection Window)'}
                </p>
              </div>
              <button onClick={() => setEditModal(null)} className="text-[#77736D] hover:text-[#202020]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSlot} className="space-y-4">
              {editModal.endsWith('_ordering') ? (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#202020]">Start Time *</label>
                    <input
                      type="time"
                      required
                      value={editForm.orderingStartTime}
                      onChange={(e) => setEditForm({ ...editForm, orderingStartTime: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#F5F1E8] border border-[#DDD7CD] text-[#202020] text-xs font-bold focus:outline-none focus:border-[#B9684D]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#202020]">End Time *</label>
                    <input
                      type="time"
                      required
                      value={editForm.orderingEndTime}
                      onChange={(e) => setEditForm({ ...editForm, orderingEndTime: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#F5F1E8] border border-[#DDD7CD] text-[#202020] text-xs font-bold focus:outline-none focus:border-[#B9684D]"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#202020]">Start Time *</label>
                    <input
                      type="time"
                      required
                      value={editForm.pickupStartTime}
                      onChange={(e) => setEditForm({ ...editForm, pickupStartTime: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#F5F1E8] border border-[#DDD7CD] text-[#202020] text-xs font-bold focus:outline-none focus:border-[#B9684D]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#202020]">End Time *</label>
                    <input
                      type="time"
                      required
                      value={editForm.pickupEndTime}
                      onChange={(e) => setEditForm({ ...editForm, pickupEndTime: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#F5F1E8] border border-[#DDD7CD] text-[#202020] text-xs font-bold focus:outline-none focus:border-[#B9684D]"
                    />
                  </div>
                </div>
              )}

              <p className="text-[11px] text-[#77736D] bg-[#F5F1E8] p-3 rounded-xl border border-[#DDD7CD]">
                {editModal.startsWith('default_')
                  ? "ℹ️ Editing Default Slot updates the standard recurring schedule for future days."
                  : "ℹ️ Editing Today's Active Slot temporarily updates today's window without altering the default slot for future days."}
              </p>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModal(null)}
                  className="flex-1 py-2.5 rounded-xl bg-[#F5F1E8] hover:bg-[#DDD7CD] text-[#202020] font-semibold text-xs border border-[#DDD7CD]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl btn-mhp-primary text-xs font-bold"
                >
                  {saving ? 'Saving...' : 'Save Timing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSlotTimingControl;
