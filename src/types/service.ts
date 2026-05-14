export type TaskStatus = 'PENDING' | 'COMPLETED';

export interface ServiceTask {
  id: string;
  dayIndex: number;
  taskIndex: number;
  description: string;
  status: TaskStatus;
}

export interface Service {
  id: string;
  work_center_id: string;
  name: string;
  type: string;
  tasks: ServiceTask[];
  created_at: string;
  updated_at: string;
}

export interface ServiceOverview {
  id: string;
  work_center_id: string;
  name: string;
  type: string;
  totalTasks: number;
  completedTasks: number;
}
