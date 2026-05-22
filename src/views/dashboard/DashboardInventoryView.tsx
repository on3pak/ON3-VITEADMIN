import React, { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useInventory } from '../../context/InventoryContext';
import { InventoryCategory } from '../../types';
import { INVENTORY_SUBTYPES, getStatusesForCategory, getSubtypesForCategory } from '../../data/mockInventory';
import { INITIAL_WORK_CENTERS } from '../../data/mockWorkCenters';
import { INITIAL_CITIES } from '../../data/mockEmployees';
import {
  Shirt, Shield, Wrench, TrendingUp,
  AlertTriangle, MapPin, Calendar, Box, Ruler,
} from 'lucide-react';

const CATEGORY_TABS: { value: InventoryCategory; label: string; icon: React.ReactNode }[] = [
  { value: 'ropa', label: 'Ropa', icon: <Shirt className="h-4 w-4" /> },
  { value: 'epi', label: 'EPIs', icon: <Shield className="h-4 w-4" /> },
  { value: 'maquinaria', label: 'Maquinaria', icon: <Wrench className="h-4 w-4" /> },
];

const stNameMap = Object.fromEntries(INVENTORY_SUBTYPES.map((st) => [st.id, st.name]));
const wcNameMap = Object.fromEntries(INITIAL_WORK_CENTERS.map((w) => [w.id, w.name]));
const cityNameMap = Object.fromEntries(INITIAL_CITIES.map((c) => [c.id, c.name]));

const statusNameMap: Record<string, string> = {};
for (const cat of ['ropa', 'epi', 'maquinaria'] as const) {
  for (const s of getStatusesForCategory(cat)) {
    statusNameMap[s.id] = s.name;
  }
}

const statusBadgeStyles: Record<string, string> = {
  'rs-1': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'rs-2': 'bg-rose-100 text-rose-700 border-rose-200',
  'rs-3': 'bg-amber-100 text-amber-700 border-amber-200',
  'es-1': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'es-2': 'bg-rose-100 text-rose-700 border-rose-200',
  'es-3': 'bg-amber-100 text-amber-700 border-amber-200',
  'ms-1': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'ms-2': 'bg-amber-100 text-amber-700 border-amber-200',
  'ms-3': 'bg-rose-100 text-rose-700 border-rose-200',
  'ms-4': 'bg-app-bg text-app-text border-app-border',
};

const getStatusBadge = (id: string) => (
  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusBadgeStyles[id] || 'bg-app-bg text-app-text'}`}>
    {statusNameMap[id] || id}
  </span>
);

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
};

const SUBTYPE_BAR_COLORS = [
  'bg-primary-600', 'bg-blue-600', 'bg-cyan-600', 'bg-teal-600',
  'bg-emerald-600', 'bg-violet-600', 'bg-fuchsia-600', 'bg-rose-600',
  'bg-amber-600', 'bg-orange-600',
];

const TabContent: React.FC<{ items: typeof import('../../types').InventoryItem[]; category: InventoryCategory }> = ({ items, category }) => {
  const filtered = useMemo(() => items.filter((i) => i.category === category), [items, category]);

  const totalCount = filtered.length;
  const totalUnits = filtered.reduce((s, i) => s + i.quantity, 0);
  const statuses = getStatusesForCategory(category);

  const availableId = statuses[0]?.id || '';
  const agotadoId = statuses[1]?.id || '';
  const reposicionId = statuses[2]?.id || '';

  const disponibles = filtered.filter((i) => i.status_id === availableId).length;
  const agotados = filtered.filter((i) => i.status_id === agotadoId).length;
  const stockBajo = filtered.filter((i) => i.quantity > 0 && i.quantity <= i.min_stock).length;

  const subtypeIds = [...new Set(filtered.map((i) => i.subtype_id))];
  const subtypeStats = subtypeIds.map((sid) => {
    const subItems = filtered.filter((i) => i.subtype_id === sid);
    return { id: sid, name: stNameMap[sid] || sid, count: subItems.length };
  }).sort((a, b) => b.count - a.count);

  const filteredCount = filtered.length;
  const cityIds = [...new Set(filtered.map((i) => i.city_id))];
  const cityStats = cityIds.map((cid) => ({
    id: cid, city: cityNameMap[cid] || cid,
    count: filtered.filter((i) => i.city_id === cid).length,
  }));

  const statusStats = statuses.map((s) => ({
    id: s.id, label: s.name,
    count: filtered.filter((i) => i.status_id === s.id).length,
  }));

  const recent = [...filtered].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

  const stats = [
    { title: category === 'ropa' ? 'Total Prendas' : category === 'epi' ? 'Total EPIs' : 'Total Máquinas', value: totalCount, sub: `${totalUnits} unidades`, icon: <Box className="h-5 w-5" />, color: 'primary' },
    { title: 'Disponibles', value: disponibles, sub: `${filteredCount > 0 ? ((disponibles / filteredCount) * 100).toFixed(0) : 0}%`, icon: <TrendingUp className="h-5 w-5" />, color: 'emerald' },
    { title: 'Agotados', value: agotados, sub: `${filteredCount > 0 ? ((agotados / filteredCount) * 100).toFixed(0) : 0}%`, icon: <AlertTriangle className="h-5 w-5" />, color: 'rose' },
    { title: 'Stock Bajo', value: stockBajo, sub: 'por debajo del mínimo', icon: <Ruler className="h-5 w-5" />, color: 'amber' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-app-card p-5 rounded-2xl border border-app-card-border shadow-xs">
            <div className={`p-2 rounded-xl bg-${stat.color}-50 border border-${stat.color}-100 w-fit mb-2.5`}>
              <div className={`text-${stat.color}-600`}>{stat.icon}</div>
            </div>
            <p className="text-xs font-medium text-app-text-secondary uppercase tracking-wide">{stat.title}</p>
            <p className="text-2xl font-bold text-app-text mt-0.5">{stat.value}</p>
            <p className="text-[11px] text-app-text-secondary mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-app-card p-5 rounded-2xl border border-app-card-border shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-app-text">Por Subtipo</h3>
              <p className="text-xs text-app-text-secondary">Distribución por tipo</p>
            </div>
            <Box className="h-5 w-5 text-app-text-secondary" />
          </div>
          <div className="space-y-3">
            {subtypeStats.map((st, i) => {
              const pct = filteredCount > 0 ? (st.count / filteredCount) * 100 : 0;
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
          <div className="grid grid-cols-3 gap-3">
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
                    <div className="bg-primary-500 h-full rounded-full" style={{ width: `${filteredCount > 0 ? (c.count / filteredCount) * 100 : 0}%` }} />
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
              <h3 className="font-semibold text-app-text">Items Recientes</h3>
              <p className="text-xs text-app-text-secondary">Últimas altas</p>
            </div>
            <Calendar className="h-5 w-5 text-app-text-secondary" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-app-border">
                  <th className="text-left text-[10px] font-semibold text-app-text-secondary uppercase tracking-wide py-2 px-3">Elemento</th>
                  <th className="text-left text-[10px] font-semibold text-app-text-secondary uppercase tracking-wide py-2 px-3">Cant.</th>
                  <th className="text-left text-[10px] font-semibold text-app-text-secondary uppercase tracking-wide py-2 px-3">Estado</th>
                  <th className="text-left text-[10px] font-semibold text-app-text-secondary uppercase tracking-wide py-2 px-3">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((item) => (
                  <tr key={item.id} className="border-b border-app-border last:border-0 hover:bg-app-bg">
                    <td className="py-2.5 px-3">
                      <p className="text-xs font-semibold text-app-text leading-tight">{item.name}</p>
                      <p className="text-[10px] text-app-text-secondary font-mono">{stNameMap[item.subtype_id] || item.subtype_id} • {wcNameMap[item.work_center_id] || ''}</p>
                    </td>
                    <td className="py-2.5 px-3 text-xs font-bold text-app-text">{item.quantity}</td>
                    <td className="py-2.5 px-3">{getStatusBadge(item.status_id)}</td>
                    <td className="py-2.5 px-3 text-[10px] text-app-text-secondary">{formatDate(item.created_at)}</td>
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

export const DashboardInventoryView: React.FC = () => {
  const { user: loggedInUser } = useAuth();
  const { items } = useInventory();

  const [activeTab, setActiveTab] = useState<InventoryCategory>('ropa');

  const userCityId = loggedInUser?.role === 'ROOT' ? undefined : loggedInUser?.city_id;

  const scopedItems = useMemo(
    () => userCityId ? items.filter((i) => i.city_id === userCityId) : items,
    [items, userCityId]
  );

  return (
    <div className="space-y-6">
      <div className="flex gap-1.5 bg-app-bg rounded-xl p-1 overflow-x-auto">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.value ? 'bg-white text-primary-700 shadow-xs' : 'text-app-text-secondary hover:text-app-text'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <TabContent items={scopedItems} category={activeTab} />
    </div>
  );
};

