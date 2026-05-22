import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEmployees } from '../../context/EmployeeContext';
import { EmployeeFormModal } from '../../components/modals/EmployeeFormModal';
import { INITIAL_CITIES, INITIAL_EMPLOYEE_CATEGORIES, INITIAL_EMPLOYEE_STATUSES, INITIAL_WORK_DAYS, INITIAL_SHIFTS, INITIAL_CONTRACT_TYPES } from '../../data/mockEmployees';
import { INITIAL_WORK_CENTERS } from '../../data/mockWorkCenters';
import {
  User, Shield, Calendar, Briefcase,
  Edit3, CheckCircle,
  FileText, Share2, ShieldAlert,
  Mail, Phone, MapPin, Clock, Hash,
  Sun, Moon, Building2, IdCard,
  SunSnow, AlarmClock, Sunset,
  Banknote, PersonStanding,
} from 'lucide-react';

const cityMap = Object.fromEntries(INITIAL_CITIES.map((c) => [c.id, c.name]));
const wcMap = Object.fromEntries(INITIAL_WORK_CENTERS.map((w) => [w.id, w.name]));
const catMap = Object.fromEntries(INITIAL_EMPLOYEE_CATEGORIES.map((c) => [c.id, c.name]));
const statusMap = Object.fromEntries(INITIAL_EMPLOYEE_STATUSES.map((s) => [s.id, s.name]));
const shiftMap = Object.fromEntries(INITIAL_SHIFTS.map((s) => [s.id, s.name]));
const wdMap = Object.fromEntries(INITIAL_WORK_DAYS.map((w) => [w.id, w.name]));
const ctMap = Object.fromEntries(INITIAL_CONTRACT_TYPES.map((c) => [c.id, c.name]));

const ROLE_STYLE: Record<string, string> = {
  ROOT: 'bg-white/20 text-white backdrop-blur-xs',
  ADMIN: 'bg-white/20 text-white backdrop-blur-xs',
  MANAGER: 'bg-white/20 text-white backdrop-blur-xs',
  USER: 'bg-white/20 text-white backdrop-blur-xs',
};

const ROLE_ICON: Record<string, React.ReactNode> = {
  ROOT: <Shield className="w-3 h-3" />,
  ADMIN: <Shield className="w-3 h-3" />,
  MANAGER: <User className="w-3 h-3" />,
  USER: <PersonStanding className="w-3 h-3" />,
};

const STATUS_BADGE: Record<string, string> = {
  'es-1': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'es-2': 'bg-blue-50 text-blue-700 border-blue-200',
  'es-3': 'bg-rose-50 text-rose-700 border-rose-200',
  'es-4': 'bg-amber-50 text-amber-700 border-amber-200',
  'es-5': 'bg-purple-50 text-purple-700 border-purple-200',
  'es-6': 'bg-cyan-50 text-cyan-700 border-cyan-200',
};

const formatDate = (d: string) => {
  const date = new Date(d);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
};

function StatCard({ value, label, icon, color }: { value: React.ReactNode; label: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="relative group">
      <div className="relative p-4 bg-white rounded-2xl border border-gray-100 shadow-xs transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
        <div className="flex items-center gap-3">
          <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${color} transition-transform duration-300 group-hover:scale-105`}>
            {icon}
          </div>
          <div className="min-w-0">
            <div className="text-xl font-bold tracking-tight text-gray-900">{value}</div>
            <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">{label}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 py-2.5 px-4 -mx-4 rounded-xl transition-colors hover:bg-gray-50/80">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 text-gray-400 shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{label}</div>
        <div className="text-sm font-medium text-gray-900 truncate">{value}</div>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
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

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 800;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.floor(eased * end);
      setDisplay(start);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <span ref={ref}>{display}</span>;
}

export const DashboardProfileView: React.FC = () => {
  const { user: loggedInUser } = useAuth();
  const { employees, createEmployee, updateEmployee } = useEmployees();

  const isReadOnly = loggedInUser?.role === 'USER';

  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);

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

  return (
    <div className="space-y-6">
      {isReadOnly && (
        <div className="flex items-center gap-3 px-5 py-3.5 text-xs font-medium text-amber-900 bg-amber-50/90 backdrop-blur-sm border border-amber-200/80 rounded-2xl shadow-xs">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span><span className="font-bold">Modo Consulta:</span> Tu rol es <span className="px-1.5 py-0.5 font-mono bg-amber-100 rounded-md text-amber-800">USER</span>. Los datos se muestran en modo solo lectura.</span>
        </div>
      )}

      {loggedInUser && (
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-lg">
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />

            <div className="relative px-6 sm:px-8 pt-8 sm:pt-10 pb-6 sm:pb-8">
              <div className="flex flex-col sm:flex-row sm:items-end gap-5 sm:gap-8">
                <div className="relative shrink-0 self-center sm:self-auto">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-400 to-amber-400 blur-xl opacity-40 scale-110" />
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 overflow-hidden rounded-2xl border-2 border-white/20 shadow-xl ring-4 ring-white/10">
                      <img
                        src={loggedInUser.avatar_url}
                        alt={loggedInUser.full_name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-gray-900 rounded-full shadow-lg">
                      <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-30" />
                    </div>
                  </div>
                </div>

                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{loggedInUser.full_name}</h1>
                  <p className="text-sm text-gray-400 mt-0.5 font-medium">@{loggedInUser.username}</p>
                  <div className="flex flex-wrap items-center gap-2.5 mt-3 justify-center sm:justify-start">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold rounded-full border border-white/20 ${ROLE_STYLE[loggedInUser.role]}`}>
                      {ROLE_ICON[loggedInUser.role]} {loggedInUser.role}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Miembro desde {formatDate(loggedInUser.created_at)}
                    </span>
                    {loggedInUser.city_id && (
                      <span className="text-xs text-gray-500 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {cityMap[loggedInUser.city_id]}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-center sm:self-end shrink-0">
                  <button className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white/80 bg-white/10 rounded-xl hover:bg-white/20 hover:text-white transition-all duration-200 backdrop-blur-sm border border-white/10">
                    <Share2 className="w-3.5 h-3.5" /> Compartir
                  </button>
                  {!isReadOnly && (
                    <button
                      onClick={() => setEmployeeModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-primary-500 rounded-xl hover:bg-primary-400 transition-all duration-200 shadow-lg shadow-primary-500/25"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Editar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {myEmployee && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard value={<AnimatedNumber value={myEmployee.vacation_days} />} label="Vacaciones" icon={<SunSnow className="w-4 h-4" />} color="bg-amber-50 text-amber-600" />
              <StatCard value={<AnimatedNumber value={myEmployee.own_days} />} label="Propios" icon={<Sun className="w-4 h-4" />} color="bg-emerald-50 text-emerald-600" />
              <StatCard value={<AnimatedNumber value={myEmployee.accumulated_days} />} label="Acumulados" icon={<Moon className="w-4 h-4" />} color="bg-blue-50 text-blue-600" />
              <StatCard value={<AnimatedNumber value={myEmployee.excess_days} />} label="Extras" icon={<AlarmClock className="w-4 h-4" />} color="bg-rose-50 text-rose-600" />
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="space-y-5 lg:col-span-1">
              <InfoCard icon={<User className="w-4 h-4" />} title="Acerca de">
                <div className="divide-y divide-gray-50 -my-2">
                  <DetailRow icon={<Mail className="w-4 h-4" />} label="Email" value={loggedInUser.email} />
                  <DetailRow icon={<Hash className="w-4 h-4" />} label="Usuario" value={loggedInUser.username} />
                  <DetailRow icon={<Shield className="w-4 h-4" />} label="Rol" value={
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-md ${loggedInUser.role === 'ROOT' ? 'bg-violet-50 text-violet-700' : loggedInUser.role === 'ADMIN' ? 'bg-blue-50 text-blue-700' : loggedInUser.role === 'MANAGER' ? 'bg-amber-50 text-amber-700' : 'bg-gray-50 text-gray-600'}`}>
                      {loggedInUser.role}
                    </span>
                  } />
                  <DetailRow icon={<CheckCircle className="w-4 h-4" />} label="Estado" value={
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-md ${loggedInUser.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-50 text-gray-500'}`}>
                      {loggedInUser.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                    </span>
                  } />
                  <DetailRow icon={<MapPin className="w-4 h-4" />} label="Ciudad" value={cityMap[loggedInUser.city_id || ''] || 'Sin asignar'} />
                  <DetailRow icon={<Calendar className="w-4 h-4" />} label="Registro" value={formatDate(loggedInUser.created_at)} />
                </div>
              </InfoCard>
            </div>

            <div className="space-y-5 lg:col-span-2">
              {myEmployee ? (
                <>
                  <InfoCard icon={<Briefcase className="w-4 h-4" />} title="Información Laboral">
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold rounded-full border ${STATUS_BADGE[myEmployee.status_id] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                        {statusMap[myEmployee.status_id] || myEmployee.status_id}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <DetailRow icon={<Building2 className="w-4 h-4" />} label="Centro" value={wcMap[myEmployee.work_center_id] || myEmployee.work_center_id} />
                      <DetailRow icon={<IdCard className="w-4 h-4" />} label="Categoría" value={catMap[myEmployee.category_id] || myEmployee.category_id} />
                      <DetailRow icon={<Calendar className="w-4 h-4" />} label="Jornada" value={wdMap[myEmployee.work_day] || myEmployee.work_day} />
                      <DetailRow icon={<Clock className="w-4 h-4" />} label="Turno" value={shiftMap[myEmployee.shift] || myEmployee.shift} />
                      <div className="sm:col-span-2">
                        <DetailRow icon={<Sunset className="w-4 h-4" />} label="Horario" value={`${myEmployee.start_time || '-'} — ${myEmployee.end_time || '-'}`} />
                      </div>
                    </div>
                  </InfoCard>

                  <InfoCard icon={<User className="w-4 h-4" />} title="Datos Personales">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <DetailRow icon={<User className="w-4 h-4" />} label="Nombre" value={`${myEmployee.name} ${myEmployee.lastName1} ${myEmployee.lastName2 || ''}`} />
                      <DetailRow icon={<Mail className="w-4 h-4" />} label="Email" value={myEmployee.email} />
                      <DetailRow icon={<Phone className="w-4 h-4" />} label="Teléfono" value={myEmployee.phone} />
                      <DetailRow icon={<Mail className="w-4 h-4" />} label="Email Personal" value={myEmployee.personal_email || '-'} />
                      <DetailRow icon={<MapPin className="w-4 h-4" />} label="Ciudad" value={cityMap[myEmployee.city_id || ''] || 'Sin asignar'} />
                    </div>
                  </InfoCard>

                  <InfoCard icon={<FileText className="w-4 h-4" />} title="Contrato">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <DetailRow icon={<FileText className="w-4 h-4" />} label="Tipo" value={ctMap[myEmployee.contract_type || ''] || 'Sin especificar'} />
                      <DetailRow icon={<Calendar className="w-4 h-4" />} label="Inicio" value={myEmployee.contract_start_date || '-'} />
                      <DetailRow icon={<Calendar className="w-4 h-4" />} label="Fin" value={myEmployee.contract_end_date || 'Indefinido'} />
                      <DetailRow icon={<Banknote className="w-4 h-4" />} label="IRPF" value={`${myEmployee.irpf}%`} />
                      <DetailRow icon={<Hash className="w-4 h-4" />} label="IBAN" value={myEmployee.iban || '-'} />
                      <DetailRow icon={<PersonStanding className="w-4 h-4" />} label="Taquilla" value={myEmployee.locker || '-'} />
                    </div>
                  </InfoCard>

                  <InfoCard icon={<CheckCircle className="w-4 h-4" />} title="Estados">
                    <div className="flex flex-wrap gap-2">
                      {[
                        { key: 'active', label: myEmployee.active ? 'Activo' : 'Inactivo', active: myEmployee.active, icon: <CheckCircle className="w-3.5 h-3.5" /> },
                        { key: 'medical', label: myEmployee.medical_check ? 'Rev. Médica Realizada' : 'Rev. Médica Pendiente', active: myEmployee.medical_check, icon: <CheckCircle className="w-3.5 h-3.5" /> },
                        { key: 'holidays', label: myEmployee.works_holidays ? 'Trabaja Festivos' : 'No trabaja Festivos', active: myEmployee.works_holidays, icon: <Calendar className="w-3.5 h-3.5" /> },
                      ].map((s) => (
                        <span key={s.key} className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all duration-200 hover:scale-105 ${s.active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                          {s.icon} {s.label}
                        </span>
                      ))}
                    </div>
                  </InfoCard>
                </>
              ) : (
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 shadow-xs">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-primary-100/50 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
                  <div className="relative flex flex-col items-center justify-center p-12 sm:p-16">
                    <div className="flex items-center justify-center w-20 h-20 mb-5 bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-2xl border border-primary-100 shadow-xs">
                      <Briefcase className="w-10 h-10 text-primary-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Sin ficha de empleado</h3>
                    <p className="max-w-sm mt-2 text-sm text-center text-gray-500 leading-relaxed">
                      Tu cuenta de usuario no tiene un registro de empleado asociado. Crea uno para gestionar tus datos laborales.
                    </p>
                    {!isReadOnly && (
                      <button
                        onClick={() => setEmployeeModalOpen(true)}
                        className="inline-flex items-center gap-2 px-6 py-2.5 mt-6 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl hover:from-primary-500 hover:to-primary-400 transition-all duration-200 shadow-md shadow-primary-500/20"
                      >
                        <Briefcase className="w-4 h-4" /> Crear Ficha de Empleado
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
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
