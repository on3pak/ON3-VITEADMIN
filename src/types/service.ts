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
  workCenterId: string;
  name: string;
  type: string;
  tasks: ServiceTask[];
  createdAt: string;
  updatedAt: string;
}

export interface ServiceOverview {
  id: string;
  workCenterId: string;
  name: string;
  type: string;
  totalTasks: number;
  completedTasks: number;
}
