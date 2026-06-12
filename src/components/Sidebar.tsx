import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardViewType, VIEW_ROLES } from '../types';
import {
  LayoutDashboard, Users, UserSquare,
  LogOut, KeyRound,
  Truck, Building2, ClipboardList, Package,
  Settings, User, Shield,
  Moon, Grid, Wrench, CalendarCheck, ClipboardCheck,
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
    { id: 'WORK_CENTERS_DASHBOARD' as DashboardViewType, label: 'Centros', icon: <Building2 className="h-5 w-5" />, description: 'Operaciones y ocupación' },
    { id: 'SERVICES_DASHBOARD' as DashboardViewType, label: 'Servicios', icon: <ClipboardList className="h-5 w-5" />, description: 'Órdenes, progreso y planificación' },
    { id: 'VEHICLE_DASHBOARD' as DashboardViewType, label: 'Vehículos', icon: <Truck className="h-5 w-5" />, description: 'Estado, revisiones y carga' },
    { id: 'MACHINERY_DASHBOARD' as DashboardViewType, label: 'Maquinaria', icon: <Wrench className="h-5 w-5" />, description: 'Estado y mantenimiento' },
    { id: 'INVENTORY_DASHBOARD' as DashboardViewType, label: 'Inventario', icon: <Package className="h-5 w-5" />, description: 'Stock, bajas y alertas' },
  ];
  return allItems.filter((item) => (VIEW_ROLES[item.id] || []).includes(role || ''));
};

const adminItems = (role?: string) => {
  if (!canSeeUserCrud(role)) return [];
  return [
    { id: 'USERS_CRUD' as DashboardViewType, label: 'Usuarios', icon: <Users className="h-5 w-5" />, description: 'Roles, permisos y acceso', disabled: !canAccessUserCrud(role) },
    { id: 'EMPLOYEES_CRUD' as DashboardViewType, label: 'Empleados', icon: <UserSquare className="h-5 w-5" />, description: 'Personal, contratos y turnos', disabled: !canAccessUserCrud(role) },
    { id: 'WORK_CENTERS_CRUD' as DashboardViewType, label: 'Centros', icon: <Building2 className="h-5 w-5" />, description: 'Ubicaciones y áreas de trabajo', disabled: !canAccessUserCrud(role) },
    { id: 'SERVICES_CRUD' as DashboardViewType, label: 'Servicios', icon: <ClipboardList className="h-5 w-5" />, description: 'Tareas, categorías y zonas', disabled: !canAccessUserCrud(role) },
    { id: 'VEHICLES_CRUD' as DashboardViewType, label: 'Vehículos', icon: <Truck className="h-5 w-5" />, description: 'Flota, mantenimiento y combustible', disabled: !canAccessUserCrud(role) },
    { id: 'MACHINERY_CRUD' as DashboardViewType, label: 'Maquinaria', icon: <Wrench className="h-5 w-5" />, description: 'Equipos y mantenimiento', disabled: !canAccessUserCrud(role) },
    { id: 'INVENTORY_CRUD' as DashboardViewType, label: 'Inventario', icon: <Package className="h-5 w-5" />, description: 'Ropa y EPIs', disabled: !canAccessUserCrud(role) },
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

const profileItems = [
  { id: 'PROFILE' as DashboardViewType, label: 'Mi Perfil', icon: <User className="h-5 w-5" />, description: 'Información personal' },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<'profile' | 'dashboard' | 'admin' | 'apps'>('profile');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('on3_profile_prefs');
    if (saved) {
      const prefs = JSON.parse(saved);
      return prefs.theme === 'oscuro';
    }
    return false;
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('on3_profile_prefs');
    let theme = 'claro';
    if (saved) {
      const prefs = JSON.parse(saved);
      theme = prefs.theme || 'claro';
    }
    if (theme === 'oscuro') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'sistema') {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
    const saved = localStorage.getItem('on3_profile_prefs');
    const prefs = saved ? JSON.parse(saved) : {};
    prefs.theme = next ? 'oscuro' : 'claro';
    localStorage.setItem('on3_profile_prefs', JSON.stringify(prefs));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const items = activeSection === 'profile' ? profileItems : activeSection === 'dashboard' ? dashboardItems(user?.role) : activeSection === 'apps' ? appsItems(user?.role) : adminItems(user?.role);

  const getItemSection = (id: DashboardViewType): 'profile' | 'dashboard' | 'admin' | 'apps' => {
    if (profileItems.some((i) => i.id === id)) return 'profile';
    if (dashboardItems(user?.role).some((i) => i.id === id)) return 'dashboard';
    if (appsItems(user?.role).some((i) => i.id === id)) return 'apps';
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
      case 'ROOT': return 'bg-purple-500/10 text-purple-700 border-purple-200 dark:text-purple-300 dark:border-purple-800';
      case 'ADMIN': return 'bg-primary-500/10 text-primary-700 border-primary-200 dark:text-primary-300 dark:border-primary-800';
      case 'MANAGER': return 'bg-amber-500/10 text-amber-700 border-amber-200 dark:text-amber-300 dark:border-amber-800';
      default: return 'bg-sidebar-hover text-sidebar-text border-sidebar-border';
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
        <div className="w-[70px] bg-sidebar border-r border-sidebar-border flex flex-col items-center py-5 shrink-0">
          {/* Brand Icon */}
          <a
            onClick={() => { setActiveSection('profile'); setView('PROFILE'); setSidebarOpen?.(false); }}
            className="flex items-center justify-center size-9 rounded-md bg-gradient-to-br from-primary-500 to-primary-700 text-white hover:from-primary-600 hover:to-primary-800 transition-all cursor-pointer shadow-sm"
          >
            <span className="text-white font-bold text-xs tracking-tight">ON3</span>
          </a>

          <div className="w-5 h-px bg-sidebar-border mt-4 mb-2" />

          {/* Navigation Icons */}
          <div className="flex-1 flex flex-col items-center gap-1.5">
            <button
              onClick={() => { setActiveSection('profile'); setView('PROFILE'); setSidebarOpen?.(false); }}
              className={`flex items-center justify-center size-9 rounded-md border transition-all ${
                activeSection === 'profile'
                  ? 'bg-sidebar-hover text-primary-600 border-sidebar-border'
                  : 'border-transparent text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active hover:border-sidebar-border'
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
                    ? 'bg-sidebar-hover text-primary-600 border-sidebar-border'
                    : 'border-transparent text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active hover:border-sidebar-border'
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
                    ? 'bg-sidebar-hover text-primary-600 border-sidebar-border'
                    : 'border-transparent text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active hover:border-sidebar-border'
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
                  ? 'bg-sidebar-hover text-primary-600 border-sidebar-border'
                  : 'border-transparent text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active hover:border-sidebar-border'
              }`}
              title="Apps"
            >
              <Grid className="h-[18px] w-[18px]" />
            </button>

            <div className="w-6 h-px bg-sidebar-border" />

            {/* User Avatar */}
            <div className="relative pt-1" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="shrink-0 cursor-pointer"
              >
                <div className="size-9 rounded-full ring-2 ring-sidebar overflow-hidden border-2 border-green-500 bg-sidebar-hover text-sidebar-text flex items-center justify-center text-xs font-bold">
                  {user?.full_name ? getInitials(user.full_name) : <User className="h-4 w-4" />}
                </div>
              </button>

              {userDropdownOpen && (
                <div className="absolute left-full bottom-0 ml-2 w-[250px] bg-sidebar rounded-xl shadow-lg border border-sidebar-border overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                  {/* User Info Header */}
                  <div className="flex items-center justify-between px-3 py-3 gap-1.5">
                    <div className="flex items-center gap-2.5">
                      <div className="size-9 shrink-0 rounded-full ring-2 ring-green-500 overflow-hidden border-2 border-sidebar bg-sidebar-hover text-sidebar-text flex items-center justify-center text-xs font-bold">
                        {user?.full_name ? getInitials(user.full_name) : <User className="h-4 w-4" />}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm text-sidebar-text-active font-semibold leading-none">{user?.full_name}</span>
                        <span className="text-xs text-sidebar-text hover:text-sidebar-brand font-medium leading-none">{user?.email}</span>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getRoleBadgeStyle(user?.role || '')}`}>
                      {user?.role === 'ROOT' ? 'Root' : user?.role === 'ADMIN' ? 'Admin' : user?.role === 'MANAGER' ? 'Mngr' : 'User'}
                    </span>
                  </div>

                  <div className="border-t border-sidebar-border" />

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={() => { setView('PROFILE'); setUserDropdownOpen(false); setSidebarOpen?.(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-sidebar-text-active hover:bg-sidebar-hover transition-colors"
                    >
                      <User className="h-4 w-4 text-sidebar-text" />
                      Mi Perfil
                    </button>
                    <button
                      onClick={() => { setView('PROFILE_CONFIG'); setUserDropdownOpen(false); setSidebarOpen?.(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-sidebar-text-active hover:bg-sidebar-hover transition-colors"
                    >
                      <Settings className="h-4 w-4 text-sidebar-text" />
                      Configuración
                    </button>
                  </div>

                  <div className="border-t border-sidebar-border" />

                  <div className="px-3 py-2">
                    <div className="flex items-center gap-2 justify-between mb-2">
                      <span className="flex items-center gap-2 text-sm text-sidebar-text">
                        <Moon className="h-4 w-4" />
                        Modo oscuro
                      </span>
                      <div
                        onClick={toggleDarkMode}
                        className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors ${darkMode ? 'bg-primary-500' : 'bg-sidebar-border'}`}
                      >
                        <div className={`w-3.5 h-3.5 bg-sidebar-text-active rounded-full shadow-xs absolute top-0.5 transition-transform ${darkMode ? 'translate-x-4' : 'left-0.5'}`} />
                      </div>
                    </div>
                    <button
                      onClick={() => { logout(); setUserDropdownOpen(false); }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 dark:hover:text-rose-400 border border-sidebar-border rounded-lg transition-colors"
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
        <div className="flex-1 bg-sidebar border-r border-sidebar-border flex flex-col min-w-0">
          {/* Brand Header */}
          <div className="flex items-center justify-between px-4 h-[60px] shrink-0 border-b border-sidebar-border">
            <div>
              <h1 className="font-bold text-sm text-sidebar-text-active tracking-tight">ON3ADMIN</h1>
              <p className="text-[10px] text-sidebar-brand font-semibold tracking-wider uppercase">Secure Suite</p>
            </div>
          </div>



          {/* Section Group Label */}
          <div className="px-[18px] pt-4 pb-1">
            <p className="text-[10px] font-semibold text-sidebar-text uppercase tracking-[0.1em]">
              {activeSection === 'profile' ? 'Perfil' : activeSection === 'dashboard' ? 'Dashboard' : activeSection === 'apps' ? 'Apps' : 'Administración'}
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
                      ? 'bg-sidebar-active border-sidebar-border text-primary-600 font-medium'
                      : isDisabled
                        ? 'opacity-40 cursor-not-allowed text-sidebar-text border-transparent'
                        : 'border-transparent text-sidebar-text hover:bg-sidebar-hover hover:border-sidebar-border hover:text-sidebar-text-active'
                    }
                  `}
                >
                  <span className={`shrink-0 ${isActive ? 'text-primary-600' : 'text-sidebar-text'}`}>
                    {item.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm leading-tight">{item.label}</p>
                      {isDisabled && <KeyRound className="h-3 w-3 text-amber-500" />}
                    </div>
                    <p className={`text-[11px] font-normal truncate mt-0.5 ${isActive ? 'text-primary-500/70' : 'text-sidebar-text/70'}`}>
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
