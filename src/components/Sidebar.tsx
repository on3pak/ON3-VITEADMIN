import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardViewType } from '../types';
import {
  LayoutDashboard, Users, UserSquare,
  ShieldCheck, LogOut, KeyRound, Lock,
  Truck, Briefcase, Building2, ClipboardList, Package,
  Settings, ChevronDown, User, Shield,
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

const dashboardItems = [
  { id: 'USER_DASHBOARD' as DashboardViewType, label: 'Usuarios', icon: <LayoutDashboard className="h-5 w-5" />, description: 'Estadísticas y métricas' },
  { id: 'EMPLOYEE_DASHBOARD' as DashboardViewType, label: 'Empleados', icon: <Briefcase className="h-5 w-5" />, description: 'Panel de empleados' },
  { id: 'VEHICLE_DASHBOARD' as DashboardViewType, label: 'Vehículos', icon: <Truck className="h-5 w-5" />, description: 'Panel de vehículos' },
  { id: 'WORK_CENTERS_DASHBOARD' as DashboardViewType, label: 'Centros', icon: <Building2 className="h-5 w-5" />, description: 'Panel de centros' },
  { id: 'SERVICES_DASHBOARD' as DashboardViewType, label: 'Servicios', icon: <ClipboardList className="h-5 w-5" />, description: 'Panel de servicios' },
  { id: 'INVENTORY_DASHBOARD' as DashboardViewType, label: 'Inventario', icon: <Package className="h-5 w-5" />, description: 'Panel de inventario' },
];

const adminItems = (role?: string) => {
  if (!canSeeUserCrud(role)) return [];
  return [
    { id: 'USERS_CRUD' as DashboardViewType, label: 'Gestión Usuarios', icon: <Users className="h-5 w-5" />, description: 'CRUD de cuentas', disabled: !canAccessUserCrud(role) },
    { id: 'EMPLOYEES_CRUD' as DashboardViewType, label: 'Gestión Empleados', icon: <UserSquare className="h-5 w-5" />, description: 'CRUD de empleados', disabled: !canAccessUserCrud(role) },
    { id: 'VEHICLES_CRUD' as DashboardViewType, label: 'Gestión Vehículos', icon: <Truck className="h-5 w-5" />, description: 'CRUD de vehículos', disabled: !canAccessUserCrud(role) },
    { id: 'WORK_CENTERS_CRUD' as DashboardViewType, label: 'Gestión Centros', icon: <Building2 className="h-5 w-5" />, description: 'CRUD de centros', disabled: !canAccessUserCrud(role) },
    { id: 'SERVICES_CRUD' as DashboardViewType, label: 'Gestión Servicios', icon: <ClipboardList className="h-5 w-5" />, description: 'CRUD de servicios', disabled: !canAccessUserCrud(role) },
    { id: 'INVENTORY_CRUD' as DashboardViewType, label: 'Gestión Inventario', icon: <Package className="h-5 w-5" />, description: 'Ropa, EPIs y Maquinaria', disabled: !canAccessUserCrud(role) },
  ];
};

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<'dashboard' | 'admin'>('dashboard');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isDashboardView = [
    'USER_DASHBOARD', 'EMPLOYEE_DASHBOARD', 'VEHICLE_DASHBOARD',
    'WORK_CENTERS_DASHBOARD', 'SERVICES_DASHBOARD', 'INVENTORY_DASHBOARD',
  ].includes(currentView);

  const items = activeSection === 'dashboard' ? dashboardItems : adminItems(user?.role);

  const handleSectionChange = (section: 'dashboard' | 'admin') => {
    setActiveSection(section);
    const target = section === 'dashboard' ? dashboardItems[0] : adminItems(user?.role)[0];
    if (target && !target.disabled) {
      setView(target.id);
    }
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'ROOT': return 'bg-purple-500/10 text-purple-700 border-purple-200';
      case 'ADMIN': return 'bg-primary-500/10 text-primary-700 border-primary-200';
      case 'MANAGER': return 'bg-amber-500/10 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
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
        fixed inset-y-0 left-0 z-30 flex
        w-[280px] transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Primary Icon Bar */}
        <div className="w-[60px] bg-white border-r border-app-border flex flex-col items-center py-3 shrink-0">
          {/* Brand Icon */}
          <button
            onClick={() => { setView('USER_DASHBOARD'); setSidebarOpen?.(false); }}
            className="p-2 rounded-xl bg-primary-500 text-white shadow-sm shadow-primary-500/20 mb-4 hover:bg-primary-600 transition-colors"
          >
            <ShieldCheck className="h-5 w-5" />
          </button>

          <div className="flex-1 flex flex-col items-center gap-3">
            {/* Dashboard Section Icon */}
            <button
              onClick={() => handleSectionChange('dashboard')}
              className={`p-2.5 rounded-xl transition-all ${
                activeSection === 'dashboard'
                  ? 'bg-primary-50 text-primary-600 shadow-xs'
                  : 'text-app-text-secondary hover:bg-app-bg hover:text-app-text'
              }`}
              title="Dashboard"
            >
              <LayoutDashboard className="h-5 w-5" />
            </button>

            {/* Admin Section Icon */}
            {canSeeUserCrud(user?.role) && (
              <button
                onClick={() => handleSectionChange('admin')}
                className={`p-2.5 rounded-xl transition-all ${
                  activeSection === 'admin'
                    ? 'bg-primary-50 text-primary-600 shadow-xs'
                    : 'text-app-text-secondary hover:bg-app-bg hover:text-app-text'
                }`}
                title="Administración"
              >
                <Shield className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* User Avatar at bottom */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="mt-auto p-1 rounded-xl hover:bg-app-bg transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-app-bg border border-app-border flex items-center justify-center overflow-hidden group-hover:border-primary-200 transition-colors">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="h-4 w-4 text-app-text-secondary" />
                )}
              </div>
            </button>

            {userDropdownOpen && (
              <div className="absolute left-full bottom-0 ml-2 w-56 bg-white rounded-xl shadow-lg border border-app-border py-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="px-4 py-2.5 border-b border-app-border">
                  <p className="text-sm font-semibold text-app-text">{user?.full_name}</p>
                  <p className="text-xs text-app-text-secondary">@{user?.username}</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border mt-1.5 ${getRoleBadgeStyle(user?.role || '')}`}>
                    <KeyRound className="h-2.5 w-2.5 mr-1 inline" />
                    {user?.role}
                  </span>
                </div>
                <button
                  onClick={() => { setView('PROFILE'); setUserDropdownOpen(false); setSidebarOpen?.(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-app-text hover:bg-app-bg flex items-center gap-2.5 transition-colors"
                >
                  <User className="h-4 w-4 text-app-text-secondary" />
                  Mi Perfil
                </button>
                <button
                  onClick={() => { logout(); setUserDropdownOpen(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Secondary Menu Panel */}
        <div className="flex-1 bg-white border-r border-app-border flex flex-col min-w-0">
          {/* Brand */}
          <div className="flex items-center gap-2.5 px-4 h-[60px] shrink-0 border-b border-app-border">
            <div>
              <h1 className="font-bold text-sm text-app-text tracking-tight">ON3ADMIN</h1>
              <p className="text-[10px] text-primary-600 font-semibold tracking-wider">SECURE SUITE</p>
            </div>
          </div>

          {/* Section Label */}
          <div className="px-4 pt-4 pb-1">
            <p className="text-[10px] font-bold text-app-text-secondary uppercase tracking-[0.12em]">
              {activeSection === 'dashboard' ? 'Dashboard' : 'Administración'}
            </p>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 px-3 pb-3 overflow-y-auto space-y-0.5">
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
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : isDisabled
                        ? 'opacity-40 cursor-not-allowed text-app-text-secondary'
                        : 'text-app-text hover:bg-app-bg hover:text-app-text'
                    }
                  `}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary-500 rounded-full" />
                  )}

                  <div className={`p-1.5 rounded-lg shrink-0 ${
                    isActive ? 'bg-primary-100 text-primary-600' : 'text-app-text-secondary'
                  }`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm leading-tight">{item.label}</p>
                      {isDisabled && <Lock className="h-3 w-3 text-amber-500" />}
                    </div>
                    <p className={`text-[11px] font-normal truncate mt-0.5 ${isActive ? 'text-primary-500/70' : 'text-app-text-secondary/70'}`}>
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};
