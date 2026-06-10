import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { InventoryItem, InventoryOverview } from '../types';
import { inventoryApi } from '../api/services';
import { getToken } from '../api/client';

interface InventoryContextType {
  items: InventoryItem[];
  getOverviews: () => InventoryOverview[];
  getById: (id: string) => InventoryItem | undefined;
  create: (data: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  update: (id: string, data: Partial<InventoryItem>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    const loadInventory = () => {
      if (!getToken()) return;
      inventoryApi.list()
        .then(async (res) => {
          const full = await Promise.all(
            res.data.map((o) => inventoryApi.getById(o.id).catch(() => null))
          );
          setItems(full.filter(Boolean) as InventoryItem[]);
        })
        .catch(() => {});
    };
    loadInventory();
    window.addEventListener('auth:login', loadInventory);
    return () => window.removeEventListener('auth:login', loadInventory);
  }, []);

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

  const create = useCallback(async (data: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const created = await inventoryApi.create(data);
      setItems((prev) => [created, ...prev]);
    } catch { /* fallback */ }
  }, []);

  const update = useCallback(async (id: string, data: Partial<InventoryItem>) => {
    try {
      const updated = await inventoryApi.update(id, data);
      setItems((prev) => prev.map((item) => item.id === id ? updated : item));
    } catch { /* fallback */ }
  }, []);

  const remove = useCallback(async (id: string) => {
    try {
      await inventoryApi.delete(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch { /* ignore */ }
  }, []);

  return (
    <InventoryContext.Provider value={{ items, getOverviews, getById, create, update, remove }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
