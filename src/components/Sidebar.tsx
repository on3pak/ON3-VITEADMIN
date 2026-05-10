import React from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardViewType } from '../types';
import { 
  LayoutDashboard, 
  Users, 
  UserCog,
  ShieldCheck, 
  LogOut, 
  KeyRound, 
  Terminal,
  Lock,
  Shield,
  Key,
  Database,
  Fingerprint,
  UserSquare,
  Briefcase,
  BookOpen,
  Truck
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
        id: 'OVERVIEW' as DashboardViewType,
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
    ] : [],
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'ROOT':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'ADMIN':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'MANAGER':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen?.(false)}
        />
      )}
      
      <aside className={`
        w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 h-screen sticky top-0 
        fixed lg:relative z-30 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:w-16 lg:block xl:w-56
      `}>
      {/* Brand Logo Header */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3 bg-slate-950/40">
        <div className="p-2 rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-white tracking-wide">ON3ADMIN Panel</h1>
          <p className="text-xs text-indigo-400 font-semibold tracking-wider">SECURE ADM SUITE</p>
        </div>
      </div>

      {/* Authenticated Persona Widget */}
      {user && (
        <div className="p-5 border-b border-slate-800/60 bg-slate-950/20 flex items-center gap-3">
          <img 
            src={user.avatarUrl} 
            alt={user.fullName} 
            className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 p-1 shadow-sm"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white truncate">{user.fullName}</h3>
            <p className="text-xs text-slate-400 truncate mb-1">@{user.username}</p>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getRoleBadgeStyle(user.role)}`}>
              <KeyRound className="h-2.5 w-2.5 mr-1 inline" />
              {user.role}
            </span>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
        {Object.entries(menuItems).map(([category, items]) => (
          items.length > 0 && (
            <div key={category}>
              <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">{category}</p>
              <div className="space-y-1">
                {items.map((item) => {
                  const isActive = currentView === item.id;
                  const isDisabled = (item as { disabled?: boolean }).disabled;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => !isDisabled && setView(item.id)}
                      disabled={isDisabled}
                      className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-xl text-left transition-all group ${
                        isActive 
                          ? 'bg-indigo-600 text-white font-medium shadow-md shadow-indigo-600/10' 
                          : isDisabled
                            ? 'opacity-50 cursor-not-allowed text-slate-500'
                            : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg transition-colors ${
                        isActive ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                      }`}>
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm leading-tight">{item.label}</p>
                          {isDisabled && <Lock className="h-3 w-3 text-amber-500" />}
                        </div>
                        <p className={`text-[11px] font-normal truncate mt-0.5 ${isActive ? 'text-indigo-200' : 'text-slate-500'}`}>
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

      {/* Footer Logout Option */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/30">
        <button
          onClick={logout}
          className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
        >
          <div className="flex items-center gap-3">
            <LogOut className="h-4 w-4" />
            <span>Cerrar Sesión</span>
          </div>
          <span className="text-[10px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded font-mono group-hover:bg-rose-500/20">JWT</span>
        </button>
      </div>
    </aside>
    </>
  );
};
