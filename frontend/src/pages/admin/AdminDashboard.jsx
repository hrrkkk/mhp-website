import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  Sparkles, 
  ShoppingBag, 
  ShieldCheck,
  Plus,
  Mic,
  Globe,
  UtensilsCrossed,
  IndianRupee,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCw,
  Truck,
  Utensils,
  TrendingUp,
  Filter
} from 'lucide-react';

import AdminSlotTimingControl from '../../components/admin/AdminSlotTimingControl';
import AdminCredentialsControl from '../../components/admin/AdminCredentialsControl';
import { MHPCard, MHPButton, MHPBadge } from '../../components/admin/MHPAdminComponents';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Date selection state for Daily Orders & Revenue Tracking
  const getTodayYYYYMMDD = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(getTodayYYYYMMDD());
  const [salesData, setSalesData] = useState(null);
  const [salesLoading, setSalesLoading] = useState(false);

  const isTodaySelected = selectedDate === getTodayYYYYMMDD();

  useEffect(() => {
    fetchStats();
    fetchSalesMetrics(selectedDate);

    // Live update: Auto-poll every 5 seconds to keep counters live
    const pollInterval = setInterval(() => {
      fetchSalesMetrics(selectedDate, true);
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [selectedDate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSalesMetrics = async (dateStr, isSilent = false) => {
    try {
      if (!isSilent) setSalesLoading(true);
      const res = await api.get(`/admin/daily-sales?date=${dateStr}`);
      setSalesData(res.data);
    } catch (err) {
      console.error('Failed to fetch daily sales metrics:', err);
    } finally {
      if (!isSilent) setSalesLoading(false);
    }
  };

  const handleSelectToday = () => {
    const todayStr = getTodayYYYYMMDD();
    setSelectedDate(todayStr);
  };

  return (
    <div className="space-y-6 pb-16 text-[#202522]">
      
      {/* Admin Control Center Header */}
      <MHPCard className="!p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-[#F47B20] uppercase tracking-widest mb-1">
              <ShieldCheck className="w-4 h-4 text-[#F47B20]" />
              MHP CONTROL CENTER
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#183A2A]">
              Admin Dashboard & Revenue Analytics
            </h1>
            <p className="text-xs text-[#7D967E] font-medium mt-0.5">
              VFSTR Campus • Real-time ordering metrics, revenue reports, and cafeteria overview
            </p>
          </div>

          <div className="flex items-center gap-3">
            <MHPButton
              onClick={() => fetchSalesMetrics(selectedDate)}
              variant="outline"
              size="sm"
            >
              <RotateCw className="w-3.5 h-3.5 text-[#F47B20]" />
              <span>Refresh Metrics</span>
            </MHPButton>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MHPButton variant="secondary" size="sm">
                <Globe className="w-4 h-4 text-[#F47B20]" />
                <span>Customer Site</span>
              </MHPButton>
            </a>
          </div>
        </div>
      </MHPCard>

      {/* STAGE — ADMIN SLOT TIMING CONTROL */}
      <AdminSlotTimingControl />

      {/* ========================================================================= */}
      {/* STAGE — ADMIN DAILY ORDERS & REVENUE TRACKING SUMMARY */}
      {/* ========================================================================= */}
      <MHPCard className="!p-6 sm:!p-8 !border-[#F47B20]/40 space-y-6">
        
        {/* Header & Date Selector */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#7D967E]/20 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#F47B20] uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" />
              <span>{isTodaySelected ? "TODAY'S SUMMARY" : "HISTORICAL SUMMARY"}</span>
            </div>
            <h2 className="text-2xl font-display font-extrabold text-[#183A2A]">
              {salesData?.formattedDate || salesData?.date || selectedDate}
            </h2>
          </div>

          {/* Date Selector Bar */}
          <div className="flex flex-wrap items-center gap-2 bg-[#FFF7E8] p-1.5 rounded-xl border border-[#7D967E]/30">
            <button
              onClick={handleSelectToday}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                isTodaySelected
                  ? 'bg-[#F47B20] text-white shadow-xs'
                  : 'text-[#7D967E] hover:text-[#183A2A]'
              }`}
            >
              [ Today ]
            </button>
            <div className="flex items-center gap-2 pl-2 border-l border-[#7D967E]/30">
              <span className="text-xs font-bold text-[#7D967E] uppercase">Select Date:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
                className="bg-[#FFFFFF] border border-[#7D967E]/30 text-[#183A2A] text-xs font-extrabold px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#F47B20] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 1. TODAY'S SUMMARY KPI CARDS */}
        {salesLoading ? (
          <LoadingSkeleton count={4} height="h-28" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* CARD 1: TODAY'S ORDERS */}
            <div className="bg-[#FFF7E8] p-5 rounded-2xl border border-[#7D967E]/30 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#7D967E] uppercase tracking-wider">
                  {isTodaySelected ? "TODAY'S ORDERS" : "TOTAL ORDERS"}
                </span>
                <div className="w-9 h-9 rounded-xl bg-[#FFFFFF] flex items-center justify-center text-[#F47B20] border border-[#7D967E]/30 shadow-xs">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              </div>
              <p className="text-4xl font-mono font-black text-[#183A2A]">
                {salesData?.totalOrders ?? 0}
              </p>
              <p className="text-[10px] text-[#7D967E] font-bold">
                All valid student orders
              </p>
            </div>

            {/* CARD 2: TODAY'S REVENUE */}
            <div className="bg-[#183A2A] p-5 rounded-2xl border border-[#183A2A] space-y-2 text-[#FFF7E8] shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#F47B20] uppercase tracking-wider">
                  {isTodaySelected ? "TODAY'S REVENUE" : "TOTAL REVENUE"}
                </span>
                <div className="w-9 h-9 rounded-xl bg-[#F47B20] flex items-center justify-center text-white shadow-xs">
                  <IndianRupee className="w-4 h-4" />
                </div>
              </div>
              <p className="text-4xl font-mono font-black text-[#FFF7E8]">
                ₹ {(salesData?.totalRevenue ?? 0).toLocaleString('en-IN')}
              </p>
              <p className="text-[10px] text-[#F47B20] font-extrabold">
                Billed totals inc. parcel charges
              </p>
            </div>

            {/* CARD 3: COMPLETED ORDERS */}
            <div className="bg-[#FFF7E8] p-5 rounded-2xl border border-[#7D967E]/30 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">
                  COMPLETED ORDERS
                </span>
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 border border-emerald-300 shadow-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <p className="text-4xl font-mono font-black text-emerald-800">
                {salesData?.completedOrders ?? 0}
              </p>
              <p className="text-[10px] text-[#7D967E] font-bold">
                Full filled & handed over
              </p>
            </div>

            {/* CARD 4: PENDING ORDERS */}
            <div className="bg-[#FFF7E8] p-5 rounded-2xl border border-[#7D967E]/30 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#F47B20] uppercase tracking-wider">
                  PENDING ORDERS
                </span>
                <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-[#F47B20] border border-amber-300 shadow-xs">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <p className="text-4xl font-mono font-black text-[#183A2A]">
                {salesData?.pendingOrders ?? 0}
              </p>
              <p className="text-[10px] text-[#7D967E] font-bold">
                Active in kitchen / preparing
              </p>
            </div>

          </div>
        )}

        {/* DAILY SALES BREAKDOWN */}
        <div className="bg-[#FFF7E8] p-6 rounded-2xl border border-[#7D967E]/30 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#7D967E]/30 pb-3">
            <div>
              <h3 className="text-xs font-extrabold text-[#183A2A] uppercase tracking-wider flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#F47B20]" />
                DAILY SALES BREAKDOWN ({salesData?.formattedDate || selectedDate})
              </h3>
              <p className="text-xs text-[#7D967E] font-medium mt-0.5">
                Channel breakdown between Delivering (parcel orders) and Dining (view-only)
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-extrabold text-[#183A2A] block">
                Total Orders: {salesData?.totalOrders ?? 0}
              </span>
              <span className="text-xs font-black text-[#F47B20]">
                Total Revenue: ₹ {(salesData?.totalRevenue ?? 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* DELIVERING BREAKDOWN */}
            <div className="bg-[#FFFFFF] p-5 rounded-2xl border-2 border-[#F47B20]/40 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#7D967E]/20 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#F47B20] text-white flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-extrabold text-[#183A2A] uppercase tracking-wider">
                    Delivering Orders
                  </span>
                </div>
                <MHPBadge variant="success">Active Channel</MHPBadge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-xs text-[#7D967E] font-bold">Delivering Orders Count:</span>
                <span className="font-mono font-black text-[#183A2A] text-base">{salesData?.deliveringOrders ?? 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm pt-1 border-t border-[#7D967E]/20">
                <span className="text-xs text-[#7D967E] font-bold">Delivering Revenue:</span>
                <span className="font-mono font-black text-[#F47B20] text-lg">₹ {(salesData?.deliveringRevenue ?? 0).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* DINING BREAKDOWN */}
            <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#7D967E]/30 space-y-3 opacity-80 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#7D967E]/20 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#183A2A] text-[#FFF7E8] flex items-center justify-center">
                    <Utensils className="w-4 h-4 text-[#F47B20]" />
                  </div>
                  <span className="text-xs font-extrabold text-[#183A2A] uppercase tracking-wider">
                    Dining Orders
                  </span>
                </div>
                <MHPBadge variant="default">View-Only Menu</MHPBadge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-xs text-[#7D967E] font-bold">Dining Orders Count:</span>
                <span className="font-mono font-black text-[#183A2A] text-base">{salesData?.diningOrders ?? 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm pt-1 border-t border-[#7D967E]/20">
                <span className="text-xs text-[#7D967E] font-bold">Dining Revenue:</span>
                <span className="font-mono font-black text-[#7D967E] text-lg">₹ {(salesData?.diningRevenue ?? 0).toLocaleString('en-IN')}</span>
              </div>
            </div>

          </div>
        </div>

      </MHPCard>

      {/* Main Platform KPI Stat Cards */}
      <div className="space-y-3 pt-2">
        <h2 className="font-extrabold text-xs text-[#7D967E] uppercase tracking-widest">Live Platform Metrics</h2>
        {loading ? (
          <LoadingSkeleton count={3} height="h-28" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <MHPCard className="!p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-extrabold text-[#7D967E] uppercase tracking-wider">Registered Customers</p>
                <p className="text-3xl font-mono font-black text-[#F47B20]">{stats?.totalCustomers ?? 0}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#FFF7E8] flex items-center justify-center text-[#F47B20] border border-[#7D967E]/30">
                <Users className="w-6 h-6" />
              </div>
            </MHPCard>

            <MHPCard className="!p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-extrabold text-[#7D967E] uppercase tracking-wider">Upcoming Campus Events</p>
                <p className="text-3xl font-mono font-black text-[#F47B20]">{stats?.upcomingEvents ?? 0}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#FFF7E8] flex items-center justify-center text-[#F47B20] border border-[#7D967E]/30">
                <Calendar className="w-6 h-6" />
              </div>
            </MHPCard>

            <MHPCard className="!p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-extrabold text-[#7D967E] uppercase tracking-wider">Synergy Showcases</p>
                <p className="text-3xl font-mono font-black text-[#F47B20]">{stats?.synergyShowcases ?? 0}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#FFF7E8] flex items-center justify-center text-[#F47B20] border border-[#7D967E]/30">
                <Mic className="w-6 h-6" />
              </div>
            </MHPCard>
          </div>
        )}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="space-y-3 pt-2">
        <h2 className="font-extrabold text-xs text-[#7D967E] uppercase tracking-widest">Quick Management Shortcuts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/admin/future-menu"
            className="bg-[#FFFFFF] p-5 rounded-2xl border-2 border-[#7D967E]/30 hover:border-[#F47B20] transition-all flex items-center gap-3 group shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FFF7E8] text-[#F47B20] flex items-center justify-center group-hover:scale-105 transition-transform border border-[#7D967E]/30">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-[#183A2A]">Menu & Ordering</h3>
              <p className="text-[10px] text-[#7D967E] font-medium">Food Catalog & Items</p>
            </div>
          </Link>

          <Link
            to="/admin/orders"
            className="bg-[#FFFFFF] p-5 rounded-2xl border-2 border-[#7D967E]/30 hover:border-[#F47B20] transition-all flex items-center gap-3 group shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FFF7E8] text-[#F47B20] flex items-center justify-center group-hover:scale-105 transition-transform border border-[#7D967E]/30">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-[#183A2A]">Student Orders</h3>
              <p className="text-[10px] text-[#7D967E] font-medium">Live Counter Orders</p>
            </div>
          </Link>

          <Link
            to="/admin/happenings"
            className="bg-[#FFFFFF] p-5 rounded-2xl border-2 border-[#7D967E]/30 hover:border-[#F47B20] transition-all flex items-center gap-3 group shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FFF7E8] text-[#F47B20] flex items-center justify-center group-hover:scale-105 transition-transform border border-[#7D967E]/30">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-[#183A2A]">Add Update</h3>
              <p className="text-[10px] text-[#7D967E] font-medium">What's Happening</p>
            </div>
          </Link>

          <Link
            to="/admin/events"
            className="bg-[#FFFFFF] p-5 rounded-2xl border-2 border-[#7D967E]/30 hover:border-[#F47B20] transition-all flex items-center gap-3 group shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FFF7E8] text-[#F47B20] flex items-center justify-center group-hover:scale-105 transition-transform border border-[#7D967E]/30">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-[#183A2A]">Add Event</h3>
              <p className="text-[10px] text-[#7D967E] font-medium">Vignan's Mahotsav</p>
            </div>
          </Link>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
