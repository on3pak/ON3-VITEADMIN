export type UserRole = 'ROOT' | 'ADMIN' | 'MANAGER' | 'USER';

export interface User {
  id: string;
  employee_id: string;
  username: string;
  email: string;
  full_name: string;
  role: UserRole;
  status: 'ACTIVE' | 'INACTIVE';
  language: 'EN' | 'ES';
  created_at: string;
  updated_at: string;
  avatar_url?: string;
  city_id?: string;
}
