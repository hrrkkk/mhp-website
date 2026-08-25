import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ShieldCheck, Mail, Lock, LogIn, Globe } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('error', 'Please enter email and password');
      return;
    }

    try {
      setSubmitting(true);
      const user = await login(email, password);
      if (user.role === 'admin') {
        showToast('success', `Welcome to MHP Admin Portal, ${user.name}!`);
        navigate('/admin/dashboard');
      } else {
        showToast('error', 'Access denied. Account is not an administrator.');
      }
    } catch (err) {
      console.error('Admin Login error:', err);
      showToast('error', err.response?.data?.error || 'Invalid admin credentials');
    } finally {
      setSubmitting(false);
    }
  };

  const fillAdminDemo = () => {
    setEmail('admin@mhp.vfstr.ac.in');
    setPassword('AdminPassword123!');
  };

  return (
    <div className="min-h-screen bg-[#202020] text-[#F5F1E8] flex items-center justify-center px-4 py-12 selection:bg-[#B9684D] selection:text-[#FFFFFF]">
      <div className="max-w-md w-full bg-[#2A2927] p-6 sm:p-8 rounded-xl border border-[#383633] space-y-5 shadow-lg">
        
        {/* Top Header Action */}
        <div className="flex items-center justify-between pb-4 border-b border-[#383633]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-[#B9684D] text-[#FFFFFF] font-bold flex items-center justify-center text-xs">
              MHP
            </div>
            <span className="font-display font-bold text-[#F5F1E8] text-sm tracking-tight">Admin Portal</span>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#202020] hover:bg-[#181818] text-[#F5F1E8] border border-[#383633] text-xs font-medium transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-[#B9684D]" />
            <span>Customer Website</span>
          </a>
        </div>

        {/* Title */}
        <div className="text-center space-y-1.5">
          <div className="w-10 h-10 rounded-lg bg-[#202020] text-[#B9684D] border border-[#383633] flex items-center justify-center mx-auto">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h1 className="font-display font-bold text-2xl text-[#F5F1E8]">MHP Admin Staff Login</h1>
          <p className="text-xs text-[#77736D]">Internal Portal Access • VFSTR Campus Vadlamudi</p>
        </div>

        {/* Admin Quick Fill */}
        <div className="bg-[#202020] p-3 rounded-lg border border-[#383633] text-center space-y-1.5">
          <p className="text-[10px] font-bold text-[#77736D] uppercase tracking-wider">
            Admin Staff Credentials
          </p>
          <button
            type="button"
            onClick={fillAdminDemo}
            className="w-full py-2 px-3 rounded-md bg-[#B9684D] hover:bg-[#A85C42] text-[#FFFFFF] text-xs font-semibold transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            Fill Admin Credentials (admin@mhp.vfstr.ac.in)
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-[#77736D]">Staff Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#77736D] absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="admin@mhp.vfstr.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-[#202020] border border-[#383633] text-[#F5F1E8] text-xs focus:outline-none focus:border-[#B9684D]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-[#77736D]">Admin Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#77736D] absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-[#202020] border border-[#383633] text-[#F5F1E8] text-xs focus:outline-none focus:border-[#B9684D]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-mhp-primary w-full text-xs font-semibold flex items-center justify-center gap-2 mt-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{submitting ? 'Authenticating Staff...' : 'Sign In to Admin Portal'}</span>
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#383633]">
          <a
            href="/"
            className="text-xs text-[#77736D] hover:text-[#F5F1E8] font-medium transition-colors inline-flex items-center gap-1"
          >
            <span>&larr; Return to MHP Customer Website</span>
          </a>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
