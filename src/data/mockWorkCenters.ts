import { WorkCenter } from '../types';

export const INITIAL_WORK_CENTERS: WorkCenter[] = [
  { id: 'wc-1', name: 'Nave', address: 'Calle Industria 42', cityId: 'city-1', status: 'ACTIVE' },
  { id: 'wc-2', name: 'Puerta Madrid', address: 'Av. Puerta de Madrid 15', cityId: 'city-1', status: 'ACTIVE' },
  { id: 'wc-3', name: 'Gilitos', address: 'Polígono Gilitos 8', cityId: 'city-1', status: 'ACTIVE' },
  { id: 'wc-4', name: 'Moreras', address: 'Calle Moreras 3', cityId: 'city-1', status: 'ACTIVE' },
  { id: 'wc-5', name: 'Garena', address: 'Av. Garena 22', cityId: 'city-1', status: 'ACTIVE' },
  { id: 'wc-6', name: 'Divino Valles', address: 'Calle Divino Valles 7', cityId: 'city-1', status: 'ACTIVE' },
  { id: 'wc-7', name: 'Taller', address: 'Polígono Industrial 12', cityId: 'city-1', status: 'ACTIVE' },
  { id: 'wc-8', name: 'Oficinas', address: 'Calle Administración 1', cityId: 'city-1', status: 'ACTIVE' },
  { id: 'wc-9', name: 'Almacén', address: 'Av. Logística 55', cityId: 'city-1', status: 'INACTIVE' },

  { id: 'wc-11', name: 'Centro01', address: 'Av. Henares 100', cityId: 'city-2', status: 'ACTIVE' },
  { id: 'wc-12', name: 'Centro02', address: 'Calle Innovación 5', cityId: 'city-2', status: 'ACTIVE' },
  { id: 'wc-13', name: 'Centro03', address: 'Polígono Industrial 3', cityId: 'city-2', status: 'ACTIVE' },
  { id: 'wc-14', name: 'Centro04', address: 'Av. Estación 12', cityId: 'city-2', status: 'ACTIVE' },
  { id: 'wc-15', name: 'Centro05', address: 'Plaza Mayor 1', cityId: 'city-2', status: 'ACTIVE' },
  { id: 'wc-16', name: 'Centro06', address: 'Paseo Estación 45', cityId: 'city-2', status: 'ACTIVE' },
  { id: 'wc-17', name: 'Centro07', address: 'Av. Deporte 22', cityId: 'city-2', status: 'INACTIVE' },
  { id: 'wc-18', name: 'Centro08', address: 'Calle Comercio 8', cityId: 'city-2', status: 'ACTIVE' },
  { id: 'wc-19', name: 'Centro09', address: 'Calle Norte 33', cityId: 'city-2', status: 'ACTIVE' },
  { id: 'wc-20', name: 'Centro10', address: 'Calle Clavín 17', cityId: 'city-2', status: 'INACTIVE' },
];

export const INITIAL_WORK_CENTER_STATUSES = ['ACTIVE', 'INACTIVE'] as const;
