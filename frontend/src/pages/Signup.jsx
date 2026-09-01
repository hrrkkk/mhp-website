import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ThreeDLogoEmblem from '../components/common/ThreeDLogoEmblem';
import { User, Phone, Lock, Mail, UserPlus } from 'lucide-react';

/**
 * Student Registration Screen — MHP Brand System
 * Palette:
 * - Background: Warm Cream (#FFF7E8)
 * - Card: Clean Soft White (#FFFFFF)
 * - Headers: Deep Forest Green (#183A2A)
 * - Primary CTA: MHP Food Orange (#F47B20)
 * 
 * Simple, fast, and light-weight signup experience.
 */
const Signup = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await register(formData);
      showToast('success', '🎉 Student account created successfully!');
      navigate('/menu');
    } catch (err) {
      console.error('Signup error:', err);
      showToast('error', err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
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
                VFSTR CAMPUS REGISTRATION
              </span>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#183A2A]">
                Create Student Account
              </h1>
            </div>
            <p className="text-xs text-[#7D967E] font-medium leading-relaxed">
              Register to pre-order food parcels online at MHP VFSTR Campus.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            <div className="space-y-1.5">
              <label className="text-[#183A2A] font-extrabold block">
                Full Name:
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#7D967E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Student Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FFF7E8]/50 border border-[#7D967E]/30 text-[#183A2A] font-bold placeholder-[#7D967E]/60 focus:outline-none focus:border-[#F47B20] focus:ring-1 focus:ring-[#F47B20]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[#183A2A] font-extrabold block">
                VFSTR Email Address:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#7D967E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="student@vignan.ac.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FFF7E8]/50 border border-[#7D967E]/30 text-[#183A2A] font-bold placeholder-[#7D967E]/60 focus:outline-none focus:border-[#F47B20] focus:ring-1 focus:ring-[#F47B20]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[#183A2A] font-extrabold block">
                Mobile Phone Number:
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#7D967E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="9123456789"
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
              <UserPlus className="w-4 h-4" />
              <span>{loading ? 'CREATING ACCOUNT...' : 'REGISTER STUDENT ACCOUNT'}</span>
            </button>

          </form>

          {/* Footer Link */}
          <div className="text-center pt-3 text-xs text-[#7D967E] border-t border-[#7D967E]/20">
            <span>Already have an account? </span>
            <Link to="/login" className="text-[#F47B20] font-extrabold hover:underline">
              Sign In Here
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Signup;
