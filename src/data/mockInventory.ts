import { InventoryItem, InventoryCategory, InventoryCategoryOption, InventoryStatus, InventorySubtype } from '../types';

export const INVENTORY_CATEGORIES: InventoryCategoryOption[] = [
  { id: 'ic-1', name: 'Ropa', value: 'clothing' },
  { id: 'ic-2', name: 'EPIs', value: 'ppe' },
];

export const ROPA_STATUSES: InventoryStatus[] = [
  { id: 'rs-1', name: 'Disponible', category: 'clothing' },
  { id: 'rs-2', name: 'Agotado', category: 'clothing' },
  { id: 'rs-3', name: 'En Reposición', category: 'clothing' },
];

export const EPI_STATUSES: InventoryStatus[] = [
  { id: 'es-1', name: 'Disponible', category: 'ppe' },
  { id: 'es-2', name: 'Agotado', category: 'ppe' },
  { id: 'es-3', name: 'En Reposición', category: 'ppe' },
];

export const getStatusesForCategory = (cat: InventoryCategory): InventoryStatus[] => {
  switch (cat) {
    case 'clothing': return ROPA_STATUSES;
    case 'ppe': return EPI_STATUSES;
    default: return [];
  }
};

export const INVENTORY_SUBTYPES: InventorySubtype[] = [
  { id: 'ist-1', category: 'clothing', name: 'Pantalón' },
  { id: 'ist-2', category: 'clothing', name: 'Camisa' },
  { id: 'ist-3', category: 'clothing', name: 'Chaqueta' },
  { id: 'ist-4', category: 'clothing', name: 'Forro' },
  { id: 'ist-5', category: 'clothing', name: 'Chaquetón' },
  { id: 'ist-6', category: 'clothing', name: 'Gorra' },
  { id: 'ist-7', category: 'clothing', name: 'Zapatos' },
  { id: 'ist-8', category: 'clothing', name: 'Botas' },

  { id: 'ist-11', category: 'ppe', name: 'Casco' },
  { id: 'ist-12', category: 'ppe', name: 'Guantes' },
  { id: 'ist-13', category: 'ppe', name: 'Mascarilla' },
  { id: 'ist-14', category: 'ppe', name: 'Máscara' },
  { id: 'ist-15', category: 'ppe', name: 'Arnés' },
  { id: 'ist-16', category: 'ppe', name: 'Protector' },
  { id: 'ist-17', category: 'ppe', name: 'Gafas' },
];

export const getSubtypesForCategory = (cat: InventoryCategory): InventorySubtype[] =>
  INVENTORY_SUBTYPES.filter((st) => st.category === cat);

export const INVENTORY_WAREHOUSE_IDS = ['wc_000009', 'wc_000021'];

const NOW = '2024-01-01T00:00:00Z';

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv_000001', name: 'Pantalón Verano', description: 'Pantalón de trabajo ligero verano',
    category: 'clothing', subtype_id: 'ist-1', status_id: 'rs-1', quantity: 30, min_stock: 10, unit: 'unidades',
    city_id: 'ci_000001', work_center_id: 'wc_000009', location: 'Estante A-1',
    color: 'Verde-Amarilla', size: 'L', gender: 'Hombre',
    assigned_to: null, notes: '',
    attributes: {
      material: 'Algodón/Poliéster reflectante',
      certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
      expiration_date: null
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000002', name: 'Pantalón Verano', description: 'Pantalón de trabajo ligero verano',
    category: 'clothing', subtype_id: 'ist-1', status_id: 'rs-1', quantity: 25, min_stock: 10, unit: 'unidades',
    city_id: 'ci_000001', work_center_id: 'wc_000009', location: 'Estante A-1',
    color: 'Verde-Amarilla', size: 'M', gender: 'Hombre',
    assigned_to: null, notes: '',
    attributes: {
      material: 'Algodón/Poliéster reflectante',
      certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
      expiration_date: null
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000003', name: 'Pantalón Invierno', description: 'Pantalón de trabajo térmico invierno',
    category: 'clothing', subtype_id: 'ist-1', status_id: 'rs-1', quantity: 20, min_stock: 10, unit: 'unidades',
    city_id: 'ci_000001', work_center_id: 'wc_000009', location: 'Estante A-2',
    color: 'Verde-Amarilla', size: 'L', gender: 'Hombre',
    assigned_to: null, notes: '',
    attributes: {
      material: 'Algodón/Poliéster reflectante térmico',
      certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
      expiration_date: null
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000004', name: 'Pantalón Invierno', description: 'Pantalón de trabajo térmico invierno',
    category: 'clothing', subtype_id: 'ist-1', status_id: 'rs-1', quantity: 15, min_stock: 10, unit: 'unidades',
    city_id: 'ci_000001', work_center_id: 'wc_000009', location: 'Estante A-2',
    color: 'Verde-Amarilla', size: 'M', gender: 'Hombre',
    assigned_to: null, notes: '',
    attributes: {
      material: 'Algodón/Poliéster reflectante térmico',
      certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
      expiration_date: null
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000005', name: 'Camisa Verano', description: 'Camisa manga corta verano',
    category: 'clothing', subtype_id: 'ist-2', status_id: 'rs-1', quantity: 40, min_stock: 10, unit: 'unidades',
    city_id: 'ci_000001', work_center_id: 'wc_000009', location: 'Estante B-1',
    color: 'Verde-Amarilla', size: 'L', gender: 'Hombre',
    assigned_to: null, notes: '',
    attributes: {
      material: 'Algodón/Poliéster reflectante',
      certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
      expiration_date: null
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000006', name: 'Camisa Verano', description: 'Camisa manga corta verano',
    category: 'clothing', subtype_id: 'ist-2', status_id: 'rs-2', quantity: 0, min_stock: 10, unit: 'unidades',
    city_id: 'ci_000001', work_center_id: 'wc_000009', location: 'Estante B-1',
    color: 'Verde-Amarilla', size: 'M', gender: 'Hombre',
    assigned_to: null, notes: 'agotado',
    attributes: {
      material: 'Algodón/Poliéster reflectante',
      certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
      expiration_date: null
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000007', name: 'Camisa Invierno', description: 'Camisa manga larga invierno encargado',
    category: 'clothing', subtype_id: 'ist-2', status_id: 'rs-1', quantity: 20, min_stock: 10, unit: 'unidades',
    city_id: 'ci_000002', work_center_id: 'wc_000021', location: 'Estante A-1',
    color: 'Azul', size: 'L', gender: 'Hombre',
    assigned_to: null, notes: '',
    attributes: {
      material: 'Algodón/Poliéster',
      certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
      expiration_date: null
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000008', name: 'Chaqueta Verano', description: 'Chaqueta transpirable verano',
    category: 'clothing', subtype_id: 'ist-3', status_id: 'rs-1', quantity: 15, min_stock: 5, unit: 'unidades',
    city_id: 'ci_000002', work_center_id: 'wc_000021', location: 'Estante A-2',
    color: 'Verde-Amarilla', size: 'L', gender: 'Hombre',
    assigned_to: null, notes: '',
    attributes: {
      material: 'Poliéster reflectante transpirable',
      certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
      expiration_date: null
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000009', name: 'Chaqueta Invierno', description: 'Chaqueta térmica invierno encargado',
    category: 'clothing', subtype_id: 'ist-3', status_id: 'rs-3', quantity: 10, min_stock: 5, unit: 'unidades',
    city_id: 'ci_000002', work_center_id: 'wc_000021', location: 'Estante A-3',
    color: 'Azul', size: 'XL', gender: 'Hombre',
    assigned_to: null, notes: 'en reposición',
    attributes: {
      material: 'Poliéster con forro térmico',
      certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
      expiration_date: null
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000010', name: 'Forro Polar', description: 'Forro polar térmico para media temporada',
    category: 'clothing', subtype_id: 'ist-4', status_id: 'rs-1', quantity: 35, min_stock: 10, unit: 'unidades',
    city_id: 'ci_000002', work_center_id: 'wc_000021', location: 'Estante A-4',
    color: 'Negro', size: 'M', gender: 'Unisex',
    assigned_to: null, notes: '',
    attributes: {
      material: 'Microfibra polar',
      certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
      expiration_date: null
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000011', name: 'Guantes de Latex', description: 'Guantes desechables de látex sin polvo',
    category: 'ppe', subtype_id: 'ist-12', status_id: 'es-1', quantity: 500, min_stock: 100, unit: 'pares',
    city_id: 'ci_000001', work_center_id: 'wc_000009', location: 'Estante C-1',
    assigned_to: null, notes: 'Caja de 100 unidades',
    attributes: {
      size: 'Talla única', color: 'Blanco', material: 'Latex', gender: null,
      certification: 'CE', safety_standard: 'EN 455', serial_number: null,
      expiration_date: '2027-06-01'
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000012', name: 'Casco de Seguridad', description: 'Casco de seguridad con visera',
    category: 'ppe', subtype_id: 'ist-11', status_id: 'es-1', quantity: 40, min_stock: 10, unit: 'unidades',
    city_id: 'ci_000001', work_center_id: 'wc_000009', location: 'Estante C-2',
    assigned_to: null, notes: 'Certificado CE',
    attributes: {
      size: null, color: 'Amarillo', material: 'ABS', gender: null,
      certification: 'CE', safety_standard: 'EN 397', serial_number: null,
      expiration_date: '2027-06-01'
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000013', name: 'Guantes de Seguridad Nivel 5', description: 'Guantes anticorte nivel 5',
    category: 'ppe', subtype_id: 'ist-12', status_id: 'es-1', quantity: 80, min_stock: 20, unit: 'pares',
    city_id: 'ci_000001', work_center_id: 'wc_000009', location: 'Estante C-3',
    assigned_to: null, notes: 'Resistentes a cortes',
    attributes: {
      size: 'L', color: 'Gris', material: 'Kevlar', gender: null,
      certification: 'CE', safety_standard: 'EN 388', serial_number: null,
      expiration_date: '2026-12-01'
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000014', name: 'Mascarilla FFP3', description: 'Mascarilla autofiltrante FFP3',
    category: 'ppe', subtype_id: 'ist-13', status_id: 'es-1', quantity: 200, min_stock: 50, unit: 'unidades',
    city_id: 'ci_000001', work_center_id: 'wc_000009', location: 'Estante C-4',
    assigned_to: null, notes: 'Caja de 20 unidades',
    attributes: {
      size: 'Talla única', color: 'Blanco', material: 'Tejido no tejido', gender: null,
      certification: 'CE', safety_standard: 'EN 149', serial_number: null,
      expiration_date: '2026-08-01'
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000015', name: 'Máscara de Desbrozar', description: 'Máscara de protección para desbrozadora',
    category: 'ppe', subtype_id: 'ist-14', status_id: 'es-1', quantity: 15, min_stock: 5, unit: 'unidades',
    city_id: 'ci_000001', work_center_id: 'wc_000009', location: 'Estante D-1',
    assigned_to: null, notes: 'Incluye visor',
    attributes: {
      size: 'Talla única', color: 'Negro', material: 'Plástico/Malla', gender: null,
      certification: 'CE', safety_standard: 'EN 1731', serial_number: null,
      expiration_date: '2028-01-01'
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000016', name: 'Mascarilla con Filtro', description: 'Mascarilla con filtro recambiable',
    category: 'ppe', subtype_id: 'ist-13', status_id: 'es-3', quantity: 8, min_stock: 5, unit: 'unidades',
    city_id: 'ci_000002', work_center_id: 'wc_000021', location: 'Estante D-2',
    assigned_to: null, notes: 'En reposición - filtros pendientes de cambiar',
    attributes: {
      size: 'Talla única', color: 'Negro', material: 'Silicona/Plástico', gender: null,
      certification: 'CE', safety_standard: 'EN 140', serial_number: 'MF-002',
      expiration_date: '2026-11-01'
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000017', name: 'Arnés Anti-Caídas', description: 'Arnés de seguridad con doble enganche',
    category: 'ppe', subtype_id: 'ist-15', status_id: 'es-1', quantity: 10, min_stock: 3, unit: 'unidades',
    city_id: 'ci_000002', work_center_id: 'wc_000021', location: 'Estante D-3',
    assigned_to: null, notes: 'Revisar antes de usar',
    attributes: {
      size: 'L', color: 'Naranja', material: 'Poliamida', gender: null,
      certification: 'CE', safety_standard: 'EN 361', serial_number: 'ARN-001',
      expiration_date: '2026-05-01'
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000018', name: 'Protector Auditivo Copa', description: 'Protector auditivo tipo copa',
    category: 'ppe', subtype_id: 'ist-16', status_id: 'es-1', quantity: 30, min_stock: 10, unit: 'pares',
    city_id: 'ci_000002', work_center_id: 'wc_000021', location: 'Estante D-4',
    assigned_to: null, notes: 'SNR 30 dB',
    attributes: {
      size: 'Talla única', color: 'Amarillo/Negro', material: 'Plástico/Espuma', gender: null,
      certification: 'CE', safety_standard: 'EN 352-1', serial_number: null,
      expiration_date: '2027-03-01'
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000019', name: 'Gafas de Seguridad', description: 'Gafas de protección transparente',
    category: 'ppe', subtype_id: 'ist-17', status_id: 'es-1', quantity: 50, min_stock: 15, unit: 'unidades',
    city_id: 'ci_000002', work_center_id: 'wc_000021', location: 'Estante E-1',
    assigned_to: null, notes: 'Anti-empañamiento',
    attributes: {
      size: 'Talla única', color: 'Transparente', material: 'Policarbonato', gender: null,
      certification: 'CE', safety_standard: 'EN 166', serial_number: null,
      expiration_date: '2028-06-01'
    },

    created_at: NOW, updated_at: NOW,
  },

  {
    id: 'inv_000036', name: 'Pantalón Verano', description: 'Pantalón verano encargado',
    category: 'clothing', subtype_id: 'ist-1', status_id: 'rs-1', quantity: 18, min_stock: 10, unit: 'unidades',
    city_id: 'ci_000001', work_center_id: 'wc_000009', location: 'Estante A-1',
    color: 'Azul', size: 'XL', gender: 'Hombre',
    assigned_to: null, notes: '',
    attributes: {
      material: 'Algodón ligero',
      certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
      expiration_date: null
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000037', name: 'Camisa Invierno', description: 'Camisa invierno encargado',
    category: 'clothing', subtype_id: 'ist-2', status_id: 'rs-3', quantity: 12, min_stock: 10, unit: 'unidades',
    city_id: 'ci_000002', work_center_id: 'wc_000021', location: 'Estante A-2',
    color: 'Azul', size: 'M', gender: 'Hombre',
    assigned_to: null, notes: 'en reposición',
    attributes: {
      material: 'Algodón/Poliéster',
      certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
      expiration_date: null
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000038', name: 'Guantes de Nitrilo', description: 'Guantes desechables de nitrilo sin polvo',
    category: 'ppe', subtype_id: 'ist-12', status_id: 'es-1', quantity: 300, min_stock: 100, unit: 'pares',
    city_id: 'ci_000001', work_center_id: 'wc_000009', location: 'Estante C-1',
    assigned_to: null, notes: 'Caja de 100 unidades - talla M',
    attributes: {
      size: 'M', color: 'Azul', material: 'Nitrilo', gender: null,
      certification: 'CE', safety_standard: 'EN 455', serial_number: null,
      expiration_date: '2028-01-01'
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000039', name: 'Casco con Pantalla', description: 'Casco de seguridad con pantalla facial',
    category: 'ppe', subtype_id: 'ist-11', status_id: 'es-1', quantity: 12, min_stock: 5, unit: 'unidades',
    city_id: 'ci_000002', work_center_id: 'wc_000021', location: 'Estante E-2',
    assigned_to: null, notes: 'Protección facial incluida',
    attributes: {
      size: null, color: 'Blanco', material: 'ABS', gender: null,
      certification: 'CE', safety_standard: 'EN 397 / EN 166', serial_number: null,
      expiration_date: '2027-09-01'
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000040', name: 'Mascarilla FFP2', description: 'Mascarilla autofiltrante FFP2',
    category: 'ppe', subtype_id: 'ist-13', status_id: 'es-2', quantity: 0, min_stock: 50, unit: 'unidades',
    city_id: 'ci_000002', work_center_id: 'wc_000021', location: 'Estante E-3',
    assigned_to: null, notes: 'Agotado - solicitar reposición',
    attributes: {
      size: 'Talla única', color: 'Blanco', material: 'Tejido no tejido', gender: null,
      certification: 'CE', safety_standard: 'EN 149', serial_number: null,
      expiration_date: '2026-10-01'
    },

    created_at: NOW, updated_at: NOW,
  },

  {
    id: 'inv_000045', name: 'Pantalón Verano', description: 'Pantalón verano talla XL',
    category: 'clothing', subtype_id: 'ist-1', status_id: 'rs-1', quantity: 20, min_stock: 10, unit: 'unidades',
    city_id: 'ci_000001', work_center_id: 'wc_000009', location: 'Estante A-3',
    color: 'Verde-Amarilla', size: 'XL', gender: 'Hombre',
    assigned_to: null, notes: '',
    attributes: {
      material: 'Algodón/Poliéster reflectante',
      certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
      expiration_date: null
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000046', name: 'Camisa Verano', description: 'Camisa verano manga corta talla XL',
    category: 'clothing', subtype_id: 'ist-2', status_id: 'rs-1', quantity: 18, min_stock: 10, unit: 'unidades',
    city_id: 'ci_000001', work_center_id: 'wc_000009', location: 'Estante B-2',
    color: 'Verde-Amarilla', size: 'XL', gender: 'Hombre',
    assigned_to: null, notes: '',
    attributes: {
      material: 'Algodón/Poliéster reflectante',
      certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
      expiration_date: null
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000047', name: 'Chaqueta Verano', description: 'Chaqueta verano talla M',
    category: 'clothing', subtype_id: 'ist-3', status_id: 'rs-1', quantity: 12, min_stock: 5, unit: 'unidades',
    city_id: 'ci_000001', work_center_id: 'wc_000009', location: 'Estante A-3',
    color: 'Verde-Amarilla', size: 'M', gender: 'Hombre',
    assigned_to: null, notes: '',
    attributes: {
      material: 'Poliéster reflectante transpirable',
      certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
      expiration_date: null
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000048', name: 'Camisa Invierno', description: 'Camisa invierno encargado talla XL',
    category: 'clothing', subtype_id: 'ist-2', status_id: 'rs-1', quantity: 15, min_stock: 10, unit: 'unidades',
    city_id: 'ci_000001', work_center_id: 'wc_000009', location: 'Estante B-2',
    color: 'Azul', size: 'XL', gender: 'Hombre',
    assigned_to: null, notes: '',
    attributes: {
      material: 'Algodón/Poliéster',
      certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
      expiration_date: null
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000049', name: 'Pantalón Invierno', description: 'Pantalón invierno térmico talla XL',
    category: 'clothing', subtype_id: 'ist-1', status_id: 'rs-1', quantity: 14, min_stock: 10, unit: 'unidades',
    city_id: 'ci_000001', work_center_id: 'wc_000009', location: 'Estante A-3',
    color: 'Verde-Amarilla', size: 'XL', gender: 'Hombre',
    assigned_to: null, notes: '',
    attributes: {
      material: 'Algodón/Poliéster reflectante térmico',
      certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
      expiration_date: null
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000050', name: 'Pantalón Verano', description: 'Pantalón verano talla XXL',
    category: 'clothing', subtype_id: 'ist-1', status_id: 'rs-1', quantity: 10, min_stock: 5, unit: 'unidades',
    city_id: 'ci_000002', work_center_id: 'wc_000021', location: 'Estante A-1',
    color: 'Verde-Amarilla', size: 'XXL', gender: 'Hombre',
    assigned_to: null, notes: '',
    attributes: {
      material: 'Algodón/Poliéster reflectante',
      certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
      expiration_date: null
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000051', name: 'Camisa Verano', description: 'Camisa verano manga corta talla XXL',
    category: 'clothing', subtype_id: 'ist-2', status_id: 'rs-1', quantity: 12, min_stock: 5, unit: 'unidades',
    city_id: 'ci_000002', work_center_id: 'wc_000021', location: 'Estante B-1',
    color: 'Verde-Amarilla', size: 'XXL', gender: 'Hombre',
    assigned_to: null, notes: '',
    attributes: {
      material: 'Algodón/Poliéster reflectante',
      certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
      expiration_date: null
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000052', name: 'Chaqueta Verano', description: 'Chaqueta verano talla XL',
    category: 'clothing', subtype_id: 'ist-3', status_id: 'rs-1', quantity: 10, min_stock: 5, unit: 'unidades',
    city_id: 'ci_000002', work_center_id: 'wc_000021', location: 'Estante A-2',
    color: 'Verde-Amarilla', size: 'XL', gender: 'Hombre',
    assigned_to: null, notes: '',
    attributes: {
      material: 'Poliéster reflectante transpirable',
      certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
      expiration_date: null
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000053', name: 'Chaqueta Invierno', description: 'Chaqueta invierno encargado talla L',
    category: 'clothing', subtype_id: 'ist-3', status_id: 'rs-3', quantity: 8, min_stock: 5, unit: 'unidades',
    city_id: 'ci_000002', work_center_id: 'wc_000021', location: 'Estante A-3',
    color: 'Azul', size: 'L', gender: 'Hombre',
    assigned_to: null, notes: 'en reposición',
    attributes: {
      material: 'Poliéster con forro térmico',
      certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
      expiration_date: null
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000054', name: 'Forro Polar', description: 'Forro polar térmico talla L',
    category: 'clothing', subtype_id: 'ist-4', status_id: 'rs-1', quantity: 22, min_stock: 10, unit: 'unidades',
    city_id: 'ci_000002', work_center_id: 'wc_000021', location: 'Estante A-4',
    color: 'Negro', size: 'L', gender: 'Unisex',
    assigned_to: null, notes: '',
    attributes: {
      material: 'Microfibra polar',
      certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
      expiration_date: null
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000055', name: 'Forro Polar', description: 'Forro polar térmico talla XL',
    category: 'clothing', subtype_id: 'ist-4', status_id: 'rs-2', quantity: 0, min_stock: 10, unit: 'unidades',
    city_id: 'ci_000002', work_center_id: 'wc_000021', location: 'Estante A-4',
    color: 'Negro', size: 'XL', gender: 'Unisex',
    assigned_to: null, notes: 'agotado',
    attributes: {
      material: 'Microfibra polar',
      certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
      expiration_date: null
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000056', name: 'Casco de Seguridad Azul', description: 'Casco de seguridad azul con visera',
    category: 'ppe', subtype_id: 'ist-11', status_id: 'es-1', quantity: 25, min_stock: 10, unit: 'unidades',
    city_id: 'ci_000001', work_center_id: 'wc_000009', location: 'Estante C-2',
    assigned_to: null, notes: 'Lote nuevo',
    attributes: {
      size: null, color: 'Azul', material: 'ABS', gender: null,
      certification: 'CE', safety_standard: 'EN 397', serial_number: null,
      expiration_date: '2028-03-01'
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000057', name: 'Guantes de Neopreno', description: 'Guantes de neopreno para productos químicos',
    category: 'ppe', subtype_id: 'ist-12', status_id: 'es-1', quantity: 60, min_stock: 20, unit: 'pares',
    city_id: 'ci_000001', work_center_id: 'wc_000009', location: 'Estante C-3',
    assigned_to: null, notes: 'Resistentes a químicos',
    attributes: {
      size: 'L', color: 'Negro', material: 'Neopreno', gender: null,
      certification: 'CE', safety_standard: 'EN 374', serial_number: null,
      expiration_date: '2027-08-01'
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000058', name: 'Mascarilla KN95', description: 'Mascarilla KN95 con válvula',
    category: 'ppe', subtype_id: 'ist-13', status_id: 'es-2', quantity: 0, min_stock: 50, unit: 'unidades',
    city_id: 'ci_000001', work_center_id: 'wc_000009', location: 'Estante C-4',
    assigned_to: null, notes: 'Agotado - pedir nuevo lote',
    attributes: {
      size: 'Talla única', color: 'Blanco', material: 'Tejido no tejido', gender: null,
      certification: 'CE', safety_standard: 'EN 149', serial_number: null,
      expiration_date: '2027-05-01'
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000059', name: 'Protector Tapones', description: 'Protector auditivo tipo tapones reutilizables',
    category: 'ppe', subtype_id: 'ist-16', status_id: 'es-1', quantity: 100, min_stock: 30, unit: 'pares',
    city_id: 'ci_000001', work_center_id: 'wc_000009', location: 'Estante D-4',
    assigned_to: null, notes: 'SNR 25 dB',
    attributes: {
      size: 'Talla única', color: 'Azul', material: 'Silicona', gender: null,
      certification: 'CE', safety_standard: 'EN 352-2', serial_number: null,
      expiration_date: '2028-01-01'
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000060', name: 'Gafas Oscuras', description: 'Gafas de seguridad con filtro solar',
    category: 'ppe', subtype_id: 'ist-17', status_id: 'es-1', quantity: 30, min_stock: 10, unit: 'unidades',
    city_id: 'ci_000001', work_center_id: 'wc_000009', location: 'Estante E-1',
    assigned_to: null, notes: 'Protección UV',
    attributes: {
      size: 'Talla única', color: 'Oscuro', material: 'Policarbonato', gender: null,
      certification: 'CE', safety_standard: 'EN 166', serial_number: null,
      expiration_date: '2028-09-01'
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000061', name: 'Arnés Posicionamiento', description: 'Arnés de posicionamiento con cinturón',
    category: 'ppe', subtype_id: 'ist-15', status_id: 'es-1', quantity: 5, min_stock: 3, unit: 'unidades',
    city_id: 'ci_000001', work_center_id: 'wc_000009', location: 'Estante D-3',
    assigned_to: null, notes: 'Uso en altura',
    attributes: {
      size: 'L', color: 'Azul', material: 'Poliamida', gender: null,
      certification: 'CE', safety_standard: 'EN 358', serial_number: 'ARN-002',
      expiration_date: '2027-02-01'
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000062', name: 'Guantes Térmicos', description: 'Guantes térmicos para trabajos en frío',
    category: 'ppe', subtype_id: 'ist-12', status_id: 'es-1', quantity: 40, min_stock: 15, unit: 'pares',
    city_id: 'ci_000002', work_center_id: 'wc_000021', location: 'Estante C-1',
    assigned_to: null, notes: 'Invierno',
    attributes: {
      size: 'L', color: 'Negro', material: 'Forro térmico', gender: null,
      certification: 'CE', safety_standard: 'EN 511', serial_number: null,
      expiration_date: '2028-06-01'
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000063', name: 'Mascarilla FFP3 Válvula', description: 'Mascarilla FFP3 con válvula de exhalación',
    category: 'ppe', subtype_id: 'ist-13', status_id: 'es-1', quantity: 150, min_stock: 50, unit: 'unidades',
    city_id: 'ci_000002', work_center_id: 'wc_000021', location: 'Estante E-2',
    assigned_to: null, notes: '',
    attributes: {
      size: 'Talla única', color: 'Blanco', material: 'Tejido no tejido', gender: null,
      certification: 'CE', safety_standard: 'EN 149', serial_number: null,
      expiration_date: '2027-10-01'
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000064', name: 'Protector Electrónico', description: 'Protector auditivo electrónico con micrófono',
    category: 'ppe', subtype_id: 'ist-16', status_id: 'es-3', quantity: 12, min_stock: 5, unit: 'pares',
    city_id: 'ci_000002', work_center_id: 'wc_000021', location: 'Estante D-4',
    assigned_to: null, notes: 'En reposición - baterías agotadas',
    attributes: {
      size: 'Talla única', color: 'Amarillo/Negro', material: 'Plástico/Electrónica', gender: null,
      certification: 'CE', safety_standard: 'EN 352-1', serial_number: 'ELEC-001',
      expiration_date: '2028-03-01'
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000065', name: 'Gafas Graduables', description: 'Gafas de seguridad con soporte para graduación',
    category: 'ppe', subtype_id: 'ist-17', status_id: 'es-1', quantity: 20, min_stock: 10, unit: 'unidades',
    city_id: 'ci_000002', work_center_id: 'wc_000021', location: 'Estante E-1',
    assigned_to: null, notes: 'Adaptables',
    attributes: {
      size: 'Talla única', color: 'Transparente', material: 'Policarbonato', gender: null,
      certification: 'CE', safety_standard: 'EN 166', serial_number: null,
      expiration_date: '2029-01-01'
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000066', name: 'Casco Barbuquejo', description: 'Casco de seguridad con barbuquejo',
    category: 'ppe', subtype_id: 'ist-11', status_id: 'es-1', quantity: 15, min_stock: 5, unit: 'unidades',
    city_id: 'ci_000002', work_center_id: 'wc_000021', location: 'Estante E-2',
    assigned_to: null, notes: '',
    attributes: {
      size: null, color: 'Blanco', material: 'ABS', gender: null,
      certification: 'CE', safety_standard: 'EN 397', serial_number: null,
      expiration_date: '2028-11-01'
    },

    created_at: NOW, updated_at: NOW,
  },

  {
    id: 'inv_000077', name: 'Pantalón Verano', description: 'Pantalón verano encargado talla S',
    category: 'clothing', subtype_id: 'ist-1', status_id: 'rs-1', quantity: 10, min_stock: 5, unit: 'unidades',
    city_id: 'ci_000002', work_center_id: 'wc_000021', location: 'Estante A-1',
    color: 'Azul', size: 'S', gender: 'Hombre',
    assigned_to: null, notes: '',
    attributes: {
      material: 'Algodón ligero',
      certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
      expiration_date: null
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000078', name: 'Mascarilla FFP1', description: 'Mascarilla autofiltrante FFP1',
    category: 'ppe', subtype_id: 'ist-13', status_id: 'es-1', quantity: 100, min_stock: 30, unit: 'unidades',
    city_id: 'ci_000002', work_center_id: 'wc_000021', location: 'Estante E-3',
    assigned_to: null, notes: 'Baja protección - para polvo',
    attributes: {
      size: 'Talla única', color: 'Blanco', material: 'Tejido no tejido', gender: null,
      certification: 'CE', safety_standard: 'EN 149', serial_number: null,
      expiration_date: '2027-12-01'
    },

    created_at: NOW, updated_at: NOW,
  },

  {
    id: 'inv_000082', name: 'Chaquetón Invierno', description: 'Chaquetón térmico invierno',
    category: 'clothing', subtype_id: 'ist-5', status_id: 'rs-1', quantity: 15, min_stock: 5, unit: 'unidades',
    city_id: 'ci_000001', work_center_id: 'wc_000009', location: 'Estante A-4',
    color: 'Verde-Amarilla', size: 'L', gender: 'Hombre',
    assigned_to: null, notes: '',
    attributes: {
      material: 'Poliéster acolchado reflectante',
      certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
      expiration_date: null
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000083', name: 'Chaquetón Invierno', description: 'Chaquetón térmico invierno',
    category: 'clothing', subtype_id: 'ist-5', status_id: 'rs-1', quantity: 10, min_stock: 5, unit: 'unidades',
    city_id: 'ci_000002', work_center_id: 'wc_000021', location: 'Estante A-4',
    color: 'Verde-Amarilla', size: 'XL', gender: 'Hombre',
    assigned_to: null, notes: '',
    attributes: {
      material: 'Poliéster acolchado reflectante',
      certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
      expiration_date: null
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000084', name: 'Chaquetón Invierno', description: 'Chaquetón térmico invierno encargado',
    category: 'clothing', subtype_id: 'ist-5', status_id: 'rs-1', quantity: 5, min_stock: 3, unit: 'unidades',
    city_id: 'ci_000001', work_center_id: 'wc_000009', location: 'Estante A-4',
    color: 'Azul', size: 'L', gender: 'Hombre',
    assigned_to: null, notes: '',
    attributes: {
      material: 'Poliéster acolchado',
      certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
      expiration_date: null
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000085', name: 'Gorra', description: 'Gorra de trabajo reflectante',
    category: 'clothing', subtype_id: 'ist-6', status_id: 'rs-1', quantity: 50, min_stock: 10, unit: 'unidades',
    city_id: 'ci_000001', work_center_id: 'wc_000009', location: 'Estante B-3',
    color: 'Verde-Amarilla', size: 'ESTÁNDAR', gender: 'Unisex',
    assigned_to: null, notes: '',
    attributes: {
      material: 'Algodón/Poliéster reflectante',
      certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
      expiration_date: null
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000086', name: 'Gorra', description: 'Gorra de trabajo encargado',
    category: 'clothing', subtype_id: 'ist-6', status_id: 'rs-1', quantity: 10, min_stock: 5, unit: 'unidades',
    city_id: 'ci_000001', work_center_id: 'wc_000009', location: 'Estante B-3',
    color: 'Azul', size: 'ESTÁNDAR', gender: 'Unisex',
    assigned_to: null, notes: '',
    attributes: {
      material: 'Algodón/Poliéster',
      certification: null, safety_standard: null, serial_number: null, brand: null, model: null,
      expiration_date: null
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000087', name: 'Zapatos Verano', description: 'Zapatos de seguridad verano',
    category: 'clothing', subtype_id: 'ist-7', status_id: 'rs-1', quantity: 20, min_stock: 10, unit: 'pares',
    city_id: 'ci_000001', work_center_id: 'wc_000009', location: 'Estante C-1',
    color: 'Verde-Amarilla', size: '42', gender: 'Hombre',
    assigned_to: null, notes: '',
    attributes: {
      material: 'Cuero/Poliéster reflectante',
      certification: 'CE', safety_standard: 'EN ISO 20345', serial_number: null, brand: null, model: null,
      expiration_date: null
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000088', name: 'Zapatos Invierno', description: 'Zapatos de seguridad invierno',
    category: 'clothing', subtype_id: 'ist-7', status_id: 'rs-1', quantity: 15, min_stock: 10, unit: 'pares',
    city_id: 'ci_000002', work_center_id: 'wc_000021', location: 'Estante C-1',
    color: 'Verde-Amarilla', size: '43', gender: 'Hombre',
    assigned_to: null, notes: '',
    attributes: {
      material: 'Cuero forro térmico reflectante',
      certification: 'CE', safety_standard: 'EN ISO 20345', serial_number: null, brand: null, model: null,
      expiration_date: null
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000089', name: 'Zapatos Verano', description: 'Zapatos de seguridad verano encargado',
    category: 'clothing', subtype_id: 'ist-7', status_id: 'rs-1', quantity: 8, min_stock: 5, unit: 'pares',
    city_id: 'ci_000001', work_center_id: 'wc_000009', location: 'Estante C-1',
    color: 'Azul', size: '42', gender: 'Hombre',
    assigned_to: null, notes: '',
    attributes: {
      material: 'Cuero',
      certification: 'CE', safety_standard: 'EN ISO 20345', serial_number: null, brand: null, model: null,
      expiration_date: null
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000090', name: 'Botas Invierno', description: 'Botas de seguridad invierno',
    category: 'clothing', subtype_id: 'ist-8', status_id: 'rs-1', quantity: 12, min_stock: 5, unit: 'pares',
    city_id: 'ci_000001', work_center_id: 'wc_000009', location: 'Estante C-2',
    color: 'Verde-Amarilla', size: '42', gender: 'Hombre',
    assigned_to: null, notes: '',
    attributes: {
      material: 'Cuero forro térmico reflectante',
      certification: 'CE', safety_standard: 'EN ISO 20345', serial_number: null, brand: null, model: null,
      expiration_date: null
    },

    created_at: NOW, updated_at: NOW,
  },
  {
    id: 'inv_000091', name: 'Botas Invierno', description: 'Botas de seguridad invierno encargado',
    category: 'clothing', subtype_id: 'ist-8', status_id: 'rs-1', quantity: 6, min_stock: 3, unit: 'pares',
    city_id: 'ci_000002', work_center_id: 'wc_000021', location: 'Estante C-2',
    color: 'Azul', size: '42', gender: 'Hombre',
    assigned_to: null, notes: '',
    attributes: {
      material: 'Cuero forro térmico',
      certification: 'CE', safety_standard: 'EN ISO 20345', serial_number: null, brand: null, model: null,
      expiration_date: null
    },

    created_at: NOW, updated_at: NOW,
  },
];

