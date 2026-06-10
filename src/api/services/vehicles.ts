import { api } from '../client';
import type { Vehicle } from '../../types';

const BASE = '/vehicles';

export const vehiclesApi = {
  list: (params?: { page?: number; limit?: number }) =>
    api.getList<Vehicle>(BASE, params),
  getById: (id: string) =>
    api.getById<Vehicle>(BASE, id),
  create: (body: Partial<Vehicle>) =>
    api.post<Vehicle>(BASE, body),
  update: (id: string, body: Partial<Vehicle>) =>
    api.patch<Vehicle>(BASE, id, body),
  delete: (id: string) =>
    api.delete(BASE, id),
};
