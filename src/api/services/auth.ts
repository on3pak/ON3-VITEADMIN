import { api } from '../client';
import type { LoginPayload, LoginResponse } from '../types';
import type { Employee, VacationRequest } from '../../types';

export interface AuthProfile {
  user: {
    id: string;
    employee_id: string | null;
    email: string;
    full_name: string;
    role: 'ROOT' | 'ADMIN' | 'MANAGER' | 'USER';
    status: 'ACTIVE' | 'INACTIVE';
    language: 'ES' | 'EN';
    avatar_url?: string | null;
    city_id?: string | null;
    dark_mode?: boolean;
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
  logout: () =>
    api.postRaw<{ message: string }>(`${BASE}/logout`, {}),
  updateProfile: (body: { dark_mode?: boolean }) =>
    api.patch<AuthProfile>(BASE, 'me', body),
};
