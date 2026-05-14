import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, User, UserRole } from '../types';
import { mockAuthUsers, createMockAuthSession } from '../data/mockAuth';
import { INITIAL_USERS } from '../data/mockUsers';

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

const buildUserFromAuth = (authUser: typeof mockAuthUsers[number]): User | null => {
  const matchedUser = INITIAL_USERS.find(u => u.id === authUser.user_id);
  if (!matchedUser) return null;
  return {
    ...matchedUser,
    avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${authUser.user_metadata.user_name}`,
  };
};

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
          const mockUser = mockAuthUsers.find(u => u.id === session.user.id);
          if (mockUser) {
            const appUser = buildUserFromAuth(mockUser);
            if (appUser) {
              setState({
                isAuthenticated: true,
                user: appUser,
                token: session.access_token,
                loading: false,
                error: null,
              });
              return;
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
    const mockUser = mockAuthUsers.find(
      u => u.email.toLowerCase() === lowercaseEmail && u.password === password
    );

    if (!mockUser) {
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

    const session = createMockAuthSession(mockUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));

    const appUser = buildUserFromAuth(mockUser);

    if (!appUser) {
      setState({
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: 'Error al cargar datos del usuario.',
      });
      return false;
    }

    setState({
      isAuthenticated: true,
      user: appUser,
      token: session.access_token,
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
