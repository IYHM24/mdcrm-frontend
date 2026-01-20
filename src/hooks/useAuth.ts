import { useState, useEffect, useRef, useCallback } from 'react';
import { authService } from '@/services/auth.service';
import type { User } from '@/types';

export const useAuth = () => {
  const userRef = useRef<User | null>(null);
  const rolesRef = useRef<string[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {

    // Load user on mount
    const loadUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        const currentRoles = await authService.getUserRoles();

        

        // Actualizar refs sin causar re-renders
        userRef.current = currentUser;
        rolesRef.current = currentRoles;

        // Solo este estado causa re-render
        setIsAuthenticated(!!currentUser);
      } catch (error) {
        console.error('Error loading user:', error);
        userRef.current = null;
        rolesRef.current = null;
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      if (response.status && response.data) {
        // Actualizar refs sin re-render
        
        userRef.current = response.data.user;
        rolesRef.current = response.data.roles;

        // Solo este estado causa re-render
        setIsAuthenticated(true);
        return response;
      }
      throw new Error(response.message || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const response = await authService.logout();

      // Limpiar refs sin re-render
      userRef.current = null;
      rolesRef.current = null;

      // Solo este estado causa re-render
      setIsAuthenticated(false);
      return response;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }, []);

  return {
    user: userRef.current,
    loading,
    isAuthenticated,
    roles: rolesRef.current,
    login,
    logout,
  };

};
