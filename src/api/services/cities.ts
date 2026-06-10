import { api } from '../client';
import type { City } from '../../types';

const BASE = '/cities';

export const citiesApi = {
  list: (params?: { page?: number; limit?: number }) =>
    api.getList<City>(BASE, params),
  getById: (id: string) =>
    api.getById<City>(BASE, id),
  create: (body: { name: string }) =>
    api.post<City>(BASE, body),
  update: (id: string, body: Partial<City>) =>
    api.patch<City>(BASE, id, body),
  delete: (id: string) =>
    api.delete(BASE, id),
};
