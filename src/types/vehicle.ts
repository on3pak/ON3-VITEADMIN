export type VehicleType = 'BARREDORA' | 'CAMION' | 'FURGONETA' | 'TURISMO' | 'PORTER';

export interface VehicleTypeOption {
  id: string;
  name: string;
  type: VehicleType;
}

export type VehicleStatus = 'ACTIVO' | 'MANTENIMIENTO' | 'AVERIADO' | 'BAJA';

export type FuelType = 'DIESEL' | 'GASOLINA' | 'ELECTRICO' | 'GAS';

export interface Vehicle {
  id: string;
  licensePlate: string;
  model: string;
  brand: string;
  vehicleTypeId: string;
  vehicleType: VehicleType;
  status: VehicleStatus;
  
  vin: string;
  registrationDate: string;
  itvExpiration: string;
  insuranceExpiration: string;
  taxExpiration: string;
  
  fuelType: FuelType;
  kilometers: number;
  lastReviewDate: string;
  nextReviewKilometers: number;
  
  workCenter: string;
  assignedEmployee: string;
  
  observations: string;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleOverview {
  id: string;
  licensePlate: string;
  model: string;
  brand: string;
  vehicleTypeId: string;
  vehicleType: VehicleType;
  status: VehicleStatus;
  workCenter: string;
  kilometers: number;
}