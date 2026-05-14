import { AuthUser, AuthSession } from '../types/authUser';

export const mockAuthUsers: AuthUser[] = [
  {
    id: 'auth_001',
    user_id: 'usr_a1b2c3d4',
    email: 'm.torres@on3.com',
    password: 'root123',
    email_confirmed_at: '2025-01-01T00:00:00Z',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    app_metadata: {
      provider: 'email',
      role: 'ROOT',
    },
    user_metadata: {
      email: 'm.torres@on3.com',
      email_verified: true,
      full_name: 'Miguel Ángel Torres',
      user_name: 'm.torres'
    },
    aud: 'authenticated',
    confirmed_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 'auth_002',
    user_id: 'usr_b2c3d4e5',
    email: 'a.mendoza@on3.com',
    password: 'admin123',
    email_confirmed_at: '2025-01-01T00:00:00Z',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    app_metadata: {
      provider: 'email',
      role: 'ADMIN',
    },
    user_metadata: {
      email: 'a.mendoza@on3.com',
      email_verified: true,
      full_name: 'Alejandro Mendoza',
      user_name: 'admin'
    },
    aud: 'authenticated',
    confirmed_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 'auth_003',
    user_id: 'usr_c3d4e5f6',
    email: 'b.salazar@on3.com',
    password: 'manager123',
    email_confirmed_at: '2025-01-01T00:00:00Z',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    app_metadata: {
      provider: 'email',
      role: 'MANAGER',
    },
    user_metadata: {
      email: 'b.salazar@on3.com',
      email_verified: true,
      full_name: 'Beatriz Salazar',
      user_name: 'manager'
    },
    aud: 'authenticated',
    confirmed_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 'auth_004',
    user_id: 'usr_d4e5f6g7',
    email: 'c.fuentes@on3.com',
    password: 'user123',
    email_confirmed_at: '2025-01-01T00:00:00Z',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    app_metadata: {
      provider: 'email',
      role: 'USER',
    },
    user_metadata: {
      email: 'c.fuentes@on3.com',
      email_verified: true,
      full_name: 'Carlos Fuentes',
      user_name: 'user'
    },
    aud: 'authenticated',
    confirmed_at: '2025-01-01T00:00:00Z'
  }
];

export const createMockAuthSession = (user: AuthUser): AuthSession => ({
  access_token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({ sub: user.id, role: user.app_metadata.role }))}.mock_signature`,
  token_type: 'bearer',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  refresh_token: `rt_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
  user
});
