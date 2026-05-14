import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Vehicle, VehicleOverview } from '../types';
import { INITIAL_VEHICLES } from '../data/mockVehicles';
import { generateId } from '../utils/id';

interface VehicleContextType {
  vehicles: Vehicle[];
  getVehicleOverviews: () => VehicleOverview[];
  getVehicleById: (id: string) => Vehicle | undefined;
  createVehicle: (data: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>) => { success: boolean };
  updateVehicle: (id: string, data: Partial<Vehicle>) => { success: boolean };
  deleteVehicle: (id: string) => void;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export const VehicleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);

  const getVehicleOverviews = useCallback(() => {
    return vehicles.map((v) => ({
      id: v.id,
      licensePlate: v.licensePlate,
      model: v.model,
      brand: v.brand,
      vehicle_type_id: v.vehicle_type_id,
      status: v.status,
      work_center_id: v.work_center_id,
      kilometers: v.kilometers,
    }));
  }, [vehicles]);

  const getVehicleById = useCallback((id: string) => {
    return vehicles.find((v) => v.id === id);
  }, [vehicles]);

  const createVehicle = useCallback((data: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>) => {
    const now = new Date().toISOString();
    const newVehicle: Vehicle = {
      ...data,
      id: generateId('veh'),
      created_at: now,
      updated_at: now,
    };
    setVehicles((prev) => [newVehicle, ...prev]);
    return { success: true };
  }, []);

  const updateVehicle = useCallback((id: string, data: Partial<Vehicle>) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, ...data, updated_at: new Date().toISOString() } : v
      )
    );
    return { success: true };
  }, []);

  const deleteVehicle = useCallback((id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  }, []);

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        getVehicleOverviews,
        getVehicleById,
        createVehicle,
        updateVehicle,
        deleteVehicle,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicles = (): VehicleContextType => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error('useVehicles must be used within a VehicleProvider');
  }
  return context;
};
