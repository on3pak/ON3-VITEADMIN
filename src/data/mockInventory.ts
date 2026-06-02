import { InventoryItem, InventoryCategoryOption, InventoryStatus, InventorySubtype } from '../types';

export const INVENTORY_CATEGORIES: InventoryCategoryOption[] = [
  { id: 'ic-1', name: 'Ropa', value: 'ropa' },
  { id: 'ic-2', name: 'EPIs', value: 'epi' },
  { id: 'ic-3', name: 'Maquinaria', value: 'maquinaria' },
];

export const ROPA_STATUSES: InventoryStatus[] = [
  { id: 'rs-1', name: 'Disponible', category: 'ropa' },
  { id: 'rs-2', name: 'Agotado', category: 'ropa' },
  { id: 'rs-3', name: 'En Reposición', category: 'ropa' },
];

export const EPI_STATUSES: InventoryStatus[] = [
  { id: 'es-1', name: 'Disponible', category: 'epi' },
  { id: 'es-2', name: 'Agotado', category: 'epi' },
  { id: 'es-3', name: 'En Reposición', category: 'epi' },
];

export const MAQUINARIA_STATUSES: InventoryStatus[] = [
  { id: 'ms-1', name: 'Disponible', category: 'maquinaria' },
  { id: 'ms-2', name: 'Mantenimiento', category: 'maquinaria' },
  { id: 'ms-3', name: 'Averiado', category: 'maquinaria' },
  { id: 'ms-4', name: 'Baja', category: 'maquinaria' },
];

export const getStatusesForCategory = (cat: InventoryCategory): InventoryStatus[] => {
  switch (cat) {
    case 'ropa': return ROPA_STATUSES;
    case 'epi': return EPI_STATUSES;
    case 'maquinaria': return MAQUINARIA_STATUSES;
  }
};

export const INVENTORY_SUBTYPES: InventorySubtype[] = [
  { id: 'ist-1', category: 'ropa', name: 'Pantalón' },
  { id: 'ist-2', category: 'ropa', name: 'Camisa' },
  { id: 'ist-3', category: 'ropa', name: 'Chaqueta' },
  { id: 'ist-4', category: 'ropa', name: 'Forro' },

  { id: 'ist-11', category: 'epi', name: 'Casco' },
  { id: 'ist-12', category: 'epi', name: 'Guantes' },
  { id: 'ist-13', category: 'epi', name: 'Mascarilla' },
  { id: 'ist-14', category: 'epi', name: 'Máscara' },
  { id: 'ist-15', category: 'epi', name: 'Arnés' },
  { id: 'ist-16', category: 'epi', name: 'Protector' },
  { id: 'ist-17', category: 'epi', name: 'Gafas' },

  { id: 'ist-20', category: 'maquinaria', name: 'Sopladora' },
  { id: 'ist-21', category: 'maquinaria', name: 'Desbrozadora' },
  { id: 'ist-22', category: 'maquinaria', name: 'Cortacésped' },
  { id: 'ist-23', category: 'maquinaria', name: 'Motocultor' },
  { id: 'ist-24', category: 'maquinaria', name: 'Hidrolimpiadora' },
  { id: 'ist-25', category: 'maquinaria', name: 'Barredora' },
  { id: 'ist-26', category: 'maquinaria', name: 'Motosierra' },
  { id: 'ist-27', category: 'maquinaria', name: 'Generador' },
];

export const getSubtypesForCategory = (cat: InventoryCategory): InventorySubtype[] =>
  INVENTORY_SUBTYPES.filter((st) => st.category === cat);

export const INVENTORY_WAREHOUSE_IDS = ['wc-9', 'wc-21'];

const NOW = '2024-01-01T00:00:00Z';

const NOW_ISO = new Date().toISOString();

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv_000001', name: 'Pantalón Verano Azul L', description: 'Pantalón de trabajo ligero para verano',
    category: 'ropa', subtype_id: 'ist-1', status_id: 'rs-1', quantity: 30, min_stock: 10, unit: 'unidades',
    city_id: 'city-1', work_center_id: 'wc-9', location: 'Estante A-1',
    assigned_to: null, notes: 'Talla L',
    attributes: {

      size: 'L', color: 'Azul', material: 'Algodón ligero', gender: 'Hombre',
    certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
    expiration_date: null, warranty_expiration: null, last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000002', name: 'Pantalón Verano Azul M', description: 'Pantalón de trabajo ligero para verano',
    category: 'ropa', subtype_id: 'ist-1', status_id: 'rs-1', quantity: 25, min_stock: 10, unit: 'unidades',
    city_id: 'city-1', work_center_id: 'wc-9', location: 'Estante A-1',
    assigned_to: null, notes: 'Talla M',
    attributes: {

      size: 'M', color: 'Azul', material: 'Algodón ligero', gender: 'Hombre',
    certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
    expiration_date: null, warranty_expiration: null, last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000003', name: 'Pantalón Invierno Gris L', description: 'Pantalón de trabajo térmico para invierno',
    category: 'ropa', subtype_id: 'ist-1', status_id: 'rs-1', quantity: 20, min_stock: 10, unit: 'unidades',
    city_id: 'city-1', work_center_id: 'wc-9', location: 'Estante A-2',
    assigned_to: null, notes: 'Talla L',
    attributes: {

      size: 'L', color: 'Gris', material: 'Algodón/Poliéster térmico', gender: 'Hombre',
    certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
    expiration_date: null, warranty_expiration: null, last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000004', name: 'Pantalón Invierno Gris M', description: 'Pantalón de trabajo térmico para invierno',
    category: 'ropa', subtype_id: 'ist-1', status_id: 'rs-1', quantity: 15, min_stock: 10, unit: 'unidades',
    city_id: 'city-1', work_center_id: 'wc-9', location: 'Estante A-2',
    assigned_to: null, notes: 'Talla M',
    attributes: {

      size: 'M', color: 'Gris', material: 'Algodón/Poliéster térmico', gender: 'Hombre',
    certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
    expiration_date: null, warranty_expiration: null, last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000005', name: 'Camisa Verano Blanca L', description: 'Camisa de trabajo manga corta para verano',
    category: 'ropa', subtype_id: 'ist-2', status_id: 'rs-1', quantity: 40, min_stock: 10, unit: 'unidades',
    city_id: 'city-1', work_center_id: 'wc-9', location: 'Estante B-1',
    assigned_to: null, notes: 'Talla L',
    attributes: {

      size: 'L', color: 'Blanca', material: 'Algodón transpirable', gender: 'Hombre',
    certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
    expiration_date: null, warranty_expiration: null, last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000006', name: 'Camisa Verano Blanca M', description: 'Camisa de trabajo manga corta para verano',
    category: 'ropa', subtype_id: 'ist-2', status_id: 'rs-2', quantity: 0, min_stock: 10, unit: 'unidades',
    city_id: 'city-1', work_center_id: 'wc-9', location: 'Estante B-1',
    assigned_to: null, notes: 'Talla M - agotado',
    attributes: {

      size: 'M', color: 'Blanca', material: 'Algodón transpirable', gender: 'Hombre',
    certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
    expiration_date: null, warranty_expiration: null, last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000007', name: 'Camisa Invierno Azul L', description: 'Camisa de trabajo manga larga para invierno',
    category: 'ropa', subtype_id: 'ist-2', status_id: 'rs-1', quantity: 20, min_stock: 10, unit: 'unidades',
    city_id: 'city-2', work_center_id: 'wc-21', location: 'Estante A-1',
    assigned_to: null, notes: 'Talla L',
    attributes: {

      size: 'L', color: 'Azul claro', material: 'Algodón/Poliéster', gender: 'Hombre',
    certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
    expiration_date: null, warranty_expiration: null, last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000008', name: 'Chaqueta Verano Verde L', description: 'Chaqueta transpirable para verano',
    category: 'ropa', subtype_id: 'ist-3', status_id: 'rs-1', quantity: 15, min_stock: 5, unit: 'unidades',
    city_id: 'city-2', work_center_id: 'wc-21', location: 'Estante A-2',
    assigned_to: null, notes: 'Talla L',
    attributes: {

      size: 'L', color: 'Verde', material: 'Poliéster transpirable', gender: 'Hombre',
    certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
    expiration_date: null, warranty_expiration: null, last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000009', name: 'Chaqueta Invierno Azul XL', description: 'Chaqueta térmica con forro para invierno',
    category: 'ropa', subtype_id: 'ist-3', status_id: 'rs-3', quantity: 10, min_stock: 5, unit: 'unidades',
    city_id: 'city-2', work_center_id: 'wc-21', location: 'Estante A-3',
    assigned_to: null, notes: 'En reposición - pendiente de recepción',
    attributes: {

      size: 'XL', color: 'Azul', material: 'Poliéster con forro térmico', gender: 'Hombre',
    certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
    expiration_date: null, warranty_expiration: null, last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000010', name: 'Forro Polar Negro M', description: 'Forro polar térmico para media temporada',
    category: 'ropa', subtype_id: 'ist-4', status_id: 'rs-1', quantity: 35, min_stock: 10, unit: 'unidades',
    city_id: 'city-2', work_center_id: 'wc-21', location: 'Estante A-4',
    assigned_to: null, notes: 'Talla M',
    attributes: {

      size: 'M', color: 'Negro', material: 'Microfibra polar', gender: 'Unisex',
    certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
    expiration_date: null, warranty_expiration: null, last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000011', name: 'Guantes de Latex', description: 'Guantes desechables de látex sin polvo',
    category: 'epi', subtype_id: 'ist-12', status_id: 'es-1', quantity: 500, min_stock: 100, unit: 'pares',
    city_id: 'city-1', work_center_id: 'wc-9', location: 'Estante C-1',
    assigned_to: null, notes: 'Caja de 100 unidades',
    attributes: {

      size: 'Talla única', color: 'Blanco', material: 'Latex', gender: null,
    certification: 'CE', safety_standard: 'EN 455', serial_number: null,
    brand: null, model: null, expiration_date: '2027-06-01', warranty_expiration: null,
    last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000012', name: 'Casco de Seguridad', description: 'Casco de seguridad con visera',
    category: 'epi', subtype_id: 'ist-11', status_id: 'es-1', quantity: 40, min_stock: 10, unit: 'unidades',
    city_id: 'city-1', work_center_id: 'wc-9', location: 'Estante C-2',
    assigned_to: null, notes: 'Certificado CE',
    attributes: {

      size: null, color: 'Amarillo', material: 'ABS', gender: null,
    certification: 'CE', safety_standard: 'EN 397', serial_number: null,
    brand: null, model: null, expiration_date: '2027-06-01', warranty_expiration: null,
    last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000013', name: 'Guantes de Seguridad Nivel 5', description: 'Guantes anticorte nivel 5',
    category: 'epi', subtype_id: 'ist-12', status_id: 'es-1', quantity: 80, min_stock: 20, unit: 'pares',
    city_id: 'city-1', work_center_id: 'wc-9', location: 'Estante C-3',
    assigned_to: null, notes: 'Resistentes a cortes',
    attributes: {

      size: 'L', color: 'Gris', material: 'Kevlar', gender: null,
    certification: 'CE', safety_standard: 'EN 388', serial_number: null,
    brand: null, model: null, expiration_date: '2026-12-01', warranty_expiration: null,
    last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000014', name: 'Mascarilla FFP3', description: 'Mascarilla autofiltrante FFP3',
    category: 'epi', subtype_id: 'ist-13', status_id: 'es-1', quantity: 200, min_stock: 50, unit: 'unidades',
    city_id: 'city-1', work_center_id: 'wc-9', location: 'Estante C-4',
    assigned_to: null, notes: 'Caja de 20 unidades',
    attributes: {

      size: 'Talla única', color: 'Blanco', material: 'Tejido no tejido', gender: null,
    certification: 'CE', safety_standard: 'EN 149', serial_number: null,
    brand: null, model: null, expiration_date: '2026-08-01', warranty_expiration: null,
    last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000015', name: 'Máscara de Desbrozar', description: 'Máscara de protección para desbrozadora',
    category: 'epi', subtype_id: 'ist-14', status_id: 'es-1', quantity: 15, min_stock: 5, unit: 'unidades',
    city_id: 'city-1', work_center_id: 'wc-9', location: 'Estante D-1',
    assigned_to: null, notes: 'Incluye visor',
    attributes: {

      size: 'Talla única', color: 'Negro', material: 'Plástico/Malla', gender: null,
    certification: 'CE', safety_standard: 'EN 1731', serial_number: null,
    brand: null, model: null, expiration_date: '2028-01-01', warranty_expiration: null,
    last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000016', name: 'Mascarilla con Filtro', description: 'Mascarilla con filtro recambiable',
    category: 'epi', subtype_id: 'ist-13', status_id: 'es-3', quantity: 8, min_stock: 5, unit: 'unidades',
    city_id: 'city-2', work_center_id: 'wc-21', location: 'Estante D-2',
    assigned_to: null, notes: 'En reposición - filtros pendientes de cambiar',
    attributes: {

      size: 'Talla única', color: 'Negro', material: 'Silicona/Plástico', gender: null,
    certification: 'CE', safety_standard: 'EN 140', serial_number: 'MF-002',
    brand: null, model: null, expiration_date: '2026-11-01', warranty_expiration: null,
    last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000017', name: 'Arnés Anti-Caídas', description: 'Arnés de seguridad con doble enganche',
    category: 'epi', subtype_id: 'ist-15', status_id: 'es-1', quantity: 10, min_stock: 3, unit: 'unidades',
    city_id: 'city-2', work_center_id: 'wc-21', location: 'Estante D-3',
    assigned_to: null, notes: 'Revisar antes de usar',
    attributes: {

      size: 'L', color: 'Naranja', material: 'Poliamida', gender: null,
    certification: 'CE', safety_standard: 'EN 361', serial_number: 'ARN-001',
    brand: null, model: null, expiration_date: '2026-05-01', warranty_expiration: null,
    last_maintenance: '2025-01-15', next_maintenance: '2025-07-15'

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000018', name: 'Protector Auditivo Copa', description: 'Protector auditivo tipo copa',
    category: 'epi', subtype_id: 'ist-16', status_id: 'es-1', quantity: 30, min_stock: 10, unit: 'pares',
    city_id: 'city-2', work_center_id: 'wc-21', location: 'Estante D-4',
    assigned_to: null, notes: 'SNR 30 dB',
    attributes: {

      size: 'Talla única', color: 'Amarillo/Negro', material: 'Plástico/Espuma', gender: null,
    certification: 'CE', safety_standard: 'EN 352-1', serial_number: null,
    brand: null, model: null, expiration_date: '2027-03-01', warranty_expiration: null,
    last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000019', name: 'Gafas de Seguridad', description: 'Gafas de protección transparente',
    category: 'epi', subtype_id: 'ist-17', status_id: 'es-1', quantity: 50, min_stock: 15, unit: 'unidades',
    city_id: 'city-2', work_center_id: 'wc-21', location: 'Estante E-1',
    assigned_to: null, notes: 'Anti-empañamiento',
    attributes: {

      size: 'Talla única', color: 'Transparente', material: 'Policarbonato', gender: null,
    certification: 'CE', safety_standard: 'EN 166', serial_number: null,
    brand: null, model: null, expiration_date: '2028-06-01', warranty_expiration: null,
    last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000028', name: 'Sopladora STIHL BR600', description: 'Sopladora de gasolina STIHL BR 600',
    category: 'maquinaria', subtype_id: 'ist-20', status_id: 'ms-1', quantity: 3, min_stock: 1, unit: 'unidades',
    city_id: 'city-1', work_center_id: 'wc-1', location: 'Garaje Nave - Estante 1',
    assigned_to: null, notes: 'Velocidad variable',
    attributes: {

      size: null, color: 'Naranja/Gris', material: null, gender: null,
    certification: null, safety_standard: null, serial_number: 'STIHL-BR600-001',
    brand: 'STIHL', model: 'BR 600', expiration_date: null, warranty_expiration: '2027-01-01',
    last_maintenance: '2025-03-01', next_maintenance: '2025-09-01'

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000029', name: 'Desbrozadora STIHL FS131', description: 'Desbrozadora de gasolina STIHL FS 131',
    category: 'maquinaria', subtype_id: 'ist-21', status_id: 'ms-1', quantity: 4, min_stock: 1, unit: 'unidades',
    city_id: 'city-1', work_center_id: 'wc-3', location: 'Garaje Gilitos - Estante 2',
    assigned_to: null, notes: 'Cabezal de hilo y cuchilla',
    attributes: {

      size: null, color: 'Naranja/Gris', material: null, gender: null,
    certification: null, safety_standard: null, serial_number: 'STIHL-FS131-001',
    brand: 'STIHL', model: 'FS 131', expiration_date: null, warranty_expiration: '2026-06-01',
    last_maintenance: '2025-02-15', next_maintenance: '2025-08-15'

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000030', name: 'Cortacésped Husqvarna LC247', description: 'Cortacésped autopropulsado',
    category: 'maquinaria', subtype_id: 'ist-22', status_id: 'ms-1', quantity: 2, min_stock: 1, unit: 'unidades',
    city_id: 'city-1', work_center_id: 'wc-5', location: 'Garaje Garena - Estante 3',
    assigned_to: null, notes: 'Gasolina 4 tiempos',
    attributes: {

      size: null, color: 'Rojo/Negro', material: null, gender: null,
    certification: null, safety_standard: null, serial_number: 'HUSQ-LC247-001',
    brand: 'Husqvarna', model: 'LC 247', expiration_date: null, warranty_expiration: '2027-03-01',
    last_maintenance: '2025-01-20', next_maintenance: '2025-07-20'

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000031', name: 'Motocultor Honda F220', description: 'Motocultor con motor Honda',
    category: 'maquinaria', subtype_id: 'ist-23', status_id: 'ms-3', quantity: 1, min_stock: 1, unit: 'unidades',
    city_id: 'city-1', work_center_id: 'wc-1', location: 'Garaje Nave - Estante 4',
    assigned_to: null, notes: 'Requiere revisión de transmisión',
    attributes: {

      size: null, color: 'Rojo', material: null, gender: null,
    certification: null, safety_standard: null, serial_number: 'HONDA-F220-001',
    brand: 'Honda', model: 'F220', expiration_date: null, warranty_expiration: null,
    last_maintenance: '2024-11-01', next_maintenance: '2025-05-01'

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000032', name: 'Hidrolimpiadora Kärcher K5', description: 'Hidrolimpiadora de presión Kärcher K5',
    category: 'maquinaria', subtype_id: 'ist-24', status_id: 'ms-1', quantity: 3, min_stock: 1, unit: 'unidades',
    city_id: 'city-1', work_center_id: 'wc-3', location: 'Garaje Gilitos - Estante 5',
    assigned_to: null, notes: 'Incluye lanza y boquillas',
    attributes: {

      size: null, color: 'Amarillo/Negro', material: null, gender: null,
    certification: null, safety_standard: null, serial_number: 'KARCHER-K5-001',
    brand: 'Kärcher', model: 'K5 Premium', expiration_date: null, warranty_expiration: '2026-09-01',
    last_maintenance: '2025-02-01', next_maintenance: '2025-08-01'

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000033', name: 'Barredora Tennant 5700', description: 'Barredora industrial Tennant 5700',
    category: 'maquinaria', subtype_id: 'ist-25', status_id: 'ms-2', quantity: 1, min_stock: 1, unit: 'unidades',
    city_id: 'city-1', work_center_id: 'wc-7', location: 'Taller - Zona reparación',
    assigned_to: null, notes: 'En reparación - motor de cepillo',
    attributes: {

      size: null, color: 'Azul', material: null, gender: null,
    certification: null, safety_standard: null, serial_number: 'TENNANT-5700-001',
    brand: 'Tennant', model: '5700', expiration_date: null, warranty_expiration: null,
    last_maintenance: '2024-12-15', next_maintenance: '2025-06-15'

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000034', name: 'Motosierra STIHL MS261', description: 'Motosierra STIHL MS 261 C-M',
    category: 'maquinaria', subtype_id: 'ist-26', status_id: 'ms-1', quantity: 2, min_stock: 1, unit: 'unidades',
    city_id: 'city-2', work_center_id: 'wc-11', location: 'Centro01 - Almacén herramientas',
    assigned_to: null, notes: 'Espada de 40cm',
    attributes: {

      size: null, color: 'Naranja/Gris', material: null, gender: null,
    certification: null, safety_standard: null, serial_number: 'STIHL-MS261-001',
    brand: 'STIHL', model: 'MS 261 C-M', expiration_date: null, warranty_expiration: '2027-02-01',
    last_maintenance: '2025-03-10', next_maintenance: '2025-09-10'

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000035', name: 'Generador Honda EU30', description: 'Generador portátil Honda EU30i',
    category: 'maquinaria', subtype_id: 'ist-27', status_id: 'ms-1', quantity: 1, min_stock: 1, unit: 'unidades',
    city_id: 'city-2', work_center_id: 'wc-11', location: 'Centro01 - Almacén',
    assigned_to: 'emp_000011', notes: 'Asignado a Javier Ramos',
    attributes: {

      size: null, color: 'Rojo/Negro', material: null, gender: null,
    certification: null, safety_standard: null, serial_number: 'HONDA-EU30-001',
    brand: 'Honda', model: 'EU30i', expiration_date: null, warranty_expiration: '2028-01-01',
    last_maintenance: '2025-01-05', next_maintenance: '2025-07-05'

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000036', name: 'Pantalón Verano Azul XL', description: 'Pantalón de trabajo ligero para verano',
    category: 'ropa', subtype_id: 'ist-1', status_id: 'rs-1', quantity: 18, min_stock: 10, unit: 'unidades',
    city_id: 'city-1', work_center_id: 'wc-9', location: 'Estante A-1',
    assigned_to: null, notes: 'Talla XL',
    attributes: {

      size: 'XL', color: 'Azul', material: 'Algodón ligero', gender: 'Hombre',
    certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
    expiration_date: null, warranty_expiration: null, last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000037', name: 'Camisa Invierno Azul M', description: 'Camisa de trabajo manga larga para invierno',
    category: 'ropa', subtype_id: 'ist-2', status_id: 'rs-3', quantity: 12, min_stock: 10, unit: 'unidades',
    city_id: 'city-2', work_center_id: 'wc-21', location: 'Estante A-2',
    assigned_to: null, notes: 'Talla M - en reposición',
    attributes: {

      size: 'M', color: 'Azul claro', material: 'Algodón/Poliéster', gender: 'Hombre',
    certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
    expiration_date: null, warranty_expiration: null, last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000038', name: 'Guantes de Nitrilo', description: 'Guantes desechables de nitrilo sin polvo',
    category: 'epi', subtype_id: 'ist-12', status_id: 'es-1', quantity: 300, min_stock: 100, unit: 'pares',
    city_id: 'city-1', work_center_id: 'wc-9', location: 'Estante C-1',
    assigned_to: null, notes: 'Caja de 100 unidades - talla M',
    attributes: {

      size: 'M', color: 'Azul', material: 'Nitrilo', gender: null,
    certification: 'CE', safety_standard: 'EN 455', serial_number: null,
    brand: null, model: null, expiration_date: '2028-01-01', warranty_expiration: null,
    last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000039', name: 'Casco con Pantalla', description: 'Casco de seguridad con pantalla facial',
    category: 'epi', subtype_id: 'ist-11', status_id: 'es-1', quantity: 12, min_stock: 5, unit: 'unidades',
    city_id: 'city-2', work_center_id: 'wc-21', location: 'Estante E-2',
    assigned_to: null, notes: 'Protección facial incluida',
    attributes: {

      size: null, color: 'Blanco', material: 'ABS', gender: null,
    certification: 'CE', safety_standard: 'EN 397 / EN 166', serial_number: null,
    brand: null, model: null, expiration_date: '2027-09-01', warranty_expiration: null,
    last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000040', name: 'Mascarilla FFP2', description: 'Mascarilla autofiltrante FFP2',
    category: 'epi', subtype_id: 'ist-13', status_id: 'es-2', quantity: 0, min_stock: 50, unit: 'unidades',
    city_id: 'city-2', work_center_id: 'wc-21', location: 'Estante E-3',
    assigned_to: null, notes: 'Agotado - solicitar reposición',
    attributes: {

      size: 'Talla única', color: 'Blanco', material: 'Tejido no tejido', gender: null,
    certification: 'CE', safety_standard: 'EN 149', serial_number: null,
    brand: null, model: null, expiration_date: '2026-10-01', warranty_expiration: null,
    last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000041', name: 'Sopladora STIHL BR600 (2)', description: 'Segunda sopladora STIHL BR 600',
    category: 'maquinaria', subtype_id: 'ist-20', status_id: 'ms-1', quantity: 1, min_stock: 1, unit: 'unidades',
    city_id: 'city-2', work_center_id: 'wc-11', location: 'Centro01 - Almacén herramientas',
    assigned_to: null, notes: 'Unidad de respaldo',
    attributes: {

      size: null, color: 'Naranja/Gris', material: null, gender: null,
    certification: null, safety_standard: null, serial_number: 'STIHL-BR600-002',
    brand: 'STIHL', model: 'BR 600', expiration_date: null, warranty_expiration: '2027-01-01',
    last_maintenance: '2025-04-01', next_maintenance: '2025-10-01'

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000042', name: 'Desbrozadora STIHL FS131 (2)', description: 'Segunda desbrozadora STIHL FS 131',
    category: 'maquinaria', subtype_id: 'ist-21', status_id: 'ms-2', quantity: 1, min_stock: 1, unit: 'unidades',
    city_id: 'city-2', work_center_id: 'wc-11', location: 'Centro01 - Almacén',
    assigned_to: null, notes: 'En mantenimiento preventivo',
    attributes: {

      size: null, color: 'Naranja/Gris', material: null, gender: null,
    certification: null, safety_standard: null, serial_number: 'STIHL-FS131-002',
    brand: 'STIHL', model: 'FS 131', expiration_date: null, warranty_expiration: '2026-06-01',
    last_maintenance: '2025-05-01', next_maintenance: '2025-11-01'

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000043', name: 'Cortacésped Husqvarna LC247 (2)', description: 'Segundo cortacésped Husqvarna',
    category: 'maquinaria', subtype_id: 'ist-22', status_id: 'ms-3', quantity: 1, min_stock: 1, unit: 'unidades',
    city_id: 'city-2', work_center_id: 'wc-11', location: 'Centro01 - Exterior',
    assigned_to: null, notes: 'Motor averiado - pendiente de reparar',
    attributes: {

      size: null, color: 'Rojo/Negro', material: null, gender: null,
    certification: null, safety_standard: null, serial_number: 'HUSQ-LC247-002',
    brand: 'Husqvarna', model: 'LC 247', expiration_date: null, warranty_expiration: '2027-03-01',
    last_maintenance: '2024-12-01', next_maintenance: '2025-06-01'

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000044', name: 'Motocultor Honda F220 (2)', description: 'Segundo motocultor Honda F220',
    category: 'maquinaria', subtype_id: 'ist-23', status_id: 'ms-4', quantity: 0, min_stock: 1, unit: 'unidades',
    city_id: 'city-1', work_center_id: 'wc-1', location: 'Garaje Nave - Estante 5',
    assigned_to: null, notes: 'De baja - motor irrecuperable',
    attributes: {

      size: null, color: 'Rojo', material: null, gender: null,
    certification: null, safety_standard: null, serial_number: 'HONDA-F220-002',
    brand: 'Honda', model: 'F220', expiration_date: null, warranty_expiration: null,
    last_maintenance: '2024-06-01', next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000045', name: 'Pantalón Verano Azul XL', description: 'Pantalón de trabajo verano talla XL',
    category: 'ropa', subtype_id: 'ist-1', status_id: 'rs-1', quantity: 20, min_stock: 10, unit: 'unidades',
    city_id: 'city-1', work_center_id: 'wc-9', location: 'Estante A-3',
    assigned_to: null, notes: '',
    attributes: {

      size: 'XL', color: 'Azul', material: 'Algodón ligero', gender: 'Hombre',
    certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
    expiration_date: null, warranty_expiration: null, last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000046', name: 'Camisa Verano Blanca XL', description: 'Camisa verano manga corta talla XL',
    category: 'ropa', subtype_id: 'ist-2', status_id: 'rs-1', quantity: 18, min_stock: 10, unit: 'unidades',
    city_id: 'city-1', work_center_id: 'wc-9', location: 'Estante B-2',
    assigned_to: null, notes: '',
    attributes: {

      size: 'XL', color: 'Blanca', material: 'Algodón transpirable', gender: 'Hombre',
    certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
    expiration_date: null, warranty_expiration: null, last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000047', name: 'Chaqueta Verano Verde M', description: 'Chaqueta transpirable verano talla M',
    category: 'ropa', subtype_id: 'ist-3', status_id: 'rs-1', quantity: 12, min_stock: 5, unit: 'unidades',
    city_id: 'city-1', work_center_id: 'wc-9', location: 'Estante A-3',
    assigned_to: null, notes: '',
    attributes: {

      size: 'M', color: 'Verde', material: 'Poliéster transpirable', gender: 'Hombre',
    certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
    expiration_date: null, warranty_expiration: null, last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000048', name: 'Camisa Invierno Azul XL', description: 'Camisa invierno manga larga talla XL',
    category: 'ropa', subtype_id: 'ist-2', status_id: 'rs-1', quantity: 15, min_stock: 10, unit: 'unidades',
    city_id: 'city-1', work_center_id: 'wc-9', location: 'Estante B-2',
    assigned_to: null, notes: '',
    attributes: {

      size: 'XL', color: 'Azul claro', material: 'Algodón/Poliéster', gender: 'Hombre',
    certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
    expiration_date: null, warranty_expiration: null, last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000049', name: 'Pantalón Invierno Gris XL', description: 'Pantalón invierno térmico talla XL',
    category: 'ropa', subtype_id: 'ist-1', status_id: 'rs-1', quantity: 14, min_stock: 10, unit: 'unidades',
    city_id: 'city-1', work_center_id: 'wc-9', location: 'Estante A-3',
    assigned_to: null, notes: '',
    attributes: {

      size: 'XL', color: 'Gris', material: 'Algodón/Poliéster térmico', gender: 'Hombre',
    certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
    expiration_date: null, warranty_expiration: null, last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000050', name: 'Pantalón Verano Azul XXL', description: 'Pantalón de trabajo verano talla XXL',
    category: 'ropa', subtype_id: 'ist-1', status_id: 'rs-1', quantity: 10, min_stock: 5, unit: 'unidades',
    city_id: 'city-2', work_center_id: 'wc-21', location: 'Estante A-1',
    assigned_to: null, notes: '',
    attributes: {

      size: 'XXL', color: 'Azul', material: 'Algodón ligero', gender: 'Hombre',
    certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
    expiration_date: null, warranty_expiration: null, last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000051', name: 'Camisa Verano Blanca XXL', description: 'Camisa verano manga corta talla XXL',
    category: 'ropa', subtype_id: 'ist-2', status_id: 'rs-1', quantity: 12, min_stock: 5, unit: 'unidades',
    city_id: 'city-2', work_center_id: 'wc-21', location: 'Estante B-1',
    assigned_to: null, notes: '',
    attributes: {

      size: 'XXL', color: 'Blanca', material: 'Algodón transpirable', gender: 'Hombre',
    certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
    expiration_date: null, warranty_expiration: null, last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000052', name: 'Chaqueta Verano Verde XL', description: 'Chaqueta transpirable verano talla XL',
    category: 'ropa', subtype_id: 'ist-3', status_id: 'rs-1', quantity: 10, min_stock: 5, unit: 'unidades',
    city_id: 'city-2', work_center_id: 'wc-21', location: 'Estante A-2',
    assigned_to: null, notes: '',
    attributes: {

      size: 'XL', color: 'Verde', material: 'Poliéster transpirable', gender: 'Hombre',
    certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
    expiration_date: null, warranty_expiration: null, last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000053', name: 'Chaqueta Invierno Azul L', description: 'Chaqueta térmica invierno talla L',
    category: 'ropa', subtype_id: 'ist-3', status_id: 'rs-3', quantity: 8, min_stock: 5, unit: 'unidades',
    city_id: 'city-2', work_center_id: 'wc-21', location: 'Estante A-3',
    assigned_to: null, notes: 'En reposición',
    attributes: {

      size: 'L', color: 'Azul', material: 'Poliéster con forro térmico', gender: 'Hombre',
    certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
    expiration_date: null, warranty_expiration: null, last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000054', name: 'Forro Polar Negro L', description: 'Forro polar térmico talla L',
    category: 'ropa', subtype_id: 'ist-4', status_id: 'rs-1', quantity: 22, min_stock: 10, unit: 'unidades',
    city_id: 'city-2', work_center_id: 'wc-21', location: 'Estante A-4',
    assigned_to: null, notes: '',
    attributes: {

      size: 'L', color: 'Negro', material: 'Microfibra polar', gender: 'Unisex',
    certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
    expiration_date: null, warranty_expiration: null, last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000055', name: 'Forro Polar Negro XL', description: 'Forro polar térmico talla XL',
    category: 'ropa', subtype_id: 'ist-4', status_id: 'rs-2', quantity: 0, min_stock: 10, unit: 'unidades',
    city_id: 'city-2', work_center_id: 'wc-21', location: 'Estante A-4',
    assigned_to: null, notes: 'Agotado',
    attributes: {

      size: 'XL', color: 'Negro', material: 'Microfibra polar', gender: 'Unisex',
    certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
    expiration_date: null, warranty_expiration: null, last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000056', name: 'Casco de Seguridad Azul', description: 'Casco de seguridad azul con visera',
    category: 'epi', subtype_id: 'ist-11', status_id: 'es-1', quantity: 25, min_stock: 10, unit: 'unidades',
    city_id: 'city-1', work_center_id: 'wc-9', location: 'Estante C-2',
    assigned_to: null, notes: 'Lote nuevo',
    attributes: {

      size: null, color: 'Azul', material: 'ABS', gender: null,
    certification: 'CE', safety_standard: 'EN 397', serial_number: null,
    brand: null, model: null, expiration_date: '2028-03-01', warranty_expiration: null,
    last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000057', name: 'Guantes de Neopreno', description: 'Guantes de neopreno para productos químicos',
    category: 'epi', subtype_id: 'ist-12', status_id: 'es-1', quantity: 60, min_stock: 20, unit: 'pares',
    city_id: 'city-1', work_center_id: 'wc-9', location: 'Estante C-3',
    assigned_to: null, notes: 'Resistentes a químicos',
    attributes: {

      size: 'L', color: 'Negro', material: 'Neopreno', gender: null,
    certification: 'CE', safety_standard: 'EN 374', serial_number: null,
    brand: null, model: null, expiration_date: '2027-08-01', warranty_expiration: null,
    last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000058', name: 'Mascarilla KN95', description: 'Mascarilla KN95 con válvula',
    category: 'epi', subtype_id: 'ist-13', status_id: 'es-2', quantity: 0, min_stock: 50, unit: 'unidades',
    city_id: 'city-1', work_center_id: 'wc-9', location: 'Estante C-4',
    assigned_to: null, notes: 'Agotado - pedir nuevo lote',
    attributes: {

      size: 'Talla única', color: 'Blanco', material: 'Tejido no tejido', gender: null,
    certification: 'CE', safety_standard: 'EN 149', serial_number: null,
    brand: null, model: null, expiration_date: '2027-05-01', warranty_expiration: null,
    last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000059', name: 'Protector Tapones', description: 'Protector auditivo tipo tapones reutilizables',
    category: 'epi', subtype_id: 'ist-16', status_id: 'es-1', quantity: 100, min_stock: 30, unit: 'pares',
    city_id: 'city-1', work_center_id: 'wc-9', location: 'Estante D-4',
    assigned_to: null, notes: 'SNR 25 dB',
    attributes: {

      size: 'Talla única', color: 'Azul', material: 'Silicona', gender: null,
    certification: 'CE', safety_standard: 'EN 352-2', serial_number: null,
    brand: null, model: null, expiration_date: '2028-01-01', warranty_expiration: null,
    last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000060', name: 'Gafas Oscuras', description: 'Gafas de seguridad con filtro solar',
    category: 'epi', subtype_id: 'ist-17', status_id: 'es-1', quantity: 30, min_stock: 10, unit: 'unidades',
    city_id: 'city-1', work_center_id: 'wc-9', location: 'Estante E-1',
    assigned_to: null, notes: 'Protección UV',
    attributes: {

      size: 'Talla única', color: 'Oscuro', material: 'Policarbonato', gender: null,
    certification: 'CE', safety_standard: 'EN 166', serial_number: null,
    brand: null, model: null, expiration_date: '2028-09-01', warranty_expiration: null,
    last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000061', name: 'Arnés Posicionamiento', description: 'Arnés de posicionamiento con cinturón',
    category: 'epi', subtype_id: 'ist-15', status_id: 'es-1', quantity: 5, min_stock: 3, unit: 'unidades',
    city_id: 'city-1', work_center_id: 'wc-9', location: 'Estante D-3',
    assigned_to: null, notes: 'Uso en altura',
    attributes: {

      size: 'L', color: 'Azul', material: 'Poliamida', gender: null,
    certification: 'CE', safety_standard: 'EN 358', serial_number: 'ARN-002',
    brand: null, model: null, expiration_date: '2027-02-01', warranty_expiration: null,
    last_maintenance: '2025-02-01', next_maintenance: '2025-08-01'

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000062', name: 'Guantes Térmicos', description: 'Guantes térmicos para trabajos en frío',
    category: 'epi', subtype_id: 'ist-12', status_id: 'es-1', quantity: 40, min_stock: 15, unit: 'pares',
    city_id: 'city-2', work_center_id: 'wc-21', location: 'Estante C-1',
    assigned_to: null, notes: 'Invierno',
    attributes: {

      size: 'L', color: 'Negro', material: 'Forro térmico', gender: null,
    certification: 'CE', safety_standard: 'EN 511', serial_number: null,
    brand: null, model: null, expiration_date: '2028-06-01', warranty_expiration: null,
    last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000063', name: 'Mascarilla FFP3 Válvula', description: 'Mascarilla FFP3 con válvula de exhalación',
    category: 'epi', subtype_id: 'ist-13', status_id: 'es-1', quantity: 150, min_stock: 50, unit: 'unidades',
    city_id: 'city-2', work_center_id: 'wc-21', location: 'Estante E-2',
    assigned_to: null, notes: '',
    attributes: {

      size: 'Talla única', color: 'Blanco', material: 'Tejido no tejido', gender: null,
    certification: 'CE', safety_standard: 'EN 149', serial_number: null,
    brand: null, model: null, expiration_date: '2027-10-01', warranty_expiration: null,
    last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000064', name: 'Protector Electrónico', description: 'Protector auditivo electrónico con micrófono',
    category: 'epi', subtype_id: 'ist-16', status_id: 'es-3', quantity: 12, min_stock: 5, unit: 'pares',
    city_id: 'city-2', work_center_id: 'wc-21', location: 'Estante D-4',
    assigned_to: null, notes: 'En reposición - baterías agotadas',
    attributes: {

      size: 'Talla única', color: 'Amarillo/Negro', material: 'Plástico/Electrónica', gender: null,
    certification: 'CE', safety_standard: 'EN 352-1', serial_number: 'ELEC-001',
    brand: null, model: null, expiration_date: '2028-03-01', warranty_expiration: null,
    last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000065', name: 'Gafas Graduables', description: 'Gafas de seguridad con soporte para graduación',
    category: 'epi', subtype_id: 'ist-17', status_id: 'es-1', quantity: 20, min_stock: 10, unit: 'unidades',
    city_id: 'city-2', work_center_id: 'wc-21', location: 'Estante E-1',
    assigned_to: null, notes: 'Adaptables',
    attributes: {

      size: 'Talla única', color: 'Transparente', material: 'Policarbonato', gender: null,
    certification: 'CE', safety_standard: 'EN 166', serial_number: null,
    brand: null, model: null, expiration_date: '2029-01-01', warranty_expiration: null,
    last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000066', name: 'Casco Barbuquejo', description: 'Casco de seguridad con barbuquejo',
    category: 'epi', subtype_id: 'ist-11', status_id: 'es-1', quantity: 15, min_stock: 5, unit: 'unidades',
    city_id: 'city-2', work_center_id: 'wc-21', location: 'Estante E-2',
    assigned_to: null, notes: '',
    attributes: {

      size: null, color: 'Blanco', material: 'ABS', gender: null,
    certification: 'CE', safety_standard: 'EN 397', serial_number: null,
    brand: null, model: null, expiration_date: '2028-11-01', warranty_expiration: null,
    last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000067', name: 'Hidrolimpiadora Kärcher K7', description: 'Hidrolimpiadora Kärcher K7 premium',
    category: 'maquinaria', subtype_id: 'ist-24', status_id: 'ms-1', quantity: 2, min_stock: 1, unit: 'unidades',
    city_id: 'city-1', work_center_id: 'wc-3', location: 'Garaje Gilitos',
    assigned_to: null, notes: 'Alta presión',
    attributes: {

      size: null, color: 'Amarillo', material: null, gender: null,
    certification: null, safety_standard: null, serial_number: 'KARCHER-K7-001',
    brand: 'Kärcher', model: 'K7', expiration_date: null, warranty_expiration: '2028-06-01',
    last_maintenance: '2025-03-15', next_maintenance: '2025-09-15'

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000068', name: 'Barredora Tennant 5700 (2)', description: 'Segunda barredora industrial Tennant',
    category: 'maquinaria', subtype_id: 'ist-25', status_id: 'ms-1', quantity: 1, min_stock: 1, unit: 'unidades',
    city_id: 'city-1', work_center_id: 'wc-7', location: 'Taller',
    assigned_to: null, notes: 'Unidad de repuesto',
    attributes: {

      size: null, color: 'Azul', material: null, gender: null,
    certification: null, safety_standard: null, serial_number: 'TENNANT-5700-002',
    brand: 'Tennant', model: '5700', expiration_date: null, warranty_expiration: null,
    last_maintenance: '2025-02-10', next_maintenance: '2025-08-10'

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000069', name: 'Motosierra STIHL MS261 (2)', description: 'Segunda motosierra STIHL MS 261',
    category: 'maquinaria', subtype_id: 'ist-26', status_id: 'ms-1', quantity: 1, min_stock: 1, unit: 'unidades',
    city_id: 'city-1', work_center_id: 'wc-5', location: 'Garaje Garena',
    assigned_to: null, notes: 'Espada de 45cm',
    attributes: {

      size: null, color: 'Naranja/Gris', material: null, gender: null,
    certification: null, safety_standard: null, serial_number: 'STIHL-MS261-002',
    brand: 'STIHL', model: 'MS 261 C-M', expiration_date: null, warranty_expiration: '2027-02-01',
    last_maintenance: '2025-04-01', next_maintenance: '2025-10-01'

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000070', name: 'Generador Hyundai HY2000', description: 'Generador portátil Hyundai HY2000i',
    category: 'maquinaria', subtype_id: 'ist-27', status_id: 'ms-1', quantity: 1, min_stock: 1, unit: 'unidades',
    city_id: 'city-1', work_center_id: 'wc-1', location: 'Garaje Nave',
    assigned_to: null, notes: '',
    attributes: {

      size: null, color: 'Rojo/Negro', material: null, gender: null,
    certification: null, safety_standard: null, serial_number: 'HYUNDAI-HY2-001',
    brand: 'Hyundai', model: 'HY2000i', expiration_date: null, warranty_expiration: '2028-01-01',
    last_maintenance: '2025-01-20', next_maintenance: '2025-07-20'

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000071', name: 'Sopladora STIHL BR600 (3)', description: 'Tercera sopladora STIHL BR 600',
    category: 'maquinaria', subtype_id: 'ist-20', status_id: 'ms-1', quantity: 2, min_stock: 1, unit: 'unidades',
    city_id: 'city-1', work_center_id: 'wc-3', location: 'Garaje Gilitos',
    assigned_to: null, notes: '',
    attributes: {

      size: null, color: 'Naranja/Gris', material: null, gender: null,
    certification: null, safety_standard: null, serial_number: 'STIHL-BR600-003',
    brand: 'STIHL', model: 'BR 600', expiration_date: null, warranty_expiration: '2027-06-01',
    last_maintenance: '2025-03-20', next_maintenance: '2025-09-20'

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000072', name: 'Desbrozadora STIHL FS131 (3)', description: 'Tercera desbrozadora STIHL FS 131',
    category: 'maquinaria', subtype_id: 'ist-21', status_id: 'ms-1', quantity: 2, min_stock: 1, unit: 'unidades',
    city_id: 'city-2', work_center_id: 'wc-11', location: 'Centro01 - Almacén',
    assigned_to: null, notes: '',
    attributes: {

      size: null, color: 'Naranja/Gris', material: null, gender: null,
    certification: null, safety_standard: null, serial_number: 'STIHL-FS131-003',
    brand: 'STIHL', model: 'FS 131', expiration_date: null, warranty_expiration: '2026-09-01',
    last_maintenance: '2025-04-10', next_maintenance: '2025-10-10'

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000073', name: 'Motocultor Honda F220 (3)', description: 'Tercer motocultor Honda F220',
    category: 'maquinaria', subtype_id: 'ist-23', status_id: 'ms-2', quantity: 1, min_stock: 1, unit: 'unidades',
    city_id: 'city-2', work_center_id: 'wc-11', location: 'Centro01 - Almacén',
    assigned_to: null, notes: 'En mantenimiento preventivo',
    attributes: {

      size: null, color: 'Rojo', material: null, gender: null,
    certification: null, safety_standard: null, serial_number: 'HONDA-F220-003',
    brand: 'Honda', model: 'F220', expiration_date: null, warranty_expiration: null,
    last_maintenance: '2025-05-01', next_maintenance: '2025-11-01'

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000074', name: 'Cortacésped Husqvarna LC247 (3)', description: 'Tercer cortacésped Husqvarna',
    category: 'maquinaria', subtype_id: 'ist-22', status_id: 'ms-3', quantity: 1, min_stock: 1, unit: 'unidades',
    city_id: 'city-2', work_center_id: 'wc-11', location: 'Centro01 - Exterior',
    assigned_to: null, notes: 'Averiado - cuchilla desviada',
    attributes: {

      size: null, color: 'Rojo/Negro', material: null, gender: null,
    certification: null, safety_standard: null, serial_number: 'HUSQ-LC247-003',
    brand: 'Husqvarna', model: 'LC 247', expiration_date: null, warranty_expiration: '2027-03-01',
    last_maintenance: '2025-01-10', next_maintenance: '2025-07-10'

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000075', name: 'Motosierra STIHL MS181', description: 'Motosierra STIHL MS 181 C-BE',
    category: 'maquinaria', subtype_id: 'ist-26', status_id: 'ms-1', quantity: 1, min_stock: 1, unit: 'unidades',
    city_id: 'city-2', work_center_id: 'wc-11', location: 'Centro01 - Almacén',
    assigned_to: null, notes: 'Ligera para poda',
    attributes: {

      size: null, color: 'Naranja/Gris', material: null, gender: null,
    certification: null, safety_standard: null, serial_number: 'STIHL-MS181-001',
    brand: 'STIHL', model: 'MS 181 C-BE', expiration_date: null, warranty_expiration: '2027-08-01',
    last_maintenance: '2025-03-05', next_maintenance: '2025-09-05'

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000077', name: 'Pantalón Verano Azul S', description: 'Pantalón de trabajo verano talla S',
    category: 'ropa', subtype_id: 'ist-1', status_id: 'rs-1', quantity: 10, min_stock: 5, unit: 'unidades',
    city_id: 'city-2', work_center_id: 'wc-21', location: 'Estante A-1',
    assigned_to: null, notes: '',
    attributes: {

      size: 'S', color: 'Azul', material: 'Algodón ligero', gender: 'Hombre',
    certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
    expiration_date: null, warranty_expiration: null, last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000078', name: 'Mascarilla FFP1', description: 'Mascarilla autofiltrante FFP1',
    category: 'epi', subtype_id: 'ist-13', status_id: 'es-1', quantity: 100, min_stock: 30, unit: 'unidades',
    city_id: 'city-2', work_center_id: 'wc-21', location: 'Estante E-3',
    assigned_to: null, notes: 'Baja protección - para polvo',
    attributes: {

      size: 'Talla única', color: 'Blanco', material: 'Tejido no tejido', gender: null,
    certification: 'CE', safety_standard: 'EN 149', serial_number: null,
    brand: null, model: null, expiration_date: '2027-12-01', warranty_expiration: null,
    last_maintenance: null, next_maintenance: null

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000079', name: 'Desbrozadora STIHL FS94', description: 'Desbrozadora STIHL FS 94',
    category: 'maquinaria', subtype_id: 'ist-21', status_id: 'ms-1', quantity: 1, min_stock: 1, unit: 'unidades',
    city_id: 'city-2', work_center_id: 'wc-11', location: 'Centro01 - Almacén',
    assigned_to: null, notes: 'Ligera para bordes',
    attributes: {

      size: null, color: 'Naranja/Gris', material: null, gender: null,
    certification: null, safety_standard: null, serial_number: 'STIHL-FS94-001',
    brand: 'STIHL', model: 'FS 94', expiration_date: null, warranty_expiration: '2027-05-01',
    last_maintenance: '2025-03-01', next_maintenance: '2025-09-01'

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000080', name: 'Sopladora STIHL BR600 (4)', description: 'Cuarta sopladora STIHL BR 600',
    category: 'maquinaria', subtype_id: 'ist-20', status_id: 'ms-1', quantity: 1, min_stock: 1, unit: 'unidades',
    city_id: 'city-2', work_center_id: 'wc-11', location: 'Centro01 - Almacén',
    assigned_to: null, notes: '',
    attributes: {

      size: null, color: 'Naranja/Gris', material: null, gender: null,
    certification: null, safety_standard: null, serial_number: 'STIHL-BR600-004',
    brand: 'STIHL', model: 'BR 600', expiration_date: null, warranty_expiration: '2027-06-01',
    last_maintenance: '2025-04-15', next_maintenance: '2025-10-15'

    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000081', name: 'Cortacésped Husqvarna LC247 (4)', description: 'Cuarto cortacésped Husqvarna',
    category: 'maquinaria', subtype_id: 'ist-22', status_id: 'ms-1', quantity: 1, min_stock: 1, unit: 'unidades',
    city_id: 'city-2', work_center_id: 'wc-11', location: 'Centro01 - Exterior',
    assigned_to: null, notes: '',
    attributes: {

      size: null, color: 'Rojo/Negro', material: null, gender: null,
    certification: null, safety_standard: null, serial_number: 'HUSQ-LC247-004',
    brand: 'Husqvarna', model: 'LC 247', expiration_date: null, warranty_expiration: '2027-03-01',
    last_maintenance: '2025-02-15', next_maintenance: '2025-08-15'

    },

    created_at: NOW, updated_at: NOW,
  },
];

