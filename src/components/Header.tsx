import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUsers } from '../context/UserContext';
import { DashboardViewType } from '../types';
import { RefreshCw, Database, Shield, Lock, ChevronDown, Terminal, Key, DatabaseZap, Fingerprint, UserCog } from 'lucide-react';

interface HeaderProps {
  currentView: DashboardViewType;
  setCurrentView: (view: DashboardViewType) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  const { user, token } = useAuth();
  const { resetMockData, users } = useUsers();
  const [testsDropdownOpen, setTestsDropdownOpen] = useState(false);

  const getViewTitle = (view: DashboardViewType) => {
    switch (view) {
      case 'OVERVIEW':
        return 'Resumen del Sistema';
      case 'EMPLOYEE_DASHBOARD':
        return 'Panel de Empleados';
      case 'USERS_CRUD':
        return 'Administración de Usuarios';
      case 'EMPLOYEES_CRUD':
        return 'Gestión de Empleados';
      case 'EMPLOYEE_DETAIL':
        return 'Detalle de Empleado';
      default:
        return 'Panel de Control';
    }
  };

  const testItems = [
    { id: 'TESTS_AUTH' as DashboardViewType, label: 'Auth', icon: <Shield className="h-4 w-4" /> },
    { id: 'TESTS_JWT' as DashboardViewType, label: 'JWT', icon: <Key className="h-4 w-4" /> },
    { id: 'TESTS_CRUD' as DashboardViewType, label: 'CRUD', icon: <DatabaseZap className="h-4 w-4" /> },
    { id: 'TESTS_RBAC' as DashboardViewType, label: 'RBAC', icon: <Fingerprint className="h-4 w-4" /> },
    { id: 'TESTS_ROLES' as DashboardViewType, label: 'Roles', icon: <UserCog className="h-4 w-4" /> },
  ];

  return (
    <header className="bg-white border-b border-slate-200 h-16 px-8 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-slate-800 tracking-tight">
          {getViewTitle(currentView)}
        </h2>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
          <Database className="h-3 w-3 text-slate-400" />
          {users.length} Registros
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50/70 border border-indigo-100">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono font-medium text-slate-600">
            JWT: <span className="text-indigo-700 font-bold">{token ? `${token.substring(0, 10)}...${token.substring(token.length - 10)}` : 'Inactivo'}</span>
          </span>
          <Lock className="h-3 w-3 text-indigo-400 ml-1" />
        </div>

        <div className="relative">
          <button
            onClick={() => setTestsDropdownOpen(!testsDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded-xl border border-slate-200 transition-colors"
          >
            <Terminal className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Tests</span>
            <ChevronDown className={`h-3 w-3 transition-transform ${testsDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {testsDropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setTestsDropdownOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-slate-200 shadow-lg z-20 py-1">
                {testItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id);
                      setTestsDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <button
          onClick={resetMockData}
          title="Restaurar base de datos de prueba"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded-xl border border-slate-200 transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Reiniciar DB</span>
        </button>

        <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
          <div className="text-right hidden md:block">
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