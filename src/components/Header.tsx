import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardViewType } from '../types';
import { Menu, Search, User, Settings, LogOut, Moon, Grid, Languages, Bell, Maximize2, Minimize2, Type, Star } from 'lucide-react';
import { useUsers } from '../context/UserContext';

interface HeaderProps {
  currentView: DashboardViewType;
  setCurrentView: (view: DashboardViewType) => void;
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
  serviceReportTab?: 'previo' | 'diario' | 'historial';
}

const viewBreadcrumb: Record<DashboardViewType, { title: string; parent?: string; section?: string }> = {
  USER_DASHBOARD: { title: 'Usuarios', parent: 'Dashboard' },
  EMPLOYEE_DASHBOARD: { title: 'Empleados', parent: 'Dashboard' },
  VEHICLE_DASHBOARD: { title: 'Vehículos', parent: 'Dashboard' },
  USERS_CRUD: { title: 'Usuarios', parent: 'Administración' },
  EMPLOYEES_CRUD: { title: 'Empleados', parent: 'Administración' },
  EMPLOYEE_DETAIL: { title: 'Detalle', parent: 'Empleados' },
  VEHICLES_CRUD: { title: 'Vehículos', parent: 'Administración' },
  VEHICLE_DETAIL: { title: 'Detalle', parent: 'Vehículos' },
  WORK_CENTERS_CRUD: { title: 'Centros', parent: 'Administración' },
  WORK_CENTERS_DASHBOARD: { title: 'Centros', parent: 'Dashboard' },
  SERVICES_CRUD: { title: 'Servicios', parent: 'Administración' },
  SERVICES_DASHBOARD: { title: 'Servicios', parent: 'Dashboard' },
  SERVICE_DETAIL: { title: 'Detalle', parent: 'Servicios' },
  INVENTORY_CRUD: { title: 'Inventario', parent: 'Administración' },
  INVENTORY_DASHBOARD: { title: 'Dashboard', section: 'Inventario' },
  PROFILE: { title: 'Mi Perfil', parent: 'Dashboard' },
  PROFILE_CONFIG: { title: 'Configuración', parent: 'Mi Perfil' },
  UTILS: { title: 'Utilidades' },
  UTILS_LOGS: { title: 'Logs', parent: 'Utilidades' },
  UTILS_TESTS: { title: 'Tests', parent: 'Utilidades' },
  LOGS_AUTH: { title: 'Logs Auth', parent: 'Utilidades' },
  LOGS_LOGOUT: { title: 'Logs Logout', parent: 'Utilidades' },
  LOGS_USERS: { title: 'Logs Usuarios', parent: 'Utilidades' },
  LOGS_EMPLOYEES: { title: 'Logs Empleados', parent: 'Utilidades' },
  TESTS_AUTH: { title: 'Tests Auth', parent: 'Utilidades' },
  TESTS_JWT: { title: 'Tests JWT', parent: 'Utilidades' },
  TESTS_CRUD: { title: 'Tests CRUD', parent: 'Utilidades' },
  TESTS_RBAC: { title: 'Tests RBAC', parent: 'Utilidades' },
  TESTS_ROLES: { title: 'Tests Roles', parent: 'Utilidades' },
  SERVICE_REPORT: { title: 'Parte Previo', parent: 'Servicios' },
};

export const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView, sidebarOpen, setSidebarOpen, serviceReportTab }) => {
  const { user, triggerToast, logout } = useAuth();
  const { resetMockData } = useUsers();
  const [mobileUserOpen, setMobileUserOpen] = useState(false);
  const mobileUserRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mobileUserRef.current && !mobileUserRef.current.contains(e.target as Node)) {
        setMobileUserOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getBreadcrumbInfo = () => {
    if (currentView === 'SERVICE_REPORT' && serviceReportTab) {
      const titles: Record<string, { title: string; parent: string }> = {
        previo: { title: 'Parte Previo', parent: 'Servicios' },
        diario: { title: 'Parte Diario', parent: 'Servicios' },
        historial: { title: 'Historial', parent: 'Servicios' },
      };
      return titles[serviceReportTab] || { title: 'Parte de Servicio', parent: 'Servicios' };
    }
    return viewBreadcrumb[currentView] || { title: 'Panel de Control' };
  };

  const info = getBreadcrumbInfo();
  const [lang, setLang] = useState<'ES' | 'EN'>('ES');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  return (
    <>
      {/* Mobile Header (lg:hidden) */}
      <header className="flex lg:hidden items-center fixed z-10 top-0 start-0 end-0 shrink-0 bg-[#f8f9fc] h-16 border-b border-app-border">
        <div className="flex items-center justify-between w-full px-4">
          <button
            onClick={() => setSidebarOpen?.(!sidebarOpen)}
            className="flex items-center justify-center size-9 rounded-md text-app-text-secondary hover:text-app-text hover:bg-white hover:border-app-border border border-transparent transition-all"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => triggerToast('Apps — En desarrollo', 'info')}
              className="flex items-center justify-center size-9 rounded-md text-app-text-secondary hover:text-app-text hover:bg-white hover:border-app-border border border-transparent transition-all"
            >
              <Grid className="h-5 w-5" />
            </button>
            <div className="w-px h-6 bg-app-border" />
            <div className="relative pl-1" ref={mobileUserRef}>
              <button
                onClick={() => setMobileUserOpen(!mobileUserOpen)}
                className="shrink-0 cursor-pointer"
              >
                <div className="size-8 rounded-full ring-2 ring-white overflow-hidden border-2 border-green-500">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">
                      {user?.full_name ? getInitials(user.full_name) : <User className="h-4 w-4" />}
                    </div>
                  )}
                </div>
              </button>

              {mobileUserOpen && (
                <div className="absolute right-0 top-full mt-2 w-[220px] bg-white rounded-xl shadow-lg border border-app-border overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center gap-2.5 px-3 py-3">
                    <div className="size-8 shrink-0 rounded-full ring-2 ring-green-500 overflow-hidden border-2 border-white">
                      {user?.avatar_url ? (
                        <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">
                          {user?.full_name ? getInitials(user.full_name) : <User className="h-4 w-4" />}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-sm text-app-text font-semibold leading-none truncate">{user?.full_name}</span>
                      <span className="text-xs text-app-text-secondary truncate">{user?.email}</span>
                    </div>
                  </div>
                  <div className="border-t border-app-border" />
                  <div className="py-1">
                    <button
                      onClick={() => { setCurrentView('PROFILE'); setMobileUserOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-app-text hover:bg-app-bg transition-colors"
                    >
                      <User className="h-4 w-4 text-app-text-secondary" />
                      Mi Perfil
                    </button>
                    <button
                      onClick={() => { setCurrentView('PROFILE_CONFIG'); setMobileUserOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-app-text hover:bg-app-bg transition-colors"
                    >
                      <Settings className="h-4 w-4 text-app-text-secondary" />
                      Configuración
                    </button>
                  </div>
                  <div className="border-t border-app-border" />
                  <div className="px-3 py-2">
                    <button
                      onClick={() => { logout(); setMobileUserOpen(false); }}
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
      </header>

      {/* Desktop Toolbar */}
      <div className="relative z-10 pb-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          {/* Left: Shortcut + Title */}
          <div className="flex items-center gap-3 pb-2">
            <button
              onClick={() => triggerToast('Acceso directo — En desarrollo', 'info')}
              className="flex items-center justify-center size-9 rounded-md text-app-text-secondary hover:text-app-text hover:bg-white hover:border-app-border border border-transparent transition-all"
              title="Acceso directo"
            >
              <Star className="h-[18px] w-[18px]" />
            </button>
            <div className="w-px h-6 bg-app-border" />
            <div>
              <h1 className="font-medium text-base text-app-text">
                {info.title}
              </h1>
              {currentView !== 'PROFILE' && currentView !== 'PROFILE_CONFIG' && (
              <div className="flex items-center flex-wrap gap-1 mt-0.5 text-xs text-app-text-secondary">
                {info.section && (
                  <>
                    <span className="hover:text-primary-600 transition-colors">{info.section}</span>
                    <span className="text-app-text-secondary/50">/</span>
                  </>
                )}
                {info.parent && (
                  <>
                    <span className="hover:text-primary-600 transition-colors">{info.parent}</span>
                    <span className="text-app-text-secondary/50">/</span>
                  </>
                )}
                <span className="text-app-text font-medium">{info.title}</span>
              </div>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={() => { setLang(lang === 'ES' ? 'EN' : 'ES'); triggerToast(`Idioma cambiado a ${lang === 'ES' ? 'English' : 'Español'}`, 'info'); }}
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-app-text-secondary hover:bg-primary-50 hover:text-primary-600 transition-all border border-transparent hover:border-primary-200 text-xs font-semibold"
              title="Idioma"
            >
              <Languages className="h-[18px] w-[18px] group-hover:text-primary-600" />
              <span>{lang === 'ES' ? 'ES' : 'EN'}/{lang === 'ES' ? 'EN' : 'ES'}</span>
            </button>
            <button
              onClick={() => triggerToast('Tamaño de texto — En desarrollo', 'info')}
              className="group flex items-center justify-center size-9 rounded-full text-app-text-secondary hover:bg-primary-50 hover:text-primary-600 transition-all border border-transparent hover:border-primary-200"
              title="Tamaño de texto"
            >
              <Type className="h-[18px] w-[18px] group-hover:text-primary-600" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="group flex items-center justify-center size-9 rounded-full text-app-text-secondary hover:bg-primary-50 hover:text-primary-600 transition-all border border-transparent hover:border-primary-200"
              title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            >
              {isFullscreen ? (
                <Minimize2 className="h-[18px] w-[18px] group-hover:text-primary-600" />
              ) : (
                <Maximize2 className="h-[18px] w-[18px] group-hover:text-primary-600" />
              )}
            </button>
            <button
              onClick={() => triggerToast('Notificaciones — En desarrollo', 'info')}
              className="group flex items-center justify-center size-9 rounded-full text-app-text-secondary hover:bg-primary-50 hover:text-primary-600 transition-all border border-transparent hover:border-primary-200"
              title="Notificaciones"
            >
              <Bell className="h-[18px] w-[18px] group-hover:text-primary-600" />
            </button>
            <div className="w-px h-6 bg-app-border" />
            <button
              onClick={() => triggerToast('Búsqueda — En desarrollo', 'info')}
              className="group flex items-center justify-center size-9 rounded-full text-app-text-secondary hover:bg-primary-50 hover:text-primary-600 transition-all border border-transparent hover:border-primary-200"
              title="Buscar"
            >
              <Search className="h-[18px] w-[18px] group-hover:text-primary-600" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
