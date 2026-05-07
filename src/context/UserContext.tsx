import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../data/mockUsers';
import { useAuth } from './AuthContext';

interface UserContextProps {
  users: User[];
  createUser: (userData: Omit<User, 'id' | 'createdAt'>) => { success: boolean; message: string };
  updateUser: (id: string, userData: Partial<User>) => { success: boolean; message: string };
  deleteUser: (id: string) => { success: boolean; message: string };
  resetMockData: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const { user, triggerToast } = useAuth();

  // Always load fresh INITIAL_USERS on mount (ignore stale localStorage)
  useEffect(() => {
    setUsers(INITIAL_USERS);
    localStorage.setItem('context7_mock_users', JSON.stringify(INITIAL_USERS));
  }, []);

  const saveUsersToStorage = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    localStorage.setItem('context7_mock_users', JSON.stringify(updatedUsers));
  };

  const resetMockData = () => {
    saveUsersToStorage(INITIAL_USERS);
    triggerToast('Base de datos simulada restablecida a los valores iniciales.', 'info');
  };

  // Helper to check hierarchy rule enforcement
  const checkPermissionForRoleAction = (action: 'CREATE' | 'UPDATE' | 'DELETE', targetRole?: UserRole, originalTarget?: User): { allowed: boolean; reason?: string } => {
    if (!user) return { allowed: false, reason: 'No autenticado' };

    const currentRole = user.role;

    // ROOT can always do everything
    if (currentRole === 'ROOT') return { allowed: true };

    // USER role can NEVER write
    if (currentRole === 'USER') {
      return { allowed: false, reason: 'Tu rol USER es de SÓLO LECTURA. Requieres permisos elevados.' };
    }

    // MANAGER restrictions
    if (currentRole === 'MANAGER') {
      if (action === 'DELETE') {
        return { allowed: false, reason: 'El rol MANAGER no tiene permitido eliminar registros. Acción exclusiva de ADMIN y ROOT.' };
      }
      if (targetRole === 'ROOT' || targetRole === 'ADMIN' || originalTarget?.role === 'ROOT' || originalTarget?.role === 'ADMIN') {
        return { allowed: false, reason: 'El rol MANAGER no puede crear ni modificar usuarios de jerarquía ROOT o ADMIN.' };
      }
      return { allowed: true };
    }

    // ADMIN restrictions
    if (currentRole === 'ADMIN') {
      if (originalTarget?.role === 'ROOT' || targetRole === 'ROOT') {
        return { allowed: false, reason: 'El rol ADMIN no puede manipular ni alterar la cuenta del ROOT principal.' };
      }
      return { allowed: true };
    }

    return { allowed: false, reason: 'Permiso denegado' };
  };

  const createUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const check = checkPermissionForRoleAction('CREATE', userData.role);
    if (!check.allowed) {
      const msg = check.reason || 'Permiso denegado.';
      triggerToast(msg, 'error');
      return { success: false, message: msg };
    }

    // Check if username already exists
    if (users.some(u => u.username.toLowerCase() === userData.username.toLowerCase().trim())) {
      const msg = `El nombre de usuario '${userData.username}' ya está en uso.`;
      triggerToast(msg, 'error');
      return { success: false, message: msg };
    }

    const newUser: User = {
      ...userData,
      id: `usr-${Math.random().toString(36).substring(2, 7)}`,
      username: userData.username.trim(),
      createdAt: new Date().toISOString(),
    };

    const updated = [newUser, ...users];
    saveUsersToStorage(updated);
    triggerToast(`Usuario ${newUser.fullName} creado con éxito.`, 'success');
    return { success: true, message: 'Usuario creado correctamente.' };
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    const targetUser = users.find(u => u.id === id);
    if (!targetUser) {
      return { success: false, message: 'Usuario no encontrado' };
    }

    const check = checkPermissionForRoleAction('UPDATE', userData.role || targetUser.role, targetUser);
    if (!check.allowed) {
      const msg = check.reason || 'Permiso denegado.';
      triggerToast(msg, 'error');
      return { success: false, message: msg };
    }

    const updated = users.map(u => {
      if (u.id === id) {
        return { ...u, ...userData };
      }
      return u;
    });

    saveUsersToStorage(updated);
    triggerToast(`Usuario ${targetUser.fullName} actualizado correctamente.`, 'success');
    return { success: true, message: 'Usuario actualizado.' };
  };

  const deleteUser = (id: string) => {
    const targetUser = users.find(u => u.id === id);
    if (!targetUser) {
      return { success: false, message: 'Usuario no encontrado' };
    }

    const check = checkPermissionForRoleAction('DELETE', undefined, targetUser);
    if (!check.allowed) {
      const msg = check.reason || 'Permiso denegado.';
      triggerToast(msg, 'error');
      return { success: false, message: msg };
    }

    // Prevent self-deletion
    if (user && user.username === targetUser.username) {
      const msg = 'No puedes eliminar tu propio usuario activo actual.';
      triggerToast(msg, 'error');
      return { success: false, message: msg };
    }

    const updated = users.filter(u => u.id !== id);
    saveUsersToStorage(updated);
    triggerToast(`Usuario ${targetUser.fullName} eliminado del sistema.`, 'success');
    return { success: true, message: 'Usuario eliminado.' };
  };

  return (
    <UserContext.Provider value={{ users, createUser, updateUser, deleteUser, resetMockData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};
