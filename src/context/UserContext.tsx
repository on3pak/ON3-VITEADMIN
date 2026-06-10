import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, UserRole } from '../types';
import { useAuth } from './AuthContext';
import { usersApi } from '../api/services';
import { getToken } from '../api/client';

interface UserContextProps {
  users: User[];
  loadUsers: () => void;
  createUser: (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) => Promise<{ success: boolean; message: string }>;
  updateUser: (id: string, userData: Partial<User>) => Promise<{ success: boolean; message: string }>;
  deleteUser: (id: string) => Promise<{ success: boolean; message: string }>;
  hardDeleteUser: (id: string) => Promise<{ success: boolean; message: string }>;
  restoreUser: (id: string) => Promise<{ success: boolean; message: string }>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const { user, triggerToast } = useAuth();

  const loadUsers = useCallback(() => {
    if (!getToken()) return;
    usersApi.list()
      .then((res) => {
        setUsers(res.data);
      })
      .catch(() => {});
  }, []);

  const checkPermissionForRoleAction = (action: 'CREATE' | 'UPDATE' | 'DELETE', targetRole?: UserRole, originalTarget?: User): { allowed: boolean; reason?: string } => {
    if (!user) return { allowed: false, reason: 'No autenticado' };

    const currentRole = user.role;

    if (currentRole === 'ROOT') return { allowed: true };

    if (currentRole === 'USER') {
      return { allowed: false, reason: 'Tu rol USER es de SÓLO LECTURA. Requieres permisos elevados.' };
    }

    if (currentRole === 'MANAGER') {
      if (action === 'DELETE') {
        return { allowed: false, reason: 'El rol MANAGER no tiene permitido eliminar registros. Acción exclusiva de ADMIN y ROOT.' };
      }
      if (targetRole === 'ROOT' || targetRole === 'ADMIN' || originalTarget?.role === 'ROOT' || originalTarget?.role === 'ADMIN') {
        return { allowed: false, reason: 'El rol MANAGER no puede crear ni modificar usuarios de jerarquía ROOT o ADMIN.' };
      }
      return { allowed: true };
    }

    if (currentRole === 'ADMIN') {
      if (originalTarget?.role === 'ROOT' || targetRole === 'ROOT') {
        return { allowed: false, reason: 'No puedes modificar usuarios ROOT.' };
      }
      return { allowed: true };
    }

    return { allowed: false, reason: 'Permiso denegado.' };
  };

  const createUser = async (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) => {
    const check = checkPermissionForRoleAction('CREATE', userData.role);
    if (!check.allowed) {
      triggerToast(check.reason || 'Permiso denegado.', 'error');
      return { success: false, message: check.reason || 'Permiso denegado.' };
    }

    try {
      const created = await usersApi.create({
        email: userData.email,
        password: userData.password,
        role: userData.role,
        employee_id: userData.employee_id,
      });
      const newUser: User = { ...userData, ...created };
      setUsers((prev) => [newUser, ...prev]);
      triggerToast(`Usuario ${newUser.username} creado con éxito.`, 'success');
      return { success: true, message: 'Usuario creado correctamente.' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al crear usuario.';
      triggerToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const updateUser = async (id: string, userData: Partial<User>) => {
    const target = users.find(u => u.id === id);
    if (!target) return { success: false, message: 'Usuario no encontrado.' };

    const check = checkPermissionForRoleAction('UPDATE', userData.role, target);
    if (!check.allowed) {
      triggerToast(check.reason || 'Permiso denegado.', 'error');
      return { success: false, message: check.reason || 'Permiso denegado.' };
    }

    try {
      const updated = await usersApi.update(id, userData);
      setUsers((prev) => prev.map(u => u.id === id ? updated : u));
      triggerToast(`Usuario ${updated.username} actualizado.`, 'success');
      return { success: true, message: 'Usuario actualizado.' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar usuario.';
      triggerToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const deleteUser = async (id: string) => {
    const target = users.find(u => u.id === id);
    if (!target) return { success: false, message: 'Usuario no encontrado.' };

    const check = checkPermissionForRoleAction('DELETE', target.role, target);
    if (!check.allowed) {
      triggerToast(check.reason || 'Permiso denegado.', 'error');
      return { success: false, message: check.reason || 'Permiso denegado.' };
    }

    try {
      await usersApi.delete(id);
      const updated = users.map(u =>
        u.id === id ? { ...u, status: 'DELETED' as const, updated_at: new Date().toISOString() } : u
      );
      setUsers(updated);
      triggerToast(`Usuario ${target.username} dado de baja.`, 'success');
      return { success: true, message: 'Usuario dado de baja.' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar usuario.';
      triggerToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const hardDeleteUser = async (id: string) => {
    const target = users.find(u => u.id === id);
    if (!target) return { success: false, message: 'Usuario no encontrado.' };

    try {
      await usersApi.delete(id);
      const updated = users.filter(u => u.id !== id);
      setUsers(updated);
      triggerToast(`Usuario ${target.username} eliminado permanentemente.`, 'success');
      return { success: true, message: 'Usuario eliminado.' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar usuario.';
      triggerToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const restoreUser = async (id: string) => {
    const target = users.find(u => u.id === id);
    if (!target) return { success: false, message: 'Usuario no encontrado.' };

    try {
      const updated = await usersApi.update(id, { status: 'ACTIVE' });
      setUsers((prev) => prev.map(u => u.id === id ? updated : u));
      triggerToast(`Usuario ${target.username} restaurado.`, 'success');
      return { success: true, message: 'Usuario restaurado.' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al restaurar usuario.';
      triggerToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  return (
    <UserContext.Provider value={{ users, loadUsers, createUser, updateUser, deleteUser, hardDeleteUser, restoreUser }}>
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
