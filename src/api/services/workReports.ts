import { api } from '../client';
import type { WorkReport } from '../../types';

const BASE = '/work-reports';

export const workReportsApi = {
  list: (params?: { page?: number; limit?: number; employee_id?: string; date?: string }) =>
    api.getList<WorkReport>(BASE, params),
  getById: (id: string) =>
    api.getById<WorkReport>(BASE, id),
  create: (body: Partial<WorkReport>) =>
    api.post<WorkReport>(BASE, body),
  update: (id: string, body: Partial<WorkReport>) =>
    api.patch<WorkReport>(BASE, id, body),
  delete: (id: string) =>
    api.delete(BASE, id),
};
