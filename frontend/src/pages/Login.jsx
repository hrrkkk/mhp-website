import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ThreeDSpatialCard from '../components/common/ThreeDSpatialCard';
import ThreeDLogoEmblem from '../components/common/ThreeDLogoEmblem';
import { User, Lock, LogIn, ArrowRight } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(formData.phone, formData.password);
      showToast('success', 'Signed in successfully');
      navigate('/menu');
    } catch (err) {
      console.error('Login error:', err);
      showToast('error', err.response?.data?.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#121113] text-[#F4ECE4] min-h-screen py-16 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <ThreeDSpatialCard maxTilt={6} className="p-8 sm:p-10 rounded-3xl border border-[#4A1F31] space-y-6 shadow-2xl">
          
          <div className="text-center space-y-3">
            <ThreeDLogoEmblem size="medium" />
            <h1 className="font-display font-bold text-3xl text-[#F4ECE4]">Student Sign In</h1>
            <p className="text-xs text-[#C8BDB6]">
              Sign in with your mobile number to access MHP parcel orders & order history.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="text-[#C8BDB6] font-bold block mb-1">Mobile Phone Number:</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#C8BDB6] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="9123456789"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#121113] border border-[#4A1F31] text-[#F4ECE4] font-medium focus:outline-none focus:border-[#C86F4D]"
                />
              </div>
            </div>

            <div>
              <label className="text-[#C8BDB6] font-bold block mb-1">Password:</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#C8BDB6] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#121113] border border-[#4A1F31] text-[#F4ECE4] font-medium focus:outline-none focus:border-[#C86F4D]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-mhp-primary text-xs w-full py-3"
            >
              {loading ? 'Signing In...' : 'Sign In To MHP'}
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-[#C8BDB6] border-t border-[#4A1F31]">
            <span>Don't have an account yet? </span>
            <Link to="/signup" className="text-[#C86F4D] font-bold hover:underline">
              Create Student Account
            </Link>
          </div>

        </ThreeDSpatialCard>
      </div>
    </div>
  );
};

export default Login;
