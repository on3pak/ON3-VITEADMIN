import { WorkCenter } from '../types';

const NOW = '2024-01-01T00:00:00Z';

export const INITIAL_WORK_CENTERS: WorkCenter[] = [
  { id: 'wc_000001', name: 'Nave', address: 'Calle Industria 42', city_id: 'ci_000001', status: 'ACTIVE', created_at: NOW, updated_at: NOW },
  { id: 'wc_000002', name: 'Puerta Madrid', address: 'Av. Puerta de Madrid 15', city_id: 'ci_000001', status: 'ACTIVE', created_at: NOW, updated_at: NOW },
  { id: 'wc_000003', name: 'Gilitos', address: 'Polígono Gilitos 8', city_id: 'ci_000001', status: 'ACTIVE', created_at: NOW, updated_at: NOW },
  { id: 'wc_000004', name: 'Moreras', address: 'Calle Moreras 3', city_id: 'ci_000001', status: 'ACTIVE', created_at: NOW, updated_at: NOW },
  { id: 'wc_000005', name: 'Garena', address: 'Av. Garena 22', city_id: 'ci_000001', status: 'ACTIVE', created_at: NOW, updated_at: NOW },
  { id: 'wc_000006', name: 'Divino Valles', address: 'Calle Divino Valles 7', city_id: 'ci_000001', status: 'ACTIVE', created_at: NOW, updated_at: NOW },
  { id: 'wc_000007', name: 'Taller', address: 'Polígono Industrial 12', city_id: 'ci_000001', status: 'ACTIVE', created_at: NOW, updated_at: NOW },
  { id: 'wc_000008', name: 'Oficinas', address: 'Calle Administración 1', city_id: 'ci_000001', status: 'ACTIVE', created_at: NOW, updated_at: NOW },
  { id: 'wc_000009', name: 'Almacén', address: 'Av. Logística 55', city_id: 'ci_000001', status: 'ACTIVE', created_at: NOW, updated_at: NOW },

  { id: 'wc_000011', name: 'Centro01', address: 'Av. Henares 100', city_id: 'ci_000002', status: 'ACTIVE', created_at: NOW, updated_at: NOW },
  { id: 'wc_000012', name: 'Centro02', address: 'Calle Innovación 5', city_id: 'ci_000002', status: 'ACTIVE', created_at: NOW, updated_at: NOW },
  { id: 'wc_000013', name: 'Centro03', address: 'Polígono Industrial 3', city_id: 'ci_000002', status: 'ACTIVE', created_at: NOW, updated_at: NOW },
  { id: 'wc_000014', name: 'Centro04', address: 'Av. Estación 12', city_id: 'ci_000002', status: 'ACTIVE', created_at: NOW, updated_at: NOW },
  { id: 'wc_000015', name: 'Centro05', address: 'Plaza Mayor 1', city_id: 'ci_000002', status: 'ACTIVE', created_at: NOW, updated_at: NOW },
  { id: 'wc_000016', name: 'Centro06', address: 'Paseo Estación 45', city_id: 'ci_000002', status: 'ACTIVE', created_at: NOW, updated_at: NOW },
  { id: 'wc_000017', name: 'Centro07', address: 'Av. Deporte 22', city_id: 'ci_000002', status: 'INACTIVE', created_at: NOW, updated_at: NOW },
  { id: 'wc_000018', name: 'Centro08', address: 'Calle Comercio 8', city_id: 'ci_000002', status: 'ACTIVE', created_at: NOW, updated_at: NOW },
  { id: 'wc_000019', name: 'Centro09', address: 'Calle Norte 33', city_id: 'ci_000002', status: 'ACTIVE', created_at: NOW, updated_at: NOW },
  { id: 'wc_000020', name: 'Centro10', address: 'Calle Clavín 17', city_id: 'ci_000002', status: 'INACTIVE', created_at: NOW, updated_at: NOW },
  { id: 'wc_000021', name: 'Almacén Sur', address: 'Polígono Industrial Sur 1', city_id: 'ci_000002', status: 'ACTIVE', created_at: NOW, updated_at: NOW },
];

export const INITIAL_WORK_CENTER_STATUSES = ['ACTIVE', 'INACTIVE'] as const;
