import { User } from '../types';

export const TEST_ACCOUNTS = [
  {
    username: 'm.torres',
    password: 'root123',
    role: 'ROOT' as const,
    fullName: 'Miguel Ángel Torres',
    email: '000001@on3.com',
    description: 'Acceso total sin restricciones al sistema, configuraciones globales y pruebas.'
  },
  {
    username: 'admin',
    password: 'admin123',
    role: 'ADMIN' as const,
    fullName: 'Alejandro Mendoza',
    email: '000002@on3.com',
    description: 'Gestor de usuarios, reportes y supervisión de managers y operarios.'
  },
  {
    username: 'manager',
    password: 'manager123',
    role: 'MANAGER' as const,
    fullName: 'Beatriz Salazar',
    email: '000003@on3.com',
    description: 'Gestión intermedio de personal, creación de usuarios y visualización.'
  },
  {
    username: 'user',
    password: 'user123',
    role: 'USER' as const,
    fullName: 'Carlos Fuentes',
    email: '000004@on3.com',
    description: 'Rol de lectura y consulta básica. No posee permisos de modificación.'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'a1b2c3d4-e5f6-47a7-b8i9-0k1l2m3n4o5p',
    employee_id: '000001',
    username: 'm.torres',
    email: '000001@on3.com',
    full_name: 'Miguel Ángel Torres',
    role: 'ROOT',
    status: 'ACTIVE',
    language: 'ES',
    created_at: '2025-01-10T08:30:00Z',
    updated_at: '2025-01-10T08:30:00Z',
    city_id: 'ci_000001'
    },
  {
    id: 'b2c3d4e5-f6a7-48b8-c9j0-1l2m3n4o5p6',
    employee_id: '000002',
    username: 'admin',
    email: '000002@on3.com',
    full_name: 'Alejandro Mendoza',
    role: 'ADMIN',
    status: 'ACTIVE',
    language: 'ES',
    created_at: '2025-01-15T10:15:00Z',
    updated_at: '2025-01-15T10:15:00Z',
    city_id: 'ci_000001'
  },
  {
    id: 'c3d4e5f6-a7b8-49c9-d0k1-2m3n4o5p6q7',
    employee_id: '000003',
    username: 'manager',
    email: '000003@on3.com',
    full_name: 'Beatriz Salazar',
    role: 'MANAGER',
    status: 'ACTIVE',
    language: 'ES',
    created_at: '2025-02-01T14:22:00Z',
    updated_at: '2025-02-01T14:22:00Z',
    city_id: 'ci_000001'
  },
  {
    id: 'd4e5f6g7-b8c9-4ad0-e1l2-3n4o5p6q7r8',
    employee_id: '000004',
    username: 'user',
    email: '000004@on3.com',
    full_name: 'Carlos Fuentes',
    role: 'USER',
    status: 'ACTIVE',
    language: 'ES',
    created_at: '2025-02-12T09:05:00Z',
    updated_at: '2025-02-12T09:05:00Z',
    city_id: 'ci_000001'
  },
  {
    id: 'e5f6g7h8-c9d0-4be1-f2m3-4o5p6q7r8s9',
    employee_id: '000005',
    username: 'diana_reyes',
    email: '000005@on3.com',
    full_name: 'Diana Reyes',
    role: 'MANAGER',
    status: 'ACTIVE',
    language: 'ES',
    created_at: '2025-02-14T11:40:00Z',
    updated_at: '2025-02-14T11:40:00Z',
    city_id: 'ci_000002'
  },
  {
    id: 'f6g7h8i9-d0e1-4cf2-g3n4-5p6q7r8s9t0',
    employee_id: '000006',
    username: 'eduardo_gomez',
    email: '000006@on3.com',
    full_name: 'Eduardo Gómez',
    role: 'USER',
    status: 'INACTIVE',
    language: 'ES',
    created_at: '2025-02-18T16:50:00Z',
    updated_at: '2025-02-18T16:50:00Z',
    city_id: 'ci_000002'
  },
  {
    id: 'g7h8i9j0-e1f2-4dg3-h4o5-6q7r8s9t0u1',
    employee_id: '000007',
    username: 'gabriela_vaca',
    email: '000007@on3.com',
    full_name: 'Gabriela Vaca',
    role: 'ADMIN',
    status: 'INACTIVE',
    language: 'ES',
    created_at: '2025-01-20T13:12:00Z',
    updated_at: '2025-01-20T13:12:00Z',
    city_id: 'ci_000002'
  },
  {
    id: 'h8i9j0k1-f2g3-4eh4-i5p6-7r8s9t0u1v2',
    employee_id: '000008',
    username: 'hugo_perez',
    email: '000008@on3.com',
    full_name: 'Hugo Pérez',
    role: 'USER',
    status: 'ACTIVE',
    language: 'ES',
    created_at: '2025-02-20T10:00:00Z',
    updated_at: '2025-02-20T10:00:00Z',
    city_id: 'ci_000001'
  }
];
