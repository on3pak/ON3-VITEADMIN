# ON3 ÔÇö Esquema Supabase + Seeds

> Basado en `mocks-types-ref.md`. Supabase solo como DB. Auth v├¡a endpoint Next.js.

---

## Decisiones de dise├▒o

| Decisi├│n | Valor |
|----------|-------|
| ID usuarios | UUID v4 (generado por la app/endpoint) |
| ID empleados | `000001` ÔÇö TEXT, 6 d├¡gitos, zero-padded |
| ID entidades din├ímicas | Prefijados con secuencia (`wc_1`, `veh_001`, `svc_1`, `inv_001`, `st_1`, `vr_1`) |
| ID lookup tables | IDs expl├¡citos sin secuencia (`city_1`, `ec_1`, `wd_1`, `vt_1`, `ist_1`, `is_1`) |
| Email users y employees | `{employee_id}@on3.com` ÔÇö ej: `000001@on3.com` |
| Link user ÔåÆ employee | `users.employee_id` FK ÔåÆ `employees.id` (inversi├│n respecto a mocks actuales) |
| Lookup tables editables | `employee_statuses`, `shifts`, `contract_types`, `employee_categories`, `work_days` ÔÇö CRUD completo desde UI |
| Enums en DB | `vehicle_status`, `fuel_type`, `user_role`, `inventory_category`, `vacation_month`, etc. ÔÇö valores estables y peque├▒os |
| Auth | Endpoint Next.js. Sin Supabase Auth, sin RLS |
| Seguridad DB | Solo constraints (FK, UNIQUE, NOT NULL, CHECK). Usuario `on3_app` con CRUD. |

---

## 1. Enums

```sql
CREATE TYPE user_role AS ENUM ('ROOT', 'ADMIN', 'MANAGER', 'USER');
CREATE TYPE user_status AS ENUM ('ACTIVE', 'INACTIVE');
CREATE TYPE user_language AS ENUM ('EN', 'ES');

CREATE TYPE work_center_status AS ENUM ('ACTIVE', 'INACTIVE');

CREATE TYPE vehicle_status AS ENUM ('ACTIVE', 'MAINTENANCE', 'BROKEN', 'RETIRED');
CREATE TYPE fuel_type AS ENUM ('DIESEL', 'PETROL', 'ELECTRIC', 'LPG');

CREATE TYPE vacation_month AS ENUM ('JULIO', 'AGOSTO', 'SEPTIEMBRE', 'SPLIT');
CREATE TYPE vacation_request_type AS ENUM ('MONTH_CHANGE', 'FREE_DAYS', 'VACATION_CHANGE');
CREATE TYPE vacation_request_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

CREATE TYPE task_status AS ENUM ('PENDING', 'COMPLETED');

CREATE TYPE inventory_category AS ENUM ('CLOTHING', 'PPE', 'MACHINERY');
```

> **Nota**: Los valores enum están en inglés. Los tipos TypeScript ya reflejan estos valores. Los datos mock también usan valores ingleses (ej: `'CLOTHING'`, `'PETROL'`, `'JULY'`).
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

Lookup table. IDs expl├¡citos, sin secuencia (solo 2 registros, est├íticos).

```sql
CREATE TABLE cities (
  id TEXT PRIMARY KEY,       -- city_1, city_2
  name TEXT NOT NULL
);

INSERT INTO cities (id, name) VALUES
  ('city_1', 'Alcal├í de Henares'),
  ('city_2', 'Guadalajara');
```

---

### 3.2 `employee_categories`

Lookup table. IDs expl├¡citos.

```sql
CREATE TABLE employee_categories (
  id TEXT PRIMARY KEY,       -- ec_1 .. ec_10
  name TEXT NOT NULL UNIQUE
);

INSERT INTO employee_categories (id, name) VALUES
  ('ec_1',  'Pe├│n Limpieza'),
  ('ec_2',  'Pe├│n Recogida'),
  ('ec_3',  'Oficial'),
  ('ec_4',  'Oficial 2┬¬'),
  ('ec_5',  'Mantenimiento'),
  ('ec_6',  'Mec├ínico'),
  ('ec_7',  'Encargado'),
  ('ec_8',  'Encargado General'),
  ('ec_9',  'Jefe de Servicio'),
  ('ec_10', 'Administrativo');
```

---

### 3.3 `work_days`

Lookup table. IDs expl├¡citos.

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

Lookup table. Los valores se gestionan desde la UI (CRUD completo).

```sql
CREATE TABLE employee_statuses (
  id TEXT PRIMARY KEY,       -- es_1 .. es_6
  name TEXT NOT NULL UNIQUE
);

INSERT INTO employee_statuses (id, name) VALUES
  ('es_1', 'Trabajando'),
  ('es_2', 'Descanso'),
  ('es_3', 'Baja'),
  ('es_4', 'D├¡as Propios'),
  ('es_5', 'D├¡as Acumulados'),
  ('es_6', 'Vacaciones');
```

---

### 3.5 `shifts`

Lookup table.

```sql
CREATE TABLE shifts (
  id TEXT PRIMARY KEY,       -- s_1 .. s_3
  name TEXT NOT NULL UNIQUE
);

INSERT INTO shifts (id, name) VALUES
  ('s_1', 'Ma├▒ana'),
  ('s_2', 'Tarde'),
  ('s_3', 'Noche');
```

---

### 3.6 `contract_types`

Lookup table.

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

Lookup table. `category` es el tipo de veh├¡culo (BARREDORA, CAMION, etc.); `name` es el nombre comercial.

```sql
CREATE TABLE vehicle_types (
  id TEXT PRIMARY KEY,       -- vt_1 .. vt_5
  name TEXT NOT NULL,
  category TEXT NOT NULL
);

INSERT INTO vehicle_types (id, name, category) VALUES
  ('vt_1', 'RAVO',       'BARREDORA'),
  ('vt_2', 'Cami├│n',     'CAMION'),
  ('vt_3', 'Furgoneta',  'FURGONETA'),
  ('vt_4', 'Turismo',    'TURISMO'),
  ('vt_5', 'Porter',     'PORTER');
```

---

### 3.8 `inventory_subtypes`

```sql
CREATE TABLE inventory_subtypes (
  id TEXT PRIMARY KEY,       -- ist_1 .. ist_19
  category inventory_category NOT NULL,
  name TEXT NOT NULL,
  UNIQUE (category, name)
);

INSERT INTO inventory_subtypes (id, category, name) VALUES
  ('ist_1',  'CLOTHING',  'Pantal├│n'),
  ('ist_2',  'CLOTHING',  'Camisa'),
  ('ist_3',  'CLOTHING',  'Chaqueta'),
  ('ist_4',  'CLOTHING',  'Forro Polar'),
  ('ist_5',  'PPE',       'Casco'),
  ('ist_6',  'PPE',       'Guantes'),
  ('ist_7',  'PPE',       'Mascarilla'),
  ('ist_8',  'PPE',       'M├íscara'),
  ('ist_9',  'PPE',       'Arn├®s'),
  ('ist_10', 'PPE',       'Protector Auditivo'),
  ('ist_11', 'PPE',       'Gafas'),
  ('ist_12', 'MACHINERY', 'Sopladora'),
  ('ist_13', 'MACHINERY', 'Desbrozadora'),
  ('ist_14', 'MACHINERY', 'Cortac├®sped'),
  ('ist_15', 'MACHINERY', 'Motocultor'),
  ('ist_16', 'MACHINERY', 'Hidrolimpiadora'),
  ('ist_17', 'MACHINERY', 'Barredora'),
  ('ist_18', 'MACHINERY', 'Motosierra'),
  ('ist_19', 'MACHINERY', 'Generador');
```

---

### 3.9 `inventory_statuses`

```sql
CREATE TABLE inventory_statuses (
  id TEXT PRIMARY KEY,       -- is_1 .. is_12
  category inventory_category NOT NULL,
  name TEXT NOT NULL,
  UNIQUE (category, name)
);

INSERT INTO inventory_statuses (id, category, name) VALUES
  ('is_1',  'CLOTHING',  'Disponible'),
  ('is_2',  'CLOTHING',  'Asignado'),
  ('is_3',  'CLOTHING',  'Lavander├¡a'),
  ('is_4',  'CLOTHING',  'Baja'),
  ('is_5',  'PPE',       'Operativo'),
  ('is_6',  'PPE',       'Asignado'),
  ('is_7',  'PPE',       'Caducado'),
  ('is_8',  'PPE',       'Revisi├│n'),
  ('is_9',  'MACHINERY', 'Operativa'),
  ('is_10', 'MACHINERY', 'En Mantenimiento'),
  ('is_11', 'MACHINERY', 'Averiada'),
  ('is_12', 'MACHINERY', 'Baja');
```

---

### 3.10 `work_centers`

Tabla din├ímica. Usa secuencia para auto-generar IDs.

```sql
CREATE SEQUENCE wc_id_seq START 1;

CREATE TABLE work_centers (
  id TEXT PRIMARY KEY DEFAULT 'wc_' || NEXTVAL('wc_id_seq'),
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
  ('wc_1',  'Nave',          'Calle Industria 42',       'city_1', 'ACTIVE',  '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('wc_2',  'Puerta Madrid', 'Av. Puerta de Madrid 15',  'city_1', 'ACTIVE',  '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('wc_3',  'Gilitos',       'Pol├¡gono Gilitos 8',       'city_1', 'ACTIVE',  '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('wc_4',  'Moreras',       'Calle Moreras 3',          'city_1', 'ACTIVE',  '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('wc_5',  'Garena',        'Av. Garena 22',            'city_1', 'ACTIVE',  '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('wc_6',  'Divino Valles', 'Calle Divino Valles 7',    'city_1', 'ACTIVE',  '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('wc_7',  'Taller',        'Pol├¡gono Industrial 12',   'city_1', 'ACTIVE',  '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('wc_8',  'Oficinas',      'Calle Administraci├│n 1',   'city_1', 'ACTIVE',  '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('wc_9',  'Almac├®n',       'Av. Log├¡stica 55',         'city_1', 'ACTIVE',  '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('wc_11', 'Centro01',      'Av. Henares 100',          'city_2', 'ACTIVE',  '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('wc_12', 'Centro02',      'Calle Innovaci├│n 5',       'city_2', 'ACTIVE',  '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('wc_13', 'Centro03',      'Pol├¡gono Industrial 3',    'city_2', 'ACTIVE',  '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('wc_14', 'Centro04',      'Av. Estaci├│n 12',          'city_2', 'ACTIVE',  '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('wc_15', 'Centro05',      'Plaza Mayor 1',            'city_2', 'ACTIVE',  '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('wc_16', 'Centro06',      'Paseo Estaci├│n 45',        'city_2', 'ACTIVE',  '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('wc_17', 'Centro07',      'Av. Deporte 22',           'city_2', 'INACTIVE', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('wc_18', 'Centro08',      'Calle Comercio 8',         'city_2', 'ACTIVE',  '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('wc_19', 'Centro09',      'Calle Norte 33',           'city_2', 'ACTIVE',  '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('wc_20', 'Centro10',      'Calle Clav├¡n 17',          'city_2', 'INACTIVE', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('wc_21', 'Almac├®n Sur',   'Pol├¡gono Industrial Sur 1','city_2', 'ACTIVE',  '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z');

-- Sync secuencia tras inserts expl├¡citos
SELECT setval('wc_id_seq', (SELECT MAX(CAST(SUBSTRING(id, 4) AS INTEGER)) FROM work_centers));
```

---

### 3.11 `employees`

ID manual formato `000001`. Sin secuencia.

**Cambios respecto a mocks**:
- `work_day` ÔåÆ `work_day_id` (naming est├índar FK)
- `schedule` eliminado (redundante: `start_time` + `end_time` lo componen)
- `contract_end_date` puede ser NULL (contratos indefinidos)
- Nuevos CHECK constraints

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
  locker TEXT NOT NULL DEFAULT '',
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

INSERT INTO employees (id, city_id, name, last_name1, last_name2, email, phone, personal_email, phone_fixed, category_id, status_id, work_center_id, active, shift_id, start_time, end_time, work_day_id, contract_type, contract_start_date, contract_end_date, irpf, vacation_month, vacation_year, vacation_days, own_days, accumulated_days, excess_days, iban, locker, medical_check, works_holidays, created_at, updated_at) VALUES
  ('000001', 'city_1', 'Miguel ├üngel', 'Torres', 'Garc├¡a', '000001@on3.com', '612345678', 'm.torres@gmail.com', '918765432', 'ec_1', 'es_1', 'wc_1', true, 's_1', '08:00', '16:00', 'wd_1', 'ct_1', '2023-06-01', NULL, 15, 'JULY', 2024, 22, 2, 5, 0, 'ES7620770024003102571234', 'L-001', true, true, '2024-01-15T08:00:00Z', '2024-01-15T08:00:00Z'),
  ('000002', 'city_1', 'Alejandro', 'Mendoza', '', '000002@on3.com', '612345679', 'alejandro.mendoza@gmail.com', '918765433', 'ec_2', 'es_1', 'wc_2', true, 's_2', '14:00', '22:00', 'wd_1', 'ct_1', '2023-09-15', NULL, 12, 'AUGUST', 2024, 22, 2, 5, 0, 'ES7620770024003102571235', 'L-002', true, false, '2024-02-10T09:00:00Z', '2024-02-10T09:00:00Z'),
  ('000003', 'city_1', 'Beatriz', 'Salazar', '', '000003@on3.com', '612345680', 'beatriz.salazar@gmail.com', '918765434', 'ec_3', 'es_2', 'wc_3', true, 's_1', '08:00', '16:00', 'wd_2', 'ct_1', '2022-01-10', NULL, 18, 'SEPTEMBER', 2024, 22, 2, 5, 0, 'ES7620770024003102571236', 'L-003', true, true, '2024-03-05T10:00:00Z', '2024-03-05T10:00:00Z'),
  ('000004', 'city_1', 'Carlos', 'Fuentes', '', '000004@on3.com', '612345681', 'carlos.fuentes@gmail.com', '918765435', 'ec_4', 'es_1', 'wc_4', true, 's_3', '22:00', '06:00', 'wd_3', 'ct_2', '2024-01-01', '2025-01-01', 14, 'JULY', 2024, 22, 2, 5, 0, 'ES7620770024003102571237', 'L-004', true, true, '2024-01-20T11:00:00Z', '2024-01-20T11:00:00Z'),
  ('000005', 'city_2', 'Pedro', 'Hern├índez', 'D├¡az', '000005@on3.com', '612345682', 'pedro.hernandez@gmail.com', '918765436', 'ec_5', 'es_3', 'wc_5', false, 's_1', '08:00', '16:00', 'wd_1', 'ct_1', '2022-05-20', NULL, 16, 'AUGUST', 2024, 22, 2, 5, 0, 'ES7620770024003102571238', 'L-005', false, false, '2023-11-08T08:00:00Z', '2024-05-15T08:00:00Z'),
  ('000006', 'city_1', 'Laura', 'Jim├®nez', 'Ruiz', '000006@on3.com', '612345683', 'laura.jimenez@gmail.com', '918765437', 'ec_6', 'es_1', 'wc_7', true, 's_2', '14:00', '22:00', 'wd_1', 'ct_1', '2023-03-01', NULL, 17, 'SEPTEMBER', 2024, 22, 2, 5, 0, 'ES7620770024003102571239', 'L-006', true, true, '2023-08-12T09:00:00Z', '2023-08-12T09:00:00Z'),
  ('000007', 'city_2', 'Miguel', 'Torres', 'Navarro', '000007@on3.com', '612345684', 'miguel.torres@gmail.com', '918765438', 'ec_7', 'es_4', 'wc_6', true, 's_1', '08:00', '16:00', 'wd_4', 'ct_1', '2021-08-01', NULL, 20, 'JULY', 2024, 22, 2, 5, 0, 'ES7620770024003102571240', 'L-007', true, true, '2023-04-18T10:00:00Z', '2024-02-20T10:00:00Z'),
  ('000008', 'city_1', 'Carmen', 'Morales', 'Serrano', '000008@on3.com', '612345685', 'carmen.morales@gmail.com', '918765439', 'ec_8', 'es_1', 'wc_8', true, 's_1', '09:00', '17:00', 'wd_1', 'ct_1', '2020-01-15', NULL, 22, 'AUGUST', 2024, 22, 2, 5, 0, 'ES7620770024003102571241', 'L-008', true, true, '2022-06-25T08:00:00Z', '2022-06-25T08:00:00Z'),
  ('000009', 'city_2', 'Javier', 'Ramos', 'Castro', '000009@on3.com', '612345686', 'javier.ramos@gmail.com', '918765440', 'ec_9', 'es_5', 'wc_1', true, 's_2', '14:00', '22:00', 'wd_2', 'ct_1', '2019-05-01', NULL, 25, 'SEPTEMBER', 2024, 22, 2, 5, 0, 'ES7620770024003102571242', 'L-009', true, false, '2023-09-30T09:00:00Z', '2024-04-10T09:00:00Z'),
  ('000011', 'city_1', 'Sofia', 'Vega', 'Ortega', '000011@on3.com', '612345687', 'sofia.vega@gmail.com', '918765441', 'ec_10', 'es_1', 'wc_8', true, 's_1', '09:00', '17:00', 'wd_1', 'ct_1', '2023-11-01', NULL, 15, 'JULY', 2024, 22, 2, 5, 0, 'ES7620770024003102571243', 'L-010', true, true, '2024-01-08T08:00:00Z', '2024-01-08T08:00:00Z'),
  ('000012', 'city_2', 'Antonio', 'Molina', 'Delgado', '000012@on3.com', '612345688', 'antonio.molina@gmail.com', '918765442', 'ec_1', 'es_6', 'wc_2', true, 's_3', '22:00', '06:00', 'wd_3', 'ct_3', '2024-02-15', '2024-12-31', 10, 'AUGUST', 2024, 22, 2, 5, 0, 'ES7620770024003102571244', 'L-011', true, true, '2024-02-22T10:00:00Z', '2024-06-01T10:00:00Z'),
  ('000013', 'city_1', 'Isabel', 'Romero', 'Aguilar', '000013@on3.com', '612345689', 'isabel.romero@gmail.com', '918765443', 'ec_2', 'es_1', 'wc_3', true, 's_1', '08:00', '16:00', 'wd_1', 'ct_1', '2023-06-01', NULL, 13, 'SEPTEMBER', 2024, 22, 2, 5, 0, 'ES7620770024003102571245', 'L-012', true, true, '2023-12-05T09:00:00Z', '2023-12-05T09:00:00Z'),
  ('000014', 'city_2', 'David', 'Cort├®s', 'Garrido', '000014@on3.com', '612345690', 'david.cortes@gmail.com', '918765444', 'ec_3', 'es_1', 'wc_4', true, 's_2', '14:00', '22:00', 'wd_1', 'ct_2', '2024-03-01', '2025-03-01', 14, 'JULY', 2024, 22, 2, 5, 0, 'ES7620770024003102571246', 'L-013', true, true, '2024-03-18T08:00:00Z', '2024-03-18T08:00:00Z'),
  ('000015', 'city_1', 'Elena', 'Soto', 'P├®rez', '000015@on3.com', '612345691', 'elena.soto@gmail.com', '918765445', 'ec_4', 'es_2', 'wc_5', true, 's_1', '08:00', '16:00', 'wd_2', 'ct_1', '2022-09-01', NULL, 15, 'AUGUST', 2024, 22, 2, 5, 0, 'ES7620770024003102571247', 'L-014', true, false, '2023-10-12T10:00:00Z', '2024-05-20T10:00:00Z'),
  ('000016', 'city_2', 'Francisco', 'Ruiz', 'Guerrero', '000016@on3.com', '612345692', 'francisco.ruiz@gmail.com', '918765446', 'ec_5', 'es_1', 'wc_7', true, 's_2', '14:00', '22:00', 'wd_1', 'ct_1', '2022-02-15', NULL, 17, 'SEPTEMBER', 2024, 22, 2, 5, 0, 'ES7620770024003102571248', 'L-015', true, true, '2023-07-22T09:00:00Z', '2023-07-22T09:00:00Z'),
  ('000017', 'city_1', 'Patricia', 'Flores', 'Moreno', '000017@on3.com', '612345693', 'patricia.flores@gmail.com', '918765447', 'ec_6', 'es_1', 'wc_7', true, 's_1', '08:00', '16:00', 'wd_1', 'ct_1', '2023-10-01', NULL, 16, 'JULY', 2024, 22, 2, 5, 0, 'ES7620770024003102571249', 'L-016', true, true, '2024-01-30T08:00:00Z', '2024-01-30T08:00:00Z'),
  ('000018', 'city_2', 'Roberto', 'Gil', 'Santos', '000018@on3.com', '612345694', 'roberto.gil@gmail.com', '918765448', 'ec_7', 'es_3', 'wc_6', false, 's_3', '22:00', '06:00', 'wd_4', 'ct_1', '2021-03-01', NULL, 19, 'AUGUST', 2024, 22, 2, 5, 0, 'ES7620770024003102571250', 'L-017', false, false, '2023-05-14T10:00:00Z', '2024-04-05T10:00:00Z'),
  ('000019', 'city_1', 'Sandra', 'N├║├▒ez', 'Herrera', '000019@on3.com', '612345695', 'sandra.nunez@gmail.com', '918765449', 'ec_8', 'es_1', 'wc_8', true, 's_1', '09:00', '17:00', 'wd_1', 'ct_1', '2020-08-01', NULL, 21, 'SEPTEMBER', 2024, 22, 2, 5, 0, 'ES7620770024003102571251', 'L-018', true, true, '2022-11-20T08:00:00Z', '2022-11-20T08:00:00Z'),
  ('000020', 'city_2', 'Alberto', 'Castillo', 'Jim├®nez', '000020@on3.com', '612345696', 'alberto.castillo@gmail.com', '918765450', 'ec_9', 'es_1', 'wc_1', true, 's_2', '14:00', '22:00', 'wd_1', 'ct_1', '2018-06-01', NULL, 24, 'JULY', 2024, 22, 2, 5, 0, 'ES7620770024003102571252', 'L-019', true, true, '2023-03-08T09:00:00Z', '2023-03-08T09:00:00Z'),
  ('000021', 'city_1', 'Natalia', 'Dom├¡nguez', 'Vargas', '000021@on3.com', '612345697', 'natalia.dominguez@gmail.com', '918765451', 'ec_10', 'es_4', 'wc_8', true, 's_1', '09:00', '17:00', 'wd_2', 'ct_1', '2023-04-15', NULL, 14, 'AUGUST', 2024, 22, 2, 5, 0, 'ES7620770024003102571253', 'L-020', true, false, '2024-02-28T08:00:00Z', '2024-06-10T08:00:00Z');
```

> **Nota**: Se corrigieron `personal_email` que no coincid├¡an con el nombre del empleado (copia de datos de otros empleados en el mock original).

---

### 3.12 `users`

ID es UUID v4 generado por el endpoint de creaci├│n. `employee_id` invierte la relaci├│n respecto a los mocks actuales (antes `employee.user_id` ÔåÆ `users.id`).

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,           -- UUID v4 generado por endpoint
  employee_id TEXT NOT NULL UNIQUE REFERENCES employees(id),
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,     -- mismo que el email del empleado: {employee_id}@on3.com
  full_name TEXT NOT NULL,
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

-- contrase├▒as en seed: root123, admin123, manager123, user123 (hasheadas por endpoint)
INSERT INTO users (id, employee_id, username, email, full_name, role, status, language, city_id, created_at, updated_at) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567801', '000001', 'm.torres',    '000001@on3.com', 'Miguel ├üngel Torres',  'ROOT',   'ACTIVE', 'ES', 'city_1', '2025-01-10T08:30:00Z', '2025-01-10T08:30:00Z'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567802', '000002', 'admin',       '000002@on3.com', 'Alejandro Mendoza',     'ADMIN',  'ACTIVE', 'ES', 'city_1', '2025-01-15T10:15:00Z', '2025-01-15T10:15:00Z'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567803', '000003', 'manager',     '000003@on3.com', 'Beatriz Salazar',       'MANAGER','ACTIVE', 'ES', 'city_1', '2025-02-01T14:22:00Z', '2025-02-01T14:22:00Z'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567804', '000004', 'user',        '000004@on3.com', 'Carlos Fuentes',        'USER',   'ACTIVE', 'ES', 'city_1', '2025-02-12T09:05:00Z', '2025-02-12T09:05:00Z'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567805', '000005', 'diana_reyes', '000005@on3.com', 'Diana Reyes',           'MANAGER','ACTIVE', 'ES', 'city_2', '2025-02-14T11:40:00Z', '2025-02-14T11:40:00Z'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567806', '000006', 'eduardo_gomez','000006@on3.com','Eduardo G├│mez',         'USER',   'INACTIVE','ES','city_1', '2025-02-18T16:50:00Z', '2025-02-18T16:50:00Z'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567807', '000007', 'gabriela_vaca','000007@on3.com','Gabriela Vaca',         'ADMIN',  'INACTIVE','ES','city_2', '2025-01-20T13:12:00Z', '2025-01-20T13:12:00Z'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567808', '000008', 'hugo_perez',  '000008@on3.com', 'Hugo P├®rez',            'USER',   'ACTIVE', 'ES', 'city_1', '2025-02-20T10:00:00Z', '2025-02-20T10:00:00Z');
```

---

### 3.13 `vacation_requests`

`requested_days` se ha normalizado a una tabla separada `vacation_request_days` (m├ís consultable que un array Postgres).

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

### 3.14 `vehicles`

ID con prefijo `veh_` (se elimina la `v` redundante del prefijo original `veh_v`).

```sql
CREATE SEQUENCE veh_id_seq START 1;

CREATE TABLE vehicles (
  id TEXT PRIMARY KEY DEFAULT 'veh_' || LPAD(NEXTVAL('veh_id_seq')::TEXT, 3, '0'),
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

INSERT INTO vehicles (id, license_plate, model, brand, vehicle_type_id, status, vin, registration_date, itv_expiration, insurance_expiration, tax_expiration, fuel_type, kilometers, last_review_date, next_review_kilometers, work_center_id, assigned_employee_id, observations, created_at, updated_at) VALUES
  ('veh_001', '1234BCD', 'RAVO 900', 'RAVO', 'vt_1', 'ACTIVE', 'VIN123456789ABC001', '2023-01-15', '2025-01-15', '2025-06-15', '2025-12-31', 'DIESEL', 4500, '2024-06-01', 10000, 'wc_1', '000001', '', '2023-01-15T08:00:00Z', '2024-06-01T08:00:00Z'),
  ('veh_002', '5678EFG', 'Actros 1845', 'Mercedes', 'vt_2', 'ACTIVE', 'VIN987654321DEF002', '2022-03-20', '2026-03-20', '2025-03-20', '2025-12-31', 'DIESEL', 120000, '2024-05-15', 140000, 'wc_2', '000002', '', '2022-03-20T08:00:00Z', '2024-05-15T08:00:00Z'),
  ('veh_003', '9012HIJ', 'Transit 350L', 'Ford', 'vt_3', 'MAINTENANCE', 'VIN456789123GHI003', '2023-06-10', '2025-06-10', '2025-06-10', '2025-12-31', 'DIESEL', 28500, '2024-04-20', 40000, 'wc_7', '000003', 'En taller para revisi├│n', '2023-06-10T08:00:00Z', '2024-04-20T08:00:00Z'),
  ('veh_004', '3456KLM', 'Caddy Maxi', 'Volkswagen', 'vt_4', 'ACTIVE', 'VIN789123456JKL004', '2024-01-05', '2026-01-05', '2025-01-05', '2025-12-31', 'DIESEL', 8500, '2024-03-01', 20000, 'wc_3', '000004', '', '2024-01-05T08:00:00Z', '2024-03-01T08:00:00Z'),
  ('veh_005', '7890NOP', 'Porter PX', 'Piaggio', 'vt_5', 'BROKEN', 'VIN321654987MNO005', '2023-09-01', '2025-09-01', '2024-09-01', '2025-12-31', 'LPG', 65000, '2024-02-15', 80000, 'wc_7', NULL, 'Aver├¡a en motor, pendiente de reparaci├│n', '2023-09-01T08:00:00Z', '2024-02-15T08:00:00Z'),
  ('veh_006', '1122QRS', 'RAVO 500', 'RAVO', 'vt_1', 'ACTIVE', 'VIN111222333QRS006', '2023-05-20', '2025-05-20', '2025-05-20', '2025-12-31', 'DIESEL', 3200, '2024-07-01', 8000, 'wc_5', '000006', '', '2023-05-20T08:00:00Z', '2024-07-01T08:00:00Z'),
  ('veh_007', '3344TUV', 'Sprinter 316', 'Mercedes', 'vt_3', 'ACTIVE', 'VIN444555666TUV007', '2023-08-15', '2025-08-15', '2025-08-15', '2025-12-31', 'DIESEL', 42000, '2024-08-01', 60000, 'wc_6', '000007', '', '2023-08-15T08:00:00Z', '2024-08-01T08:00:00Z'),
  ('veh_008', '5567WXY', 'Golf Variant', 'Volkswagen', 'vt_4', 'ACTIVE', 'VIN777888999WXY008', '2024-02-10', '2026-02-10', '2025-02-10', '2025-12-31', 'PETROL', 3500, '2024-04-15', 15000, 'wc_3', '000008', '', '2024-02-10T08:00:00Z', '2024-04-15T08:00:00Z'),
  ('veh_009', '7789ZAB', 'Atego 1823', 'Mercedes', 'vt_2', 'MAINTENANCE', 'VIN123123123ZAB009', '2021-11-01', '2025-11-01', '2025-11-01', '2025-12-31', 'DIESEL', 185000, '2024-01-20', 200000, 'wc_7', '000009', 'Cambio de aceite y filtros', '2021-11-01T08:00:00Z', '2024-01-20T08:00:00Z'),
  ('veh_010', '9901CDE', 'Partner', 'Peugeot', 'vt_3', 'ACTIVE', 'VIN321321321CDE010', '2024-03-15', '2026-03-15', '2025-03-15', '2025-12-31', 'DIESEL', 12000, '2024-06-15', 25000, 'wc_1', '000011', '', '2024-03-15T08:00:00Z', '2024-06-15T08:00:00Z');

-- Sync secuencia tras inserts expl├¡citos
SELECT setval('veh_id_seq', (SELECT MAX(CAST(SUBSTRING(id, 5) AS INTEGER)) FROM vehicles));
```

> **Nota**: El INSERT de `veh_005` usa `fuel_type = 'LPG'` (GLP). El mock actual usaba `'GAS'` que no existe en el enum; se ha corregido al valor correcto del enum `fuel_type`.

---

### 3.15 `services`

Columna `type` renombrada a `category` para evitar palabra reservada.

```sql
CREATE SEQUENCE svc_id_seq START 1;

CREATE TABLE services (
  id TEXT PRIMARY KEY DEFAULT 'svc_' || NEXTVAL('svc_id_seq'),
  work_center_id TEXT NOT NULL REFERENCES work_centers(id),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_services_work_center ON services(work_center_id);

CREATE TRIGGER trg_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

INSERT INTO services (id, work_center_id, name, category, created_at, updated_at) VALUES
  ('svc_1', 'wc_1', 'BMIX1', 'BARRIDO MIXTO',     '2024-01-01T08:00:00Z', '2024-06-15T08:00:00Z'),
  ('svc_2', 'wc_5', 'BMA2',  'BARRIDO MANUAL',    '2024-01-15T08:00:00Z', '2024-06-10T08:00:00Z'),
  ('svc_3', 'wc_3', 'BMEC3', 'BARRIDO MEC├üNICO',  '2024-02-01T08:00:00Z', '2024-06-01T08:00:00Z'),
  ('svc_4', 'wc_2', 'BALD1', 'BALDEO',            '2024-03-01T08:00:00Z', '2024-05-20T08:00:00Z'),
  ('svc_5', 'wc_7', 'RVOL1', 'RECOGIDA',          '2024-04-01T08:00:00Z', '2024-06-05T08:00:00Z'),
  ('svc_6', 'wc_6', 'VAC1',  'VACIADO',           '2024-05-01T08:00:00Z', '2024-06-12T08:00:00Z');

-- Sync secuencia tras inserts expl├¡citos
SELECT setval('svc_id_seq', (SELECT MAX(CAST(SUBSTRING(id, 5) AS INTEGER)) FROM services));
```

---

### 3.16 `service_tasks`

```sql
CREATE SEQUENCE st_id_seq START 1;

CREATE TABLE service_tasks (
  id TEXT PRIMARY KEY DEFAULT 'st_' || NEXTVAL('st_id_seq'),
  service_id TEXT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  day_index INT NOT NULL CHECK (day_index BETWEEN 0 AND 6),
  task_index INT NOT NULL CHECK (task_index >= 0),
  description TEXT NOT NULL,
  status task_status NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_service_tasks_service ON service_tasks(service_id);
CREATE INDEX idx_service_tasks_week ON service_tasks(week_start);

CREATE UNIQUE INDEX idx_service_tasks_unique
  ON service_tasks(service_id, week_start, day_index, task_index);

CREATE TRIGGER trg_service_tasks_updated_at
  BEFORE UPDATE ON service_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

### 3.17 `inventory_items`

Los atributos espec├¡ficos de cada categor├¡a (talla, color, certificaci├│n, serie, etc.) van en `attributes` (JSONB).

```sql
CREATE SEQUENCE inv_id_seq START 1;

CREATE TABLE inventory_items (
  id TEXT PRIMARY KEY DEFAULT 'inv_' || LPAD(NEXTVAL('inv_id_seq')::TEXT, 3, '0'),
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

> Seed de inventory_items en `src/data/mockInventory.ts` (~840 l├¡neas, 49 items). Se migrar├í manteniendo la misma estructura.

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
       vehicle_type_id, status, work_center_id, kilometers
FROM vehicles;

CREATE VIEW service_overviews AS
SELECT s.id, s.work_center_id, s.name, s.category,
       COUNT(st.id) AS total_tasks,
       COUNT(st.id) FILTER (WHERE st.status = 'COMPLETED') AS completed_tasks
FROM services s
LEFT JOIN service_tasks st ON st.service_id = s.id
GROUP BY s.id;

CREATE VIEW inventory_overviews AS
SELECT id, name, category, subtype_id, status_id,
       quantity, min_stock, unit, city_id, work_center_id, location
FROM inventory_items;
```

> **Nota sobre tipos**: `employee_overviews.status_id` es FK a `employee_statuses`, y `status_name` es el nombre del estado en espa├▒ol. El tipo `EmployeeOverview` debe tener `status_id` y `status_name`.

---

## 5. Seguridad

```sql
-- Solo un rol service_role para el endpoint Next.js
-- Sin RLS. Sin pol├¡ticas. Sin triggers de auth.

-- Recomendaci├│n: crear un usuario dedicado para la app
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

> El endpoint Next.js se conecta con las credenciales de `on3_app` (service role) y gestiona toda la l├│gica de autenticaci├│n, autorizaci├│n y validaci├│n.

---

## 6. Resumen de cambios respecto a mocks actuales

| Aspecto | Mock (actual) | Supabase DB (corregido) |
|---------|---------------|------------------------|
| ID users | `usr_a1b2c3d4` | UUID v4 |
| ID employees | auto-generado | `000001` (manual) |
| ID lookup tables | `city-1`, `ec-1` (guiones) | `city_1`, `ec_1` (guiones bajos) |
| ID vehicles | `veh-v001` | `veh_001` (sin `v` redundante) |
| Email users | `inicial.apellido@on3.com` | `{employee_id}@on3.com` |
| Link userÔåÆemployee | `employee.user_id` | `users.employee_id` (invertido) |
| Language user | No exist├¡a | `language` ENUM('EN','ES') DEFAULT 'ES' |
| Auth | `btoa` JWT + mock | Endpoint Next.js externo |
| Fechas | Strings ISO | `TIMESTAMPTZ` / `DATE` |
| Lookups editables (shift, contract, status) | Arrays en memoria TS | Tablas (`shifts`, `contract_types`, `employee_statuses`) |
| Enums idioma | Español (`'ropa'`, `'GASOLINA'`, `'julio'`) | Inglés (`'CLOTHING'`, `'PETROL'`, `'JULY'`) — ya migrado en types y mocks |
| employee.status | Enum `employee_status` | FK `status_id` ÔåÆ `employee_statuses` (CRUD desde UI) |
| employee.schedule | Columna expl├¡cita | Eliminada (derivable de start_time + end_time) |
| employee.work_day | Nombre `work_day` | `work_day_id` (naming FK est├índar) |
| vehicle_types.type / services.type | `type` (reservado) | `category` |
| vacation_requests.requested_days | `DATE[]` array | Tabla normalizada `vacation_request_days` |
| Lookups peque├▒os | Arrays en memoria TS | Enums (`vehicle_status`, `fuel_type`, etc.) |
| Lookups grandes | Arrays en memoria TS | Tablas (`employee_categories`, `work_days`, etc.) |
| Tasks service | 140 tasks embebidas | `service_tasks` por semana |
| Inventory atributos | 15 columnas nullable | JSONB en `attributes` |
| Sequence sync | No aplica | `SELECT setval(...)` tras seeds expl├¡citos |
| CHECK constraints | No existen | `end_time > start_time`, `kilometers >= 0`, etc. |
| updated_at triggers | Solo algunas tablas | Todas las tablas operativas |
| Permisos futuros | No aplica | `ALTER DEFAULT PRIVILEGES` |
| RLS | No existe | No (gesti├│n en endpoint) |
| Seguridad DB | No aplica | Usuario `on3_app` con CRUD en schema public |

---

## 7. Orden de migraci├│n (seed sequencing)

1. Enums (CREATE TYPE)
2. `cities`
3. `employee_categories`, `work_days`, `employee_statuses`, `shifts`, `contract_types`
4. `vehicle_types`, `inventory_subtypes`, `inventory_statuses`
5. `work_centers` + `SELECT setval('wc_id_seq', ...)`
6. `employees`
7. `users`
8. `vacation_requests` + `vacation_request_days`
9. `vehicles` + `SELECT setval('veh_id_seq', ...)`
10. `services` + `SELECT setval('svc_id_seq', ...)`
11. `service_tasks`
12. `inventory_items`
13. Vistas (CREATE VIEW)
14. Crear usuario `on3_app` y conceder permisos + `ALTER DEFAULT PRIVILEGES`

```sql
-- Sincronizaci├│n de secuencias (ejecutar tras seeds)
SELECT setval('wc_id_seq', (SELECT MAX(CAST(SUBSTRING(id, 4) AS INTEGER)) FROM work_centers));
SELECT setval('veh_id_seq', (SELECT MAX(CAST(SUBSTRING(id, 5) AS INTEGER)) FROM vehicles));
SELECT setval('svc_id_seq', (SELECT MAX(CAST(SUBSTRING(id, 5) AS INTEGER)) FROM services));
-- NOTA: st_id_seq e inv_id_seq se sincronizan autom├íticamente si se usa NEXT VALUE en los seeds
```

---

## 8. Checklist post-migraci├│n (frontend)

- [x] Actualizar `src/types/inventory.ts`: `InventoryCategory` ÔåÆ `'CLOTHING' | 'PPE' | 'MACHINERY'`
- [x] Actualizar `src/types/vehicle.ts`: `VehicleStatus`, `FuelType` ÔåÆ valores ingleses
- [x] Actualizar `src/types/employee.ts`: `VacationMonth`, `VacationRequest.type/status` ÔåÆ valores ingleses
- [x] Actualizar `src/types/employee.ts`: `Employee.status` ÔåÆ `status_id: string` (FK a lookup table `employee_statuses`)
- [x] Actualizar `src/types/employee.ts`: `Employee.shift` ÔåÆ `shift_id: string` (FK a lookup table `shifts`)
- [x] Actualizar `src/types/employee.ts`: `Employee.contract_type` ÔåÆ `contract_type: string` (FK a lookup table `contract_types`)
- [x] Actualizar `src/types/employee.ts`: `Employee.work_day` ÔåÆ `work_day_id`
- [x] Eliminar `schedule` de `Employee` (computar de `start_time` + `end_time`)
- [x] Actualizar `src/types/employee.ts`: inversi├│n relaci├│n user (eliminar `user_id`, agregar `employee_id` en User)
- [x] Actualizar `src/types/employee.ts`: `EmployeeOverview` ÔåÆ agregar `status_name: string`
- [ ] Actualizar src/data/mock*.ts: todos los IDs con guiones ÔåÆ guiones bajos
- [ ] Actualizar src/data/mock*.ts: IDs de ciudades, categor├¡as, etc.

> **Estado actual**: Los 10 items de tipos TypeScript están completos ([x]). Los items de datos mock (IDs con guiones, emails, prefijos) aún pendientes — requieren alineaci\u00f3n con el esquema DB.

