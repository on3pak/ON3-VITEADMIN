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

function mapApiUserToAppUser(apiUser: {
  id: string; employee_id: string | null; email: string; full_name: string;
  role: string; status: 'ACTIVE' | 'INACTIVE'; language: 'ES' | 'EN';
  avatar_url?: string | null; city_id?: string | null;
}): User {
  return {
    id: apiUser.id,
    employee_id: apiUser.employee_id ?? '',
    username: apiUser.email.split('@')[0],
    email: apiUser.email,
    full_name: apiUser.full_name.split(' ').slice(0, 2).join(' '),
    password: '',
    role: apiUser.role as UserRole,
    status: apiUser.status,
    language: apiUser.language,
    city_id: apiUser.city_id ?? '',
    avatar_url: apiUser.avatar_url ?? undefined,
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
    const initializeAuth = async () => {
      const storedToken = getToken();
      if (!storedToken) {
        setState(prev => ({ ...prev, initializing: false }));
        return;
      }

      try {
        const profile = await authApi.me();
        console.log('[Auth] init profile response:', profile);
        const appUser = mapApiUserToAppUser(profile.user);
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(appUser));
        setState({
          isAuthenticated: true,
          user: appUser,
          token: storedToken,
          initializing: false,
          submitting: false,
          error: null,
          employee: profile.employee,
          vacations: profile.vacations,
        });
      } catch {
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
      }
    };

    const timer = setTimeout(initializeAuth, 600);
    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setState(prev => ({ ...prev, submitting: true, error: null }));

    const minDelay = new Promise<void>(r => setTimeout(r, 800));

    try {
      const { accessToken } = await authApi.login({ email, password });
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);

      await minDelay;

      let employee: Employee | null = null;
      let vacations: VacationRequest[] = [];
      let appUser: User;

      try {
        const profile = await authApi.me();
        console.log('[Auth] profile response:', profile);
        appUser = mapApiUserToAppUser(profile.user);
        employee = profile.employee;
        vacations = profile.vacations;
      } catch {
        throw new api.ApiError(0, ['Error al obtener perfil del usuario'], 'ProfileError');
      }

      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(appUser));

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
    authApi.logout().catch(() => {});
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
