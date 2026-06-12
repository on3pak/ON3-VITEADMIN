import { api } from '../client';

export interface AllLookups {
  cities: Array<{ id: string; name: string }>;
  work_centers: Array<{ id: string; name: string; city_id: string }>;
  employees: Array<{ id: string; full_name: string }>;
  employee_categories: Array<{ id: string; name: string }>;
  contract_types: Array<{ id: string; name: string }>;
  shifts: Array<{ id: string; name: string }>;
  work_days: Array<{ id: string; name: string }>;
  vehicle_types: Array<{ id: string; name: string }>;
}

export const lookupsApi = {
  cities: () =>
    api.get<Array<{ id: string; name: string }>>('/lookups/cities'),
  workCenters: () =>
    api.get<Array<{ id: string; name: string }>>('/lookups/work_centers'),
  employees: () =>
    api.get<Array<{ id: string; full_name: string }>>('/lookups/employees'),
  getAll: () =>
    api.get<AllLookups>('/lookups'),
};
