import React from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardViewType } from '../types';
import {
  LayoutDashboard, Users, UserSquare,
  ShieldCheck, LogOut, KeyRound, Lock,
  Truck, Briefcase, Building2, ClipboardList, Package,
} from 'lucide-react';

interface SidebarProps {
  currentView: DashboardViewType;
  setView: (view: DashboardViewType) => void;
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
}

const canAccessUserCrud = (role?: string): boolean => {
  return role === 'ROOT' || role === 'ADMIN';
};

const canSeeUserCrud = (role?: string): boolean => {
  return role === 'ROOT' || role === 'ADMIN' || role === 'MANAGER';
};

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();

  const menuItems = {
    DASHBOARD: [
      {
        id: 'USER_DASHBOARD' as DashboardViewType,
        label: 'Usuarios',
        icon: <LayoutDashboard className="h-5 w-5" />,
        description: 'Estadísticas y métricas',
      },
      {
        id: 'EMPLOYEE_DASHBOARD' as DashboardViewType,
        label: 'Empleados',
        icon: <Briefcase className="h-5 w-5" />,
        description: 'Panel de empleados',
      },
      {
        id: 'VEHICLE_DASHBOARD' as DashboardViewType,
        label: 'Vehículos',
        icon: <Truck className="h-5 w-5" />,
        description: 'Panel de vehículos',
      },
      {
        id: 'WORK_CENTERS_DASHBOARD' as DashboardViewType,
        label: 'Centros',
        icon: <Building2 className="h-5 w-5" />,
        description: 'Panel de centros',
      },
      {
        id: 'SERVICES_DASHBOARD' as DashboardViewType,
        label: 'Servicios',
        icon: <ClipboardList className="h-5 w-5" />,
        description: 'Panel de servicios',
      },
      {
        id: 'INVENTORY_DASHBOARD' as DashboardViewType,
        label: 'Inventario',
        icon: <Package className="h-5 w-5" />,
        description: 'Panel de inventario',
      },
    ],
    ADMIN: canSeeUserCrud(user?.role) ? [
      {
        id: 'USERS_CRUD' as DashboardViewType,
        label: 'Gestión Usuarios',
        icon: <Users className="h-5 w-5" />,
        description: 'CRUD de cuentas',
        disabled: !canAccessUserCrud(user?.role),
      },
      {
        id: 'EMPLOYEES_CRUD' as DashboardViewType,
        label: 'Gestión Empleados',
        icon: <UserSquare className="h-5 w-5" />,
        description: 'CRUD de empleados',
        disabled: !canAccessUserCrud(user?.role),
      },
      {
        id: 'VEHICLES_CRUD' as DashboardViewType,
        label: 'Gestión Vehículos',
        icon: <Truck className="h-5 w-5" />,
        description: 'CRUD de vehículos',
        disabled: !canAccessUserCrud(user?.role),
      },
      {
        id: 'WORK_CENTERS_CRUD' as DashboardViewType,
        label: 'Gestión Centros',
        icon: <Building2 className="h-5 w-5" />,
        description: 'CRUD de centros',
        disabled: !canAccessUserCrud(user?.role),
      },
      {
        id: 'SERVICES_CRUD' as DashboardViewType,
        label: 'Gestión Servicios',
        icon: <ClipboardList className="h-5 w-5" />,
        description: 'CRUD de servicios',
        disabled: !canAccessUserCrud(user?.role),
      },
      {
        id: 'INVENTORY_CRUD' as DashboardViewType,
        label: 'Gestión Inventario',
        icon: <Package className="h-5 w-5" />,
        description: 'Ropa, EPIs y Maquinaria',
        disabled: !canAccessUserCrud(user?.role),
      },
    ] : [],
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'ROOT':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 'ADMIN':
        return 'bg-primary-500/15 text-primary-300 border-primary-500/30';
      case 'MANAGER':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      default:
        return 'bg-sidebar-muted/30 text-sidebar-text border-sidebar-border';
    }
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen?.(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-30
        bg-sidebar text-sidebar-text flex flex-col
        w-[265px] transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 h-[70px] shrink-0 border-b border-sidebar-border">
          <div className="p-2 rounded-lg bg-primary-500 text-white shadow-lg shadow-primary-500/20 shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="overflow-hidden">
            <h1 className="font-bold text-base text-white tracking-tight">ON3ADMIN</h1>
            <p className="text-[11px] text-primary-400 font-semibold tracking-wider">SECURE SUITE</p>
          </div>
        </div>

        {/* User Widget */}
        {user && (
          <button
            onClick={() => { setView('PROFILE'); setSidebarOpen?.(false); }}
            className="w-full text-left px-5 py-4 border-b border-sidebar-border flex items-center gap-3 shrink-0 hover:bg-sidebar-hover transition-colors group"
          >
            <img
              src={user.avatar_url}
              alt={user.full_name}
              className="w-10 h-10 rounded-lg bg-sidebar-muted border border-sidebar-border p-0.5 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-white truncate">{user.full_name}</h3>
              <p className="text-xs text-sidebar-text truncate">@{user.username}</p>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border mt-1 ${getRoleBadgeStyle(user.role)}`}>
                <KeyRound className="h-2.5 w-2.5 mr-1 inline" />
                {user.role}
              </span>
            </div>
          </button>
        )}

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-5 overflow-y-auto">
          {Object.entries(menuItems).map(([category, items]) => (
            items.length > 0 && (
              <div key={category}>
                <p className="px-3 text-[10px] font-bold text-sidebar-text uppercase tracking-[0.12em] mb-2">{category}</p>
                <div className="space-y-0.5">
                  {items.map((item) => {
                    const isActive = currentView === item.id;
                    const isDisabled = (item as { disabled?: boolean }).disabled;

                    return (
                      <button
                        key={item.id}
                        onClick={() => !isDisabled && (setView(item.id), setSidebarOpen?.(false))}
                        disabled={isDisabled}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all relative
                          ${isActive
                            ? 'bg-primary-500/10 text-white font-medium'
                            : isDisabled
                              ? 'opacity-40 cursor-not-allowed text-sidebar-text'
                              : 'text-sidebar-text hover:bg-sidebar-hover hover:text-white'
                          }
                        `}
                      >
                        {/* Active indicator */}
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary-400 rounded-full" />
                        )}

                        <div className={`p-1.5 rounded-lg shrink-0 ${
                          isActive ? 'bg-primary-500/20 text-primary-300' : 'text-sidebar-text'
                        }`}>
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm leading-tight">{item.label}</p>
                            {isDisabled && <Lock className="h-3 w-3 text-amber-500/70" />}
                          </div>
                          <p className={`text-[11px] font-normal truncate mt-0.5 ${isActive ? 'text-primary-300/70' : 'text-sidebar-text/60'}`}>
                            {item.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )
          ))}
        </nav>

        {/* Logout */}
        <div className="shrink-0 border-t border-sidebar-border p-3">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-text hover:text-rose-300 hover:bg-rose-500/10 transition-all group"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left">Cerrar Sesión</span>
            <span className="text-[10px] bg-sidebar-muted text-sidebar-text/50 px-1.5 py-0.5 rounded font-mono">JWT</span>
          </button>
        </div>
      </aside>
    </>
  );
};
