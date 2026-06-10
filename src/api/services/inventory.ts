import { api } from '../client';
import type { InventoryItem, InventoryOverview } from '../../types';

const BASE = '/inventory';

export const inventoryApi = {
  list: (params?: { page?: number; limit?: number }) =>
    api.getList<InventoryOverview>(BASE, params),
  getById: (id: string) =>
    api.getById<InventoryItem>(BASE, id),
  create: (body: Partial<InventoryItem>) =>
    api.post<InventoryItem>(BASE, body),
  update: (id: string, body: Partial<InventoryItem>) =>
    api.patch<InventoryItem>(BASE, id, body),
  delete: (id: string) =>
    api.delete(BASE, id),
};
