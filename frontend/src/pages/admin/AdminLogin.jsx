import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminLogin = () => {
  return <Navigate to="/admin/dashboard" replace />;
};

export default AdminLogin;
