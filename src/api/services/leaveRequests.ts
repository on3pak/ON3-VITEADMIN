import { api } from '../client';
import type { LeaveRequest } from '../../types';

const BASE = '/leave-requests';

export const leaveRequestsApi = {
  list: (params?: { employee_id?: string }) =>
    api.getList<LeaveRequest>(BASE, params),
  getById: (id: string) =>
    api.get<LeaveRequest>(`${BASE}/${id}`),
  create: (body: Omit<LeaveRequest, 'id' | 'created_at' | 'updated_at'>) =>
    api.post<LeaveRequest>(BASE, body),
  update: (id: string, body: Partial<LeaveRequest>) =>
    api.patch<LeaveRequest>(BASE, id, body),
  delete: (id: string) =>
    api.delete(BASE, id),
};
