export type ReportType = 'PREVIO' | 'DIARIO';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'JUSTIFIED_ABSENCE';

export interface ServiceAssignment {
  id: string;
  work_center_id: string;
  shift_id: string;
  employee_id: string;
  service_id: string;
  vehicle_id?: string;
  note?: string;
}

export interface EmployeeAttendance {
  employee_id: string;
  status: AttendanceStatus;
  note?: string;
}

export interface ServiceReport {
  id: string;
  date: string;
  type: ReportType;
  city_id: string;
  status: 'DRAFT' | 'CONFIRMED';
  assignments: ServiceAssignment[];
  attendance: EmployeeAttendance[];
  created_at: string;
  updated_at: string;
}
