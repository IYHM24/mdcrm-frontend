import { useState, useEffect } from 'react';
import { authService } from '@/services/auth.service';
import type { User } from '@/types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {

    // Load user on mount
    const loadUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        const currentRoles = await authService.getUserRoles();
        setUser(currentUser);
        setRoles(currentRoles);
        setIsAuthenticated(!!currentUser);
      } catch (error) {
        console.error('Error loading user:', error);
        setUser(null);
        setRoles(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      if (response.status && response.data) {
        setUser(response.data.user);
        setRoles(response.data.roles);
        setIsAuthenticated(true);
        return response;
      }
      throw new Error(response.message || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const response = await authService.logout();
      setUser(null);
      setRoles(null);
      setIsAuthenticated(false);
      return response;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    isAuthenticated,
    roles,
    login,
    logout,
  };

};
