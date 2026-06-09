export type MachineryStatusId = 'ms-1' | 'ms-2' | 'ms-3' | 'ms-4';

export interface MachineryStatus {
  id: MachineryStatusId;
  name: string;
}

export interface MachinerySubtype {
  id: string;
  name: string;
}

export interface MachineryItem {
  id: string;
  name: string;
  description: string;
  subtype_id: string;
  status_id: MachineryStatusId;
  quantity: number;
  min_stock: number;
  unit: string;
  city_id: string;
  work_center_id: string;
  location: string;
  brand: string | null;
  model: string | null;
  serial_number: string | null;
  warranty_expiration: string | null;
  last_maintenance: string | null;
  next_maintenance: string | null;
  assigned_to: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface MachineryOverview {
  id: string;
  name: string;
  subtype_id: string;
  status_id: MachineryStatusId;
  quantity: number;
  min_stock: number;
  unit: string;
  city_id: string;
  work_center_id: string;
  location: string;
}
