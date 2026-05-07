import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, AuthUser, UserRole } from '../types';
import { TEST_ACCOUNTS } from '../data/mockUsers';
import { signMockToken, decodeMockToken, verifyMockToken } from '../utils/jwt';

interface AuthContextProps extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
  clearError: () => void;
  triggerToast: (message: string, type: 'success' | 'error' | 'info') => void;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

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

  // Check token on startup
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('context7_jwt_token');
        if (storedToken && verifyMockToken(storedToken)) {
          const payload = decodeMockToken(storedToken);
          if (payload) {
            const authUser: AuthUser = {
              id: payload.sub,
              username: payload.username,
              email: TEST_ACCOUNTS.find(u => u.username === payload.username)?.email || `${payload.username}@empresa.com`,
              fullName: payload.fullName,
              role: payload.role,
              avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${payload.username}`,
            };

            setState({
              isAuthenticated: true,
              user: authUser,
              token: storedToken,
              loading: false,
              error: null,
            });
            return;
          }
        }
      } catch (err) {
        console.error('Error auto-authenticating:', err);
      }
      
      setState(prev => ({ ...prev, loading: false }));
    };

    // Simulate small network delay for realistic feel
    const timer = setTimeout(initializeAuth, 600);
    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    // Simulate real API latency
    await new Promise(resolve => setTimeout(resolve, 800));

    const lowercaseEmail = email.trim().toLowerCase();
    const matchedAccount = TEST_ACCOUNTS.find(
      acc => acc.email.toLowerCase() === lowercaseEmail && acc.password === password
    );

    if (matchedAccount) {
      // Create mock JWT token
      const token = signMockToken({
        sub: `usr-${Math.random().toString(36).substring(2, 7)}`,
        username: matchedAccount.username,
        role: matchedAccount.role,
        fullName: matchedAccount.fullName,
      });

      localStorage.setItem('context7_jwt_token', token);

      const authUser: AuthUser = {
        id: `usr-${matchedAccount.username}`,
        username: matchedAccount.username,
        email: matchedAccount.email,
        fullName: matchedAccount.fullName,
        role: matchedAccount.role,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${matchedAccount.username}`,
      };

      setState({
        isAuthenticated: true,
        user: authUser,
        token: token,
        loading: false,
        error: null,
      });

      triggerToast(`¡Bienvenido de nuevo, ${matchedAccount.fullName}! Rol: ${matchedAccount.role}`, 'success');
      return true;
    } else {
      setState({
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: 'Credenciales inválidas. Compruebe el usuario y la contraseña de prueba.',
      });
      triggerToast('Error de autenticación. Credenciales incorrectas.', 'error');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('context7_jwt_token');
    setState({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
      error: null,
    });
    triggerToast('Sesión cerrada correctamente.', 'info');
  };

  // Role-Based Access Control check (RBAC)
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
