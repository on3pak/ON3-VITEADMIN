export type UserRole = 'root' | 'admin' | 'manager' | 'user';

export interface User {
  id: string;
  employee_id: string;
  username: string;
  email: string;
  full_name: string;
  password: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'deleted';
  language: 'en' | 'es';
  created_at: string;
  updated_at: string;
  avatar_url?: string;
  city_id?: string;
  dark_mode?: boolean;
}
