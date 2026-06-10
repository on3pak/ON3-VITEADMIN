import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Service, ServiceOverview, ServiceTask } from '../types';
import { servicesApi } from '../api/services';
import { getToken } from '../api/client';

interface ServiceContextType {
  services: Service[];
  loading: boolean;
  loadServices: () => void;
  getServiceOverviews: () => ServiceOverview[];
  getServiceById: (id: string) => Service | undefined;
  createService: (data: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => Promise<{ success: boolean }>;
  updateService: (id: string, data: Partial<Service>) => Promise<{ success: boolean }>;
  deleteService: (id: string) => Promise<void>;
  updateServiceTask: (serviceId: string, taskId: string, status: ServiceTask['status']) => void;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const loadServices = useCallback(() => {
    if (!getToken()) { setLoading(false); return; }
    setLoading(true);
    servicesApi.list()
      .then((res) => {
        setServices(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getServiceOverviews = useCallback(() => {
    return services.map((s) => ({
      id: s.id,
      work_center_id: s.work_center_id,
      shift_id: s.shift_id,
      name: s.name,
      category: s.category,
      staff_requirement: s.staff_requirement,
      totalTasks: s.tasks?.length ?? 0,
      completedTasks: s.tasks?.filter((t) => t.status === 'COMPLETED').length ?? 0,
    }));
  }, [services]);

  const getServiceById = useCallback((id: string) => {
    return services.find((s) => s.id === id);
  }, [services]);

  const createService = useCallback(async (data: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const created = await servicesApi.create(data);
      setServices((prev) => [created, ...prev]);
      return { success: true };
    } catch {
      return { success: false };
    }
  }, []);

  const updateService = useCallback(async (id: string, data: Partial<Service>) => {
    try {
      const updated = await servicesApi.update(id, data);
      setServices((prev) => prev.map((s) => s.id === id ? updated : s));
      return { success: true };
    } catch {
      return { success: false };
    }
  }, []);

  const deleteService = useCallback(async (id: string) => {
    try {
      await servicesApi.delete(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch { /* ignore */ }
  }, []);

  const updateServiceTask = useCallback((serviceId: string, taskId: string, status: ServiceTask['status']) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === serviceId
          ? {
              ...s,
              updated_at: new Date().toISOString(),
              tasks: s.tasks.map((t) =>
                t.id === taskId ? { ...t, status } : t
              ),
            }
          : s
      )
    );
  }, []);

  return (
    <ServiceContext.Provider
      value={{ services, loading, loadServices, getServiceOverviews, getServiceById, createService, updateService, deleteService, updateServiceTask }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

export const useServices = () => {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
};
