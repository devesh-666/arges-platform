import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';

export function useAuth() {
  const [user, setUser] = useState<null | { _id: string; name: string; email: string; role: string }>(null);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== 'undefined' ? localStorage.getItem('arges_token') : null;

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    api.auth.me()
      .then(res => res.success && setUser(res.data as never))
      .catch(() => localStorage.removeItem('arges_token'))
      .finally(() => setLoading(false));
  }, [token]);

  const login = useCallback((token: string, userData: never) => {
    localStorage.setItem('arges_token', token);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('arges_token');
    setUser(null);
  }, []);

  return { user, loading, login, logout, isAuthenticated: !!user };
}
