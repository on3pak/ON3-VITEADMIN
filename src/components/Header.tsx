import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useUsers } from '../context/UserContext';
import { useEmployees } from '../context/EmployeeContext';
import { DashboardViewType } from '../types';
import { RefreshCw, Shield, Wrench, Menu } from 'lucide-react';

interface HeaderProps {
  currentView: DashboardViewType;
  setCurrentView: (view: DashboardViewType) => void;
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView, sidebarOpen, setSidebarOpen }) => {
  const { user, token } = useAuth();
  const { resetMockData, users } = useUsers();
  const { employees } = useEmployees();

  const getViewInfo = (view: DashboardViewType) => {
    switch (view) {
      case 'USER_DASHBOARD':
        return { title: 'Dashboard de Usuarios', subtitle: 'Resumen y estadísticas del sistema' };
      case 'EMPLOYEE_DASHBOARD':
        return { title: 'Dashboard de Empleados', subtitle: 'Estadísticas y métricas de personal' };
      case 'VEHICLE_DASHBOARD':
        return { title: 'Dashboard de Vehículos', subtitle: 'Resumen de flota vehicular' };
      case 'USERS_CRUD':
        return { title: 'Gestión de Usuarios', subtitle: 'Crear, editar y eliminar cuentas' };
      case 'EMPLOYEES_CRUD':
        return { title: 'Gestión de Empleados', subtitle: 'Alta, modificación y listado de empleados' };
      case 'EMPLOYEE_DETAIL':
        return { title: 'Detalle de Empleado', subtitle: 'Información completa del empleado' };
      case 'VEHICLES_CRUD':
        return { title: 'Gestión de Vehículos', subtitle: 'Alta, modificación y listado de vehículos' };
      case 'VEHICLE_DETAIL':
        return { title: 'Detalle de Vehículo', subtitle: 'Información completa del vehículo' };
      case 'WORK_CENTERS_CRUD':
        return { title: 'Gestión de Centros de Trabajo', subtitle: 'Alta, modificación y listado de centros' };
      case 'WORK_CENTERS_DASHBOARD':
        return { title: 'Dashboard de Centros de Trabajo', subtitle: 'Resumen y estadísticas de centros' };
      case 'SERVICES_CRUD':
        return { title: 'Gestión de Servicios', subtitle: 'Alta, modificación y listado de servicios' };
      case 'SERVICES_DASHBOARD':
        return { title: 'Dashboard de Servicios', subtitle: 'Resumen y estadísticas de servicios' };
      case 'SERVICE_DETAIL':
        return { title: 'Detalle de Servicio', subtitle: 'Tareas semanales del servicio' };
      case 'INVENTORY_CRUD':
        return { title: 'Gestión de Inventario', subtitle: 'Ropa, EPIs y Maquinaria' };
      case 'INVENTORY_DASHBOARD':
        return { title: 'Dashboard de Inventario', subtitle: 'Resumen y estadísticas de inventario' };
      case 'PROFILE':
        return { title: 'Mi Perfil', subtitle: 'Información personal y ajustes' };
      case 'LOGS_AUTH':
        return { title: 'Logs de Auth', subtitle: 'Registro de autenticaciones' };
      case 'LOGS_LOGOUT':
        return { title: 'Logs de Logout', subtitle: 'Registro de cierres de sesión' };
      case 'LOGS_USERS':
        return { title: 'Logs de Usuarios', subtitle: 'Registro de usuarios' };
      case 'LOGS_EMPLOYEES':
        return { title: 'Logs de Empleados', subtitle: 'Registro de empleados' };
      case 'UTILS':
        return { title: 'Utilidades', subtitle: 'Logs y herramientas de desarrollo' };
      default:
        return { title: 'Panel de Control', subtitle: 'Resumen del sistema' };
    }
  };

  const viewInfo = getViewInfo(currentView);

  return (
    <header className="bg-white border-b border-app-border h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen?.(!sidebarOpen)}
          className="lg:hidden p-2 -ml-2 text-app-text-secondary hover:text-app-text hover:bg-app-bg rounded-lg transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-app-text tracking-tight">
            {viewInfo.title}
          </h2>
          <p className="text-xs text-app-text-secondary hidden sm:block">{viewInfo.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => setCurrentView('UTILS')}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-app-text-secondary hover:text-primary-600 bg-app-bg hover:bg-primary-50 rounded-lg border border-app-border transition-colors"
        >
          <Wrench className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Utils</span>
        </button>

        <button
          onClick={resetMockData}
          title="Restaurar base de datos de prueba"
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-app-text-secondary hover:text-primary-600 bg-app-bg hover:bg-primary-50 rounded-lg border border-app-border transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Reiniciar DB</span>
        </button>

        <button
          onClick={() => setCurrentView('PROFILE')}
          className="flex items-center gap-2.5 border-l border-app-border ml-1 pl-3 sm:pl-4 hover:bg-app-bg pr-2 sm:pr-3 rounded-lg transition-all group cursor-pointer"
        >
          <div className="text-right hidden lg:block">
            <p className="text-xs font-semibold text-app-text group-hover:text-primary-700 leading-tight transition-colors">{user?.full_name}</p>
            <p className="text-[10px] text-app-text-secondary uppercase tracking-wider font-semibold font-mono">{user?.role}</p>
          </div>
          <div className="p-0.5 rounded-lg bg-app-bg border border-app-border group-hover:border-primary-200 group-hover:bg-primary-50 transition-all">
            <div className="h-7 w-7 rounded-md bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-xs group-hover:bg-primary-100 transition-colors">
              <Shield className="h-full w-full p-1" />
            </div>
          </div>
        </button>
      </div>
    </header>
  );
};
