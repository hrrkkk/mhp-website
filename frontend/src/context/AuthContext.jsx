import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('mhp_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user);
    } catch (err) {
      console.error('Failed to fetch user:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentialsOrEmail, password) => {
    let payload = {};
    if (typeof credentialsOrEmail === 'object' && credentialsOrEmail !== null) {
      payload = credentialsOrEmail;
    } else if (typeof credentialsOrEmail === 'string' && credentialsOrEmail.includes('@')) {
      payload = { email: credentialsOrEmail, password };
    } else {
      payload = { phone: credentialsOrEmail, password };
    }
    const res = await api.post('/auth/login', payload);
    const { token: authToken, user: userData } = res.data;
    localStorage.setItem('mhp_token', authToken);
    setToken(authToken);
    setUser(userData);
    return userData;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    const { token: authToken, user: newUser } = res.data;
    localStorage.setItem('mhp_token', authToken);
    setToken(authToken);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('mhp_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data) => {
    const res = await api.put('/auth/profile', data);
    setUser(res.data.user);
    return res.data.user;
  };

  const isAuthenticated = Boolean(user);
  const isAdmin = Boolean(user && user.role === 'admin');

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
