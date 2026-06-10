import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { MachineryItem, MachineryOverview } from '../types';
import { machineryApi } from '../api/services';
import { getToken } from '../api/client';

interface MachineryContextType {
  items: MachineryItem[];
  loading: boolean;
  loadMachinery: () => void;
  getOverviews: () => MachineryOverview[];
  getById: (id: string) => MachineryItem | undefined;
  create: (data: Omit<MachineryItem, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  update: (id: string, data: Partial<MachineryItem>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

const MachineryContext = createContext<MachineryContextType | undefined>(undefined);

export const MachineryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<MachineryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMachinery = useCallback(() => {
    if (!getToken()) { setLoading(false); return; }
    setLoading(true);
    machineryApi.list()
      .then((res) => {
        setItems(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getOverviews = useCallback((): MachineryOverview[] => {
    return items.map((item) => ({
      id: item.id,
      name: item.name,
      subtype_id: item.subtype_id,
      status_id: item.status_id,
      quantity: item.quantity,
      min_stock: item.min_stock,
      unit: item.unit,
      city_id: item.city_id,
      work_center_id: item.work_center_id,
      location: item.location,
    }));
  }, [items]);

  const getById = useCallback((id: string) => {
    return items.find((item) => item.id === id);
  }, [items]);

  const create = useCallback(async (data: Omit<MachineryItem, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const created = await machineryApi.create(data);
      setItems((prev) => [created, ...prev]);
    } catch { /* fallback */ }
  }, []);

  const update = useCallback(async (id: string, data: Partial<MachineryItem>) => {
    try {
      const updated = await machineryApi.update(id, data);
      setItems((prev) => prev.map((item) => item.id === id ? updated : item));
    } catch { /* fallback */ }
  }, []);

  const remove = useCallback(async (id: string) => {
    try {
      await machineryApi.delete(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch { /* ignore */ }
  }, []);

  return (
    <MachineryContext.Provider value={{ items, loading, loadMachinery, getOverviews, getById, create, update, remove }}>
      {children}
    </MachineryContext.Provider>
  );
};

export const useMachinery = () => {
  const context = useContext(MachineryContext);
  if (context === undefined) {
    throw new Error('useMachinery must be used within a MachineryProvider');
  }
  return context;
};
