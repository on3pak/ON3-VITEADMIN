import React, { useMemo, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMachinery } from '../../context/MachineryContext';
import { MACHINERY_SUBTYPES, MACHINERY_STATUSES } from '../../data/mockMachinery';
import { INITIAL_WORK_CENTERS } from '../../data/mockWorkCenters';
import { INITIAL_CITIES } from '../../data/mockEmployees';
import {
  Wrench, TrendingUp,
  AlertTriangle, MapPin, Calendar, Box, Clock,
} from 'lucide-react';

const stNameMap = Object.fromEntries(MACHINERY_SUBTYPES.map((st) => [st.id, st.name]));
const wcNameMap = Object.fromEntries(INITIAL_WORK_CENTERS.map((w) => [w.id, w.name]));
const cityNameMap = Object.fromEntries(INITIAL_CITIES.map((c) => [c.id, c.name]));
const statusNameMap = Object.fromEntries(MACHINERY_STATUSES.map((s) => [s.id, s.name]));

const statusBadgeStyles: Record<string, string> = {
  'ms-1': 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  'ms-2': 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  'ms-3': 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  'ms-4': 'bg-app-bg text-app-text border-app-border',
};

const getStatusBadge = (id: string) => (
  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusBadgeStyles[id] || 'bg-app-bg text-app-text'}`}>
    {statusNameMap[id] || id}
  </span>
);

const SUBTYPE_BAR_COLORS = [
  'bg-primary-600', 'bg-blue-600', 'bg-cyan-600', 'bg-teal-600',
  'bg-emerald-600', 'bg-violet-600', 'bg-fuchsia-600', 'bg-rose-600',
];

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const DashboardMachineryView: React.FC = () => {
  const { user: loggedInUser } = useAuth();
  const { items, loadMachinery } = useMachinery();

  const userCityId = loggedInUser?.role === 'ROOT' ? undefined : loggedInUser?.city_id;

  useEffect(() => { loadMachinery(); }, [loadMachinery]);

  const scopedItems = useMemo(
    () => userCityId ? items.filter((i) => i.city_id === userCityId) : items,
    [items, userCityId]
  );

  const totalCount = scopedItems.length;
  const totalUnits = scopedItems.reduce((s, i) => s + i.quantity, 0);
  const disponibles = scopedItems.filter((i) => i.status_id === 'ms-1').length;
  const mantenimiento = scopedItems.filter((i) => i.status_id === 'ms-2').length;
  const averiados = scopedItems.filter((i) => i.status_id === 'ms-3').length;
  const stockBajo = scopedItems.filter((i) => i.quantity > 0 && i.quantity <= i.min_stock).length;

  const today = new Date();

  const maintenanceDue = scopedItems.filter((i) => {
    if (!i.next_maintenance) return false;
    const due = new Date(i.next_maintenance);
    return due <= today;
  });

  const maintenanceSoon = scopedItems.filter((i) => {
    if (!i.next_maintenance) return false;
    const due = new Date(i.next_maintenance);
    const diff = (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diff > 0 && diff <= 30;
  });

  const warrantyExpiring = scopedItems.filter((i) => {
    if (!i.warranty_expiration) return false;
    const exp = new Date(i.warranty_expiration);
    const diff = (exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diff > 0 && diff <= 90;
  });

  const subtypeIds = [...new Set(scopedItems.map((i) => i.subtype_id))];
  const subtypeStats = subtypeIds.map((sid) => {
    const subItems = scopedItems.filter((i) => i.subtype_id === sid);
    return { id: sid, name: stNameMap[sid] || sid, count: subItems.length };
  }).sort((a, b) => b.count - a.count);

  const cityIds = [...new Set(scopedItems.map((i) => i.city_id))];
  const cityStats = cityIds.map((cid) => ({
    id: cid, city: cityNameMap[cid] || cid,
    count: scopedItems.filter((i) => i.city_id === cid).length,
  }));

  const statusStats = MACHINERY_STATUSES.map((s) => ({
    id: s.id, label: s.name,
    count: scopedItems.filter((i) => i.status_id === s.id).length,
  }));

  const recent = [...scopedItems]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const statColors: Record<string, { bg: string, border: string, text: string }> = {
    primary: { bg: 'bg-primary-50 dark:bg-primary-900/20', border: 'border-primary-100 dark:border-primary-800', text: 'text-primary-600 dark:text-primary-300' },
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-100 dark:border-emerald-800', text: 'text-emerald-600 dark:text-emerald-300' },
    rose: { bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-rose-100 dark:border-rose-800', text: 'text-rose-600 dark:text-rose-300' },
    amber: { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-100 dark:border-amber-800', text: 'text-amber-600 dark:text-amber-300' },
  };

  const getStatColor = (color: string) => statColors[color] || statColors.primary;

  const stats = [
    { title: 'Total Máquinas', value: totalCount, sub: `${totalUnits} unidades`, icon: <Box className="h-5 w-5" />, color: 'primary' },
    { title: 'Disponibles', value: disponibles, sub: `${totalCount > 0 ? ((disponibles / totalCount) * 100).toFixed(0) : 0}%`, icon: <TrendingUp className="h-5 w-5" />, color: 'emerald' },
    { title: 'Averiados', value: averiados, sub: `${totalCount > 0 ? ((averiados / totalCount) * 100).toFixed(0) : 0}%`, icon: <AlertTriangle className="h-5 w-5" />, color: 'rose' },
    { title: 'Stock Bajo', value: stockBajo, sub: 'por debajo del mínimo', icon: <Clock className="h-5 w-5" />, color: 'amber' },
  ];

  return (
    <div className="space-y-6">
      {(maintenanceDue.length > 0 || maintenanceSoon.length > 0) && (
        <div className="space-y-2">
          {maintenanceDue.length > 0 && (
            <div className="p-4 bg-rose-50 dark:bg-rose-900/20 rounded-2xl border border-rose-200 dark:border-rose-800">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-300" />
                <span className="text-sm font-bold text-rose-800 dark:text-rose-300">Mantenimiento Vencido</span>
                <span className="text-xs font-semibold text-rose-600 dark:text-rose-300 ml-auto">{maintenanceDue.length} máquina(s)</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {maintenanceDue.slice(0, 5).map((item) => (
                  <span key={item.id} className="text-[11px] bg-app-card px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-medium">
                    {item.name}
                  </span>
                ))}
                {maintenanceDue.length > 5 && (
                  <span className="text-[11px] text-rose-500 dark:text-rose-400 font-medium px-2 py-1">+{maintenanceDue.length - 5} más</span>
                )}
              </div>
            </div>
          )}
          {maintenanceSoon.length > 0 && (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-amber-600 dark:text-amber-300" />
                <span className="text-sm font-bold text-amber-800 dark:text-amber-300">Próximo Mantenimiento</span>
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-300 ml-auto">{maintenanceSoon.length} máquina(s)</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {maintenanceSoon.slice(0, 5).map((item) => (
                  <span key={item.id} className="text-[11px] bg-app-card px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-medium">
                    {item.name}
                  </span>
                ))}
                {maintenanceSoon.length > 5 && (
                  <span className="text-[11px] text-amber-500 dark:text-amber-400 font-medium px-2 py-1">+{maintenanceSoon.length - 5} más</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const sc = getStatColor(stat.color);
          return (
          <div key={i} className="bg-app-card p-5 rounded-2xl border border-app-card-border shadow-xs">
            <div className={`p-2 rounded-xl ${sc.bg} border ${sc.border} w-fit mb-2.5`}>
              <div className={sc.text}>{stat.icon}</div>
            </div>
            <p className="text-xs font-medium text-app-text-secondary uppercase tracking-wide">{stat.title}</p>
            <p className="text-2xl font-bold text-app-text mt-0.5">{stat.value}</p>
            <p className="text-[11px] text-app-text-secondary mt-0.5">{stat.sub}</p>
          </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-app-card p-5 rounded-2xl border border-app-card-border shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-app-text">Por Tipo</h3>
              <p className="text-xs text-app-text-secondary">Distribución por tipo de maquinaria</p>
            </div>
            <Box className="h-5 w-5 text-app-text-secondary" />
          </div>
          <div className="space-y-3">
            {subtypeStats.map((st, i) => {
              const pct = totalCount > 0 ? (st.count / totalCount) * 100 : 0;
              return (
                <div key={st.id}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-app-text">{st.name}</span>
                    <span className="text-app-text-secondary text-xs">{st.count} ({pct.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-app-bg rounded-full h-2 overflow-hidden">
                    <div className={`${SUBTYPE_BAR_COLORS[i % SUBTYPE_BAR_COLORS.length]} h-full rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-app-card p-5 rounded-2xl border border-app-card-border shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-app-text">Por Estado</h3>
              <p className="text-xs text-app-text-secondary">Situación actual</p>
            </div>
            <TrendingUp className="h-5 w-5 text-app-text-secondary" />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {statusStats.map((s) => (
              <div key={s.id} className="text-center p-3 bg-app-bg rounded-xl">
                <p className="text-2xl font-bold text-app-text">{s.count}</p>
                <p className="text-xs text-app-text-secondary mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-app-card p-5 rounded-2xl border border-app-card-border shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-app-text">Por Ciudad</h3>
              <p className="text-xs text-app-text-secondary">Distribución geográfica</p>
            </div>
            <MapPin className="h-5 w-5 text-app-text-secondary" />
          </div>
          <div className="space-y-2">
            {cityStats.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-2.5 bg-app-bg rounded-lg">
                <span className="text-sm font-medium text-app-text">{c.city}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-app-border rounded-full h-1.5 overflow-hidden">
                    <div className="bg-primary-500 h-full rounded-full" style={{ width: `${totalCount > 0 ? (c.count / totalCount) * 100 : 0}%` }} />
                  </div>
                  <span className="text-sm font-bold text-app-text w-6 text-right">{c.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-app-card p-5 rounded-2xl border border-app-card-border shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-app-text">Próximos Mantenimientos</h3>
              <p className="text-xs text-app-text-secondary">Máquinas con mantenimiento programado</p>
            </div>
            <Calendar className="h-5 w-5 text-app-text-secondary" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-app-border">
                  <th className="text-left text-[10px] font-semibold text-app-text-secondary uppercase tracking-wide py-2 px-3">Máquina</th>
                  <th className="text-left text-[10px] font-semibold text-app-text-secondary uppercase tracking-wide py-2 px-3">Estado</th>
                  <th className="text-left text-[10px] font-semibold text-app-text-secondary uppercase tracking-wide py-2 px-3">Próx. Manto.</th>
                </tr>
              </thead>
              <tbody>
                {scopedItems
                  .filter((i) => i.next_maintenance)
                  .sort((a, b) => new Date(a.next_maintenance!).getTime() - new Date(b.next_maintenance!).getTime())
                  .slice(0, 8)
                  .map((item) => (
                    <tr key={item.id} className="border-b border-app-border last:border-0 hover:bg-app-bg">
                      <td className="py-2.5 px-3">
                        <p className="text-xs font-semibold text-app-text leading-tight">{item.name}</p>
                        <p className="text-[10px] text-app-text-secondary">{stNameMap[item.subtype_id] || item.subtype_id}</p>
                      </td>
                      <td className="py-2.5 px-3">{getStatusBadge(item.status_id)}</td>
                      <td className="py-2.5 px-3">
                        <span className={`text-[11px] font-medium ${
                          item.next_maintenance && new Date(item.next_maintenance) <= today ? 'text-rose-600 dark:text-rose-300' : 'text-app-text-secondary'
                        }`}>
                          {formatDate(item.next_maintenance)}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
