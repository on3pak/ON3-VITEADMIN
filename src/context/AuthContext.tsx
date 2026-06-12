import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '../types';
import { authApi } from '../api/services';
import { STORAGE_KEYS } from '../config';
import { getToken, api } from '../api/client';

import type { Employee, VacationRequest } from '../types';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  initializing: boolean;
  submitting: boolean;
  error: string | null;
  employee: Employee | null;
  vacations: VacationRequest[];
}

interface AuthContextProps {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  initializing: boolean;
  submitting: boolean;
  error: string | null;
  employee: Employee | null;
  vacations: VacationRequest[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
  clearError: () => void;
  triggerToast: (message: string, type: 'success' | 'error' | 'info') => void;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

function mapApiUserToAppUser(apiUser: { id: string; email: string; role: string; employee_id: string | null; city_id: string; full_name?: string }): User {
  return {
    id: apiUser.id,
    employee_id: apiUser.employee_id ?? '',
    username: apiUser.email.split('@')[0],
    email: apiUser.email,
    full_name: apiUser.full_name || apiUser.email.split('@')[0],
    password: '',
    role: apiUser.role as UserRole,
    status: 'ACTIVE',
    language: 'ES',
    city_id: apiUser.city_id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    initializing: true,
    submitting: false,
    error: null,
    employee: null,
    vacations: [],
  });

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const triggerToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = getToken();
        if (storedToken) {
          const storedUser = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
          if (storedUser) {
            const user = JSON.parse(storedUser) as User;
            setState({
              isAuthenticated: true,
              user,
              token: storedToken,
              initializing: false,
              submitting: false,
              error: null,
            });
            return;
          }
        }
      } catch (err) {
        console.error('Error auto-authenticating:', err);
      }

      setState(prev => ({ ...prev, initializing: false }));
    };

    const timer = setTimeout(initializeAuth, 600);
    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setState(prev => ({ ...prev, submitting: true, error: null }));

    const minDelay = new Promise<void>(r => setTimeout(r, 800));

    try {
      const { accessToken, user: apiUser } = await authApi.login({ email, password });
      await minDelay;
      const appUser = mapApiUserToAppUser(apiUser);

      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(appUser));

      // fetch full profile after login
      let employee: Employee | null = null;
      let vacations: VacationRequest[] = [];
      try {
        const profile = await authApi.me();
        employee = profile.employee;
        vacations = profile.vacations;
      } catch {
        // /auth/me no disponible — continuar con datos básicos
      }

      setState({
        isAuthenticated: true,
        user: appUser,
        token: accessToken,
        initializing: false,
        submitting: false,
        error: null,
        employee,
        vacations,
      });

      triggerToast(`¡Bienvenido, ${appUser.full_name}! Rol: ${appUser.role}`, 'success');
      return true;
    } catch (err) {
      await minDelay;
      const serverMsg = err instanceof api.ApiError
        ? err.messages.join('. ')
        : 'Error de conexión con el servidor.';
      setState({
        isAuthenticated: false,
        user: null,
        token: null,
        initializing: false,
        submitting: false,
        error: serverMsg,
        employee: null,
        vacations: [],
      });
      triggerToast(serverMsg, 'error');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    setState({
      isAuthenticated: false,
      user: null,
      token: null,
      initializing: false,
      submitting: false,
      error: null,
      employee: null,
      vacations: [],
    });
    triggerToast('Sesión cerrada correctamente.', 'info');
  };

  const hasRole = (roles: UserRole[]): boolean => {
    if (!state.isAuthenticated || !state.user) return false;
    return roles.includes(state.user.role);
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return (
    <AuthContext.Provider value={{ ...state, employee: state.employee, vacations: state.vacations, login, logout, hasRole, clearError, triggerToast, toast }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
