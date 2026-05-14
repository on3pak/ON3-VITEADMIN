import { User } from '../types';

export const TEST_ACCOUNTS = [
  {
    username: 'm.torres',
    password: 'root123',
    role: 'ROOT' as const,
    fullName: 'Miguel Ángel Torres',
    email: 'm.torres@on3.com',
    description: 'Acceso total sin restricciones al sistema, configuraciones globales y pruebas.'
  },
  {
    username: 'admin',
    password: 'admin123',
    role: 'ADMIN' as const,
    fullName: 'Alejandro Mendoza',
    email: 'a.mendoza@on3.com',
    description: 'Gestor de usuarios, reportes y supervisión de managers y operarios.'
  },
  {
    username: 'manager',
    password: 'manager123',
    role: 'MANAGER' as const,
    fullName: 'Beatriz Salazar',
    email: 'b.salazar@on3.com',
    description: 'Gestión intermedio de personal, creación de usuarios y visualización.'
  },
  {
    username: 'user',
    password: 'user123',
    role: 'USER' as const,
    fullName: 'Carlos Fuentes',
    email: 'c.fuentes@on3.com',
    description: 'Rol de lectura y consulta básica. No posee permisos de modificación.'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_a1b2c3d4',
    username: 'm.torres',
    email: 'm.torres@on3.com',
    full_name: 'Miguel Ángel Torres',
    role: 'ROOT',
    status: 'ACTIVE',
    created_at: '2025-01-10T08:30:00Z',
    updated_at: '2025-01-10T08:30:00Z',
    city_id: 'city-1'
  },
  {
    id: 'usr_b2c3d4e5',
    username: 'admin',
    email: 'a.mendoza@on3.com',
    full_name: 'Alejandro Mendoza',
    role: 'ADMIN',
    status: 'ACTIVE',
    created_at: '2025-01-15T10:15:00Z',
    updated_at: '2025-01-15T10:15:00Z',
    city_id: 'city-1'
  },
  {
    id: 'usr_c3d4e5f6',
    username: 'manager',
    email: 'b.salazar@on3.com',
    full_name: 'Beatriz Salazar',
    role: 'MANAGER',
    status: 'ACTIVE',
    created_at: '2025-02-01T14:22:00Z',
    updated_at: '2025-02-01T14:22:00Z',
    city_id: 'city-1'
  },
  {
    id: 'usr_d4e5f6g7',
    username: 'user',
    email: 'c.fuentes@on3.com',
    full_name: 'Carlos Fuentes',
    role: 'USER',
    status: 'ACTIVE',
    created_at: '2025-02-12T09:05:00Z',
    updated_at: '2025-02-12T09:05:00Z',
    city_id: 'city-1'
  },
  {
    id: 'usr_e5f6g7h8',
    username: 'diana_reyes',
    email: 'd.reyes@on3.com',
    full_name: 'Diana Reyes',
    role: 'MANAGER',
    status: 'ACTIVE',
    created_at: '2025-02-14T11:40:00Z',
    updated_at: '2025-02-14T11:40:00Z',
    city_id: 'city-2'
  },
  {
    id: 'usr_f6g7h8i9',
    username: 'eduardo_gomez',
    email: 'e.gomez@on3.com',
    full_name: 'Eduardo Gómez',
    role: 'USER',
    status: 'INACTIVE',
    created_at: '2025-02-18T16:50:00Z',
    updated_at: '2025-02-18T16:50:00Z',
    city_id: 'city-2'
  },
  {
    id: 'usr_g7h8i9j0',
    username: 'gabriela_vaca',
    email: 'g.vaca@on3.com',
    full_name: 'Gabriela Vaca',
    role: 'ADMIN',
    status: 'INACTIVE',
    created_at: '2025-01-20T13:12:00Z',
    updated_at: '2025-01-20T13:12:00Z',
    city_id: 'city-2'
  },
  {
    id: 'usr_h8i9j0k1',
    username: 'hugo_perez',
    email: 'h.perez@on3.com',
    full_name: 'Hugo Pérez',
    role: 'USER',
    status: 'ACTIVE',
    created_at: '2025-02-20T10:00:00Z',
    updated_at: '2025-02-20T10:00:00Z',
    city_id: 'city-1'
  }
];
