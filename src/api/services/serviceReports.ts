import { api } from '../client';
import type { ServiceReport } from '../../types';

const BASE = '/service-reports';

export const serviceReportsApi = {
  list: (params?: { page?: number; limit?: number }) =>
    api.getList<ServiceReport>(BASE, params),
  getById: (id: string) =>
    api.getById<ServiceReport>(BASE, id),
  create: (body: Partial<ServiceReport>) =>
    api.post<ServiceReport>(BASE, body),
  update: (id: string, body: Partial<ServiceReport>) =>
    api.patch<ServiceReport>(BASE, id, body),
  delete: (id: string) =>
    api.delete(BASE, id),
};
