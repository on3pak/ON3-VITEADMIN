import { api } from '../client';

interface DashboardStats {
  total_employees: number; active_employees: number; total_vehicles: number;
  active_vehicles: number; pending_vacations: number; pending_leave_requests: number;
  pending_service_reports: number; today_work_reports: number;
  recent_activity: Array<{ type: string; description: string; timestamp: string }>;
  work_center_stats: Array<{ work_center: string; employee_count: number }>;
}

const BASE = '/dashboard';

export const dashboardApi = {
  get: (params?: { date?: string }) =>
    api.get<DashboardStats>(BASE, params),
};
