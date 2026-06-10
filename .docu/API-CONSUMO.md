# Consumo de API — ON3BACK

## Base URL

```
http://localhost:6543/api
```

## Autenticación — `/auth`

### POST /auth/login

Inicia sesión con email + password. Devuelve `accessToken` y datos del usuario.

```json
// Request
{ "email": "user@example.com", "password": "miPassword" }

// Response 200
{
   "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "u_000001",
    "email": "user@example.com",
    "role": "MANAGER",
    "employee_id": "emp_000001",
    "city_id": "ci_000001",
    "full_name": "Juan Pérez"
  }
}
```

### POST /auth/register

Crea un nuevo usuario. Solo disponible si el email no está registrado.

```json
// Request
{
  "email": "user@example.com",
  "password": "miPassword",
  "role": "MANAGER",
  "employee_id": "emp_000001",
  "city_id": "ci_000001"
}

// Response 201
{
  "id": "u_000002",
  "email": "user@example.com",
  "role": "MANAGER",
  "employee_id": "emp_000001",
  "city_id": "ci_000001"
}
```

### Enviar token en adelante

### Payload del JWT

| Campo         | Tipo   | Descripción                    |
| ------------- | ------ | ------------------------------ |
| `sub`         | string | ID del usuario (`u_000001`)    |
| `email`       | string | Email del usuario              |
| `role`        | string | `ROOT` / `ADMIN` / `MANAGER` / `USER` |
| `employee_id` | string \| null | ID del empleado asociado       |
| `city_id`     | string | ID de la ciudad del usuario    |

### Enviar token

```
Authorization: Bearer <token>
```

### Jerarquía de roles

| Rol      | Nivel |
| -------- | ----- |
| `ROOT`   | 4     |
| `ADMIN`  | 3     |
| `MANAGER`| 2     |
| `USER`   | 1     |

Los decoradores `@Roles('ROOT', 'ADMIN')` exigen coincidencia exacta.
`@MinLevel(2)` permite MANAGER hacia arriba.

### Usuario root por defecto

| Campo    | Valor                |
| -------- | -------------------- |
| Email    | `000001@on3.com`     |
| Password | `root`               |
| Rol      | ROOT                 |

---

## Endpoints

### Ciudades — `/cities`

| Método | Ruta            | Roles                      |
| ------ | --------------- | -------------------------- |
| GET    | `/cities`       | ROOT, ADMIN, MANAGER, USER |
| GET    | `/cities/:id`   | ROOT, ADMIN, MANAGER, USER |
| POST   | `/cities`       | ROOT, ADMIN                |
| PATCH  | `/cities/:id`   | ROOT, ADMIN                |
| DELETE | `/cities/:id`   | ROOT                       |

**POST /cities**
```json
{ "name": "Madrid" }
```

### Centros de Trabajo — `/work-centers`

| Método | Ruta                 | Roles                      |
| ------ | -------------------- | -------------------------- |
| GET    | `/work-centers`      | ROOT, ADMIN, MANAGER, USER |
| GET    | `/work-centers/:id`  | ROOT, ADMIN, MANAGER, USER |
| POST   | `/work-centers`      | ROOT, ADMIN                |
| PATCH  | `/work-centers/:id`  | ROOT, ADMIN                |
| DELETE | `/work-centers/:id`  | ROOT                       |

**POST /work-centers**
```json
{
  "name": "Taller Central",
  "city_id": "ci_000001",
  "address": "Calle Mayor 123",
  "phone": "+34 91 123 45 67"
}
```

### Empleados — `/employees`

| Método | Ruta              | Roles                      |
| ------ | ----------------- | -------------------------- |
| GET    | `/employees`      | ROOT, ADMIN, MANAGER, USER |
| GET    | `/employees/:id`  | ROOT, ADMIN, MANAGER, USER |
| POST   | `/employees`      | ROOT, ADMIN                |
| PATCH  | `/employees/:id`  | ROOT, ADMIN                |
| DELETE | `/employees/:id`  | ROOT                       |

**POST /employees**
```json
{
  "full_name": "Juan Pérez",
  "document_id": "12345678A",
  "email": "juan@example.com",
  "phone": "+34 612 345 678",
  "city_id": "ci_000001",
  "work_center_id": "wc_000001",
  "position": "Técnico",
  "status": "activo"
}
```

### Usuarios — `/users`

| Método | Ruta          | Roles       |
| ------ | ------------- | ----------- |
| GET    | `/users`      | ROOT, ADMIN |
| GET    | `/users/:id`  | ROOT, ADMIN |
| POST   | `/users`      | ROOT        |
| PATCH  | `/users/:id`  | ROOT        |
| DELETE | `/users/:id`  | ROOT        |

**POST /users**
```json
{
  "email": "user@example.com",
  "password": "secret123",
  "role": "MANAGER",
  "employee_id": "emp_000001",
  "city_id": "ci_000001"
}
```

### Vehículos — `/vehicles`

| Método | Ruta             | Roles                      |
| ------ | ---------------- | -------------------------- |
| GET    | `/vehicles`      | ROOT, ADMIN, MANAGER, USER |
| GET    | `/vehicles/:id`  | ROOT, ADMIN, MANAGER, USER |
| POST   | `/vehicles`      | ROOT, ADMIN                |
| PATCH  | `/vehicles/:id`  | ROOT, ADMIN                |
| DELETE | `/vehicles/:id`  | ROOT                       |

**POST /vehicles**
```json
{
  "plate": "1234 ABC",
  "brand": "Renault",
  "model": "Kangoo",
  "work_center_id": "wc_000001",
  "status": "activo"
}
```

### Servicios — `/services`

| Método | Ruta             | Roles                      |
| ------ | ---------------- | -------------------------- |
| GET    | `/services`      | ROOT, ADMIN, MANAGER, USER |
| GET    | `/services/:id`  | ROOT, ADMIN, MANAGER, USER |
| POST   | `/services`      | ROOT, ADMIN                |
| PATCH  | `/services/:id`  | ROOT, ADMIN                |
| DELETE | `/services/:id`  | ROOT                       |

**POST /services**
```json
{
  "name": "Cambio de aceite",
  "description": "Cambio de aceite y filtro",
  "estimated_minutes": 50
}
```

### Inventario — `/inventory`

| Método | Ruta               | Roles                      |
| ------ | ------------------ | -------------------------- |
| GET    | `/inventory`       | ROOT, ADMIN, MANAGER, USER |
| GET    | `/inventory/:id`   | ROOT, ADMIN, MANAGER, USER |
| POST   | `/inventory`       | ROOT, ADMIN                |
| PATCH  | `/inventory/:id`   | ROOT, ADMIN                |
| DELETE | `/inventory/:id`   | ROOT                       |

**POST /inventory**
```json
{
  "name": "Filtro de aceite",
  "unit": "unidad",
  "work_center_id": "wc_000001",
  "stock_min": 10,
  "stock_max": 100
}
```

### Maquinaria — `/machinery`

| Método | Ruta               | Roles                      |
| ------ | ------------------ | -------------------------- |
| GET    | `/machinery`       | ROOT, ADMIN, MANAGER, USER |
| GET    | `/machinery/:id`   | ROOT, ADMIN, MANAGER, USER |
| POST   | `/machinery`       | ROOT, ADMIN                |
| PATCH  | `/machinery/:id`   | ROOT, ADMIN                |
| DELETE | `/machinery/:id`   | ROOT                       |

### Vacaciones — `/vacations`

| Método | Ruta              | Roles                      |
| ------ | ----------------- | -------------------------- |
| GET    | `/vacations`      | ROOT, ADMIN, MANAGER, USER |
| GET    | `/vacations/:id`  | ROOT, ADMIN, MANAGER, USER |
| POST   | `/vacations`      | ROOT, ADMIN, MANAGER       |
| PATCH  | `/vacations/:id`  | ROOT, ADMIN                |
| DELETE | `/vacations/:id`  | ROOT                       |

**POST /vacations**
```json
{
  "employee_id": "emp_000001",
  "type": "FREE_DAYS",
  "requested_month": "AGOSTO",
  "days": ["2025-08-01", "2025-08-02"]
}
```

### Partes de Trabajo — `/work-reports`

| Método | Ruta                | Roles                      |
| ------ | ------------------- | -------------------------- |
| GET    | `/work-reports`     | ROOT, ADMIN, MANAGER, USER |
| GET    | `/work-reports/:id` | ROOT, ADMIN, MANAGER, USER |
| POST   | `/work-reports`     | ROOT, ADMIN, MANAGER       |
| PATCH  | `/work-reports/:id` | ROOT, ADMIN                |
| DELETE | `/work-reports/:id` | ROOT                       |

### Partes de Servicio — `/service-reports`

| Método | Ruta                   | Roles                      |
| ------ | ---------------------- | -------------------------- |
| GET    | `/service-reports`     | ROOT, ADMIN, MANAGER, USER |
| GET    | `/service-reports/:id` | ROOT, ADMIN, MANAGER, USER |
| POST   | `/service-reports`     | ROOT, ADMIN, MANAGER       |
| PATCH  | `/service-reports/:id` | ROOT, ADMIN                |
| DELETE | `/service-reports/:id` | ROOT                       |

### Lookups — `/lookups/:table`

Sirve datos ligeros para selects/dropdowns.

| Método | Ruta               | Roles                      |
| ------ | ------------------ | -------------------------- |
| GET    | `/lookups/cities`  | ROOT, ADMIN, MANAGER, USER |
| GET    | `/lookups/work_centers` | ROOT, ADMIN, MANAGER, USER |
| GET    | `/lookups/employees` | ROOT, ADMIN, MANAGER, USER |

### Dashboard — `/dashboard`

| Método | Ruta          | Roles                |
| ------ | ------------- | -------------------- |
| GET    | `/dashboard`  | ROOT, ADMIN, MANAGER |

**Respuesta**
```json
{
  "employees": 42,
  "work_centers": 12,
  "vehicles": 8,
  "inventory_items": 150
}
```

---

## Formato de respuestas

### Listas (paginadas)

```json
{
  "data": [ ... ],
  "total": 50,
  "page": 1,
  "limit": 100,
  "totalPages": 1
}
```

### Objeto individual

```json
{ "id": "ci_000001", "name": "Madrid" }
```

### Errores

```json
{
  "statusCode": 400,
  "message": ["el nombre no puede estar vacío"],
  "error": "Bad Request"
}
```

Códigos HTTP comunes:
| Código | Significado                 |
| ------ | --------------------------- |
| 200    | OK                          |
| 201    | Creado                      |
| 400    | Validación fallida          |
| 401    | Token faltante o inválido   |
| 403    | Rol sin permisos            |
| 404    | Recurso no encontrado       |
| 409    | Conflicto (email duplicado) |
| 500    | Error interno               |

---

## Ejemplo completo (fetch desde frontend)

```ts
const API = 'http://localhost:6543/api';

// Login
async function login(email: string, password: string) {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Credenciales inválidas');
  return res.json(); // { accessToken, user }
}

// Endpoints protegidos
async function getCities(token: string) {
  const res = await fetch(`${API}/cities`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

async function createCity(token: string, name: string) {
  const res = await fetch(`${API}/cities`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}
```

---

## Swagger UI

```
http://localhost:6543/api/docs
```

Interfaz interactiva para probar todos los endpoints.
