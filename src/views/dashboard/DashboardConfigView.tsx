import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Palette, Bell, Globe, CheckCircle, ShieldAlert,
} from 'lucide-react';

interface Prefs {
  theme: 'claro' | 'oscuro' | 'sistema';
  language: string;
  notifications: boolean;
  emailReports: boolean;
  compactView: boolean;
  itemsPerPage: number;
}

export const DashboardConfigView: React.FC = () => {
  const { user: loggedInUser } = useAuth();
  const [prefs, setPrefs] = useState<Prefs>(() => {
    const saved = localStorage.getItem('on3_profile_prefs');
    return saved ? JSON.parse(saved) : { theme: 'sistema', language: 'es', notifications: true, emailReports: true, compactView: false, itemsPerPage: 10 };
  });

  const savePrefs = (next: Prefs) => { setPrefs(next); localStorage.setItem('on3_profile_prefs', JSON.stringify(next)); };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="bg-white border border-gray-200 rounded-xl shadow-xs">
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <Palette className="w-4 h-4 text-gray-400" />
              Apariencia
            </div>
          </div>
          <div className="p-5 space-y-4">
            {[
              { label: 'Tema', key: 'theme', value: prefs.theme, onChange: (v: string) => savePrefs({ ...prefs, theme: v as Prefs['theme'] }), options: [
                { v: 'claro', l: 'Claro' },
                { v: 'oscuro', l: 'Oscuro' },
                { v: 'sistema', l: 'Sistema' },
              ] },
              { label: 'Idioma', key: 'language', value: prefs.language, onChange: (v: string) => savePrefs({ ...prefs, language: v }), options: [
                { v: 'es', l: 'Español' }, { v: 'en', l: 'English' },
              ] },
            ].map((field) => (
              <div key={field.label} className="flex items-center justify-between py-1">
                <span className="text-sm text-gray-900">{field.label}</span>
                <div className="flex gap-1 p-0.5 bg-gray-100 rounded-lg">
                  {field.options.map((opt) => (
                    <button
                      key={opt.v}
                      onClick={() => field.onChange(opt.v)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${field.value === opt.v ? 'bg-white text-primary-600 shadow-xs' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between py-1">
              <span className="text-sm text-gray-900">Vista compacta</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={prefs.compactView} onChange={(e) => savePrefs({ ...prefs, compactView: e.target.checked })} className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-focus:outline-hidden peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600" />
              </label>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-sm text-gray-900">Items por página</span>
              <select value={prefs.itemsPerPage} onChange={(e) => savePrefs({ ...prefs, itemsPerPage: Number(e.target.value) })} className="px-2.5 py-1.5 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-hidden focus:border-primary-500">
                {[10, 25, 50].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white border border-gray-200 rounded-xl shadow-xs">
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Bell className="w-4 h-4 text-gray-400" />
                Notificaciones
              </div>
            </div>
            <div className="p-5 space-y-3">
              {[
                { label: 'Notificaciones push', key: 'notifications' as const },
                { label: 'Informes por email', key: 'emailReports' as const },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-1.5">
                  <span className="text-sm text-gray-900">{item.label}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={prefs[item.key]} onChange={(e) => savePrefs({ ...prefs, [item.key]: e.target.checked })} className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-focus:outline-hidden peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600" />
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-xs">
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Globe className="w-4 h-4 text-gray-400" />
                Cuenta
              </div>
            </div>
            <div className="p-5 space-y-2 text-sm">
              <div className="flex items-center justify-between py-1">
                <span className="text-gray-500">Versión</span>
                <span className="font-mono text-xs text-gray-900">1.0.0</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-gray-500">Estado</span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <CheckCircle className="w-3 h-3" /> Sesión activa
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-gray-500">Usuario</span>
                <span className="font-mono text-xs text-gray-900">{loggedInUser?.username}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
