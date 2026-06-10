import { api } from '../client';
import type { Service } from '../../types';

const BASE = '/services';

export const servicesApi = {
  list: (params?: { page?: number; limit?: number }) =>
    api.getList<Service>(BASE, params),
  getById: (id: string) =>
    api.getById<Service>(BASE, id),
  create: (body: Partial<Service>) =>
    api.post<Service>(BASE, body),
  update: (id: string, body: Partial<Service>) =>
    api.patch<Service>(BASE, id, body),
  delete: (id: string) =>
    api.delete(BASE, id),
};
