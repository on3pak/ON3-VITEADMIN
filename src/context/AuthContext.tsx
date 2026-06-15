import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '../types';
import { authApi } from '../api/services';
import type { ProfileBackground } from '../api/services/auth';
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
  darkMode: boolean;
  profileBackgrounds: ProfileBackground[];
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
  darkMode: boolean;
  profileBackgrounds: ProfileBackground[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
  clearError: () => void;
  setDarkMode: (dark: boolean) => void;
  triggerToast: (message: string, type: 'success' | 'error' | 'info') => void;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

function mapApiUserToAppUser(apiUser: {
  id: string; employee_id: string | null; email: string; full_name: string;
  role: string; status: string; language: 'en' | 'es';
  avatar_url?: string | null; city_id?: string | null; dark_mode?: boolean;
}): User {
  return {
    id: apiUser.id,
    employee_id: apiUser.employee_id ?? '',
    username: apiUser.email.split('@')[0],
    email: apiUser.email,
    full_name: apiUser.full_name.split(' ').slice(0, 2).join(' '),
    password: '',
    role: apiUser.role as UserRole,
    status: apiUser.status.toLowerCase() as 'active' | 'inactive',
    language: apiUser.language,
    city_id: apiUser.city_id ?? '',
    avatar_url: apiUser.avatar_url ?? undefined,
    dark_mode: apiUser.dark_mode,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

function applyDarkMode(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark);
  localStorage.setItem(STORAGE_KEYS.DARK_MODE, String(dark));
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
    darkMode: localStorage.getItem(STORAGE_KEYS.DARK_MODE) === 'true',
    profileBackgrounds: [],
  });

  // Apply initial dark mode from localStorage to DOM immediately
  useEffect(() => {
    applyDarkMode(state.darkMode);
  }, []);

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
        const storedError = localStorage.getItem('on3_auth_error');
        if (storedError) {
          localStorage.removeItem('on3_auth_error');
          setState(prev => ({ ...prev, error: storedError, initializing: false }));
        } else {
          setState(prev => ({ ...prev, initializing: false }));
        }
        return;
      }

      try {
        const profile = await authApi.me();
        console.log('[Auth] init profile response:', profile);
        const appUser = mapApiUserToAppUser(profile.user);
        const darkMode = profile.user.dark_mode ?? state.darkMode;
        applyDarkMode(darkMode);
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
          profileBackgrounds: profile.profileBackgrounds ?? [],
          darkMode,
        });
      } catch {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
        const storedError = localStorage.getItem('on3_auth_error');
        if (storedError) localStorage.removeItem('on3_auth_error');
        setState(prev => ({
          ...prev,
          isAuthenticated: false,
          user: null,
          token: null,
          initializing: false,
          submitting: false,
          error: storedError || null,
          employee: null,
          vacations: [],
        }));
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
      let darkMode = state.darkMode;
      let profileBackgrounds: ProfileBackground[] = [];

      try {
        const profile = await authApi.me();
        console.log('[Auth] profile response:', profile);
        appUser = mapApiUserToAppUser(profile.user);
        employee = profile.employee;
        vacations = profile.vacations;
        profileBackgrounds = profile.profileBackgrounds ?? [];
        darkMode = profile.user.dark_mode ?? state.darkMode;
        applyDarkMode(darkMode);
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
        profileBackgrounds,
        darkMode,
      });

      triggerToast(`¡Bienvenido, ${appUser.full_name}! Rol: ${appUser.role}`, 'success');
      return true;
    } catch (err) {
      await minDelay;
      const serverMsg = err instanceof api.ApiError
        ? err.messages.join('. ')
        : 'Error de conexión con el servidor.';
      setState(prev => ({
        ...prev,
        isAuthenticated: false,
        user: null,
        token: null,
        initializing: false,
        submitting: false,
        error: serverMsg,
        employee: null,
        vacations: [],
      }));
      triggerToast(serverMsg, 'error');
      return false;
    }
  };

  const logout = () => {
    authApi.logout().catch(() => {});
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    setState(prev => ({
      ...prev,
      isAuthenticated: false,
      user: null,
      token: null,
      initializing: false,
      submitting: false,
      error: null,
      employee: null,
      vacations: [],
      profileBackgrounds: [],
    }));
    triggerToast('Sesión cerrada correctamente.', 'info');
  };

  const setDarkMode = useCallback((dark: boolean) => {
    applyDarkMode(dark);
    setState(prev => ({ ...prev, darkMode: dark }));
    authApi.updateProfile({ dark_mode: dark }).catch(() => {});
  }, []);

  const hasRole = (roles: UserRole[]): boolean => {
    if (!state.isAuthenticated || !state.user) return false;
    return roles.includes(state.user.role);
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return (
    <AuthContext.Provider value={{ ...state, employee: state.employee, vacations: state.vacations, profileBackgrounds: state.profileBackgrounds, login, logout, hasRole, clearError, setDarkMode, triggerToast, toast }}>
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
