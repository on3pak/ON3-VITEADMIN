-- ============================================================
-- SEED: Servicios
-- Ejecutar contra la base de datos del backend ON3BACK
-- Compatible con PostgreSQL / TypeORM
-- ============================================================

BEGIN;

-- ============================================================
-- 1. SERVICIOS
-- ============================================================

INSERT INTO services (id, work_center_id, shift_id, name, category, staff_requirement, week_start, created_at, updated_at) VALUES
  -- 10 BMIX (Barrido Mixto) in wc_000001 (Nave)
  ('sv_000001', 'wc_000001', 's_1', 'BMIX1', 'BARRIDO MIXTO', '{"oficial": "ec_000003", "peones": 2}', '2026-06-01', '2025-01-01T08:00:00Z', '2025-06-01T08:00:00Z'),
  ('sv_000002', 'wc_000001', 's_1', 'BMIX2', 'BARRIDO MIXTO', '{"oficial": null, "peones": 1}', '2026-06-01', '2025-01-01T08:00:00Z', '2025-06-01T08:00:00Z'),
  ('sv_000003', 'wc_000001', 's_1', 'BMIX3', 'BARRIDO MIXTO', '{"oficial": "ec_000003", "peones": 1}', '2026-06-01', '2025-01-01T08:00:00Z', '2025-06-01T08:00:00Z'),
  ('sv_000004', 'wc_000001', 's_1', 'BMIX4', 'BARRIDO MIXTO', '{"oficial": "ec_000004", "peones": 2}', '2026-06-01', '2025-01-01T08:00:00Z', '2025-06-01T08:00:00Z'),
  ('sv_000005', 'wc_000001', 's_1', 'BMIX5', 'BARRIDO MIXTO', '{"oficial": null, "peones": 1}', '2026-06-01', '2025-01-01T08:00:00Z', '2025-06-01T08:00:00Z'),
  ('sv_000006', 'wc_000001', 's_1', 'BMIX6', 'BARRIDO MIXTO', '{"oficial": "ec_000003", "peones": 1}', '2026-06-01', '2025-01-01T08:00:00Z', '2025-06-01T08:00:00Z'),
  ('sv_000007', 'wc_000001', 's_1', 'BMIX7', 'BARRIDO MIXTO', '{"oficial": "ec_000004", "peones": 2}', '2026-06-01', '2025-01-01T08:00:00Z', '2025-06-01T08:00:00Z'),
  ('sv_000008', 'wc_000001', 's_2', 'BMIX8', 'BARRIDO MIXTO', '{"oficial": null, "peones": 1}', '2026-06-01', '2025-01-01T08:00:00Z', '2025-06-01T08:00:00Z'),
  ('sv_000009', 'wc_000001', 's_2', 'BMIX9', 'BARRIDO MIXTO', '{"oficial": "ec_000004", "peones": 1}', '2026-06-01', '2025-01-01T08:00:00Z', '2025-06-01T08:00:00Z'),
  ('sv_000010', 'wc_000001', 's_3', 'BMIX10', 'BARRIDO MIXTO', '{"oficial": "ec_000004", "peones": 2}', '2026-06-01', '2025-01-01T08:00:00Z', '2025-06-01T08:00:00Z'),
  -- 5 BMEC (Barrido Mecánico) in wc_000001 (Nave)
  ('sv_000011', 'wc_000001', 's_1', 'BMEC1', 'BARRIDO MECÁNICO', '{"oficial": null, "peones": 1}', '2026-06-01', '2025-01-01T08:00:00Z', '2025-06-01T08:00:00Z'),
  ('sv_000012', 'wc_000001', 's_1', 'BMEC2', 'BARRIDO MECÁNICO', '{"oficial": "ec_000004", "peones": 1}', '2026-06-01', '2025-01-01T08:00:00Z', '2025-06-01T08:00:00Z'),
  ('sv_000013', 'wc_000001', 's_1', 'BMEC3', 'BARRIDO MECÁNICO', '{"oficial": "ec_000003", "peones": 2}', '2026-06-01', '2025-01-01T08:00:00Z', '2025-06-01T08:00:00Z'),
  ('sv_000014', 'wc_000001', 's_2', 'BMEC4', 'BARRIDO MECÁNICO', '{"oficial": null, "peones": 1}', '2026-06-01', '2025-01-01T08:00:00Z', '2025-06-01T08:00:00Z'),
  ('sv_000015', 'wc_000001', 's_3', 'BMEC5', 'BARRIDO MECÁNICO', '{"oficial": "ec_000003", "peones": 1}', '2026-06-01', '2025-01-01T08:00:00Z', '2025-06-01T08:00:00Z'),
  -- 5 RVOL (Recogida) in wc_000001 (Nave)
  ('sv_000016', 'wc_000001', 's_1', 'RVOL1', 'RECOGIDA', '{"oficial": "ec_000004", "peones": 2}', '2026-06-01', '2025-01-01T08:00:00Z', '2025-06-01T08:00:00Z'),
  ('sv_000017', 'wc_000001', 's_1', 'RVOL2', 'RECOGIDA', '{"oficial": null, "peones": 1}', '2026-06-01', '2025-01-01T08:00:00Z', '2025-06-01T08:00:00Z'),
  ('sv_000018', 'wc_000001', 's_1', 'RVOL3', 'RECOGIDA', '{"oficial": "ec_000004", "peones": 1}', '2026-06-01', '2025-01-01T08:00:00Z', '2025-06-01T08:00:00Z'),
  ('sv_000019', 'wc_000001', 's_2', 'RVOL4', 'RECOGIDA', '{"oficial": "ec_000003", "peones": 2}', '2026-06-01', '2025-01-01T08:00:00Z', '2025-06-01T08:00:00Z'),
  ('sv_000020', 'wc_000001', 's_3', 'RVOL5', 'RECOGIDA', '{"oficial": null, "peones": 1}', '2026-06-01', '2025-01-01T08:00:00Z', '2025-06-01T08:00:00Z'),
  -- 1 BALD (Baldeo) in wc_000002 (Puerta Madrid)
  ('sv_000021', 'wc_000002', 's_1', 'BALD1', 'BALDEO', '{"oficial": "ec_000003", "peones": 1}', '2026-06-01', '2025-01-01T08:00:00Z', '2025-06-01T08:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 2. TAREAS (140 tasks per service = 2940 total)
-- Generadas mediante PL/pgSQL
-- ============================================================

DO $$
DECLARE
  task_templates TEXT[] := ARRAY[
    'Barrido manual de aceras y calzada',
    'Vaciado de papeleras',
    'Limpieza de imbornales y sumideros',
    'Desbroce de malas hierbas',
    'Barrido mecánico con sopladora',
    'Reposición de bolsas en papeleras',
    'Limpieza de contenedores soterrados',
    'Recogida de residuos voluminosos',
    'Limpieza de marquesinas y paradas',
    'Baldeo de calles con agua a presión',
    'Limpieza de parques y jardines',
    'Retirada de cartelería ilegal',
    'Limpieza de fuentes ornamentales',
    'Desinfección de contenedores',
    'Barrido manual de zonas peatonales',
    'Limpieza de imbornales con camión cuba',
    'Recogida de hojas y restos de poda',
    'Limpieza de solares y terrenos baldíos',
    'Mantenimiento de jardineras y parterres',
    'Limpieza de mobiliario urbano'
  ];
  day_zones TEXT[] := ARRAY[
    'Zona Norte - Casco Antiguo',
    'Zona Sur - Polígono Industrial',
    'Zona Este - Parque Lineal',
    'Zona Oeste - Barrio Residencial',
    'Zona Centro - Eje Comercial',
    'Zona Periferia - Área Deportiva',
    'Zona Verde - Parques Periurbanos'
  ];
  sv_id TEXT;
  task_id INTEGER;
BEGIN
  FOR sv_id IN SELECT id FROM services LOOP
    task_id := 0;
    FOR day IN 0..6 LOOP
      FOR t IN 0..19 LOOP
        INSERT INTO service_tasks (id, service_id, day_index, task_index, description, status, zone, assigned_to, created_at, updated_at)
        VALUES (
          sv_id || '-task-' || task_id,
          sv_id,
          day,
          t,
          task_templates[t + 1] || ' - ' || day_zones[day + 1],
          'PENDING',
          day_zones[day + 1],
          NULL,
          '2025-06-01T08:00:00Z'::timestamptz,
          '2025-06-01T08:00:00Z'::timestamptz
        )
        ON CONFLICT (id) DO NOTHING;
        task_id := task_id + 1;
      END LOOP;
    END LOOP;
  END LOOP;
END $$;

COMMIT;
