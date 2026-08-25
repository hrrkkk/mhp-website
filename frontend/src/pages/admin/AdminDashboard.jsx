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
import ThreeDTiltCard from '../../components/common/ThreeDTiltCard';

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
    <div className="space-y-6 pb-16 bg-[#F6F0E6] text-[#242321]">
      
      {/* Admin Control Center Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#FCFAF6] p-6 rounded-2xl border-2 border-[#DDD5C7] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold text-[#B96548] uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            MHP Control Center
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#242321]">Admin Portal & Revenue Tracker</h1>
          <p className="text-xs text-[#736E67] mt-0.5">
            VFSTR Campus • Real-time order analytics, revenue reports, and platform overview
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchSalesMetrics(selectedDate)}
            className="px-4 py-2.5 rounded-xl bg-[#E9DED0] hover:bg-[#DDD5C7] text-[#242321] text-xs font-bold flex items-center gap-2 border border-[#DDD5C7] transition-all cursor-pointer"
            title="Refresh revenue metrics"
          >
            <RotateCw className="w-3.5 h-3.5 text-[#B96548]" />
            <span>Refresh</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-mhp-secondary text-xs"
          >
            <Globe className="w-4 h-4 text-[#B96548]" />
            <span>Customer Site</span>
          </a>
        </div>
      </div>

      {/* STAGE — ADMIN SLOT TIMING CONTROL */}
      <AdminSlotTimingControl />

      {/* ========================================================================= */}
      {/* STAGE — ADMIN DAILY ORDERS & REVENUE TRACKING SUMMARY */}
      {/* ========================================================================= */}
      <div className="bg-[#FCFAF6] p-6 sm:p-8 rounded-2xl border-2 border-[#B96548]/40 space-y-6 shadow-xs">
        
        {/* Header & Date Selector */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#DDD5C7] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#B96548] uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" />
              <span>{isTodaySelected ? "TODAY'S SUMMARY" : "HISTORICAL SUMMARY"}</span>
            </div>
            <h2 className="text-2xl font-display font-bold text-[#242321]">
              {salesData?.formattedDate || salesData?.date || selectedDate}
            </h2>
          </div>

          {/* Date Selector Bar */}
          <div className="flex flex-wrap items-center gap-2 bg-[#E9DED0] p-1.5 rounded-xl border border-[#DDD5C7]">
            <button
              onClick={handleSelectToday}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                isTodaySelected
                  ? 'bg-[#B96548] text-[#FCFAF6] shadow-xs'
                  : 'text-[#736E67] hover:text-[#242321]'
              }`}
            >
              [ Today ]
            </button>
            <div className="flex items-center gap-2 pl-2 border-l border-[#DDD5C7]">
              <span className="text-xs font-bold text-[#736E67] uppercase">Select Date:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
                className="bg-[#FCFAF6] border border-[#DDD5C7] text-[#242321] text-xs font-extrabold px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#B96548] cursor-pointer"
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
            <ThreeDTiltCard maxTilt={8} className="bg-[#F6F0E6] p-5 rounded-2xl border border-[#DDD5C7] space-y-2 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#736E67] uppercase tracking-wider">
                  {isTodaySelected ? "TODAY'S ORDERS" : "TOTAL ORDERS"}
                </span>
                <div className="w-9 h-9 rounded-xl bg-[#FCFAF6] flex items-center justify-center text-[#B96548] border border-[#DDD5C7] shadow-xs">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              </div>
              <p className="text-4xl font-mono font-black text-[#242321]">
                {salesData?.totalOrders ?? 0}
              </p>
              <p className="text-[10px] text-[#736E67] font-bold">
                All valid student orders
              </p>
            </ThreeDTiltCard>

            {/* CARD 2: TODAY'S REVENUE */}
            <ThreeDTiltCard maxTilt={8} className="bg-[#1D1D1B] p-5 rounded-2xl border border-[#1D1D1B] space-y-2 text-[#F6F0E6] shadow-lg shadow-[#B96548]/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#B96548] uppercase tracking-wider">
                  {isTodaySelected ? "TODAY'S REVENUE" : "TOTAL REVENUE"}
                </span>
                <div className="w-9 h-9 rounded-xl bg-[#B96548] flex items-center justify-center text-[#FCFAF6] shadow-xs">
                  <IndianRupee className="w-4 h-4" />
                </div>
              </div>
              <p className="text-4xl font-mono font-black text-[#FCFAF6]">
                ₹ {(salesData?.totalRevenue ?? 0).toLocaleString('en-IN')}
              </p>
              <p className="text-[10px] text-[#B96548] font-bold">
                Billed totals inc. parcel charges
              </p>
            </ThreeDTiltCard>

            {/* CARD 3: COMPLETED ORDERS */}
            <ThreeDTiltCard maxTilt={8} className="bg-[#F6F0E6] p-5 rounded-2xl border border-[#DDD5C7] space-y-2 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">
                  COMPLETED ORDERS
                </span>
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 border border-emerald-200 shadow-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <p className="text-4xl font-mono font-black text-emerald-800">
                {salesData?.completedOrders ?? 0}
              </p>
              <p className="text-[10px] text-[#736E67] font-bold">
                Full filled & handed over
              </p>
            </ThreeDTiltCard>

            {/* CARD 4: PENDING ORDERS */}
            <ThreeDTiltCard maxTilt={8} className="bg-[#F6F0E6] p-5 rounded-2xl border border-[#DDD5C7] space-y-2 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#B96548] uppercase tracking-wider">
                  PENDING ORDERS
                </span>
                <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-[#B96548] border border-amber-200 shadow-xs">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <p className="text-4xl font-mono font-black text-[#242321]">
                {salesData?.pendingOrders ?? 0}
              </p>
              <p className="text-[10px] text-[#736E67] font-bold">
                Active in kitchen / preparing
              </p>
            </ThreeDTiltCard>

          </div>
        )}

        {/* 6. DAILY SALES BREAKDOWN (DELIVERING vs DINING) */}
        <div className="bg-[#F6F0E6] p-6 rounded-2xl border border-[#DDD5C7] space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#DDD5C7] pb-3">
            <div>
              <h3 className="text-xs font-extrabold text-[#242321] uppercase tracking-wider flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#B96548]" />
                DAILY SALES BREAKDOWN ({salesData?.formattedDate || selectedDate})
              </h3>
              <p className="text-xs text-[#736E67] mt-0.5">
                Channel breakdown between Delivering (parcel orders) and Dining (view-only)
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-extrabold text-[#242321] block">
                Total Orders: {salesData?.totalOrders ?? 0}
              </span>
              <span className="text-xs font-black text-[#B96548]">
                Total Revenue: ₹ {(salesData?.totalRevenue ?? 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* DELIVERING BREAKDOWN */}
            <div className="bg-[#FCFAF6] p-5 rounded-2xl border-2 border-[#B96548]/40 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#DDD5C7] pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#B96548] text-white flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-extrabold text-[#242321] uppercase tracking-wider">
                    Delivering Orders
                  </span>
                </div>
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Active Channel
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-xs text-[#736E67] font-bold">Delivering Orders Count:</span>
                <span className="font-mono font-black text-[#242321] text-base">{salesData?.deliveringOrders ?? 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm pt-1 border-t border-[#DDD5C7]">
                <span className="text-xs text-[#736E67] font-bold">Delivering Revenue:</span>
                <span className="font-mono font-black text-[#B96548] text-lg">₹ {(salesData?.deliveringRevenue ?? 0).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* DINING BREAKDOWN (Always 0 as Dining is View-Only) */}
            <div className="bg-[#FCFAF6] p-5 rounded-2xl border border-[#DDD5C7] space-y-3 opacity-80 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#DDD5C7] pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#1D1D1B] text-[#FCFAF6] flex items-center justify-center">
                    <Utensils className="w-4 h-4 text-[#B96548]" />
                  </div>
                  <span className="text-xs font-extrabold text-[#242321] uppercase tracking-wider">
                    Dining Orders
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#E9DED0] text-[#736E67] border border-[#DDD5C7]">
                  View-Only Menu
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-xs text-[#736E67] font-bold">Dining Orders Count:</span>
                <span className="font-mono font-black text-[#242321] text-base">{salesData?.diningOrders ?? 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm pt-1 border-t border-[#DDD5C7]">
                <span className="text-xs text-[#736E67] font-bold">Dining Revenue:</span>
                <span className="font-mono font-black text-[#736E67] text-lg">₹ {(salesData?.diningRevenue ?? 0).toLocaleString('en-IN')}</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Main Platform KPI Stat Cards */}
      <div className="space-y-3 pt-2">
        <h2 className="font-extrabold text-xs text-[#736E67] uppercase tracking-widest">Live Platform Metrics</h2>
        {loading ? (
          <LoadingSkeleton count={3} height="h-28" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-[#FCFAF6] p-6 rounded-2xl border border-[#DDD5C7] flex items-center justify-between shadow-xs">
              <div className="space-y-1">
                <p className="text-xs font-extrabold text-[#736E67] uppercase tracking-wider">Registered Customers</p>
                <p className="text-3xl font-mono font-black text-[#B96548]">{stats?.totalCustomers ?? 0}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#E9DED0] flex items-center justify-center text-[#B96548] border border-[#DDD5C7]">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-[#FCFAF6] p-6 rounded-2xl border border-[#DDD5C7] flex items-center justify-between shadow-xs">
              <div className="space-y-1">
                <p className="text-xs font-extrabold text-[#736E67] uppercase tracking-wider">Upcoming Campus Events</p>
                <p className="text-3xl font-mono font-black text-[#B96548]">{stats?.upcomingEvents ?? 0}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#E9DED0] flex items-center justify-center text-[#B96548] border border-[#DDD5C7]">
                <Calendar className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-[#FCFAF6] p-6 rounded-2xl border border-[#DDD5C7] flex items-center justify-between shadow-xs">
              <div className="space-y-1">
                <p className="text-xs font-extrabold text-[#736E67] uppercase tracking-wider">Synergy Showcases</p>
                <p className="text-3xl font-mono font-black text-[#B96548]">{stats?.synergyShowcases ?? 0}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#E9DED0] flex items-center justify-center text-[#B96548] border border-[#DDD5C7]">
                <Mic className="w-6 h-6" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="space-y-3 pt-2">
        <h2 className="font-extrabold text-xs text-[#736E67] uppercase tracking-widest">Quick Management Shortcuts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/admin/future-menu"
            className="bg-[#FCFAF6] p-5 rounded-2xl border border-[#DDD5C7] hover:border-[#B96548] transition-all flex items-center gap-3 group shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E9DED0] text-[#B96548] flex items-center justify-center group-hover:scale-105 transition-transform border border-[#DDD5C7]">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#242321]">Menu & Ordering</h3>
              <p className="text-[10px] text-[#736E67]">Food Catalog & Items</p>
            </div>
          </Link>

          <Link
            to="/admin/orders"
            className="bg-[#FCFAF6] p-5 rounded-2xl border border-[#DDD5C7] hover:border-[#B96548] transition-all flex items-center gap-3 group shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E9DED0] text-[#B96548] flex items-center justify-center group-hover:scale-105 transition-transform border border-[#DDD5C7]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#242321]">Student Orders</h3>
              <p className="text-[10px] text-[#736E67]">Live Counter Orders</p>
            </div>
          </Link>

          <Link
            to="/admin/happenings"
            className="bg-[#FCFAF6] p-5 rounded-2xl border border-[#DDD5C7] hover:border-[#B96548] transition-all flex items-center gap-3 group shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E9DED0] text-[#B96548] flex items-center justify-center group-hover:scale-105 transition-transform border border-[#DDD5C7]">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#242321]">Add Update</h3>
              <p className="text-[10px] text-[#736E67]">What's Happening</p>
            </div>
          </Link>

          <Link
            to="/admin/events"
            className="bg-[#FCFAF6] p-5 rounded-2xl border border-[#DDD5C7] hover:border-[#B96548] transition-all flex items-center gap-3 group shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E9DED0] text-[#B96548] flex items-center justify-center group-hover:scale-105 transition-transform border border-[#DDD5C7]">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#242321]">Add Event</h3>
              <p className="text-[10px] text-[#736E67]">Vignan's Mahotsav</p>
            </div>
          </Link>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
