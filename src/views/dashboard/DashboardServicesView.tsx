import React, { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useServices } from '../../context/ServiceContext';
import { INITIAL_WORK_CENTERS } from '../../data/mockWorkCenters';
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  TrendingUp,
  Calendar,
  MapPin,
  AlertCircle,
  ListChecks
} from 'lucide-react';

const wcNameMap = Object.fromEntries(INITIAL_WORK_CENTERS.map(w => [w.id, w.name]));

const DAY_LABELS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export const DashboardServicesView: React.FC = () => {
  const { user: loggedInUser } = useAuth();
  const { services } = useServices();

  const userCityId = loggedInUser?.role === 'ROOT' ? undefined : loggedInUser?.city_id;

  const filteredServices = useMemo(
    () => {
      if (!userCityId) return services;
      const cityWcIds = INITIAL_WORK_CENTERS.filter(w => w.city_id === userCityId).map(w => w.id);
      return services.filter(s => cityWcIds.includes(s.work_center_id));
    },
    [services, userCityId]
  );

  const totalServices = filteredServices.length;
  const allTasks = filteredServices.flatMap(s => s.tasks);
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(t => t.status === 'COMPLETED').length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const serviceTypes = [...new Set(filteredServices.map(s => s.category))];

  const typeStats = serviceTypes.map(type => {
    const typeServices = filteredServices.filter(s => s.category === type);
    const typeTasks = typeServices.flatMap(s => s.tasks);
    const completed = typeTasks.filter(t => t.status === 'COMPLETED').length;
    return {
      type,
      count: typeServices.length,
      totalTasks: typeTasks.length,
      completedTasks: completed,
      rate: typeTasks.length > 0 ? (completed / typeTasks.length) * 100 : 0,
    };
  });

  const dayStats = DAY_LABELS.map((label, dayIndex) => {
    const dayTasks = allTasks.filter(t => t.day_index === dayIndex);
    const completed = dayTasks.filter(t => t.status === 'COMPLETED').length;
    return {
      day: label,
      total: dayTasks.length,
      completed,
      rate: dayTasks.length > 0 ? (completed / dayTasks.length) * 100 : 0,
    };
  });

  const recentServices = [...filteredServices]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const stats = [
    {
      title: 'Servicios',
      value: totalServices,
      icon: <ClipboardList className="h-5 w-5" />,
      color: 'primary',
    },
    {
      title: 'Tareas Completadas',
      value: completedTasks.toLocaleString(),
      icon: <CheckCircle2 className="h-5 w-5" />,
      color: 'emerald',
    },
    {
      title: 'Tareas Pendientes',
      value: pendingTasks.toLocaleString(),
      icon: <Clock className="h-5 w-5" />,
      color: 'amber',
    },
    {
      title: 'Finalización',
      value: `${completionRate.toFixed(0)}%`,
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'blue',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-app-card p-5 rounded-2xl border border-app-card-border shadow-xs">
            <div className={`p-2.5 rounded-xl bg-${stat.color}-50 border border-${stat.color}-100 w-fit mb-3`}>
              <div className={`text-${stat.color}-600`}>{stat.icon}</div>
            </div>
            <p className="text-xs font-medium text-app-text-secondary uppercase tracking-wide">{stat.title}</p>
            <p className="text-2xl font-bold text-app-text mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-app-card p-5 rounded-2xl border border-app-card-border shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-app-text">Por Tipo de Servicio</h3>
              <p className="text-xs text-app-text-secondary">Tareas completadas por tipo</p>
            </div>
            <ListChecks className="h-5 w-5 text-app-text-secondary" />
          </div>
          <div className="space-y-4">
            {typeStats.map((stat, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium text-app-text">{stat.type}</span>
                  <span className="text-app-text-secondary font-semibold">
                    {stat.completedTasks}/{stat.totalTasks} ({stat.rate.toFixed(0)}%)
                  </span>
                </div>
                <div className="w-full bg-app-bg rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${stat.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-app-card p-5 rounded-2xl border border-app-card-border shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-app-text">Tareas por Día</h3>
              <p className="text-xs text-app-text-secondary">Progreso semanal</p>
            </div>
            <Calendar className="h-5 w-5 text-app-text-secondary" />
          </div>
          <div className="space-y-3">
            {dayStats.map((stat, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-app-text">{stat.day}</span>
                  <span className="text-app-text-secondary font-semibold">{stat.completed}/{stat.total}</span>
                </div>
                <div className="w-full bg-app-bg rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${stat.rate >= 80 ? 'bg-emerald-500' : stat.rate >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                    style={{ width: `${stat.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-app-card p-5 rounded-2xl border border-app-card-border shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-semibold text-app-text">Servicios Recientes</h3>
            <p className="text-xs text-app-text-secondary">Últimos servicios registrados</p>
          </div>
          <ClipboardList className="h-5 w-5 text-app-text-secondary" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-app-border">
                <th className="text-left text-xs font-semibold text-app-text-secondary uppercase tracking-wide py-3 px-4">Nombre</th>
                <th className="text-left text-xs font-semibold text-app-text-secondary uppercase tracking-wide py-3 px-4">Tipo</th>
                <th className="text-left text-xs font-semibold text-app-text-secondary uppercase tracking-wide py-3 px-4">Centro</th>
                <th className="text-left text-xs font-semibold text-app-text-secondary uppercase tracking-wide py-3 px-4">Tareas</th>
                <th className="text-left text-xs font-semibold text-app-text-secondary uppercase tracking-wide py-3 px-4">Progreso</th>
              </tr>
            </thead>
            <tbody>
              {recentServices.map((svc) => {
                const total = svc.tasks.length;
                const done = svc.tasks.filter(t => t.status === 'COMPLETED').length;
                const rate = total > 0 ? (done / total) * 100 : 0;
                return (
                  <tr key={svc.id} className="border-b border-app-border last:border-0 hover:bg-app-bg">
                    <td className="py-3 px-4">
                      <p className="text-sm font-semibold text-app-text">{svc.name}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-medium text-app-text bg-app-bg px-2 py-1 rounded">{svc.category}</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-app-text-secondary">{wcNameMap[svc.work_center_id] || svc.work_center_id}</td>
                    <td className="py-3 px-4 text-sm text-app-text-secondary">{done}/{total}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-app-bg rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${rate >= 80 ? 'bg-emerald-500' : rate >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                            style={{ width: `${rate}%` }}
                          />
                        </div>
                        <span className="text-xs text-app-text-secondary">{rate.toFixed(0)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

