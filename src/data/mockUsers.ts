import { User } from '../types';

export const TEST_ACCOUNTS = [
  {
    username: 'm.torres1',
    password: 'root1',
    role: 'ROOT' as const,
    fullName: 'Miguel Ángel Torres López',
    email: 'm.torres1@on3.com',
    description: 'Acceso total sin restricciones al sistema, configuraciones globales y pruebas.'
  },
  {
    username: 'a.mendoza2',
    password: 'admin2',
    role: 'ADMIN' as const,
    fullName: 'Alejandro Mendoza García',
    email: 'a.mendoza2@on3.com',
    description: 'Gestor de usuarios, reportes y supervisión de managers y operarios.'
  },
  {
    username: 'b.salazar3',
    password: 'manager3',
    role: 'MANAGER' as const,
    fullName: 'Beatriz Salazar Ruiz',
    email: 'b.salazar3@on3.com',
    description: 'Gestión intermedio de personal, creación de usuarios y visualización.'
  },
  {
    username: 'c.fuentes4',
    password: 'user4',
    role: 'USER' as const,
    fullName: 'Carlos Fuentes Martínez',
    email: 'c.fuentes4@on3.com',
    description: 'Rol de lectura y consulta básica. No posee permisos de modificación.'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'a1b2c3d4-e5f6-47a7-b8i9-0k1l2m3n4o5p',
    employee_id: '000001',
    username: 'm.torres1',
    email: 'm.torres1@on3.com',
    full_name: 'Miguel Ángel Torres López',
    password: 'root1',
    role: 'ROOT',
    status: 'active',
    language: 'ES',
    created_at: '2025-01-10T08:30:00Z',
    updated_at: '2025-01-10T08:30:00Z',
    city_id: 'ci_000001'
    },
  {
    id: 'b2c3d4e5-f6a7-48b8-a9c0-1d2e3f4a5b6c',
    employee_id: '000002',
    username: 'a.mendoza2',
    email: 'a.mendoza2@on3.com',
    full_name: 'Alejandro Mendoza García',
    password: 'admin2',
    role: 'ADMIN',
    status: 'active',
    language: 'ES',
    created_at: '2025-01-15T10:15:00Z',
    updated_at: '2025-01-15T10:15:00Z',
    city_id: 'ci_000001'
  },
  {
    id: 'c3d4e5f6-a7b8-49c9-d0k1-2m3n4o5p6q7',
    employee_id: '000003',
    username: 'b.salazar3',
    email: 'b.salazar3@on3.com',
    full_name: 'Beatriz Salazar Ruiz',
    password: 'manager3',
    role: 'MANAGER',
    status: 'active',
    language: 'ES',
    created_at: '2025-02-01T14:22:00Z',
    updated_at: '2025-02-01T14:22:00Z',
    city_id: 'ci_000001'
  },
  {
    id: 'd4e5f6g7-b8c9-4ad0-e1l2-3n4o5p6q7r8',
    employee_id: '000004',
    username: 'c.fuentes4',
    email: 'c.fuentes4@on3.com',
    full_name: 'Carlos Fuentes Martínez',
    password: 'user4',
    role: 'USER',
    status: 'active',
    language: 'ES',
    created_at: '2025-02-12T09:05:00Z',
    updated_at: '2025-02-12T09:05:00Z',
    city_id: 'ci_000001'
  },
  {
    id: 'e5f6g7h8-c9d0-4be1-f2m3-4o5p6q7r8s9',
    employee_id: '000005',
    username: 'd.reyes5',
    email: 'd.reyes5@on3.com',
    full_name: 'Diana Reyes Morales',
    password: 'manager5',
    role: 'MANAGER',
    status: 'active',
    language: 'ES',
    created_at: '2025-02-14T11:40:00Z',
    updated_at: '2025-02-14T11:40:00Z',
    city_id: 'ci_000002'
  },
  {
    id: 'f6g7h8i9-d0e1-4cf2-g3n4-5p6q7r8s9t0',
    employee_id: '000006',
    username: 'e.gomez6',
    email: 'e.gomez6@on3.com',
    full_name: 'Eduardo Gómez Fernández',
    password: 'user6',
    role: 'USER',
    status: 'inactive',
    language: 'ES',
    created_at: '2025-02-18T16:50:00Z',
    updated_at: '2025-02-18T16:50:00Z',
    city_id: 'ci_000002'
  },
  {
    id: 'g7h8i9j0-e1f2-4dg3-h4o5-6q7r8s9t0u1',
    employee_id: '000007',
    username: 'g.vaca7',
    email: 'g.vaca7@on3.com',
    full_name: 'Gabriela Vaca Rodríguez',
    password: 'admin7',
    role: 'ADMIN',
    status: 'inactive',
    language: 'ES',
    created_at: '2025-01-20T13:12:00Z',
    updated_at: '2025-01-20T13:12:00Z',
    city_id: 'ci_000002'
  },
  {
    id: 'h8i9j0k1-f2g3-4eh4-i5p6-7r8s9t0u1v2',
    employee_id: '000008',
    username: 'h.perez8',
    email: 'h.perez8@on3.com',
    full_name: 'Hugo Pérez López',
    password: 'user8',
    role: 'USER',
    status: 'active',
    language: 'ES',
    created_at: '2025-02-20T10:00:00Z',
    updated_at: '2025-02-20T10:00:00Z',
    city_id: 'ci_000001'
  }
];
