import React, { useEffect, useState, useRef } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { 
  Receipt, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  User, 
  Phone, 
  RotateCw, 
  Search, 
  Filter, 
  Eye, 
  X, 
  Truck, 
  Utensils, 
  CreditCard,
  Tag,
  AlertCircle,
  Sparkles
} from 'lucide-react';

const AdminBillingCounter = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [orderingSlot, setOrderingSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newOrderCount, setNewOrderCount] = useState(0);

  const prevOrderIdsRef = useRef(new Set());

  useEffect(() => {
    fetchBillingData();
    // 5-second lightweight polling interval for real-time incoming orders
    const interval = setInterval(() => {
      fetchBillingData(true);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchBillingData = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);

      const [ordersRes, slotRes] = await Promise.all([
        api.get('/future-menu/admin/orders').catch(() => ({ data: [] })),
        api.get('/ordering-slot').catch(() => null)
      ]);

      const fetchedOrders = ordersRes.data || [];
      if (slotRes?.data) setOrderingSlot(slotRes.data);

      // Detect new incoming orders for visual notification
      const currentIds = new Set(fetchedOrders.map(o => o._id));
      if (prevOrderIdsRef.current.size > 0) {
        let freshCount = 0;
        fetchedOrders.forEach(o => {
          if (!prevOrderIdsRef.current.has(o._id)) {
            freshCount++;
          }
        });
        if (freshCount > 0) {
          setNewOrderCount(prev => prev + freshCount);
          showToast('info', `${freshCount} new order(s) arrived at the Billing Counter!`);
        }
      }
      prevOrderIdsRef.current = currentIds;

      setOrders(fetchedOrders);
    } catch (err) {
      console.error('Error fetching billing counter data:', err);
    } fontFinally: {
      if (!isBackground) setLoading(false);
    }
  };

  const handleToggleBillingStatus = async (orderId, currentStatus) => {
    const nextStatus = currentStatus === 'BILLED' ? 'NEW' : 'BILLED';
    try {
      await api.put(`/future-menu/admin/orders/${orderId}/billing-status`, { billingStatus: nextStatus });
      showToast('success', `Order billing status updated to ${nextStatus}`);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, billingStatus: nextStatus } : o));
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(prev => ({ ...prev, billingStatus: nextStatus }));
      }
    } catch (err) {
      console.error('Failed to update billing status:', err);
      showToast('error', 'Failed to update billing status');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/future-menu/admin/orders/${orderId}/status`, { status: newStatus });
      showToast('success', `Order status updated to ${newStatus}`);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
      showToast('error', 'Failed to update order status');
    }
  };

  // Filtering
  const filteredOrders = orders.filter(ord => {
    const matchesSearch = searchQuery === '' ||
      (ord.billingNumber && ord.billingNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ord.orderNumber && ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ord.customerName && ord.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ord.customerPhone && ord.customerPhone.includes(searchQuery));

    let matchesTab = true;
    if (activeTab === 'BILLED') matchesTab = (ord.billingStatus || 'BILLED') === 'BILLED';
    else if (activeTab === 'Delivery') matchesTab = ord.orderType === 'Parcel' || ord.orderType === 'Delivery';
    else if (activeTab === 'Dining') matchesTab = ord.orderType !== 'Parcel' && ord.orderType !== 'Delivery';

    return matchesSearch && matchesTab;
  });

  const totalBilledOrders = orders.length;
  const receivedConfirmationsTotal = orders.filter(o => o.orderReceived).length;

  const getOrderStatusStyle = (st) => {
    switch (st) {
      case 'PLACED':
        return 'bg-[#C86B45]/15 text-[#C86B45] border-[#C86B45]/30 font-extrabold';
      case 'CONFIRMED':
        return 'bg-[#18251F]/15 text-[#18251F] border-[#18251F]/30 font-extrabold';
      case 'PREPARING':
        return 'bg-amber-500/15 text-amber-800 border-amber-500/30 font-extrabold';
      case 'READY_FOR_PICKUP':
        return 'bg-emerald-500/15 text-emerald-800 border-emerald-500/30 font-extrabold';
      case 'COMPLETED':
        return 'bg-slate-500/15 text-slate-800 border-slate-500/30 font-bold';
      default:
        return 'bg-[#F6F2E9] text-[#73766F] border-[#D9D1C3]';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* ================= HEADER & LIVE STATS ================= */}
      <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#D9D1C3] shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#D9D1C3] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#C86B45] uppercase tracking-wider mb-1">
              <Receipt className="w-4 h-4" />
              Physical Food Counter Operations
            </div>
            <h1 className="font-extrabold text-2xl sm:text-3xl text-[#202522]">
              MHP Billing Counter
            </h1>
            <p className="text-xs text-[#73766F] mt-0.5">
              Live Food Counter & Incoming Orders Terminal — Near N Block, VFSTR Campus
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { setNewOrderCount(0); fetchBillingData(); }}
              className="px-3.5 py-2 rounded-xl bg-[#F6F2E9] hover:bg-[#EAE2D3] text-[#202522] text-xs font-bold flex items-center gap-2 border border-[#D9D1C3] transition-all cursor-pointer"
            >
              <RotateCw className="w-4 h-4 text-[#C86B45]" />
              <span>Refresh (Live 5s)</span>
            </button>
          </div>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="bg-[#F6F2E9] p-4 rounded-xl border border-[#D9D1C3] space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-[#73766F] tracking-wider block">Active Ordering Window</span>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${orderingSlot?.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              <strong className="text-sm font-extrabold text-[#202522]">
                {orderingSlot?.isOpen ? 'ORDERING OPEN' : 'ORDERING CLOSED'}
              </strong>
            </div>
            <span className="text-[10px] text-[#73766F] block">{orderingSlot?.orderingWindow || '9:30 AM – 10:30 AM'}</span>
          </div>

          <div className="bg-[#F6F2E9] p-4 rounded-xl border border-[#D9D1C3] space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-[#73766F] tracking-wider block">TOTAL BILLED ORDERS</span>
            <div className="text-2xl font-black text-[#18251F] flex items-center gap-2">
              <span>{totalBilledOrders}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-800 border border-emerald-500/30 uppercase">
                BILLED
              </span>
            </div>
          </div>

          <div className="bg-[#F6F2E9] p-4 rounded-xl border border-[#D9D1C3] space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-[#73766F] tracking-wider block">Customer Receipt Confirmed</span>
            <div className="text-2xl font-black text-[#C86B45] flex items-center gap-2">
              <span>{receivedConfirmationsTotal}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-800 border border-emerald-500/30">
                ✓ RECEIVED
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ================= CONTROLS & FILTER BAR ================= */}
      <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#D9D1C3] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none">
          {[
            { id: 'All', label: `All Billed Orders (${totalBilledOrders})` },
            { id: 'Delivery', label: 'Delivery Parcel' },
            { id: 'Dining', label: 'Dining Counter' },
            { id: 'BILLED', label: 'Successfully Billed' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#18251F] text-[#F8F5ED] shadow-xs'
                  : 'bg-[#F6F2E9] text-[#73766F] hover:text-[#202522] border border-[#D9D1C3]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#73766F] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Bill No (MHP-2026...), Order No, Student..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#F6F2E9] border border-[#D9D1C3] text-[#202522] text-xs font-semibold placeholder-[#73766F] focus:outline-none focus:border-[#C86B45]"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#73766F]">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

      {/* ================= INCOMING ORDERS CARDS GRID ================= */}
      {loading ? (
        <LoadingSkeleton count={3} height="h-64" />
      ) : filteredOrders.length === 0 ? (
        <div className="bg-[#FFFFFF] p-12 text-center rounded-2xl border border-[#D9D1C3] space-y-3 text-[#73766F] shadow-xs">
          <Receipt className="w-12 h-12 text-[#C86B45]/40 mx-auto" />
          <h3 className="text-lg font-extrabold text-[#202522]">No incoming orders matching "{activeTab}"</h3>
          <p className="text-xs text-[#73766F]">
            Orders submitted by students during the active 9:30 AM – 10:30 AM slot will automatically appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOrders.map((ord) => {
            const isBilled = ord.billingStatus === 'BILLED';
            const isReceived = ord.orderReceived === true;
            const isDelivery = ord.orderType === 'Parcel';
            const orderTimeStr = new Date(ord.placedAt || ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const orderDateStr = new Date(ord.placedAt || ord.createdAt).toLocaleDateString();

            return (
              <div 
                key={ord._id} 
                className="bg-[#FFFFFF] rounded-2xl border-2 border-[#D9D1C3] transition-all shadow-xs flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                <div className="p-5 sm:p-6 space-y-4">
                  
                  {/* CARD HEADER: BILLING NUMBER & ORDER ID */}
                  <div className="flex items-start justify-between gap-3 border-b border-[#D9D1C3] pb-4">
                    <div>
                      <span className="text-[10px] font-extrabold text-[#73766F] uppercase tracking-widest block">
                        BILLING NUMBER
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-mono font-black text-[#202522] tracking-wide select-all">
                        {ord.billingNumber || `MHP-BILL-${ord.orderNumber}`}
                      </h2>
                      <div className="flex items-center gap-2 pt-1 text-xs text-[#73766F]">
                        <span className="font-bold text-[#202522]">Order ID: #{ord.orderNumber}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3.5 h-3.5 text-[#C86B45]" />
                          {orderTimeStr} ({orderDateStr})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* STATUSES BAR: BILLING STATUS, ORDER STATUS, CUSTOMER CONFIRMATION */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    
                    {/* 1. BILLING STATUS */}
                    <div className="bg-[#F6F2E9] p-2 rounded-xl border border-[#D9D1C3]">
                      <span className="text-[9px] font-bold text-[#73766F] uppercase block">Billing</span>
                      <strong className="text-xs font-black text-emerald-700 block mt-0.5 uppercase">
                        BILLED
                      </strong>
                    </div>

                    {/* 2. ORDER STATUS */}
                    <div className="bg-[#F6F2E9] p-2 rounded-xl border border-[#D9D1C3]">
                      <span className="text-[9px] font-bold text-[#73766F] uppercase block">Kitchen Status</span>
                      <strong className={`text-xs font-extrabold block mt-0.5 px-1 rounded-md border ${getOrderStatusStyle(ord.status)}`}>
                        {ord.status === 'READY_FOR_PICKUP' ? 'READY' : ord.status}
                      </strong>
                    </div>

                    {/* 3. CUSTOMER CONFIRMATION */}
                    <div className="bg-[#F6F2E9] p-2 rounded-xl border border-[#D9D1C3]">
                      <span className="text-[9px] font-bold text-[#73766F] uppercase block">Customer Receipt</span>
                      <strong className={`text-[11px] font-bold block mt-0.5 ${isReceived ? 'text-emerald-700 font-black' : 'text-[#73766F]'}`}>
                        {isReceived ? '✓ ORDER RECEIVED' : 'Not Received'}
                      </strong>
                      {isReceived && ord.orderReceivedAt && (
                        <span className="text-[9px] font-bold text-emerald-800 block">
                          {new Date(ord.orderReceivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>

                  </div>

                  {/* STUDENT & CONTACT INFO */}
                  <div className="bg-[#F6F2E9] p-3.5 rounded-xl border border-[#D9D1C3] grid grid-cols-3 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#C86B45] shrink-0" />
                      <div className="truncate">
                        <span className="text-[10px] text-[#73766F] uppercase font-bold block">Student</span>
                        <strong className="text-[#202522] font-extrabold truncate block">{ord.customerName}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#C86B45] shrink-0" />
                      <div className="truncate">
                        <span className="text-[10px] text-[#73766F] uppercase font-bold block">Contact / Roll</span>
                        <strong className="text-[#202522] font-bold truncate block">{ord.customerPhone} ({ord.studentId || 'N/A'})</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#C86B45] shrink-0" />
                      <div className="truncate">
                        <span className="text-[10px] text-[#73766F] uppercase font-bold block">Pickup Point</span>
                        <strong className="text-[#C86B45] font-black truncate block">{ord.pickupPoint || 'N Block'}</strong>
                      </div>
                    </div>
                  </div>

                  {/* ORDER ITEMS LIST */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-xs font-bold text-[#202522]">
                      <span className="uppercase tracking-wider">Ordered Items ({ord.items ? ord.items.reduce((a, b) => a + (b.quantity || 1), 0) : 0}):</span>
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${
                        isDelivery
                          ? 'bg-[#C86B45]/15 text-[#C86B45] border-[#C86B45]/30'
                          : 'bg-[#18251F]/15 text-[#18251F] border-[#18251F]/30'
                      }`}>
                        {isDelivery ? '📦 Delivery' : '🎒 Dining'}
                      </span>
                    </div>

                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 scrollbar-thin">
                      {ord.items && ord.items.map((item, idx) => (
                        <div key={idx} className="bg-[#F6F2E9] px-3 py-2 rounded-lg border border-[#D9D1C3] flex items-center justify-between text-xs">
                          <span className="text-[#202522] font-semibold">
                            <strong className="text-[#C86B45] font-extrabold mr-1.5">{item.quantity}×</strong>
                            {item.name} {item.selectedOptionLabel ? `(${item.selectedOptionLabel})` : ''}
                          </span>
                          <span className="text-[#202522] font-bold font-mono">
                            ₹{(item.unitPrice || item.price || 0) * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* FINANCIAL BREAKDOWN TOTALS */}
                  <div className="bg-[#18251F] text-[#F8F5ED] p-4 rounded-xl space-y-1.5 text-xs">
                    <div className="flex justify-between text-[#DDD7CD]">
                      <span>Subtotal:</span>
                      <span className="font-bold">₹ {ord.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-[#DDD7CD]">
                      <span>Parcel Charge:</span>
                      <span className="font-bold text-[#C86B45]">₹ {ord.parcelCharge || 0}</span>
                    </div>
                    <div className="flex justify-between text-base font-extrabold text-[#C86B45] pt-1.5 border-t border-[#383633]">
                      <span>TOTAL AMOUNT:</span>
                      <span className="font-mono font-black text-lg text-[#F8F5ED]">₹ {ord.total || ord.totalAmount}</span>
                    </div>
                  </div>

                </div>

                {/* CARD FOOTER ACTIONS */}
                <div className="bg-[#F6F2E9] p-4 border-t border-[#D9D1C3] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                    <Receipt className="w-4 h-4 text-emerald-700" />
                    <span>✓ AUTOMATICALLY BILLED</span>
                  </div>

                  {/* Advance Kitchen Order Status & Details */}
                  <div className="flex items-center gap-2">
                    <select
                      value={ord.status}
                      onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                      className="px-3 py-2 rounded-xl text-xs font-bold bg-[#FFFFFF] border border-[#D9D1C3] text-[#202522] cursor-pointer focus:outline-none focus:border-[#C86B45]"
                    >
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="PREPARING">PREPARING</option>
                      <option value="READY_FOR_PICKUP">READY FOR PICKUP</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>

                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="px-3 py-2 rounded-xl bg-[#18251F] text-[#F8F5ED] hover:bg-[#202522] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#C86B45]" />
                      <span>Details</span>
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ================= ORDER DETAILS MODAL ================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#131211]/80 backdrop-blur-xs">
          <div className="max-w-lg w-full bg-[#FFFFFF] border border-[#D9D1C3] rounded-2xl p-6 sm:p-7 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[#D9D1C3] pb-3">
              <div>
                <span className="text-[10px] font-extrabold text-[#C86B45] uppercase tracking-wider block">Order Details</span>
                <h2 className="text-xl font-bold text-[#202522]">Order #{selectedOrder.orderNumber}</h2>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-[#73766F] hover:text-[#202522]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Billing Record Summary */}
            <div className="bg-[#18251F] text-[#F8F5ED] p-4 rounded-xl text-center space-y-1">
              <span className="text-[10px] font-bold text-[#C86B45] uppercase tracking-widest block">Official Billing Number</span>
              <div className="text-2xl font-mono font-black text-[#F8F5ED] tracking-wider select-all">
                {selectedOrder.billingNumber || `MHP-BILL-${selectedOrder.orderNumber}`}
              </div>
              <p className="text-[11px] text-[#DDD7CD]">
                Customer Confirmation: <strong className={selectedOrder.orderReceived ? 'text-emerald-400 font-extrabold' : 'text-[#DDD7CD]'}>
                  {selectedOrder.orderReceived ? '✓ ORDER RECEIVED' : 'NOT CONFIRMED'}
                </strong>
              </p>
            </div>

            {/* Customer & Order Metadata */}
            <div className="bg-[#F6F2E9] p-4 rounded-xl border border-[#D9D1C3] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#73766F]">Student Name:</span>
                <strong className="text-[#202522]">{selectedOrder.customerName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#73766F]">Mobile Contact:</span>
                <strong className="text-[#202522]">{selectedOrder.customerPhone}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#73766F]">Student Roll No / Dept:</span>
                <strong className="text-[#202522]">{selectedOrder.studentId || 'N/A'}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#73766F]">Pickup Point:</span>
                <strong className="text-[#202522]">{selectedOrder.pickupLocation}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#73766F]">Payment Method:</span>
                <strong className="text-[#C86B45]">{selectedOrder.paymentMethod || selectedOrder.paymentMode || 'UPI'}</strong>
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-[#202522] uppercase tracking-wider text-[11px]">Itemized Items List:</h4>
              <div className="space-y-1.5">
                {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="bg-[#F6F2E9] p-2.5 rounded-lg border border-[#D9D1C3] flex items-center justify-between">
                    <span>{item.quantity} × {item.name} {item.selectedOptionLabel ? `(${item.selectedOptionLabel})` : ''}</span>
                    <span className="font-bold">₹ {(item.unitPrice || item.price || 0) * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="bg-[#F6F2E9] p-4 rounded-xl border border-[#D9D1C3] space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span>Food Subtotal:</span>
                <span className="font-bold">₹ {selectedOrder.subtotal}</span>
              </div>
              <div className="flex justify-between text-[#C86B45]">
                <span>Parcel Charges:</span>
                <span className="font-bold">₹ {selectedOrder.parcelCharge || 0}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-[#202522] pt-2 border-t border-[#D9D1C3]">
                <span>Total Paid Amount:</span>
                <span className="font-mono text-[#C86B45]">₹ {selectedOrder.total || selectedOrder.totalAmount}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="btn-mhp-primary w-full py-2.5 text-xs font-bold"
            >
              Close Details
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminBillingCounter;
