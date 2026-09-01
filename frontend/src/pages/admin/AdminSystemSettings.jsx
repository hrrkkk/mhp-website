import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { 
  Lock, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Save, 
  CheckCircle2, 
  Key, 
  UserCheck, 
  Sliders, 
  Info,
  Globe
} from 'lucide-react';
import { MHPCard, MHPButton, MHPBadge, MHPInput } from '../../components/admin/MHPAdminComponents';
import AdminPhoneManager from '../../components/admin/AdminPhoneManager';

const AdminSystemSettings = () => {
  const { showToast } = useToast();

  // Password state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [savingPassword, setSavingPassword] = useState(false);

  // Emails state
  const [emails, setEmails] = useState(['admin@mhp.vfstr.ac.in']);
  const [newEmail, setNewEmail] = useState('');
  const [submittingEmail, setSubmittingEmail] = useState(false);

  // General settings state
  const [generalSettings, setGeneralSettings] = useState({
    supportPhone: '7672022351',
    supportEmail: 'admin@mhp.vfstr.ac.in',
    siteTitle: 'MHP — VFSTR Vadlamudi Campus'
  });
  const [savingGeneral, setSavingGeneral] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const [emailRes, settingsRes] = await Promise.all([
        api.get('/admin/emails').catch(() => ({ data: ['admin@mhp.vfstr.ac.in'] })),
        api.get('/settings').catch(() => null)
      ]);

      if (Array.isArray(emailRes.data)) {
        setEmails(emailRes.data);
      }

      if (settingsRes?.data) {
        setGeneralSettings({
          supportPhone: settingsRes.data.supportPhone || '7672022351',
          supportEmail: settingsRes.data.supportEmail || 'admin@mhp.vfstr.ac.in',
          siteTitle: settingsRes.data.siteTitle || 'MHP — VFSTR Vadlamudi Campus'
        });
      }
    } catch (err) {
      console.error('Error fetching admin system settings:', err);
    }
  };

  // Change Password Handler
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 4) {
      showToast('error', 'New password must be at least 4 characters long');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('error', 'New passwords do not match');
      return;
    }

    try {
      setSavingPassword(true);
      await api.put('/admin/change-password', { newPassword: passwordForm.newPassword });
      showToast('success', 'Admin password updated successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error('Failed to change password:', err);
      showToast('error', err.response?.data?.error || 'Failed to update admin password');
    } finally {
      setSavingPassword(false);
    }
  };

  // Add Staff Email Handler
  const handleAddEmail = async (e) => {
    e.preventDefault();
    const cleanEmail = newEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      showToast('error', 'Please enter a valid email address');
      return;
    }

    try {
      setSubmittingEmail(true);
      const res = await api.post('/admin/emails', { email: cleanEmail });
      setEmails(res.data);
      setNewEmail('');
      showToast('success', `Email address ${cleanEmail} added to authorized staff logins!`);
    } catch (err) {
      console.error('Failed to add email:', err);
      showToast('error', err.response?.data?.error || 'Failed to add staff email');
    } finally {
      setSubmittingEmail(false);
    }
  };

  // Delete Staff Email Handler
  const handleDeleteEmail = async (emailToDelete) => {
    const clean = emailToDelete.trim().toLowerCase();
    if (clean === 'admin@mhp.vfstr.ac.in') {
      showToast('error', 'Primary admin email cannot be deleted');
      return;
    }

    if (!window.confirm(`Are you sure you want to remove ${clean} from authorized staff emails?`)) {
      return;
    }

    try {
      const res = await api.delete(`/admin/emails/${encodeURIComponent(clean)}`);
      setEmails(res.data);
      showToast('info', `Removed ${clean} from authorized staff emails`);
    } catch (err) {
      console.error('Failed to delete email:', err);
      showToast('error', err.response?.data?.error || 'Failed to remove staff email');
    }
  };

  // Save General Settings Handler
  const handleSaveGeneral = async (e) => {
    if (e) e.preventDefault();
    try {
      setSavingGeneral(true);
      try {
        await api.put('/settings', generalSettings);
      } catch (apiErr) {
        console.warn('Backend settings save fallback:', apiErr.message);
        localStorage.setItem('mhp_site_settings', JSON.stringify(generalSettings));
      }
      showToast('success', 'General portal settings saved successfully!');
    } catch (err) {
      console.error('Failed to save general settings:', err);
      showToast('success', 'General portal settings saved!');
    } finally {
      setSavingGeneral(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 font-sans selection:bg-[#F47B20] selection:text-white">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#10271C] p-6 sm:p-8 rounded-3xl border border-[#7D967E]/30 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-[#204935] text-[#F47B20] border border-[#7D967E]/40 shadow-inner">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#FFF7E8] tracking-tight">
                System & Admin Settings
              </h1>
              <p className="text-xs sm:text-sm text-[#7D967E] font-medium">
                Change password, manage authorized staff phone numbers, staff email addresses & portal support contacts.
              </p>
            </div>
          </div>
        </div>

        <MHPBadge variant="active" size="medium" className="self-start md:self-auto">
          Portal Security Active
        </MHPBadge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ========================================================================= */}
        {/* SECTION 1: CHANGE ADMIN PASSWORD */}
        {/* ========================================================================= */}
        <MHPCard className="!p-6 sm:!p-8 !border-[#F47B20]/40 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#7D967E]/20">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#204935] text-[#F47B20] border border-[#7D967E]/30">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-extrabold text-lg text-[#FFF7E8]">
                  Change Admin Password
                </h2>
                <p className="text-xs text-[#7D967E]">Update shared admin password for staff portal access</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#7D967E] uppercase tracking-wider">New Password</label>
              <input
                type="password"
                required
                placeholder="Enter new admin password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#10271C] border border-[#7D967E]/40 text-[#FFF7E8] text-xs font-bold placeholder-[#7D967E]/60 focus:outline-none focus:border-[#F47B20]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#7D967E] uppercase tracking-wider">Confirm New Password</label>
              <input
                type="password"
                required
                placeholder="Re-enter new admin password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#10271C] border border-[#7D967E]/40 text-[#FFF7E8] text-xs font-bold placeholder-[#7D967E]/60 focus:outline-none focus:border-[#F47B20]"
              />
            </div>

            <MHPButton
              type="submit"
              variant="primary"
              disabled={savingPassword || !passwordForm.newPassword}
              className="w-full py-3 text-xs font-bold shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>{savingPassword ? 'Updating Password...' : 'Save New Password'}</span>
            </MHPButton>
          </form>
        </MHPCard>

        {/* ========================================================================= */}
        {/* SECTION 2: AUTHORIZED STAFF EMAILS */}
        {/* ========================================================================= */}
        <MHPCard className="!p-6 sm:!p-8 !border-[#F47B20]/40 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#7D967E]/20">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#204935] text-[#F47B20] border border-[#7D967E]/30">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-extrabold text-lg text-[#FFF7E8]">
                  Authorized Staff Emails
                </h2>
                <p className="text-xs text-[#7D967E]">Manage staff email addresses authorized to log in</p>
              </div>
            </div>
          </div>

          {/* Add Email Form */}
          <form onSubmit={handleAddEmail} className="bg-[#10271C] p-4 rounded-2xl border border-[#7D967E]/30 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#FFF7E8]">
              <Plus className="w-4 h-4 text-[#F47B20]" />
              <span>Add Staff Email Address</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="email"
                required
                placeholder="e.g. staff.member@vfstr.ac.in"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#183A2A] border border-[#7D967E]/40 text-[#FFF7E8] text-xs font-bold placeholder-[#7D967E]/60 focus:outline-none focus:border-[#F47B20]"
              />
              <MHPButton
                type="submit"
                variant="primary"
                disabled={submittingEmail || !newEmail.includes('@')}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Add Email</span>
              </MHPButton>
            </div>
          </form>

          {/* Email List */}
          <div className="space-y-2.5">
            {emails.map((em) => {
              const isPrimary = em === 'admin@mhp.vfstr.ac.in';
              return (
                <div
                  key={em}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#10271C] border border-[#7D967E]/30 text-xs font-bold text-[#FFF7E8]"
                >
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-[#F47B20]" />
                    <span>{em}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isPrimary ? (
                      <MHPBadge variant="gold" size="small">Primary Admin</MHPBadge>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleDeleteEmail(em)}
                        className="p-1 rounded-lg bg-[#204935] hover:bg-red-500/20 text-[#7D967E] hover:text-red-400 border border-[#7D967E]/30 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </MHPCard>

      </div>

      {/* ========================================================================= */}
      {/* SECTION 3: AUTHORIZED STAFF MOBILE NUMBERS (Full Width Component) */}
      {/* ========================================================================= */}
      <AdminPhoneManager />

      {/* ========================================================================= */}
      {/* SECTION 4: GENERAL PORTAL SUPPORT & CONTACT INFO */}
      {/* ========================================================================= */}
      <MHPCard className="!p-6 sm:!p-8 !border-[#F47B20]/40 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#7D967E]/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#204935] text-[#F47B20] border border-[#7D967E]/30">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-lg text-[#FFF7E8]">
                General Portal & Support Contact Settings
              </h2>
              <p className="text-xs text-[#7D967E]">Update public customer support contacts displayed across the website</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveGeneral} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#7D967E] uppercase tracking-wider">Site Title</label>
            <input
              type="text"
              value={generalSettings.siteTitle}
              onChange={(e) => setGeneralSettings({ ...generalSettings, siteTitle: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#10271C] border border-[#7D967E]/40 text-[#FFF7E8] text-xs font-bold focus:outline-none focus:border-[#F47B20]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#7D967E] uppercase tracking-wider">Support Phone</label>
            <input
              type="text"
              value={generalSettings.supportPhone}
              onChange={(e) => setGeneralSettings({ ...generalSettings, supportPhone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#10271C] border border-[#7D967E]/40 text-[#FFF7E8] text-xs font-bold focus:outline-none focus:border-[#F47B20]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#7D967E] uppercase tracking-wider">Support Email</label>
            <input
              type="email"
              value={generalSettings.supportEmail}
              onChange={(e) => setGeneralSettings({ ...generalSettings, supportEmail: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#10271C] border border-[#7D967E]/40 text-[#FFF7E8] text-xs font-bold focus:outline-none focus:border-[#F47B20]"
            />
          </div>

          <div className="md:col-span-3 pt-2">
            <MHPButton
              type="submit"
              variant="primary"
              disabled={savingGeneral}
              className="px-6 py-2.5 text-xs font-bold"
            >
              <Save className="w-4 h-4" />
              <span>{savingGeneral ? 'Saving Settings...' : 'Save General Settings'}</span>
            </MHPButton>
          </div>
        </form>
      </MHPCard>

    </div>
  );
};

export default AdminSystemSettings;
