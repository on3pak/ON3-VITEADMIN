import { UserRole } from './user';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface JwtPayload {
  sub: string;
  username: string;
  role: UserRole;
  fullName: string;
  iat: number;
  exp: number;
  iss: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}