import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardViewType } from '../types';
import {
  LayoutDashboard, Users, UserSquare,
  ShieldCheck, LogOut, KeyRound,
  Truck, Briefcase, Building2, ClipboardList, Package,
  Settings, ChevronDown, User, Shield,
  Moon, Grid,
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
    { id: 'USERS_CRUD' as DashboardViewType, label: 'Usuarios', icon: <Users className="h-5 w-5" />, description: 'CRUD de cuentas', disabled: !canAccessUserCrud(role) },
    { id: 'EMPLOYEES_CRUD' as DashboardViewType, label: 'Empleados', icon: <UserSquare className="h-5 w-5" />, description: 'CRUD de empleados', disabled: !canAccessUserCrud(role) },
    { id: 'VEHICLES_CRUD' as DashboardViewType, label: 'Vehículos', icon: <Truck className="h-5 w-5" />, description: 'CRUD de vehículos', disabled: !canAccessUserCrud(role) },
    { id: 'WORK_CENTERS_CRUD' as DashboardViewType, label: 'Centros', icon: <Building2 className="h-5 w-5" />, description: 'CRUD de centros', disabled: !canAccessUserCrud(role) },
    { id: 'SERVICES_CRUD' as DashboardViewType, label: 'Servicios', icon: <ClipboardList className="h-5 w-5" />, description: 'CRUD de servicios', disabled: !canAccessUserCrud(role) },
    { id: 'INVENTORY_CRUD' as DashboardViewType, label: 'Inventario', icon: <Package className="h-5 w-5" />, description: 'Ropa, EPIs y Maquinaria', disabled: !canAccessUserCrud(role) },
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
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
        w-[290px] transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Primary - Icon Bar */}
        <div className="w-[70px] bg-[#f8f9fc] border-r border-app-border flex flex-col items-center py-5 shrink-0">
          {/* Brand Icon */}
          <a
            onClick={() => { setView('USER_DASHBOARD'); setSidebarOpen?.(false); }}
            className="flex items-center justify-center size-9 rounded-md bg-gradient-to-br from-primary-500 to-primary-700 text-white hover:from-primary-600 hover:to-primary-800 transition-all cursor-pointer shadow-sm"
          >
            <span className="text-white font-bold text-xs tracking-tight">ON3</span>
          </a>

          <div className="w-5 h-px bg-app-border mt-4 mb-2" />

          {/* Navigation Icons */}
          <div className="flex-1 flex flex-col items-center gap-1.5 mt-4">
            <button
              onClick={() => handleSectionChange('dashboard')}
              className={`flex items-center justify-center size-9 rounded-md border transition-all ${
                activeSection === 'dashboard'
                  ? 'bg-white text-primary-600 border-app-border shadow-xs'
                  : 'border-transparent text-app-text-secondary hover:bg-white hover:text-app-text hover:border-app-border'
              }`}
              title="Dashboard"
            >
              <LayoutDashboard className="h-[18px] w-[18px]" />
            </button>

            {canSeeUserCrud(user?.role) && (
              <button
                onClick={() => handleSectionChange('admin')}
                className={`flex items-center justify-center size-9 rounded-md border transition-all ${
                  activeSection === 'admin'
                    ? 'bg-white text-primary-600 border-app-border shadow-xs'
                    : 'border-transparent text-app-text-secondary hover:bg-white hover:text-app-text hover:border-app-border'
                }`}
                title="Administración"
              >
                <Shield className="h-[18px] w-[18px]" />
              </button>
            )}
          </div>

          {/* Footer Icons + User */}
          <div className="flex flex-col items-center gap-3">
            <button
              className="flex items-center justify-center size-9 rounded-md border border-transparent text-app-text-secondary hover:bg-white hover:text-app-text hover:border-app-border transition-all"
              title="Apps"
            >
              <Grid className="h-[18px] w-[18px]" />
            </button>

            <div className="w-6 h-px bg-app-border" />

            {/* User Avatar */}
            <div className="relative pt-1" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="shrink-0 cursor-pointer"
              >
                <div className="size-9 rounded-full ring-2 ring-white overflow-hidden border-2 border-green-500">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">
                      {user?.full_name ? getInitials(user.full_name) : <User className="h-4 w-4" />}
                    </div>
                  )}
                </div>
              </button>

              {userDropdownOpen && (
                <div className="absolute left-full bottom-0 ml-2 w-[250px] bg-white rounded-xl shadow-lg border border-app-border overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                  {/* User Info Header */}
                  <div className="flex items-center justify-between px-3 py-3 gap-1.5">
                    <div className="flex items-center gap-2.5">
                      <div className="size-9 shrink-0 rounded-full ring-2 ring-green-500 overflow-hidden border-2 border-white">
                        {user?.avatar_url ? (
                          <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">
                            {user?.full_name ? getInitials(user.full_name) : <User className="h-4 w-4" />}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm text-app-text font-semibold leading-none">{user?.full_name}</span>
                        <span className="text-xs text-app-text-secondary hover:text-primary-600 font-medium leading-none">{user?.email}</span>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getRoleBadgeStyle(user?.role || '')}`}>
                      {user?.role === 'ROOT' ? 'Root' : user?.role === 'ADMIN' ? 'Admin' : user?.role === 'MANAGER' ? 'Mngr' : 'User'}
                    </span>
                  </div>

                  <div className="border-t border-app-border" />

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={() => { setView('PROFILE'); setUserDropdownOpen(false); setSidebarOpen?.(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-app-text hover:bg-app-bg transition-colors"
                    >
                      <User className="h-4 w-4 text-app-text-secondary" />
                      Mi Perfil
                    </button>
                    <button
                      onClick={() => { setView('UTILS'); setUserDropdownOpen(false); setSidebarOpen?.(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-app-text hover:bg-app-bg transition-colors"
                    >
                      <Settings className="h-4 w-4 text-app-text-secondary" />
                      Configuración
                    </button>
                  </div>

                  <div className="border-t border-app-border" />

                  <div className="px-3 py-2">
                    <div className="flex items-center gap-2 justify-between mb-2">
                      <span className="flex items-center gap-2 text-sm text-app-text-secondary">
                        <Moon className="h-4 w-4" />
                        Modo oscuro
                      </span>
                      <div className="w-9 h-5 bg-app-border rounded-full relative cursor-pointer">
                        <div className="w-3.5 h-3.5 bg-white rounded-full shadow-xs absolute top-0.5 left-0.5" />
                      </div>
                    </div>
                    <button
                      onClick={() => { logout(); setUserDropdownOpen(false); }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 border border-app-border rounded-lg transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Secondary - Menu Panel */}
        <div className="flex-1 bg-white border-r border-app-border flex flex-col min-w-0">
          {/* Brand Header */}
          <div className="flex items-center justify-between px-4 h-[60px] shrink-0 border-b border-app-border">
            <div>
              <h1 className="font-bold text-sm text-app-text tracking-tight">ON3ADMIN</h1>
              <p className="text-[10px] text-primary-600 font-semibold tracking-wider uppercase">Secure Suite</p>
            </div>
          </div>

          {/* Section Dropdown (Metronic-style) */}
          <div className="px-3 pt-3 pb-1">
            <button className="w-full flex items-center justify-between px-2.5 py-2 rounded-md border border-app-border text-sm font-medium text-app-text hover:bg-app-bg transition-colors">
              <span className="flex items-center gap-1.5">
                <LayoutDashboard className="h-[14px] w-[14px] text-app-text-secondary" />
                {activeSection === 'dashboard' ? 'Dashboard' : 'Administración'}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-app-text-secondary" />
            </button>
          </div>

          {/* Section Group Label */}
          <div className="px-[18px] pt-4 pb-1">
            <p className="text-[10px] font-semibold text-app-text-secondary uppercase tracking-[0.1em]">
              {activeSection === 'dashboard' ? 'General' : 'Administración'}
            </p>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 px-3 pb-3 overflow-y-auto space-y-px">
            {items.map((item) => {
              const isActive = currentView === item.id;
              const isDisabled = (item as { disabled?: boolean }).disabled;

              return (
                <button
                  key={item.id}
                  onClick={() => !isDisabled && (setView(item.id), setSidebarOpen?.(false))}
                  disabled={isDisabled}
                  className={`
                    w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md border text-left transition-all
                    ${isActive
                      ? 'bg-app-bg border-app-border text-primary-600 font-medium'
                      : isDisabled
                        ? 'opacity-40 cursor-not-allowed text-app-text-secondary border-transparent'
                        : 'border-transparent text-app-text hover:bg-app-bg hover:border-app-border hover:text-app-text'
                    }
                  `}
                >
                  <span className={`shrink-0 ${isActive ? 'text-primary-600' : 'text-app-text-secondary'}`}>
                    {item.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm leading-tight">{item.label}</p>
                      {isDisabled && <KeyRound className="h-3 w-3 text-amber-500" />}
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
