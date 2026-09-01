import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import { MHPCard, MHPButton, MHPBadge } from './MHPAdminComponents';
import { ShieldCheck, Phone, Lock, Save, KeyRound, UserCheck } from 'lucide-react';

/**
 * Admin Credentials & Security Control Panel
 * Allows MHP administrators to view their credentials, update their phone number,
 * and change their password directly from the Admin Dashboard.
 */
const AdminCredentialsControl = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [phone, setPhone] = useState(user?.phone || '7672022351');
  const [updatingPhone, setUpdatingPhone] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (!phone || phone.trim().length < 10) {
      showToast('error', 'Please enter a valid 10-digit mobile phone number');
      return;
    }

    try {
      setUpdatingPhone(true);
      await updateProfile({ phone: phone.trim() });
      showToast('success', `Admin mobile number updated successfully to ${phone.trim()}!`);
    } catch (err) {
      console.error('Failed to update admin phone:', err);
      showToast('error', err.response?.data?.error || 'Failed to update phone number');
    } finally {
      setUpdatingPhone(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwords;

    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('error', 'Please fill in all password fields');
      return;
    }

    if (newPassword.length < 6) {
      showToast('error', 'New password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('error', 'New password and confirm password do not match');
      return;
    }

    try {
      setUpdatingPassword(true);
      await api.post('/auth/change-password', { currentPassword, newPassword });
      showToast('success', 'Admin password changed successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error('Failed to change admin password:', err);
      showToast('error', err.response?.data?.error || 'Failed to change password. Check your current password.');
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <MHPCard className="!p-6 sm:!p-8 border-2 border-[#F47B20]/40 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#7D967E]/20 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-[#F47B20] uppercase tracking-widest mb-1">
            <ShieldCheck className="w-4 h-4" />
            ADMIN SECURITY & CREDENTIALS
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-[#183A2A]">
            Manage Admin Phone Number & Password
          </h2>
          <p className="text-xs text-[#7D967E] font-medium mt-0.5">
            Update the mobile phone number used to log into the Admin Portal or change your staff password.
          </p>
        </div>

        <MHPBadge variant="success" className="shrink-0 flex items-center gap-1.5 py-1 px-3">
          <UserCheck className="w-3.5 h-3.5" />
          <span>Active Staff Admin</span>
        </MHPBadge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* SECTION 1: UPDATE ADMIN PHONE NUMBER */}
        <div className="bg-[#FFF7E8] p-6 rounded-2xl border border-[#7D967E]/30 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 text-[#183A2A] border-b border-[#7D967E]/20 pb-3">
            <div className="w-8 h-8 rounded-xl bg-[#F47B20] text-white flex items-center justify-center font-bold">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider">1. Admin Mobile Phone Number</h3>
              <p className="text-[10px] text-[#7D967E]">Primary number used for admin portal sign-in</p>
            </div>
          </div>

          <form onSubmit={handlePhoneSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-[#183A2A] font-extrabold block">
                Mobile Number:
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#7D967E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="7672022351"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#7D967E]/30 text-[#183A2A] font-bold focus:outline-none focus:border-[#F47B20]"
                />
              </div>
              <p className="text-[11px] text-[#7D967E] font-medium">
                Current Active Login Phone: <strong className="text-[#183A2A] font-mono">{user?.phone || '7672022351'}</strong>
              </p>
            </div>

            <MHPButton
              type="submit"
              disabled={updatingPhone}
              variant="primary"
              size="md"
              className="w-full flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{updatingPhone ? 'Updating Number...' : 'Save New Mobile Number'}</span>
            </MHPButton>
          </form>
        </div>

        {/* SECTION 2: CHANGE ADMIN PASSWORD */}
        <div className="bg-[#FFF7E8] p-6 rounded-2xl border border-[#7D967E]/30 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 text-[#183A2A] border-b border-[#7D967E]/20 pb-3">
            <div className="w-8 h-8 rounded-xl bg-[#183A2A] text-white flex items-center justify-center font-bold">
              <KeyRound className="w-4 h-4 text-[#F47B20]" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider">2. Change Staff Password</h3>
              <p className="text-[10px] text-[#7D967E]">Update your admin password securely</p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-3.5 text-xs">
            
            <div className="space-y-1">
              <label className="text-[#183A2A] font-extrabold block">Current Password:</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-[#7D967E] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="mhp@zest143"
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#7D967E]/30 text-[#183A2A] font-bold focus:outline-none focus:border-[#F47B20]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[#183A2A] font-extrabold block">New Password:</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-[#7D967E] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Enter new admin password"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#7D967E]/30 text-[#183A2A] font-bold focus:outline-none focus:border-[#F47B20]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[#183A2A] font-extrabold block">Confirm New Password:</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-[#7D967E] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Re-enter new admin password"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#7D967E]/30 text-[#183A2A] font-bold focus:outline-none focus:border-[#F47B20]"
                />
              </div>
            </div>

            <MHPButton
              type="submit"
              disabled={updatingPassword}
              variant="secondary"
              size="md"
              className="w-full flex items-center justify-center gap-2 mt-1"
            >
              <KeyRound className="w-4 h-4 text-[#F47B20]" />
              <span>{updatingPassword ? 'Updating Password...' : 'Update Admin Password'}</span>
            </MHPButton>
          </form>
        </div>

      </div>

    </MHPCard>
  );
};

export default AdminCredentialsControl;
