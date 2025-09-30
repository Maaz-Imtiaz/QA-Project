import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../constants/api';
import { AuthContextType, User, LoginCredentials, RegisterData } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${API_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setUser(response.data.data.user);
      })
      .catch(() => {
        localStorage.removeItem('token');
      })
      .finally(() => {
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean }> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, credentials);
      const { token, user } = response.data.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      setError(null);
      toast.success(`Welcome back, ${user.firstName}!`);
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean }> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, userData);
      const { token, user } = response.data.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      setError(null);
      toast.success(`Welcome to QA Test Case Management, ${user.firstName}!`);
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
    toast.success('Logged out successfully');
  };

  const clearError = (): void => setError(null);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
