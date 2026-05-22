import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TEST_ACCOUNTS } from '../../data/mockUsers';
import { ShieldCheck, Lock, User, Eye, EyeOff, ShieldAlert } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, error, loading, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    await login(email, password);
  };

  const handleQuickFill = (acc: typeof TEST_ACCOUNTS[0]) => {
    clearError();
    setEmail(acc.email);
    setPassword(acc.password);
    setSelectedBadge(acc.role);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ROOT': return 'bg-white/20 text-white border-white/30 backdrop-blur-xs';
      case 'ADMIN': return 'bg-white/20 text-white border-white/30 backdrop-blur-xs';
      case 'MANAGER': return 'bg-white/20 text-white border-white/30 backdrop-blur-xs';
      default: return 'bg-white/20 text-white border-white/30 backdrop-blur-xs';
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans antialiased">
      <div className="lg:w-1/2 bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 p-12 flex flex-col justify-between text-white relative overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-amber-300/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="p-2.5 rounded-xl bg-white/15 border border-white/20 text-white">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-bold text-xl tracking-wide text-white">ON3ADMIN</h2>
            <p className="text-[10px] font-bold text-white/60 tracking-widest uppercase">Secure Suite</p>
          </div>
        </div>

        <div className="my-auto pt-16 pb-12 relative z-10 max-w-lg">
          <span className="text-xs font-bold text-white/80 uppercase tracking-widest bg-white/10 border border-white/20 px-3 py-1 rounded-full inline-block mb-4">
            RBAC AUTH MODULE
          </span>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-none mb-4">
            Control de Acceso Basado en Roles <span className="text-white/70 font-medium">& Simulación JWT</span>
          </h1>
          <p className="text-white/70 text-sm leading-relaxed mb-6">
            Entorno corporativo seguro con protección por jerarquías, tokens inmutables y persistencia de sesión.
          </p>

          <div className="grid grid-cols-2 gap-3 mt-8">
            <div className="p-4 rounded-xl bg-white/10 border border-white/10">
              <span className="text-xs font-bold text-white block mb-1">Estructura Escalable</span>
              <p className="text-xs text-white/60 leading-normal">Arquitectura modular con proveedores de estado especializados.</p>
            </div>
            <div className="p-4 rounded-xl bg-white/10 border border-white/10">
              <span className="text-xs font-bold text-white block mb-1">Mocks de Seguridad</span>
              <p className="text-xs text-white/60 leading-normal">Criptografía HMAC-SHA256 simulada para validación de tokens.</p>
            </div>
          </div>
        </div>

        <div className="text-xs text-white/40 relative z-10 font-mono">
          ON3ADMIN Core • v4.1.0 • 2026
        </div>
      </div>

      <div className="lg:w-1/2 bg-gradient-to-br from-gray-50 to-white p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
        <div className="w-full max-w-md mx-auto space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Iniciar Sesión</h2>
            <p className="text-sm text-gray-500 mt-1">Ingresa tus credenciales o selecciona una cuenta de prueba.</p>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
              Cuentas de Prueba:
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {TEST_ACCOUNTS.map((acc) => {
                const isActive = selectedBadge === acc.role;
                const roleColors: Record<string, string> = {
                  ROOT: 'bg-violet-500',
                  ADMIN: 'bg-blue-500',
                  MANAGER: 'bg-amber-500',
                  USER: 'bg-gray-500',
                };
                return (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => handleQuickFill(acc)}
                    className={`p-3 text-left rounded-xl border transition-all relative overflow-hidden flex flex-col justify-between group cursor-pointer ${
                      isActive
                        ? 'bg-white border-primary-300 ring-2 ring-primary-200 shadow-sm'
                        : 'bg-white border-gray-200 hover:border-primary-200 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full gap-1 mb-1">
                      <span className="text-xs font-bold text-gray-900 truncate">{acc.fullName.split(' ')[0]}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-bold text-white ${roleColors[acc.role]}`}>
                        {acc.role}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-gray-400 block truncate">{acc.email}</span>
                    <span className="text-[9px] text-gray-300 mt-1 line-clamp-1 group-hover:text-gray-500">Pass: {acc.password}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-[10px] font-bold text-gray-400 uppercase font-mono">Formulario</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2.5 font-medium">
                <ShieldAlert className="h-4 w-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setSelectedBadge(null);
                  }}
                  placeholder="Introduce email (ej: m.torres@on3.com)"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setSelectedBadge(null);
                  }}
                  placeholder="Introduce contraseña"
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-500 disabled:bg-primary-400 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-primary-600/20 active:scale-[0.99] mt-2 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Validando JWT Token...</span>
                </>
              ) : (
                <span>Autenticar y Acceder</span>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-[11px] text-gray-400">
              Cada rol otorga una firma JWT diferente que desbloquea o bloquea dinámicamente las herramientas del panel en tiempo real.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
