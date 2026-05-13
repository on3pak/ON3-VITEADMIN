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
      case 'ROOT': return 'bg-purple-600 text-white border-purple-700';
      case 'ADMIN': return 'bg-blue-600 text-white border-blue-700';
      case 'MANAGER': return 'bg-amber-500 text-white border-amber-600';
      default: return 'bg-slate-600 text-white border-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row font-sans antialiased selection:bg-indigo-500 selection:text-white">
      
      <div className="lg:w-1/2 bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 p-12 flex flex-col justify-between text-white relative overflow-hidden border-b lg:border-b-0 lg:border-r border-indigo-500/20">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-bold text-xl tracking-wide text-white">ON3ADMIN</h2>
            <p className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase">Admin Enterprise Ecosystem</p>
          </div>
        </div>

        <div className="my-auto pt-16 pb-12 relative z-10 max-w-lg">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 border border-indigo-400/20 px-3 py-1 rounded-full inline-block mb-4">
            MÓDULO DE AUTENTICACIÓN AVANZADO
          </span>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-none mb-4">
            Control de Acceso Basado en Roles <span className="text-indigo-400 font-medium">(RBAC)</span> & Simulación JWT.
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Entorno corporativo seguro desarrollado bajo las mejores directrices arquitectónicas de React. Implementa protección por jerarquías, tokens inmutables en memoria y persistencia de sesión estricta.
          </p>

          <div className="grid grid-cols-2 gap-3 mt-8">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-xs">
              <span className="text-xs font-bold text-slate-400 block mb-1">Estructura Escalable</span>
              <p className="text-xs text-slate-500 leading-normal">Arquitectura modular limpia que separa el estado global a través de proveedores especializados.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-xs">
              <span className="text-xs font-bold text-slate-400 block mb-1">Mocks de Seguridad</span>
              <p className="text-xs text-slate-500 leading-normal">Criptografía simulada idéntica a la firma HMAC-SHA256 para validación de expiración.</p>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500 relative z-10 font-mono">
          ON3ADMIN Core Architecture Engine • v4.1.0 • 2026
        </div>
      </div>

      <div className="lg:w-1/2 bg-slate-900 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
        <div className="w-full max-w-md mx-auto space-y-8">
          
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Iniciar Sesión</h2>
            <p className="text-sm text-slate-400 mt-1">Ingresa tus credenciales o selecciona una cuenta de prueba rápida.</p>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              Cuentas de Prueba (Haz Clic para cargar):
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {TEST_ACCOUNTS.map((acc) => {
                const isActive = selectedBadge === acc.role;
                return (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => handleQuickFill(acc)}
                    className={`p-3 text-left rounded-xl border transition-all relative overflow-hidden flex flex-col justify-between group cursor-pointer ${
                      isActive 
                        ? 'bg-slate-800 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md shadow-indigo-500/5' 
                        : 'bg-slate-950/40 border-slate-800 hover:bg-slate-800/50 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full gap-1 mb-1">
                      <span className="text-xs font-bold text-white truncate">{acc.fullName.split(' ')[0]}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold ${getRoleBadgeColor(acc.role)}`}>
                        {acc.role}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 block truncate">{acc.email}</span>
                    <span className="text-[9px] text-slate-400 mt-1 line-clamp-1 group-hover:text-slate-300">Pass: {acc.password}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-600 uppercase font-mono">Formulario</span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl flex items-start gap-2.5 font-medium animate-shake">
                <ShieldAlert className="h-4 w-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
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
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
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
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-indigo-600/20 active:scale-[0.99] mt-2 cursor-pointer flex items-center justify-center gap-2"
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
            <p className="text-[11px] text-slate-500">
              💡 <span className="font-semibold text-slate-400">Consejo técnico:</span> Cada rol otorga una firma JWT diferente que desbloquea o bloquea dinámicamente las herramientas del panel de administración en tiempo real.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};