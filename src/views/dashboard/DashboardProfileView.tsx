import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEmployees } from '../../context/EmployeeContext';
import { EmployeeFormModal } from '../../components/modals/EmployeeFormModal';
import { INITIAL_CITIES, INITIAL_EMPLOYEE_CATEGORIES, INITIAL_EMPLOYEE_STATUSES, INITIAL_WORK_DAYS, INITIAL_SHIFTS, INITIAL_CONTRACT_TYPES } from '../../data/mockEmployees';
import { INITIAL_WORK_CENTERS } from '../../data/mockWorkCenters';
import {
  User, Shield, Mail, Calendar, MapPin, Briefcase,
  Building2, Phone, Smartphone, Palette, Bell, Globe,
  Edit3, CheckCircle, Clock, Tag, Hash,
  FileText, CreditCard, TrendingUp, AlertCircle, Award, ShieldAlert,
} from 'lucide-react';

const cityMap = Object.fromEntries(INITIAL_CITIES.map((c) => [c.id, c.name]));
const wcMap = Object.fromEntries(INITIAL_WORK_CENTERS.map((w) => [w.id, w.name]));
const catMap = Object.fromEntries(INITIAL_EMPLOYEE_CATEGORIES.map((c) => [c.id, c.name]));
const statusMap = Object.fromEntries(INITIAL_EMPLOYEE_STATUSES.map((s) => [s.id, s.name]));
const shiftMap = Object.fromEntries(INITIAL_SHIFTS.map((s) => [s.id, s.name]));
const wdMap = Object.fromEntries(INITIAL_WORK_DAYS.map((w) => [w.id, w.name]));
const ctMap = Object.fromEntries(INITIAL_CONTRACT_TYPES.map((c) => [c.id, c.name]));

const STATUS_BADGE: Record<string, string> = {
  'es-1': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'es-2': 'bg-blue-50 text-blue-700 border-blue-200',
  'es-3': 'bg-rose-50 text-rose-700 border-rose-200',
  'es-4': 'bg-amber-50 text-amber-700 border-amber-200',
  'es-5': 'bg-purple-50 text-purple-700 border-purple-200',
  'es-6': 'bg-cyan-50 text-cyan-700 border-cyan-200',
};

const ROLE_STYLE: Record<string, string> = {
  ROOT: 'bg-violet-100 text-violet-700 border-violet-200',
  ADMIN: 'bg-blue-100 text-blue-700 border-blue-200',
  MANAGER: 'bg-amber-100 text-amber-700 border-amber-200',
  USER: 'bg-app-bg text-app-text border-app-border',
};

interface Prefs {
  theme: 'claro' | 'oscuro' | 'sistema';
  language: string;
  notifications: boolean;
  emailReports: boolean;
  compactView: boolean;
  itemsPerPage: number;
}

const SectionCard: React.FC<{ icon: React.ReactNode; title: string; subtitle?: string; children: React.ReactNode; className?: string }> = ({ icon, title, subtitle, children, className }) => (
  <div className={`bg-app-card rounded-xl border border-app-card-border shadow-xs p-5 ${className || ''}`}>
    <div className="flex items-center gap-2.5 mb-4">
      <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">{icon}</div>
      <div>
        <h3 className="text-sm font-semibold text-app-text">{title}</h3>
        {subtitle && <p className="text-[11px] text-app-text-secondary">{subtitle}</p>}
      </div>
    </div>
    {children}
  </div>
);

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: string | React.ReactNode }> = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
    <div className="text-app-text-secondary w-4 shrink-0 flex justify-center">{icon}</div>
    <div className="text-[11px] text-app-text-secondary w-24 shrink-0 font-medium">{label}</div>
    <div className="text-sm min-w-0 flex-1 text-app-text font-medium truncate">{value}</div>
  </div>
);

const formatDate = (d: string) => {
  const date = new Date(d);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
};

export const DashboardProfileView: React.FC = () => {
  const { user: loggedInUser } = useAuth();
  const { employees, createEmployee, updateEmployee } = useEmployees();

  const isReadOnly = loggedInUser?.role === 'USER';

  const [activeTab, setActiveTab] = useState<'perfil' | 'ajustes'>('perfil');
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>(() => {
    const saved = localStorage.getItem('on3_profile_prefs');
    return saved ? JSON.parse(saved) : { theme: 'sistema', language: 'es', notifications: true, emailReports: true, compactView: false, itemsPerPage: 10 };
  });

  const savePrefs = (next: Prefs) => { setPrefs(next); localStorage.setItem('on3_profile_prefs', JSON.stringify(next)); };

  const myEmployee = useMemo(
    () => (loggedInUser ? employees.find((e) => e.user_id === loggedInUser.id) : undefined),
    [employees, loggedInUser]
  );

  const handleEmployeeSubmit = (data: Omit<import('../../types').Employee, 'id' | 'created_at' | 'updated_at'>) => {
    if (isReadOnly) return false;
    if (myEmployee) {
      updateEmployee(myEmployee.id, data);
    } else if (loggedInUser) {
      createEmployee({ ...data, user_id: loggedInUser.id, city_id: loggedInUser.city_id || null });
    }
    setEmployeeModalOpen(false);
    return true;
  };

  const tabs = [
    { value: 'perfil' as const, label: 'Mi Perfil', icon: <User className="h-4 w-4" /> },
    { value: 'ajustes' as const, label: 'Preferencias', icon: <Palette className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-5">
      {isReadOnly && (
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-3 font-medium">
          <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
          <span><span className="font-bold">Modo Consulta:</span> Tu rol es <span className="font-mono bg-amber-100 px-1 py-0.5 rounded text-amber-800">USER</span>. Los datos se muestran en modo solo lectura.</span>
        </div>
      )}
      <div className="flex gap-1 bg-app-bg rounded-xl p-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.value ? 'bg-white text-indigo-700 shadow-xs' : 'text-app-text-secondary hover:text-app-text'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'perfil' && loggedInUser && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
            <div className="bg-app-card rounded-xl border border-app-card-border shadow-xs p-6 text-center lg:col-span-1">
              <div className="relative inline-block">
                <img src={loggedInUser.avatar_url} alt={loggedInUser.full_name} className="w-24 h-24 rounded-2xl bg-app-bg border border-app-border mx-auto" />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
              </div>
              <h2 className="text-lg font-bold text-app-text mt-3">{loggedInUser.full_name}</h2>
              <p className="text-xs text-app-text-secondary">@{loggedInUser.username}</p>
              <div className="flex justify-center mt-3">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${ROLE_STYLE[loggedInUser.role]}`}>
                  <Shield className="h-3 w-3" /> {loggedInUser.role}
                </span>
              </div>
              <div className="mt-4 pt-4 border-t border-app-border text-[11px] text-app-text-secondary">
                Miembro desde {formatDate(loggedInUser.created_at)}
              </div>
            </div>

            <div className="lg:col-span-3 space-y-5">
              <SectionCard icon={<User className="h-4 w-4" />} title="Información General">
                <InfoRow icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={loggedInUser.email} />
                <InfoRow icon={<Hash className="h-3.5 w-3.5" />} label="Usuario" value={loggedInUser.username} />
                <InfoRow icon={<Shield className="h-3.5 w-3.5" />} label="Rol" value={loggedInUser.role} />
                <InfoRow icon={<AlertCircle className="h-3.5 w-3.5" />} label="Estado" value={
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full border ${loggedInUser.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-app-bg text-app-text-secondary border-app-border'}`}>
                    {loggedInUser.status === 'ACTIVE' ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                    {loggedInUser.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                  </span>
                } />
                <InfoRow icon={<Calendar className="h-3.5 w-3.5" />} label="Registro" value={formatDate(loggedInUser.created_at)} />
                <InfoRow icon={<MapPin className="h-3.5 w-3.5" />} label="Ciudad" value={cityMap[loggedInUser.city_id || ''] || 'Sin asignar'} />
              </SectionCard>
            </div>
          </div>

          {myEmployee ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <SectionCard icon={<User className="h-4 w-4" />} title="Datos Personales" subtitle="Información del empleado">
                <InfoRow icon={<User className="h-3.5 w-3.5" />} label="Nombre" value={`${myEmployee.name} ${myEmployee.lastName1} ${myEmployee.lastName2 || ''}`} />
                <InfoRow icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={myEmployee.email} />
                <InfoRow icon={<Phone className="h-3.5 w-3.5" />} label="Teléfono" value={myEmployee.phone} />
                <InfoRow icon={<Smartphone className="h-3.5 w-3.5" />} label="Email Personal" value={myEmployee.personal_email || '-'} />
                <InfoRow icon={<MapPin className="h-3.5 w-3.5" />} label="Ciudad" value={cityMap[myEmployee.city_id || ''] || 'Sin asignar'} />
              </SectionCard>

              <SectionCard icon={<Briefcase className="h-4 w-4" />} title="Datos Laborales" subtitle="Puesto y condiciones">
                <InfoRow icon={<Building2 className="h-3.5 w-3.5" />} label="Centro" value={wcMap[myEmployee.work_center_id] || myEmployee.work_center_id} />
                <InfoRow icon={<Award className="h-3.5 w-3.5" />} label="Categoría" value={catMap[myEmployee.category_id] || myEmployee.category_id} />
                <InfoRow icon={<Tag className="h-3.5 w-3.5" />} label="Estado">
                  <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full border ${STATUS_BADGE[myEmployee.status_id] || 'bg-app-bg text-app-text'}`}>
                    {statusMap[myEmployee.status_id] || myEmployee.status_id}
                  </span>
                </InfoRow>
                <InfoRow icon={<Clock className="h-3.5 w-3.5" />} label="Jornada" value={wdMap[myEmployee.work_day] || myEmployee.work_day} />
                <InfoRow icon={<Clock className="h-3.5 w-3.5" />} label="Turno" value={shiftMap[myEmployee.shift] || myEmployee.shift} />
                <InfoRow icon={<Calendar className="h-3.5 w-3.5" />} label="Horario" value={`${myEmployee.start_time || '-'} - ${myEmployee.end_time || '-'}`} />
              </SectionCard>

              <SectionCard icon={<FileText className="h-4 w-4" />} title="Contrato" subtitle="Detalles contractuales">
                <InfoRow icon={<Tag className="h-3.5 w-3.5" />} label="Tipo" value={ctMap[myEmployee.contract_type || ''] || 'Sin especificar'} />
                <InfoRow icon={<Calendar className="h-3.5 w-3.5" />} label="Inicio" value={myEmployee.contract_start_date || '-'} />
                <InfoRow icon={<Calendar className="h-3.5 w-3.5" />} label="Fin" value={myEmployee.contract_end_date || 'Indefinido'} />
                <InfoRow icon={<TrendingUp className="h-3.5 w-3.5" />} label="IRPF" value={`${myEmployee.irpf}%`} />
              </SectionCard>

              <SectionCard icon={<CreditCard className="h-4 w-4" />} title="Otros Datos" subtitle="Información adicional">
                <InfoRow icon={<CreditCard className="h-3.5 w-3.5" />} label="IBAN" value={myEmployee.iban || '-'} />
                <InfoRow icon={<MapPin className="h-3.5 w-3.5" />} label="Taquilla" value={myEmployee.locker || '-'} />
                <InfoRow icon={<Calendar className="h-3.5 w-3.5" />} label="Vacaciones" value={`${myEmployee.vacation_days} días`} />
                <InfoRow icon={<TrendingUp className="h-3.5 w-3.5" />} label="Días Propios" value={`${myEmployee.own_days} días`} />
                <InfoRow icon={<TrendingUp className="h-3.5 w-3.5" />} label="Acumulados" value={`${myEmployee.accumulated_days} días`} />
                <InfoRow icon={<CheckCircle className="h-3.5 w-3.5" />} label="Reconocimiento" value={myEmployee.medical_check ? 'Realizado' : 'Pendiente'} />
              </SectionCard>

              {!isReadOnly && (
              <div className="lg:col-span-2 flex justify-end">
                <button onClick={() => setEmployeeModalOpen(true)} className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs">
                  <Edit3 className="h-4 w-4" /> Editar Ficha de Empleado
                </button>
              </div>
              )}
            </div>
          ) : (
            <div className="bg-app-card rounded-xl border border-app-card-border shadow-xs p-12 text-center">
              <div className="p-3 rounded-xl bg-app-bg border border-app-border w-fit mx-auto mb-4">
                <Briefcase className="h-10 w-10 text-app-text-secondary" />
              </div>
              <h3 className="text-base font-semibold text-app-text">Sin ficha de empleado</h3>
              <p className="text-sm text-app-text-secondary mt-1 max-w-sm mx-auto">Tu cuenta de usuario no tiene un registro de empleado asociado. Crea uno para gestionar tus datos laborales.</p>
              {!isReadOnly && (
              <button onClick={() => setEmployeeModalOpen(true)} className="inline-flex items-center gap-1.5 px-5 py-2.5 mt-5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs">
                <Briefcase className="h-4 w-4" /> Crear Ficha de Empleado
              </button>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'ajustes' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <SectionCard icon={<Palette className="h-4 w-4" />} title="Apariencia" subtitle="Personaliza la interfaz">
            <div className="space-y-4">
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
                  <span className="text-sm text-app-text">{field.label}</span>
                  <div className="flex gap-1 bg-app-bg rounded-lg p-0.5">
                    {field.options.map((opt) => (
                      <button
                        key={opt.v}
                        onClick={() => field.onChange(opt.v)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${field.value === opt.v ? 'bg-white text-indigo-700 shadow-xs' : 'text-app-text-secondary hover:text-app-text'}`}
                      >
                        {opt.l}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between py-1">
                <span className="text-sm text-app-text">Vista compacta</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={prefs.compactView} onChange={(e) => savePrefs({ ...prefs, compactView: e.target.checked })} className="sr-only peer" />
                  <div className="w-9 h-5 bg-app-border peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600" />
                </label>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-sm text-app-text">Items por página</span>
                <select value={prefs.itemsPerPage} onChange={(e) => savePrefs({ ...prefs, itemsPerPage: Number(e.target.value) })} className="text-xs border border-app-border rounded-lg px-2.5 py-1.5 text-app-text focus:outline-hidden focus:border-indigo-500 bg-white">
                  {[10, 25, 50].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
          </SectionCard>

          <div className="space-y-5">
            <SectionCard icon={<Bell className="h-4 w-4" />} title="Notificaciones" subtitle="Controla las notificaciones">
              {[
                { label: 'Notificaciones push', key: 'notifications' as const },
                { label: 'Informes por email', key: 'emailReports' as const },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-1.5">
                  <span className="text-sm text-app-text">{item.label}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={prefs[item.key]} onChange={(e) => savePrefs({ ...prefs, [item.key]: e.target.checked })} className="sr-only peer" />
                    <div className="w-9 h-5 bg-app-border peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600" />
                  </label>
                </div>
              ))}
            </SectionCard>

            <SectionCard icon={<Globe className="h-4 w-4" />} title="Cuenta" subtitle="Información de la sesión">
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between py-1">
                  <span className="text-app-text-secondary">Versión</span>
                  <span className="font-mono text-app-text text-xs">1.0.0</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-app-text-secondary">Estado</span>
                  <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                    <CheckCircle className="h-3 w-3" /> Sesión activa
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-app-text-secondary">Usuario</span>
                  <span className="text-app-text text-xs font-mono">{loggedInUser?.username}</span>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      )}

      <EmployeeFormModal
        isOpen={employeeModalOpen}
        onClose={() => setEmployeeModalOpen(false)}
        onSubmit={handleEmployeeSubmit}
        editingEmployee={myEmployee}
      />
    </div>
  );
};
