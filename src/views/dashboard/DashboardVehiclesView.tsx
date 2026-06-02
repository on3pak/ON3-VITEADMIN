import React, { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useVehicles } from '../../context/VehicleContext';
import { INITIAL_WORK_CENTERS } from '../../data/mockWorkCenters';
import { INITIAL_VEHICLE_TYPES } from '../../data/mockVehicles';
import {
  Truck,
  Truck as TruckIcon,
  Wrench,
  AlertTriangle,
  TrendingUp,
  Clock,
  MapPin
} from 'lucide-react';

const wcCityMap = Object.fromEntries(
  INITIAL_WORK_CENTERS.map((wc) => [wc.id, wc.city_id])
);

const wcNameMap = Object.fromEntries(
  INITIAL_WORK_CENTERS.map((wc) => [wc.id, wc.name])
);

const vehicleTypeMap = Object.fromEntries(
  INITIAL_VEHICLE_TYPES.map((vt) => [vt.id, vt.type])
);

export const DashboardVehiclesView: React.FC = () => {
  const { user: loggedInUser } = useAuth();
  const { vehicles } = useVehicles();

  const userCityId = loggedInUser?.role === 'ROOT' ? undefined : loggedInUser?.city_id;

  const scopedVehicles = useMemo(
    () => userCityId ? vehicles.filter(v => wcCityMap[v.work_center_id] === userCityId) : vehicles,
    [vehicles, userCityId]
  );

  const activeVehicles = scopedVehicles.filter(v => v.status === 'ACTIVE');
  const maintenanceVehicles = scopedVehicles.filter(v => v.status === 'MAINTENANCE');
  const brokenVehicles = scopedVehicles.filter(v => v.status === 'BROKEN');
  const inactiveVehicles = scopedVehicles.filter(v => v.status === 'RETIRED');
  const totalVehicles = scopedVehicles.length;
  const activeRate = totalVehicles > 0 ? (activeVehicles.length / totalVehicles) * 100 : 0;

  const getVehicleType = (typeId: string) => vehicleTypeMap[typeId] || typeId;
  const countByType = (typeId: string) => scopedVehicles.filter(v => v.vehicle_type_id === typeId).length;
  const countByWorkCenter = (centerId: string) => scopedVehicles.filter(v => v.work_center_id === centerId).length;
  const countByStatus = (status: string) => scopedVehicles.filter(v => v.status === status).length;

  const totalKilometers = scopedVehicles.reduce((acc, v) => acc + v.kilometers, 0);
  const avgKilometers = totalVehicles > 0 ? totalKilometers / totalVehicles : 0;

  const uniqueTypeIds = [...new Set(scopedVehicles.map(v => v.vehicle_type_id))];

  const typeStats = uniqueTypeIds.map(typeId => {
    const type = getVehicleType(typeId);
    return {
    typeId,
    type,
    count: countByType(typeId),
    color: type === 'BARREDORA' ? 'bg-violet-600'
      : type === 'CAMION' ? 'bg-blue-600'
      : type === 'FURGONETA' ? 'bg-cyan-600'
      : type === 'TURISMO' ? 'bg-emerald-600'
      : 'bg-amber-600'
    };
  });

  const uniqueWorkCenterIds = [...new Set(scopedVehicles.map(v => v.work_center_id))];
  const workCenterStats = uniqueWorkCenterIds.slice(0, 5).map(centerId => ({
    centerId,
    center: wcNameMap[centerId] || centerId,
    count: countByWorkCenter(centerId)
  }));

  const statusStats = [
    { status: 'ACTIVE', label: 'Activos', count: countByStatus('ACTIVE'), color: 'emerald' },
    { status: 'MAINTENANCE', label: 'En Taller', count: countByStatus('MAINTENANCE'), color: 'amber' },
    { status: 'BROKEN', label: 'Averiados', count: countByStatus('BROKEN'), color: 'rose' },
    { status: 'RETIRED', label: 'Baja', count: countByStatus('RETIRED'), color: 'slate' },
  ];

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'BARREDORA': 'Barredora',
      'CAMION': 'Camión',
      'FURGONETA': 'Furgoneta',
      'TURISMO': 'Turismo',
      'PORTER': 'Porter',
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-app-text">Vehículos</h2>
        <p className="text-sm text-app-text-secondary mt-1">Resumen de flota vehicular</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-app-card p-5 rounded-2xl border border-app-card-border shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary-50">
              <TruckIcon className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <p className="text-xs text-app-text-secondary font-medium">Total Flota</p>
              <p className="text-xl font-bold text-app-text">{totalVehicles}</p>
            </div>
          </div>
        </div>

        <div className="bg-app-card p-5 rounded-2xl border border-app-card-border shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50">
              <Truck className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-app-text-secondary font-medium">Activos</p>
              <p className="text-xl font-bold text-app-text">{activeVehicles.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-app-card p-5 rounded-2xl border border-app-card-border shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50">
              <Wrench className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-app-text-secondary font-medium">En Taller</p>
              <p className="text-xl font-bold text-app-text">{maintenanceVehicles.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-app-card p-5 rounded-2xl border border-app-card-border shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-50">
              <AlertTriangle className="h-5 w-5 text-rose-600" />
            </div>
            <div>
              <p className="text-xs text-app-text-secondary font-medium">Averiados</p>
              <p className="text-xl font-bold text-app-text">{brokenVehicles.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-app-card rounded-2xl border border-app-card-border shadow-xs overflow-hidden">
          <div className="p-5 border-b border-app-border">
            <h3 className="font-semibold text-app-text">Estado de Flota</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 gap-4">
              {statusStats.map((stat) => (
                <div key={stat.status} className="flex items-center justify-between p-4 bg-app-bg rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full bg-${stat.color}-500`} />
                    <span className="text-sm font-medium text-app-text">{stat.label}</span>
                  </div>
                  <span className="text-lg font-bold text-app-text">{stat.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-5 border-t border-app-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <span className="text-sm text-app-text-secondary">Tasa de Actividad</span>
              </div>
              <span className="text-lg font-bold text-emerald-600">{activeRate.toFixed(0)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-app-card rounded-2xl border border-app-card-border shadow-xs overflow-hidden">
          <div className="p-5 border-b border-app-border">
            <h3 className="font-semibold text-app-text">Tipos de Vehículo</h3>
          </div>
          <div className="p-5 space-y-3">
            {typeStats.map((stat) => (
              <div key={stat.type} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${stat.color}`} />
                  <span className="text-sm text-app-text-secondary">{getTypeLabel(stat.type)}</span>
                </div>
                <span className="text-sm font-semibold text-app-text">{stat.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-app-card rounded-2xl border border-app-card-border shadow-xs overflow-hidden">
          <div className="p-5 border-b border-app-border">
            <h3 className="font-semibold text-app-text">Kilómetros Totales</h3>
          </div>
          <div className="p-5">
            <div className="text-3xl font-bold text-app-text">
              {totalKilometers.toLocaleString()} <span className="text-lg font-medium text-app-text-secondary">km</span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-app-text-secondary">
              <Clock className="h-4 w-4" />
              <span>Promedio: {avgKilometers.toLocaleString()} km/vehículo</span>
            </div>
          </div>
        </div>

        <div className="bg-app-card rounded-2xl border border-app-card-border shadow-xs overflow-hidden">
          <div className="p-5 border-b border-app-border">
            <h3 className="font-semibold text-app-text">Por Centro de Trabajo</h3>
          </div>
          <div className="p-5 space-y-3">
            {workCenterStats.map((stat) => (
              <div key={stat.center} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-app-text-secondary" />
                  <span className="text-sm text-app-text-secondary">{wcNameMap[stat.center] || stat.center}</span>
                </div>
                <span className="text-sm font-semibold text-app-text">{stat.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
