import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const res = await authService.getProfile();
          if (res.success) {
            setUser(res.data);
            setIsAuthenticated(true);
          } else {
            handleLogout();
          }
        } catch (error) {
          console.error("Failed to load profile on init:", error);
          handleLogout();
        }
      }
      setLoading(false);
    };

    initAuth();

    // Listen for custom logout event from axios interceptor
    const handleCustomLogout = () => handleLogout();
    window.addEventListener('auth:logout', handleCustomLogout);
    
    return () => {
      window.removeEventListener('auth:logout', handleCustomLogout);
    };
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authService.login(email, password);
      if (res.success && res.data.user) {
        setUser(res.data.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: res.error?.message || 'Login failed' };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Login failed. Please try again.' 
      };
    }
  };

  const register = async (username, email, password, passwordConfirm) => {
    try {
      const res = await authService.register(username, email, password, passwordConfirm);
      if (res.success && res.data.user) {
        setUser(res.data.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: res.error?.message || 'Registration failed' };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || 'Registration failed. Please try again.' 
      };
    }
  };

  const handleLogout = async () => {
    if (isAuthenticated) {
      await authService.logout();
    }
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      login,
      register,
      logout: handleLogout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
