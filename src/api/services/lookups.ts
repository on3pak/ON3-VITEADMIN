import { api } from '../client';

export const lookupsApi = {
  cities: () =>
    api.get<Array<{ id: string; name: string }>>('/lookups/cities'),
  workCenters: () =>
    api.get<Array<{ id: string; name: string }>>('/lookups/work_centers'),
  employees: () =>
    api.get<Array<{ id: string; full_name: string }>>('/lookups/employees'),
};
