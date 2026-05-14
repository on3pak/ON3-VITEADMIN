export interface WorkCenter {
  id: string;
  name: string;
  address: string;
  city_id: string;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
  updated_at: string;
}
