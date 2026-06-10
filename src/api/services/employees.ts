import { api } from '../client';
import type { Employee, EmployeeOverview } from '../../types';

const BASE = '/employees';

export const employeesApi = {
  list: (params?: { page?: number; limit?: number }) =>
    api.getList<EmployeeOverview>(BASE, params),
  getById: (id: string) =>
    api.getById<Employee>(BASE, id),
  create: (body: Partial<Employee>) =>
    api.post<Employee>(BASE, body),
  update: (id: string, body: Partial<Employee>) =>
    api.patch<Employee>(BASE, id, body),
  delete: (id: string) =>
    api.delete(BASE, id),
};
