import React from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardViewType } from '../types';
import { RefreshCw, Wrench, Menu, Search } from 'lucide-react';
import { useUsers } from '../context/UserContext';

interface HeaderProps {
  currentView: DashboardViewType;
  setCurrentView: (view: DashboardViewType) => void;
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
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
  PROFILE: { title: 'Mi Perfil' },
  UTILS: { title: 'Utilidades' },
  LOGS_AUTH: { title: 'Logs Auth', parent: 'Utilidades' },
  LOGS_LOGOUT: { title: 'Logs Logout', parent: 'Utilidades' },
  LOGS_USERS: { title: 'Logs Usuarios', parent: 'Utilidades' },
  LOGS_EMPLOYEES: { title: 'Logs Empleados', parent: 'Utilidades' },
  TESTS_AUTH: { title: 'Tests Auth', parent: 'Utilidades' },
  TESTS_JWT: { title: 'Tests JWT', parent: 'Utilidades' },
  TESTS_CRUD: { title: 'Tests CRUD', parent: 'Utilidades' },
  TESTS_RBAC: { title: 'Tests RBAC', parent: 'Utilidades' },
  TESTS_ROLES: { title: 'Tests Roles', parent: 'Utilidades' },
};

export const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView, sidebarOpen, setSidebarOpen }) => {
  const { user, triggerToast } = useAuth();
  const { resetMockData } = useUsers();

  const info = viewBreadcrumb[currentView] || { title: 'Panel de Control' };

  return (
    <>
      {/* Mobile Header (lg:hidden) */}
      <header className="flex lg:hidden items-center fixed z-10 top-0 start-0 end-0 shrink-0 bg-[#f8f9fc] h-16 border-b border-app-border">
        <div className="flex items-center justify-between w-full px-4">
          <a className="cursor-pointer">
            <div className="flex items-center gap-1.5">
              <div className="size-8 rounded-md bg-primary-500 flex items-center justify-center">
                <span className="text-white font-bold text-xs">O3</span>
              </div>
            </div>
          </a>
          <button
            onClick={() => setSidebarOpen?.(!sidebarOpen)}
            className="flex items-center justify-center size-9 rounded-md text-app-text-secondary hover:text-app-text hover:bg-white hover:border-app-border border border-transparent transition-all"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Desktop Toolbar */}
      <div className="pb-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          {/* Left: Title + Breadcrumbs */}
          <div className="flex items-center flex-wrap gap-1 lg:gap-5">
            <h1 className="font-medium text-base text-app-text">
              {info.title}
            </h1>
            <div className="flex items-center flex-wrap gap-1 text-sm text-app-text-secondary">
              <span className="text-app-text-secondary/50">/</span>
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
          </div>

          {/* Right: Actions */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              className="group flex items-center justify-center size-9 rounded-full text-app-text-secondary hover:bg-primary-50 hover:text-primary-600 transition-all border border-transparent hover:border-primary-200"
              title="Buscar"
            >
              <Search className="h-[18px] w-[18px] group-hover:text-primary-600" />
            </button>

            <button
              onClick={() => setCurrentView('UTILS')}
              className="group flex items-center justify-center size-9 rounded-full text-app-text-secondary hover:bg-primary-50 hover:text-primary-600 transition-all border border-transparent hover:border-primary-200"
              title="Utilidades"
            >
              <Wrench className="h-[18px] w-[18px] group-hover:text-primary-600" />
            </button>

            <button
              onClick={() => {
                resetMockData();
                triggerToast('Base de datos restaurada correctamente', 'success');
              }}
              className="group flex items-center justify-center size-9 rounded-full text-app-text-secondary hover:bg-primary-50 hover:text-primary-600 transition-all border border-transparent hover:border-primary-200"
              title="Restaurar base de datos de prueba"
            >
              <RefreshCw className="h-[18px] w-[18px] group-hover:text-primary-600" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
