import { api } from '../client';

export interface DashboardStats {
  employees: number;
  work_centers: number;
  vehicles: number;
  inventory_items: number;
}

export const dashboardApi = {
  getStats: () =>
    api.get<DashboardStats>('/dashboard'),
};
