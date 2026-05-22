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
      <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-focus:outline-hidden peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all duration-300 peer-checked:bg-primary-500 shadow-inner" />
    </label>
  );
}

function ConfigCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-50">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-50 text-primary-600">
          {icon}
        </div>
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
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
      <span className="text-sm font-medium text-gray-900">{label}</span>
      <div className="flex gap-1 p-0.5 bg-gray-100 rounded-xl">
        {options.map((opt) => (
          <button
            key={opt.v}
            onClick={() => onChange(opt.v)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
              value === opt.v
                ? 'bg-white text-primary-600 shadow-xs'
                : 'text-gray-500 hover:text-gray-700'
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
  const { user: loggedInUser } = useAuth();
  const [prefs, setPrefs] = useState<Prefs>(() => {
    const saved = localStorage.getItem('on3_profile_prefs');
    return saved ? JSON.parse(saved) : { theme: 'sistema', language: 'es', notifications: true, emailReports: true, compactView: false, itemsPerPage: 10 };
  });

  const savePrefs = (next: Prefs) => { setPrefs(next); localStorage.setItem('on3_profile_prefs', JSON.stringify(next)); };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="space-y-5">
          <ConfigCard icon={<Palette className="w-4 h-4" />} title="Apariencia">
            <div className="space-y-4 divide-y divide-gray-50">
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
                <span className="text-sm font-medium text-gray-900">Vista compacta</span>
                <Toggle checked={prefs.compactView} onChange={(v) => savePrefs({ ...prefs, compactView: v })} />
              </div>
              <div className="flex items-center justify-between py-1.5 pt-4">
                <span className="text-sm font-medium text-gray-900">Items por página</span>
                <div className="flex gap-1 p-0.5 bg-gray-100 rounded-xl">
                  {[10, 25, 50].map((n) => (
                    <button
                      key={n}
                      onClick={() => savePrefs({ ...prefs, itemsPerPage: n })}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                        prefs.itemsPerPage === n
                          ? 'bg-white text-primary-600 shadow-xs'
                          : 'text-gray-500 hover:text-gray-700'
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
                  <div className="text-sm font-medium text-gray-900">Notificaciones push</div>
                  <div className="text-xs text-gray-400 mt-0.5">Recibir alertas en el navegador</div>
                </div>
                <Toggle checked={prefs.notifications} onChange={(v) => savePrefs({ ...prefs, notifications: v })} />
              </div>
              <div className="flex items-center justify-between py-1">
                <div>
                  <div className="text-sm font-medium text-gray-900">Informes por email</div>
                  <div className="text-xs text-gray-400 mt-0.5">Resumen semanal en tu correo</div>
                </div>
                <Toggle checked={prefs.emailReports} onChange={(v) => savePrefs({ ...prefs, emailReports: v })} />
              </div>
            </div>
          </ConfigCard>

          <ConfigCard icon={<User className="w-4 h-4" />} title="Cuenta">
            <div className="space-y-3">
              <div className="flex items-center justify-between py-1">
                <span className="text-sm text-gray-500">Versión</span>
                <span className="font-mono text-xs font-semibold text-gray-900 bg-gray-50 px-2 py-0.5 rounded-md">1.0.0</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-sm text-gray-500">Estado</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  <CheckCircle className="w-3.5 h-3.5" /> Sesión activa
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-sm text-gray-500">Usuario</span>
                <span className="font-mono text-xs font-semibold text-gray-900 bg-gray-50 px-2 py-0.5 rounded-md">{loggedInUser?.username}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-sm text-gray-500">Rol</span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg ${
                  loggedInUser?.role === 'ROOT' ? 'bg-violet-50 text-violet-700' :
                  loggedInUser?.role === 'ADMIN' ? 'bg-blue-50 text-blue-700' :
                  loggedInUser?.role === 'MANAGER' ? 'bg-amber-50 text-amber-700' :
                  'bg-gray-50 text-gray-600'
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
