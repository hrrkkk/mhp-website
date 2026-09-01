import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { CartProvider } from './context/CartContext';

// Layouts
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';

// Customer Pages
import Home from './pages/Home';
import About from './pages/About';
import Facilities from './pages/Facilities';
import Explore from './pages/Explore';
import LocationContact from './pages/LocationContact';
import Feedback from './pages/Feedback';
import CustomerProfile from './pages/CustomerProfile';
import MenuPage from './pages/MenuPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CartPage from './pages/CartPage';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminNavbarManager from './pages/admin/AdminNavbarManager';
import AdminHomeSettings from './pages/admin/AdminHomeSettings';
import AdminAboutSettings from './pages/admin/AdminAboutSettings';
import AdminExploreSettings from './pages/admin/AdminExploreSettings';
import AdminHappenings from './pages/admin/AdminHappenings';
import AdminEvents from './pages/admin/AdminEvents';
import AdminSynergy from './pages/admin/AdminSynergy';
import AdminFacilities from './pages/admin/AdminFacilities';
import AdminFeedback from './pages/admin/AdminFeedback';
import AdminLocationSettings from './pages/admin/AdminLocationSettings';
import AdminFutureMenu from './pages/admin/AdminFutureMenu';
import AdminOrders from './pages/admin/AdminOrders';
import AdminBillingCounter from './pages/admin/AdminBillingCounter';

// Guards
import ProtectedAdminRoute from './components/common/ProtectedAdminRoute';
import ProtectedCustomerRoute from './components/common/ProtectedCustomerRoute';

function App() {
  return (
    <CartProvider>
      <Routes>
        
        {/* ================= CUSTOMER PORTAL ROUTES ================= */}
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="explore" element={<Explore />} />
          <Route path="facilities" element={<Explore />} />
          <Route path="location" element={<LocationContact />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          
          {/* Customer Protected Route */}
          <Route
            path="profile"
            element={
              <ProtectedCustomerRoute>
                <CustomerProfile />
              </ProtectedCustomerRoute>
            }
          />
        </Route>

        {/* Direct Admin Staff Login route -> Direct Access to Admin Dashboard */}
        <Route path="/admin/login" element={<Navigate to="/admin/dashboard" replace />} />

        {/* ================= ADMIN DASHBOARD PROTECTED ROUTES ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="navbar" element={<AdminNavbarManager />} />
          <Route path="home-settings" element={<AdminHomeSettings />} />
          <Route path="about-settings" element={<AdminAboutSettings />} />
          <Route path="explore-settings" element={<AdminExploreSettings />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="billing-counter" element={<AdminBillingCounter />} />
          <Route path="future-menu" element={<AdminFutureMenu />} />
          <Route path="happenings" element={<AdminHappenings />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="synergy" element={<AdminSynergy />} />
          <Route path="facilities" element={<AdminFacilities />} />
          <Route path="feedback" element={<AdminFeedback />} />
          <Route path="location-settings" element={<AdminLocationSettings />} />
        </Route>

        {/* Fallback 404 Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CartProvider>
  );
}

export default App;
