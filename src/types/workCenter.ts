export interface WorkCenter {
  id: string;
  name: string;
  address: string;
  cityId: string;
  status: 'ACTIVE' | 'INACTIVE';
}
