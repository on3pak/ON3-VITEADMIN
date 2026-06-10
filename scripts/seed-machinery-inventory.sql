-- ============================================================
-- SEED: Maquinaria e Inventario
-- Ejecutar contra la base de datos del backend ON3BACK
-- Compatible con PostgreSQL / TypeORM
-- ============================================================

BEGIN;

-- ============================================================
-- 1. LOOKUPS: Maquinaria
-- ============================================================

INSERT INTO machinery_statuses (id, name) VALUES
  ('ms-1', 'Disponible'),
  ('ms-2', 'Mantenimiento'),
  ('ms-3', 'Averiado'),
  ('ms-4', 'Baja')
ON CONFLICT (id) DO NOTHING;

INSERT INTO machinery_subtypes (id, name) VALUES
  ('mst-1', 'Sopladora'),
  ('mst-2', 'Desbrozadora'),
  ('mst-3', 'Cortacésped'),
  ('mst-4', 'Motocultor'),
  ('mst-5', 'Hidrolimpiadora'),
  ('mst-6', 'Barredora'),
  ('mst-7', 'Motosierra'),
  ('mst-8', 'Generador')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 2. LOOKUPS: Inventario
-- ============================================================

INSERT INTO inventory_statuses (id, name, category) VALUES
  ('rs-1', 'Disponible', 'CLOTHING'),
  ('rs-2', 'Agotado', 'CLOTHING'),
  ('rs-3', 'En Reposición', 'CLOTHING'),
  ('es-1', 'Disponible', 'PPE'),
  ('es-2', 'Agotado', 'PPE'),
  ('es-3', 'En Reposición', 'PPE')
ON CONFLICT (id) DO NOTHING;

INSERT INTO inventory_subtypes (id, name, category) VALUES
  ('ist-1', 'Pantalón', 'CLOTHING'),
  ('ist-2', 'Camisa', 'CLOTHING'),
  ('ist-3', 'Chaqueta', 'CLOTHING'),
  ('ist-4', 'Forro', 'CLOTHING'),
  ('ist-5', 'Chaquetón', 'CLOTHING'),
  ('ist-6', 'Gorra', 'CLOTHING'),
  ('ist-7', 'Zapatos', 'CLOTHING'),
  ('ist-8', 'Botas', 'CLOTHING'),
  ('ist-11', 'Casco', 'PPE'),
  ('ist-12', 'Guantes', 'PPE'),
  ('ist-13', 'Mascarilla', 'PPE'),
  ('ist-14', 'Máscara', 'PPE'),
  ('ist-15', 'Arnés', 'PPE'),
  ('ist-16', 'Protector', 'PPE'),
  ('ist-17', 'Gafas', 'PPE')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 3. MAQUINARIA
-- ============================================================

INSERT INTO machinery (id, name, description, subtype_id, status_id, quantity, min_stock, unit, city_id, work_center_id, location, brand, model, serial_number, warranty_expiration, last_maintenance, next_maintenance, assigned_to, notes, created_at, updated_at) VALUES
  ('mch_000001', 'Sopladora STIHL BR600', 'Sopladora de gasolina STIHL BR 600', 'mst-1', 'ms-1', 3, 1, 'unidades', 'ci_000001', 'wc_000001', 'Garaje Nave - Estante 1', 'STIHL', 'BR 600', 'STIHL-BR600-001', '2027-01-01', '2025-03-01', '2025-09-01', NULL, 'Velocidad variable', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('mch_000002', 'Desbrozadora STIHL FS131', 'Desbrozadora de gasolina STIHL FS 131', 'mst-2', 'ms-1', 4, 1, 'unidades', 'ci_000001', 'wc_000003', 'Garaje Gilitos - Estante 2', 'STIHL', 'FS 131', 'STIHL-FS131-001', '2026-06-01', '2025-02-15', '2025-08-15', NULL, 'Cabezal de hilo y cuchilla', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('mch_000003', 'Cortacésped Husqvarna LC247', 'Cortacésped autopropulsado', 'mst-3', 'ms-1', 2, 1, 'unidades', 'ci_000001', 'wc_000005', 'Garaje Garena - Estante 3', 'Husqvarna', 'LC 247', 'HUSQ-LC247-001', '2027-03-01', '2025-01-20', '2025-07-20', NULL, 'Gasolina 4 tiempos', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('mch_000004', 'Motocultor Honda F220', 'Motocultor con motor Honda', 'mst-4', 'ms-3', 1, 1, 'unidades', 'ci_000001', 'wc_000001', 'Garaje Nave - Estante 4', 'Honda', 'F220', 'HONDA-F220-001', NULL, '2024-11-01', '2025-05-01', NULL, 'Requiere revisión de transmisión', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('mch_000005', 'Hidrolimpiadora Kärcher K5', 'Hidrolimpiadora de presión Kärcher K5', 'mst-5', 'ms-1', 3, 1, 'unidades', 'ci_000001', 'wc_000003', 'Garaje Gilitos - Estante 5', 'Kärcher', 'K5 Premium', 'KARCHER-K5-001', '2026-09-01', '2025-02-01', '2025-08-01', NULL, 'Incluye lanza y boquillas', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('mch_000006', 'Barredora Tennant 5700', 'Barredora industrial Tennant 5700', 'mst-6', 'ms-2', 1, 1, 'unidades', 'ci_000001', 'wc_000007', 'Taller - Zona reparación', 'Tennant', '5700', 'TENNANT-5700-001', NULL, '2024-12-15', '2025-06-15', NULL, 'En reparación - motor de cepillo', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('mch_000007', 'Motosierra STIHL MS261', 'Motosierra STIHL MS 261 C-M', 'mst-7', 'ms-1', 2, 1, 'unidades', 'ci_000002', 'wc_000011', 'Centro01 - Almacén herramientas', 'STIHL', 'MS 261 C-M', 'STIHL-MS261-001', '2027-02-01', '2025-03-10', '2025-09-10', NULL, 'Espada de 40cm', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('mch_000008', 'Generador Honda EU30', 'Generador portátil Honda EU30i', 'mst-8', 'ms-1', 1, 1, 'unidades', 'ci_000002', 'wc_000011', 'Centro01 - Almacén', 'Honda', 'EU30i', 'HONDA-EU30-001', '2028-01-01', '2025-01-05', '2025-07-05', NULL, 'Asignado a Javier Ramos', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('mch_000009', 'Sopladora STIHL BR600 (2)', 'Segunda sopladora STIHL BR 600', 'mst-1', 'ms-1', 1, 1, 'unidades', 'ci_000002', 'wc_000011', 'Centro01 - Almacén herramientas', 'STIHL', 'BR 600', 'STIHL-BR600-002', '2027-01-01', '2025-04-01', '2025-10-01', NULL, 'Unidad de respaldo', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('mch_000010', 'Desbrozadora STIHL FS131 (2)', 'Segunda desbrozadora STIHL FS 131', 'mst-2', 'ms-2', 1, 1, 'unidades', 'ci_000002', 'wc_000011', 'Centro01 - Almacén', 'STIHL', 'FS 131', 'STIHL-FS131-002', '2026-06-01', '2025-05-01', '2025-11-01', NULL, 'En mantenimiento preventivo', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('mch_000011', 'Cortacésped Husqvarna LC247 (2)', 'Segundo cortacésped Husqvarna', 'mst-3', 'ms-3', 1, 1, 'unidades', 'ci_000002', 'wc_000011', 'Centro01 - Exterior', 'Husqvarna', 'LC 247', 'HUSQ-LC247-002', '2027-03-01', '2024-12-01', '2025-06-01', NULL, 'Motor averiado - pendiente de reparar', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('mch_000012', 'Motocultor Honda F220 (2)', 'Segundo motocultor Honda F220', 'mst-4', 'ms-4', 0, 1, 'unidades', 'ci_000001', 'wc_000001', 'Garaje Nave - Estante 5', 'Honda', 'F220', 'HONDA-F220-002', NULL, '2024-06-01', NULL, NULL, 'De baja - motor irrecuperable', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('mch_000013', 'Hidrolimpiadora Kärcher K7', 'Hidrolimpiadora Kärcher K7 premium', 'mst-5', 'ms-1', 2, 1, 'unidades', 'ci_000001', 'wc_000003', 'Garaje Gilitos', 'Kärcher', 'K7', 'KARCHER-K7-001', '2028-06-01', '2025-03-15', '2025-09-15', NULL, 'Alta presión', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('mch_000014', 'Barredora Tennant 5700 (2)', 'Segunda barredora industrial Tennant', 'mst-6', 'ms-1', 1, 1, 'unidades', 'ci_000001', 'wc_000007', 'Taller', 'Tennant', '5700', 'TENNANT-5700-002', NULL, '2025-02-10', '2025-08-10', NULL, 'Unidad de repuesto', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('mch_000015', 'Motosierra STIHL MS261 (2)', 'Segunda motosierra STIHL MS 261', 'mst-7', 'ms-1', 1, 1, 'unidades', 'ci_000001', 'wc_000005', 'Garaje Garena', 'STIHL', 'MS 261 C-M', 'STIHL-MS261-002', '2027-02-01', '2025-04-01', '2025-10-01', NULL, 'Espada de 45cm', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('mch_000016', 'Generador Hyundai HY2000', 'Generador portátil Hyundai HY2000i', 'mst-8', 'ms-1', 1, 1, 'unidades', 'ci_000001', 'wc_000001', 'Garaje Nave', 'Hyundai', 'HY2000i', 'HYUNDAI-HY2-001', '2028-01-01', '2025-01-20', '2025-07-20', NULL, '', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('mch_000017', 'Sopladora STIHL BR600 (3)', 'Tercera sopladora STIHL BR 600', 'mst-1', 'ms-1', 2, 1, 'unidades', 'ci_000001', 'wc_000003', 'Garaje Gilitos', 'STIHL', 'BR 600', 'STIHL-BR600-003', '2027-06-01', '2025-03-20', '2025-09-20', NULL, '', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('mch_000018', 'Desbrozadora STIHL FS131 (3)', 'Tercera desbrozadora STIHL FS 131', 'mst-2', 'ms-1', 2, 1, 'unidades', 'ci_000002', 'wc_000011', 'Centro01 - Almacén', 'STIHL', 'FS 131', 'STIHL-FS131-003', '2026-09-01', '2025-04-10', '2025-10-10', NULL, '', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('mch_000019', 'Motocultor Honda F220 (3)', 'Tercer motocultor Honda F220', 'mst-4', 'ms-2', 1, 1, 'unidades', 'ci_000002', 'wc_000011', 'Centro01 - Almacén', 'Honda', 'F220', 'HONDA-F220-003', NULL, '2025-05-01', '2025-11-01', NULL, 'En mantenimiento preventivo', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('mch_000020', 'Cortacésped Husqvarna LC247 (3)', 'Tercer cortacésped Husqvarna', 'mst-3', 'ms-3', 1, 1, 'unidades', 'ci_000002', 'wc_000011', 'Centro01 - Exterior', 'Husqvarna', 'LC 247', 'HUSQ-LC247-003', '2027-03-01', '2025-01-10', '2025-07-10', NULL, 'Averiado - cuchilla desviada', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('mch_000021', 'Motosierra STIHL MS181', 'Motosierra STIHL MS 181 C-BE', 'mst-7', 'ms-1', 1, 1, 'unidades', 'ci_000002', 'wc_000011', 'Centro01 - Almacén', 'STIHL', 'MS 181 C-BE', 'STIHL-MS181-001', '2027-08-01', '2025-02-15', '2025-08-15', NULL, 'Ligera para poda', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('mch_000022', 'Desbrozadora STIHL FS94', 'Desbrozadora STIHL FS 94', 'mst-2', 'ms-1', 1, 1, 'unidades', 'ci_000002', 'wc_000011', 'Centro01 - Almacén', 'STIHL', 'FS 94', 'STIHL-FS94-001', '2027-04-01', '2025-03-05', '2025-09-05', NULL, '', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('mch_000023', 'Sopladora STIHL BR600 (4)', 'Cuarta sopladora STIHL BR 600', 'mst-1', 'ms-1', 1, 1, 'unidades', 'ci_000002', 'wc_000011', 'Centro01 - Almacén', 'STIHL', 'BR 600', 'STIHL-BR600-004', '2027-06-01', '2025-04-15', '2025-10-15', NULL, '', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('mch_000024', 'Cortacésped Husqvarna LC247 (4)', 'Cuarto cortacésped Husqvarna', 'mst-3', 'ms-1', 1, 1, 'unidades', 'ci_000002', 'wc_000011', 'Centro01 - Exterior', 'Husqvarna', 'LC 247', 'HUSQ-LC247-004', '2027-03-01', '2025-02-20', '2025-08-20', NULL, '', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 4. INVENTARIO: Ropa (CLOTHING)
-- ============================================================

INSERT INTO inventory_items (id, name, description, category, subtype_id, status_id, quantity, min_stock, unit, city_id, work_center_id, location, color, size, gender, assigned_to, notes, attributes, created_at, updated_at) VALUES

  -- Pantalones (ist-1)
  ('inv_000001', 'Pantalón Verano', 'Pantalón de trabajo ligero verano', 'CLOTHING', 'ist-1', 'rs-1', 30, 10, 'unidades', 'ci_000001', 'wc_000009', 'Estante A-1', 'Verde-Amarilla', 'L', 'Hombre', NULL, '', '{"material": "Algodón/Poliéster reflectante"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000002', 'Pantalón Verano', 'Pantalón de trabajo ligero verano', 'CLOTHING', 'ist-1', 'rs-1', 25, 10, 'unidades', 'ci_000001', 'wc_000009', 'Estante A-1', 'Verde-Amarilla', 'M', 'Hombre', NULL, '', '{"material": "Algodón/Poliéster reflectante"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000003', 'Pantalón Invierno', 'Pantalón de trabajo térmico invierno', 'CLOTHING', 'ist-1', 'rs-1', 20, 10, 'unidades', 'ci_000001', 'wc_000009', 'Estante A-2', 'Verde-Amarilla', 'L', 'Hombre', NULL, '', '{"material": "Algodón/Poliéster reflectante térmico"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000004', 'Pantalón Invierno', 'Pantalón de trabajo térmico invierno', 'CLOTHING', 'ist-1', 'rs-1', 15, 10, 'unidades', 'ci_000001', 'wc_000009', 'Estante A-2', 'Verde-Amarilla', 'M', 'Hombre', NULL, '', '{"material": "Algodón/Poliéster reflectante térmico"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000036', 'Pantalón Verano', 'Pantalón verano encargado', 'CLOTHING', 'ist-1', 'rs-1', 18, 10, 'unidades', 'ci_000001', 'wc_000009', 'Estante A-1', 'Azul', 'XL', 'Hombre', NULL, '', '{"material": "Algodón ligero"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000045', 'Pantalón Verano', 'Pantalón verano talla XL', 'CLOTHING', 'ist-1', 'rs-1', 20, 10, 'unidades', 'ci_000001', 'wc_000009', 'Estante A-3', 'Verde-Amarilla', 'XL', 'Hombre', NULL, '', '{"material": "Algodón/Poliéster reflectante"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000049', 'Pantalón Invierno', 'Pantalón invierno térmico talla XL', 'CLOTHING', 'ist-1', 'rs-1', 14, 10, 'unidades', 'ci_000001', 'wc_000009', 'Estante A-3', 'Verde-Amarilla', 'XL', 'Hombre', NULL, '', '{"material": "Algodón/Poliéster reflectante térmico"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000050', 'Pantalón Verano', 'Pantalón verano talla XXL', 'CLOTHING', 'ist-1', 'rs-1', 10, 5, 'unidades', 'ci_000002', 'wc_000021', 'Estante A-1', 'Verde-Amarilla', 'XXL', 'Hombre', NULL, '', '{"material": "Algodón/Poliéster reflectante"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000077', 'Pantalón Verano', 'Pantalón verano encargado talla S', 'CLOTHING', 'ist-1', 'rs-1', 10, 5, 'unidades', 'ci_000002', 'wc_000021', 'Estante A-1', 'Azul', 'S', 'Hombre', NULL, '', '{"material": "Algodón ligero"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),

  -- Camisas (ist-2)
  ('inv_000005', 'Camisa Verano', 'Camisa manga corta verano', 'CLOTHING', 'ist-2', 'rs-1', 40, 10, 'unidades', 'ci_000001', 'wc_000009', 'Estante B-1', 'Verde-Amarilla', 'L', 'Hombre', NULL, '', '{"material": "Algodón/Poliéster reflectante"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000006', 'Camisa Verano', 'Camisa manga corta verano', 'CLOTHING', 'ist-2', 'rs-2', 0, 10, 'unidades', 'ci_000001', 'wc_000009', 'Estante B-1', 'Verde-Amarilla', 'M', 'Hombre', NULL, 'agotado', '{"material": "Algodón/Poliéster reflectante"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000007', 'Camisa Invierno', 'Camisa manga larga invierno encargado', 'CLOTHING', 'ist-2', 'rs-1', 20, 10, 'unidades', 'ci_000002', 'wc_000021', 'Estante A-1', 'Azul', 'L', 'Hombre', NULL, '', '{"material": "Algodón/Poliéster"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000037', 'Camisa Invierno', 'Camisa invierno encargado', 'CLOTHING', 'ist-2', 'rs-3', 12, 10, 'unidades', 'ci_000002', 'wc_000021', 'Estante A-2', 'Azul', 'M', 'Hombre', NULL, 'en reposición', '{"material": "Algodón/Poliéster"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000046', 'Camisa Verano', 'Camisa verano manga corta talla XL', 'CLOTHING', 'ist-2', 'rs-1', 18, 10, 'unidades', 'ci_000001', 'wc_000009', 'Estante B-2', 'Verde-Amarilla', 'XL', 'Hombre', NULL, '', '{"material": "Algodón/Poliéster reflectante"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000048', 'Camisa Invierno', 'Camisa invierno encargado talla XL', 'CLOTHING', 'ist-2', 'rs-1', 15, 10, 'unidades', 'ci_000001', 'wc_000009', 'Estante B-2', 'Azul', 'XL', 'Hombre', NULL, '', '{"material": "Algodón/Poliéster"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000051', 'Camisa Verano', 'Camisa verano manga corta talla XXL', 'CLOTHING', 'ist-2', 'rs-1', 12, 5, 'unidades', 'ci_000002', 'wc_000021', 'Estante B-1', 'Verde-Amarilla', 'XXL', 'Hombre', NULL, '', '{"material": "Algodón/Poliéster reflectante"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),

  -- Chaquetas (ist-3)
  ('inv_000008', 'Chaqueta Verano', 'Chaqueta transpirable verano', 'CLOTHING', 'ist-3', 'rs-1', 15, 5, 'unidades', 'ci_000002', 'wc_000021', 'Estante A-2', 'Verde-Amarilla', 'L', 'Hombre', NULL, '', '{"material": "Poliéster reflectante transpirable"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000009', 'Chaqueta Invierno', 'Chaqueta térmica invierno encargado', 'CLOTHING', 'ist-3', 'rs-3', 10, 5, 'unidades', 'ci_000002', 'wc_000021', 'Estante A-3', 'Azul', 'XL', 'Hombre', NULL, 'en reposición', '{"material": "Poliéster con forro térmico"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000047', 'Chaqueta Verano', 'Chaqueta verano talla M', 'CLOTHING', 'ist-3', 'rs-1', 12, 5, 'unidades', 'ci_000001', 'wc_000009', 'Estante A-3', 'Verde-Amarilla', 'M', 'Hombre', NULL, '', '{"material": "Poliéster reflectante transpirable"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000052', 'Chaqueta Verano', 'Chaqueta verano talla XL', 'CLOTHING', 'ist-3', 'rs-1', 10, 5, 'unidades', 'ci_000002', 'wc_000021', 'Estante A-2', 'Verde-Amarilla', 'XL', 'Hombre', NULL, '', '{"material": "Poliéster reflectante transpirable"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000053', 'Chaqueta Invierno', 'Chaqueta invierno encargado talla L', 'CLOTHING', 'ist-3', 'rs-3', 8, 5, 'unidades', 'ci_000002', 'wc_000021', 'Estante A-3', 'Azul', 'L', 'Hombre', NULL, 'en reposición', '{"material": "Poliéster con forro térmico"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),

  -- Forros (ist-4)
  ('inv_000010', 'Forro Polar', 'Forro polar térmico para media temporada', 'CLOTHING', 'ist-4', 'rs-1', 35, 10, 'unidades', 'ci_000002', 'wc_000021', 'Estante A-4', 'Negro', 'M', 'Unisex', NULL, '', '{"material": "Microfibra polar"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000054', 'Forro Polar', 'Forro polar térmico talla L', 'CLOTHING', 'ist-4', 'rs-1', 22, 10, 'unidades', 'ci_000002', 'wc_000021', 'Estante A-4', 'Negro', 'L', 'Unisex', NULL, '', '{"material": "Microfibra polar"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000055', 'Forro Polar', 'Forro polar térmico talla XL', 'CLOTHING', 'ist-4', 'rs-2', 0, 10, 'unidades', 'ci_000002', 'wc_000021', 'Estante A-4', 'Negro', 'XL', 'Unisex', NULL, 'agotado', '{"material": "Microfibra polar"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),

  -- Chaquetones (ist-5)
  ('inv_000082', 'Chaquetón Invierno', 'Chaquetón térmico invierno', 'CLOTHING', 'ist-5', 'rs-1', 15, 5, 'unidades', 'ci_000001', 'wc_000009', 'Estante A-4', 'Verde-Amarilla', 'L', 'Hombre', NULL, '', '{"material": "Poliéster acolchado reflectante"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000083', 'Chaquetón Invierno', 'Chaquetón térmico invierno', 'CLOTHING', 'ist-5', 'rs-1', 10, 5, 'unidades', 'ci_000002', 'wc_000021', 'Estante A-4', 'Verde-Amarilla', 'XL', 'Hombre', NULL, '', '{"material": "Poliéster acolchado reflectante"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000084', 'Chaquetón Invierno', 'Chaquetón térmico invierno encargado', 'CLOTHING', 'ist-5', 'rs-1', 5, 3, 'unidades', 'ci_000001', 'wc_000009', 'Estante A-4', 'Azul', 'L', 'Hombre', NULL, '', '{"material": "Poliéster acolchado"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),

  -- Gorras (ist-6)
  ('inv_000085', 'Gorra', 'Gorra de trabajo reflectante', 'CLOTHING', 'ist-6', 'rs-1', 50, 10, 'unidades', 'ci_000001', 'wc_000009', 'Estante B-3', 'Verde-Amarilla', 'ESTÁNDAR', 'Unisex', NULL, '', '{"material": "Algodón/Poliéster reflectante"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000086', 'Gorra', 'Gorra de trabajo encargado', 'CLOTHING', 'ist-6', 'rs-1', 10, 5, 'unidades', 'ci_000001', 'wc_000009', 'Estante B-3', 'Azul', 'ESTÁNDAR', 'Unisex', NULL, '', '{"material": "Algodón/Poliéster"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),

  -- Zapatos (ist-7)
  ('inv_000087', 'Zapatos Verano', 'Zapatos de seguridad verano', 'CLOTHING', 'ist-7', 'rs-1', 20, 10, 'pares', 'ci_000001', 'wc_000009', 'Estante C-1', 'Verde-Amarilla', '42', 'Hombre', NULL, '', '{"material": "Cuero/Poliéster reflectante", "certification": "CE", "safety_standard": "EN ISO 20345"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000088', 'Zapatos Invierno', 'Zapatos de seguridad invierno', 'CLOTHING', 'ist-7', 'rs-1', 15, 10, 'pares', 'ci_000002', 'wc_000021', 'Estante C-1', 'Verde-Amarilla', '43', 'Hombre', NULL, '', '{"material": "Cuero forro térmico reflectante", "certification": "CE", "safety_standard": "EN ISO 20345"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000089', 'Zapatos Verano', 'Zapatos de seguridad verano encargado', 'CLOTHING', 'ist-7', 'rs-1', 8, 5, 'pares', 'ci_000001', 'wc_000009', 'Estante C-1', 'Azul', '42', 'Hombre', NULL, '', '{"material": "Cuero", "certification": "CE", "safety_standard": "EN ISO 20345"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),

  -- Botas (ist-8)
  ('inv_000090', 'Botas Invierno', 'Botas de seguridad invierno', 'CLOTHING', 'ist-8', 'rs-1', 12, 5, 'pares', 'ci_000001', 'wc_000009', 'Estante C-2', 'Verde-Amarilla', '42', 'Hombre', NULL, '', '{"material": "Cuero forro térmico reflectante", "certification": "CE", "safety_standard": "EN ISO 20345"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000091', 'Botas Invierno', 'Botas de seguridad invierno encargado', 'CLOTHING', 'ist-8', 'rs-1', 6, 3, 'pares', 'ci_000002', 'wc_000021', 'Estante C-2', 'Azul', '42', 'Hombre', NULL, '', '{"material": "Cuero forro térmico", "certification": "CE", "safety_standard": "EN ISO 20345"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z')

ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 5. INVENTARIO: EPIs (PPE)
-- ============================================================

INSERT INTO inventory_items (id, name, description, category, subtype_id, status_id, quantity, min_stock, unit, city_id, work_center_id, location, color, size, gender, assigned_to, notes, attributes, created_at, updated_at) VALUES
  ('inv_000011', 'Guantes de Latex', 'Guantes desechables de látex sin polvo', 'PPE', 'ist-12', 'es-1', 500, 100, 'pares', 'ci_000001', 'wc_000009', 'Estante C-1', NULL, NULL, NULL, NULL, 'Caja de 100 unidades', '{"size": "Talla única", "color": "Blanco", "material": "Latex", "certification": "CE", "safety_standard": "EN 455", "expiration_date": "2027-06-01"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000012', 'Casco de Seguridad', 'Casco de seguridad con visera', 'PPE', 'ist-11', 'es-1', 40, 10, 'unidades', 'ci_000001', 'wc_000009', 'Estante C-2', NULL, NULL, NULL, NULL, 'Certificado CE', '{"color": "Amarillo", "material": "ABS", "certification": "CE", "safety_standard": "EN 397", "expiration_date": "2027-06-01"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000013', 'Guantes de Seguridad Nivel 5', 'Guantes anticorte nivel 5', 'PPE', 'ist-12', 'es-1', 80, 20, 'pares', 'ci_000001', 'wc_000009', 'Estante C-3', NULL, NULL, NULL, NULL, 'Resistentes a cortes', '{"size": "L", "color": "Gris", "material": "Kevlar", "certification": "CE", "safety_standard": "EN 388", "expiration_date": "2026-12-01"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000014', 'Mascarilla FFP3', 'Mascarilla autofiltrante FFP3', 'PPE', 'ist-13', 'es-1', 200, 50, 'unidades', 'ci_000001', 'wc_000009', 'Estante C-4', NULL, NULL, NULL, NULL, 'Caja de 20 unidades', '{"color": "Blanco", "material": "Tejido no tejido", "certification": "CE", "safety_standard": "EN 149", "expiration_date": "2026-08-01"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000015', 'Máscara de Desbrozar', 'Máscara de protección para desbrozadora', 'PPE', 'ist-14', 'es-1', 15, 5, 'unidades', 'ci_000001', 'wc_000009', 'Estante D-1', NULL, NULL, NULL, NULL, 'Incluye visor', '{"color": "Negro", "material": "Plástico/Malla", "certification": "CE", "safety_standard": "EN 1731", "expiration_date": "2028-01-01"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000016', 'Mascarilla con Filtro', 'Mascarilla con filtro recambiable', 'PPE', 'ist-13', 'es-3', 8, 5, 'unidades', 'ci_000002', 'wc_000021', 'Estante D-2', NULL, NULL, NULL, NULL, 'En reposición - filtros pendientes de cambiar', '{"color": "Negro", "material": "Silicona/Plástico", "certification": "CE", "safety_standard": "EN 140", "serial_number": "MF-002", "expiration_date": "2026-11-01"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000017', 'Arnés Anti-Caídas', 'Arnés de seguridad con doble enganche', 'PPE', 'ist-15', 'es-1', 10, 3, 'unidades', 'ci_000002', 'wc_000021', 'Estante D-3', NULL, NULL, NULL, NULL, 'Revisar antes de usar', '{"size": "L", "color": "Naranja", "material": "Poliamida", "certification": "CE", "safety_standard": "EN 361", "serial_number": "ARN-001", "expiration_date": "2026-05-01"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000018', 'Protector Auditivo Copa', 'Protector auditivo tipo copa', 'PPE', 'ist-16', 'es-1', 30, 10, 'pares', 'ci_000002', 'wc_000021', 'Estante D-4', NULL, NULL, NULL, NULL, 'SNR 30 dB', '{"color": "Amarillo/Negro", "material": "Plástico/Espuma", "certification": "CE", "safety_standard": "EN 352-1", "expiration_date": "2027-03-01"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000019', 'Gafas de Seguridad', 'Gafas de protección transparente', 'PPE', 'ist-17', 'es-1', 50, 15, 'unidades', 'ci_000002', 'wc_000021', 'Estante E-1', NULL, NULL, NULL, NULL, 'Anti-empañamiento', '{"color": "Transparente", "material": "Policarbonato", "certification": "CE", "safety_standard": "EN 166", "expiration_date": "2028-06-01"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000038', 'Guantes de Nitrilo', 'Guantes desechables de nitrilo sin polvo', 'PPE', 'ist-12', 'es-1', 300, 100, 'pares', 'ci_000001', 'wc_000009', 'Estante C-1', NULL, NULL, NULL, NULL, 'Caja de 100 unidades - talla M', '{"size": "M", "color": "Azul", "material": "Nitrilo", "certification": "CE", "safety_standard": "EN 455", "expiration_date": "2028-01-01"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000039', 'Casco con Pantalla', 'Casco de seguridad con pantalla facial', 'PPE', 'ist-11', 'es-1', 12, 5, 'unidades', 'ci_000002', 'wc_000021', 'Estante E-2', NULL, NULL, NULL, NULL, 'Protección facial incluida', '{"color": "Blanco", "material": "ABS", "certification": "CE", "safety_standard": "EN 397 / EN 166", "expiration_date": "2027-09-01"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000040', 'Mascarilla FFP2', 'Mascarilla autofiltrante FFP2', 'PPE', 'ist-13', 'es-2', 0, 50, 'unidades', 'ci_000002', 'wc_000021', 'Estante E-3', NULL, NULL, NULL, NULL, 'Agotado - solicitar reposición', '{"color": "Blanco", "material": "Tejido no tejido", "certification": "CE", "safety_standard": "EN 149", "expiration_date": "2026-10-01"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000056', 'Casco de Seguridad Azul', 'Casco de seguridad azul con visera', 'PPE', 'ist-11', 'es-1', 25, 10, 'unidades', 'ci_000001', 'wc_000009', 'Estante C-2', NULL, NULL, NULL, NULL, 'Lote nuevo', '{"color": "Azul", "material": "ABS", "certification": "CE", "safety_standard": "EN 397", "expiration_date": "2028-03-01"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000057', 'Guantes de Neopreno', 'Guantes de neopreno para productos químicos', 'PPE', 'ist-12', 'es-1', 60, 20, 'pares', 'ci_000001', 'wc_000009', 'Estante C-3', NULL, NULL, NULL, NULL, 'Resistentes a químicos', '{"size": "L", "color": "Negro", "material": "Neopreno", "certification": "CE", "safety_standard": "EN 374", "expiration_date": "2027-08-01"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000058', 'Mascarilla KN95', 'Mascarilla KN95 con válvula', 'PPE', 'ist-13', 'es-2', 0, 50, 'unidades', 'ci_000001', 'wc_000009', 'Estante C-4', NULL, NULL, NULL, NULL, 'Agotado - pedir nuevo lote', '{"color": "Blanco", "material": "Tejido no tejido", "certification": "CE", "safety_standard": "EN 149", "expiration_date": "2027-05-01"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000059', 'Protector Tapones', 'Protector auditivo tipo tapones reutilizables', 'PPE', 'ist-16', 'es-1', 100, 30, 'pares', 'ci_000001', 'wc_000009', 'Estante D-4', NULL, NULL, NULL, NULL, 'SNR 25 dB', '{"color": "Azul", "material": "Silicona", "certification": "CE", "safety_standard": "EN 352-2", "expiration_date": "2028-01-01"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000060', 'Gafas Oscuras', 'Gafas de seguridad con filtro solar', 'PPE', 'ist-17', 'es-1', 30, 10, 'unidades', 'ci_000001', 'wc_000009', 'Estante E-1', NULL, NULL, NULL, NULL, 'Protección UV', '{"color": "Oscuro", "material": "Policarbonato", "certification": "CE", "safety_standard": "EN 166", "expiration_date": "2028-09-01"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000061', 'Arnés Posicionamiento', 'Arnés de posicionamiento con cinturón', 'PPE', 'ist-15', 'es-1', 5, 3, 'unidades', 'ci_000001', 'wc_000009', 'Estante D-3', NULL, NULL, NULL, NULL, 'Uso en altura', '{"size": "L", "color": "Azul", "material": "Poliamida", "certification": "CE", "safety_standard": "EN 358", "serial_number": "ARN-002", "expiration_date": "2027-02-01"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000062', 'Guantes Térmicos', 'Guantes térmicos para trabajos en frío', 'PPE', 'ist-12', 'es-1', 40, 15, 'pares', 'ci_000002', 'wc_000021', 'Estante C-1', NULL, NULL, NULL, NULL, 'Invierno', '{"size": "L", "color": "Negro", "material": "Forro térmico", "certification": "CE", "safety_standard": "EN 511", "expiration_date": "2028-06-01"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000063', 'Mascarilla FFP3 Válvula', 'Mascarilla FFP3 con válvula de exhalación', 'PPE', 'ist-13', 'es-1', 150, 50, 'unidades', 'ci_000002', 'wc_000021', 'Estante E-2', NULL, NULL, NULL, NULL, '', '{"color": "Blanco", "material": "Tejido no tejido", "certification": "CE", "safety_standard": "EN 149", "expiration_date": "2027-10-01"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000064', 'Protector Electrónico', 'Protector auditivo electrónico con micrófono', 'PPE', 'ist-16', 'es-3', 12, 5, 'pares', 'ci_000002', 'wc_000021', 'Estante D-4', NULL, NULL, NULL, NULL, 'En reposición - baterías agotadas', '{"color": "Amarillo/Negro", "material": "Plástico/Electrónica", "certification": "CE", "safety_standard": "EN 352-1", "serial_number": "ELEC-001", "expiration_date": "2028-03-01"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000065', 'Gafas Graduables', 'Gafas de seguridad con soporte para graduación', 'PPE', 'ist-17', 'es-1', 20, 10, 'unidades', 'ci_000002', 'wc_000021', 'Estante E-1', NULL, NULL, NULL, NULL, 'Adaptables', '{"color": "Transparente", "material": "Policarbonato", "certification": "CE", "safety_standard": "EN 166", "expiration_date": "2029-01-01"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000066', 'Casco Barbuquejo', 'Casco de seguridad con barbuquejo', 'PPE', 'ist-11', 'es-1', 15, 5, 'unidades', 'ci_000002', 'wc_000021', 'Estante E-2', NULL, NULL, NULL, NULL, '', '{"color": "Blanco", "material": "ABS", "certification": "CE", "safety_standard": "EN 397", "expiration_date": "2028-11-01"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
  ('inv_000078', 'Mascarilla FFP1', 'Mascarilla autofiltrante FFP1', 'PPE', 'ist-13', 'es-1', 100, 30, 'unidades', 'ci_000002', 'wc_000021', 'Estante E-3', NULL, NULL, NULL, NULL, 'Baja protección - para polvo', '{"color": "Blanco", "material": "Tejido no tejido", "certification": "CE", "safety_standard": "EN 149", "expiration_date": "2027-12-01"}', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z')

ON CONFLICT (id) DO NOTHING;

COMMIT;
