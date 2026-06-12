import React, { useMemo, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useServices } from '../../context/ServiceContext';
import { INITIAL_WORK_CENTERS } from '../../data/mockWorkCenters';
import { INITIAL_SHIFTS } from '../../data/mockEmployees';
import {
  ClipboardList,
  UserCog,
  Users,
  Building2,
  Clock,
  Sun,
  Moon,
  Sunset,
  Shirt,
  type LucideIcon,
} from 'lucide-react';

const wcNameMap = Object.fromEntries(INITIAL_WORK_CENTERS.map(w => [w.id, w.name]));
const shiftMap = Object.fromEntries(INITIAL_SHIFTS.map(s => [s.id, s.name]));

const SHIFT_ICONS: Record<string, LucideIcon> = {
  s_1: Sun,
  s_2: Sunset,
  s_3: Moon,
};

const CATEGORY_COLORS: Record<string, string> = {
  'BARRIDO MIXTO': 'bg-indigo-500',
  'BARRIDO MANUAL': 'bg-sky-500',
  'BARRIDO MECÁNICO': 'bg-cyan-500',
  'BALDEO': 'bg-blue-500',
  'RECOGIDA': 'bg-amber-500',
  'VACIADO': 'bg-violet-500',
};

export const DashboardServicesView: React.FC = () => {
  const { user: loggedInUser } = useAuth();
  const { services, loadServices } = useServices();

  const userCityId = loggedInUser?.role === 'ROOT' ? undefined : loggedInUser?.city_id;

  useEffect(() => { loadServices(); }, [loadServices]);

  const filteredServices = useMemo(() => {
    if (!userCityId) return services;
    const cityWcIds = INITIAL_WORK_CENTERS.filter(w => w.city_id === userCityId).map(w => w.id);
    return services.filter(s => cityWcIds.includes(s.work_center_id));
  }, [services, userCityId]);

  const staffStats = useMemo(() => {
    let totalOficiales = 0;
    let totalPeones = 0;
    let servicesConOficial = 0;
    let servicesSinPersonal = 0;

    for (const s of filteredServices) {
      if (s.staff_requirement.oficial) {
        totalOficiales++;
        servicesConOficial++;
      }
      totalPeones += s.staff_requirement.peones;
      if (!s.staff_requirement.oficial && s.staff_requirement.peones === 0) {
        servicesSinPersonal++;
      }
    }

    return { totalOficiales, totalPeones, servicesConOficial, servicesSinPersonal };
  }, [filteredServices]);

  const centerStats = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of filteredServices) {
      map.set(s.work_center_id, (map.get(s.work_center_id) || 0) + 1);
    }
    return Array.from(map.entries())
      .map(([id, count]) => ({ id, name: wcNameMap[id] || id, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredServices]);

  const categoryStats = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of filteredServices) {
      map.set(s.category, (map.get(s.category) || 0) + 1);
    }
    return Array.from(map.entries())
      .map(([cat, count]) => ({ cat, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredServices]);

  const shiftStats = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of filteredServices) {
      map.set(s.shift_id, (map.get(s.shift_id) || 0) + 1);
    }
    return Array.from(map.entries())
      .map(([id, count]) => ({ id, name: shiftMap[id] || id, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredServices]);

  const staffComposition = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of filteredServices) {
      const key = s.staff_requirement.oficial
        ? `1 of. + ${s.staff_requirement.peones} peón${s.staff_requirement.peones !== 1 ? 'es' : ''}`
        : s.staff_requirement.peones > 0
          ? 'Solo peones'
          : 'Sin personal';
      map.set(key, (map.get(key) || 0) + 1);
    }
    return Array.from(map.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredServices]);

  const totalCentros = centerStats.length;
  const total = filteredServices.length;
  const maxCenterCount = Math.max(...centerStats.map(c => c.count), 1);
  const maxCategoryCount = Math.max(...categoryStats.map(c => c.count), 1);

  const topServices = useMemo(() => {
    return [...filteredServices].slice(0, 8);
  }, [filteredServices]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-app-card p-5 rounded-2xl border border-app-card-border shadow-xs">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 w-fit mb-3">
            <ClipboardList className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
          </div>
          <p className="text-xs font-medium text-app-text-secondary uppercase tracking-wide">Servicios</p>
          <p className="text-2xl font-bold text-app-text mt-1">{total}</p>
        </div>

        <div className="bg-app-card p-5 rounded-2xl border border-app-card-border shadow-xs">
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 w-fit mb-3">
            <UserCog className="h-5 w-5 text-amber-600 dark:text-amber-300" />
          </div>
          <p className="text-xs font-medium text-app-text-secondary uppercase tracking-wide">Oficiales</p>
          <p className="text-2xl font-bold text-app-text mt-1">{staffStats.totalOficiales}</p>
          <p className="text-xs text-app-text-secondary mt-0.5">{staffStats.servicesConOficial} servicios cubiertos</p>
        </div>

        <div className="bg-app-card p-5 rounded-2xl border border-app-card-border shadow-xs">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 w-fit mb-3">
            <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
          </div>
          <p className="text-xs font-medium text-app-text-secondary uppercase tracking-wide">Peones</p>
          <p className="text-2xl font-bold text-app-text mt-1">{staffStats.totalPeones}</p>
          <p className="text-xs text-app-text-secondary mt-0.5">{total > 0 ? (staffStats.totalPeones / total).toFixed(1) : '0'} prom. por servicio</p>
        </div>

        <div className="bg-app-card p-5 rounded-2xl border border-app-card-border shadow-xs">
          <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-800 w-fit mb-3">
            <Building2 className="h-5 w-5 text-sky-600 dark:text-sky-300" />
          </div>
          <p className="text-xs font-medium text-app-text-secondary uppercase tracking-wide">Centros</p>
          <p className="text-2xl font-bold text-app-text mt-1">{totalCentros}</p>
          <p className="text-xs text-app-text-secondary mt-0.5">{staffStats.servicesSinPersonal > 0 ? `${staffStats.servicesSinPersonal} sin personal` : 'Completos'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-app-card p-5 rounded-2xl border border-app-card-border shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-app-text">Por Centro de Trabajo</h3>
              <p className="text-xs text-app-text-secondary">Distribución de servicios</p>
            </div>
            <Building2 className="h-5 w-5 text-app-text-secondary" />
          </div>
          <div className="space-y-3">
            {centerStats.map((stat) => (
              <div key={stat.id}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-app-text truncate mr-2">{stat.name}</span>
                  <span className="text-app-text-secondary font-semibold shrink-0">{stat.count}</span>
                </div>
                <div className="w-full bg-app-bg rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(stat.count / maxCenterCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {centerStats.length === 0 && (
              <p className="text-sm text-app-text-secondary text-center py-4">No hay servicios</p>
            )}
          </div>
        </div>

        <div className="bg-app-card p-5 rounded-2xl border border-app-card-border shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-app-text">Por Categoría</h3>
              <p className="text-xs text-app-text-secondary">Tipos de servicio</p>
            </div>
            <Shirt className="h-5 w-5 text-app-text-secondary" />
          </div>
          <div className="space-y-3">
            {categoryStats.map((stat) => (
              <div key={stat.cat}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-app-text truncate mr-2">{stat.cat}</span>
                  <span className="text-app-text-secondary font-semibold shrink-0">{stat.count}</span>
                </div>
                <div className="w-full bg-app-bg rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${CATEGORY_COLORS[stat.cat] || 'bg-gray-500'}`}
                    style={{ width: `${(stat.count / maxCategoryCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {categoryStats.length === 0 && (
              <p className="text-sm text-app-text-secondary text-center py-4">No hay servicios</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-app-card p-5 rounded-2xl border border-app-card-border shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-app-text">Distribución por Turno</h3>
              <p className="text-xs text-app-text-secondary">Mañana / Tarde / Noche</p>
            </div>
            <Clock className="h-5 w-5 text-app-text-secondary" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {shiftStats.map((stat) => {
              const Icon = SHIFT_ICONS[stat.id] || Clock;
              const pct = total > 0 ? ((stat.count / total) * 100).toFixed(0) : '0';
              return (
                <div
                  key={stat.id}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-app-bg border border-app-border text-center"
                >
                  <Icon className="h-6 w-6 text-app-text-secondary" />
                  <div>
                    <p className="text-lg font-bold text-app-text">{stat.count}</p>
                    <p className="text-[10px] text-app-text-secondary font-medium uppercase tracking-wide">{stat.name}</p>
                    <p className="text-xs text-app-text-secondary">{pct}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-app-card p-5 rounded-2xl border border-app-card-border shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-app-text">Composición de Personal</h3>
              <p className="text-xs text-app-text-secondary">Distribución de plantilla por servicio</p>
            </div>
            <Users className="h-5 w-5 text-app-text-secondary" />
          </div>
          <div className="space-y-3">
            {staffComposition.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-app-text">{item.label}</span>
                  <span className="text-app-text-secondary font-semibold">{item.count}</span>
                </div>
                <div className="w-full bg-app-bg rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(item.count / total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {staffComposition.length === 0 && (
              <p className="text-sm text-app-text-secondary text-center py-4">No hay servicios</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-app-card p-5 rounded-2xl border border-app-card-border shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-app-text">Vista Rápida de Servicios</h3>
            <p className="text-xs text-app-text-secondary">Resumen de personal y turno</p>
          </div>
          <ClipboardList className="h-5 w-5 text-app-text-secondary" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {topServices.map((svc) => {
            const ShiftIcon = SHIFT_ICONS[svc.shift_id] || Clock;
            return (
              <div
                key={svc.id}
                className="flex flex-col gap-2 p-4 rounded-xl border border-app-card-border bg-app-bg hover:bg-app-card transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-app-text">{svc.name}</span>
                  <span className={`text-[10px] font-semibold text-white px-2 py-0.5 rounded ${CATEGORY_COLORS[svc.category] || 'bg-app-text-secondary'}`}>
                    {svc.category.substring(0, 5)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-app-text-secondary">
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {wcNameMap[svc.work_center_id] || svc.work_center_id}
                  </span>
                  <span className="flex items-center gap-1">
                    <ShiftIcon className="h-3 w-3" />
                    {shiftMap[svc.shift_id] || svc.shift_id}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  {svc.staff_requirement.oficial ? (
                    <span className="flex items-center gap-1 text-amber-600 dark:text-amber-300 font-medium">
                      <UserCog className="h-3 w-3" />
                      {svc.staff_requirement.oficial === 'ec_000003' ? '1ª' : '2ª'}
                    </span>
                  ) : (
                    <span className="text-app-text-secondary text-[10px]">Sin oficial</span>
                  )}
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-300 font-medium">
                    <Users className="h-3 w-3" />
                    {svc.staff_requirement.peones} peón{svc.staff_requirement.peones !== 1 ? 'es' : ''}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
