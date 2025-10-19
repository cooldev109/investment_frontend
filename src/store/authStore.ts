import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'investor';
  planKey: 'free' | 'basic' | 'plus' | 'premium';
  planStatus: 'active' | 'expired' | 'trial';
  planRenewal?: string;
  createdAt?: string;
  lastLogin?: string;
  isVerified?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  register: (data: RegisterData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  getMe: () => Promise<void>;
  clearError: () => void;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'admin' | 'investor';
}

export interface LoginData {
  email: string;
  password: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/register', data);
          const { user, token } = response.data.data;

          // Store token in localStorage
          localStorage.setItem('token', token);

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Registration failed',
          });
          throw error;
        }
      },

      login: async (data: LoginData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/login', data);
          const { user, token } = response.data.data;

          // Store token in localStorage
          localStorage.setItem('token', token);

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Login failed',
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await api.post('/auth/logout');
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Clear token from localStorage
          localStorage.removeItem('token');

          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      getMe: async () => {
        set({ isLoading: true });
        try {
          const response = await api.get('/auth/me');
          const { user } = response.data.data;

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          // Clear auth state if token is invalid
          localStorage.removeItem('token');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message || 'Failed to fetch user',
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
