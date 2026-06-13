export type VacationMonth = 'JULIO' | 'AGOSTO' | 'SEPTIEMBRE' | 'SPLIT';

export type ClothingSize = 'XXS' | 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export type ShoeSize = 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46;

export interface ClothingSizes {
  summer_shirt: ClothingSize | null;
  winter_shirt: ClothingSize | null;
  summer_pants: ClothingSize | null;
  winter_pants: ClothingSize | null;
  summer_jacket: ClothingSize | null;
  winter_jacket: ClothingSize | null;
  winter_coat: ClothingSize | null;
  cap: 'ESTANDAR' | null;
  summer_shoe: ShoeSize | null;
  winter_shoe: ShoeSize | null;
}

export interface VacationRequest {
  id: string;
  employee_id: string;
  type: 'MONTH_CHANGE' | 'FREE_DAYS' | 'VACATION_CHANGE';
  status: 'pending' | 'approved' | 'rejected';
  requested_month?: VacationMonth;
  requested_days?: string[];
  notes?: string;
  created_at: string;
  resolved_at?: string;
}

export interface Employee {
  id: string;
  city_id: string | null;
  name: string;
  last_name1: string;
  last_name2: string;
  email: string;
  phone: string;
  category_id: string;
  status_id: string;
  work_center_id: string;
  active: boolean;
  shift_id: string;
  start_time: string;
  end_time: string;
  vacation_month: VacationMonth | null;
  vacation_days: number;
  own_days: number;
  accumulated_days: number;
  excess_days: number;
  created_at: string;
  updated_at: string;
  personal_email: string;
  phone_fixed: string;
  work_day_id: string;
  iban: string;
  lockers: string[];
  clothing_sizes: ClothingSizes | null;
  medical_check: boolean;
  vaccinated: boolean;
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
  last_name1: string;
  last_name2: string;
  category_id: string;
  work_day_id: string;
  work_center_id: string;
  status_id: string;
  status_name: string;
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