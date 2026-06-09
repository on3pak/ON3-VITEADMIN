export type InventoryCategory = 'CLOTHING' | 'PPE';

export interface InventoryCategoryOption {
  id: string;
  name: string;
  value: InventoryCategory;
}

export interface InventoryStatus {
  id: string;
  name: string;
  category: InventoryCategory;
}

export interface InventorySubtype {
  id: string;
  category: InventoryCategory;
  name: string;
}

export interface InventoryAttributes {
  material?: string | null;
  certification?: string | null;
  safety_standard?: string | null;
  serial_number?: string | null;
  expiration_date?: string | null;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  category: InventoryCategory;
  subtype_id: string;
  status_id: string;
  quantity: number;
  min_stock: number;
  unit: string;
  city_id: string;
  work_center_id: string;
  location: string;
  color: string | null;
  size: string | null;
  gender: string | null;
  assigned_to: string | null;
  notes: string;
  attributes: InventoryAttributes;
  created_at: string;
  updated_at: string;
}

export interface InventoryOverview {
  id: string;
  name: string;
  category: InventoryCategory;
  subtype_id: string;
  status_id: string;
  quantity: number;
  min_stock: number;
  unit: string;
  city_id: string;
  work_center_id: string;
  location: string;
}
