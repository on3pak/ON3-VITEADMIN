import React, { useMemo } from 'react';
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
  const { employees } = useEmployees();

  const userCityId = loggedInUser?.role === 'ROOT' ? undefined : loggedInUser?.city_id;

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
        : 'bg-slate-500'
    };
  });

  const workCenterStats = uniqueWorkCenterIds.slice(0, 5).map(centerId => ({
    centerId,
    center: wcNameMap[centerId] || centerId,
    count: countByWorkCenter(centerId)
  }));

  const statusStats = [
    { status: 'es-1', label: 'Trabajando', count: countByStatus('es-1'), color: 'emerald' },
    { status: 'es-2', label: 'Descanso', count: countByStatus('es-2'), color: 'blue' },
    { status: 'es-3', label: 'Baja', count: countByStatus('es-3'), color: 'rose' },
    { status: 'es-4', label: 'Días Propios', count: countByStatus('es-4'), color: 'amber' },
    { status: 'es-5', label: 'Días Acumulados', count: countByStatus('es-5'), color: 'purple' },
    { status: 'es-6', label: 'Vacaciones', count: countByStatus('es-6'), color: 'cyan' },
  ];

  const shiftStats = [
    { shift: 's-1', label: 'Mañana', count: scopedEmployees.filter(e => e.shift === 's-1').length },
    { shift: 's-2', label: 'Tarde', count: scopedEmployees.filter(e => e.shift === 's-2').length },
    { shift: 's-3', label: 'Noche', count: scopedEmployees.filter(e => e.shift === 's-3').length },
  ];

  const recentEmployees = [...scopedEmployees]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const getStatusLabel = (statusId: string) => {
    const labels: Record<string, string> = {
      'es-1': 'Trabajando',
      'es-2': 'Descanso',
      'es-3': 'Baja',
      'es-4': 'Días Propios',
      'es-5': 'Días Acumulados',
      'es-6': 'Vacaciones',
    };
    return labels[statusId] || statusId;
  };

  const getStatusBadge = (statusId: string) => {
    const colors: Record<string, string> = {
      'es-1': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'es-2': 'bg-blue-50 text-blue-700 border-blue-200',
      'es-3': 'bg-rose-50 text-rose-700 border-rose-200',
      'es-4': 'bg-amber-50 text-amber-700 border-amber-200',
      'es-5': 'bg-purple-50 text-purple-700 border-purple-200',
      'es-6': 'bg-cyan-50 text-cyan-700 border-cyan-200',
    };
    return (
      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${colors[statusId] || 'bg-slate-50 text-slate-700'}`}>
        {getStatusLabel(statusId)}
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const stats = [
    {
      title: 'Total Empleados',
      value: totalEmployees,
      icon: <Users className="h-5 w-5" />,
      color: 'indigo',
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
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs"
          >
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
              <h3 className="font-semibold text-slate-800">Distribución por Categoría</h3>
              <p className="text-xs text-slate-500">Empleados por puesto</p>
            </div>
            <Briefcase className="h-5 w-5 text-slate-400" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {categoryStats.map((stat, i) => {
              const percentage = totalEmployees > 0 ? (stat.count / totalEmployees) * 100 : 0;
              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{stat.category}</span>
                    <span className="text-slate-600 font-semibold">
                      {stat.count} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
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

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-slate-800">Por Centro de Trabajo</h3>
              <p className="text-xs text-slate-500">Distribución locations</p>
            </div>
            <MapPin className="h-5 w-5 text-slate-400" />
          </div>

          <div className="space-y-3">
            {workCenterStats.map((stat, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-700">{stat.center}</span>
                <span className="text-sm font-bold text-slate-800">{stat.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-slate-800">Estado Laboral</h3>
              <p className="text-xs text-slate-500">Estado actual del personal</p>
            </div>
            <Clock className="h-5 w-5 text-slate-400" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {statusStats.map((stat, i) => (
              <div key={i} className="text-center p-3 bg-slate-50 rounded-xl">
                <p className="text-2xl font-bold text-slate-800">{stat.count}</p>
                <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-slate-800">Distribución por Turno</h3>
              <p className="text-xs text-slate-500">Horario de trabajo</p>
            </div>
            <Wrench className="h-5 w-5 text-slate-400" />
          </div>

          <div className="space-y-3">
            {shiftStats.map((stat, i) => {
              const percentage = totalEmployees > 0 ? (stat.count / totalEmployees) * 100 : 0;
              return (
                <div key={i}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">{stat.label}</span>
                    <span className="text-slate-600 font-semibold">
                      {stat.count} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-semibold text-slate-800">Empleados Recientes</h3>
            <p className="text-xs text-slate-500">Últimas incorporaciones</p>
          </div>
          <Calendar className="h-5 w-5 text-slate-400" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide py-3 px-4">
                  Empleado
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide py-3 px-4">
                  Categoría
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide py-3 px-4">
                  Centro
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide py-3 px-4">
                  Turno
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide py-3 px-4">
                  Estado
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide py-3 px-4">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Fecha Alta
                </th>
              </tr>
            </thead>
            <tbody>
              {recentEmployees.map((emp) => (
                <tr
                  key={emp.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                >
                  <td className="py-3 px-4">
                    <p className="text-sm font-semibold text-slate-800">
                      {emp.name} {emp.lastName1}
                    </p>
                    <p className="text-xs text-slate-500">{emp.email}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded">
                      {categoryMap[emp.category_id] || emp.category_id}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600">{wcNameMap[emp.work_center_id] || emp.work_center_id}</td>
                  <td className="py-3 px-4">
                    <span className="text-xs text-slate-600">
                      {emp.start_time}-{emp.end_time}
                    </span>
                  </td>
                  <td className="py-3 px-4">{getStatusBadge(emp.status_id)}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">
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