import { api } from '../client';
import type { User } from '../../types';

const BASE = '/users';

export const usersApi = {
  list: (params?: { page?: number; limit?: number }) =>
    api.getList<User>(BASE, params),
  getById: (id: string) =>
    api.getById<User>(BASE, id),
  create: (body: { email: string; password: string; role: string; employee_id: string }) =>
    api.post<User>(BASE, body),
  update: (id: string, body: Partial<User>) =>
    api.patch<User>(BASE, id, body),
  delete: (id: string) =>
    api.delete(BASE, id),
};
