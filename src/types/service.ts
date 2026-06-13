export type TaskStatus = 'pending' | 'completed';

export interface StaffRequirement {
  oficial: string | null;
  peones: number;
}

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
  staff_requirement: StaffRequirement;
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
  staff_requirement: StaffRequirement;
  totalTasks: number;
  completedTasks: number;
}
