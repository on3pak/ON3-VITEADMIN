# Optimización de Endpoints — Propuesta

## Problema actual

| Flujo | Llamadas |
|-------|----------|
| Login → Profile | `POST /auth/login` → `GET /employees/:id` → `GET /vacations` |
| Dashboard stats | `GET /employees` + `GET /vehicles` + `GET /inventory` + ... (listas completas) |
| Abrir formulario (crear/editar) | `GET /lookups/cities` + `/lookups/work_centers` + ... |

**Objetivo:** Reducir viajes redondos y payload transfiriendo solo lo necesario.

---

## 1. `GET /auth/me` — Perfil completo post-login

Devuelve usuario + empleado asociado + vacaciones en una sola llamada.

### Frontend — Llamar después del login

```ts
// src/api/services/auth.ts
import { apiClient } from '../client';

export interface AuthProfile {
  user: {
    id: string;
    email: string;
    role: 'ROOT' | 'ADMIN' | 'MANAGER' | 'USER';
    employee_id: string | null;
    city_id: string;
    full_name: string;
  };
  employee: {
    id: string;
    full_name: string;
    position: string;
    work_center_id: string;
    city_id: string;
    // ... resto de campos de Employee
  } | null;
  vacations: Array<{
    id: string;
    type: string;
    requested_month: string;
    days: string[];
    status: string;
  }>;
}

export const authApi = {
  me: () => apiClient.get<AuthProfile>('/auth/me'),
  login: (data: { email: string; password: string }) =>
    apiClient.post<{ accessToken: string; user: AuthProfile['user'] }>('/auth/login', data),
};
```

### Consumo en AuthContext

```ts
// src/context/AuthContext.tsx — después de login exitoso
const profile = await authApi.me();
setUser(profile.user);
// profile.employee y profile.vacations ya están disponibles
// sin llamadas adicionales
```

### Respuesta esperada

```json
{
  "user": {
    "id": "u_000001",
    "email": "admin@on3.com",
    "role": "ADMIN",
    "employee_id": "000001",
    "city_id": "ci_000001",
    "full_name": "Admin ON3"
  },
  "employee": {
    "id": "000001",
    "full_name": "Admin ON3",
    "position": "Gerente",
    "work_center_id": "wc_000001",
    "city_id": "ci_000001",
    "email": "admin@on3.com",
    "phone": "+34 600 000 001",
    "status": "activo",
    "category_id": "ec_000001",
    "contract_type_id": "ct_1",
    "shift_id": "s_1"
  },
  "vacations": [
    {
      "id": "v_000001",
      "type": "FREE_DAYS",
      "requested_month": "AGOSTO",
      "days": ["2026-08-01", "2026-08-15"],
      "status": "approved"
    }
  ]
}
```

---

## 2. `GET /dashboard/stats` — Resumen numérico para tarjetas

Endpoint que ya existe pero no se usa desde frontend. Devuelve conteos, no listas completas.

### Frontend — Nuevo servicio

```ts
// src/api/services/dashboard.ts
export interface DashboardStats {
  employees: number;
  work_centers: number;
  vehicles: number;
  inventory_items: number;
  services: number;
  machinery: number;
  active_employees: number;
  pending_services: number;
  low_stock_items: number;
}

export const dashboardApi = {
  getStats: () => apiClient.get<DashboardStats>('/dashboard'),
};
```

### Consumo en DashboardViews

```ts
// Ej: src/views/dashboard/DashboardEmployeesView.tsx
import { dashboardApi } from '../../api/services/dashboard';
import { useAuth } from '../../context/AuthContext';

function DashboardEmployeesView() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    dashboardApi.getStats().then(setStats).catch(() => {});
  }, []);

  // stats.employees, stats.active_employees, etc.
}
```

**Beneficio:** Hoy cada dashboard view carga el listado completo de su entidad solo para contar. Con este endpoint se ahorra ~90% del payload.

---

## 3. `GET /lookups` — Todos los catálogos en uno

Reemplaza los 3+ endpoints individuales por uno solo. Datos ligeros y casi estáticos.

### Frontend — Servicio

```ts
// src/api/services/lookups.ts
export interface AllLookups {
  cities: Array<{ id: string; name: string }>;
  work_centers: Array<{ id: string; name: string; city_id: string }>;
  employees: Array<{ id: string; full_name: string }>;
  employee_categories: Array<{ id: string; name: string }>;
  employee_statuses: Array<{ id: string; name: string }>;
  contract_types: Array<{ id: string; name: string }>;
  shifts: Array<{ id: string; name: string }>;
  work_days: Array<{ id: string; name: string }>;
  vehicle_types: Array<{ id: string; name: string }>;
  cities: Array<{ id: string; name: string }>;
}

export const lookupsApi = {
  getAll: () => apiClient.get<AllLookups>('/lookups'),
};
```

### Consumo con caché simple

```ts
// src/hooks/useLookups.ts
import { useCallback, useEffect, useState } from 'react';
import { lookupsApi, AllLookups } from '../api/services/lookups';

const cache = new Map<string, { data: AllLookups; expires: number }>();
const TTL = 60_000; // 1 minuto

export function useLookups() {
  const [lookups, setLookups] = useState<AllLookups | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const cached = cache.get('all');
    if (cached && cached.expires > Date.now()) {
      setLookups(cached.data);
      setLoading(false);
      return;
    }
    try {
      const data = await lookupsApi.getAll();
      cache.set('all', { data, expires: Date.now() + TTL });
      setLookups(data);
    } catch {
      // silencioso
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { lookups, loading, refresh: load };
}
```

### Uso en formularios

```tsx
// Ej: dentro de EmployeeFormModal
const { lookups } = useLookups();

return (
  <select>
    {lookups?.cities.map(c => (
      <option key={c.id} value={c.id}>{c.name}</option>
    ))}
  </select>
);
```

---

## 4. `GET /employees/:id/detail` — Empleado con relaciones

Endpoint detallado que embebe ciudad, centro de trabajo, categoría, contrato, turno y vacaciones.

### Respuesta esperada

```json
{
  "id": "000001",
  "full_name": "Admin ON3",
  "email": "admin@on3.com",
  "phone": "+34 600 000 001",
  "position": "Gerente",
  "status": "activo",
  "city": { "id": "ci_000001", "name": "Madrid" },
  "work_center": { "id": "wc_000001", "name": "Taller Central" },
  "category": { "id": "ec_000001", "name": "Técnico" },
  "contract_type": { "id": "ct_1", "name": "Indefinido" },
  "shift": { "id": "s_1", "name": "Mañana" },
  "vacations": [
    { "id": "v_000001", "type": "FREE_DAYS", "requested_month": "AGOSTO", "days": ["2026-08-01"], "status": "approved" }
  ]
}
```

### Frontend

```ts
// src/api/services/employees.ts (añadir)
export const employeesApi = {
  // ... métodos existentes
  getDetail: (id: string) => apiClient.get<EmployeeDetail>(`/employees/${id}/detail`),
};
```

---

## 5. `GET /vehicles/:id/detail` — Vehículo con relaciones

Análogo al de empleados: embebe tipo de vehículo, centro de trabajo, estado.

### Respuesta esperada

```json
{
  "id": "vh_000001",
  "plate": "1234 ABC",
  "brand": "Renault",
  "model": "Kangoo",
  "status": "activo",
  "vehicle_type": { "id": "vt-1", "name": "Furgoneta" },
  "work_center": { "id": "wc_000001", "name": "Taller Central" },
  "services": [
    { "id": "sv_000001", "name": "Cambio de aceite" }
  ]
}
```

---

## Resumen de reducción de viajes

| Flujo | Antes | Después | Ahorro |
|-------|-------|---------|--------|
| Login → Profile | 3 llamadas | 1 (`/auth/me`) | -66% |
| Dashboard principal | 5-6 llamadas (listas completas) | 1 (`/dashboard/stats`) | -80% |
| Abrir formulario crear | 2-3 llamadas | 0 (caché) | -100% |
| Employee Detail | 3-4 llamadas | 1 (`/employees/:id/detail`) | -70% |
| Vehicle Detail | 2-3 llamadas | 1 (`/vehicles/:id/detail`) | -65% |

## Orden de implementación sugerido

1. **Alta** — `GET /auth/me` + consumirlo en AuthContext + DashboardProfileView
2. **Alta** — `GET /lookups` + hook `useLookups` con caché
3. **Media** — `GET /dashboard/stats` (ya existe en backend, solo consumirlo)
4. **Baja** — `GET /employees/:id/detail` y `GET /vehicles/:id/detail`

---

## Notas técnicas

- **Headers:** Todos los endpoints requieren `Authorization: Bearer <token>`
- **Caché de lookups:** TTL de 60s preventivo ante cambios de otro admin. Si hay websocket de invalidación, se puede reducir a 0.
- **Compatibilidad hacia atrás:** Los endpoints individuales estándar siguen existiendo. Los nuevos endpoints son adicionales, no sustitutivos.
- **Backend (NestJS):** Usar `@UseInterceptors(ClassSerializerInterceptor)` para evitar exponer campos sensibles (passwords, etc.) en los endpoints compuestos.
