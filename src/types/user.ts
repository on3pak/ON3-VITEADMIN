export type UserRole = 'ROOT' | 'ADMIN' | 'MANAGER' | 'USER';

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  avatarUrl?: string;
}