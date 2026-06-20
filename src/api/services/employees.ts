import { api } from '../client';
import type {
  Employee, EmployeeDetail, VacationRequest,
  EmployeeSize, EmployeeSchedule, EmployeeContract,
  EmployeePayroll, EmployeeExtras, EmployeeLeaveBalance,
  EmployeeDrivingLicense, EmployeeDocument,
} from '../../types';

const BASE = '/employees';

export const employeesApi = {
  list: (params?: { page?: number; limit?: number; work_center_id?: string }) =>
    api.getList<Employee>(BASE, params),
  getById: (id: string) =>
    api.get<Employee>(`${BASE}/${id}`),
  getDetail: (id: string) =>
    api.get<EmployeeDetail>(`${BASE}/${id}/detail`),
  create: (body: Record<string, unknown>) =>
    api.post<Employee>(BASE, body),
  wizard: (form: FormData) =>
    api.upload<{ id: string }>(`${BASE}/wizard`, form),
  update: (id: string, body: Record<string, unknown>) =>
    api.patch<Employee>(BASE, id, body),
  delete: (id: string) =>
    api.delete(BASE, id),

  sizes: {
    list: (employeeId: string) =>
      api.getList<EmployeeSize>(`${BASE}/${employeeId}/sizes`),
    getById: (employeeId: string, id: string) =>
      api.get<EmployeeSize>(`${BASE}/${employeeId}/sizes/${id}`),
    create: (employeeId: string, body: Omit<EmployeeSize, 'id' | 'employee_id'>) =>
      api.post<EmployeeSize>(`${BASE}/${employeeId}/sizes`, body),
    update: (employeeId: string, id: string, body: Partial<EmployeeSize>) =>
      api.patch<EmployeeSize>(`${BASE}/${employeeId}/sizes`, id, body),
    delete: (employeeId: string, id: string) =>
      api.delete(`${BASE}/${employeeId}/sizes`, id),
  },

  drivingLicenses: {
    list: (employeeId: string) =>
      api.getList<EmployeeDrivingLicense>(`${BASE}/${employeeId}/driving-licenses`),
    getById: (employeeId: string, id: string) =>
      api.get<EmployeeDrivingLicense>(`${BASE}/${employeeId}/driving-licenses/${id}`),
    create: (employeeId: string, body: Omit<EmployeeDrivingLicense, 'id' | 'employee_id'>) =>
      api.post<EmployeeDrivingLicense>(`${BASE}/${employeeId}/driving-licenses`, body),
    update: (employeeId: string, id: string, body: Partial<EmployeeDrivingLicense>) =>
      api.patch<EmployeeDrivingLicense>(`${BASE}/${employeeId}/driving-licenses`, id, body),
    delete: (employeeId: string, id: string) =>
      api.delete(`${BASE}/${employeeId}/driving-licenses`, id),
    upload: (employeeId: string, id: string, file: File) => {
      const form = new FormData();
      form.append('file', file);
      return api.upload(`${BASE}/${employeeId}/driving-licenses/${id}/upload`, form);
    },
  },

  documents: {
    list: (employeeId: string) =>
      api.getList<EmployeeDocument>(`${BASE}/${employeeId}/documents`),
    getById: (employeeId: string, id: string) =>
      api.get<EmployeeDocument>(`${BASE}/${employeeId}/documents/${id}`),
    create: (employeeId: string, body: Omit<EmployeeDocument, 'id' | 'employee_id'>) =>
      api.post<EmployeeDocument>(`${BASE}/${employeeId}/documents`, body),
    update: (employeeId: string, id: string, body: Partial<EmployeeDocument>) =>
      api.patch<EmployeeDocument>(`${BASE}/${employeeId}/documents`, id, body),
    delete: (employeeId: string, id: string) =>
      api.delete(`${BASE}/${employeeId}/documents`, id),
    upload: (employeeId: string, id: string, file: File) => {
      const form = new FormData();
      form.append('file', file);
      return api.upload(`${BASE}/${employeeId}/documents/${id}/upload`, form);
    },
  },

  payroll: {
    get: (employeeId: string) =>
      api.get<EmployeePayroll>(`${BASE}/${employeeId}/payroll`),
    upsert: (employeeId: string, body: Omit<EmployeePayroll, 'id' | 'employee_id'>) =>
      api.post<EmployeePayroll>(`${BASE}/${employeeId}/payroll`, body),
    update: (employeeId: string, id: string, body: Partial<EmployeePayroll>) =>
      api.patch<EmployeePayroll>(`${BASE}/${employeeId}/payroll`, id, body),
  },

  extras: {
    get: (employeeId: string) =>
      api.get<EmployeeExtras>(`${BASE}/${employeeId}/extras`),
    upsert: (employeeId: string, body: Omit<EmployeeExtras, 'id' | 'employee_id'>) =>
      api.post<EmployeeExtras>(`${BASE}/${employeeId}/extras`, body),
    update: (employeeId: string, id: string, body: Partial<EmployeeExtras>) =>
      api.patch<EmployeeExtras>(`${BASE}/${employeeId}/extras`, id, body),
  },

  schedule: {
    get: (employeeId: string) =>
      api.get<EmployeeSchedule>(`${BASE}/${employeeId}/schedule`),
    upsert: (employeeId: string, body: Omit<EmployeeSchedule, 'id' | 'employee_id'>) =>
      api.post<EmployeeSchedule>(`${BASE}/${employeeId}/schedule`, body),
    update: (employeeId: string, id: string, body: Partial<EmployeeSchedule>) =>
      api.patch<EmployeeSchedule>(`${BASE}/${employeeId}/schedule`, id, body),
  },

  contracts: {
    get: (employeeId: string) =>
      api.get<EmployeeContract>(`${BASE}/${employeeId}/contracts`),
    upsert: (employeeId: string, body: Omit<EmployeeContract, 'id' | 'employee_id'>) =>
      api.post<EmployeeContract>(`${BASE}/${employeeId}/contracts`, body),
    update: (employeeId: string, id: string, body: Partial<EmployeeContract>) =>
      api.patch<EmployeeContract>(`${BASE}/${employeeId}/contracts`, id, body),
  },

  leaveBalances: {
    list: (employeeId: string) =>
      api.getList<EmployeeLeaveBalance>(`${BASE}/${employeeId}/leave-balances`),
    update: (employeeId: string, id: string, body: Partial<EmployeeLeaveBalance>) =>
      api.patch<EmployeeLeaveBalance>(`${BASE}/${employeeId}/leave-balances`, id, body),
  },
};
