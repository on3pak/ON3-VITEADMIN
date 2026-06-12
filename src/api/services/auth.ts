import { api } from '../client';
import type { LoginPayload, LoginResponse } from '../types';
import type { Employee, VacationRequest } from '../../types';

export interface AuthProfile {
  user: {
    id: string;
    email: string;
    role: 'ROOT' | 'ADMIN' | 'MANAGER' | 'USER';
    employee_id: string | null;
    city_id: string;
  };
  employee: Employee | null;
  vacations: VacationRequest[];
}

const BASE = '/auth';

export const authApi = {
  login: (payload: LoginPayload) =>
    api.post<LoginResponse>(`${BASE}/login`, payload),
  me: () =>
    api.get<AuthProfile>(`${BASE}/me`),
};
