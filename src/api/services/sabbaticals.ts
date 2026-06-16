import { api } from '../client';

interface Sabbatical {
  id: string; employee_id: string; reason: string;
  start_date: string; end_date: string; duration_days: number;
  status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled';
  notes: string; created_at: string; updated_at: string;
}

const BASE = '/sabbaticals';

export const sabbaticalsApi = {
  list: (params?: { employee_id?: string }) =>
    api.getList<Sabbatical>(BASE, params),
  getById: (id: string) => api.get<Sabbatical>(`${BASE}/${id}`),
  create: (body: Omit<Sabbatical, 'id' | 'created_at' | 'updated_at'>) =>
    api.post<Sabbatical>(BASE, body),
  update: (id: string, body: Partial<Sabbatical>) =>
    api.patch<Sabbatical>(BASE, id, body),
  delete: (id: string) => api.delete(BASE, id),
};
