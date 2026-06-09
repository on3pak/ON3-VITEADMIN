import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardViewType, VIEW_ROLES } from '../types';
import {
  LayoutDashboard, Users, UserSquare,
  ShieldCheck, LogOut, KeyRound,
  Truck, Briefcase, Building2, ClipboardList, Package,
  Settings, ChevronDown, User, Shield,
  Moon, Grid, Wrench, CalendarCheck, ClipboardCheck, FileText, FlaskConical,
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

const dashboardItems = (role?: string) => {
  const allItems = [
    { id: 'USER_DASHBOARD' as DashboardViewType, label: 'Usuarios', icon: <Users className="h-5 w-5" />, description: 'Actividad, registros y KPIs' },
    { id: 'EMPLOYEE_DASHBOARD' as DashboardViewType, label: 'Empleados', icon: <UserSquare className="h-5 w-5" />, description: 'Jornada, asistencia y nómina' },
    { id: 'VEHICLE_DASHBOARD' as DashboardViewType, label: 'Vehículos', icon: <Truck className="h-5 w-5" />, description: 'Estado, revisiones y carga' },
    { id: 'WORK_CENTERS_DASHBOARD' as DashboardViewType, label: 'Centros', icon: <Building2 className="h-5 w-5" />, description: 'Operaciones y ocupación' },
    { id: 'SERVICES_DASHBOARD' as DashboardViewType, label: 'Servicios', icon: <ClipboardList className="h-5 w-5" />, description: 'Órdenes, progreso y planificación' },
    { id: 'INVENTORY_DASHBOARD' as DashboardViewType, label: 'Inventario', icon: <Package className="h-5 w-5" />, description: 'Stock, bajas y alertas' },
    { id: 'MACHINERY_DASHBOARD' as DashboardViewType, label: 'Maquinaria', icon: <Wrench className="h-5 w-5" />, description: 'Estado y mantenimiento' },
  ];
  return allItems.filter((item) => (VIEW_ROLES[item.id] || []).includes(role || ''));
};

const adminItems = (role?: string) => {
  if (!canSeeUserCrud(role)) return [];
  return [
    { id: 'USERS_CRUD' as DashboardViewType, label: 'Usuarios', icon: <Users className="h-5 w-5" />, description: 'Roles, permisos y acceso', disabled: !canAccessUserCrud(role) },
    { id: 'EMPLOYEES_CRUD' as DashboardViewType, label: 'Empleados', icon: <UserSquare className="h-5 w-5" />, description: 'Personal, contratos y turnos', disabled: !canAccessUserCrud(role) },
    { id: 'VEHICLES_CRUD' as DashboardViewType, label: 'Vehículos', icon: <Truck className="h-5 w-5" />, description: 'Flota, mantenimiento y combustible', disabled: !canAccessUserCrud(role) },
    { id: 'WORK_CENTERS_CRUD' as DashboardViewType, label: 'Centros', icon: <Building2 className="h-5 w-5" />, description: 'Ubicaciones y áreas de trabajo', disabled: !canAccessUserCrud(role) },
    { id: 'SERVICES_CRUD' as DashboardViewType, label: 'Servicios', icon: <ClipboardList className="h-5 w-5" />, description: 'Tareas, categorías y zonas', disabled: !canAccessUserCrud(role) },
    { id: 'INVENTORY_CRUD' as DashboardViewType, label: 'Inventario', icon: <Package className="h-5 w-5" />, description: 'Ropa y EPIs', disabled: !canAccessUserCrud(role) },
    { id: 'MACHINERY_CRUD' as DashboardViewType, label: 'Maquinaria', icon: <Wrench className="h-5 w-5" />, description: 'Equipos y mantenimiento', disabled: !canAccessUserCrud(role) },
  ];
};

const appsItems = (role?: string) => {
  const items: { id: DashboardViewType; label: string; icon: React.ReactNode; description: string }[] = [];
  if (role === 'MANAGER') {
    items.push({ id: 'SERVICE_REPORT' as DashboardViewType, label: 'Parte de Servicio', icon: <CalendarCheck className="h-5 w-5" />, description: 'Planificación y control diario' });
  }
  if (['ROOT', 'ADMIN', 'MANAGER', 'USER'].includes(role || '')) {
    items.push({ id: 'WORK_REPORT' as DashboardViewType, label: 'Parte de Trabajo', icon: <ClipboardCheck className="h-5 w-5" />, description: 'Registro de tareas y servicios' });
  }
  return items;
};

const utilsItems = (role?: string) => {
  if (!['ROOT', 'ADMIN'].includes(role || '')) return [];
  return [
    { id: 'UTILS_LOGS' as DashboardViewType, label: 'Logs', icon: <FileText className="h-5 w-5" />, description: 'Registro de actividad del sistema' },
    { id: 'UTILS_TESTS' as DashboardViewType, label: 'Tests', icon: <FlaskConical className="h-5 w-5" />, description: 'Pruebas de módulos y componentes' },
  ];
};

const profileItems = [
  { id: 'PROFILE' as DashboardViewType, label: 'Mi Perfil', icon: <User className="h-5 w-5" />, description: 'Información personal' },
  { id: 'PROFILE_CONFIG' as DashboardViewType, label: 'Configuración', icon: <Settings className="h-5 w-5" />, description: 'Ajustes del sistema' },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, sidebarOpen, setSidebarOpen }) => {
  const { user, logout, triggerToast } = useAuth();
  const [activeSection, setActiveSection] = useState<'profile' | 'dashboard' | 'admin' | 'apps' | 'utils'>('profile');
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

  const items = activeSection === 'profile' ? profileItems : activeSection === 'dashboard' ? dashboardItems(user?.role) : activeSection === 'apps' ? appsItems(user?.role) : activeSection === 'utils' ? utilsItems(user?.role) : adminItems(user?.role);

  const getItemSection = (id: DashboardViewType): 'profile' | 'dashboard' | 'admin' | 'apps' | 'utils' => {
    if (profileItems.some((i) => i.id === id)) return 'profile';
    if (dashboardItems(user?.role).some((i) => i.id === id)) return 'dashboard';
    if (appsItems(user?.role).some((i) => i.id === id)) return 'apps';
    if (utilsItems(user?.role).some((i) => i.id === id)) return 'utils';
    return 'admin';
  };

  const handleSectionChange = (section: 'dashboard' | 'admin' | 'apps') => {
    setActiveSection(section);
    let sectionItems: { id: DashboardViewType; disabled?: boolean }[];
    if (section === 'dashboard') sectionItems = dashboardItems(user?.role);
    else if (section === 'apps') sectionItems = appsItems(user?.role);
    else sectionItems = adminItems(user?.role);
    const target = sectionItems[0];
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
            onClick={() => { setActiveSection('profile'); setView('PROFILE'); setSidebarOpen?.(false); }}
            className="flex items-center justify-center size-9 rounded-md bg-gradient-to-br from-primary-500 to-primary-700 text-white hover:from-primary-600 hover:to-primary-800 transition-all cursor-pointer shadow-sm"
          >
            <span className="text-white font-bold text-xs tracking-tight">ON3</span>
          </a>

          <div className="w-5 h-px bg-app-border mt-4 mb-2" />

          {/* Navigation Icons */}
          <div className="flex-1 flex flex-col items-center gap-1.5">
            <button
              onClick={() => { setActiveSection('profile'); setView('PROFILE'); setSidebarOpen?.(false); }}
              className={`flex items-center justify-center size-9 rounded-md border transition-all ${
                activeSection === 'profile'
                  ? 'bg-white text-primary-600 border-app-border shadow-xs'
                  : 'border-transparent text-app-text-secondary hover:bg-white hover:text-app-text hover:border-app-border'
              }`}
              title="Perfil"
            >
              <User className="h-[18px] w-[18px]" />
            </button>

            {dashboardItems(user?.role).length > 0 && (
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
            )}

            {canSeeUserCrud(user?.role) && adminItems(user?.role).length > 0 && (
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
              onClick={() => handleSectionChange('apps')}
              className={`flex items-center justify-center size-9 rounded-md border transition-all ${
                activeSection === 'apps'
                  ? 'bg-white text-primary-600 border-app-border shadow-xs'
                  : 'border-transparent text-app-text-secondary hover:bg-white hover:text-app-text hover:border-app-border'
              }`}
              title="Apps"
            >
              <Grid className="h-[18px] w-[18px]" />
            </button>

            {['ROOT', 'ADMIN'].includes(user?.role || '') && (
              <button
                onClick={() => { setActiveSection('utils'); setView('UTILS_LOGS'); }}
                className={`flex items-center justify-center size-9 rounded-md border transition-all ${
                  activeSection === 'utils'
                    ? 'bg-white text-primary-600 border-app-border shadow-xs'
                    : 'border-transparent text-app-text-secondary hover:bg-white hover:text-app-text hover:border-app-border'
                }`}
                title="Utilidades"
              >
                <Wrench className="h-[18px] w-[18px]" />
              </button>
            )}

            <div className="w-6 h-px bg-app-border" />

            {/* User Avatar */}
            <div className="relative pt-1" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="shrink-0 cursor-pointer"
              >
                <div className="size-9 rounded-full ring-2 ring-white overflow-hidden border-2 border-green-500 bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold">
                  {user?.full_name ? getInitials(user.full_name) : <User className="h-4 w-4" />}
                </div>
              </button>

              {userDropdownOpen && (
                <div className="absolute left-full bottom-0 ml-2 w-[250px] bg-white rounded-xl shadow-lg border border-app-border overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                  {/* User Info Header */}
                  <div className="flex items-center justify-between px-3 py-3 gap-1.5">
                    <div className="flex items-center gap-2.5">
                      <div className="size-9 shrink-0 rounded-full ring-2 ring-green-500 overflow-hidden border-2 border-white bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold">
                        {user?.full_name ? getInitials(user.full_name) : <User className="h-4 w-4" />}
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
                      onClick={() => { setView('PROFILE_CONFIG'); setUserDropdownOpen(false); setSidebarOpen?.(false); }}
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
                      <div
                        onClick={() => triggerToast('Modo oscuro — En desarrollo', 'info')}
                        className="w-9 h-5 bg-app-border rounded-full relative cursor-pointer"
                      >
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



          {/* Section Group Label */}
          <div className="px-[18px] pt-4 pb-1">
            <p className="text-[10px] font-semibold text-app-text-secondary uppercase tracking-[0.1em]">
              {activeSection === 'profile' ? 'Perfil' : activeSection === 'dashboard' ? 'Dashboard' : activeSection === 'apps' ? 'Apps' : activeSection === 'utils' ? 'Utilidades' : 'Administración'}
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
                  onClick={() => {
                    if (!isDisabled) {
                      setActiveSection(getItemSection(item.id));
                      setView(item.id);
                      setSidebarOpen?.(false);
                    }
                  }}
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
