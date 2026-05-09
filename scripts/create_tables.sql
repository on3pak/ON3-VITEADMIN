-- Script para crear las tablas de Supabase basadas en las interfaces de TypeScript

-- =====================================================
-- TABLA: users
-- =====================================================
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('ROOT', 'ADMIN', 'MANAGER', 'USER')),
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  avatar_url TEXT,
  auth_id UUID REFERENCES auth.users(id)
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can be viewed by authenticated users"
  ON public.users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can be inserted by admins"
  ON public.users FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt()->>'role' IN ('ROOT', 'ADMIN'));

CREATE POLICY "Users can be updated by admins"
  ON public.users FOR UPDATE
  TO authenticated
  USING (auth.jwt()->>'role' IN ('ROOT', 'ADMIN'));

-- =====================================================
-- TABLA: employees
-- =====================================================
CREATE TABLE IF NOT EXISTS public.employees (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  city_id TEXT NOT NULL,
  name TEXT NOT NULL,
  last_name_1 TEXT NOT NULL,
  last_name_2 TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  category_id TEXT NOT NULL,
  status_id TEXT NOT NULL,
  work_center_id TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  shift TEXT,
  schedule TEXT,
  start_time TEXT,
  end_time TEXT,
  employee_category TEXT NOT NULL,
  own_days INTEGER DEFAULT 0,
  accumulated_days INTEGER DEFAULT 0,
  vacation_days INTEGER DEFAULT 22,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  personal_email TEXT,
  phone_fixed TEXT,
  work_day TEXT,
  work_center TEXT,
  iban TEXT,
  locker TEXT,
  medical_check BOOLEAN DEFAULT false,
  works_holidays BOOLEAN DEFAULT true,
  contract_type TEXT,
  contract_start_date DATE,
  contract_end_date DATE,
  irpf INTEGER DEFAULT 0,
  excess_days INTEGER DEFAULT 0
);

ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees can be viewed by authenticated users"
  ON public.employees FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Employees can be inserted by admins"
  ON public.employees FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt()->>'role' IN ('ROOT', 'ADMIN'));

CREATE POLICY "Employees can be updated by admins"
  ON public.employees FOR UPDATE
  TO authenticated
  USING (auth.jwt()->>'role' IN ('ROOT', 'ADMIN'));

CREATE POLICY "Employees can be deleted by admins"
  ON public.employees FOR DELETE
  TO authenticated
  USING (auth.jwt()->>'role' IN ('ROOT', 'ADMIN'));

-- =====================================================
-- TABLA: cities
-- =====================================================
CREATE TABLE IF NOT EXISTS public.cities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

-- =====================================================
-- TABLA: work_centers
-- =====================================================
CREATE TABLE IF NOT EXISTS public.work_centers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

-- =====================================================
-- TABLA: employee_categories
-- =====================================================
CREATE TABLE IF NOT EXISTS public.employee_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

-- =====================================================
-- TABLA: employee_statuses
-- =====================================================
CREATE TABLE IF NOT EXISTS public.employee_statuses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

-- =====================================================
-- TABLA: work_days
-- =====================================================
CREATE TABLE IF NOT EXISTS public.work_days (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

-- =====================================================
-- TABLA: shifts
-- =====================================================
CREATE TABLE IF NOT EXISTS public.shifts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

-- =====================================================
-- TABLA: contract_types
-- =====================================================
CREATE TABLE IF NOT EXISTS public.contract_types (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

-- Insertar datos iniciales para las tablas de referencia
INSERT INTO public.cities (id, name) VALUES
  ('city-1', 'Alcalá de Henares'),
  ('city-2', 'Guadalajara')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.work_centers (id, name) VALUES
  ('wc-1', 'Nave'),
  ('wc-2', 'Puerta Madrid'),
  ('wc-3', 'Gilitos'),
  ('wc-4', 'Moreras'),
  ('wc-5', 'Garena'),
  ('wc-6', 'Divino Valles'),
  ('wc-7', 'Taller'),
  ('wc-8', 'Oficinas')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.employee_categories (id, name) VALUES
  ('ec-1', 'Peón Limpieza'),
  ('ec-2', 'Peón Recogida'),
  ('ec-3', 'Oficial'),
  ('ec-4', 'Oficial 2ª'),
  ('ec-5', 'Mantenimiento'),
  ('ec-6', 'Mecánico'),
  ('ec-7', 'Encargado'),
  ('ec-8', 'Encargado General'),
  ('ec-9', 'Jefe de Servicio'),
  ('ec-10', 'Administrativo')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.employee_statuses (id, name) VALUES
  ('es-1', 'Trabajando'),
  ('es-2', 'Descanso'),
  ('es-3', 'Baja'),
  ('es-4', 'Días Propios'),
  ('es-5', 'Días Acumulados'),
  ('es-6', 'Vacaciones')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.work_days (id, name) VALUES
  ('wd-1', 'Lunes a Viernes'),
  ('wd-2', 'Fin de Semana'),
  ('wd-3', 'Rotativo 1'),
  ('wd-4', 'Rotativo 2')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.shifts (id, name) VALUES
  ('s-1', 'Mañana'),
  ('s-2', 'Tarde'),
  ('s-3', 'Noche')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.contract_types (id, name) VALUES
  ('ct-1', 'Indefinido'),
  ('ct-2', 'Temporal'),
  ('ct-3', 'Obra')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- DATOS DE PRUEBA: USUARIOS
-- =====================================================
INSERT INTO public.users (id, username, email, full_name, role, status, created_at) VALUES
  ('a1b2c3d4e5f6g7h8i9j0k1l2', 'm.torres', 'm.torres@empresa.com', 'Miguel Ángel Torres', 'ROOT', 'ACTIVE', '2025-01-10T08:30:00Z'),
  ('b2c3d4e5f6g7h8i9j0k1l2m3', 'admin', 'a.mendoza@empresa.com', 'Alejandro Mendoza', 'ADMIN', 'ACTIVE', '2025-01-15T10:15:00Z'),
  ('c3d4e5f6g7h8i9j0k1l2m3n4', 'manager', 'b.salazar@empresa.com', 'Beatriz Salazar', 'MANAGER', 'ACTIVE', '2025-02-01T14:22:00Z'),
  ('d4e5f6g7h8i9j0k1l2m3n4o5', 'user', 'c.fuentes@empresa.com', 'Carlos Fuentes', 'USER', 'ACTIVE', '2025-02-12T09:05:00Z'),
  ('e5f6g7h8i9j0k1l2m3n4o5p6', 'diana_reyes', 'd.reyes@empresa.com', 'Diana Reyes', 'MANAGER', 'ACTIVE', '2025-02-14T11:40:00Z'),
  ('f6g7h8i9j0k1l2m3n4o5p6q7', 'eduardo_gomez', 'e.gomez@empresa.com', 'Eduardo Gómez', 'USER', 'INACTIVE', '2025-02-18T16:50:00Z'),
  ('g7h8i9j0k1l2m3n4o5p6q7r8', 'gabriela_vaca', 'g.vaca@empresa.com', 'Gabriela Vaca', 'ADMIN', 'INACTIVE', '2025-01-20T13:12:00Z'),
  ('h8i9j0k1l2m3n4o5p6q7r8s9', 'hugo_perez', 'h.perez@empresa.com', 'Hugo Pérez', 'USER', 'ACTIVE', '2025-02-20T10:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- DATOS DE PRUEBA: EMPLEADOS
-- =====================================================
INSERT INTO public.employees (
  id, user_id, city_id, name, last_name_1, last_name_2, email, phone,
  category_id, status_id, work_center_id, active, shift, schedule, start_time, end_time,
  employee_category, own_days, accumulated_days, vacation_days, created_at, updated_at,
  personal_email, phone_fixed, work_day, work_center, iban, locker, medical_check,
  works_holidays, contract_type, contract_start_date, contract_end_date, irpf, excess_days
) VALUES
  ('000001', 'a1b2c3d4e5f6g7h8i9j0k1l2', 'city-1', 'Miguel Ángel', 'Torres', 'García', 'm.torres@empresa.com', '612345678',
  'ec-1', 'es-1', 'wc-1', true, 's-1', '08:00-16:00', '08:00', '16:00',
  'Peón Limpieza', 2, 5, 22, '2024-01-15T08:00:00Z', '2024-01-15T08:00:00Z',
  'm.torres@gmail.com', '918765432', 'wd-1', 'Nave', 'ES7620770024003102571234', 'L-001', true,
  true, 'ct-1', '2023-06-01', NULL, 15, 0),

  ('000002', 'b2c3d4e5f6g7h8i9j0k1l2m3', 'city-1', 'Alejandro', 'Mendoza', NULL, 'a.mendoza@empresa.com', '612345679',
  'ec-2', 'es-1', 'wc-2', true, 's-2', '14:00-22:00', '14:00', '22:00',
  'Peón Recogida', 1, 3, 22, '2024-02-10T09:00:00Z', '2024-02-10T09:00:00Z',
  'maria.rodriguez@gmail.com', '918765433', 'wd-1', 'Puerta Madrid', 'ES7620770024003102571235', 'L-002', true,
  false, 'ct-1', '2023-09-15', NULL, 12, 0),

  ('000003', 'c3d4e5f6g7h8i9j0k1l2m3n4', 'city-1', 'Beatriz', 'Salazar', NULL, 'b.salazar@empresa.com', '612345680',
  'ec-3', 'es-2', 'wc-3', true, 's-1', '08:00-16:00', '08:00', '16:00',
  'Oficial', 0, 0, 22, '2024-03-05T10:00:00Z', '2024-03-05T10:00:00Z',
  'carlos.martinez@gmail.com', '918765434', 'wd-2', 'Gilitos', 'ES7620770024003102571236', 'L-003', true,
  true, 'ct-1', '2022-01-10', NULL, 18, 0),

  ('000004', 'd4e5f6g7h8i9j0k1l2m3n4o5', 'city-1', 'Carlos', 'Fuentes', NULL, 'c.fuentes@empresa.com', '612345681',
  'ec-4', 'es-1', 'wc-4', true, 's-3', '22:00-06:00', '22:00', '06:00',
  'Oficial 2ª', 3, 7, 22, '2024-01-20T11:00:00Z', '2024-01-20T11:00:00Z',
  'ana.lopez@gmail.com', '918765435', 'wd-3', 'Moreras', 'ES7620770024003102571237', 'L-004', true,
  true, 'ct-2', '2024-01-01', '2025-01-01', 14, 0),

  ('000005', NULL, 'city-2', 'Pedro', 'Hernández', 'Díaz', 'p.hernandez@empresa.com', '612345682',
  'ec-5', 'es-3', 'wc-5', false, 's-1', '08:00-16:00', '08:00', '16:00',
  'Mantenimiento', 0, 0, 22, '2023-11-08T08:00:00Z', '2024-05-15T08:00:00Z',
  'pedro.hernandez@gmail.com', '918765436', 'wd-1', 'Garena', 'ES7620770024003102571238', 'L-005', false,
  false, 'ct-1', '2022-05-20', NULL, 16, 0),

  ('000006', NULL, 'city-1', 'Laura', 'Jiménez', 'Ruiz', 'l.jimenez@empresa.com', '612345683',
  'ec-6', 'es-1', 'wc-7', true, 's-2', '14:00-22:00', '14:00', '22:00',
  'Mecánico', 4, 8, 22, '2023-08-12T09:00:00Z', '2023-08-12T09:00:00Z',
  'laura.jimenez@gmail.com', '918765437', 'wd-1', 'Taller', 'ES7620770024003102571239', 'L-006', true,
  true, 'ct-1', '2023-03-01', NULL, 17, 0),

  ('000007', NULL, 'city-2', 'Miguel', 'Torres', 'Navarro', 'm.torres@empresa.com', '612345684',
  'ec-7', 'es-4', 'wc-6', true, 's-1', '08:00-16:00', '08:00', '16:00',
  'Encargado', 5, 10, 22, '2023-04-18T10:00:00Z', '2024-02-20T10:00:00Z',
  'miguel.torres@gmail.com', '918765438', 'wd-4', 'Divino Valles', 'ES7620770024003102571240', 'L-007', true,
  true, 'ct-1', '2021-08-01', NULL, 20, 2),

  ('000008', NULL, 'city-1', 'Carmen', 'Morales', 'Serrano', 'c.morales@empresa.com', '612345685',
  'ec-8', 'es-1', 'wc-8', true, 's-1', '09:00-17:00', '09:00', '17:00',
  'Encargado General', 2, 4, 22, '2022-06-25T08:00:00Z', '2022-06-25T08:00:00Z',
  'carmen.morales@gmail.com', '918765439', 'wd-1', 'Oficinas', 'ES7620770024003102571241', 'L-008', true,
  true, 'ct-1', '2020-01-15', NULL, 22, 0),

  ('000009', NULL, 'city-2', 'Javier', 'Ramos', 'Castro', 'j.ramos@empresa.com', '612345686',
  'ec-9', 'es-5', 'wc-1', true, 's-2', '14:00-22:00', '14:00', '22:00',
  'Jefe de Servicio', 1, 2, 22, '2023-09-30T09:00:00Z', '2024-04-10T09:00:00Z',
  'javier.ramos@gmail.com', '918765440', 'wd-2', 'Nave', 'ES7620770024003102571242', 'L-009', true,
  false, 'ct-1', '2019-05-01', NULL, 25, 0),

  ('000011', NULL, 'city-1', 'Sofia', 'Vega', 'Ortega', 's.vega@empresa.com', '612345687',
  'ec-10', 'es-1', 'wc-8', true, 's-1', '09:00-17:00', '09:00', '17:00',
  'Administrativo', 3, 6, 22, '2024-01-08T08:00:00Z', '2024-01-08T08:00:00Z',
  'sofia.vega@gmail.com', '918765441', 'wd-1', 'Oficinas', 'ES7620770024003102571243', 'L-010', true,
  true, 'ct-1', '2023-11-01', NULL, 15, 0),

  ('000012', NULL, 'city-2', 'Antonio', 'Molina', 'Delgado', 'a.molina@empresa.com', '612345688',
  'ec-1', 'es-6', 'wc-2', true, 's-3', '22:00-06:00', '22:00', '06:00',
  'Peón Limpieza', 0, 0, 22, '2024-02-22T10:00:00Z', '2024-06-01T10:00:00Z',
  'antonio.molina@gmail.com', '918765442', 'wd-3', 'Puerta Madrid', 'ES7620770024003102571244', 'L-011', true,
  true, 'ct-3', '2024-02-15', '2024-12-31', 10, 0),

  ('000013', NULL, 'city-1', 'Isabel', 'Romero', 'Aguilar', 'i.romero@empresa.com', '612345689',
  'ec-2', 'es-1', 'wc-3', true, 's-1', '08:00-16:00', '08:00', '16:00',
  'Peón Recogida', 2, 4, 22, '2023-12-05T09:00:00Z', '2023-12-05T09:00:00Z',
  'isabel.romero@gmail.com', '918765443', 'wd-1', 'Gilitos', 'ES7620770024003102571245', 'L-012', true,
  true, 'ct-1', '2023-06-01', NULL, 13, 0),

  ('000014', NULL, 'city-2', 'David', 'Cortés', 'Garrido', 'd.cortes@empresa.com', '612345690',
  'ec-3', 'es-1', 'wc-4', true, 's-2', '14:00-22:00', '14:00', '22:00',
  'Oficial', 1, 2, 22, '2024-03-18T08:00:00Z', '2024-03-18T08:00:00Z',
  'david.cortes@gmail.com', '918765444', 'wd-1', 'Moreras', 'ES7620770024003102571246', 'L-013', true,
  true, 'ct-2', '2024-03-01', '2025-03-01', 14, 0),

  ('000015', NULL, 'city-1', 'Elena', 'Soto', 'Pérez', 'e.soto@empresa.com', '612345691',
  'ec-4', 'es-2', 'wc-5', true, 's-1', '08:00-16:00', '08:00', '16:00',
  'Oficial 2ª', 0, 0, 22, '2023-10-12T10:00:00Z', '2024-05-20T10:00:00Z',
  'elena.soto@gmail.com', '918765445', 'wd-2', 'Garena', 'ES7620770024003102571247', 'L-014', true,
  false, 'ct-1', '2022-09-01', NULL, 15, 0),

  ('000016', NULL, 'city-2', 'Francisco', 'Ruiz', 'Guerrero', 'f.ruiz@empresa.com', '612345692',
  'ec-5', 'es-1', 'wc-7', true, 's-2', '14:00-22:00', '14:00', '22:00',
  'Mantenimiento', 4, 8, 22, '2023-07-22T09:00:00Z', '2023-07-22T09:00:00Z',
  'francisco.ruiz@gmail.com', '918765446', 'wd-1', 'Taller', 'ES7620770024003102571248', 'L-015', true,
  true, 'ct-1', '2022-02-15', NULL, 17, 1),

  ('000017', NULL, 'city-1', 'Patricia', 'Flores', 'Moreno', 'p.flores@empresa.com', '612345693',
  'ec-6', 'es-1', 'wc-7', true, 's-1', '08:00-16:00', '08:00', '16:00',
  'Mecánico', 3, 5, 22, '2024-01-30T08:00:00Z', '2024-01-30T08:00:00Z',
  'patricia.flores@gmail.com', '918765447', 'wd-1', 'Taller', 'ES7620770024003102571249', 'L-016', true,
  true, 'ct-1', '2023-10-01', NULL, 16, 0),

  ('000018', NULL, 'city-2', 'Roberto', 'Gil', 'Santos', 'r.gil@empresa.com', '612345694',
  'ec-7', 'es-3', 'wc-6', false, 's-3', '22:00-06:00', '22:00', '06:00',
  'Encargado', 0, 0, 22, '2023-05-14T10:00:00Z', '2024-04-05T10:00:00Z',
  'roberto.gil@gmail.com', '918765448', 'wd-4', 'Divino Valles', 'ES7620770024003102571250', 'L-017', false,
  false, 'ct-1', '2021-03-01', NULL, 19, 0),

  ('000019', NULL, 'city-1', 'Sandra', 'Núñez', 'Herrera', 's.nunez@empresa.com', '612345695',
  'ec-8', 'es-1', 'wc-8', true, 's-1', '09:00-17:00', '09:00', '17:00',
  'Encargado General', 2, 4, 22, '2022-11-20T08:00:00Z', '2022-11-20T08:00:00Z',
  'sandra.nunez@gmail.com', '918765449', 'wd-1', 'Oficinas', 'ES7620770024003102571251', 'L-018', true,
  true, 'ct-1', '2020-08-01', NULL, 21, 0),

  ('000020', NULL, 'city-2', 'Alberto', 'Castillo', 'Jiménez', 'a.castillo@empresa.com', '612345696',
  'ec-9', 'es-1', 'wc-1', true, 's-2', '14:00-22:00', '14:00', '22:00',
  'Jefe de Servicio', 1, 3, 22, '2023-03-08T09:00:00Z', '2023-03-08T09:00:00Z',
  'alberto.castillo@gmail.com', '918765450', 'wd-1', 'Nave', 'ES7620770024003102571252', 'L-019', true,
  true, 'ct-1', '2018-06-01', NULL, 24, 0),

  ('000021', NULL, 'city-1', 'Natalia', 'Domínguez', 'Vargas', 'n.dominguez@empresa.com', '612345697',
  'ec-10', 'es-4', 'wc-8', true, 's-1', '09:00-17:00', '09:00', '17:00',
  'Administrativo', 5, 9, 22, '2024-02-28T08:00:00Z', '2024-06-10T08:00:00Z',
  'natalia.dominguez@gmail.com', '918765451', 'wd-2', 'Oficinas', 'ES7620770024003102571253', 'L-020', true,
  false, 'ct-1', '2023-04-15', NULL, 14, 3)
ON CONFLICT (id) DO NOTHING;