import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Phone, Plus, Trash2, ShieldCheck, UserCheck, AlertCircle, Key } from 'lucide-react';
import { MHPCard, MHPButton, MHPBadge, MHPInput } from './MHPAdminComponents';

const AdminPhoneManager = () => {
  const { showToast } = useToast();
  const [phoneNumbers, setPhoneNumbers] = useState(['7672022351']);
  const [newPhone, setNewPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPhoneNumbers();
  }, []);

  const fetchPhoneNumbers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/phone-numbers');
      if (Array.isArray(res.data)) {
        setPhoneNumbers(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch admin phone numbers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPhone = async (e) => {
    e.preventDefault();
    const cleanDigits = newPhone.replace(/\D/g, '');
    if (cleanDigits.length < 10) {
      showToast('error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/admin/phone-numbers', { phone: cleanDigits });
      setPhoneNumbers(res.data);
      setNewPhone('');
      showToast('success', `Mobile number +91 ${cleanDigits} added to authorized admin logins!`);
    } catch (err) {
      console.error('Failed to add phone number:', err);
      showToast('error', err.response?.data?.error || 'Failed to add mobile number');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePhone = async (phoneToDelete) => {
    const cleanDigits = phoneToDelete.replace(/\D/g, '');
    if (cleanDigits === '7672022351') {
      showToast('error', 'Primary admin phone number cannot be removed');
      return;
    }

    if (!window.confirm(`Are you sure you want to remove +91 ${cleanDigits} from authorized staff logins?`)) {
      return;
    }

    try {
      const res = await api.delete(`/admin/phone-numbers/${cleanDigits}`);
      setPhoneNumbers(res.data);
      showToast('info', `Removed +91 ${cleanDigits} from authorized admin logins`);
    } catch (err) {
      console.error('Failed to delete phone number:', err);
      showToast('error', err.response?.data?.error || 'Failed to remove mobile number');
    }
  };

  return (
    <MHPCard className="!p-6 sm:!p-8 !border-[#F47B20]/40 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#7D967E]/20">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#204935] text-[#F47B20] border border-[#7D967E]/30">
              <Phone className="w-5 h-5" />
            </div>
            <h2 className="font-display font-extrabold text-xl text-[#FFF7E8]">
              Authorized Staff Login Mobile Numbers
            </h2>
            <MHPBadge variant="active" size="small">Shared Access</MHPBadge>
          </div>
          <p className="text-xs text-[#7D967E] font-medium pl-11">
            Manage multiple staff mobile numbers authorized to log into the Admin Portal using the admin password.
          </p>
        </div>
      </div>

      {/* Add New Number Form */}
      <form onSubmit={handleAddPhone} className="bg-[#10271C] p-4 sm:p-5 rounded-2xl border border-[#7D967E]/30 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#FFF7E8]">
          <Plus className="w-4 h-4 text-[#F47B20]" />
          <span>Add New Staff Mobile Number</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:flex-1">
            <span className="absolute left-3.5 top-2.5 text-xs font-bold text-[#7D967E]">+91</span>
            <input
              type="tel"
              maxLength={10}
              placeholder="Enter 10-digit mobile number (e.g. 9876543210)"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value.replace(/\D/g, ''))}
              className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-[#183A2A] border border-[#7D967E]/40 text-[#FFF7E8] text-xs font-bold placeholder-[#7D967E]/60 focus:outline-none focus:border-[#F47B20]"
            />
          </div>

          <MHPButton
            type="submit"
            variant="primary"
            disabled={submitting || newPhone.length < 10}
            className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>{submitting ? 'Adding...' : 'Add Mobile Number'}</span>
          </MHPButton>
        </div>
      </form>

      {/* Authorized Numbers List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-[#7D967E] uppercase tracking-wider px-1">
          <span>Active Staff Login Numbers ({phoneNumbers.length})</span>
          <span>Permission Level</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {phoneNumbers.map((num) => {
            const isPrimary = num === '7672022351';
            return (
              <div
                key={num}
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#10271C] border border-[#7D967E]/30 hover:border-[#F47B20]/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isPrimary ? 'bg-[#F47B20]/20 text-[#F47B20]' : 'bg-[#204935] text-[#7D967E]'}`}>
                    {isPrimary ? <ShieldCheck className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="font-mono font-bold text-sm text-[#FFF7E8]">
                      +91 {num.replace(/(\d{5})(\d{5})/, '$1 $2')}
                    </div>
                    <div className="text-[10px] text-[#7D967E] font-medium">
                      {isPrimary ? 'Primary Admin Contact' : 'Authorized Staff Member'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isPrimary ? (
                    <MHPBadge variant="gold" size="small">Primary</MHPBadge>
                  ) : (
                    <>
                      <MHPBadge variant="active" size="small">Staff</MHPBadge>
                      <button
                        type="button"
                        onClick={() => handleDeletePhone(num)}
                        title="Remove mobile number"
                        className="p-1.5 rounded-lg bg-[#204935] hover:bg-red-500/20 text-[#7D967E] hover:text-red-400 border border-[#7D967E]/30 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shared Password Note */}
      <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#204935]/50 border border-[#7D967E]/30 text-xs text-[#7D967E]">
        <Key className="w-4 h-4 text-[#F47B20] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#FFF7E8]">Shared Staff Credentials Notice: </span>
          All added staff mobile numbers are authorized to log into the Admin Portal using the admin staff password.
        </div>
      </div>

    </MHPCard>
  );
};

export default AdminPhoneManager;
