import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { MachineryItem, MachineryOverview } from '../types';
import { INITIAL_MACHINERY } from '../data/mockMachinery';
import { generateId } from '../utils/id';

interface MachineryContextType {
  items: MachineryItem[];
  getOverviews: () => MachineryOverview[];
  getById: (id: string) => MachineryItem | undefined;
  create: (data: Omit<MachineryItem, 'id' | 'created_at' | 'updated_at'>) => void;
  update: (id: string, data: Partial<MachineryItem>) => void;
  remove: (id: string) => void;
}

const MachineryContext = createContext<MachineryContextType | undefined>(undefined);

export const MachineryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<MachineryItem[]>(INITIAL_MACHINERY);

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

  const create = useCallback((data: Omit<MachineryItem, 'id' | 'created_at' | 'updated_at'>) => {
    const now = new Date().toISOString();
    const newItem: MachineryItem = {
      ...data,
      id: generateId('mch'),
      created_at: now,
      updated_at: now,
    };
    setItems((prev) => [newItem, ...prev]);
  }, []);

  const update = useCallback((id: string, data: Partial<MachineryItem>) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...data, updated_at: new Date().toISOString() } : item
      )
    );
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return (
    <MachineryContext.Provider value={{ items, getOverviews, getById, create, update, remove }}>
      {children}
    </MachineryContext.Provider>
  );
};

export const useMachinery = (): MachineryContextType => {
  const context = useContext(MachineryContext);
  if (!context) {
    throw new Error('useMachinery must be used within a MachineryProvider');
  }
  return context;
};
