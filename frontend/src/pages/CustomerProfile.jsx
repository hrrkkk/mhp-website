import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import ThreeDSpatialCard from '../components/common/ThreeDSpatialCard';
import {
  User,
  ShoppingBag,
  KeyRound,
  LogOut,
  CheckCircle2,
  Clock,
  PackageCheck,
  ChevronRight,
  Edit3,
  Phone,
  Mail,
  X,
  Sparkles,
  UtensilsCrossed
} from 'lucide-react';

const CustomerProfile = () => {
  const { user, logout, updateProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'profile' | 'password'
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrderModal, setSelectedOrderModal] = useState(null);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [profileUpdating, setProfileUpdating] = useState(false);

  // Change Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordUpdating, setPasswordUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await api.get('/future-menu/orders');
      const allOrders = res.data || [];
      
      // Filter strictly for current customer's real orders in the database
      let customerOrders = allOrders;
      if (user) {
        customerOrders = allOrders.filter(order =>
          (user.phone && order.studentPhone === user.phone) ||
          (user._id && (order.studentId === user._id || order.userId === user._id)) ||
          (user.studentId && order.studentId === user.studentId) ||
          (user.email && order.studentEmail === user.email)
        );
      }
      
      setOrders(customerOrders);
    } catch (err) {
      console.error('Failed to load real orders:', err);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleMarkReceived = async (orderId, e) => {
    if (e) e.stopPropagation();
    try {
      await api.patch(`/future-menu/orders/${orderId}/status`, { status: 'ORDER RECEIVED' });
      showToast('success', 'Order status updated to ORDER RECEIVED');
      setOrders(prev =>
        prev.map(o => (o._id === orderId ? { ...o, status: 'ORDER RECEIVED' } : o))
      );
      if (selectedOrderModal && selectedOrderModal._id === orderId) {
        setSelectedOrderModal(prev => prev ? { ...prev, status: 'ORDER RECEIVED' } : null);
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
      showToast('error', 'Failed to update order status');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setProfileUpdating(true);
      if (updateProfile) {
        await updateProfile(profileData);
      } else {
        await api.put('/auth/profile', profileData);
      }
      showToast('success', 'Profile updated successfully!');
      setIsEditingProfile(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
      showToast('error', err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileUpdating(false);
    }
  };

  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('error', 'New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      showToast('error', 'Password must be at least 6 characters');
      return;
    }

    try {
      setPasswordUpdating(true);
      await api.post('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      showToast('success', 'Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error('Failed to change password:', err);
      showToast('error', err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordUpdating(false);
    }
  };

  // Status Badge Helper
  const renderStatusBadge = (status) => {
    const s = (status || 'ORDER CONFIRMED').toUpperCase();
    if (s === 'PREPARING' || s === 'KITCHEN PREPARING') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 animate-spin text-amber-600" />
          <span>Preparing</span>
        </span>
      );
    }
    if (s === 'READY FOR PICKUP' || s === 'READY') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
          <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Ready for Pickup</span>
        </span>
      );
    }
    if (s === 'ORDER RECEIVED' || s === 'COMPLETED') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-900 text-emerald-100 border border-emerald-700 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Completed</span>
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
        <span>Confirmed</span>
      </span>
    );
  };

  return (
    <div className="bg-[#FFF7E8] text-[#202522] min-h-screen py-8 sm:py-12 pb-32 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* 1. Profile Header Banner - Forest Green Signature MHP Card */}
        <div className="card-mhp-forest p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          
          {/* Subtle Ambient Background Accent */}
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-[#F47B20]/15 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-center gap-5 z-10">
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-[#F47B20] text-white flex items-center justify-center font-bold text-3xl shadow-lg shadow-[#F47B20]/30 border-2 border-white/20">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#FFF7E8]">
                  {user?.name || 'MHP Customer'}
                </h1>
                <span className="px-3 py-0.5 rounded-full bg-[#FFF7E8]/10 text-[#F47B20] text-[11px] font-extrabold uppercase border border-[#F47B20]/40">
                  VFSTR Campus Member
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#7D967E]">
                Welcome back to MHP Food Court! Enjoy your dining experience.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#FFF7E8]/80 pt-1">
                {user?.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#F47B20]" />
                    {user.email}
                  </span>
                )}
                {user?.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#F47B20]" />
                    +91 {user.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end z-10 pt-2 md:pt-0 border-t md:border-t-0 border-[#7D967E]/30">
            <button
              onClick={() => {
                setActiveTab('profile');
                setIsEditingProfile(true);
              }}
              className="btn-mhp-primary text-xs py-2.5 px-4"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>

            <button
              onClick={logout}
              className="px-4 py-2.5 rounded-xl bg-rose-950/40 text-rose-200 border border-rose-800/50 text-xs font-bold hover:bg-rose-900/60 transition-all flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* 2. Quick Actions & Navigation Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Quick Actions Sidebar Menu */}
          <div className="lg:col-span-1 card-mhp-white p-3 rounded-3xl space-y-1">
            <div className="px-4 py-3 text-xs font-bold text-[#7D967E] uppercase tracking-wider border-b border-[#7D967E]/20 mb-1">
              Quick Actions
            </div>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                activeTab === 'orders'
                  ? 'bg-[#183A2A] text-[#FFF7E8] shadow-md'
                  : 'text-[#202522] hover:bg-[#FFF7E8] hover:text-[#183A2A]'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4 text-[#F47B20]" />
                <span>My Orders</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                activeTab === 'orders' ? 'bg-[#F47B20] text-white' : 'bg-[#183A2A]/10 text-[#183A2A]'
              }`}>
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                activeTab === 'profile'
                  ? 'bg-[#183A2A] text-[#FFF7E8] shadow-md'
                  : 'text-[#202522] hover:bg-[#FFF7E8] hover:text-[#183A2A]'
              }`}
            >
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-[#F47B20]" />
                <span>Profile Details</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-40" />
            </button>

            <button
              onClick={() => setActiveTab('password')}
              className={`w-full text-left py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                activeTab === 'password'
                  ? 'bg-[#183A2A] text-[#FFF7E8] shadow-md'
                  : 'text-[#202522] hover:bg-[#FFF7E8] hover:text-[#183A2A]'
              }`}
            >
              <div className="flex items-center gap-3">
                <KeyRound className="w-4 h-4 text-[#F47B20]" />
                <span>Change Password</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-40" />
            </button>

            <div className="pt-2 border-t border-[#7D967E]/20 mt-2">
              <button
                onClick={logout}
                className="w-full text-left py-3 px-4 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 transition-all flex items-center gap-3"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Main Tab Content */}
          <div className="lg:col-span-3">

            {/* TAB 1: MY ORDERS */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between card-mhp-white p-5 rounded-3xl">
                  <div>
                    <h2 className="font-display font-bold text-2xl text-[#183A2A]">My Orders</h2>
                    <p className="text-xs text-[#7D967E]">Real-time orders retrieved from backend database</p>
                  </div>
                  <button
                    onClick={fetchOrders}
                    className="px-3 py-1.5 rounded-xl bg-[#183A2A]/10 text-[#183A2A] hover:bg-[#183A2A]/20 text-xs font-bold transition-all"
                  >
                    Refresh Orders
                  </button>
                </div>

                {loadingOrders ? (
                  <LoadingSkeleton count={3} />
                ) : orders.length === 0 ? (
                  /* Clean Empty State: No fake fallback orders */
                  <div className="card-mhp-white p-12 text-center rounded-3xl space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#183A2A]/10 text-[#183A2A] flex items-center justify-center mx-auto">
                      <UtensilsCrossed className="w-8 h-8 text-[#F47B20]" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-display font-bold text-xl text-[#183A2A]">No orders yet</h3>
                      <p className="text-xs text-[#7D967E] max-w-sm mx-auto">
                        Your orders will appear here once you place an order.
                      </p>
                    </div>
                    <button
                      onClick={() => navigate('/')}
                      className="btn-mhp-primary text-xs py-2.5 px-6 mt-2"
                    >
                      <span>Explore Menu & Order Now</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const isReceived = order.status === 'ORDER RECEIVED' || order.status === 'COMPLETED';
                      return (
                        <ThreeDSpatialCard
                          key={order._id}
                          maxTilt={2}
                          scale={1.01}
                          className="card-mhp-white p-6 rounded-3xl space-y-4 cursor-pointer"
                          onClick={() => setSelectedOrderModal(order)}
                        >
                          {/* Order Card Header */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#7D967E]/20 pb-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-bold text-[#7D967E] uppercase">ORDER ID:</span>
                                <span className="font-mono font-black text-lg text-[#F47B20] tracking-wider">
                                  {order.billingNumber || order._id?.slice(-6).toUpperCase()}
                                </span>
                              </div>
                              <p className="text-xs text-[#7D967E] mt-0.5">
                                Placed on {new Date(order.createdAt || Date.now()).toLocaleString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })} • Pickup at <strong className="text-[#183A2A]">{order.pickupPoint || 'N Block Counter'}</strong>
                              </p>
                            </div>

                            <div className="flex items-center gap-3">
                              {renderStatusBadge(order.status)}

                              {!isReceived && (
                                <button
                                  onClick={(e) => handleMarkReceived(order._id, e)}
                                  className="btn-mhp-primary text-xs py-1.5 px-3"
                                >
                                  <PackageCheck className="w-3.5 h-3.5" />
                                  <span>Received Order</span>
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Ordered Food Items */}
                          <div className="space-y-2">
                            <span className="text-[11px] font-bold text-[#7D967E] uppercase block">Ordered Items:</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              {(order.items || []).map((item, idx) => (
                                <div key={idx} className="bg-[#FFF7E8] p-3 rounded-xl border border-[#7D967E]/20 flex justify-between items-center">
                                  <span className="font-bold text-[#202522]">
                                    {item.name} <span className="text-[#F47B20] font-semibold">x{item.quantity}</span>
                                  </span>
                                  <span className="text-[#183A2A] font-mono font-bold">₹{item.price * item.quantity}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Footer Info */}
                          <div className="flex justify-between items-center pt-2 text-xs text-[#7D967E] font-semibold border-t border-[#7D967E]/20">
                            <span>Payment: <strong className="text-[#183A2A]">{order.paymentMethod || 'UPI'}</strong> (PAID)</span>
                            <div className="flex items-center gap-4">
                              <span className="text-sm font-mono font-black text-[#F47B20]">
                                Total: ₹{order.totalAmount || order.items?.reduce((a, b) => a + b.price * b.quantity, 0)}
                              </span>
                              <span className="text-[#183A2A] font-bold text-xs flex items-center gap-1 hover:underline">
                                View Details &rarr;
                              </span>
                            </div>
                          </div>
                        </ThreeDSpatialCard>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: PROFILE DETAILS */}
            {activeTab === 'profile' && (
              <div className="card-mhp-white p-6 sm:p-8 rounded-3xl space-y-6">
                <div className="flex items-center justify-between border-b border-[#7D967E]/20 pb-4">
                  <div>
                    <h2 className="font-display font-bold text-2xl text-[#183A2A]">Personal Profile Details</h2>
                    <p className="text-xs text-[#7D967E]">Manage your account details</p>
                  </div>
                  {!isEditingProfile && (
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="btn-mhp-secondary text-xs py-2 px-4"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit Details</span>
                    </button>
                  )}
                </div>

                {!isEditingProfile ? (
                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="text-[#7D967E] font-bold block mb-1">Full Name:</label>
                      <div className="p-3.5 bg-[#FFF7E8] rounded-xl border border-[#7D967E]/30 font-bold text-[#202522] text-sm">
                        {user?.name || 'Customer Name'}
                      </div>
                    </div>

                    <div>
                      <label className="text-[#7D967E] font-bold block mb-1">Email Address:</label>
                      <div className="p-3.5 bg-[#FFF7E8] rounded-xl border border-[#7D967E]/30 font-bold text-[#202522] text-sm">
                        {user?.email || 'Not provided'}
                      </div>
                    </div>

                    <div>
                      <label className="text-[#7D967E] font-bold block mb-1">Mobile Number:</label>
                      <div className="p-3.5 bg-[#FFF7E8] rounded-xl border border-[#7D967E]/30 font-bold text-[#202522] text-sm">
                        {user?.phone || 'Not provided'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                    <div>
                      <label className="text-[#7D967E] font-bold block mb-1">Full Name:</label>
                      <input
                        type="text"
                        required
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="input-mhp w-full"
                      />
                    </div>

                    <div>
                      <label className="text-[#7D967E] font-bold block mb-1">Email Address:</label>
                      <input
                        type="email"
                        required
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="input-mhp w-full"
                      />
                    </div>

                    <div>
                      <label className="text-[#7D967E] font-bold block mb-1">Mobile Number:</label>
                      <input
                        type="text"
                        required
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="input-mhp w-full"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-[#7D967E]/20">
                      <button
                        type="submit"
                        disabled={profileUpdating}
                        className="btn-mhp-primary text-xs py-2.5 px-5"
                      >
                        {profileUpdating ? 'Saving Changes...' : 'Save Profile Details'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="btn-mhp-outline text-xs py-2.5 px-4"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB 3: CHANGE PASSWORD */}
            {activeTab === 'password' && (
              <div className="card-mhp-white p-6 sm:p-8 rounded-3xl space-y-5 max-w-lg">
                <div className="border-b border-[#7D967E]/20 pb-3">
                  <h2 className="font-display font-bold text-2xl text-[#183A2A]">Change Account Password</h2>
                  <p className="text-xs text-[#7D967E]">Update your login security credentials</p>
                </div>

                <form onSubmit={handlePasswordChangeSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="text-[#7D967E] font-bold block mb-1">Current Password:</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="input-mhp w-full"
                    />
                  </div>

                  <div>
                    <label className="text-[#7D967E] font-bold block mb-1">New Password:</label>
                    <input
                      type="password"
                      required
                      placeholder="At least 6 characters"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="input-mhp w-full"
                    />
                  </div>

                  <div>
                    <label className="text-[#7D967E] font-bold block mb-1">Confirm New Password:</label>
                    <input
                      type="password"
                      required
                      placeholder="Re-enter new password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="input-mhp w-full"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={passwordUpdating}
                    className="btn-mhp-primary text-xs w-full py-3"
                  >
                    {passwordUpdating ? 'Updating Password...' : 'Update Password'}
                  </button>
                </form>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Order Details Modal for Real Orders */}
      {selectedOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#7D967E]/30 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedOrderModal(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-[#FFF7E8] text-[#183A2A] hover:bg-[#183A2A] hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1 pt-2">
              <span className="px-3 py-1 rounded-full bg-[#183A2A]/10 text-[#183A2A] text-[11px] font-extrabold uppercase border border-[#7D967E]/30">
                Official Order Receipt
              </span>
              <h3 className="font-display font-bold text-2xl text-[#183A2A]">
                Order #{selectedOrderModal.billingNumber || selectedOrderModal._id?.slice(-6).toUpperCase()}
              </h3>
              <p className="text-xs text-[#7D967E]">
                Pickup Point: <strong className="text-[#202522]">{selectedOrderModal.pickupPoint || 'N Block Counter'}</strong>
              </p>
            </div>

            {/* Items Summary */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#7D967E] uppercase block">Item Details</span>
              <div className="bg-[#FFF7E8] rounded-xl p-4 border border-[#7D967E]/20 space-y-2 text-xs">
                {(selectedOrderModal.items || []).map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-[#202522]">
                      {it.quantity}x {it.name}
                    </span>
                    <span className="font-mono text-[#F47B20] font-bold">₹{it.price * it.quantity}</span>
                  </div>
                ))}
                <div className="border-t border-[#7D967E]/30 pt-2 flex justify-between items-center text-sm font-bold">
                  <span className="text-[#183A2A]">Total Amount Paid</span>
                  <span className="text-[#F47B20] font-mono">
                    ₹{selectedOrderModal.totalAmount || selectedOrderModal.items?.reduce((a, b) => a + b.price * b.quantity, 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-2">
              {selectedOrderModal.status !== 'ORDER RECEIVED' && selectedOrderModal.status !== 'COMPLETED' && (
                <button
                  onClick={(e) => handleMarkReceived(selectedOrderModal._id, e)}
                  className="btn-mhp-primary text-xs py-3 flex-1"
                >
                  Confirm Pickup & Received
                </button>
              )}
              <button
                onClick={() => setSelectedOrderModal(null)}
                className="btn-mhp-secondary text-xs py-3 flex-1"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CustomerProfile;
