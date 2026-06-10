import React, { createContext, useContext, useState, useEffect } from 'react';
import { WorkCenter } from '../types';
import { useAuth } from './AuthContext';
import { workCentersApi } from '../api/services';
import { getToken } from '../api/client';

interface WorkCenterContextProps {
  workCenters: WorkCenter[];
  createWorkCenter: (data: Omit<WorkCenter, 'id' | 'created_at' | 'updated_at'>) => Promise<{ success: boolean; message: string }>;
  updateWorkCenter: (id: string, data: Partial<WorkCenter>) => Promise<{ success: boolean; message: string }>;
  deleteWorkCenter: (id: string) => Promise<{ success: boolean; message: string }>;
}

const WorkCenterContext = createContext<WorkCenterContextProps | undefined>(undefined);

export const WorkCenterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workCenters, setWorkCenters] = useState<WorkCenter[]>([]);
  const { user, triggerToast } = useAuth();

  useEffect(() => {
    const loadWorkCenters = () => {
      if (!getToken()) return;
      workCentersApi.list()
        .then((res) => setWorkCenters(res.data))
        .catch(() => {});
    };
    loadWorkCenters();
    window.addEventListener('auth:login', loadWorkCenters);
    return () => window.removeEventListener('auth:login', loadWorkCenters);
  }, []);

  const checkPermission = (action: 'CREATE' | 'UPDATE' | 'DELETE'): { allowed: boolean; reason?: string } => {
    if (!user) return { allowed: false, reason: 'No autenticado' };
    if (user.role === 'ROOT' || user.role === 'ADMIN') return { allowed: true };
    if (user.role === 'MANAGER' && action !== 'DELETE') return { allowed: true };
    if (user.role === 'MANAGER' && action === 'DELETE') return { allowed: false, reason: 'MANAGER no puede eliminar centros de trabajo.' };
    return { allowed: false, reason: 'Tu rol es de solo lectura.' };
  };

  const createWorkCenter = async (data: Omit<WorkCenter, 'id' | 'created_at' | 'updated_at'>) => {
    const check = checkPermission('CREATE');
    if (!check.allowed) {
      triggerToast(check.reason || 'Permiso denegado.', 'error');
      return { success: false, message: check.reason || 'Permiso denegado.' };
    }

    try {
      const created = await workCentersApi.create(data);
      setWorkCenters((prev) => [created, ...prev]);
      triggerToast(`Centro ${created.name} creado con éxito.`, 'success');
      return { success: true, message: 'Centro creado correctamente.' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al crear centro.';
      triggerToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const updateWorkCenter = async (id: string, data: Partial<WorkCenter>) => {
    const target = workCenters.find(w => w.id === id);
    if (!target) return { success: false, message: 'Centro no encontrado.' };

    const check = checkPermission('UPDATE');
    if (!check.allowed) {
      triggerToast(check.reason || 'Permiso denegado.', 'error');
      return { success: false, message: check.reason || 'Permiso denegado.' };
    }

    try {
      const updated = await workCentersApi.update(id, data);
      setWorkCenters((prev) => prev.map(w => w.id === id ? updated : w));
      triggerToast(`Centro ${updated.name} actualizado.`, 'success');
      return { success: true, message: 'Centro actualizado.' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar centro.';
      triggerToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const deleteWorkCenter = async (id: string) => {
    const target = workCenters.find(w => w.id === id);
    if (!target) return { success: false, message: 'Centro no encontrado.' };

    const check = checkPermission('DELETE');
    if (!check.allowed) {
      triggerToast(check.reason || 'Permiso denegado.', 'error');
      return { success: false, message: check.reason || 'Permiso denegado.' };
    }

    try {
      await workCentersApi.delete(id);
      setWorkCenters((prev) => prev.filter(w => w.id !== id));
      triggerToast(`Centro ${target.name} eliminado.`, 'success');
      return { success: true, message: 'Centro eliminado.' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar centro.';
      triggerToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  return (
    <WorkCenterContext.Provider value={{ workCenters, createWorkCenter, updateWorkCenter, deleteWorkCenter }}>
      {children}
    </WorkCenterContext.Provider>
  );
};

export const useWorkCenters = () => {
  const context = useContext(WorkCenterContext);
  if (context === undefined) {
    throw new Error('useWorkCenters must be used within a WorkCenterProvider');
  }
  return context;
};
