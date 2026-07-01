// Enterprise Mall - useAuth Hook
// Provides convenient access to auth state and actions

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { getProfile } from '../api/user';

export function useAuth() {
  const navigate = useNavigate();
  const store = useAuthStore();

  // Initialize auth state from localStorage on first render
  useEffect(() => {
    if (store.token && !store.user) {
      // Token exists but user data not loaded — fetch profile
      getProfile()
        .then((response) => {
          store.setAuth(response.data!, store.token!);
        })
        .catch(() => {
          store.clearAuth();
          navigate('/login');
        });
    }
  }, []);

  return {
    user: store.user,
    token: store.token,
    isAuthenticated: store.isAuthenticated,
    loading: store.loading,
    error: store.error,
    isAdmin: store.user?.role === 'ADMIN',
    login: store.login,
    logout: store.logout,
    updatePoints: store.updatePoints,
  };
}
