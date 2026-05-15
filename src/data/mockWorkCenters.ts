import { WorkCenter } from '../types';

const NOW = '2024-01-01T00:00:00Z';

export const INITIAL_WORK_CENTERS: WorkCenter[] = [
  { id: 'wc-1', name: 'Nave', address: 'Calle Industria 42', city_id: 'city-1', status: 'ACTIVE', created_at: NOW, updated_at: NOW },
  { id: 'wc-2', name: 'Puerta Madrid', address: 'Av. Puerta de Madrid 15', city_id: 'city-1', status: 'ACTIVE', created_at: NOW, updated_at: NOW },
  { id: 'wc-3', name: 'Gilitos', address: 'Polígono Gilitos 8', city_id: 'city-1', status: 'ACTIVE', created_at: NOW, updated_at: NOW },
  { id: 'wc-4', name: 'Moreras', address: 'Calle Moreras 3', city_id: 'city-1', status: 'ACTIVE', created_at: NOW, updated_at: NOW },
  { id: 'wc-5', name: 'Garena', address: 'Av. Garena 22', city_id: 'city-1', status: 'ACTIVE', created_at: NOW, updated_at: NOW },
  { id: 'wc-6', name: 'Divino Valles', address: 'Calle Divino Valles 7', city_id: 'city-1', status: 'ACTIVE', created_at: NOW, updated_at: NOW },
  { id: 'wc-7', name: 'Taller', address: 'Polígono Industrial 12', city_id: 'city-1', status: 'ACTIVE', created_at: NOW, updated_at: NOW },
  { id: 'wc-8', name: 'Oficinas', address: 'Calle Administración 1', city_id: 'city-1', status: 'ACTIVE', created_at: NOW, updated_at: NOW },
  { id: 'wc-9', name: 'Almacén', address: 'Av. Logística 55', city_id: 'city-1', status: 'ACTIVE', created_at: NOW, updated_at: NOW },

  { id: 'wc-11', name: 'Centro01', address: 'Av. Henares 100', city_id: 'city-2', status: 'ACTIVE', created_at: NOW, updated_at: NOW },
  { id: 'wc-12', name: 'Centro02', address: 'Calle Innovación 5', city_id: 'city-2', status: 'ACTIVE', created_at: NOW, updated_at: NOW },
  { id: 'wc-13', name: 'Centro03', address: 'Polígono Industrial 3', city_id: 'city-2', status: 'ACTIVE', created_at: NOW, updated_at: NOW },
  { id: 'wc-14', name: 'Centro04', address: 'Av. Estación 12', city_id: 'city-2', status: 'ACTIVE', created_at: NOW, updated_at: NOW },
  { id: 'wc-15', name: 'Centro05', address: 'Plaza Mayor 1', city_id: 'city-2', status: 'ACTIVE', created_at: NOW, updated_at: NOW },
  { id: 'wc-16', name: 'Centro06', address: 'Paseo Estación 45', city_id: 'city-2', status: 'ACTIVE', created_at: NOW, updated_at: NOW },
  { id: 'wc-17', name: 'Centro07', address: 'Av. Deporte 22', city_id: 'city-2', status: 'INACTIVE', created_at: NOW, updated_at: NOW },
  { id: 'wc-18', name: 'Centro08', address: 'Calle Comercio 8', city_id: 'city-2', status: 'ACTIVE', created_at: NOW, updated_at: NOW },
  { id: 'wc-19', name: 'Centro09', address: 'Calle Norte 33', city_id: 'city-2', status: 'ACTIVE', created_at: NOW, updated_at: NOW },
  { id: 'wc-20', name: 'Centro10', address: 'Calle Clavín 17', city_id: 'city-2', status: 'INACTIVE', created_at: NOW, updated_at: NOW },
  { id: 'wc-21', name: 'Almacén Sur', address: 'Polígono Industrial Sur 1', city_id: 'city-2', status: 'ACTIVE', created_at: NOW, updated_at: NOW },
];

export const INITIAL_WORK_CENTER_STATUSES = ['ACTIVE', 'INACTIVE'] as const;
