import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../utils/api';

// Create the auth context with a default value
const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  register: async () => {},
  login: async () => {},
  logout: () => {},
  updateProfile: () => {}
});

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from local storage on initial render
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const storedUser = JSON.parse(localStorage.getItem('user'));
          if (storedUser) {
            setUser(storedUser);
          } else {
            // If no user in localStorage but token exists, fetch user data
            const response = await authAPI.getProfile();
            setUser(response.data.user);
            localStorage.setItem('user', JSON.stringify(response.data.user));
          }
        } catch (err) {
          console.error('Failed to load user:', err);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Register a new user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.register(userData);
      const { token, user } = response.data;
      
      // Save to state and localStorage
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return { success: false, error: err.response?.data?.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;
      
      // Save to state and localStorage
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return { success: false, error: err.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    // Clear state and localStorage
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Update user profile
  const updateProfile = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Context value
  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 