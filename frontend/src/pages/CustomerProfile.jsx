import React, { useEffect, useState } from 'react';
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
  MapPin, 
  ShieldCheck,
  PackageCheck,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

const CustomerProfile = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'profile' | 'password'
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Change Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordUpdating, setPasswordUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await api.get('/future-menu/orders');
      // Filter orders for current student if studentId is present
      const studentOrders = res.data.filter(order => 
        order.studentPhone === user?.phone || 
        order.studentId === user?._id || 
        order.studentId === user?.studentId
      );
      setOrders(studentOrders.length > 0 ? studentOrders : res.data.slice(0, 5));
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleMarkReceived = async (orderId) => {
    try {
      await api.patch(`/future-menu/orders/${orderId}/status`, { status: 'ORDER RECEIVED' });
      showToast('success', 'Order status updated to ORDER RECEIVED');
      fetchOrders();
    } catch (err) {
      console.error('Failed to update order status:', err);
      showToast('error', 'Failed to update order status');
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

  return (
    <div className="bg-[#0D0B0C] text-[#F4ECE4] min-h-screen py-10 pb-32 preserve-3d">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Profile Header Banner */}
        <div className="bg-[#171315] p-6 sm:p-8 rounded-3xl border border-[#3A1822] shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#C96F4F] text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-[#C96F4F]/40">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#F4ECE4]">
                  {user?.name || 'VFSTR Student'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#3A1822] text-[#C96F4F] text-[10px] font-extrabold uppercase border border-[#3A1822]">
                  VFSTR Student
                </span>
              </div>
              <p className="text-xs text-[#B9A9A2] mt-0.5">
                {user?.email || 'student@vignan.ac.in'} • Phone: {user?.phone || '9123456789'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto">
            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl bg-[#0D0B0C] text-rose-300 border border-rose-900/60 text-xs font-bold hover:bg-rose-950/60 transition-all flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Profile Tabs Navigation */}
        <div className="flex items-center gap-2 bg-[#171315] p-1.5 rounded-2xl border border-[#3A1822]">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-[#C96F4F] text-white shadow-md'
                : 'text-[#B9A9A2] hover:text-[#F4ECE4]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>My Orders ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-[#C86F4D] text-white shadow-md'
                : 'text-[#C8BDB6] hover:text-[#F4ECE4]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Information</span>
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'password'
                ? 'bg-[#C86F4D] text-white shadow-md'
                : 'text-[#C8BDB6] hover:text-[#F4ECE4]'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Change Password</span>
          </button>
        </div>

        {/* Tab 1: My Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="font-display font-bold text-2xl text-[#F4ECE4]">Order History & Tokens</h2>

            {loadingOrders ? (
              <LoadingSkeleton count={3} />
            ) : orders.length === 0 ? (
              <div className="bg-[#291620] p-10 text-center rounded-3xl border border-[#4A1F31] space-y-2">
                <ShoppingBag className="w-10 h-10 text-[#C8BDB6] mx-auto" />
                <h3 className="font-bold text-[#F4ECE4]">No Orders Placed Yet</h3>
                <p className="text-xs text-[#C8BDB6]">Your pre-ordered parcel takeaway tokens will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const isReceived = order.status === 'ORDER RECEIVED';
                  return (
                    <ThreeDSpatialCard
                      key={order._id}
                      maxTilt={4}
                      scale={1.01}
                      className="p-6 rounded-3xl space-y-4 border border-[#4A1F31]"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#4A1F31] pb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-[#C8BDB6] font-bold uppercase">BILLING NUMBER:</span>
                            <span className="font-mono font-black text-lg text-[#C86F4D] tracking-wider">
                              {order.billingNumber || order._id?.slice(-6).toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs text-[#C8BDB6]">
                            Placed on {new Date(order.createdAt || Date.now()).toLocaleDateString()} • Pickup at <strong>{order.pickupPoint || 'N Block'}</strong>
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                            isReceived
                              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                              : 'bg-amber-950/80 text-amber-300 border-amber-800'
                          }`}>
                            {order.status || 'ORDER CONFIRMED'}
                          </span>

                          {!isReceived && (
                            <button
                              onClick={() => handleMarkReceived(order._id)}
                              className="btn-mhp-primary text-xs py-1.5 px-3"
                            >
                              <PackageCheck className="w-3.5 h-3.5" />
                              <span>Received Order</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Items Summary */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-[#C8BDB6] uppercase block">Ordered Items:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {(order.items || []).map((item, idx) => (
                            <div key={idx} className="bg-[#121113] p-2.5 rounded-xl border border-[#4A1F31] flex justify-between items-center">
                              <span className="font-bold text-[#F4ECE4]">{item.name}</span>
                              <span className="text-[#C86F4D] font-mono font-bold">x{item.quantity} • ₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2 text-xs text-[#C8BDB6] font-semibold">
                        <span>Payment Method: <strong>{order.paymentMethod || 'UPI'}</strong> (PAID)</span>
                        <span className="text-sm font-mono font-black text-[#C86F4D]">Total: ₹{order.totalAmount || order.items?.reduce((a, b) => a + b.price * b.quantity, 0)}</span>
                      </div>
                    </ThreeDSpatialCard>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Profile Information */}
        {activeTab === 'profile' && (
          <div className="bg-[#291620] p-8 rounded-3xl border border-[#4A1F31] max-w-xl space-y-5">
            <h2 className="font-display font-bold text-2xl text-[#F4ECE4]">Student Account Information</h2>
            <div className="space-y-4 text-xs">
              <div>
                <label className="text-[#C8BDB6] font-bold block mb-1">Full Name:</label>
                <div className="p-3 bg-[#121113] rounded-xl border border-[#4A1F31] font-bold text-[#F4ECE4]">
                  {user?.name || 'Student Name'}
                </div>
              </div>

              <div>
                <label className="text-[#C8BDB6] font-bold block mb-1">VFSTR Email Address:</label>
                <div className="p-3 bg-[#121113] rounded-xl border border-[#4A1F31] font-bold text-[#F4ECE4]">
                  {user?.email || 'student@vignan.ac.in'}
                </div>
              </div>

              <div>
                <label className="text-[#C8BDB6] font-bold block mb-1">Mobile Phone Number:</label>
                <div className="p-3 bg-[#121113] rounded-xl border border-[#4A1F31] font-bold text-[#F4ECE4]">
                  {user?.phone || '9123456789'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Change Password */}
        {activeTab === 'password' && (
          <div className="bg-[#291620] p-8 rounded-3xl border border-[#4A1F31] max-w-md space-y-5">
            <h2 className="font-display font-bold text-2xl text-[#F4ECE4]">Change Account Password</h2>
            
            <form onSubmit={handlePasswordChangeSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-[#C8BDB6] font-bold block mb-1">Current Password:</label>
                <input
                  type="password"
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full bg-[#121113] border border-[#4A1F31] text-[#F4ECE4] rounded-xl p-3 font-medium focus:outline-none focus:border-[#C86F4D]"
                />
              </div>

              <div>
                <label className="text-[#C8BDB6] font-bold block mb-1">New Password:</label>
                <input
                  type="password"
                  required
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full bg-[#121113] border border-[#4A1F31] text-[#F4ECE4] rounded-xl p-3 font-medium focus:outline-none focus:border-[#C86F4D]"
                />
              </div>

              <div>
                <label className="text-[#C8BDB6] font-bold block mb-1">Confirm New Password:</label>
                <input
                  type="password"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full bg-[#121113] border border-[#4A1F31] text-[#F4ECE4] rounded-xl p-3 font-medium focus:outline-none focus:border-[#C86F4D]"
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
  );
};

export default CustomerProfile;
