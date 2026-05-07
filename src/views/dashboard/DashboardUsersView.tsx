import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUsers } from '../../context/UserContext';
import { 
  Users, 
  ShieldCheck, 
  KeyRound, 
  CheckCircle2, 
  UserCheck, 
  AlertCircle,
  Activity,
  Server
} from 'lucide-react';

export const DashboardUsersView: React.FC = () => {
  const { user } = useAuth();
  const { users } = useUsers();

  const countByRole = (r: string) => users.filter(u => u.role === r).length;
  const activeUsersCount = users.filter(u => u.status === 'ACTIVE').length;
  const suspendedUsersCount = users.filter(u => u.status === 'SUSPENDED').length;

  const cardsData = [
    {
      title: 'Usuarios Totales',
      value: users.length,
      subtitle: `${activeUsersCount} activos en DB`,
      icon: <Users className="h-5 w-5 text-indigo-600" />,
      bg: 'bg-indigo-50/70 text-indigo-700 border-indigo-100',
    },
    {
      title: 'Sesión Actual Operator',
      value: user?.role || 'USER',
      subtitle: user?.fullName || 'N/A',
      icon: <KeyRound className="h-5 w-5 text-purple-600" />,
      bg: 'bg-purple-50/70 text-purple-700 border-purple-100',
    },
    {
      title: 'Estado de Integridad JWT',
      value: '100% OK',
      subtitle: 'Firma HMAC validada',
      icon: <ShieldCheck className="h-5 w-5 text-emerald-600" />,
      bg: 'bg-emerald-50/70 text-emerald-700 border-emerald-100',
    },
    {
      title: 'Incidentes de Privilegio',
      value: '0',
      subtitle: 'Bloqueos RBAC activos',
      icon: <AlertCircle className="h-5 w-5 text-amber-600" />,
      bg: 'bg-amber-50/70 text-amber-700 border-amber-100',
    },
  ];

  return (
    <div className="space-y-6">
      
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px] hidden md:block" />
        <div className="relative z-10 max-w-2xl">
          <h3 className="text-xl font-bold tracking-tight">¡Bienvenido al Panel, {user?.fullName}!</h3>
          <p className="text-slate-300 text-xs mt-1 leading-relaxed">
            Estás conectado bajo el privilegio de rol <span className="text-indigo-300 font-bold underline font-mono">{user?.role}</span>. El sistema ha decodificado el JSON Web Token almacenado y aplicado políticas estrictas de seguridad jerárquica en los módulos de persistencia local.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cardsData.map((card, i) => (
          <div key={i} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">{card.title}</span>
              <p className="text-2xl font-extrabold text-slate-800 tracking-tight">{card.value}</p>
              <span className="text-xs font-medium text-slate-500 block truncate">{card.subtitle}</span>
            </div>
            <div className={`p-3 rounded-xl border ${card.bg}`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs lg:col-span-2 space-y-4">
          <div>
            <h3 className="font-bold text-slate-800 text-sm tracking-tight">Distribución de Jerarquías de Cuentas (RBAC)</h3>
            <p className="text-xs text-slate-400">Total de registros cargados en memoria clasificados por nivel de autoridad</p>
          </div>

          <div className="space-y-3.5 pt-2">
            {[
              { label: 'ROOT (Super Acceso Global)', count: countByRole('ROOT'), pct: (countByRole('ROOT') / users.length) * 100, color: 'bg-purple-600' },
              { label: 'ADMIN (Administración Operativa)', count: countByRole('ADMIN'), pct: (countByRole('ADMIN') / users.length) * 100, color: 'bg-blue-600' },
              { label: 'MANAGER (Supervisión Intermedia)', count: countByRole('MANAGER'), pct: (countByRole('MANAGER') / users.length) * 100, color: 'bg-amber-500' },
              { label: 'USER (Consulta / Solo Lectura)', count: countByRole('USER'), pct: (countByRole('USER') / users.length) * 100, color: 'bg-slate-500' },
            ].map((bar, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">{bar.label}</span>
                  <span className="text-slate-900 font-bold">{bar.count} usuarios ({Math.round(bar.pct)}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className={`${bar.color} h-full rounded-full transition-all duration-500`} 
                    style={{ width: `${bar.pct}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2 leading-relaxed">
            <Activity className="h-4 w-4 text-indigo-500 flex-shrink-0 mt-0.5" />
            <p>
              <span className="font-bold text-slate-700">Simulación React Context:</span> Al añadir, editar o eliminar usuarios en el módulo de <span className="italic font-medium">Control de Usuarios</span>, estos gráficos estadísticos y porcentajes se actualizarán inmediatamente de forma reactiva a través del <span className="font-mono">UserProvider</span>.
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div>
              <h3 className="font-bold text-slate-800 text-sm tracking-tight">Estado Técnico Mock API</h3>
              <p className="text-xs text-slate-400">Verificaciones de seguridad en vivo</p>
            </div>

            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Server className="h-3.5 w-3.5 text-slate-400" /> Endpoint Autenticación
                </span>
                <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">MOCK_200_OK</span>
              </div>
              <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-slate-400" /> Algoritmo de Firma
                </span>
                <span className="font-mono text-slate-700 font-semibold text-[11px]">HMAC-SHA256 (Salted)</span>
              </div>
              <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <UserCheck className="h-3.5 w-3.5 text-slate-400" /> Sesiones Activas
                </span>
                <span className="font-mono font-bold text-indigo-600">1 Online</span>
              </div>
              <div className="flex items-center justify-between text-xs pb-1">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5 text-slate-400" /> Cuentas Suspendidas
                </span>
                <span className={`font-mono font-bold ${suspendedUsersCount > 0 ? 'text-amber-600' : 'text-slate-600'}`}>
                  {suspendedUsersCount}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-indigo-900 text-white rounded-xl text-center space-y-1">
            <span className="text-[10px] font-mono tracking-widest text-indigo-300 block font-bold">ESTADO DEL SIMULADOR</span>
            <p className="text-xs font-bold">Modo Demo Operativo</p>
          </div>
        </div>

      </div>

    </div>
  );
};