import { api } from '../client';
import type { WorkCenter } from '../../types';

const BASE = '/work-centers';

export const workCentersApi = {
  list: (params?: { page?: number; limit?: number }) =>
    api.getList<WorkCenter>(BASE, params),
  getById: (id: string) =>
    api.getById<WorkCenter>(BASE, id),
  create: (body: { name: string; city_id: string; address: string }) =>
    api.post<WorkCenter>(BASE, body),
  update: (id: string, body: Partial<WorkCenter>) =>
    api.patch<WorkCenter>(BASE, id, body),
  delete: (id: string) =>
    api.delete(BASE, id),
};
