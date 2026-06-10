# ON3 — Esquema Supabase + Seeds

> Basado en `mocks-types-ref.md`. Supabase solo como DB. Auth vía endpoint Next.js.

---

## Decisiones de diseño

| Decisión | Valor |
|----------|-------|
| ID usuarios | UUID v4 (generado por la app/endpoint) |
| ID empleados | `000001` — TEXT, 6 dígitos, zero-padded |
| ID entidades dinámicas | Prefijados con secuencia zero-padded a 6 dígitos (`wc_000001`, `vh_000001`, `sv_1`, `inv_000001`, `mch_000001`) |
| ID lookup tables | IDs explícitos con prefijo y número sin pad (`vt-1`, `rs-1`, `es-1`, `ic-1`, `ist-1`, `mst-1`, `ms-1`) |
| Email users y employees | `{inicial}.{apellido}{num}@on3.com` — ej: `m.torres1@on3.com`. Con número para evitar colisiones. |
| Link user → employee | `users.employee_id` FK → `employees.id` (inversión respecto a mocks originales) |
| Lookup tables editables | `employee_statuses`, `shifts`, `contract_types`, `employee_categories`, `work_days` — CRUD completo desde UI |
| Enums en DB | `vehicle_status`, `fuel_type`, `user_role`, `inventory_category`, `vacation_month`, etc. — valores estables y pequeños |
| Auth | Endpoint Next.js. Sin Supabase Auth, sin RLS |
| Seguridad DB | Solo constraints (FK, UNIQUE, NOT NULL, CHECK). Usuario `on3_app` con CRUD. |

---

## 1. Enums

```sql
CREATE TYPE user_role AS ENUM ('ROOT', 'ADMIN', 'MANAGER', 'USER');
CREATE TYPE user_status AS ENUM ('ACTIVE', 'INACTIVE', 'DELETED');
CREATE TYPE user_language AS ENUM ('EN', 'ES');

CREATE TYPE work_center_status AS ENUM ('ACTIVE', 'INACTIVE');

CREATE TYPE vehicle_status AS ENUM ('ACTIVE', 'MAINTENANCE', 'BROKEN', 'RETIRED');
CREATE TYPE fuel_type AS ENUM ('DIESEL', 'PETROL', 'ELECTRIC', 'LPG');

CREATE TYPE vacation_month AS ENUM ('JULIO', 'AGOSTO', 'SEPTIEMBRE', 'SPLIT');
CREATE TYPE vacation_request_type AS ENUM ('MONTH_CHANGE', 'FREE_DAYS', 'VACATION_CHANGE');
CREATE TYPE vacation_request_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

CREATE TYPE task_status AS ENUM ('PENDING', 'COMPLETED');

CREATE TYPE inventory_category AS ENUM ('CLOTHING', 'PPE');
```

> **Nota**: `inventory_category` ya no incluye `'MACHINERY'` — la maquinaria se extrajo a un módulo independiente con su propia tabla y tipos. Los valores enum están en inglés. Los tipos TypeScript ya reflejan estos valores.

---

## 2. Funciones (trigger)

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## 3. Tablas + Seeds

### 3.1 `cities`

Lookup table. IDs con prefijo `ci_` + 6 dígitos zero-padded (solo 2 registros, estáticos).

```sql
CREATE TABLE cities (
  id TEXT PRIMARY KEY,       -- ci_000001, ci_000002
  name TEXT NOT NULL
);

INSERT INTO cities (id, name) VALUES
  ('ci_000001', 'Alcalá de Henares'),
  ('ci_000002', 'Guadalajara');
```

---

### 3.2 `employee_categories`

Lookup table. IDs con prefijo `ec_` + 6 dígitos zero-padded.

```sql
CREATE TABLE employee_categories (
  id TEXT PRIMARY KEY,       -- ec_000001 .. ec_000010
  name TEXT NOT NULL UNIQUE
);

INSERT INTO employee_categories (id, name) VALUES
  ('ec_000001', 'Peón Limpieza'),
  ('ec_000002', 'Peón Recogida'),
  ('ec_000003', 'Oficial'),
  ('ec_000004', 'Oficial 2ª'),
  ('ec_000005', 'Mantenimiento'),
  ('ec_000006', 'Mecánico'),
  ('ec_000007', 'Encargado'),
  ('ec_000008', 'Encargado General'),
  ('ec_000009', 'Jefe de Servicio'),
  ('ec_000010', 'Administrativo');
```

---

### 3.3 `work_days`

Lookup table. IDs con prefijo `wd_` + número sin pad.

```sql
CREATE TABLE work_days (
  id TEXT PRIMARY KEY,       -- wd_1 .. wd_4
  name TEXT NOT NULL UNIQUE
);

INSERT INTO work_days (id, name) VALUES
  ('wd_1', 'Lunes a Viernes'),
  ('wd_2', 'Fin de Semana'),
  ('wd_3', 'Rotativo 1'),
  ('wd_4', 'Rotativo 2');
```

---

### 3.4 `employee_statuses`

Lookup table. Los valores se gestionan desde la UI (CRUD completo). IDs con prefijo `es_` + número sin pad.

```sql
CREATE TABLE employee_statuses (
  id TEXT PRIMARY KEY,       -- es_1 .. es_6
  name TEXT NOT NULL UNIQUE
);

INSERT INTO employee_statuses (id, name) VALUES
  ('es_1', 'Trabajando'),
  ('es_2', 'Descanso'),
  ('es_3', 'Baja'),
  ('es_4', 'Días Propios'),
  ('es_5', 'Días Acumulados'),
  ('es_6', 'Vacaciones');
```

---

### 3.5 `shifts`

Lookup table. IDs con prefijo `s_` + número sin pad.

```sql
CREATE TABLE shifts (
  id TEXT PRIMARY KEY,       -- s_1 .. s_3
  name TEXT NOT NULL UNIQUE
);

INSERT INTO shifts (id, name) VALUES
  ('s_1', 'Mañana'),
  ('s_2', 'Tarde'),
  ('s_3', 'Noche');
```

---

### 3.6 `contract_types`

Lookup table. IDs con prefijo `ct_` + número sin pad.

```sql
CREATE TABLE contract_types (
  id TEXT PRIMARY KEY,       -- ct_1 .. ct_3
  name TEXT NOT NULL UNIQUE
);

INSERT INTO contract_types (id, name) VALUES
  ('ct_1', 'Indefinido'),
  ('ct_2', 'Temporal'),
  ('ct_3', 'Obra');
```

---

### 3.7 `vehicle_types`

Lookup table. IDs con prefijo `vt-` (con guión, no guión bajo). `category` es el tipo de vehículo (BARREDORA, CAMION, etc.); `name` es el nombre comercial.

```sql
CREATE TABLE vehicle_types (
  id TEXT PRIMARY KEY,       -- vt-1 .. vt-5
  name TEXT NOT NULL,
  category TEXT NOT NULL
);

INSERT INTO vehicle_types (id, name, category) VALUES
  ('vt-1', 'RAVO',       'BARREDORA'),
  ('vt-2', 'Camión',     'CAMION'),
  ('vt-3', 'Furgoneta',  'FURGONETA'),
  ('vt-4', 'Turismo',    'TURISMO'),
  ('vt-5', 'Porter',     'PORTER');
```

---

### 3.8 `inventory_subtypes`

IDs con prefijo `ist-` (con guión). MACHINERY ya no está aquí — tiene subtipos propios en `machinery_subtypes`.

```sql
CREATE TABLE inventory_subtypes (
  id TEXT PRIMARY KEY,       -- ist-1 .. ist-8 (CLOTHING), ist-11 .. ist-17 (PPE)
  category inventory_category NOT NULL,
  name TEXT NOT NULL,
  UNIQUE (category, name)
);

INSERT INTO inventory_subtypes (id, category, name) VALUES
  ('ist-1',  'CLOTHING',  'Pantalón'),
  ('ist-2',  'CLOTHING',  'Camisa'),
  ('ist-3',  'CLOTHING',  'Chaqueta'),
  ('ist-4',  'CLOTHING',  'Forro'),
  ('ist-5',  'CLOTHING',  'Chaquetón'),
  ('ist-6',  'CLOTHING',  'Gorra'),
  ('ist-7',  'CLOTHING',  'Zapatos'),
  ('ist-8',  'CLOTHING',  'Botas'),
  ('ist-11', 'PPE',       'Casco'),
  ('ist-12', 'PPE',       'Guantes'),
  ('ist-13', 'PPE',       'Mascarilla'),
  ('ist-14', 'PPE',       'Máscara'),
  ('ist-15', 'PPE',       'Arnés'),
  ('ist-16', 'PPE',       'Protector'),
  ('ist-17', 'PPE',       'Gafas');
```

---

### 3.9 `inventory_statuses`

Estados separados por categoría de inventario (CLOTHING y PPE). Maquinaria tiene sus propios estados en `machinery_statuses`.

```sql
CREATE TABLE inventory_statuses (
  id TEXT PRIMARY KEY,       -- rs-1..rs-3 (ropa), es-1..es-3 (epi)
  category inventory_category NOT NULL,
  name TEXT NOT NULL,
  UNIQUE (category, name)
);

INSERT INTO inventory_statuses (id, category, name) VALUES
  ('rs-1', 'CLOTHING', 'Disponible'),
  ('rs-2', 'CLOTHING', 'Agotado'),
  ('rs-3', 'CLOTHING', 'En Reposición'),
  ('es-1', 'PPE',      'Disponible'),
  ('es-2', 'PPE',      'Agotado'),
  ('es-3', 'PPE',      'En Reposición');
```

---

### 3.10 `machinery_subtypes`

Subtipos específicos de maquinaria (independiente de inventory_subtypes).

```sql
CREATE TABLE machinery_subtypes (
  id TEXT PRIMARY KEY,       -- mst-1 .. mst-8
  name TEXT NOT NULL UNIQUE
);

INSERT INTO machinery_subtypes (id, name) VALUES
  ('mst-1', 'Sopladora'),
  ('mst-2', 'Desbrozadora'),
  ('mst-3', 'Cortacésped'),
  ('mst-4', 'Motocultor'),
  ('mst-5', 'Hidrolimpiadora'),
  ('mst-6', 'Barredora'),
  ('mst-7', 'Motosierra'),
  ('mst-8', 'Generador');
```

---

### 3.11 `machinery_statuses`

Estados específicos de maquinaria.

```sql
CREATE TABLE machinery_statuses (
  id TEXT PRIMARY KEY,       -- ms-1 .. ms-4
  name TEXT NOT NULL UNIQUE
);

INSERT INTO machinery_statuses (id, name) VALUES
  ('ms-1', 'Disponible'),
  ('ms-2', 'Mantenimiento'),
  ('ms-3', 'Averiado'),
  ('ms-4', 'Baja');
```

---

### 3.12 `work_centers`

Tabla dinámica. Usa secuencia para auto-generar IDs con prefijo `wc_` + 6 dígitos zero-padded.

```sql
CREATE SEQUENCE wc_id_seq START 1;

CREATE TABLE work_centers (
  id TEXT PRIMARY KEY DEFAULT 'wc_' || LPAD(NEXTVAL('wc_id_seq')::TEXT, 6, '0'),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city_id TEXT NOT NULL REFERENCES cities(id),
  status work_center_status NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_work_centers_updated_at
  BEFORE UPDATE ON work_centers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

INSERT INTO work_centers (id, name, address, city_id, status, created_at, updated_at) VALUES
  ('wc_000001', 'Nave',          'Calle Industria 42',       'ci_000001', 'ACTIVE',  '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('wc_000002', 'Puerta Madrid', 'Av. Puerta de Madrid 15',  'ci_000001', 'ACTIVE',  '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('wc_000003', 'Gilitos',       'Polígono Gilitos 8',       'ci_000001', 'ACTIVE',  '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('wc_000004', 'Moreras',       'Calle Moreras 3',          'ci_000001', 'ACTIVE',  '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('wc_000005', 'Garena',        'Av. Garena 22',            'ci_000001', 'ACTIVE',  '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('wc_000006', 'Divino Valles', 'Calle Divino Valles 7',    'ci_000001', 'ACTIVE',  '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('wc_000007', 'Taller',        'Polígono Industrial 12',   'ci_000001', 'ACTIVE',  '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('wc_000008', 'Oficinas',      'Calle Administración 1',   'ci_000001', 'ACTIVE',  '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('wc_000009', 'Almacén',       'Av. Logística 55',         'ci_000001', 'ACTIVE',  '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('wc_000011', 'Centro01',      'Av. Henares 100',          'ci_000002', 'ACTIVE',  '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('wc_000012', 'Centro02',      'Calle Innovación 5',       'ci_000002', 'ACTIVE',  '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('wc_000013', 'Centro03',      'Polígono Industrial 3',    'ci_000002', 'ACTIVE',  '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('wc_000014', 'Centro04',      'Av. Estación 12',          'ci_000002', 'ACTIVE',  '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('wc_000015', 'Centro05',      'Plaza Mayor 1',            'ci_000002', 'ACTIVE',  '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('wc_000016', 'Centro06',      'Paseo Estación 45',        'ci_000002', 'ACTIVE',  '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('wc_000017', 'Centro07',      'Av. Deporte 22',           'ci_000002', 'INACTIVE', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('wc_000018', 'Centro08',      'Calle Comercio 8',         'ci_000002', 'ACTIVE',  '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('wc_000019', 'Centro09',      'Calle Norte 33',           'ci_000002', 'ACTIVE',  '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('wc_000020', 'Centro10',      'Calle Clavín 17',          'ci_000002', 'INACTIVE', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('wc_000021', 'Almacén Sur',   'Polígono Industrial Sur 1','ci_000002', 'ACTIVE',  '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z');

-- Sync secuencia tras inserts explícitos
SELECT setval('wc_id_seq', (SELECT MAX(CAST(SUBSTRING(id, 4) AS INTEGER)) FROM work_centers));
```

---

### 3.13 `employees`

ID manual formato `000001`. Sin secuencia.

**Cambios respecto a mocks**:
- `locker` (TEXT) → `lockers` (TEXT[]) — array de taquillas asignadas
- Nueva columna `clothing_sizes` (JSONB) — tallas de ropa y calzado
- `work_day` → `work_day_id` (naming estándar FK)
- `schedule` eliminado (redundante: `start_time` + `end_time` lo componen)
- `contract_end_date` puede ser NULL (contratos indefinidos)

```sql
CREATE TABLE employees (
  id TEXT PRIMARY KEY,         -- formato '000001', se inserta manualmente

  city_id TEXT REFERENCES cities(id) ON DELETE SET NULL,

  name TEXT NOT NULL,
  last_name1 TEXT NOT NULL,
  last_name2 TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  personal_email TEXT NOT NULL DEFAULT '',
  phone_fixed TEXT NOT NULL DEFAULT '',

  category_id TEXT NOT NULL REFERENCES employee_categories(id),
  status_id TEXT NOT NULL REFERENCES employee_statuses(id),
  work_center_id TEXT NOT NULL REFERENCES work_centers(id),
  active BOOLEAN NOT NULL DEFAULT TRUE,

  shift_id TEXT NOT NULL REFERENCES shifts(id),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  CONSTRAINT chk_employees_time CHECK (end_time > start_time),

  work_day_id TEXT NOT NULL REFERENCES work_days(id),
  contract_type TEXT NOT NULL REFERENCES contract_types(id),
  contract_start_date DATE NOT NULL,
  contract_end_date DATE,
  CONSTRAINT chk_employees_contract CHECK (
    contract_end_date IS NULL OR contract_end_date > contract_start_date
  ),
  irpf NUMERIC(4,1) NOT NULL DEFAULT 0,
  CONSTRAINT chk_employees_irpf CHECK (irpf >= 0 AND irpf <= 100),

  vacation_month vacation_month,
  vacation_year INT,
  vacation_days INT NOT NULL DEFAULT 22,
  own_days INT NOT NULL DEFAULT 0,
  accumulated_days INT NOT NULL DEFAULT 0,
  excess_days INT NOT NULL DEFAULT 0,
  CONSTRAINT chk_employees_vacation_nonneg CHECK (
    vacation_days >= 0 AND own_days >= 0 AND accumulated_days >= 0 AND excess_days >= 0
  ),

  iban TEXT NOT NULL,
  lockers TEXT[] NOT NULL DEFAULT '{}',
  clothing_sizes JSONB NOT NULL DEFAULT '{}',
  medical_check BOOLEAN NOT NULL DEFAULT FALSE,
  works_holidays BOOLEAN NOT NULL DEFAULT FALSE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_employees_work_center ON employees(work_center_id);

CREATE TRIGGER trg_employees_updated_at
  BEFORE UPDATE ON employees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Seed se genera desde el frontend (mockEmployees.ts genera dinámicamente >60 empleados)
-- Aquí solo los 8 empleados vinculados a usuarios de prueba:
INSERT INTO employees (id, city_id, name, last_name1, last_name2, email, phone, personal_email, phone_fixed, category_id, status_id, work_center_id, active, shift_id, start_time, end_time, work_day_id, contract_type, contract_start_date, contract_end_date, irpf, vacation_month, vacation_year, vacation_days, own_days, accumulated_days, excess_days, iban, lockers, clothing_sizes, medical_check, works_holidays, created_at, updated_at) VALUES
  ('000001', 'ci_000001', 'Miguel Ángel', 'Torres', 'López', 'm.torres1@on3.com', '612300001', 'miguel.torres@gmail.com', '918765432', 'ec_000001', 'es_1', 'wc_000001', true, 's_1', '06:00', '13:00', 'wd_1', 'ct_1', '2023-06-01', NULL, 15, 'JULIO', 2024, 22, 2, 5, 0, 'ES7620770024003102570001', '{L-001}', '{"summer_shirt":"L","winter_shirt":"L","summer_pants":"L","winter_pants":"L","summer_jacket":"L","winter_jacket":"L","winter_coat":"L","cap":"ESTANDAR","summer_shoe":42,"winter_shoe":43}', true, true, '2024-01-15T08:00:00Z', '2024-01-15T08:00:00Z'),
  ('000002', 'ci_000001', 'Alejandro', 'Mendoza', 'García', 'a.mendoza2@on3.com', '612300002', 'alejandro.mendoza@gmail.com', '918765433', 'ec_000002', 'es_1', 'wc_000002', true, 's_2', '14:00', '21:00', 'wd_1', 'ct_1', '2023-09-15', NULL, 12, 'AGOSTO', 2024, 22, 2, 5, 0, 'ES7620770024003102570002', '{L-002}', '{"summer_shirt":"L","winter_shirt":"L","summer_pants":"L","winter_pants":"L","summer_jacket":"L","winter_jacket":"L","winter_coat":"L","cap":"ESTANDAR","summer_shoe":42,"winter_shoe":43}', true, false, '2024-02-10T09:00:00Z', '2024-02-10T09:00:00Z'),
  ('000003', 'ci_000001', 'Beatriz', 'Salazar', 'Ruiz', 'b.salazar3@on3.com', '612300003', 'beatriz.salazar@gmail.com', '918765434', 'ec_000003', 'es_2', 'wc_000003', true, 's_1', '06:00', '13:00', 'wd_2', 'ct_1', '2022-01-10', NULL, 18, 'SEPTIEMBRE', 2024, 22, 2, 5, 0, 'ES7620770024003102570003', '{L-003}', '{"summer_shirt":"L","winter_shirt":"L","summer_pants":"L","winter_pants":"L","summer_jacket":"L","winter_jacket":"L","winter_coat":"L","cap":"ESTANDAR","summer_shoe":42,"winter_shoe":43}', true, true, '2024-03-05T10:00:00Z', '2024-03-05T10:00:00Z'),
  ('000004', 'ci_000001', 'Carlos', 'Fuentes', 'Martínez', 'c.fuentes4@on3.com', '612300004', 'carlos.fuentes@gmail.com', '918765435', 'ec_000004', 'es_1', 'wc_000004', true, 's_3', '22:00', '05:00', 'wd_3', 'ct_2', '2024-01-01', '2025-01-01', 14, 'JULIO', 2024, 22, 2, 5, 0, 'ES7620770024003102570004', '{L-004}', '{"summer_shirt":"L","winter_shirt":"L","summer_pants":"L","winter_pants":"L","summer_jacket":"L","winter_jacket":"L","winter_coat":"L","cap":"ESTANDAR","summer_shoe":42,"winter_shoe":43}', true, true, '2024-01-20T11:00:00Z', '2024-01-20T11:00:00Z'),
  ('000005', 'ci_000002', 'Diana', 'Reyes', 'Morales', 'd.reyes5@on3.com', '612300005', 'diana.reyes@gmail.com', '918765436', 'ec_000005', 'es_3', 'wc_000005', false, 's_1', '06:00', '13:00', 'wd_1', 'ct_1', '2022-05-20', NULL, 16, 'AGOSTO', 2024, 22, 2, 5, 0, 'ES7620770024003102570005', '{L-005}', '{"summer_shirt":"L","winter_shirt":"L","summer_pants":"L","winter_pants":"L","summer_jacket":"L","winter_jacket":"L","winter_coat":"L","cap":"ESTANDAR","summer_shoe":42,"winter_shoe":43}', false, false, '2023-11-08T08:00:00Z', '2024-05-15T08:00:00Z'),
  ('000006', 'ci_000001', 'Eduardo', 'Gómez', 'Fernández', 'e.gomez6@on3.com', '612300006', 'eduardo.gomez@gmail.com', '918765437', 'ec_000006', 'es_1', 'wc_000007', true, 's_2', '14:00', '21:00', 'wd_1', 'ct_1', '2023-03-01', NULL, 17, 'SEPTIEMBRE', 2024, 22, 2, 5, 0, 'ES7620770024003102570006', '{L-006}', '{"summer_shirt":"L","winter_shirt":"L","summer_pants":"L","winter_pants":"L","summer_jacket":"L","winter_jacket":"L","winter_coat":"L","cap":"ESTANDAR","summer_shoe":42,"winter_shoe":43}', true, true, '2023-08-12T09:00:00Z', '2023-08-12T09:00:00Z'),
  ('000007', 'ci_000002', 'Gabriela', 'Vaca', 'Rodríguez', 'g.vaca7@on3.com', '612300007', 'gabriela.vaca@gmail.com', '918765438', 'ec_000007', 'es_4', 'wc_000006', true, 's_1', '06:00', '13:00', 'wd_4', 'ct_1', '2021-08-01', NULL, 20, 'JULIO', 2024, 22, 2, 5, 0, 'ES7620770024003102570007', '{L-007}', '{"summer_shirt":"L","winter_shirt":"L","summer_pants":"L","winter_pants":"L","summer_jacket":"L","winter_jacket":"L","winter_coat":"L","cap":"ESTANDAR","summer_shoe":42,"winter_shoe":43}', true, true, '2023-04-18T10:00:00Z', '2024-02-20T10:00:00Z'),
  ('000008', 'ci_000001', 'Hugo', 'Pérez', 'López', 'h.perez8@on3.com', '612300008', 'hugo.perez@gmail.com', '918765439', 'ec_000008', 'es_1', 'wc_000008', true, 's_1', '09:00', '17:00', 'wd_1', 'ct_1', '2020-01-15', NULL, 22, 'AGOSTO', 2024, 22, 2, 5, 0, 'ES7620770024003102570008', '{L-008}', '{"summer_shirt":"L","winter_shirt":"L","summer_pants":"L","winter_pants":"L","summer_jacket":"L","winter_jacket":"L","winter_coat":"L","cap":"ESTANDAR","summer_shoe":42,"winter_shoe":43}', true, true, '2022-06-25T08:00:00Z', '2022-06-25T08:00:00Z');
```

> **Nota**: Los emails en los seeds del frontend usan formato `{inicial}.{apellido}{num}@on3.com` con número para evitar colisiones. Los 8 empleados seed corresponden a los 8 usuarios de prueba. El resto de empleados se genera dinámicamente en `mockEmployees.ts` (~60+).

---

### 3.14 `users`

ID es UUID v4 generado por el endpoint de creación. `employee_id` invierte la relación respecto a los mocks originales (antes `employee.user_id` → `users.id`).

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,           -- UUID v4 generado por endpoint
  employee_id TEXT NOT NULL UNIQUE REFERENCES employees(id),
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  password TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'USER',
  status user_status NOT NULL DEFAULT 'ACTIVE',
  language user_language NOT NULL DEFAULT 'ES',
  avatar_url TEXT,
  city_id TEXT REFERENCES cities(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_employee ON users(employee_id);
CREATE INDEX idx_users_role ON users(role);

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- contraseñas en seed: root1, admin2, manager3, user4 (hasheadas por endpoint)
INSERT INTO users (id, employee_id, username, email, full_name, password, role, status, language, city_id, created_at, updated_at) VALUES
  ('a1b2c3d4-e5f6-47a7-b8i9-0k1l2m3n4o5p', '000001', 'm.torres1',   'm.torres1@on3.com',  'Miguel Ángel Torres López',  'root1',   'ROOT',   'ACTIVE', 'ES', 'ci_000001', '2025-01-10T08:30:00Z', '2025-01-10T08:30:00Z'),
  ('b2c3d4e5-f6a7-48b8-c9j0-1l2m3n4o5p6', '000002', 'a.mendoza2',  'a.mendoza2@on3.com', 'Alejandro Mendoza García',   'admin2',  'ADMIN',  'ACTIVE', 'ES', 'ci_000001', '2025-01-15T10:15:00Z', '2025-01-15T10:15:00Z'),
  ('c3d4e5f6-a7b8-49c9-d0k1-2m3n4o5p6q7', '000003', 'b.salazar3',  'b.salazar3@on3.com', 'Beatriz Salazar Ruiz',       'manager3','MANAGER','ACTIVE', 'ES', 'ci_000001', '2025-02-01T14:22:00Z', '2025-02-01T14:22:00Z'),
  ('d4e5f6a7-b8c9-40d0-e1k2-3m4n5o6p7q8', '000004', 'c.fuentes4',  'c.fuentes4@on3.com', 'Carlos Fuentes Martínez',    'user4',   'USER',   'ACTIVE', 'ES', 'ci_000001', '2025-02-12T09:05:00Z', '2025-02-12T09:05:00Z'),
  ('e5f6a7b8-c9d0-41e1-f2k3-4m5n6o7p8q9', '000005', 'd.reyes5',    'd.reyes5@on3.com',   'Diana Reyes Morales',        'manager5','MANAGER','ACTIVE', 'ES', 'ci_000002', '2025-02-14T11:40:00Z', '2025-02-14T11:40:00Z'),
  ('f6a7b8c9-d0e1-42f2-a3k4-5m6n7o8p9q0', '000006', 'e.gomez6',    'e.gomez6@on3.com',   'Eduardo Gómez Fernández',    'user6',   'USER',   'INACTIVE','ES','ci_000001', '2025-02-18T16:50:00Z', '2025-02-18T16:50:00Z'),
  ('a7b8c9d0-e1f2-43a3-b4k5-6m7n8o9p0q1', '000007', 'g.vaca7',     'g.vaca7@on3.com',    'Gabriela Vaca Rodríguez',    'admin7',  'ADMIN',  'INACTIVE','ES','ci_000002', '2025-01-20T13:12:00Z', '2025-01-20T13:12:00Z'),
  ('b8c9d0e1-f2a3-44b4-c5k6-7m8n9o0p1q2', '000008', 'h.perez8',    'h.perez8@on3.com',   'Hugo Pérez López',           'user8',   'USER',   'ACTIVE', 'ES', 'ci_000001', '2025-02-20T10:00:00Z', '2025-02-20T10:00:00Z');
```

> **Nota**: El campo `password` se agregó para almacenar contraseñas (hasheadas por el endpoint). El status ahora incluye `'DELETED'` para soft-delete de usuarios. El `full_name` incluye ambos apellidos.

---

### 3.15 `vacation_requests`

`requested_days` se ha normalizado a una tabla separada `vacation_request_days`.

```sql
CREATE SEQUENCE vr_id_seq START 1;
CREATE SEQUENCE vrd_id_seq START 1;

CREATE TABLE vacation_requests (
  id TEXT PRIMARY KEY DEFAULT 'vr_' || NEXTVAL('vr_id_seq'),
  employee_id TEXT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  type vacation_request_type NOT NULL,
  status vacation_request_status NOT NULL DEFAULT 'PENDING',
  requested_month vacation_month,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE vacation_request_days (
  id TEXT PRIMARY KEY DEFAULT 'vrd_' || NEXTVAL('vrd_id_seq'),
  vacation_request_id TEXT NOT NULL REFERENCES vacation_requests(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  UNIQUE (vacation_request_id, date)
);

CREATE INDEX idx_vacation_requests_employee ON vacation_requests(employee_id);
CREATE INDEX idx_vacation_request_days_request ON vacation_request_days(vacation_request_id);

CREATE TRIGGER trg_vacation_requests_updated_at
  BEFORE UPDATE ON vacation_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

### 3.16 `vehicles`

ID con prefijo `vh_` + 6 dígitos zero-padded.

```sql
CREATE SEQUENCE vh_id_seq START 1;

CREATE TABLE vehicles (
  id TEXT PRIMARY KEY DEFAULT 'vh_' || LPAD(NEXTVAL('vh_id_seq')::TEXT, 6, '0'),
  license_plate TEXT NOT NULL UNIQUE,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  vehicle_type_id TEXT NOT NULL REFERENCES vehicle_types(id),
  status vehicle_status NOT NULL DEFAULT 'ACTIVE',
  vin TEXT NOT NULL,
  registration_date DATE NOT NULL,
  itv_expiration DATE NOT NULL,
  insurance_expiration DATE NOT NULL,
  tax_expiration DATE NOT NULL,
  fuel_type fuel_type NOT NULL,
  kilometers INT NOT NULL DEFAULT 0,
  CONSTRAINT chk_vehicles_kilometers CHECK (kilometers >= 0),
  hour_meter INT NOT NULL DEFAULT 0,
  CONSTRAINT chk_vehicles_hour_meter CHECK (hour_meter >= 0),
  last_review_date DATE,
  next_review_kilometers INT,
  CONSTRAINT chk_vehicles_dates CHECK (itv_expiration > registration_date),
  work_center_id TEXT NOT NULL REFERENCES work_centers(id),
  assigned_employee_id TEXT REFERENCES employees(id) ON DELETE SET NULL,
  observations TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vehicles_plate ON vehicles(license_plate);
CREATE INDEX idx_vehicles_work_center ON vehicles(work_center_id);

CREATE TRIGGER trg_vehicles_updated_at
  BEFORE UPDATE ON vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

INSERT INTO vehicles (id, license_plate, model, brand, vehicle_type_id, status, vin, registration_date, itv_expiration, insurance_expiration, tax_expiration, fuel_type, kilometers, hour_meter, last_review_date, next_review_kilometers, work_center_id, assigned_employee_id, observations, created_at, updated_at) VALUES
  ('vh_000001', '1234BCD', 'RAVO 900', 'RAVO', 'vt-1', 'ACTIVE', 'VIN123456789ABC001', '2023-01-15', '2025-01-15', '2025-06-15', '2025-12-31', 'DIESEL', 4500, 1250, '2024-06-01', 10000, 'wc_000001', '000001', '', '2023-01-15T08:00:00Z', '2024-06-01T08:00:00Z'),
  ('vh_000002', '5678EFG', 'Actros 1845', 'Mercedes', 'vt-2', 'ACTIVE', 'VIN987654321DEF002', '2022-03-20', '2026-03-20', '2025-03-20', '2025-12-31', 'DIESEL', 120000, 8500, '2024-05-15', 140000, 'wc_000002', '000002', '', '2022-03-20T08:00:00Z', '2024-05-15T08:00:00Z'),
  ('vh_000003', '9012HIJ', 'Transit 350L', 'Ford', 'vt-3', 'MAINTENANCE', 'VIN456789123GHI003', '2023-06-10', '2025-06-10', '2025-06-10', '2025-12-31', 'DIESEL', 28500, 3200, '2024-04-20', 40000, 'wc_000007', '000003', 'En taller para revisión', '2023-06-10T08:00:00Z', '2024-04-20T08:00:00Z'),
  ('vh_000004', '3456KLM', 'Caddy Maxi', 'Volkswagen', 'vt-4', 'ACTIVE', 'VIN789123456JKL004', '2024-01-05', '2026-01-05', '2025-01-05', '2025-12-31', 'DIESEL', 8500, 950, '2024-03-01', 20000, 'wc_000003', '000004', '', '2024-01-05T08:00:00Z', '2024-03-01T08:00:00Z'),
  ('vh_000005', '7890NOP', 'Porter PX', 'Piaggio', 'vt-5', 'BROKEN', 'VIN321654987MNO005', '2023-09-01', '2025-09-01', '2024-09-01', '2025-12-31', 'LPG', 65000, 4200, '2024-02-15', 80000, 'wc_000007', NULL, 'Avería en motor, pendiente de reparación', '2023-09-01T08:00:00Z', '2024-02-15T08:00:00Z'),
  ('vh_000006', '1122QRS', 'RAVO 500', 'RAVO', 'vt-1', 'ACTIVE', 'VIN111222333QRS006', '2023-05-20', '2025-05-20', '2025-05-20', '2025-12-31', 'DIESEL', 3200, 800, '2024-07-01', 8000, 'wc_000005', '000006', '', '2023-05-20T08:00:00Z', '2024-07-01T08:00:00Z'),
  ('vh_000007', '3344TUV', 'Sprinter 316', 'Mercedes', 'vt-3', 'ACTIVE', 'VIN444555666TUV007', '2023-08-15', '2025-08-15', '2025-08-15', '2025-12-31', 'DIESEL', 42000, 5800, '2024-08-01', 60000, 'wc_000006', '000007', '', '2023-08-15T08:00:00Z', '2024-08-01T08:00:00Z'),
  ('vh_000008', '5567WXY', 'Golf Variant', 'Volkswagen', 'vt-4', 'ACTIVE', 'VIN777888999WXY008', '2024-02-10', '2026-02-10', '2025-02-10', '2025-12-31', 'PETROL', 3500, 600, '2024-04-15', 15000, 'wc_000003', '000008', '', '2024-02-10T08:00:00Z', '2024-04-15T08:00:00Z'),
  ('vh_000009', '7789ZAB', 'Atego 1823', 'Mercedes', 'vt-2', 'MAINTENANCE', 'VIN123123123ZAB009', '2021-11-01', '2025-11-01', '2025-11-01', '2025-12-31', 'DIESEL', 185000, 15000, '2024-01-20', 200000, 'wc_000007', '000009', 'Cambio de aceite y filtros', '2021-11-01T08:00:00Z', '2024-01-20T08:00:00Z'),
  ('vh_000010', '9901CDE', 'Partner', 'Peugeot', 'vt-3', 'ACTIVE', 'VIN321321321CDE010', '2024-03-15', '2026-03-15', '2025-03-15', '2025-12-31', 'DIESEL', 12000, 1500, '2024-06-15', 25000, 'wc_000001', '000011', '', '2024-03-15T08:00:00Z', '2024-06-15T08:00:00Z');

-- Sync secuencia tras inserts explícitos
SELECT setval('vh_id_seq', (SELECT MAX(CAST(SUBSTRING(id, 4) AS INTEGER)) FROM vehicles));
```

> **Nota**: Se agregó columna `hour_meter` (contador horario) no presente en el esquema anterior. El prefijo cambió de `veh_` a `vh_`.

---

### 3.17 `services`

Columna `type` renombrada a `category` para evitar palabra reservada. ID con prefijo `sv_` + número secuencial simple (sin zero-padding por ahora, pero compatible).

```sql
CREATE SEQUENCE sv_id_seq START 1;

CREATE TABLE services (
  id TEXT PRIMARY KEY DEFAULT 'sv_' || NEXTVAL('sv_id_seq'),
  work_center_id TEXT NOT NULL REFERENCES work_centers(id),
  shift_id TEXT NOT NULL REFERENCES shifts(id),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  staff_requirement JSONB NOT NULL DEFAULT '{}',
  week_start DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_services_work_center ON services(work_center_id);

CREATE TRIGGER trg_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

> **Nota**: Se agregaron `shift_id` (FK a shifts), `staff_requirement` (JSONB con `{ oficial: string | null, peones: number }`) y `week_start` para el nuevo sistema de composición de personal. El prefix cambió de `svc_` a `sv_`.

---

### 3.18 `service_tasks`

```sql
CREATE SEQUENCE st_id_seq START 1;

CREATE TABLE service_tasks (
  id TEXT PRIMARY KEY DEFAULT 'st_' || NEXTVAL('st_id_seq'),
  service_id TEXT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  day_index INT NOT NULL CHECK (day_index BETWEEN 0 AND 6),
  task_index INT NOT NULL CHECK (task_index >= 0),
  zone TEXT,
  assigned_to TEXT REFERENCES employees(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  status task_status NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_service_tasks_service ON service_tasks(service_id);
CREATE INDEX idx_service_tasks_week ON service_tasks(week_start);

CREATE UNIQUE INDEX idx_service_tasks_unique
  ON service_tasks(service_id, day_index, task_index);

CREATE TRIGGER trg_service_tasks_updated_at
  BEFORE UPDATE ON service_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

> **Nota**: Se agregaron columnas `zone` (zona geográfica) y `assigned_to` (FK a employee) para asignación a empleados específicos.

---

### 3.19 `inventory_items`

`color`, `size` y `gender` se movieron de JSONB `attributes` a columnas directas para facilitar consultas y filtros. `attributes` retiene solo campos específicos por categoría (material, certificación, etc.).

```sql
CREATE SEQUENCE inv_id_seq START 1;

CREATE TABLE inventory_items (
  id TEXT PRIMARY KEY DEFAULT 'inv_' || LPAD(NEXTVAL('inv_id_seq')::TEXT, 6, '0'),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category inventory_category NOT NULL,
  subtype_id TEXT NOT NULL REFERENCES inventory_subtypes(id),
  status_id TEXT NOT NULL REFERENCES inventory_statuses(id),
  quantity INT NOT NULL DEFAULT 0,
  CONSTRAINT chk_inventory_quantity CHECK (quantity >= 0),
  min_stock INT NOT NULL DEFAULT 0,
  CONSTRAINT chk_inventory_min_stock CHECK (min_stock >= 0),
  unit TEXT NOT NULL DEFAULT 'unidad',
  city_id TEXT NOT NULL REFERENCES cities(id),
  work_center_id TEXT NOT NULL REFERENCES work_centers(id),
  location TEXT NOT NULL DEFAULT '',
  color TEXT,
  size TEXT,
  gender TEXT,
  assigned_to TEXT REFERENCES employees(id) ON DELETE SET NULL,
  notes TEXT NOT NULL DEFAULT '',
  attributes JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inventory_category ON inventory_items(category);
CREATE INDEX idx_inventory_work_center ON inventory_items(work_center_id);
CREATE INDEX idx_inventory_attrs ON inventory_items USING GIN(attributes);

CREATE TRIGGER trg_inventory_updated_at
  BEFORE UPDATE ON inventory_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

> **Nota**: `color`, `size` y `gender` ahora son columnas directas (no dentro de JSONB `attributes`). `attributes` solo contiene: `material`, `certification`, `safety_standard`, `serial_number`, `expiration_date`. Ya no incluye MACHINERY (tiene su propia tabla).

---

### 3.20 `machinery` (nuevo módulo independiente)

Extraído de InventoryCategory para ser un módulo independiente con CRUD y dashboard propios.

```sql
CREATE SEQUENCE mch_id_seq START 1;

CREATE TABLE machinery (
  id TEXT PRIMARY KEY DEFAULT 'mch_' || LPAD(NEXTVAL('mch_id_seq')::TEXT, 6, '0'),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  subtype_id TEXT NOT NULL REFERENCES machinery_subtypes(id),
  status_id TEXT NOT NULL REFERENCES machinery_statuses(id),
  quantity INT NOT NULL DEFAULT 0,
  CONSTRAINT chk_machinery_quantity CHECK (quantity >= 0),
  min_stock INT NOT NULL DEFAULT 0,
  CONSTRAINT chk_machinery_min_stock CHECK (min_stock >= 0),
  unit TEXT NOT NULL DEFAULT 'unidades',
  city_id TEXT NOT NULL REFERENCES cities(id),
  work_center_id TEXT NOT NULL REFERENCES work_centers(id),
  location TEXT NOT NULL DEFAULT '',
  brand TEXT,
  model TEXT,
  serial_number TEXT,
  warranty_expiration DATE,
  last_maintenance DATE,
  next_maintenance DATE,
  assigned_to TEXT REFERENCES employees(id) ON DELETE SET NULL,
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_machinery_subtype ON machinery(subtype_id);
CREATE INDEX idx_machinery_work_center ON machinery(work_center_id);

CREATE TRIGGER trg_machinery_updated_at
  BEFORE UPDATE ON machinery
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

### 3.21 `work_reports`

Soporta vehículo dual (averiado + reemplazo) y averías de maquinaria.

```sql
CREATE SEQUENCE wr_id_seq START 1;

CREATE TABLE work_reports (
  id TEXT PRIMARY KEY DEFAULT 'wr_' || NEXTVAL('wr_id_seq'),
  employee_id TEXT NOT NULL REFERENCES employees(id),
  date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  CONSTRAINT chk_wr_status CHECK (status IN ('DRAFT', 'CONFIRMED')),
  services JSONB NOT NULL DEFAULT '[]',
  vehicle_id TEXT REFERENCES vehicles(id) ON DELETE SET NULL,
  km_start INT,
  km_end INT,
  hour_meter_start INT,
  hour_meter_end INT,
  fuel_liters NUMERIC(6,1),
  vehicle_breakdown_type TEXT,
  vehicle_breakdown_notes TEXT,
  replacement_vehicle_id TEXT REFERENCES vehicles(id) ON DELETE SET NULL,
  replacement_km_start INT,
  replacement_km_end INT,
  replacement_hour_meter_start INT,
  replacement_hour_meter_end INT,
  replacement_fuel_liters NUMERIC(6,1),
  tools TEXT[] NOT NULL DEFAULT '{}',
  machinery_breakdowns JSONB NOT NULL DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_work_reports_employee ON work_reports(employee_id);
CREATE INDEX idx_work_reports_date ON work_reports(date);

CREATE TRIGGER trg_work_reports_updated_at
  BEFORE UPDATE ON work_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

> **Nota**: `services` almacena un JSONB array con `{ service_id, tasks: [{ task_id, completed }] }`. `machinery_breakdowns` almacena `Record<string, { type, notes? }>`. Los campos `replacement_*` soportan el flujo de vehículo averiado + reemplazo.

---

### 3.22 `service_reports`

```sql
CREATE SEQUENCE sr_id_seq START 1;

CREATE TABLE service_reports (
  id TEXT PRIMARY KEY DEFAULT 'sr_' || NEXTVAL('sr_id_seq'),
  date DATE NOT NULL,
  type TEXT NOT NULL,
  CONSTRAINT chk_sr_type CHECK (type IN ('PREVIO', 'DIARIO')),
  city_id TEXT NOT NULL REFERENCES cities(id),
  status TEXT NOT NULL DEFAULT 'DRAFT',
  CONSTRAINT chk_sr_status CHECK (status IN ('DRAFT', 'CONFIRMED')),
  assignments JSONB NOT NULL DEFAULT '[]',
  attendance JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_service_reports_date ON service_reports(date);
CREATE INDEX idx_service_reports_city ON service_reports(city_id);

CREATE TRIGGER trg_service_reports_updated_at
  BEFORE UPDATE ON service_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## 4. Vistas (overviews)

```sql
CREATE VIEW employee_overviews AS
SELECT e.id, e.email, e.name, e.last_name1, e.last_name2,
       e.category_id, e.work_day_id,
       e.work_center_id, e.status_id,
       es.name AS status_name,
       e.city_id
FROM employees e
JOIN employee_statuses es ON es.id = e.status_id;

CREATE VIEW vehicle_overviews AS
SELECT id, license_plate, model, brand,
       vehicle_type_id, status, work_center_id, kilometers, hour_meter
FROM vehicles;

CREATE VIEW service_overviews AS
SELECT s.id, s.work_center_id, s.shift_id, s.name, s.category,
       s.staff_requirement,
       COUNT(st.id) AS total_tasks,
       COUNT(st.id) FILTER (WHERE st.status = 'COMPLETED') AS completed_tasks
FROM services s
LEFT JOIN service_tasks st ON st.service_id = s.id
GROUP BY s.id;

CREATE VIEW inventory_overviews AS
SELECT id, name, category, subtype_id, status_id,
       quantity, min_stock, unit, city_id, work_center_id, location
FROM inventory_items;

CREATE VIEW machinery_overviews AS
SELECT id, name, subtype_id, status_id,
       quantity, min_stock, unit, city_id, work_center_id, location
FROM machinery;
```

> **Nota**: `vehicle_overviews` ahora incluye `hour_meter`. `service_overviews` incluye `shift_id` y `staff_requirement`. Se agregó `machinery_overviews`.

---

## 5. Seguridad

```sql
-- Solo un rol service_role para el endpoint Next.js
-- Sin RLS. Sin políticas. Sin triggers de auth.

-- Recomendación: crear un usuario dedicado para la app
CREATE USER on3_app WITH PASSWORD '...';
GRANT USAGE ON SCHEMA public TO on3_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO on3_app;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO on3_app;

-- Cubrir tablas futuras
ALTER DEFAULT PRIVILEGES FOR USER on3_app IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO on3_app;
ALTER DEFAULT PRIVILEGES FOR USER on3_app IN SCHEMA public
  GRANT USAGE ON SEQUENCES TO on3_app;
```

> El endpoint Next.js se conecta con las credenciales de `on3_app` (service role) y gestiona toda la lógica de autenticación, autorización y validación.

---

## 6. Resumen de cambios respecto a mocks actuales

| Aspecto | Mock (actual) | Supabase DB (corregido) |
|---------|---------------|------------------------|
| ID users | `usr_a1b2c3d4` | UUID v4 |
| ID employees | auto-generado | `000001` (manual) |
| ID cities | `ci_000001` (6 dígitos) | `ci_000001` (6 dígitos zero-padded) |
| ID categories | `ec_000001` (6 dígitos) | `ec_000001` (6 dígitos zero-padded) |
| ID work_centers | `wc_000001` (6 dígitos) | `wc_000001` (6 dígitos zero-padded) |
| ID vehicles | `vh_000001` (6 dígitos) | `vh_000001` (6 dígitos zero-padded) |
| ID services | `sv_1` (simple) | `sv_1` (simple, sin pad) |
| ID inventory | `inv_000001` (6 dígitos) | `inv_000001` (6 dígitos zero-padded) |
| ID machinery | `mch_000001` (6 dígitos) | `mch_000001` (6 dígitos zero-padded) |
| ID inventory subtypes | `ist-1` (guión) | `ist-1` (guión, sin cambios) |
| ID inventory statuses | `rs-1`, `es-1` (por categoría) | `rs-1`, `es-1` (por categoría) |
| ID vehicle types | `vt-1` (guión) | `vt-1` (guión, sin cambios) |
| Email users | `inicial.apellido@on3.com` | `inicial.apellido{num}@on3.com` (con número) |
| Link user→employee | `employee.user_id` | `users.employee_id` (invertido) |
| User password | No existía | `password` TEXT |
| User status | `ACTIVE | INACTIVE` | `ACTIVE | INACTIVE | DELETED` (soft-delete) |
| Language user | No existía | `language` ENUM('EN','ES') DEFAULT 'ES' |
| Auth | `btoa` JWT + mock | Endpoint Next.js externo |
| Fechas | Strings ISO | `TIMESTAMPTZ` / `DATE` |
| Lookups editables (shift, contract, status) | Arrays en memoria TS | Tablas (`shifts`, `contract_types`, `employee_statuses`) |
| Enums idioma | Español (`'ropa'`, `'GASOLINA'`, `'julio'`) | Inglés (`'CLOTHING'`, `'PETROL'`, `'JULIO'`) |
| employee.status | Enum `employee_status` | FK `status_id` → `employee_statuses` (CRUD desde UI) |
| employee.schedule | Columna explícita | Eliminada (derivable de start_time + end_time) |
| employee.work_day | Nombre `work_day` | `work_day_id` (naming FK estándar) |
| employee.locker | TEXT simple | `lockers` TEXT[] (array de taquillas) |
| employee.clothing_sizes | No existía | JSONB con tallas de ropa y calzado |
| vehicle_types.type / services.type | `type` (reservado) | `category` |
| vehicle.hour_meter | No existía | `hour_meter INT` |
| services.shift_id | No existía | FK a `shifts` |
| services.staff_requirement | No existía | JSONB `{ oficial, peones }` |
| services.week_start | No existía | DATE |
| service_tasks.zone | No existía | TEXT (zona geográfica) |
| service_tasks.assigned_to | No existía | FK a `employees` |
| vacation_requests.requested_days | `DATE[]` array | Tabla normalizada `vacation_request_days` |
| Lookups pequeños | Arrays en memoria TS | Enums (`vehicle_status`, `fuel_type`, etc.) |
| Lookups grandes | Arrays en memoria TS | Tablas (`employee_categories`, `work_days`, etc.) |
| Tasks service | 140 tasks embebidas | `service_tasks` por semana |
| Inventory category | `'CLOTHING' | 'PPE' | 'MACHINERY'` | Solo `'CLOTHING' | 'PPE'` (MACHINERY es módulo aparte) |
| Inventory color/size/gender | En JSONB `attributes` | Columnas directas `color`, `size`, `gender` |
| Inventory attributes brand/model | En `attributes` | Solo en Machinery (no en Inventory) |
| Machinery | No existía como módulo | Tabla independiente `machinery` + subtipos/estados propios |
| Work report vehicle dual | No existía | `replacement_*` fields + `vehicle_breakdown_*` |
| Work report machinery breakdowns | No existía | `machinery_breakdowns` JSONB |
| Sequence sync | No aplica | `SELECT setval(...)` tras seeds explícitos (LPAD a 6 dígitos) |
| CHECK constraints | No existen | `end_time > start_time`, `kilometers >= 0`, etc. |
| updated_at triggers | Solo algunas tablas | Todas las tablas operativas |
| Permisos futuros | No aplica | `ALTER DEFAULT PRIVILEGES` |
| RLS | No existe | No (gestión en endpoint) |
| Seguridad DB | No aplica | Usuario `on3_app` con CRUD en schema public |

---

## 7. Orden de migración (seed sequencing)

1. Enums (CREATE TYPE)
2. `cities`
3. `employee_categories`, `work_days`, `employee_statuses`, `shifts`, `contract_types`
4. `vehicle_types`, `inventory_subtypes`, `inventory_statuses`, `machinery_subtypes`, `machinery_statuses`
5. `work_centers` + `SELECT setval('wc_id_seq', ...)`
6. `employees`
7. `users`
8. `vacation_requests` + `vacation_request_days`
9. `vehicles` + `SELECT setval('vh_id_seq', ...)`
10. `services` + `SELECT setval('sv_id_seq', ...)`
11. `service_tasks`
12. `inventory_items`
13. `machinery`
14. `work_reports`
15. `service_reports`
16. Vistas (CREATE VIEW)
17. Crear usuario `on3_app` y conceder permisos + `ALTER DEFAULT PRIVILEGES`

```sql
-- Sincronización de secuencias (ejecutar tras seeds)
SELECT setval('wc_id_seq', (SELECT MAX(CAST(SUBSTRING(id, 4) AS INTEGER)) FROM work_centers));
SELECT setval('vh_id_seq', (SELECT MAX(CAST(SUBSTRING(id, 4) AS INTEGER)) FROM vehicles));
SELECT setval('sv_id_seq', (SELECT MAX(CAST(SUBSTRING(id, 4) AS INTEGER)) FROM services));
-- NOTA: st_id_seq, inv_id_seq, mch_id_seq se sincronizan automáticamente si se usa NEXT VALUE en los seeds
```

---

## 8. Checklist post-migración (frontend)

- [x] Actualizar `src/types/inventory.ts`: `InventoryCategory` → `'CLOTHING' | 'PPE'` (sin MACHINERY)
- [x] Actualizar `src/types/inventory.ts`: `color`, `size`, `gender` como campos directos
- [x] Actualizar `src/types/vehicle.ts`: `VehicleStatus`, `FuelType` → valores ingleses
- [x] Actualizar `src/types/vehicle.ts`: agregar `hour_meter`
- [x] Actualizar `src/types/employee.ts`: `VacationMonth`, `VacationRequest.type/status` → valores ingleses
- [x] Actualizar `src/types/employee.ts`: `Employee.status` → `status_id: string` (FK a lookup table)
- [x] Actualizar `src/types/employee.ts`: `Employee.shift` → `shift_id: string`
- [x] Actualizar `src/types/employee.ts`: `Employee.contract_type` → `contract_type: string`
- [x] Actualizar `src/types/employee.ts`: `Employee.work_day` → `work_day_id`
- [x] Eliminar `schedule` de `Employee` (computar de `start_time` + `end_time`)
- [x] Actualizar `src/types/employee.ts`: `Employee.locker` → `lockers: string[]`
- [x] Actualizar `src/types/employee.ts`: agregar `clothing_sizes: ClothingSizes | null`
- [x] Actualizar `src/types/employee.ts`: `EmployeeOverview` → agregar `status_name: string`
- [x] Actualizar `src/types/user.ts`: agregar `password: string`
- [x] Actualizar `src/types/user.ts`: `status` → `'ACTIVE' | 'INACTIVE' | 'DELETED'`
- [x] Actualizar `src/types/user.ts`: `full_name` incluye ambos apellidos
- [x] Actualizar `src/types/user.ts`: `employee_id: string` (relación invertida)
- [ ] Actualizar `src/types/machinery.ts`: crear tipos `MachineryItem`, `MachineryOverview`, etc.
- [ ] Actualizar `src/data/mock*.ts`: todos los IDs con guiones bajos correctos
- [ ] Actualizar `src/data/mock*.ts`: emails con formato `{inicial}.{apellido}{num}@on3.com`
- [ ] Migrar `INVENTORY_CATEGORIES`: eliminar MACHINERY, dejar solo CLOTHING + PPE
- [ ] Migrar `INVENTORY_SUBTYPES`: eliminar MACHINERY subtypes (ist-12..ist-19)
- [ ] Migrar `INVENTORY_STATUSES`: separar por categoría (rs-* / es-*)
- [ ] Migrar `attributes` JSONB: extraer color/size/gender a columnas directas
- [ ] Crear `mockMachinery.ts` con datos mock y lookup arrays
- [ ] Crear `MachineryContext.tsx` siguiendo patrón Overview
- [ ] Actualizar `src/types/view.ts`: agregar `MACHINERY_CRUD`, `MACHINERY_DASHBOARD`
- [ ] Actualizar `src/App.tsx`: agregar Provider, ViewType, ruta, roles, renderContent para Machinery
- [ ] Actualizar `src/components/Sidebar.tsx`: agregar ítem de menú MACHINERY
- [ ] Actualizar `src/types/workReport.ts`: agregar `replacement_*` y `machinery_breakdowns`
- [ ] Actualizar `src/types/service.ts`: agregar `shift_id`, `staff_requirement`, `week_start`
- [ ] Actualizar `src/types/service.ts`: agregar `zone`, `assigned_to` en `ServiceTask`

> **Estado actual**: Todos los items de tipos TypeScript para Employee, User, Vehicle, Inventory están completos ([x]). Machinery ya está implementado como módulo independiente en el frontend. La migración de datos mock y la alineación final con el esquema DB son los items pendientes.
