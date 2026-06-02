import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Service, ServiceOverview, ServiceTask } from '../types';
import { INITIAL_SERVICES } from '../data/mockServices';
import { generateId } from '../utils/id';

interface ServiceContextType {
  services: Service[];
  getServiceOverviews: () => ServiceOverview[];
  getServiceById: (id: string) => Service | undefined;
  createService: (data: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => { success: boolean };
  updateService: (id: string, data: Partial<Service>) => { success: boolean };
  deleteService: (id: string) => void;
  updateServiceTask: (serviceId: string, taskId: string, status: ServiceTask['status']) => void;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);

  const getServiceOverviews = useCallback(() => {
    return services.map((s) => ({
      id: s.id,
      work_center_id: s.work_center_id,
      name: s.name,
      category: s.category,
      totalTasks: s.tasks.length,
      completedTasks: s.tasks.filter((t) => t.status === 'COMPLETED').length,
    }));
  }, [services]);

  const getServiceById = useCallback((id: string) => {
    return services.find((s) => s.id === id);
  }, [services]);

  const createService = useCallback((data: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
    const now = new Date().toISOString();
    const newService: Service = {
      ...data,
      id: generateId('svc'),
      created_at: now,
      updated_at: now,
    };
    setServices((prev) => [newService, ...prev]);
    return { success: true };
  }, []);

  const updateService = useCallback((id: string, data: Partial<Service>) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, ...data, updated_at: new Date().toISOString() } : s
      )
    );
    return { success: true };
  }, []);

  const deleteService = useCallback((id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
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
      value={{
        services,
        getServiceOverviews,
        getServiceById,
        createService,
        updateService,
        deleteService,
        updateServiceTask,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

export const useServices = (): ServiceContextType => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
};
