# ON3 — Interfaces y Mock Data (referencia para Angular + Supabase)

> Documento generado a partir del proyecto Vite+React.
> Todos los archivos son TypeScript puro, sin dependencias externas.
> Se excluyó `mockInventory.ts` por ser muy extenso (~840 líneas, 49 items).
> Si lo necesitas, pídemelo y lo agrego.

---

## 📦 Tipos (`src/types/`)

### User

```typescript
export type UserRole = 'ROOT' | 'ADMIN' | 'MANAGER' | 'USER';

export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: UserRole;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
  updated_at: string;
  avatar_url?: string;
  city_id?: string;
}
```

### AuthUser

```typescript
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
```

### Employee

```typescript
export type VacationMonth = 'julio' | 'agosto' | 'septiembre' | 'partidas';

export interface VacationRequest {
  id: string;
  employee_id: string;
  type: 'cambio_mes' | 'dias_libres' | 'cambio_vacaciones';
  status: 'pendiente' | 'aprobado' | 'rechazado';
  requested_month?: VacationMonth;
  requested_days?: string[];
  notes?: string;
  created_at: string;
  resolved_at?: string;
}

export interface Employee {
  id: string;
  user_id: string | null;
  city_id: string | null;
  name: string;
  lastName1: string;
  lastName2: string;
  email: string;
  phone: string;
  category_id: string;
  status_id: string;
  work_center_id: string;
  active: boolean;
  shift: string;
  schedule: string;
  start_time: string;
  end_time: string;
  vacation_month: VacationMonth | null;
  vacation_year: number | null;
  vacation_days: number;
  own_days: number;
  accumulated_days: number;
  excess_days: number;
  created_at: string;
  updated_at: string;
  personal_email: string;
  phone_fixed: string;
  work_day: string;
  iban: string;
  locker: string;
  medical_check: boolean;
  works_holidays: boolean;
  contract_type: string;
  contract_start_date: string;
  contract_end_date: string | null;
  irpf: number;
}

export interface EmployeeOverview {
  id: string;
  email: string;
  name: string;
  lastName1: string;
  lastName2: string;
  category_id: string;
  work_day_id: string;
  work_center_id: string;
  status_id: string;
  city_id: string | null;
}

export interface EmployeeCategory {
  id: string;
  name: string;
}

export interface EmployeeStatus {
  id: string;
  name: string;
}

export interface WorkDay {
  id: string;
  name: string;
}

export interface Shift {
  id: string;
  name: string;
}

export interface ContractType {
  id: string;
  name: string;
}
```

### City

```typescript
export interface City {
  id: string;
  name: string;
}
```

### WorkCenter

```typescript
export interface WorkCenter {
  id: string;
  name: string;
  address: string;
  city_id: string;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
  updated_at: string;
}
```

### Vehicle

```typescript
export type VehicleType = 'BARREDORA' | 'CAMION' | 'FURGONETA' | 'TURISMO' | 'PORTER';
export type VehicleStatus = 'ACTIVO' | 'MANTENIMIENTO' | 'AVERIADO' | 'BAJA';
export type FuelType = 'DIESEL' | 'GASOLINA' | 'ELECTRICO' | 'GAS';

export interface VehicleTypeOption {
  id: string;
  name: string;
  type: VehicleType;
}

export interface Vehicle {
  id: string;
  licensePlate: string;
  model: string;
  brand: string;
  vehicle_type_id: string;
  status: VehicleStatus;
  vin: string;
  registration_date: string;
  itv_expiration: string;
  insurance_expiration: string;
  tax_expiration: string;
  fuel_type: FuelType;
  kilometers: number;
  last_review_date: string;
  next_review_kilometers: number;
  work_center_id: string;
  assigned_employee_id: string;
  observations: string;
  created_at: string;
  updated_at: string;
}

export interface VehicleOverview {
  id: string;
  licensePlate: string;
  model: string;
  brand: string;
  vehicle_type_id: string;
  status: VehicleStatus;
  work_center_id: string;
  kilometers: number;
}
```

### Service

```typescript
export type TaskStatus = 'PENDING' | 'COMPLETED';

export interface ServiceTask {
  id: string;
  dayIndex: number;
  taskIndex: number;
  description: string;
  status: TaskStatus;
}

export interface Service {
  id: string;
  work_center_id: string;
  name: string;
  type: string;
  tasks: ServiceTask[];
  created_at: string;
  updated_at: string;
}

export interface ServiceOverview {
  id: string;
  work_center_id: string;
  name: string;
  type: string;
  totalTasks: number;
  completedTasks: number;
}
```

### Inventory

```typescript
export type InventoryCategory = 'ropa' | 'epi' | 'maquinaria';

export interface InventoryCategoryOption {
  id: string;
  name: string;
  value: InventoryCategory;
}

export interface InventoryStatus {
  id: string;
  name: string;
}

export interface InventorySubtype {
  id: string;
  category: InventoryCategory;
  name: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  category: InventoryCategory;
  subtype_id: string;
  status_id: string;
  quantity: number;
  min_stock: number;
  unit: string;
  city_id: string;
  work_center_id: string;
  location: string;
  assigned_to: string | null;
  notes: string;
  size: string | null;
  color: string | null;
  material: string | null;
  gender: string | null;
  certification: string | null;
  safety_standard: string | null;
  serial_number: string | null;
  brand: string | null;
  model: string | null;
  expiration_date: string | null;
  warranty_expiration: string | null;
  last_maintenance: string | null;
  next_maintenance: string | null;
  created_at: string;
  updated_at: string;
}

export interface InventoryOverview {
  id: string;
  name: string;
  category: InventoryCategory;
  subtype_id: string;
  status_id: string;
  quantity: number;
  min_stock: number;
  unit: string;
  city_id: string;
  work_center_id: string;
  location: string;
}
```

### Test

```typescript
export interface MockTest {
  id: string;
  name: string;
  category: 'AUTH' | 'USER_CRUD' | 'RBAC' | 'JWT';
  description: string;
  status: 'IDLE' | 'RUNNING' | 'PASSED' | 'FAILED';
  errorMessage?: string;
  assertions: string[];
}
```

---

## 📦 Mock Data (`src/data/`)

### mockAuth.ts — Cuentas de prueba + sesión

```typescript
// 4 usuarios de prueba: ROOT, ADMIN, MANAGER, USER
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

// Crea una AuthSession fake (JWT mock con btoa + refresh_token aleatorio)
export const createMockAuthSession = (user: AuthUser): AuthSession => ({
  access_token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({ sub: user.id, role: user.app_metadata.role }))}.mock_signature`,
  token_type: 'bearer',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  refresh_token: `rt_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
  user
});
```

### mockUsers.ts — 8 usuarios

```typescript
export const INITIAL_USERS = [
  // IDs formato: usr_a1b2c3d4, usr_b2c3d4e5, etc.
  // city_id: 'city-1' (Alcalá) o 'city-2' (Guadalajara)
  { id: 'usr_a1b2c3d4', username: 'm.torres', email: 'm.torres@on3.com', full_name: 'Miguel Ángel Torres', role: 'ROOT', status: 'ACTIVE', created_at: '2025-01-10T08:30:00Z', updated_at: '2025-01-10T08:30:00Z', city_id: 'city-1' },
  { id: 'usr_b2c3d4e5', username: 'admin', email: 'a.mendoza@on3.com', full_name: 'Alejandro Mendoza', role: 'ADMIN', status: 'ACTIVE', created_at: '2025-01-15T10:15:00Z', updated_at: '2025-01-15T10:15:00Z', city_id: 'city-1' },
  { id: 'usr_c3d4e5f6', username: 'manager', email: 'b.salazar@on3.com', full_name: 'Beatriz Salazar', role: 'MANAGER', status: 'ACTIVE', created_at: '2025-02-01T14:22:00Z', updated_at: '2025-02-01T14:22:00Z', city_id: 'city-1' },
  { id: 'usr_d4e5f6g7', username: 'user', email: 'c.fuentes@on3.com', full_name: 'Carlos Fuentes', role: 'USER', status: 'ACTIVE', created_at: '2025-02-12T09:05:00Z', updated_at: '2025-02-12T09:05:00Z', city_id: 'city-1' },
  { id: 'usr_e5f6g7h8', username: 'diana_reyes', email: 'd.reyes@on3.com', full_name: 'Diana Reyes', role: 'MANAGER', status: 'ACTIVE', created_at: '2025-02-14T11:40:00Z', updated_at: '2025-02-14T11:40:00Z', city_id: 'city-2' },
  { id: 'usr_f6g7h8i9', username: 'eduardo_gomez', email: 'e.gomez@on3.com', full_name: 'Eduardo Gómez', role: 'USER', status: 'INACTIVE', created_at: '2025-02-18T16:50:00Z', updated_at: '2025-02-18T16:50:00Z', city_id: 'city-2' },
  { id: 'usr_g7h8i9j0', username: 'gabriela_vaca', email: 'g.vaca@on3.com', full_name: 'Gabriela Vaca', role: 'ADMIN', status: 'INACTIVE', created_at: '2025-01-20T13:12:00Z', updated_at: '2025-01-20T13:12:00Z', city_id: 'city-2' },
  { id: 'usr_h8i9j0k1', username: 'hugo_perez', email: 'h.perez@on3.com', full_name: 'Hugo Pérez', role: 'USER', status: 'ACTIVE', created_at: '2025-02-20T10:00:00Z', updated_at: '2025-02-20T10:00:00Z', city_id: 'city-1' },
];
```

### mockEmployees.ts — Lookups + 20 empleados

```typescript
// === LOOKUPS ===

export const INITIAL_CITIES = [
  { id: 'city-1', name: 'Alcalá de Henares' },
  { id: 'city-2', name: 'Guadalajara' },
];

export const INITIAL_EMPLOYEE_CATEGORIES = [
  { id: 'ec-1', name: 'Peón Limpieza' },
  { id: 'ec-2', name: 'Peón Recogida' },
  { id: 'ec-3', name: 'Oficial' },
  { id: 'ec-4', name: 'Oficial 2ª' },
  { id: 'ec-5', name: 'Mantenimiento' },
  { id: 'ec-6', name: 'Mecánico' },
  { id: 'ec-7', name: 'Encargado' },
  { id: 'ec-8', name: 'Encargado General' },
  { id: 'ec-9', name: 'Jefe de Servicio' },
  { id: 'ec-10', name: 'Administrativo' },
];

export const INITIAL_EMPLOYEE_STATUSES = [
  { id: 'es-1', name: 'Trabajando' },
  { id: 'es-2', name: 'Descanso' },
  { id: 'es-3', name: 'Baja' },
  { id: 'es-4', name: 'Días Propios' },
  { id: 'es-5', name: 'Días Acumulados' },
  { id: 'es-6', name: 'Vacaciones' },
];

export const INITIAL_WORK_DAYS = [
  { id: 'wd-1', name: 'Lunes a Viernes' },
  { id: 'wd-2', name: 'Fin de Semana' },
  { id: 'wd-3', name: 'Rotativo 1' },
  { id: 'wd-4', name: 'Rotativo 2' },
];

export const INITIAL_SHIFTS = [
  { id: 's-1', name: 'Mañana' },
  { id: 's-2', name: 'Tarde' },
  { id: 's-3', name: 'Noche' },
];

export const INITIAL_CONTRACT_TYPES = [
  { id: 'ct-1', name: 'Indefinido' },
  { id: 'ct-2', name: 'Temporal' },
  { id: 'ct-3', name: 'Obra' },
];

// === 20 EMPLEADOS ===
// IDs: emp_000001, emp_000002, ..., emp_000021
// Todos los campos de Employee rellenos.

// Patrón de generación:
const PADDED_IDS = ['000001','000002','000003','000004','000005','000006','000007',
  '000008','000009','000011','000012','000013','000014','000015','000016',
  '000017','000018','000019','000020','000021'];

const EMPLOYEES_SEED = [
  {
    user_id: 'usr_a1b2c3d4', city_id: 'city-1', name: 'Miguel Ángel', lastName1: 'Torres', lastName2: 'García',
    email: 'm.torres@on3.com', phone: '612345678', category_id: 'ec-1', status_id: 'es-1', work_center_id: 'wc-1',
    active: true, shift: 's-1', schedule: '08:00-16:00', start_time: '08:00', end_time: '16:00',
    vacation_month: 'julio', vacation_year: 2024, vacation_days: 22, own_days: 2, accumulated_days: 5, excess_days: 0,
    created_at: '2024-01-15T08:00:00Z', updated_at: '2024-01-15T08:00:00Z',
    personal_email: 'm.torres@gmail.com', phone_fixed: '918765432', work_day: 'wd-1',
    iban: 'ES7620770024003102571234', locker: 'L-001', medical_check: true, works_holidays: true,
    contract_type: 'ct-1', contract_start_date: '2023-06-01', contract_end_date: null, irpf: 15
  },
  // ... (19 más en el archivo real)
];

export const INITIAL_EMPLOYEES = EMPLOYEES_SEED.map((emp, i) => ({
  ...emp,
  id: `emp_${PADDED_IDS[i]}`
}));
```

> ⚠️ Los 20 empleados completos están en el archivo original `src/data/mockEmployees.ts` (~264 líneas).

### mockWorkCenters.ts — 21 centros de trabajo

```typescript
export const INITIAL_WORK_CENTERS = [
  // Alcalá de Henares (city-1):
  { id: 'wc-1',  name: 'Nave',          address: 'Calle Industria 42',         city_id: 'city-1', status: 'ACTIVE', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'wc-2',  name: 'Puerta Madrid', address: 'Av. Puerta de Madrid 15',   city_id: 'city-1', status: 'ACTIVE', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'wc-3',  name: 'Gilitos',       address: 'Polígono Gilitos 8',        city_id: 'city-1', status: 'ACTIVE', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'wc-4',  name: 'Moreras',       address: 'Calle Moreras 3',           city_id: 'city-1', status: 'ACTIVE', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'wc-5',  name: 'Garena',        address: 'Av. Garena 22',             city_id: 'city-1', status: 'ACTIVE', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'wc-6',  name: 'Divino Valles', address: 'Calle Divino Valles 7',     city_id: 'city-1', status: 'ACTIVE', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'wc-7',  name: 'Taller',        address: 'Polígono Industrial 12',    city_id: 'city-1', status: 'ACTIVE', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'wc-8',  name: 'Oficinas',      address: 'Calle Administración 1',    city_id: 'city-1', status: 'ACTIVE', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'wc-9',  name: 'Almacén',       address: 'Av. Logística 55',          city_id: 'city-1', status: 'ACTIVE', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  // Guadalajara (city-2):
  { id: 'wc-11', name: 'Centro01',      address: 'Av. Henares 100',           city_id: 'city-2', status: 'ACTIVE', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'wc-12', name: 'Centro02',      address: 'Calle Innovación 5',        city_id: 'city-2', status: 'ACTIVE', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'wc-13', name: 'Centro03',      address: 'Polígono Industrial 3',     city_id: 'city-2', status: 'ACTIVE', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'wc-14', name: 'Centro04',      address: 'Av. Estación 12',           city_id: 'city-2', status: 'ACTIVE', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'wc-15', name: 'Centro05',      address: 'Plaza Mayor 1',             city_id: 'city-2', status: 'ACTIVE', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'wc-16', name: 'Centro06',      address: 'Paseo Estación 45',         city_id: 'city-2', status: 'ACTIVE', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'wc-17', name: 'Centro07',      address: 'Av. Deporte 22',            city_id: 'city-2', status: 'INACTIVE', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'wc-18', name: 'Centro08',      address: 'Calle Comercio 8',          city_id: 'city-2', status: 'ACTIVE', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'wc-19', name: 'Centro09',      address: 'Calle Norte 33',            city_id: 'city-2', status: 'ACTIVE', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'wc-20', name: 'Centro10',      address: 'Calle Clavín 17',           city_id: 'city-2', status: 'INACTIVE', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'wc-21', name: 'Almacén Sur',   address: 'Polígono Industrial Sur 1', city_id: 'city-2', status: 'ACTIVE', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
];

export const INITIAL_WORK_CENTER_STATUSES = ['ACTIVE', 'INACTIVE'] as const;
```

### mockVehicles.ts — 5 tipos + 10 vehículos

```typescript
export const INITIAL_VEHICLE_TYPES = [
  { id: 'vt-1', name: 'RAVO',      type: 'BARREDORA' },
  { id: 'vt-2', name: 'Camión',    type: 'CAMION' },
  { id: 'vt-3', name: 'Furgoneta', type: 'FURGONETA' },
  { id: 'vt-4', name: 'Turismo',   type: 'TURISMO' },
  { id: 'vt-5', name: 'Porter',    type: 'PORTER' },
];

export const INITIAL_VEHICLES = [
  // IDs: veh_v001 a veh_v010
  // Matrículas reales (1234BCD, etc.)
  // Marcas: RAVO, Mercedes, Ford, Volkswagen, Piaggio, Peugeot
  // Combustibles: DIESEL, GASOLINA, GAS, ELECTRICO
  // Estados: ACTIVO, MANTENIMIENTO, AVERIADO, BAJA
  // work_centers: wc-1 a wc-7
  // assigned_employee: emp_000001 a emp_000010
];
```

> ⚠️ Los 10 vehículos completos están en `src/data/mockVehicles.ts` (~232 líneas).

### mockServices.ts — 6 tipos + 6 servicios (140 tasks c/u)

```typescript
export const INITIAL_SERVICE_TYPES = [
  'BARRIDO MIXTO', 'BARRIDO MANUAL', 'BARRIDO MECÁNICO',
  'BALDEO', 'RECOGIDA', 'VACIADO',
];

// Cada servicio genera 7 días × 20 tareas = 140 tasks
// Las tareas se marcan COMPLETED si dayIndex < 3, sino PENDING (salvo cada 4ª)
export const INITIAL_SERVICES = [
  { id: 'svc_1', work_center_id: 'wc-1', name: 'BMIX1', type: 'BARRIDO MIXTO' },
  { id: 'svc_2', work_center_id: 'wc-5', name: 'BMA2',  type: 'BARRIDO MANUAL' },
  { id: 'svc_3', work_center_id: 'wc-3', name: 'BMEC3', type: 'BARRIDO MECÁNICO' },
  { id: 'svc_4', work_center_id: 'wc-2', name: 'BALD1', type: 'BALDEO' },
  { id: 'svc_5', work_center_id: 'wc-7', name: 'RVOL1', type: 'RECOGIDA' },
  { id: 'svc_6', work_center_id: 'wc-6', name: 'VAC1',  type: 'VACIADO' },
];
```

### mockInventory.ts — 49 items (ropa, epi, maquinaria)

> Archivo muy extenso (~840 líneas). Ver `src/data/mockInventory.ts` directamente.

Resumen de lo que contiene:

| Categoría | Subtipos | Items |
|-----------|----------|-------|
| **ropa** | Pantalón, Camisa, Chaqueta, Forro | 20 items (tallas S/M/L/XL/XXL, colores) |
| **epi** | Casco, Guantes, Mascarilla, Máscara, Arnés, Protector, Gafas | 18 items |
| **maquinaria** | Sopladora, Desbrozadora, Cortacésped, Motocultor, Hidrolimpiadora, Barredora, Motosierra, Generador | 11 items |

---

## 🔗 Relaciones entre entidades

| Entidad | FK / Relación |
|---------|---------------|
| `User.city_id` | → `City.id` |
| `Employee.user_id` | → `User.id` |
| `Employee.city_id` | → `City.id` |
| `Employee.category_id` | → `EmployeeCategory.id` |
| `Employee.status_id` | → `EmployeeStatus.id` |
| `Employee.work_center_id` | → `WorkCenter.id` |
| `Employee.work_day` | → `WorkDay.id` |
| `Employee.shift` | → `Shift.id` |
| `Employee.contract_type` | → `ContractType.id` |
| `Vehicle.vehicle_type_id` | → `VehicleTypeOption.id` |
| `Vehicle.work_center_id` | → `WorkCenter.id` |
| `Vehicle.assigned_employee_id` | → `Employee.id` |
| `Service.work_center_id` | → `WorkCenter.id` |
| `InventoryItem.city_id` | → `City.id` |
| `InventoryItem.work_center_id` | → `WorkCenter.id` |
| `InventoryItem.subtype_id` | → `InventorySubtype.id` |
| `InventoryItem.status_id` | → `InventoryStatus.id` (según categoría) |
| `WorkCenter.city_id` | → `City.id` |

### Prefijos de IDs

| Prefijo | Entidad |
|---------|---------|
| `usr_` | User |
| `auth_` | AuthUser |
| `emp_` | Employee |
| `veh_v` | Vehicle |
| `wc-` | WorkCenter |
| `svc_` | Service |
| `inv_` | InventoryItem |
| `ec-` | EmployeeCategory |
| `es-` | EmployeeStatus |
| `wd-` | WorkDay |
| `s-` | Shift |
| `ct-` | ContractType |
| `vt-` | VehicleTypeOption |
| `city-` | City |
| `ic-` | InventoryCategory |
| `ist-` | InventorySubtype |
| `rs-` / `ms-` / `es-` | InventoryStatus (ropa/maquinaria/epi) |
