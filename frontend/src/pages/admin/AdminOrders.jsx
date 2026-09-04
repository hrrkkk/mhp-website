import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  User, 
  Phone, 
  RotateCw,
  ChefHat,
  Filter,
  Package,
  CreditCard,
  Trash2
} from 'lucide-react';

import { MHPCard, MHPButton, MHPBadge } from '../../components/admin/MHPAdminComponents';

const AdminOrders = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  const isMountedRef = React.useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    fetchOrders();

    const interval = setInterval(() => {
      if (isMountedRef.current) {
        fetchOrders(true);
      }
    }, 8000);

    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, []);

  const fetchOrders = async (isBackground = false) => {
    try {
      if (!isBackground && isMountedRef.current) setLoading(true);
      const res = await api.get('/future-menu/admin/orders');
      if (isMountedRef.current) {
        setOrders(res.data || []);
      }
    } catch (err) {
      console.warn('Failed to fetch admin orders:', err.message);
    } finally {
      if (!isBackground && isMountedRef.current) setLoading(false);
    }
  };

  const handleClearAllOrders = async () => {
    if (!window.confirm('Are you sure you want to clear all test orders and reset the live order list?')) {
      return;
    }
    try {
      await api.delete('/future-menu/admin/orders/clear-all');
      showToast('success', '🧹 All test orders cleared successfully!');
      setOrders([]);
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to clear test orders.');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/future-menu/admin/orders/${orderId}/status`, { status: newStatus });
      showToast('success', `Order status updated to ${newStatus}`);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      showToast('error', 'Failed to update order status');
    }
  };

  const filteredOrders = statusFilter === 'All' 
    ? orders 
    : orders.filter(o => o.status === statusFilter);

  const statuses = ['All', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'COMPLETED'];

  const getStatusBadgeVariant = (st) => {
    switch (st) {
      case 'PLACED':
      case 'Pending':
        return 'warning';
      case 'CONFIRMED':
      case 'Accepted':
        return 'orange';
      case 'PREPARING':
      case 'Preparing':
        return 'warning';
      case 'READY_FOR_PICKUP':
      case 'Ready':
        return 'success';
      case 'COMPLETED':
      case 'Completed':
        return 'green';
      default:
        return 'default';
    }
  };

  const todayYYYYMMDD = (() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  })();

  const todayOrdersList = orders.filter(o => {
    const rawDate = o.placedAt || o.createdAt;
    if (!rawDate) return false;
    const d = new Date(rawDate);
    if (isNaN(d.getTime())) return false;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dayStr = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dayStr}` === todayYYYYMMDD;
  });

  const validTodayOrders = todayOrdersList.filter(o => o.status !== 'FAILED' && o.status !== 'PENDING_PAYMENT');
  const todayOrdersCount = validTodayOrders.length;
  const todayRevenue = validTodayOrders.reduce((sum, o) => {
    const amt = Number(o.totalAmount !== undefined ? o.totalAmount : (o.total !== undefined ? o.total : (o.subtotal || 0) + (o.parcelCharge || 0)));
    return sum + amt;
  }, 0);
  const completedTodayCount = validTodayOrders.filter(o => o.status === 'COMPLETED' || o.status === 'DELIVERED').length;

  return (
    <div className="space-y-6 pb-16 text-[#202522]">
      
      {/* Header */}
      <MHPCard className="!p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-[#F47B20] uppercase tracking-widest mb-1">
              <ShoppingBag className="w-4 h-4 text-[#F47B20]" />
              LIVE ORDER OPERATIONS
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#183A2A]">
              Student Orders Manager
            </h1>
            <p className="text-xs text-[#7D967E] font-medium mt-0.5">
              Track student counter pickup orders, parcel requests, and live kitchen statuses
            </p>
          </div>

          <div className="flex items-center gap-2">
            <MHPButton
              onClick={handleClearAllOrders}
              variant="outline"
              size="sm"
              className="!border-red-300 !text-red-600 hover:!bg-red-50"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
              <span>Clear Test Data</span>
            </MHPButton>

            <MHPButton
              onClick={fetchOrders}
              variant="outline"
              size="sm"
            >
              <RotateCw className="w-4 h-4 text-[#F47B20]" />
              <span>Refresh Orders</span>
            </MHPButton>
          </div>
        </div>
      </MHPCard>

      {/* TODAY'S REVENUE & SUMMARY BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MHPCard className="!p-5">
          <span className="text-[10px] font-black text-[#7D967E] uppercase tracking-widest block">Today's Orders</span>
          <span className="text-3xl font-mono font-black text-[#183A2A]">{todayOrdersCount}</span>
        </MHPCard>
        <div className="bg-[#183A2A] p-5 rounded-2xl border border-[#183A2A] text-[#FFF7E8] shadow-md">
          <span className="text-[10px] font-black text-[#F47B20] uppercase tracking-widest block">Today's Revenue</span>
          <span className="text-3xl font-mono font-black text-[#FFF7E8]">₹ {todayRevenue.toLocaleString('en-IN')}</span>
        </div>
        <MHPCard className="!p-5">
          <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest block">Completed Today</span>
          <span className="text-3xl font-mono font-black text-emerald-800">{completedTodayCount}</span>
        </MHPCard>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#FFFFFF] p-3 rounded-2xl border-2 border-[#7D967E]/30 flex items-center gap-2 overflow-x-auto scrollbar-none shadow-xs">
        <Filter className="w-4 h-4 text-[#7D967E] shrink-0 ml-1 hidden sm:block" />
        {statuses.map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
              statusFilter === st
                ? 'bg-[#F47B20] text-white shadow-xs'
                : 'bg-[#FFF7E8] text-[#7D967E] hover:text-[#183A2A] border border-[#7D967E]/30'
            }`}
          >
            {st === 'READY_FOR_PICKUP' ? 'Ready' : st}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <LoadingSkeleton count={3} height="h-48" />
      ) : filteredOrders.length === 0 ? (
        <MHPCard className="!p-12 text-center text-[#7D967E]">
          <ChefHat className="w-10 h-10 text-[#F47B20]/60 mx-auto mb-2" />
          <h3 className="text-base font-extrabold text-[#183A2A]">No orders in "{statusFilter}" status</h3>
          <p className="text-xs text-[#7D967E] font-medium">New student orders placed via the website will appear here in real time.</p>
        </MHPCard>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((ord) => (
            <MHPCard key={ord._id} className="!p-5 sm:!p-6 hover:border-[#F47B20] transition-all">
              
              {/* Order Header Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#7D967E]/20 pb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-lg font-extrabold text-[#183A2A]">Order {ord.orderNumber}</span>
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-extrabold bg-[#183A2A] text-[#FFF7E8]">
                      Bill: {ord.billingNumber || `MHP-BILL-${ord.orderNumber}`}
                    </span>
                    <MHPBadge variant={getStatusBadgeVariant(ord.status)}>
                      {ord.status === 'READY_FOR_PICKUP' ? 'READY' : ord.status}
                    </MHPBadge>
                    <MHPBadge variant={ord.orderType === 'Parcel' ? 'warning' : 'default'}>
                      {ord.orderType || 'Pickup'}
                    </MHPBadge>
                    <MHPBadge variant={ord.orderReceived ? 'success' : 'default'}>
                      {ord.orderReceived ? '✓ ORDER RECEIVED' : 'NOT CONFIRMED'}
                    </MHPBadge>
                  </div>
                  <p className="text-xs text-[#7D967E] font-medium mt-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#7D967E]" />
                    <span>Created: {new Date(ord.placedAt || ord.createdAt).toLocaleString()}</span>
                  </p>
                </div>

                {/* Status Update Action Buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                  {[
                    { key: 'CONFIRMED', label: '✓ Order Placed' },
                    { key: 'PREPARING', label: '✓ Preparing' },
                    { key: 'READY_FOR_PICKUP', label: '→ Ready for Pickup' },
                    { key: 'COMPLETED', label: '○ Completed' }
                  ].map((st) => (
                    <button
                      key={st.key}
                      onClick={() => handleStatusChange(ord._id, st.key)}
                      disabled={ord.status === st.key}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all ${
                        ord.status === st.key
                          ? 'bg-[#183A2A] text-[#FFF7E8] border-[#183A2A]'
                          : 'bg-[#FFF7E8] text-[#7D967E] border-[#7D967E]/30 hover:text-[#183A2A] hover:bg-[#FFF7E8]/80 cursor-pointer'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Student & Delivery Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[#FFF7E8] p-3.5 rounded-xl border border-[#7D967E]/30">
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-[#F47B20] shrink-0" />
                  <div>
                    <span className="text-[#7D967E] block text-[10px] uppercase font-extrabold">Student</span>
                    <strong className="text-[#183A2A] font-extrabold">{ord.customerName}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#F47B20] shrink-0" />
                  <div>
                    <span className="text-[#7D967E] block text-[10px] uppercase font-extrabold">Contact / Phone</span>
                    <strong className="text-[#183A2A] font-extrabold">{ord.customerPhone} ({ord.studentId || 'N/A'})</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#F47B20] shrink-0" />
                  <div>
                    <span className="text-[#7D967E] block text-[10px] uppercase font-extrabold">Pickup Location</span>
                    <strong className="text-[#183A2A] font-extrabold">
                      {ord.orderMode === 'DINING' || ord.orderType === 'Dining'
                        ? 'Not applicable'
                        : (ord.pickupLocation || ord.pickupPoint || 'N BLOCK')}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Ordered Food Items */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-extrabold text-[#7D967E] uppercase tracking-wider">
                  Ordered Items ({ord.items ? ord.items.reduce((a, b) => a + (b.quantity || 1), 0) : 0}):
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {ord.items.map((item, idx) => (
                    <div key={idx} className="bg-[#FFF7E8] p-2.5 rounded-xl border border-[#7D967E]/30 flex items-center justify-between">
                      <span className="text-[#202522] font-semibold">
                        <strong className="text-[#F47B20] font-black">{item.quantity}x</strong> {item.name} {item.selectedOptionLabel ? `(${item.selectedOptionLabel})` : ''}
                      </span>
                      <span className="text-[#183A2A] font-extrabold">₹{item.unitPrice * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Footer Totals & Charges */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-[#7D967E]/20 text-xs gap-2">
                <div className="flex flex-wrap items-center gap-3 text-[#7D967E] font-medium">
                  <span>Payment: <strong className="text-[#183A2A] font-extrabold">{ord.paymentMethod || ord.paymentMode || 'UPI'}</strong></span>
                  <span>•</span>
                  <span>Payment Status: <strong className={ord.paymentStatus === 'PAID' ? 'text-emerald-700 font-extrabold' : 'text-[#F47B20] font-extrabold'}>{ord.paymentStatus || 'PAID'}</strong></span>
                  <span>•</span>
                  <span>Parcel Charge: <strong className="text-[#F47B20] font-extrabold">₹{ord.parcelCharge || 0}</strong></span>
                </div>
                <span className="text-base font-black text-[#F47B20]">Total: ₹ {ord.total || ord.totalAmount}</span>
              </div>

            </MHPCard>
          ))}
        </div>
      )}

    </div>
  );
};

export default AdminOrders;
