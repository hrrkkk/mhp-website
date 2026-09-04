import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import LiveThreeDBackground from '../components/common/LiveThreeDBackground';
import MobileBottomBar from '../components/common/MobileBottomBar';
import StickyTopCartBar from '../components/common/StickyTopCartBar';
import NetworkOfflineBanner from '../components/common/NetworkOfflineBanner';
import ServerWarmupBanner from '../components/common/ServerWarmupBanner';
import ErrorBoundary from '../components/common/ErrorBoundary';

const CustomerLayout = () => {
  return (
    <div className="min-h-screen bg-[#FFF7E8] text-[#202522] flex flex-col selection:bg-[#F47B20] selection:text-white relative overflow-x-hidden preserve-3d pb-16 md:pb-0">
      {/* Real-time Internet Connectivity Monitor */}
      <NetworkOfflineBanner />

      {/* Render Cold-Start Server Warmup Monitor */}
      <ServerWarmupBanner />

      {/* Live Animated 3D Environmental Background System */}
      <LiveThreeDBackground />

      {/* Floating Navigation Header */}
      <Navbar />

      {/* Persistent Floating Sticky Top Cart Bar (Top of Viewport) */}
      <StickyTopCartBar />

      {/* Main Customer Page Content */}
      <main className="flex-1 relative z-10 preserve-3d">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Sticky Bottom Navigation Bar (Home, Menu, Cart) */}
      <MobileBottomBar />
    </div>
  );
};

export default CustomerLayout;



