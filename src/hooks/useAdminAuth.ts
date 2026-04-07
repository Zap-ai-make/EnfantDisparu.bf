import { useState, useEffect, useCallback } from 'react';

/**
 * Hook pour gérer l'authentification admin
 * Utilisé par /admin et /admin/tiktok pour protéger l'accès
 */
export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier l'auth au montage
  useEffect(() => {
    const auth = sessionStorage.getItem('admin_dashboard_auth');
    setIsAuthenticated(auth === 'true');
    setIsLoading(false);
  }, []);

  // Login avec vérification du mot de passe
  const login = useCallback(async (password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        sessionStorage.setItem('admin_dashboard_auth', 'true');
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    sessionStorage.removeItem('admin_dashboard_auth');
    setIsAuthenticated(false);
  }, []);

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}
