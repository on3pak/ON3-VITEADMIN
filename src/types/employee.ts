export type VacationMonth = 'julio' | 'agosto' | 'septiembre' | 'partidas';

export interface VacationRequest {
  id: string;
  employee_id: string;
  type: 'cambio_mes' | 'dias_libres' | 'cambio_vacaciones';
  status: 'pendiente' | 'aprobado' | 'rechazado';
  requested_month?: VacationMonth;
  requested_days?: string[];
  notes?: string;
  created_at: string;
  resolved_at?: string;
}

export interface Employee {
  id: string;
  user_id: string | null;
  city_id: string | null;
  name: string;
  lastName1: string;
  lastName2: string;
  email: string;
  phone: string;
  category_id: string;
  status_id: string;
  work_center_id: string;
  active: boolean;
  shift: string;
  schedule: string;
  start_time: string;
  end_time: string;
  vacation_month: VacationMonth | null;
  vacation_year: number | null;
  vacation_days: number;
  own_days: number;
  accumulated_days: number;
  excess_days: number;
  created_at: string;
  updated_at: string;
  personal_email: string;
  phone_fixed: string;
  work_day: string;
  iban: string;
  locker: string;
  medical_check: boolean;
  works_holidays: boolean;
  contract_type: string;
  contract_start_date: string;
  contract_end_date: string | null;
  irpf: number;
}

export interface EmployeeOverview {
  id: string;
  email: string;
  name: string;
  lastName1: string;
  lastName2: string;
  category_id: string;
  work_day_id: string;
  work_center_id: string;
  status_id: string;
  city_id: string | null;
}

export interface EmployeeCategory {
  id: string;
  name: string;
}

export interface EmployeeStatus {
  id: string;
  name: string;
}

export interface WorkDay {
  id: string;
  name: string;
}

export interface Shift {
  id: string;
  name: string;
}

export interface ContractType {
  id: string;
  name: string;
}