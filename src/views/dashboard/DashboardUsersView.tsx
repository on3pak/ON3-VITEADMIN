import React, { useMemo, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUsers } from '../../context/UserContext';
import {
  Users,
  UserCheck,
  UserX,
  Shield,
  TrendingUp,
  Clock,
  Mail,
  Calendar
} from 'lucide-react';

export const DashboardUsersView: React.FC = () => {
  const { user: loggedInUser } = useAuth();
  const { users, loadUsers } = useUsers();

  const userCityId = loggedInUser?.role === 'root' ? undefined : loggedInUser?.city_id;

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const scopedUsers = useMemo(
    () => userCityId ? users.filter(u => u.city_id === userCityId) : users,
    [users, userCityId]
  );

  const activeUsers = scopedUsers.filter(u => u.status.toLowerCase() === 'active');
  const inactiveUsers = scopedUsers.filter(u => u.status.toLowerCase() === 'inactive');
  const totalUsers = scopedUsers.length;
  const activeRate = totalUsers > 0 ? (activeUsers.length / totalUsers) * 100 : 0;

  const countByRole = (role: string) => scopedUsers.filter(u => u.role === role).length;

  const recentUsers = [...scopedUsers]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const stats = [
    { title: 'Total Usuarios', value: totalUsers, icon: <Users className="h-5 w-5" />, color: 'primary' },
    { title: 'Usuarios Activos', value: activeUsers.length, icon: <UserCheck className="h-5 w-5" />, color: 'emerald' },
    { title: 'Usuarios Inactivos', value: inactiveUsers.length, icon: <UserX className="h-5 w-5" />, color: 'rose' },
    { title: 'Tasa de Actividad', value: `${activeRate.toFixed(0)}%`, icon: <TrendingUp className="h-5 w-5" />, color: 'amber' },
  ];

  const roleStats = [
    { label: 'root', count: countByRole('root'), color: 'bg-purple-500' },
    { label: 'admin', count: countByRole('admin'), color: 'bg-blue-500' },
    { label: 'manager', count: countByRole('manager'), color: 'bg-amber-500' },
    { label: 'user', count: countByRole('user'), color: 'bg-app-bg0' },
  ];

  const statColor = (color: string) => {
    const map: Record<string, { bg: string, border: string, text: string }> = {
      primary: { bg: 'bg-primary-50 dark:bg-primary-900/20', border: 'border-primary-100 dark:border-primary-800', text: 'text-primary-600 dark:text-primary-300' },
      emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-100 dark:border-emerald-800', text: 'text-emerald-600 dark:text-emerald-300' },
      rose: { bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-rose-100 dark:border-rose-800', text: 'text-rose-600 dark:text-rose-300' },
      amber: { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-100 dark:border-amber-800', text: 'text-amber-600 dark:text-amber-300' },
    };
    return map[color] || map.primary;
  };

  const getStatusBadge = (status: string) => {
    const styles = status === 'ACTIVE'
      ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
      : 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
    return (
      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${styles}`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-app-card p-5 rounded-2xl border border-app-card-border shadow-xs"
          >
            <div className={`p-2.5 rounded-xl ${statColor(stat.color).bg} border ${statColor(stat.color).border} w-fit mb-3`}>
              <div className={`${statColor(stat.color).text}`}>{stat.icon}</div>
            </div>
            <p className="text-xs font-medium text-app-text-secondary uppercase tracking-wide">
              {stat.title}
            </p>
            <p className="text-2xl font-bold text-app-text mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-app-card p-5 rounded-2xl border border-app-card-border shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-app-text">Distribución por Rol</h3>
              <p className="text-xs text-app-text-secondary">Usuarios por nivel de acceso</p>
            </div>
            <Shield className="h-5 w-5 text-app-text-secondary" />
          </div>

          <div className="space-y-4">
            {roleStats.map((stat, i) => {
              const percentage = totalUsers > 0 ? (stat.count / totalUsers) * 100 : 0;
              return (
                <div key={i}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-medium text-app-text">{stat.label}</span>
                    <span className="text-app-text-secondary font-semibold">
                      {stat.count} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-app-bg rounded-full h-2.5 overflow-hidden">
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

        <div className="bg-app-card p-5 rounded-2xl border border-app-card-border shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-app-text">Información de Sesión</h3>
              <p className="text-xs text-app-text-secondary">Tu cuenta actual</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-app-bg rounded-xl">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <Users className="h-4 w-4 text-primary-600 dark:text-primary-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-app-text-secondary">Usuario</p>
                <p className="text-sm font-semibold text-app-text truncate">
                  {loggedInUser?.full_name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-app-bg rounded-xl">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Mail className="h-4 w-4 text-blue-600 dark:text-blue-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-app-text-secondary">Email</p>
                <p className="text-sm font-semibold text-app-text truncate">
                  {loggedInUser?.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-app-bg rounded-xl">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Shield className="h-4 w-4 text-purple-600 dark:text-purple-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-app-text-secondary">Rol</p>
                  <p className="text-sm font-semibold text-app-text">{loggedInUser?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-app-card p-5 rounded-2xl border border-app-card-border shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-semibold text-app-text">Usuarios Recientes</h3>
            <p className="text-xs text-app-text-secondary">Últimos registros en el sistema</p>
          </div>
          <Clock className="h-5 w-5 text-app-text-secondary" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-app-border">
                <th className="text-left text-xs font-semibold text-app-text-secondary uppercase tracking-wide py-3 px-4">
                  Usuario
                </th>
                <th className="text-left text-xs font-semibold text-app-text-secondary uppercase tracking-wide py-3 px-4">
                  Email
                </th>
                <th className="text-left text-xs font-semibold text-app-text-secondary uppercase tracking-wide py-3 px-4">
                  Rol
                </th>
                <th className="text-left text-xs font-semibold text-app-text-secondary uppercase tracking-wide py-3 px-4">
                  Estado
                </th>
                <th className="text-left text-xs font-semibold text-app-text-secondary uppercase tracking-wide py-3 px-4">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Fecha de Creación
                </th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u, i) => (
                <tr
                  key={u.id}
                  className="border-b border-app-border last:border-0 hover:bg-app-bg"
                >
                  <td className="py-3 px-4">
                    <p className="text-sm font-semibold text-app-text">{u.full_name}</p>
                    <p className="text-xs text-app-text-secondary">@{u.username}</p>
                  </td>
                  <td className="py-3 px-4 text-sm text-app-text-secondary">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className="text-xs font-medium text-app-text bg-app-bg px-2 py-1 rounded">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">{getStatusBadge(u.status)}</td>
                  <td className="py-3 px-4 text-sm text-app-text-secondary">
                    {formatDate(u.created_at)}
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

