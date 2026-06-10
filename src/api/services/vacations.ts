import { api } from '../client';
import type { VacationRequest } from '../../types';

const BASE = '/vacations';

export const vacationsApi = {
  list: (params?: { page?: number; limit?: number; employee_id?: string }) =>
    api.getList<VacationRequest>(BASE, params),
  getById: (id: string) =>
    api.getById<VacationRequest>(BASE, id),
  create: (body: Partial<VacationRequest> & { days?: string[] }) =>
    api.post<VacationRequest>(BASE, body),
  update: (id: string, body: Partial<VacationRequest>) =>
    api.patch<VacationRequest>(BASE, id, body),
  delete: (id: string) =>
    api.delete(BASE, id),
};
