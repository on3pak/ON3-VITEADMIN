export type TaskStatus = 'PENDING' | 'COMPLETED';

export interface ServiceTask {
  id: string;
  service_id: string;
  day_index: number;
  task_index: number;
  description: string;
  status: TaskStatus;
  zone: string | null;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  work_center_id: string;
  shift_id: string;
  name: string;
  category: string;
  required_employees: number;
  tasks: ServiceTask[];
  week_start: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceOverview {
  id: string;
  work_center_id: string;
  shift_id: string;
  name: string;
  category: string;
  required_employees: number;
  totalTasks: number;
  completedTasks: number;
}
