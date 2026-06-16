export type VacationMonth = 'JULIO' | 'AGOSTO' | 'SEPTIEMBRE' | 'split';

export type ClothingSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';

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
  type: 'month_change' | 'free_days' | 'vacation_change';
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
  vacation_year: number | null;
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
  works_holidays: boolean;
  vaccinated: boolean;
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
  shift_id: string;
  work_center_id: string;
  status_id: string;
  status_name: string;
  city_id: string | null;
}

export type ArticleType = 'shirt' | 'pants' | 'jacket' | 'coat' | 'cap' | 'shoe';

export interface EmployeeSize {
  id?: string;
  employee_id?: string;
  article_type: ArticleType;
  size: string;
}

export interface EmployeeSchedule {
  id?: string;
  employee_id?: string;
  shift_id: string;
  start_time: string;
  end_time: string;
  work_day_id: string;
}

export interface EmployeeContract {
  id?: string;
  employee_id?: string;
  contract_type: string;
  contract_start_date: string;
  contract_end_date: string | null;
  vacation_month: VacationMonth | null;
  vacation_year: number | null;
}

export interface EmployeePayroll {
  id?: string;
  employee_id?: string;
  social_security_number?: string;
  dni?: string;
  iban: string;
  irpf: number;
}

export interface EmployeeExtras {
  id?: string;
  employee_id?: string;
  lockers: string[];
  works_holidays: boolean;
  medical_check: boolean;
  vaccinated: boolean;
}

export interface EmployeeLeaveBalance {
  id?: string;
  employee_id?: string;
  year: number;
  vacation_days: number;
  own_days: number;
  accumulated_days: number;
  excess_days: number;
}

export type SpanishLicenseType = 'am' | 'a1' | 'a2' | 'a' | 'b' | 'be' | 'c1' | 'c1e' | 'c' | 'ce' | 'd1' | 'd1e' | 'd' | 'de';

export interface EmployeeDrivingLicense {
  id?: string;
  employee_id?: string;
  license_type: SpanishLicenseType;
  has_license: boolean;
  start_date?: string;
  expiry_date?: string;
  notes?: string;
  file_url?: string;
}

export interface EmployeeDocument {
  id?: string;
  employee_id?: string;
  document_type: 'dni' | 'driving_license';
  document_number?: string;
  file_url: string;
  file_name: string;
  mime_type: string;
  file_size: number;
  notes?: string;
  start_date?: string;
  expiry_date?: string;
}

export interface LeaveRequest {
  id: string;
  employee_id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  status: 'pending' | 'approved' | 'rejected';
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface EmployeeDetail extends Employee {
  city?: { id: string; name: string } | null;
  work_center?: { id: string; name: string } | null;
  category?: { id: string; name: string } | null;
  shift?: { id: string; name: string } | null;
  contract_type?: { id: string; name: string } | null;
  schedule?: EmployeeSchedule | null;
  contract?: EmployeeContract | null;
  payroll?: EmployeePayroll | null;
  extras?: EmployeeExtras | null;
  leave_balances?: EmployeeLeaveBalance[];
  sizes?: EmployeeSize[];
  driving_licenses?: EmployeeDrivingLicense[];
  documents?: EmployeeDocument[];
  vacations?: VacationRequest[];
  leave_requests?: LeaveRequest[];
  clothing?: any[];
  advances?: any[];
  loans?: any[];
  social_fund?: any[];
  sabbaticals?: any[];
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
