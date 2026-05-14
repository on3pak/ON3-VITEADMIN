import React, { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWorkCenters } from '../../context/WorkCenterContext';
import { INITIAL_CITIES } from '../../data/mockEmployees';
import {
  Building2,
  MapPin,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Calendar
} from 'lucide-react';

export const DashboardWorkCentersView: React.FC = () => {
  const { user: loggedInUser } = useAuth();
  const { workCenters } = useWorkCenters();

  const userCityId = loggedInUser?.role === 'ROOT' ? undefined : loggedInUser?.city_id;

  const scopedWorkCenters = useMemo(
    () => userCityId ? workCenters.filter(w => w.city_id === userCityId) : workCenters,
    [workCenters, userCityId]
  );

  const activeCenters = scopedWorkCenters.filter(w => w.status === 'ACTIVE');
  const inactiveCenters = scopedWorkCenters.filter(w => w.status === 'INACTIVE');
  const totalCenters = scopedWorkCenters.length;
  const activeRate = totalCenters > 0 ? (activeCenters.length / totalCenters) * 100 : 0;

  const countByCity = (cityId: string) => scopedWorkCenters.filter(w => w.city_id === cityId).length;
  const countByStatus = (status: string) => scopedWorkCenters.filter(w => w.status === status).length;

  const resolveCity = (cityId: string) => INITIAL_CITIES.find(c => c.id === cityId)?.name ?? cityId;

  const uniqueCities = [...new Set(scopedWorkCenters.map(w => w.city_id))];

  const cityStats = uniqueCities.map(cityId => ({
    cityId,
    cityName: resolveCity(cityId),
    count: countByCity(cityId),
  }));

  const statusStats = [
    { status: 'ACTIVE', label: 'Activos', count: countByStatus('ACTIVE'), color: 'emerald' },
    { status: 'INACTIVE', label: 'Inactivos', count: countByStatus('INACTIVE'), color: 'slate' },
  ];

  const recentCenters = [...scopedWorkCenters]
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 5);

  const getStatusBadge = (status: string) => {
    const styles = status === 'ACTIVE'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : 'bg-slate-100 text-slate-600 border-slate-200';
    const labels: Record<string, string> = {
      'ACTIVE': 'Activo',
      'INACTIVE': 'Inactivo',
    };
    return (
      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${styles}`}>
        {labels[status] || status}
      </span>
    );
  };

  const stats = [
    {
      title: 'Total Centros',
      value: totalCenters,
      icon: <Building2 className="h-5 w-5" />,
      color: 'indigo',
    },
    {
      title: 'Activos',
      value: activeCenters.length,
      icon: <CheckCircle2 className="h-5 w-5" />,
      color: 'emerald',
    },
    {
      title: 'Inactivos',
      value: inactiveCenters.length,
      icon: <XCircle className="h-5 w-5" />,
      color: 'rose',
    },
    {
      title: 'Tasa de Actividad',
      value: `${activeRate.toFixed(0)}%`,
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'blue',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className={`p-2.5 rounded-xl bg-${stat.color}-50 border border-${stat.color}-100 w-fit mb-3`}>
              <div className={`text-${stat.color}-600`}>{stat.icon}</div>
            </div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              {stat.title}
            </p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-slate-800">Distribución por Ciudad</h3>
              <p className="text-xs text-slate-500">Centros por ubicación</p>
            </div>
            <MapPin className="h-5 w-5 text-slate-400" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {cityStats.map((stat, i) => {
              const percentage = totalCenters > 0 ? (stat.count / totalCenters) * 100 : 0;
              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{stat.cityName}</span>
                    <span className="text-slate-600 font-semibold">
                      {stat.count} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-slate-800">Estado Actual</h3>
              <p className="text-xs text-slate-500">Centros activos vs inactivos</p>
            </div>
            <Building2 className="h-5 w-5 text-slate-400" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {statusStats.map((stat, i) => (
              <div key={i} className="text-center p-4 bg-slate-50 rounded-xl">
                <p className="text-2xl font-bold text-slate-800">{stat.count}</p>
                <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-semibold text-slate-800">Centros de Trabajo</h3>
            <p className="text-xs text-slate-500">Listado de centros registrados</p>
          </div>
          <Calendar className="h-5 w-5 text-slate-400" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide py-3 px-4">
                  Centro
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide py-3 px-4">
                  Dirección
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide py-3 px-4">
                  Ciudad
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide py-3 px-4">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {recentCenters.map((wc) => (
                <tr key={wc.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <p className="text-sm font-semibold text-slate-800">{wc.name}</p>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600">{wc.address}</td>
                  <td className="py-3 px-4">
                    <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded">
                      {resolveCity(wc.city_id)}
                    </span>
                  </td>
                  <td className="py-3 px-4">{getStatusBadge(wc.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
