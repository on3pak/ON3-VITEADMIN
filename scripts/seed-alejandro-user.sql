-- ============================================================
-- Re-insertar usuario Alejandro Mendoza García
-- ============================================================

INSERT INTO users (id, employee_id, username, email, full_name, password_hash, role, status, language, created_at, updated_at, city_id)
VALUES (
  'b2c3d4e5-f6a7-48b8-a9c0-1d2e3f4a5b6c',
  '000002',
  'a.mendoza2',
  'a.mendoza2@on3.com',
  'Alejandro Mendoza García',
  'admin2',
  'ADMIN',
  'ACTIVE',
  'ES',
  '2025-01-15T10:15:00Z'::timestamptz,
  '2025-01-15T10:15:00Z'::timestamptz,
  'ci_000001'
)
ON CONFLICT (id) DO UPDATE SET
  employee_id = EXCLUDED.employee_id,
  username = EXCLUDED.username,
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  status = EXCLUDED.status,
  language = EXCLUDED.language,
  updated_at = NOW();
