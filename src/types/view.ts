export type DashboardViewType =
  | 'USER_DASHBOARD' | 'USERS_CRUD'
  | 'EMPLOYEES_CRUD' | 'EMPLOYEE_DASHBOARD' | 'EMPLOYEE_DETAIL'
  | 'VEHICLES_CRUD' | 'VEHICLE_DASHBOARD' | 'VEHICLE_DETAIL'
  | 'WORK_CENTERS_CRUD' | 'WORK_CENTERS_DASHBOARD'
  | 'SERVICES_CRUD' | 'SERVICES_DASHBOARD' | 'SERVICE_DETAIL'
  | 'INVENTORY_CRUD' | 'INVENTORY_DASHBOARD'
  | 'MACHINERY_CRUD' | 'MACHINERY_DASHBOARD'
  | 'SERVICE_REPORT'
  | 'WORK_REPORT'
  | 'PROFILE' | 'PROFILE_CONFIG';

export const VIEW_ROLES: Record<DashboardViewType, string[]> = {
  USER_DASHBOARD: ['root'],
  USERS_CRUD: ['root'],
  EMPLOYEES_CRUD: ['root', 'admin'],
  EMPLOYEE_DASHBOARD: ['root', 'admin', 'manager'],
  EMPLOYEE_DETAIL: ['root', 'admin'],
  VEHICLES_CRUD: ['root', 'admin'],
  VEHICLE_DASHBOARD: ['root', 'admin', 'manager'],
  VEHICLE_DETAIL: ['root', 'admin'],
  WORK_CENTERS_CRUD: ['root', 'admin'],
  WORK_CENTERS_DASHBOARD: ['root', 'admin', 'manager'],
  SERVICES_CRUD: ['root', 'admin'],
  SERVICES_DASHBOARD: ['root', 'admin', 'manager'],
  SERVICE_DETAIL: ['root', 'admin'],
  INVENTORY_CRUD: ['root', 'admin'],
  INVENTORY_DASHBOARD: ['root', 'admin', 'manager'],
  MACHINERY_CRUD: ['root', 'admin'],
  MACHINERY_DASHBOARD: ['root', 'admin'],
  SERVICE_REPORT: ['root', 'manager'],
  WORK_REPORT: ['root', 'admin', 'manager', 'user'],
  PROFILE: ['root', 'admin', 'manager', 'user'],
  PROFILE_CONFIG: ['root', 'admin', 'manager', 'user'],

};
