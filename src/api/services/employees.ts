import { api } from '../client';
import type { Employee, VacationRequest } from '../../types';

export interface EmployeeDetail extends Employee {
  city: { id: string; name: string } | null;
  work_center: { id: string; name: string } | null;
  category: { id: string; name: string } | null;
  contract_type: { id: string; name: string } | null;
  shift: { id: string; name: string } | null;
  vacations: VacationRequest[];
}

const BASE = '/employees';

export const employeesApi = {
  list: (params?: { page?: number; limit?: number }) =>
    api.getList<Employee>(BASE, params),
  getById: (id: string) =>
    api.getById<Employee>(BASE, id),
  getDetail: (id: string) =>
    api.get<EmployeeDetail>(`${BASE}/${id}/detail`),
  create: (body: Partial<Employee>) =>
    api.post<Employee>(BASE, body),
  update: (id: string, body: Partial<Employee>) =>
    api.patch<Employee>(BASE, id, body),
  delete: (id: string) =>
    api.delete(BASE, id),
};
