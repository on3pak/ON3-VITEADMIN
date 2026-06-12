import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TopProgressBar } from '../../components/ui';
import { ShieldCheck, Lock, User, Eye, EyeOff, ShieldAlert, AlertCircle, CheckCircle } from 'lucide-react';

const DEV_ACCOUNTS = [
  { role: 'ROOT', name: 'Miguel Torres', email: 'm.torres1@on3.com', password: 'root1' },
  { role: 'ADMIN', name: 'Alejandro Mendoza', email: 'a.mendoza2@on3.com', password: 'admin2' },
  { role: 'MANAGER', name: 'Beatriz Salazar', email: 'b.salazar3@on3.com', password: 'manager3' },
  { role: 'USER', name: 'Carlos Fuentes', email: 'c.fuentes4@on3.com', password: 'user4' },
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(v: string): string | null {
  if (!v.trim()) return 'El correo es obligatorio.';
  if (!EMAIL_RE.test(v.trim())) return 'Formato de correo inválido.';
  return null;
}

function validatePassword(v: string): string | null {
  if (!v) return 'La contraseña es obligatoria.';
  if (v.length < 4) return 'La contraseña debe tener al menos 4 caracteres.';
  return null;
}

export const LoginView: React.FC = () => {
  const { login, error, submitting } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<{ email: boolean; password: boolean }>({ email: false, password: false });

  const emailError = touched.email ? validateEmail(email) : null;
  const passwordError = touched.password ? validatePassword(password) : null;
  const hasErrors = !!validateEmail(email) || !!validatePassword(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (hasErrors) return;
    await login(email.trim(), password);
  };

  const handleQuickFill = (acc: typeof DEV_ACCOUNTS[number]) => {
    setEmail(acc.email);
    setPassword(acc.password);
  };

  return (
    <>
      <TopProgressBar loading={submitting} />
      <div className="min-h-screen flex flex-col lg:flex-row font-sans antialiased">
      <div className="lg:w-1/2 bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 p-6 lg:p-12 flex flex-col lg:justify-between text-white relative overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10">
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

        <div className="hidden lg:block my-auto pt-16 pb-12 relative z-10 max-w-lg">
          <span className="text-xs font-bold text-white/80 uppercase tracking-widest bg-white/10 border border-white/20 px-3 py-1 rounded-full inline-block mb-4">
            AUTENTICACIÓN
          </span>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-none mb-4">
            Control de Acceso Basado en Roles
          </h1>
          <p className="text-white/70 text-sm leading-relaxed mb-6">
            Entorno corporativo seguro con protección por jerarquías y persistencia de sesión.
          </p>

          <div className="grid grid-cols-2 gap-3 mt-8">
            <div className="p-4 rounded-xl bg-white/10 border border-white/10">
              <span className="text-xs font-bold text-white block mb-1">Estructura Escalable</span>
              <p className="text-xs text-white/60 leading-normal">Arquitectura modular con proveedores de estado especializados.</p>
            </div>
            <div className="p-4 rounded-xl bg-white/10 border border-white/10">
              <span className="text-xs font-bold text-white block mb-1">Seguridad por Roles</span>
              <p className="text-xs text-white/60 leading-normal">Jerarquías de acceso con protección granular y persistencia de sesión.</p>
            </div>
          </div>
        </div>

        <div className="hidden lg:block text-xs text-white/40 relative z-10 font-mono">
          ON3ADMIN Core • v4.1.0 • 2026
        </div>
      </div>

      <div className="lg:w-1/2 bg-gradient-to-br from-app-bg to-app-card p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
        <div className="w-full max-w-md mx-auto space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-app-text tracking-tight">Iniciar Sesión</h2>
            <p className="text-sm text-app-text-secondary mt-1">Ingresa tus credenciales para acceder al sistema.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-xl flex items-start gap-2.5 font-medium">
                <ShieldAlert className="h-4 w-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-app-text-secondary uppercase tracking-wide mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-app-text-secondary/60">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onBlur={() => setTouched(p => ({ ...p, email: true }))}
                  onChange={(e) => { setEmail(e.target.value); if (touched.email) setTouched(p => ({ ...p, email: true })); }}
                  placeholder="Introduce email (ej: m.torres@on3.com)"
                  className={`w-full pl-10 pr-10 py-2.5 bg-app-card border rounded-xl text-sm text-app-text placeholder:text-app-text-secondary/50 focus:outline-hidden focus:ring-2 transition-all ${
                    emailError
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/30'
                      : touched.email && !emailError
                        ? 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/30'
                        : 'border-app-border focus:border-primary-500 focus:ring-primary-500/30'
                  }`}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  {emailError ? (
                    <AlertCircle className="h-4 w-4 text-rose-500" />
                  ) : touched.email && !emailError ? (
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                  ) : null}
                </div>
              </div>
              {emailError && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {emailError}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-app-text-secondary uppercase tracking-wide mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-app-text-secondary/60">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onBlur={() => setTouched(p => ({ ...p, password: true }))}
                  onChange={(e) => { setPassword(e.target.value); if (touched.password) setTouched(p => ({ ...p, password: true })); }}
                  placeholder="Introduce contraseña"
                  className={`w-full pl-10 pr-10 py-2.5 bg-app-card border rounded-xl text-sm text-app-text placeholder:text-app-text-secondary/50 focus:outline-hidden focus:ring-2 transition-all ${
                    passwordError
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/30'
                      : touched.password && !passwordError
                        ? 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/30'
                        : 'border-app-border focus:border-primary-500 focus:ring-primary-500/30'
                  }`}
                />
                <div className="absolute inset-y-0 right-0 pr-10 flex items-center pointer-events-none">
                  {passwordError ? (
                    <AlertCircle className="h-4 w-4 text-rose-500" />
                  ) : touched.password && !passwordError ? (
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-app-text-secondary/60 hover:text-app-text cursor-pointer z-10"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordError && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {passwordError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting || (touched.email && touched.password && hasErrors)}
              className="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-500 disabled:bg-primary-400 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-primary-600/20 active:scale-[0.99] mt-2 cursor-pointer flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Validando credenciales...</span>
                </>
              ) : (
                <span>Autenticar y Acceder</span>
              )}
            </button>
          </form>

          {import.meta.env.DEV && (
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-app-text-secondary uppercase tracking-wider">
                Acceso rápido (dev):
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {DEV_ACCOUNTS.map((acc) => {
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
                      className="p-3 text-left rounded-xl border border-app-border bg-app-card hover:border-primary-200 hover:shadow-sm transition-all relative overflow-hidden flex flex-col justify-between group cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full gap-1 mb-1">
                        <span className="text-xs font-bold text-app-text truncate">{acc.name.split(' ')[0]}</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded font-bold text-white ${roleColors[acc.role]}`}>
                          {acc.role}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-app-text-secondary/60 block truncate">{acc.email}</span>
                      <span className="text-[9px] text-app-text-secondary/60 mt-1 group-hover:text-app-text-secondary">Pass: {acc.password}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};
