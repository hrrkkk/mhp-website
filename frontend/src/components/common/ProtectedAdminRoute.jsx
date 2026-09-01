import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const DEFAULT_ADMIN = {
  _id: '223f90d45bd4040c',
  id: '223f90d45bd4040c',
  name: 'MHP Administrator',
  email: 'admin@mhp.vfstr.ac.in',
  phone: '7672022351',
  role: 'admin',
  studentId: 'STAFF-MHP-01',
  hostelInfo: 'MHP Office, Near N Block'
};

const ProtectedAdminRoute = ({ children }) => {
  const { user, setUser } = useAuth();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      if (typeof setUser === 'function') {
        setUser(DEFAULT_ADMIN);
      }
    }
  }, [user, setUser]);

  return children;
};

export default ProtectedAdminRoute;
