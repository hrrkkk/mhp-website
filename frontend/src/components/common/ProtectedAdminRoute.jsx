import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedAdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const token = typeof window !== 'undefined' ? localStorage.getItem('mhp_token') : null;

  const hasAdminAccess = Boolean(token || (user && user.role === 'admin'));

  if (loading && !hasAdminAccess) {
    return (
      <div className="min-h-screen bg-[#183A2A] flex items-center justify-center text-[#F47B20]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F47B20]"></div>
      </div>
    );
  }

  if (!hasAdminAccess) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
