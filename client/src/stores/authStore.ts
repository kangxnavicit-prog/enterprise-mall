// Enterprise Mall - Auth Store (Zustand)
// Manages user authentication state, token, and role

import { create } from 'zustand';
import { User } from '../types/user';
import { TOKEN_KEY } from '../utils/constants';
import { login as loginApi, logout as logoutApi } from '../api/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  // Actions
  login: (employeeId: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  updatePoints: (newPoints: number) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  login: async (employeeId: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const response = await loginApi(employeeId, password);
      const { token, user } = response.data!;
      localStorage.setItem(TOKEN_KEY, token);
      set({
        user,
        token,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      const message = error?.message || 'Login failed';
      set({ loading: false, error: message });
      throw error;
    }
  },

  logout: async () => {
    try {
      await logoutApi();
    } catch {
      // Ignore logout API errors, clear local state regardless
    }
    localStorage.removeItem(TOKEN_KEY);
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  setAuth: (user: User, token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    set({ user, token, isAuthenticated: true });
  },

  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    set({ user: null, token: null, isAuthenticated: false });
  },

  updatePoints: (newPoints: number) => {
    const currentUser = get().user;
    if (currentUser) {
      set({ user: { ...currentUser, points: newPoints } });
    }
  },

  initializeAuth: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      set({ token, isAuthenticated: true });
      // Will fetch user profile separately via useAuth hook
    }
  },
}));
