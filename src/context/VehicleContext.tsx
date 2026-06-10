import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Vehicle, VehicleOverview } from '../types';
import { vehiclesApi } from '../api/services';
import { getToken } from '../api/client';

interface VehicleContextType {
  vehicles: Vehicle[];
  loadVehicles: () => void;
  getVehicleOverviews: () => VehicleOverview[];
  getVehicleById: (id: string) => Vehicle | undefined;
  createVehicle: (data: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>) => Promise<{ success: boolean }>;
  updateVehicle: (id: string, data: Partial<Vehicle>) => Promise<{ success: boolean }>;
  deleteVehicle: (id: string) => Promise<void>;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export const VehicleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const loadVehicles = useCallback(() => {
    if (!getToken()) return;
    vehiclesApi.list()
      .then(async (res) => {
        const full = await Promise.all(
          res.data.map((o) => vehiclesApi.getById(o.id).catch(() => null))
        );
        setVehicles(full.filter(Boolean) as Vehicle[]);
      })
      .catch(() => {});
  }, []);

  const getVehicleOverviews = useCallback(() => {
    return vehicles.map((v) => ({
      id: v.id,
      license_plate: v.license_plate,
      model: v.model,
      brand: v.brand,
      vehicle_type_id: v.vehicle_type_id,
      status: v.status,
      work_center_id: v.work_center_id,
      kilometers: v.kilometers,
      hour_meter: v.hour_meter,
    }));
  }, [vehicles]);

  const getVehicleById = useCallback((id: string) => {
    return vehicles.find((v) => v.id === id);
  }, [vehicles]);

  const createVehicle = useCallback(async (data: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const created = await vehiclesApi.create(data);
      setVehicles((prev) => [created, ...prev]);
      return { success: true };
    } catch {
      return { success: false };
    }
  }, []);

  const updateVehicle = useCallback(async (id: string, data: Partial<Vehicle>) => {
    try {
      const updated = await vehiclesApi.update(id, data);
      setVehicles((prev) => prev.map((v) => v.id === id ? updated : v));
      return { success: true };
    } catch {
      return { success: false };
    }
  }, []);

  const deleteVehicle = useCallback(async (id: string) => {
    try {
      await vehiclesApi.delete(id);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
    } catch { /* ignore */ }
  }, []);

  return (
    <VehicleContext.Provider value={{ vehicles, loadVehicles, getVehicleOverviews, getVehicleById, createVehicle, updateVehicle, deleteVehicle }}>
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicles = () => {
  const context = useContext(VehicleContext);
  if (context === undefined) {
    throw new Error('useVehicles must be used within a VehicleProvider');
  }
  return context;
};
