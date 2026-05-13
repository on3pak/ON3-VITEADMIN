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
    id: 'a1b2c3d4e5f6g7h8i9j0k1l2',
    username: 'm.torres',
    email: 'm.torres@on3.com',
    fullName: 'Miguel Ángel Torres',
    role: 'ROOT',
    status: 'ACTIVE',
    createdAt: '2025-01-10T08:30:00Z',
    cityId: 'city-1'
  },
  {
    id: 'b2c3d4e5f6g7h8i9j0k1l2m3',
    username: 'admin',
    email: 'a.mendoza@on3.com',
    fullName: 'Alejandro Mendoza',
    role: 'ADMIN',
    status: 'ACTIVE',
    createdAt: '2025-01-15T10:15:00Z',
    cityId: 'city-1'
  },
  {
    id: 'c3d4e5f6g7h8i9j0k1l2m3n4',
    username: 'manager',
    email: 'b.salazar@on3.com',
    fullName: 'Beatriz Salazar',
    role: 'MANAGER',
    status: 'ACTIVE',
    createdAt: '2025-02-01T14:22:00Z',
    cityId: 'city-1'
  },
  {
    id: 'd4e5f6g7h8i9j0k1l2m3n4o5',
    username: 'user',
    email: 'c.fuentes@on3.com',
    fullName: 'Carlos Fuentes',
    role: 'USER',
    status: 'ACTIVE',
    createdAt: '2025-02-12T09:05:00Z',
    cityId: 'city-1'
  },
  {
    id: 'e5f6g7h8i9j0k1l2m3n4o5p6',
    username: 'diana_reyes',
    email: 'd.reyes@on3.com',
    fullName: 'Diana Reyes',
    role: 'MANAGER',
    status: 'ACTIVE',
    createdAt: '2025-02-14T11:40:00Z',
    cityId: 'city-2'
  },
  {
    id: 'f6g7h8i9j0k1l2m3n4o5p6q7',
    username: 'eduardo_gomez',
    email: 'e.gomez@on3.com',
    fullName: 'Eduardo Gómez',
    role: 'USER',
    status: 'INACTIVE',
    createdAt: '2025-02-18T16:50:00Z',
    cityId: 'city-2'
  },
  {
    id: 'g7h8i9j0k1l2m3n4o5p6q7r8',
    username: 'gabriela_vaca',
    email: 'g.vaca@on3.com',
    fullName: 'Gabriela Vaca',
    role: 'ADMIN',
    status: 'INACTIVE',
    createdAt: '2025-01-20T13:12:00Z',
    cityId: 'city-2'
  },
  {
    id: 'h8i9j0k1l2m3n4o5p6q7r8s9',
    username: 'hugo_perez',
    email: 'h.perez@on3.com',
    fullName: 'Hugo Pérez',
    role: 'USER',
    status: 'ACTIVE',
    createdAt: '2025-02-20T10:00:00Z',
    cityId: 'city-1'
  }
];