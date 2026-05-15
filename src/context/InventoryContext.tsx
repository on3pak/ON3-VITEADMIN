import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { InventoryItem, InventoryOverview } from '../types';
import { INITIAL_INVENTORY } from '../data/mockInventory';
import { generateId } from '../utils/id';

interface InventoryContextType {
  items: InventoryItem[];
  getOverviews: () => InventoryOverview[];
  getById: (id: string) => InventoryItem | undefined;
  create: (data: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'>) => void;
  update: (id: string, data: Partial<InventoryItem>) => void;
  remove: (id: string) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<InventoryItem[]>(INITIAL_INVENTORY);

  const getOverviews = useCallback((): InventoryOverview[] => {
    return items.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
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

  const create = useCallback((data: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'>) => {
    const now = new Date().toISOString();
    const newItem: InventoryItem = {
      ...data,
      id: generateId('inv'),
      created_at: now,
      updated_at: now,
    };
    setItems((prev) => [newItem, ...prev]);
  }, []);

  const update = useCallback((id: string, data: Partial<InventoryItem>) => {
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
    <InventoryContext.Provider value={{ items, getOverviews, getById, create, update, remove }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = (): InventoryContextType => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
