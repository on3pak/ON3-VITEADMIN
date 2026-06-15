import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Palette, Bell, Globe, CheckCircle, ShieldAlert,
  Monitor, Moon, Sun,
  User, Shield,
} from 'lucide-react';

interface Prefs {
  theme: 'claro' | 'oscuro' | 'sistema';
  language: string;
  notifications: boolean;
  emailReports: boolean;
  compactView: boolean;
  itemsPerPage: number;
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
      <div className="w-10 h-6 bg-app-border dark:bg-app-card rounded-full peer peer-focus:outline-hidden peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all duration-300 peer-checked:bg-primary-500 shadow-inner" />
    </label>
  );
}

function ConfigCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="card-uiverse overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-app-border">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
          {icon}
        </div>
        <h3 className="text-sm font-bold text-app-text">{title}</h3>
      </div>
      <div className="p-5">
        {children}
      </div>
    </div>
  );
}

function OptionGroup({ label, options, value, onChange }: {
  label: string;
  options: { v: string; l: string; icon: React.ReactNode }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm font-medium text-app-text">{label}</span>
      <div className="flex gap-1 p-0.5 bg-app-bg rounded-xl">
        {options.map((opt) => (
          <button
            key={opt.v}
            onClick={() => onChange(opt.v)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
              value === opt.v
                ? 'bg-app-card text-primary-600 shadow-xs'
                : 'text-app-text-secondary/60 hover:text-app-text-secondary'
            }`}
          >
            {opt.icon} {opt.l}
          </button>
        ))}
      </div>
    </div>
  );
}

export const DashboardConfigView: React.FC = () => {
  const { user: loggedInUser, darkMode, setDarkMode } = useAuth();
  const [prefs, setPrefs] = useState<Prefs>(() => {
    const saved = localStorage.getItem('on3_profile_prefs');
    return saved ? JSON.parse(saved) : { theme: darkMode ? 'oscuro' : 'sistema', language: 'es', notifications: true, emailReports: true, compactView: false, itemsPerPage: 10 };
  });

  const savePrefs = (next: Prefs) => {
    setPrefs(next);
    localStorage.setItem('on3_profile_prefs', JSON.stringify(next));
    if (next.theme === 'oscuro') setDarkMode(true);
    else if (next.theme === 'claro') setDarkMode(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="space-y-5">
          <ConfigCard icon={<Palette className="w-4 h-4" />} title="Apariencia">
            <div className="space-y-4 divide-y divide-app-border">
              <OptionGroup
                label="Tema"
                value={prefs.theme}
                onChange={(v) => savePrefs({ ...prefs, theme: v as Prefs['theme'] })}
                options={[
                  { v: 'claro', l: 'Claro', icon: <Sun className="w-3.5 h-3.5" /> },
                  { v: 'oscuro', l: 'Oscuro', icon: <Moon className="w-3.5 h-3.5" /> },
                  { v: 'sistema', l: 'Sistema', icon: <Monitor className="w-3.5 h-3.5" /> },
                ]}
              />
              <OptionGroup
                label="Idioma"
                value={prefs.language}
                onChange={(v) => savePrefs({ ...prefs, language: v })}
                options={[
                  { v: 'es', l: 'Español', icon: <Globe className="w-3.5 h-3.5" /> },
                  { v: 'en', l: 'English', icon: <Globe className="w-3.5 h-3.5" /> },
                ]}
              />
              <div className="flex items-center justify-between py-1.5 pt-4">
                <span className="text-sm font-medium text-app-text">Vista compacta</span>
                <Toggle checked={prefs.compactView} onChange={(v) => savePrefs({ ...prefs, compactView: v })} />
              </div>
              <div className="flex items-center justify-between py-1.5 pt-4">
                <span className="text-sm font-medium text-gray-900">Items por página</span>
                <div className="flex gap-1 p-0.5 bg-app-bg rounded-xl">
                  {[10, 25, 50].map((n) => (
                    <button
                      key={n}
                      onClick={() => savePrefs({ ...prefs, itemsPerPage: n })}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                        prefs.itemsPerPage === n
                          ? 'bg-app-card text-primary-600 shadow-xs'
                          : 'text-app-text-secondary/60 hover:text-app-text-secondary'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </ConfigCard>
        </div>

        <div className="space-y-5">
          <ConfigCard icon={<Bell className="w-4 h-4" />} title="Notificaciones">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-1">
                <div>
                  <div className="text-sm font-medium text-app-text">Notificaciones push</div>
                  <div className="text-xs text-app-text-secondary/60 mt-0.5">Recibir alertas en el navegador</div>
                </div>
                <Toggle checked={prefs.notifications} onChange={(v) => savePrefs({ ...prefs, notifications: v })} />
              </div>
              <div className="flex items-center justify-between py-1">
                <div>
                  <div className="text-sm font-medium text-app-text">Informes por email</div>
                  <div className="text-xs text-app-text-secondary/60 mt-0.5">Resumen semanal en tu correo</div>
                </div>
                <Toggle checked={prefs.emailReports} onChange={(v) => savePrefs({ ...prefs, emailReports: v })} />
              </div>
            </div>
          </ConfigCard>

          <ConfigCard icon={<User className="w-4 h-4" />} title="Cuenta">
            <div className="space-y-3">
              <div className="flex items-center justify-between py-1">
                <span className="text-sm text-app-text-secondary">Versión</span>
                <span className="font-mono text-xs font-semibold text-app-text bg-app-bg px-2 py-0.5 rounded-md">1.0.0</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-sm text-app-text-secondary">Estado</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-lg">
                  <CheckCircle className="w-3.5 h-3.5" /> Sesión activa
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-sm text-app-text-secondary">Usuario</span>
                <span className="font-mono text-xs font-semibold text-app-text bg-app-bg px-2 py-0.5 rounded-md">{loggedInUser?.username}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-sm text-app-text-secondary">Rol</span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg ${
                  loggedInUser?.role === 'root' ? 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300' :
                  loggedInUser?.role === 'admin' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                  loggedInUser?.role === 'manager' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' :
                  'bg-app-bg text-app-text-secondary'
                }`}>
                  <Shield className="w-3 h-3" /> {loggedInUser?.role}
                </span>
              </div>
            </div>
          </ConfigCard>
        </div>
      </div>
    </div>
  );
};
