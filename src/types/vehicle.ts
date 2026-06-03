export type VehicleType = 'BARREDORA' | 'CAMION' | 'FURGONETA' | 'TURISMO' | 'PORTER';

export interface VehicleTypeOption {
  id: string;
  name: string;
  category: VehicleType;
}

export type VehicleStatus = 'ACTIVE' | 'MAINTENANCE' | 'BROKEN' | 'RETIRED';

export type FuelType = 'DIESEL' | 'PETROL' | 'ELECTRIC' | 'LPG';

export interface Vehicle {
  id: string;
  license_plate: string;
  model: string;
  brand: string;
  vehicle_type_id: string;
  status: VehicleStatus;
  
  vin: string;
  registration_date: string;
  itv_expiration: string;
  insurance_expiration: string;
  tax_expiration: string;
  
  fuel_type: FuelType;
  kilometers: number;
  last_review_date: string | null;
  next_review_kilometers: number | null;
  
  work_center_id: string;
  assigned_employee_id: string | null;
  
  observations: string;
  created_at: string;
  updated_at: string;
}

export interface VehicleOverview {
  id: string;
  license_plate: string;
  model: string;
  brand: string;
  vehicle_type_id: string;
  status: VehicleStatus;
  work_center_id: string;
  kilometers: number;
}