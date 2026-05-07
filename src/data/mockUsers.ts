import { User } from '../types';

export const TEST_ACCOUNTS = [
  {
    username: 'root',
    password: 'root123',
    role: 'ROOT' as const,
    fullName: 'Super Root Administrator',
    email: 'root@context7.io',
    description: 'Acceso total sin restricciones al sistema, configuraciones globales y pruebas.'
  },
  {
    username: 'admin',
    password: 'admin123',
    role: 'ADMIN' as const,
    fullName: 'Alejandro Mendoza',
    email: 'a.mendoza@context7.io',
    description: 'Gestor de usuarios, reportes y supervisión de managers y operarios.'
  },
  {
    username: 'manager',
    password: 'manager123',
    role: 'MANAGER' as const,
    fullName: 'Beatriz Salazar',
    email: 'b.salazar@context7.io',
    description: 'Gestión intermedio de personal, creación de usuarios y visualización.'
  },
  {
    username: 'user',
    password: 'user123',
    role: 'USER' as const,
    fullName: 'Carlos Fuentes',
    email: 'c.fuentes@context7.io',
    description: 'Rol de lectura y consulta básica. No posee permisos de modificación.'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    username: 'root',
    email: 'root@context7.io',
    fullName: 'Super Root Administrator',
    role: 'ROOT',
    status: 'ACTIVE',
    createdAt: '2025-01-10T08:30:00Z'
  },
  {
    id: 'usr-2',
    username: 'admin',
    email: 'a.mendoza@context7.io',
    fullName: 'Alejandro Mendoza',
    role: 'ADMIN',
    status: 'ACTIVE',
    createdAt: '2025-01-15T10:15:00Z'
  },
  {
    id: 'usr-3',
    username: 'manager',
    email: 'b.salazar@context7.io',
    fullName: 'Beatriz Salazar',
    role: 'MANAGER',
    status: 'ACTIVE',
    createdAt: '2025-02-01T14:22:00Z'
  },
  {
    id: 'usr-4',
    username: 'user',
    email: 'c.fuentes@context7.io',
    fullName: 'Carlos Fuentes',
    role: 'USER',
    status: 'ACTIVE',
    createdAt: '2025-02-12T09:05:00Z'
  },
  {
    id: 'usr-5',
    username: 'diana_reyes',
    email: 'd.reyes@context7.io',
    fullName: 'Diana Reyes',
    role: 'MANAGER',
    status: 'ACTIVE',
    createdAt: '2025-02-14T11:40:00Z'
  },
  {
    id: 'usr-6',
    username: 'eduardo_gomez',
    email: 'e.gomez@context7.io',
    fullName: 'Eduardo Gómez',
    role: 'USER',
    status: 'INACTIVE',
    createdAt: '2025-02-18T16:50:00Z'
  },
  {
    id: 'usr-7',
    username: 'gabriela_vaca',
    email: 'g.vaca@context7.io',
    fullName: 'Gabriela Vaca',
    role: 'ADMIN',
    status: 'INACTIVE',
    createdAt: '2025-01-20T13:12:00Z'
  },
  {
    id: 'usr-8',
    username: 'hugo_perez',
    email: 'h.perez@context7.io',
    fullName: 'Hugo Pérez',
    role: 'USER',
    status: 'ACTIVE',
    createdAt: '2025-02-20T10:00:00Z'
  }
];