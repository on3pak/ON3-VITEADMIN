import React, { useMemo, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEmployees } from '../../context/EmployeeContext';
import { INITIAL_EMPLOYEE_CATEGORIES } from '../../data/mockEmployees';
import { INITIAL_WORK_CENTERS } from '../../data/mockWorkCenters';
import {
  Users,
  UserCheck,
  UserX,
  Briefcase,
  TrendingUp,
  Clock,
  Calendar,
  MapPin,
  Wrench
} from 'lucide-react';

const categoryMap = Object.fromEntries(INITIAL_EMPLOYEE_CATEGORIES.map(c => [c.id, c.name]));
const wcNameMap = Object.fromEntries(INITIAL_WORK_CENTERS.map(w => [w.id, w.name]));

export const DashboardEmployeesView: React.FC = () => {
  const { user: loggedInUser } = useAuth();
  const { employees, loadEmployees } = useEmployees();

  const userCityId = loggedInUser?.role === 'root' ? undefined : loggedInUser?.city_id;

  useEffect(() => { loadEmployees(); }, [loadEmployees]);

  const scopedEmployees = useMemo(
    () => userCityId ? employees.filter(e => e.city_id === userCityId) : employees,
    [employees, userCityId]
  );

  const activeEmployees = scopedEmployees.filter(e => e.active);
  const inactiveEmployees = scopedEmployees.filter(e => !e.active);
  const totalEmployees = scopedEmployees.length;
  const activeRate = totalEmployees > 0 ? (activeEmployees.length / totalEmployees) * 100 : 0;

  const countByCategory = (categoryId: string) => scopedEmployees.filter(e => e.category_id === categoryId).length;
  const countByWorkCenter = (centerId: string) => scopedEmployees.filter(e => e.work_center_id === centerId).length;
  const countByStatus = (statusId: string) => scopedEmployees.filter(e => e.status_id === statusId).length;

  const uniqueCategoryIds = [...new Set(scopedEmployees.map(e => e.category_id))];
  const uniqueWorkCenterIds = [...new Set(scopedEmployees.map(e => e.work_center_id))];

  const categoryStats = uniqueCategoryIds.slice(0, 6).map(catId => {
    const name = categoryMap[catId] || catId;
    return {
      categoryId: catId,
      category: name,
      count: countByCategory(catId),
      color: name.includes('Encargado') || name.includes('Jefe') ? 'bg-purple-600'
        : name.includes('Mecánico') || name.includes('Mantenimiento') ? 'bg-blue-600'
        : 'bg-app-bg0'
    };
  });

  const workCenterStats = uniqueWorkCenterIds.slice(0, 5).map(centerId => ({
    centerId,
    center: wcNameMap[centerId] || centerId,
    count: countByWorkCenter(centerId)
  }));

  const statusStats = [
    { status: 'es_1', label: 'Trabajando', count: countByStatus('es_1'), color: 'emerald' },
    { status: 'es_2', label: 'Descanso', count: countByStatus('es_2'), color: 'blue' },
    { status: 'es_3', label: 'Baja', count: countByStatus('es_3'), color: 'rose' },
    { status: 'es_4', label: 'Días Propios', count: countByStatus('es_4'), color: 'amber' },
    { status: 'es_5', label: 'Días Acumulados', count: countByStatus('es_5'), color: 'purple' },
    { status: 'es_6', label: 'Vacaciones', count: countByStatus('es_6'), color: 'cyan' },
  ];

  const shiftStats = [
    { shift: 's_1', label: 'Mañana', count: scopedEmployees.filter(e => e.shift_id === 's_1').length },
    { shift: 's_2', label: 'Tarde', count: scopedEmployees.filter(e => e.shift_id === 's_2').length },
    { shift: 's_3', label: 'Noche', count: scopedEmployees.filter(e => e.shift_id === 's_3').length },
  ];

  const recentEmployees = [...scopedEmployees]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const getStatusLabel = (statusId: string) => {
    const labels: Record<string, string> = {
      'es_1': 'Trabajando',
      'es_2': 'Descanso',
      'es_3': 'Baja',
      'es_4': 'Días Propios',
      'es_5': 'Días Acumulados',
      'es_6': 'Vacaciones',
    };
    return labels[statusId] || statusId;
  };

  const getStatusBadge = (statusId: string) => {
    const colors: Record<string, string> = {
      'es_1': 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      'es_2': 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      'es_3': 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
      'es_4': 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      'es_5': 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      'es_6': 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    };
    return (
      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${colors[statusId] || 'bg-app-bg text-app-text'}`}>
        {getStatusLabel(statusId)}
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const statColors: Record<string, { bg: string, border: string, text: string }> = {
    primary: { bg: 'bg-primary-50 dark:bg-primary-900/20', border: 'border-primary-100 dark:border-primary-800', text: 'text-primary-600 dark:text-primary-300' },
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-100 dark:border-emerald-800', text: 'text-emerald-600 dark:text-emerald-300' },
    rose: { bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-rose-100 dark:border-rose-800', text: 'text-rose-600 dark:text-rose-300' },
    blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-100 dark:border-blue-800', text: 'text-blue-600 dark:text-blue-300' },
  };

  const getStatColor = (color: string) => statColors[color] || statColors.primary;

  const stats = [
    {
      title: 'Total Empleados',
      value: totalEmployees,
      icon: <Users className="h-5 w-5" />,
      color: 'primary',
    },
    {
      title: 'Activos',
      value: activeEmployees.length,
      icon: <UserCheck className="h-5 w-5" />,
      color: 'emerald',
    },
    {
      title: 'Inactivos',
      value: inactiveEmployees.length,
      icon: <UserX className="h-5 w-5" />,
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
        {stats.map((stat, i) => {
          const sc = getStatColor(stat.color);
          return (
          <div
            key={i}
            className="card-uiverse p-5"
          >
            <div className={`p-2.5 rounded-xl ${sc.bg} border ${sc.border} w-fit mb-3`}>
              <div className={sc.text}>{stat.icon}</div>
            </div>
            <p className="text-xs font-medium text-app-text-secondary uppercase tracking-wide">
              {stat.title}
            </p>
            <p className="text-2xl font-bold text-app-text mt-1">{stat.value}</p>
          </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card-uiverse p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-app-text">Distribución por Categoría</h3>
              <p className="text-xs text-app-text-secondary">Empleados por puesto</p>
            </div>
            <Briefcase className="h-5 w-5 text-app-text-secondary" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {categoryStats.map((stat, i) => {
              const percentage = totalEmployees > 0 ? (stat.count / totalEmployees) * 100 : 0;
              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-app-text">{stat.category}</span>
                    <span className="text-app-text-secondary font-semibold">
                      {stat.count} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-app-bg rounded-full h-2 overflow-hidden">
                    <div
                      className={`${stat.color} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card-uiverse p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-app-text">Por Centro de Trabajo</h3>
              <p className="text-xs text-app-text-secondary">Distribución locations</p>
            </div>
            <MapPin className="h-5 w-5 text-app-text-secondary" />
          </div>

          <div className="space-y-3">
            {workCenterStats.map((stat, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-app-bg rounded-lg">
                <span className="text-sm font-medium text-app-text">{stat.center}</span>
                <span className="text-sm font-bold text-app-text">{stat.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-uiverse p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-app-text">Estado Laboral</h3>
              <p className="text-xs text-app-text-secondary">Estado actual del personal</p>
            </div>
            <Clock className="h-5 w-5 text-app-text-secondary" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {statusStats.map((stat, i) => (
              <div key={i} className="text-center p-3 bg-app-bg rounded-xl">
                <p className="text-2xl font-bold text-app-text">{stat.count}</p>
                <p className="text-xs text-app-text-secondary mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card-uiverse p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-app-text">Distribución por Turno</h3>
              <p className="text-xs text-app-text-secondary">Horario de trabajo</p>
            </div>
            <Wrench className="h-5 w-5 text-app-text-secondary" />
          </div>

          <div className="space-y-3">
            {shiftStats.map((stat, i) => {
              const percentage = totalEmployees > 0 ? (stat.count / totalEmployees) * 100 : 0;
              return (
                <div key={i}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-app-text">{stat.label}</span>
                    <span className="text-app-text-secondary font-semibold">
                      {stat.count} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-app-bg rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary-600 h-full rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card-uiverse p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-semibold text-app-text">Empleados Recientes</h3>
            <p className="text-xs text-app-text-secondary">Últimas incorporaciones</p>
          </div>
          <Calendar className="h-5 w-5 text-app-text-secondary" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-app-border">
                <th className="text-left text-xs font-semibold text-app-text-secondary uppercase tracking-wide py-3 px-4">
                  Empleado
                </th>
                <th className="text-left text-xs font-semibold text-app-text-secondary uppercase tracking-wide py-3 px-4">
                  Categoría
                </th>
                <th className="text-left text-xs font-semibold text-app-text-secondary uppercase tracking-wide py-3 px-4">
                  Centro
                </th>
                <th className="text-left text-xs font-semibold text-app-text-secondary uppercase tracking-wide py-3 px-4">
                  Turno
                </th>
                <th className="text-left text-xs font-semibold text-app-text-secondary uppercase tracking-wide py-3 px-4">
                  Estado
                </th>
                <th className="text-left text-xs font-semibold text-app-text-secondary uppercase tracking-wide py-3 px-4">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Fecha Alta
                </th>
              </tr>
            </thead>
            <tbody>
              {recentEmployees.map((emp) => (
                <tr
                  key={emp.id}
                  className="border-b border-app-border last:border-0 hover:bg-app-bg"
                >
                  <td className="py-3 px-4">
                    <p className="text-sm font-semibold text-app-text">
                      {emp.name} {emp.last_name1}
                    </p>
                    <p className="text-xs text-app-text-secondary">{emp.email}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs font-medium text-app-text bg-app-bg px-2 py-1 rounded">
                      {categoryMap[emp.category_id] || emp.category_id}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-app-text-secondary">{wcNameMap[emp.work_center_id] || emp.work_center_id}</td>
                  <td className="py-3 px-4">
                    <span className="text-xs text-app-text-secondary">
                      {emp.start_time}-{emp.end_time}
                    </span>
                  </td>
                  <td className="py-3 px-4">{getStatusBadge(emp.status_id)}</td>
                  <td className="py-3 px-4 text-sm text-app-text-secondary">
                    {formatDate(emp.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
