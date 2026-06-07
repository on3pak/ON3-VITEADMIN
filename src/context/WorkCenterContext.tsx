import React, { createContext, useContext, useState, useEffect } from 'react';
import { WorkCenter } from '../types';
import { INITIAL_WORK_CENTERS } from '../data/mockWorkCenters';
import { useAuth } from './AuthContext';
import { generateId } from '../utils/id';

interface WorkCenterContextProps {
  workCenters: WorkCenter[];
  createWorkCenter: (data: Omit<WorkCenter, 'id' | 'created_at' | 'updated_at'>) => { success: boolean; message: string };
  updateWorkCenter: (id: string, data: Partial<WorkCenter>) => { success: boolean; message: string };
  deleteWorkCenter: (id: string) => { success: boolean; message: string };
  resetMockData: () => void;
}

const WorkCenterContext = createContext<WorkCenterContextProps | undefined>(undefined);

export const WorkCenterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workCenters, setWorkCenters] = useState<WorkCenter[]>([]);
  const { user, triggerToast } = useAuth();

  useEffect(() => {
    setWorkCenters(INITIAL_WORK_CENTERS);
    localStorage.setItem('on3_mock_workcenters', JSON.stringify(INITIAL_WORK_CENTERS));
  }, []);

  const saveToStorage = (updated: WorkCenter[]) => {
    setWorkCenters(updated);
    localStorage.setItem('on3_mock_workcenters', JSON.stringify(updated));
  };

  const resetMockData = () => {
    saveToStorage(INITIAL_WORK_CENTERS);
    triggerToast('Centros de trabajo restablecidos a valores iniciales.', 'info');
  };

  const checkPermission = (action: 'CREATE' | 'UPDATE' | 'DELETE'): { allowed: boolean; reason?: string } => {
    if (!user) return { allowed: false, reason: 'No autenticado' };
    if (user.role === 'ROOT' || user.role === 'ADMIN') return { allowed: true };
    if (user.role === 'MANAGER' && action !== 'DELETE') return { allowed: true };
    if (user.role === 'MANAGER' && action === 'DELETE') return { allowed: false, reason: 'MANAGER no puede eliminar centros de trabajo.' };
    return { allowed: false, reason: 'Tu rol es de solo lectura.' };
  };

  const createWorkCenter = (data: Omit<WorkCenter, 'id' | 'created_at' | 'updated_at'>) => {
    const check = checkPermission('CREATE');
    if (!check.allowed) {
      triggerToast(check.reason || 'Permiso denegado.', 'error');
      return { success: false, message: check.reason || 'Permiso denegado.' };
    }

    if (workCenters.some(w => w.name.toLowerCase() === data.name.toLowerCase().trim())) {
      const msg = `El centro '${data.name}' ya existe.`;
      triggerToast(msg, 'error');
      return { success: false, message: msg };
    }

    const now = new Date().toISOString();
    const newItem: WorkCenter = {
      ...data,
      id: generateId('wc'),
      name: data.name.trim(),
      created_at: now,
      updated_at: now,
    };

    saveToStorage([newItem, ...workCenters]);
    triggerToast(`Centro ${newItem.name} creado con éxito.`, 'success');
    return { success: true, message: 'Centro creado correctamente.' };
  };

  const updateWorkCenter = (id: string, data: Partial<WorkCenter>) => {
    const target = workCenters.find(w => w.id === id);
    if (!target) return { success: false, message: 'Centro no encontrado.' };

    const check = checkPermission('UPDATE');
    if (!check.allowed) {
      triggerToast(check.reason || 'Permiso denegado.', 'error');
      return { success: false, message: check.reason || 'Permiso denegado.' };
    }

    const updated = workCenters.map(w => w.id === id ? { ...w, ...data, updated_at: new Date().toISOString() } : w);
    saveToStorage(updated);
    triggerToast(`Centro ${target.name} actualizado.`, 'success');
    return { success: true, message: 'Centro actualizado.' };
  };

  const deleteWorkCenter = (id: string) => {
    const target = workCenters.find(w => w.id === id);
    if (!target) return { success: false, message: 'Centro no encontrado.' };

    const check = checkPermission('DELETE');
    if (!check.allowed) {
      triggerToast(check.reason || 'Permiso denegado.', 'error');
      return { success: false, message: check.reason || 'Permiso denegado.' };
    }

    const updated = workCenters.filter(w => w.id !== id);
    saveToStorage(updated);
    triggerToast(`Centro ${target.name} eliminado.`, 'success');
    return { success: true, message: 'Centro eliminado.' };
  };

  return (
    <WorkCenterContext.Provider value={{ workCenters, createWorkCenter, updateWorkCenter, deleteWorkCenter, resetMockData }}>
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
