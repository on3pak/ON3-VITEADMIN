import React, { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useVehicles } from '../../context/VehicleContext';
import { INITIAL_WORK_CENTERS } from '../../data/mockWorkCenters';
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
  INITIAL_WORK_CENTERS.map((wc) => [wc.id, wc.cityId])
);

const wcNameMap = Object.fromEntries(
  INITIAL_WORK_CENTERS.map((wc) => [wc.id, wc.name])
);

export const DashboardVehiclesView: React.FC = () => {
  const { user: loggedInUser } = useAuth();
  const { vehicles } = useVehicles();

  const userCityId = loggedInUser?.role === 'ROOT' ? undefined : loggedInUser?.cityId;

  const scopedVehicles = useMemo(
    () => userCityId ? vehicles.filter(v => wcCityMap[v.workCenter] === userCityId) : vehicles,
    [vehicles, userCityId]
  );

  const activeVehicles = scopedVehicles.filter(v => v.status === 'ACTIVE');
  const maintenanceVehicles = scopedVehicles.filter(v => v.status === 'MAINTENANCE');
  const brokenVehicles = scopedVehicles.filter(v => v.status === 'AVERIADO');
  const inactiveVehicles = scopedVehicles.filter(v => v.status === 'BAJA');
  const totalVehicles = scopedVehicles.length;
  const activeRate = totalVehicles > 0 ? (activeVehicles.length / totalVehicles) * 100 : 0;

  const countByType = (type: string) => scopedVehicles.filter(v => v.vehicleType === type).length;
  const countByWorkCenter = (center: string) => scopedVehicles.filter(v => v.workCenter === center).length;
  const countByStatus = (status: string) => scopedVehicles.filter(v => v.status === status).length;

  const totalKilometers = scopedVehicles.reduce((acc, v) => acc + v.kilometers, 0);
  const avgKilometers = totalVehicles > 0 ? totalKilometers / totalVehicles : 0;

  const vehicleTypes = [...new Set(scopedVehicles.map(v => v.vehicleType))];
  const workCenters = [...new Set(scopedVehicles.map(v => v.workCenter))];

  const typeStats = vehicleTypes.map(type => ({
    type,
    count: countByType(type),
    color: type === 'BARREDORA' ? 'bg-violet-600'
      : type === 'CAMION' ? 'bg-blue-600'
      : type === 'FURGONETA' ? 'bg-cyan-600'
      : type === 'TURISMO' ? 'bg-emerald-600'
      : 'bg-amber-600'
  }));

  const workCenterStats = workCenters.slice(0, 5).map(center => ({
    center,
    count: countByWorkCenter(center)
  }));

  const statusStats = [
    { status: 'ACTIVE', label: 'Activos', count: countByStatus('ACTIVE'), color: 'emerald' },
    { status: 'MAINTENANCE', label: 'En Taller', count: countByStatus('MAINTENANCE'), color: 'amber' },
    { status: 'AVERIADO', label: 'Averiados', count: countByStatus('AVERIADO'), color: 'rose' },
    { status: 'BAJA', label: 'Baja', count: countByStatus('BAJA'), color: 'slate' },
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
        <h2 className="text-2xl font-bold text-slate-800">Vehículos</h2>
        <p className="text-sm text-slate-500 mt-1">Resumen de flota vehicular</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50">
              <TruckIcon className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Total Flota</p>
              <p className="text-xl font-bold text-slate-800">{totalVehicles}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50">
              <Truck className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Activos</p>
              <p className="text-xl font-bold text-slate-800">{activeVehicles.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50">
              <Wrench className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">En Taller</p>
              <p className="text-xl font-bold text-slate-800">{maintenanceVehicles.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-50">
              <AlertTriangle className="h-5 w-5 text-rose-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Averiados</p>
              <p className="text-xl font-bold text-slate-800">{brokenVehicles.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">Estado de Flota</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 gap-4">
              {statusStats.map((stat) => (
                <div key={stat.status} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full bg-${stat.color}-500`} />
                    <span className="text-sm font-medium text-slate-700">{stat.label}</span>
                  </div>
                  <span className="text-lg font-bold text-slate-800">{stat.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-5 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <span className="text-sm text-slate-600">Tasa de Actividad</span>
              </div>
              <span className="text-lg font-bold text-emerald-600">{activeRate.toFixed(0)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">Tipos de Vehículo</h3>
          </div>
          <div className="p-5 space-y-3">
            {typeStats.map((stat) => (
              <div key={stat.type} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${stat.color}`} />
                  <span className="text-sm text-slate-600">{getTypeLabel(stat.type)}</span>
                </div>
                <span className="text-sm font-semibold text-slate-800">{stat.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">Kilómetros Totales</h3>
          </div>
          <div className="p-5">
            <div className="text-3xl font-bold text-slate-800">
              {totalKilometers.toLocaleString()} <span className="text-lg font-medium text-slate-500">km</span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
              <Clock className="h-4 w-4" />
              <span>Promedio: {avgKilometers.toLocaleString()} km/vehículo</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">Por Centro de Trabajo</h3>
          </div>
          <div className="p-5 space-y-3">
            {workCenterStats.map((stat) => (
              <div key={stat.center} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-600">{wcNameMap[stat.center] || stat.center}</span>
                </div>
                <span className="text-sm font-semibold text-slate-800">{stat.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};