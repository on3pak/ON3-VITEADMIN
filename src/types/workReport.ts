export type WorkReportStatus = 'DRAFT' | 'CONFIRMED';

export interface TaskCompletion {
  task_id: string;
  completed: boolean;
}

export interface WorkServiceEntry {
  service_id: string;
  tasks: TaskCompletion[];
}

export interface WorkReport {
  id: string;
  employee_id: string;
  date: string;
  status: WorkReportStatus;
  services: WorkServiceEntry[];
  vehicle_id?: string;
  km_start?: number;
  km_end?: number;
  hour_meter_start?: number;
  hour_meter_end?: number;
  fuel_liters?: number;
  vehicle_breakdown_type?: string;
  vehicle_breakdown_notes?: string;
  replacement_vehicle_id?: string;
  replacement_km_start?: number;
  replacement_km_end?: number;
  replacement_hour_meter_start?: number;
  replacement_hour_meter_end?: number;
  replacement_fuel_liters?: number;
  tools: string[];
  machinery_breakdowns?: Record<string, { type: string; notes?: string }>;
  notes?: string;
  created_at: string;
  updated_at: string;
}
