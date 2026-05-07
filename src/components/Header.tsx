import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useUsers } from '../context/UserContext';
import { DashboardViewType } from '../types';
import { RefreshCw, Database, Shield, Lock } from 'lucide-react';

interface HeaderProps {
  currentView: DashboardViewType;
}

export const Header: React.FC<HeaderProps> = ({ currentView }) => {
  const { user, token } = useAuth();
  const { resetMockData, users } = useUsers();

  const getViewTitle = (view: DashboardViewType) => {
    switch (view) {
      case 'OVERVIEW':
        return 'Resumen del Sistema';
      case 'USERS_CRUD':
        return 'Administración de Usuarios';
      case 'TESTS_PANEL':
        return 'Consola de Test Unitarios & Cobertura';
      case 'BEST_PRACTICES':
        return 'Guía de Arquitectura y Buenas Prácticas';
      default:
        return 'Panel de Control';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 h-16 px-8 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Title section */}
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-slate-800 tracking-tight">
          {getViewTitle(currentView)}
        </h2>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
          <Database className="h-3 w-3 text-slate-400" />
          {users.length} Registros
        </span>
      </div>

      {/* Security Token Status & Action Controls */}
      <div className="flex items-center gap-4">
        {/* Mock JWT State pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50/70 border border-indigo-100">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono font-medium text-slate-600">
            JWT: <span className="text-indigo-700 font-bold">{token ? `${token.substring(0, 10)}...${token.substring(token.length - 10)}` : 'Inactivo'}</span>
          </span>
          <Lock className="h-3 w-3 text-indigo-400 ml-1" />
        </div>

        {/* Restore Mock Database Button */}
        <button
          onClick={resetMockData}
          title="Restaurar base de datos de prueba a valores iniciales"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded-xl border border-slate-200 transition-colors cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Reiniciar DB Mock</span>
        </button>

        {/* Small Profile Info */}
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
