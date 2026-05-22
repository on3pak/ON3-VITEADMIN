import React, { useState } from 'react';
import { MockTest } from '../../../types';
import { Play, CheckCircle, XCircle, Activity } from 'lucide-react';

export const RolesTestsView: React.FC = () => {
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [testSuite, setTestSuite] = useState<MockTest[]>([
    {
      id: 'T-06',
      name: 'RBAC: ROOT tiene acceso completo al CRUD de usuarios',
      category: 'ROLES',
      description: 'Verifica que el rol ROOT pueda visualizar, crear, editar y eliminar cualquier registro del sistema.',
      status: 'IDLE',
      assertions: [
        'canAccessUserCrud(ROOT) retorna true',
        'El menú de administración es visible para ROOT',
        'La vista UsersCrudView permite todas las operaciones CRUD'
      ]
    },
    {
      id: 'T-07',
      name: 'RBAC: ADMIN tiene acceso completo al CRUD de usuarios',
      category: 'ROLES',
      description: 'Valida que el rol ADMIN puede gestionar usuarios igual que ROOT, incluyendo asignar roles.',
      status: 'IDLE',
      assertions: [
        'canAccessUserCrud(ADMIN) retorna true',
        'El menú de administración es visible para ADMIN',
        'La vista UsersCrudView permite todas las operaciones CRUD'
      ]
    },
    {
      id: 'T-08',
      name: 'RBAC: MANAGER puede ver el menú pero no acceder al CRUD',
      category: 'ROLES',
      description: 'Confirma que el rol MANAGER visualiza la sección de administración pero tiene acceso bloqueado.',
      status: 'IDLE',
      assertions: [
        'canSeeUserCrud(MANAGER) retorna true (visible en sidebar)',
        'canAccessUserCrud(MANAGER) retorna false (acceso denegado)',
        'Al intentar acceder se muestra AccessDeniedView'
      ]
    },
    {
      id: 'T-09',
      name: 'RBAC: USER no puede ver ni acceder al menú de administración',
      category: 'ROLES',
      description: 'Verifica que el rol USER no tiene visibilidad ni acceso a la gestión de usuarios.',
      status: 'IDLE',
      assertions: [
        'canSeeUserCrud(USER) retorna false (no visible en sidebar)',
        'canAccessUserCrud(USER) retorna false',
        'Intentos de acceso directo redireccionan a vista de error'
      ]
    },
    {
      id: 'T-10',
      name: 'VIEW_ACCESS: Roles válidos por vista del dashboard',
      category: 'ROLES',
      description: 'Comprueba la matriz de acceso entre roles y vistas permitidas en el sistema.',
      status: 'IDLE',
      assertions: [
        'USER_DASHBOARD accesible para ROOT, ADMIN, MANAGER, USER',
        'USERS_CRUD accesible solo para ROOT y ADMIN',
        'TESTS_PANEL accesible para ROOT, ADMIN, MANAGER'
      ]
    }
  ]);

  const runAllTests = async () => {
    setIsRunningAll(true);
    for (let i = 0; i < testSuite.length; i++) {
      setTestSuite(prev => prev.map((t, idx) => idx === i ? { ...t, status: 'RUNNING' } : t));
      await new Promise(resolve => setTimeout(resolve, 600));
      setTestSuite(prev => prev.map((t, idx) => idx === i ? { ...t, status: 'PASSED' } : t));
    }
    setIsRunningAll(false);
  };

  const getStatusBadge = (status: MockTest['status']) => {
    switch (status) {
      case 'IDLE':
        return <span className="px-2 py-0.5 rounded text-xs bg-slate-100 text-app-text-secondary font-mono">EN ESPERA</span>;
      case 'RUNNING':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700 font-mono font-bold animate-pulse">
            <Activity className="h-3 w-3 mr-1 animate-spin" /> PROBANDO
          </span>
        );
      case 'PASSED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-emerald-100 text-emerald-800 font-mono font-bold">
            <CheckCircle className="h-3 w-3 mr-1" /> EXITOSO
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-rose-100 text-rose-800 font-mono font-bold">
            <XCircle className="h-3 w-3 mr-1" /> RECHAZADO
          </span>
        );
    }
  };

  const totalPassed = testSuite.filter(t => t.status === 'PASSED').length;

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-app-text">Tests de Roles y Permisos</h3>
            <p className="text-xs text-app-text-secondary mt-1">Validación de acceso por rol y matriz de permisos</p>
          </div>
          <button
            onClick={runAllTests}
            disabled={isRunningAll}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white font-bold text-xs rounded-xl hover:bg-primary-700 disabled:opacity-40 transition-all cursor-pointer"
          >
            <Play className={`h-4 w-4 ${isRunningAll ? 'animate-spin' : ''}`} />
            Ejecutar
          </button>
        </div>
      </div>

      {totalPassed > 0 && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm font-medium">
          Tests completados: {totalPassed} / {testSuite.length}
        </div>
      )}

      <div className="space-y-4">
        {testSuite.map((test) => (
          <div key={test.id} className={`p-5 rounded-2xl bg-white border shadow-xs transition-all ${
            test.status === 'RUNNING' ? 'border-blue-400 ring-2 ring-blue-50' :
            test.status === 'PASSED' ? 'border-emerald-100 bg-emerald-50/5' : 'border-slate-200'
          }`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-app-text-secondary font-bold bg-slate-100 px-1.5 py-0.2 rounded">
                    {test.id}
                  </span>
                  <span className="text-[9px] bg-cyan-50 text-cyan-700 px-1.5 py-0.2 rounded font-extrabold uppercase font-mono">
                    ROLES
                  </span>
                </div>
                <h4 className="font-bold text-app-text text-sm mt-1">{test.name}</h4>
                <p className="text-xs text-app-text-secondary mt-1">{test.description}</p>
              </div>
              {getStatusBadge(test.status)}
            </div>

            <div className="mt-4 pt-3 border-t border-app-border space-y-2">
              <span className="text-[10px] uppercase font-bold text-app-text-secondary tracking-wider block">Assertions:</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {test.assertions.map((assertion, aIdx) => (
                  <div key={aIdx} className={`p-2 rounded-xl border text-xs flex items-start gap-2 ${
                    test.status === 'PASSED' ? 'bg-emerald-50/40 border-emerald-100 text-app-text-secondary' : 'bg-slate-50 border-app-border text-app-text-secondary'
                  }`}>
                    {test.status === 'PASSED' ? <CheckCircle className="h-3.5 w-3.5 text-emerald-600 mt-0.5" /> : <div className="h-3.5 w-3.5 rounded-full border border-slate-300 mt-0.5" />}
                    <span>{assertion}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
