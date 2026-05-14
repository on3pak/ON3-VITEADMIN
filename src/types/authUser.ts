import { User, UserRole } from './user';

export interface AuthUser {
  id: string;
  user_id: string;
  email: string;
  password: string;
  email_confirmed_at: string;
  created_at: string;
  updated_at: string;
  app_metadata: {
    provider: string;
    role: string;
  };
  user_metadata: {
    email: string;
    email_verified: boolean;
    full_name: string;
    user_name: string;
  };
  aud: string;
  confirmed_at: string;
}

export interface AuthSession {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
  refresh_token: string;
  user: AuthUser;
}

export interface JwtPayload {
  sub: string;
  username: string;
  role: UserRole;
  full_name: string;
  iat: number;
  exp: number;
  iss: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}