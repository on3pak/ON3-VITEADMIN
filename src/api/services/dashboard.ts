import { api } from '../client';

export interface DashboardStats {
  employees: number;
  work_centers: number;
  vehicles: number;
  inventory_items: number;
  services: number;
  machinery: number;
  active_employees: number;
}

export const dashboardApi = {
  getStats: () =>
    api.get<DashboardStats>('/dashboard'),
};
