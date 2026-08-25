import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import LiveThreeDBackground from '../components/common/LiveThreeDBackground';

const CustomerLayout = () => {
  return (
    <div className="min-h-screen bg-[#0B0909] text-[#F4E5D5] flex flex-col selection:bg-[#D77A4D] selection:text-[#F4E5D5] relative overflow-x-hidden preserve-3d">
      {/* Live Animated 3D Environmental Background System */}
      <LiveThreeDBackground />

      {/* Floating 3D Navigation Header */}
      <Navbar />

      {/* Main Customer Page Content */}
      <main className="flex-1 relative z-10 preserve-3d">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CustomerLayout;
