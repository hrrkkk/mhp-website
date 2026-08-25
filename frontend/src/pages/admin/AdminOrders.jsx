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
  CreditCard
} from 'lucide-react';

const AdminOrders = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/future-menu/admin/orders');
      setOrders(res.data || []);
    } catch (err) {
      console.error('Failed to fetch admin orders:', err);
      showToast('error', 'Could not load student orders');
    } finally {
      setLoading(false);
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

  const getStatusBadgeStyle = (st) => {
    switch (st) {
      case 'PLACED':
      case 'Pending':
        return 'bg-[#B9684D]/10 text-[#B9684D] border-[#B9684D]/30';
      case 'CONFIRMED':
      case 'Accepted':
        return 'bg-[#D79A82]/20 text-[#202020] border-[#D79A82]/40';
      case 'PREPARING':
      case 'Preparing':
        return 'bg-amber-50 text-amber-900 border-amber-200';
      case 'READY_FOR_PICKUP':
      case 'Ready':
        return 'bg-[#5E8068]/15 text-[#5E8068] border-[#5E8068]/30';
      case 'COMPLETED':
      case 'Completed':
        return 'bg-[#77736D]/15 text-[#77736D] border-[#77736D]/30';
      default:
        return 'bg-[#F5F1E8] text-[#202020] border-[#DDD7CD]';
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
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#FFFFFF] p-6 rounded-xl border border-[#DDD7CD] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#B9684D] uppercase tracking-wider mb-1">
            <ShoppingBag className="w-4 h-4" />
            Live Orders Operations
          </div>
          <h1 className="font-bold text-2xl text-[#202020]">Student Orders Manager</h1>
          <p className="text-xs text-[#77736D] mt-0.5">
            Track student counter pickup orders, parcel requests, and live kitchen statuses
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="btn-mhp-outline text-xs flex items-center gap-2"
        >
          <RotateCw className="w-4 h-4 text-[#B9684D]" />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* TODAY'S REVENUE & SUMMARY BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#DDD7CD]">
          <span className="text-[10px] font-bold text-[#77736D] uppercase block">Today's Orders</span>
          <span className="text-2xl font-black text-[#202020]">{todayOrdersCount}</span>
        </div>
        <div className="bg-[#18251F] p-4 rounded-xl border border-[#18251F] text-[#F8F5ED]">
          <span className="text-[10px] font-bold text-[#C86B45] uppercase block">Today's Revenue</span>
          <span className="text-2xl font-black text-[#FFFFFF]">₹ {todayRevenue.toLocaleString('en-IN')}</span>
        </div>
        <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#DDD7CD]">
          <span className="text-[10px] font-bold text-[#5E8068] uppercase block">Completed Today</span>
          <span className="text-2xl font-black text-[#5E8068]">{completedTodayCount}</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#FFFFFF] p-3 rounded-xl border border-[#DDD7CD] flex items-center gap-2 overflow-x-auto scrollbar-none shadow-xs">
        <Filter className="w-4 h-4 text-[#77736D] shrink-0 ml-1 hidden sm:block" />
        {statuses.map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
              statusFilter === st
                ? 'bg-[#202020] text-white shadow-xs'
                : 'bg-[#F5F1E8] text-[#77736D] hover:text-[#202020] border border-[#DDD7CD]'
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
        <div className="bg-[#FFFFFF] p-12 text-center rounded-xl border border-[#DDD7CD] space-y-2 text-[#77736D] text-sm shadow-xs">
          <ChefHat className="w-10 h-10 text-[#B9684D]/50 mx-auto" />
          <h3 className="text-base font-bold text-[#202020]">No orders in "{statusFilter}" status</h3>
          <p className="text-xs text-[#77736D]">New student orders placed via the website will appear here in real time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((ord) => (
            <div key={ord._id} className="bg-[#FFFFFF] p-5 sm:p-6 rounded-xl border border-[#DDD7CD] hover:border-[#B9684D]/30 space-y-4 shadow-xs transition-all">
              
              {/* Order Header Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#DDD7CD] pb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-lg font-bold text-[#202020]">Order {ord.orderNumber}</span>
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-[#202020] text-[#F5F1E8] border border-[#383633]">
                      Bill: {ord.billingNumber || `MHP-BILL-${ord.orderNumber}`}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold uppercase border ${getStatusBadgeStyle(ord.status)}`}>
                      {ord.status === 'READY_FOR_PICKUP' ? 'READY' : ord.status}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase border ${
                      ord.orderType === 'Parcel' 
                        ? 'bg-amber-50 text-amber-900 border-amber-200' 
                        : 'bg-[#F5F1E8] text-[#202020] border-[#DDD7CD]'
                    }`}>
                      {ord.orderType || 'Pickup'}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold uppercase border ${
                      ord.orderReceived
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-[#F5F1E8] text-[#77736D] border-[#DDD7CD]'
                    }`}>
                      {ord.orderReceived ? '✓ ORDER RECEIVED' : 'NOT CONFIRMED'}
                    </span>
                  </div>
                  <p className="text-xs text-[#77736D] mt-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#77736D]" />
                    <span>Created: {new Date(ord.placedAt || ord.createdAt).toLocaleString()}</span>
                  </p>
                </div>

                {/* Status Update Action Buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                  {['CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'COMPLETED'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(ord._id, st)}
                      disabled={ord.status === st}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        ord.status === st
                          ? 'bg-[#5E8068] text-white border-[#5E8068]'
                          : 'bg-[#F5F1E8] text-[#77736D] border-[#DDD7CD] hover:text-[#202020] hover:bg-[#DDD7CD]'
                      }`}
                    >
                      {st === 'READY_FOR_PICKUP' ? 'Ready' : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Student & Delivery Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[#F5F1E8] p-3.5 rounded-lg border border-[#DDD7CD]">
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-[#B9684D] shrink-0" />
                  <div>
                    <span className="text-[#77736D] block text-[10px] uppercase font-bold">Student</span>
                    <strong className="text-[#202020]">{ord.customerName}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#B9684D] shrink-0" />
                  <div>
                    <span className="text-[#77736D] block text-[10px] uppercase font-bold">Contact / Phone</span>
                    <strong className="text-[#202020]">{ord.customerPhone} ({ord.studentId || 'N/A'})</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#B9684D] shrink-0" />
                  <div>
                    <span className="text-[#77736D] block text-[10px] uppercase font-bold">Pickup Point</span>
                    <strong className="text-[#202020]">{ord.pickupLocation}</strong>
                  </div>
                </div>
              </div>

              {/* Ordered Food Items */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-[#77736D] uppercase tracking-wider">Ordered Items ({ord.items ? ord.items.reduce((a, b) => a + (b.quantity || 1), 0) : 0}):</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {ord.items.map((item, idx) => (
                    <div key={idx} className="bg-[#F5F1E8] p-2.5 rounded-lg border border-[#DDD7CD] flex items-center justify-between">
                      <span className="text-[#202020] font-medium">
                        <strong className="text-[#B9684D] font-bold">{item.quantity}x</strong> {item.name} {item.selectedOptionLabel ? `(${item.selectedOptionLabel})` : ''}
                      </span>
                      <span className="text-[#202020] font-bold">₹{item.unitPrice * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Footer Totals & Charges */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-[#DDD7CD] text-xs gap-2">
                <div className="flex flex-wrap items-center gap-3 text-[#77736D]">
                  <span>Payment: <strong className="text-[#202020] font-semibold">{ord.paymentMethod || ord.paymentMode || 'UPI'}</strong></span>
                  <span>•</span>
                  <span>Payment Status: <strong className={ord.paymentStatus === 'PAID' ? 'text-[#5E8068] font-bold' : 'text-[#B9684D] font-bold'}>{ord.paymentStatus || 'PAID'}</strong></span>
                  <span>•</span>
                  <span>Parcel Charge: <strong className="text-[#B9684D]">₹{ord.parcelCharge || 0}</strong></span>
                </div>
                <span className="text-base font-bold text-[#B9684D]">Total: ₹ {ord.total || ord.totalAmount}</span>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default AdminOrders;
