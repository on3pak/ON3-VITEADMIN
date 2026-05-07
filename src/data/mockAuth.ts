import { AuthUser, AuthSession } from '../types/authUser';

export const mockAuthUsers: AuthUser[] = [
  {
    id: 'a1b2c3d4e5f6g7h8i9j0k1l2',
    email: 'm.torres@empresa.com',
    password: 'root123',
    email_confirmed_at: '2025-01-01T00:00:00Z',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    app_metadata: {
      provider: 'email',
      role: 'ROOT'
    },
    user_metadata: {
      email: 'm.torres@empresa.com',
      email_verified: true,
      full_name: 'Miguel Ángel Torres',
      user_name: 'm.torres'
    },
    aud: 'authenticated',
    confirmed_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 'b2c3d4e5f6g7h8i9j0k1l2m3',
    email: 'a.mendoza@empresa.com',
    password: 'admin123',
    email_confirmed_at: '2025-01-01T00:00:00Z',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    app_metadata: {
      provider: 'email',
      role: 'ADMIN'
    },
    user_metadata: {
      email: 'a.mendoza@empresa.com',
      email_verified: true,
      full_name: 'Alejandro Mendoza',
      user_name: 'admin'
    },
    aud: 'authenticated',
    confirmed_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 'c3d4e5f6g7h8i9j0k1l2m3n4',
    email: 'b.salazar@empresa.com',
    password: 'manager123',
    email_confirmed_at: '2025-01-01T00:00:00Z',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    app_metadata: {
      provider: 'email',
      role: 'MANAGER'
    },
    user_metadata: {
      email: 'b.salazar@empresa.com',
      email_verified: true,
      full_name: 'Beatriz Salazar',
      user_name: 'manager'
    },
    aud: 'authenticated',
    confirmed_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 'd4e5f6g7h8i9j0k1l2m3n4o5',
    email: 'c.fuentes@empresa.com',
    password: 'user123',
    email_confirmed_at: '2025-01-01T00:00:00Z',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    app_metadata: {
      provider: 'email',
      role: 'USER'
    },
    user_metadata: {
      email: 'c.fuentes@empresa.com',
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