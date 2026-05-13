import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useUsers } from '../context/UserContext';
import { useEmployees } from '../context/EmployeeContext';
import { DashboardViewType } from '../types';
import { RefreshCw, Shield, Lock, Wrench, Menu } from 'lucide-react';

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
      case 'OVERVIEW':
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
    <header className="bg-white border-b border-slate-200 h-14 sm:h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen?.(!sidebarOpen)}
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
            {viewInfo.title}
          </h2>
          <p className="text-xs text-slate-500 hidden sm:block">{viewInfo.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative hidden sm:block">
          <button
            onClick={() => setCurrentView('UTILS')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded-xl border border-slate-200 transition-colors"
          >
            <Wrench className="h-3.5 w-3.5" />
            <span>Utils</span>
          </button>
        </div>

        <button
          onClick={resetMockData}
          title="Restaurar base de datos de prueba"
          className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded-xl border border-slate-200 transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Reiniciar DB</span>
        </button>

        <div className="flex items-center gap-2 border-l border-slate-200 pl-2 sm:pl-4">
          <div className="text-right hidden lg:block">
            <p className="text-xs font-bold text-slate-800 leading-tight">{user?.fullName}</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold font-mono text-right">{user?.role}</p>
          </div>
          <div className="p-0.5 rounded-lg bg-slate-100 border border-slate-200">
            <div className="h-7 w-7 rounded-md bg-indigo-50 flex items-center justify-between text-indigo-700 font-bold text-xs p-1">
              <Shield className="h-full w-full" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
