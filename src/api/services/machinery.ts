import { api } from '../client';
import type { MachineryItem } from '../../types';

const BASE = '/machinery';

export const machineryApi = {
  list: (params?: { page?: number; limit?: number }) =>
    api.getList<MachineryItem>(BASE, params),
  getById: (id: string) =>
    api.getById<MachineryItem>(BASE, id),
  create: (body: Partial<MachineryItem>) =>
    api.post<MachineryItem>(BASE, body),
  update: (id: string, body: Partial<MachineryItem>) =>
    api.patch<MachineryItem>(BASE, id, body),
  delete: (id: string) =>
    api.delete(BASE, id),
};
