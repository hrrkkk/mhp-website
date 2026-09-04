import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ThreeDLogoEmblem from '../components/common/ThreeDLogoEmblem';
import { User, Lock, LogIn, Sparkles } from 'lucide-react';

/**
 * Student Login Screen — MHP Brand System
 * Palette:
 * - Background: Warm Cream (#FFF7E8)
 * - Card: Clean Soft White (#FFFFFF)
 * - Headers: Deep Forest Green (#183A2A)
 * - Primary CTA: MHP Food Orange (#F47B20)
 * 
 * Simple, fast, and light-weight authentication experience.
 */
const Login = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);
    if (!formData.phone || !formData.password) {
      const msg = 'Please fill in both mobile number/email and password';
      setLoginError(msg);
      showToast('error', msg);
      return;
    }

    try {
      setLoading(true);
      const loggedUser = await login(formData.phone, formData.password);
      showToast('success', `Welcome back, ${loggedUser?.name || 'User'}!`);
      if (loggedUser?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/menu');
      }
    } catch (err) {
      console.error('Login error:', err);
      const msg = err.response?.data?.message || err.response?.data?.error || 'Invalid credentials. Please check your phone/email or password.';
      setLoginError(msg);
      showToast('error', msg);
    } finally {
      setLoading(false);
    }
  };

  const fillStudentDemo = () => {
    setFormData({
      phone: '7672022351',
      password: 'AdminPassword123!'
    });
  };

  return (
    <div className="bg-[#FFF7E8] text-[#202522] min-h-screen py-12 flex items-center justify-center px-4 font-sans selection:bg-[#F47B20] selection:text-white">
      <div className="max-w-md w-full">
        
        <div className="bg-[#FFFFFF] p-8 sm:p-10 rounded-3xl border-2 border-[#7D967E]/30 space-y-6 shadow-xl relative">
          
          {/* Logo & Header */}
          <div className="text-center space-y-3">
            <ThreeDLogoEmblem size="medium" />
            <div className="space-y-1">
              <span className="text-[10px] font-black text-[#F47B20] uppercase tracking-widest block">
                VFSTR CAMPUS PORTAL
              </span>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#183A2A]">
                Student Sign In
              </h1>
            </div>
            <p className="text-xs text-[#7D967E] font-medium leading-relaxed">
              Sign in with your registered mobile phone number.
            </p>
          </div>

          {/* Quick Demo Credentials Autofill */}
          <div className="bg-[#FFF7E8] p-3.5 rounded-2xl border border-[#7D967E]/30 text-center space-y-2">
            <span className="text-[10px] font-black text-[#7D967E] uppercase tracking-wider block">
              QUICK DEMO STUDENT CREDENTIALS
            </span>
            <button
              type="button"
              onClick={fillStudentDemo}
              className="w-full py-2 px-3 rounded-xl bg-[#183A2A] hover:bg-[#204935] text-[#FFF7E8] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F47B20]" />
              <span>Auto-fill Demo Phone Sign In</span>
            </button>
          </div>

          {/* Inline Login Failure Error Alert */}
          {loginError && (
            <div className="bg-rose-50 border-2 border-rose-400 p-3.5 rounded-2xl text-rose-900 text-xs font-bold space-y-1 shadow-sm">
              <div className="flex items-center gap-1.5 font-black uppercase text-[10px] text-rose-700">
                <span>⚠️ LOGIN FAILED</span>
              </div>
              <p>{loginError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            <div className="space-y-1.5">
              <label className="text-[#183A2A] font-extrabold block">
                Mobile Phone Number:
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#7D967E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Enter registered mobile number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FFF7E8]/50 border border-[#7D967E]/30 text-[#183A2A] font-bold placeholder-[#7D967E]/60 focus:outline-none focus:border-[#F47B20] focus:ring-1 focus:ring-[#F47B20]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[#183A2A] font-extrabold block">
                Password:
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#7D967E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FFF7E8]/50 border border-[#7D967E]/30 text-[#183A2A] font-bold placeholder-[#7D967E]/60 focus:outline-none focus:border-[#F47B20] focus:ring-1 focus:ring-[#F47B20]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-mhp-primary text-xs w-full py-3.5 font-black flex items-center justify-center gap-2 shadow-lg cursor-pointer mt-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'SIGNING IN...' : 'SIGN IN TO MHP'}</span>
            </button>

          </form>

          {/* Footer Link */}
          <div className="text-center pt-3 text-xs text-[#7D967E] border-t border-[#7D967E]/20">
            <span>Don't have an account yet? </span>
            <Link to="/signup" className="text-[#F47B20] font-extrabold hover:underline">
              Create Student Account
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Login;
