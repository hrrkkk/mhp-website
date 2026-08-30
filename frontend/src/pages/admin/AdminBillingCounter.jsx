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

import { MHPCard, MHPButton, MHPBadge } from '../../components/admin/MHPAdminComponents';

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
    } finally {
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

  return (
    <div className="space-y-6 pb-20 text-[#202522]">
      
      {/* HEADER & LIVE STATS */}
      <MHPCard className="!p-6 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#7D967E]/20 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-[#F47B20] uppercase tracking-widest mb-1">
              <Receipt className="w-4 h-4 text-[#F47B20]" />
              PHYSICAL COUNTER TERMINAL
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#183A2A]">
              MHP Billing Counter
            </h1>
            <p className="text-xs text-[#7D967E] font-medium mt-0.5">
              Live Food Counter & Incoming Orders Terminal — Near N Block, VFSTR Campus
            </p>
          </div>

          <div className="flex items-center gap-3">
            <MHPButton
              onClick={() => { setNewOrderCount(0); fetchBillingData(); }}
              variant="outline"
              size="sm"
            >
              <RotateCw className="w-4 h-4 text-[#F47B20]" />
              <span>Refresh (Live 5s)</span>
            </MHPButton>
          </div>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="bg-[#FFF7E8] p-4 rounded-xl border border-[#7D967E]/30 space-y-1">
            <span className="text-[10px] font-black uppercase text-[#7D967E] tracking-widest block">Active Ordering Window</span>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${orderingSlot?.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              <strong className="text-sm font-extrabold text-[#183A2A]">
                {orderingSlot?.isOpen ? 'ORDERING OPEN' : 'ORDERING CLOSED'}
              </strong>
            </div>
            <span className="text-[10px] text-[#7D967E] font-medium block">{orderingSlot?.orderingWindow || '9:30 AM – 10:30 AM'}</span>
          </div>

          <div className="bg-[#FFF7E8] p-4 rounded-xl border border-[#7D967E]/30 space-y-1">
            <span className="text-[10px] font-black uppercase text-[#7D967E] tracking-widest block">TOTAL BILLED ORDERS</span>
            <div className="text-2xl font-black text-[#183A2A] flex items-center gap-2">
              <span>{totalBilledOrders}</span>
              <MHPBadge variant="success">BILLED</MHPBadge>
            </div>
          </div>

          <div className="bg-[#FFF7E8] p-4 rounded-xl border border-[#7D967E]/30 space-y-1">
            <span className="text-[10px] font-black uppercase text-[#7D967E] tracking-widest block">Customer Receipt Confirmed</span>
            <div className="text-2xl font-black text-[#F47B20] flex items-center gap-2">
              <span>{receivedConfirmationsTotal}</span>
              <MHPBadge variant="orange">✓ RECEIVED</MHPBadge>
            </div>
          </div>

        </div>
      </MHPCard>

      {/* CONTROLS & FILTER BAR */}
      <div className="bg-[#FFFFFF] p-4 rounded-2xl border-2 border-[#7D967E]/30 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
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
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#183A2A] text-[#FFF7E8] shadow-xs'
                  : 'bg-[#FFF7E8] text-[#7D967E] hover:text-[#183A2A] border border-[#7D967E]/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#7D967E] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Bill No (MHP-2026...), Order No, Student..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FFF7E8] border border-[#7D967E]/30 text-[#183A2A] text-xs font-bold placeholder-[#7D967E]/60 focus:outline-none focus:border-[#F47B20]"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7D967E]">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

      {/* INCOMING ORDERS CARDS GRID */}
      {loading ? (
        <LoadingSkeleton count={3} height="h-64" />
      ) : filteredOrders.length === 0 ? (
        <MHPCard className="!p-12 text-center text-[#7D967E]">
          <Receipt className="w-12 h-12 text-[#F47B20]/50 mx-auto mb-2" />
          <h3 className="text-lg font-extrabold text-[#183A2A]">No incoming orders matching "{activeTab}"</h3>
          <p className="text-xs text-[#7D967E] font-medium">
            Orders submitted by students during the active 9:30 AM – 10:30 AM slot will automatically appear here.
          </p>
        </MHPCard>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOrders.map((ord) => {
            const isBilled = ord.billingStatus === 'BILLED';
            const isReceived = ord.orderReceived === true;
            const isDelivery = ord.orderType === 'Parcel';
            const orderTimeStr = new Date(ord.placedAt || ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const orderDateStr = new Date(ord.placedAt || ord.createdAt).toLocaleDateString();

            return (
              <MHPCard key={ord._id} className="!p-0 space-y-0 overflow-hidden flex flex-col justify-between">
                <div className="p-5 sm:p-6 space-y-4">
                  
                  {/* CARD HEADER: BILLING NUMBER & ORDER ID */}
                  <div className="flex items-start justify-between gap-3 border-b border-[#7D967E]/20 pb-4">
                    <div>
                      <span className="text-[10px] font-black text-[#7D967E] uppercase tracking-widest block">
                        BILLING NUMBER
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-mono font-black text-[#183A2A] tracking-wide select-all">
                        {ord.billingNumber || `MHP-BILL-${ord.orderNumber}`}
                      </h2>
                      <div className="flex items-center gap-2 pt-1 text-xs text-[#7D967E]">
                        <span className="font-extrabold text-[#183A2A]">Order ID: #{ord.orderNumber}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-semibold">
                          <Clock className="w-3 h-3 text-[#7D967E]" />
                          {orderTimeStr} ({orderDateStr})
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <MHPBadge variant={isBilled ? 'success' : 'warning'}>
                        {isBilled ? 'BILLED' : 'NEW'}
                      </MHPBadge>

                      <MHPBadge variant={isReceived ? 'orange' : 'default'}>
                        {isReceived ? '✓ RECEIVED' : 'NOT RECEIVED'}
                      </MHPBadge>
                    </div>
                  </div>

                  {/* CUSTOMER & PICKUP DETAILS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#FFF7E8] p-3.5 rounded-xl border border-[#7D967E]/30">
                    <div className="flex items-center gap-2.5">
                      <User className="w-4 h-4 text-[#F47B20] shrink-0" />
                      <div>
                        <span className="text-[#7D967E] block text-[10px] uppercase font-extrabold">Student Name</span>
                        <strong className="text-[#183A2A] font-extrabold">{ord.customerName}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-[#F47B20] shrink-0" />
                      <div>
                        <span className="text-[#7D967E] block text-[10px] uppercase font-extrabold">Phone / ID</span>
                        <strong className="text-[#183A2A] font-extrabold">{ord.customerPhone} ({ord.studentId || 'N/A'})</strong>
                      </div>
                    </div>
                  </div>

                  {/* ITEMS SUMMARY */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-[#7D967E] uppercase tracking-widest block">
                      ORDERED ITEMS ({ord.items ? ord.items.reduce((a, b) => a + (b.quantity || 1), 0) : 0})
                    </span>
                    <div className="space-y-1 text-xs">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between py-1 border-b border-[#7D967E]/10 last:border-0">
                          <span className="text-[#202522] font-semibold">
                            <strong className="text-[#F47B20] font-black">{item.quantity}x</strong> {item.name}
                          </span>
                          <span className="font-mono font-bold text-[#183A2A]">₹{item.unitPrice * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* CARD FOOTER */}
                <div className="p-4 bg-[#FFF7E8] border-t border-[#7D967E]/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#7D967E] font-black uppercase tracking-wider block">TOTAL AMOUNT</span>
                    <span className="text-xl font-mono font-black text-[#F47B20]">₹ {ord.total || ord.totalAmount}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MHPButton
                      onClick={() => handleToggleBillingStatus(ord._id, ord.billingStatus)}
                      variant={isBilled ? 'secondary' : 'primary'}
                      size="sm"
                    >
                      {isBilled ? 'Mark Unbilled' : 'Mark as Billed'}
                    </MHPButton>

                    <MHPButton
                      onClick={() => setSelectedOrder(ord)}
                      variant="outline"
                      size="sm"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#183A2A]" />
                      <span>Details</span>
                    </MHPButton>
                  </div>
                </div>

              </MHPCard>
            );
          })}
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border-2 border-[#7D967E]/40 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedOrder(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full bg-[#FFF7E8] text-[#7D967E] hover:text-[#183A2A]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <MHPBadge variant="orange">Detailed Billing Ticket</MHPBadge>
              <h3 className="font-mono font-black text-2xl text-[#183A2A]">
                {selectedOrder.billingNumber || `MHP-BILL-${selectedOrder.orderNumber}`}
              </h3>
              <p className="text-xs text-[#7D967E] font-medium">Placed: {new Date(selectedOrder.placedAt || selectedOrder.createdAt).toLocaleString()}</p>
            </div>

            <div className="space-y-2 text-xs border-y border-[#7D967E]/20 py-4">
              <div className="flex justify-between"><span className="text-[#7D967E] font-bold">Student Name:</span> <strong className="text-[#183A2A] font-extrabold">{selectedOrder.customerName}</strong></div>
              <div className="flex justify-between"><span className="text-[#7D967E] font-bold">Phone Number:</span> <strong className="text-[#183A2A] font-extrabold">{selectedOrder.customerPhone}</strong></div>
              <div className="flex justify-between"><span className="text-[#7D967E] font-bold">Student ID:</span> <strong className="text-[#183A2A] font-extrabold">{selectedOrder.studentId || 'N/A'}</strong></div>
              <div className="flex justify-between"><span className="text-[#7D967E] font-bold">Pickup Point:</span> <strong className="text-[#183A2A] font-extrabold">{selectedOrder.pickupLocation}</strong></div>
              <div className="flex justify-between"><span className="text-[#7D967E] font-bold">Payment Method:</span> <strong className="text-[#183A2A] font-extrabold">{selectedOrder.paymentMethod || 'UPI'}</strong></div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-black text-[#183A2A] uppercase tracking-wider">Ordered Items</h4>
              <div className="space-y-1.5 text-xs bg-[#FFF7E8] p-3 rounded-xl border border-[#7D967E]/30">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span><strong className="text-[#F47B20] font-black">{item.quantity}x</strong> {item.name}</span>
                    <span className="font-mono font-bold text-[#183A2A]">₹{item.unitPrice * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-extrabold text-[#183A2A]">Total Amount:</span>
              <span className="text-2xl font-mono font-black text-[#F47B20]">₹ {selectedOrder.total || selectedOrder.totalAmount}</span>
            </div>

            <MHPButton
              onClick={() => setSelectedOrder(null)}
              variant="primary"
              className="w-full"
            >
              Close Ticket
            </MHPButton>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminBillingCounter;
