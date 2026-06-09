import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USERS, TEST_ACCOUNTS } from '../data/mockUsers';
import { signMockToken, verifyMockToken, decodeMockToken } from '../utils/jwt';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextProps extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
  clearError: () => void;
  triggerToast: (message: string, type: 'success' | 'error' | 'info') => void;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const STORAGE_KEY = 'mock_auth_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: true,
    error: null,
  });

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const triggerToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedSession = localStorage.getItem(STORAGE_KEY);
        if (storedSession) {
          const session = JSON.parse(storedSession);
          if (verifyMockToken(session.token)) {
            const payload = decodeMockToken(session.token);
            if (payload) {
              const appUser = INITIAL_USERS.find(u => u.username === payload.username);
              if (appUser) {
                setState({
                  isAuthenticated: true,
                  user: { ...appUser },
                  token: session.token,
                  loading: false,
                  error: null,
                });
                return;
              }
            }
          }
        }
      } catch (err) {
        console.error('Error auto-authenticating:', err);
      }

      setState(prev => ({ ...prev, loading: false }));
    };

    const timer = setTimeout(initializeAuth, 600);
    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    await new Promise(resolve => setTimeout(resolve, 800));

    const lowercaseEmail = email.trim().toLowerCase();
    const testAccount = TEST_ACCOUNTS.find(
      a => a.email.toLowerCase() === lowercaseEmail && a.password === password
    );

    if (!testAccount) {
      setState({
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: 'Credenciales inválidas. Compruebe el email y la contraseña de prueba.',
      });
      triggerToast('Error de autenticación. Credenciales incorrectas.', 'error');
      return false;
    }

    const appUser = INITIAL_USERS.find(
      u => u.email.toLowerCase() === lowercaseEmail
    );

    if (!appUser) {
      setState({
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: 'Credenciales inválidas. Compruebe el email y la contraseña de prueba.',
      });
      triggerToast('Error de autenticación. Credenciales incorrectas.', 'error');
      return false;
    }

    if (appUser.status === 'DELETED') {
      setState({
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: 'Cuenta dada de baja. Contacta al administrador.',
      });
      triggerToast('Cuenta dada de baja. No puedes iniciar sesión.', 'error');
      return false;
    }

    const token = signMockToken({
      sub: appUser.id,
      username: appUser.username,
      role: appUser.role,
      full_name: appUser.full_name,
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user: appUser }));

    setState({
      isAuthenticated: true,
      user: appUser,
      token,
      loading: false,
      error: null,
    });

    triggerToast(`¡Bienvenido de nuevo, ${appUser.full_name}! Rol: ${appUser.role}`, 'success');
    return true;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
      error: null,
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
    <AuthContext.Provider value={{ ...state, login, logout, hasRole, clearError, triggerToast, toast }}>
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
