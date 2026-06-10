import { api } from '../client';
import type { LoginPayload, LoginResponse } from '../types';

const BASE = '/auth';

export const authApi = {
  login: (payload: LoginPayload) =>
    api.post<LoginResponse>(`${BASE}/login`, payload),
};
