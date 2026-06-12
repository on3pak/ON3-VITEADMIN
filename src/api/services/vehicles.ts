import { api } from '../client';
import type { Vehicle } from '../../types';

export interface VehicleDetail extends Vehicle {
  vehicle_type: { id: string; name: string } | null;
  work_center: { id: string; name: string } | null;
  services: Array<{ id: string; name: string }>;
}

const BASE = '/vehicles';

export const vehiclesApi = {
  list: (params?: { page?: number; limit?: number }) =>
    api.getList<Vehicle>(BASE, params),
  getById: (id: string) =>
    api.getById<Vehicle>(BASE, id),
  getDetail: (id: string) =>
    api.get<VehicleDetail>(`${BASE}/${id}/detail`),
  create: (body: Partial<Vehicle>) =>
    api.post<Vehicle>(BASE, body),
  update: (id: string, body: Partial<Vehicle>) =>
    api.patch<Vehicle>(BASE, id, body),
  delete: (id: string) =>
    api.delete(BASE, id),
};
