import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import LiveThreeDBackground from '../components/common/LiveThreeDBackground';
import MobileBottomBar from '../components/common/MobileBottomBar';
import NetworkOfflineBanner from '../components/common/NetworkOfflineBanner';

const CustomerLayout = () => {
  return (
    <div className="min-h-screen bg-[#FFF7E8] text-[#202522] flex flex-col selection:bg-[#F47B20] selection:text-white relative overflow-x-hidden preserve-3d pb-16 md:pb-0">
      {/* Real-time Internet Connectivity Monitor */}
      <NetworkOfflineBanner />

      {/* Live Animated 3D Environmental Background System */}
      <LiveThreeDBackground />

      {/* Floating Navigation Header */}
      <Navbar />

      {/* Main Customer Page Content */}
      <main className="flex-1 relative z-10 preserve-3d">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Sticky Bottom Navigation Bar (Home, Menu, Cart) */}
      <MobileBottomBar />
    </div>
  );
};

export default CustomerLayout;



