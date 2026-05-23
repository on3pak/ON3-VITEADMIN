import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEmployees } from '../../context/EmployeeContext';
import { EmployeeFormModal } from '../../components/modals/EmployeeFormModal';
import { CambioVacacionesModal } from '../../components/modals/CambioVacacionesModal';
import { SolicitarDiasModal } from '../../components/modals/SolicitarDiasModal';
import { INITIAL_CITIES, INITIAL_EMPLOYEE_CATEGORIES, INITIAL_EMPLOYEE_STATUSES, INITIAL_WORK_DAYS, INITIAL_SHIFTS, INITIAL_CONTRACT_TYPES } from '../../data/mockEmployees';
import { INITIAL_WORK_CENTERS } from '../../data/mockWorkCenters';
import {
  User, Shield, Calendar, Briefcase,
  Edit3, CheckCircle,
  FileText, Share2, ShieldAlert,
  Mail, Phone, MapPin, Clock, Hash,
  Building2, IdCard,
  SunSnow, Sunset,
  Banknote, PersonStanding,
  ChevronRight, Award, Sparkles,
  Send, Sun,
} from 'lucide-react';

const VACATION_MONTHS = ['julio', 'agosto', 'septiembre'] as const;

function getCurrentVacationMonth(month: string | null, year: number | null): string | null {
  if (!month || !year) return null;
  const currentYear = new Date().getFullYear();
  const diff = currentYear - year;
  const idx = VACATION_MONTHS.indexOf(month as typeof VACATION_MONTHS[number]);
  if (idx === -1) return null;
  const currentIdx = ((idx + diff) % 3 + 3) % 3;
  return VACATION_MONTHS[currentIdx];
}

function getNextVacationMonth(month: string | null, year: number | null): string | null {
  const current = getCurrentVacationMonth(month, year);
  if (!current) return null;
  const idx = VACATION_MONTHS.indexOf(current as typeof VACATION_MONTHS[number]);
  return VACATION_MONTHS[(idx + 1) % 3];
}

const cityMap = Object.fromEntries(INITIAL_CITIES.map((c) => [c.id, c.name]));
const wcMap = Object.fromEntries(INITIAL_WORK_CENTERS.map((w) => [w.id, w.name]));
const catMap = Object.fromEntries(INITIAL_EMPLOYEE_CATEGORIES.map((c) => [c.id, c.name]));
const statusMap = Object.fromEntries(INITIAL_EMPLOYEE_STATUSES.map((s) => [s.id, s.name]));
const shiftMap = Object.fromEntries(INITIAL_SHIFTS.map((s) => [s.id, s.name]));
const wdMap = Object.fromEntries(INITIAL_WORK_DAYS.map((w) => [w.id, w.name]));
const ctMap = Object.fromEntries(INITIAL_CONTRACT_TYPES.map((c) => [c.id, c.name]));

const ROLE_STYLE: Record<string, string> = {
  ROOT: 'bg-violet-500/20 text-violet-200 border-violet-400/30',
  ADMIN: 'bg-blue-500/20 text-blue-200 border-blue-400/30',
  MANAGER: 'bg-amber-500/20 text-amber-200 border-amber-400/30',
  USER: 'bg-white/15 text-white/80 border-white/20',
};

const ROLE_ICON: Record<string, React.ReactNode> = {
  ROOT: <Shield className="w-3 h-3" />,
  ADMIN: <Shield className="w-3 h-3" />,
  MANAGER: <User className="w-3 h-3" />,
  USER: <PersonStanding className="w-3 h-3" />,
};

const STATUS_BADGE: Record<string, string> = {
  'es-1': 'bg-emerald-500/10 text-emerald-600 border-emerald-200/50',
  'es-2': 'bg-blue-500/10 text-blue-600 border-blue-200/50',
  'es-3': 'bg-rose-500/10 text-rose-600 border-rose-200/50',
  'es-4': 'bg-amber-500/10 text-amber-600 border-amber-200/50',
  'es-5': 'bg-purple-500/10 text-purple-600 border-purple-200/50',
  'es-6': 'bg-cyan-500/10 text-cyan-600 border-cyan-200/50',
};

const ROLE_BADGE: Record<string, string> = {
  ROOT: 'bg-violet-500/10 text-violet-700 border-violet-200/50',
  ADMIN: 'bg-blue-500/10 text-blue-700 border-blue-200/50',
  MANAGER: 'bg-amber-500/10 text-amber-700 border-amber-200/50',
  USER: 'bg-gray-500/10 text-gray-600 border-gray-200/50',
};

const formatDate = (d: string) => {
  const date = new Date(d);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
};

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3.5 py-2.5 px-4 -mx-4 rounded-xl transition-all duration-200 hover:bg-gradient-to-r hover:from-primary-50/80 hover:to-transparent group">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 text-primary-600 shrink-0 ring-1 ring-primary-200/50 transition-all duration-200 group-hover:scale-110 group-hover:shadow-sm">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{label}</div>
        <div className="text-sm font-medium text-gray-900 truncate">{value}</div>
      </div>
      <ChevronRight className="w-3.5 h-3.5 text-gray-200 opacity-0 group-hover:opacity-100 transition-all duration-200 -mr-1" />
    </div>
  );
}

function SectionCard({ icon, title, accent = 'primary', children }: { icon: React.ReactNode; title: string; accent?: string; children: React.ReactNode }) {
  const accentGradients: Record<string, string> = {
    primary: 'from-primary-500 to-primary-600',
    emerald: 'from-emerald-500 to-emerald-600',
    blue: 'from-blue-500 to-blue-600',
    amber: 'from-amber-500 to-amber-600',
    violet: 'from-violet-500 to-violet-600',
    rose: 'from-rose-500 to-rose-600',
  };

  const accentBg: Record<string, string> = {
    primary: 'bg-primary-50 border-primary-200/30',
    emerald: 'bg-emerald-50 border-emerald-200/30',
    blue: 'bg-blue-50 border-blue-200/30',
    amber: 'bg-amber-50 border-amber-200/30',
    violet: 'bg-violet-50 border-violet-200/30',
    rose: 'bg-rose-50 border-rose-200/30',
  };

  const gradient = accentGradients[accent] || accentGradients.primary;
  const bgStyle = accentBg[accent] || accentBg.primary;

  return (
    <div
      className="relative group animate-in"
      style={{ animation: `fadeSlideIn 0.5s ease-out both` }}
    >
      <div className="absolute -inset-px bg-gradient-to-br from-gray-100/50 to-white/80 rounded-2xl blur-sm" />
      <div className="relative bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200/60 shadow-lg shadow-black/5 transition-all duration-300 hover:shadow-xl">
        <div className="relative flex items-center gap-3 px-5 py-4 border-b border-gray-100/80">
          <div className={`flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-sm ring-4 ring-white`}>
            {icon}
          </div>
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>
          <div className="ml-auto flex gap-1">
            <span className="w-1 h-1 rounded-full bg-gray-200" />
            <span className="w-1 h-1 rounded-full bg-gray-200" />
            <span className="w-1 h-1 rounded-full bg-gray-200" />
          </div>
        </div>
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
}

function EmptyEmployeeState({ onCreate }: { onCreate: () => void }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 shadow-xl shadow-primary-900/20 animate-in"
      style={{ animation: 'fadeSlideIn 0.6s ease-out both' }}
    >
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, white 1.5px, transparent 1.5px)', backgroundSize: '20px 20px' }} />
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-300/10 rounded-full blur-3xl" />

      <div className="relative flex flex-col items-center justify-center p-12 sm:p-16">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl scale-125" />
          <div className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl border border-white/20 shadow-2xl backdrop-blur-sm">
            <Briefcase className="w-10 h-10 text-white" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-white">Sin ficha de empleado</h3>
        <p className="max-w-sm mt-2 text-sm text-center text-primary-200 leading-relaxed">
          Tu cuenta de usuario no tiene un registro de empleado asociado. Crea uno para gestionar tus datos laborales.
        </p>
        {!false && (
          <button
            onClick={onCreate}
            className="inline-flex items-center gap-2 px-6 py-2.5 mt-6 text-sm font-semibold text-primary-900 bg-white rounded-xl hover:bg-primary-50 transition-all duration-200 shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4" /> Crear Ficha de Empleado
          </button>
        )}
      </div>
    </div>
  );
}

export const DashboardProfileView: React.FC = () => {
  const { user: loggedInUser } = useAuth();
  const { employees, createEmployee, updateEmployee, createVacationRequest, vacationRequests, getVacationRequestsByEmployee } = useEmployees();

  const isReadOnly = loggedInUser?.role === 'USER';

  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [cambioVacacionesOpen, setCambioVacacionesOpen] = useState(false);
  const [solicitarDiasOpen, setSolicitarDiasOpen] = useState(false);
  const [cambioSubmitted, setCambioSubmitted] = useState(false);

  const myEmployee = useMemo(
    () => (loggedInUser ? employees.find((e) => e.user_id === loggedInUser.id) : undefined),
    [employees, loggedInUser]
  );

  const currentVacationMonth = useMemo(
    () => myEmployee ? getCurrentVacationMonth(myEmployee.vacation_month, myEmployee.vacation_year) : null,
    [myEmployee]
  );

  const nextVacationMonth = useMemo(
    () => myEmployee ? getNextVacationMonth(myEmployee.vacation_month, myEmployee.vacation_year) : null,
    [myEmployee]
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

  const handleCambioVacaciones = (data: { type: 'cambio_vacaciones'; requested_month: 'julio' | 'agosto' | 'septiembre' | 'partidas' }) => {
    if (!myEmployee || isReadOnly) return;
    createVacationRequest({
      employee_id: myEmployee.id,
      type: data.type,
      status: 'pendiente',
      requested_month: data.requested_month,
    });
    setCambioVacacionesOpen(false);
    setCambioSubmitted(true);
  };

  const handleSolicitarDias = (data: { type: 'dias_libres'; requested_days: string[] }) => {
    if (!myEmployee || isReadOnly) return;
    createVacationRequest({
      employee_id: myEmployee.id,
      type: data.type,
      status: 'pendiente',
      requested_days: data.requested_days,
    });
    setSolicitarDiasOpen(false);
  };

  const pendingRequests = useMemo(
    () => myEmployee ? getVacationRequestsByEmployee(myEmployee.id).filter((r) => r.status === 'pendiente').length : 0,
    [myEmployee, vacationRequests]
  );

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes rotGlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-in {
          animation: fadeSlideIn 0.5s ease-out both;
        }
      `}</style>

      {isReadOnly && (
        <div
          className="flex items-center gap-3 px-5 py-3.5 text-xs font-medium text-amber-900 bg-amber-50/90 backdrop-blur-sm border border-amber-200/80 rounded-2xl shadow-xs animate-in"
          style={{ animationDelay: '0s' }}
        >
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span><span className="font-bold">Modo Consulta:</span> Tu rol es <span className="px-1.5 py-0.5 font-mono bg-amber-100 rounded-md text-amber-800">USER</span>. Los datos se muestran en modo solo lectura.</span>
        </div>
      )}

      {loggedInUser && (
        <div className="space-y-6">
          <div
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 shadow-2xl shadow-black/40 animate-in border border-white/[0.06]"
            style={{ animationDelay: '0.05s' }}
          >
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")', backgroundSize: '30px 30px' }} />

            <div className="absolute -top-32 -right-20 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary-400/15 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-400/8 rounded-full blur-3xl" />
            <div className="absolute top-10 right-1/3 w-40 h-40 bg-violet-400/10 rounded-full blur-3xl" />

            <div className="absolute inset-0 opacity-[0.02]" style={{ background: 'linear-gradient(135deg, transparent 0%, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%, transparent 100%)', backgroundSize: '200% 200%' }} />

            <div className="relative px-6 sm:px-8 pt-8 sm:pt-10 pb-6 sm:pb-8">
              <div className="flex flex-col sm:flex-row sm:items-end gap-5 sm:gap-8">
                <div className="relative shrink-0 self-center sm:self-auto" style={{ animation: 'fadeSlideIn 0.5s ease-out 0.15s both' }}>
                  <div className="relative flex flex-col items-center">
                    <div className="absolute -inset-4 bg-gradient-to-br from-amber-400/20 via-primary-400/20 to-rose-400/20 rounded-full blur-2xl" style={{ animation: 'floatY 4s ease-in-out infinite' }} />
                    <div className="relative">
                      <div
                        className="absolute -inset-[3px] rounded-full bg-gradient-to-br from-amber-400 via-primary-400 to-rose-500 opacity-90 blur-[2px]"
                        style={{ animation: 'rotGlow 4s linear infinite' }}
                      />
                      <div
                        className="absolute -inset-[3px] rounded-full bg-gradient-to-br from-amber-400 via-primary-400 to-rose-500 opacity-60"
                        style={{ animation: 'rotGlow 4s linear infinite', animationDirection: 'reverse' }}
                      />
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 overflow-hidden rounded-full border-[3px] border-white/90 shadow-2xl shadow-black/30">
                        <img
                          src={loggedInUser.avatar_url}
                          alt={loggedInUser.full_name}
                          className="object-cover w-full h-full scale-110"
                        />
                      </div>
                    </div>
                    <div className="absolute -bottom-0.5 right-0.5">
                      <div className="relative w-5 h-5">
                        <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-50" />
                        <div className="relative w-full h-full rounded-full bg-emerald-500 border-[2.5px] border-slate-900 shadow-lg shadow-emerald-500/30" />
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="flex-1 min-w-0 text-center sm:text-left"
                  style={{ animation: 'fadeSlideIn 0.5s ease-out 0.25s both' }}
                >
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                    <span className="bg-gradient-to-r from-amber-200 via-white to-primary-200 bg-clip-text text-transparent" style={{ backgroundSize: '200% auto', animation: 'shimmer 4s linear infinite' }}>
                      {loggedInUser.full_name}
                    </span>
                  </h1>
                  <p className="text-sm text-white/50 mt-0.5 font-medium">@{loggedInUser.username}</p>
                  <div className="flex flex-wrap items-center gap-2.5 mt-3 justify-center sm:justify-start">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold rounded-full border backdrop-blur-sm ${ROLE_STYLE[loggedInUser.role]}`}>
                      {ROLE_ICON[loggedInUser.role]} {loggedInUser.role}
                    </span>
                    <span className="text-xs text-white/50 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Miembro desde {formatDate(loggedInUser.created_at)}
                    </span>
                    {loggedInUser.city_id && (
                      <span className="text-xs text-white/50 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {cityMap[loggedInUser.city_id]}
                      </span>
                    )}
                  </div>
                </div>

                <div
                  className="flex items-center gap-2 self-center sm:self-end shrink-0"
                  style={{ animation: 'fadeSlideIn 0.5s ease-out 0.35s both' }}
                >
                  <button className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white/70 bg-white/8 rounded-xl hover:bg-white/15 hover:text-white transition-all duration-200 backdrop-blur-sm border border-white/10 hover:border-white/20 active:scale-95">
                    <Share2 className="w-3.5 h-3.5" /> Compartir
                  </button>
                  {!isReadOnly && (
                    <button
                      onClick={() => setEmployeeModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-400 rounded-xl hover:from-amber-400 hover:to-amber-300 transition-all duration-200 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Editar Perfil
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {myEmployee && pendingRequests > 0 && (
            <div className="flex items-center gap-2 px-4 py-3 bg-amber-50/90 backdrop-blur-sm border border-amber-200/60 rounded-2xl text-xs font-medium text-amber-800 animate-in shadow-xs">
              <Send className="w-4 h-4 text-amber-600 shrink-0" />
              Tienes <span className="font-bold">{pendingRequests}</span> solicitud{ pendingRequests !== 1 ? 'es' : '' } de vacaciones pendiente{ pendingRequests !== 1 ? 's' : '' }
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="space-y-5 lg:col-span-1" style={{ animation: 'fadeSlideIn 0.5s ease-out 0.2s both' }}>
              <SectionCard icon={<User className="w-4 h-4" />} title="Acerca de" accent="primary">
                <div className="divide-y divide-gray-50 -my-2">
                  <DetailRow icon={<Mail className="w-4 h-4" />} label="Email" value={loggedInUser.email} />
                  <DetailRow icon={<Hash className="w-4 h-4" />} label="Usuario" value={loggedInUser.username} />
                  <DetailRow icon={<Shield className="w-4 h-4" />} label="Rol" value={
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold rounded-md border ${ROLE_BADGE[loggedInUser.role] || 'bg-gray-50 text-gray-600'}`}>
                      {loggedInUser.role}
                    </span>
                  } />
                  <DetailRow icon={<CheckCircle className="w-4 h-4" />} label="Estado" value={
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold rounded-md border ${loggedInUser.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-700 border-emerald-200/50' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${loggedInUser.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
                      {loggedInUser.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                    </span>
                  } />
                  <DetailRow icon={<MapPin className="w-4 h-4" />} label="Ciudad" value={cityMap[loggedInUser.city_id || ''] || 'Sin asignar'} />
                  <DetailRow icon={<Calendar className="w-4 h-4" />} label="Registro" value={formatDate(loggedInUser.created_at)} />
                </div>
              </SectionCard>

              {myEmployee && (
                <SectionCard icon={<SunSnow className="w-4 h-4" />} title="Vacaciones" accent="primary">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-primary-50/60 rounded-xl border border-primary-100/50">
                      <div>
                        <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Mes asignado</div>
                        <div className="text-sm font-bold text-primary-700 capitalize mt-0.5">{currentVacationMonth || 'Sin asignar'}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Próximo</div>
                        <div className="text-sm font-bold text-emerald-600 capitalize mt-0.5">{nextVacationMonth || '—'}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Días Propios', value: myEmployee.own_days, color: 'text-emerald-600', bg: 'bg-emerald-50/80 border-emerald-100/40' },
                        { label: 'Días Acumulados', value: myEmployee.accumulated_days, color: 'text-blue-600', bg: 'bg-blue-50/80 border-blue-100/40' },
                        { label: 'Días Excesos', value: myEmployee.excess_days, color: 'text-rose-600', bg: 'bg-rose-50/80 border-rose-100/40' },
                      ].map((item) => (
                        <div key={item.label} className={`flex flex-col items-center justify-center p-2.5 rounded-xl border ${item.bg}`}>
                          <div className={`text-lg font-bold ${item.color}`}>{item.value}</div>
                          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-0.5">{item.label}</div>
                        </div>
                      ))}
                    </div>

                    {!isReadOnly && (
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => setCambioVacacionesOpen(true)}
                          disabled={cambioSubmitted}
                          className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all duration-200 shadow-md active:scale-[0.98] ${
                            cambioSubmitted
                              ? 'bg-amber-100 text-amber-700 border border-amber-200 cursor-not-allowed shadow-none'
                              : 'text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 shadow-primary-500/20 hover:shadow-lg'
                          }`}
                        >
                          {cambioSubmitted ? (
                            <><CheckCircle className="w-4 h-4" /> Pendiente de cambio</>
                          ) : (
                            <><Calendar className="w-4 h-4" /> Cambio de Vacaciones</>
                          )}
                        </button>
                        <button
                          onClick={() => setSolicitarDiasOpen(true)}
                          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl hover:from-emerald-500 hover:to-emerald-400 transition-all duration-200 shadow-md shadow-emerald-500/20 hover:shadow-lg active:scale-[0.98]"
                        >
                          <Sun className="w-4 h-4" /> Solicitar Días
                        </button>
                      </div>
                    )}
                  </div>
                </SectionCard>
              )}
            </div>

            <div className="space-y-5 lg:col-span-2">
              {myEmployee ? (
                <>
                  <div style={{ animation: 'fadeSlideIn 0.5s ease-out 0.3s both' }}>
                    <SectionCard icon={<Briefcase className="w-4 h-4" />} title="Información Laboral" accent="emerald">
                      <div className="flex items-center gap-2 mb-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold rounded-full border ${STATUS_BADGE[myEmployee.status_id] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${myEmployee.status_id === 'es-1' ? 'bg-emerald-500' : myEmployee.status_id === 'es-2' ? 'bg-blue-500' : 'bg-gray-400'}`} />
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
                    </SectionCard>
                  </div>

                  <div style={{ animation: 'fadeSlideIn 0.5s ease-out 0.35s both' }}>
                    <SectionCard icon={<User className="w-4 h-4" />} title="Datos Personales" accent="blue">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <DetailRow icon={<User className="w-4 h-4" />} label="Nombre" value={`${myEmployee.name} ${myEmployee.lastName1} ${myEmployee.lastName2 || ''}`} />
                        <DetailRow icon={<Mail className="w-4 h-4" />} label="Email" value={myEmployee.email} />
                        <DetailRow icon={<Phone className="w-4 h-4" />} label="Teléfono" value={myEmployee.phone} />
                        <DetailRow icon={<Mail className="w-4 h-4" />} label="Email Personal" value={myEmployee.personal_email || '-'} />
                        <DetailRow icon={<MapPin className="w-4 h-4" />} label="Ciudad" value={cityMap[myEmployee.city_id || ''] || 'Sin asignar'} />
                      </div>
                    </SectionCard>
                  </div>

                  <div style={{ animation: 'fadeSlideIn 0.5s ease-out 0.4s both' }}>
                    <SectionCard icon={<FileText className="w-4 h-4" />} title="Contrato" accent="amber">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <DetailRow icon={<FileText className="w-4 h-4" />} label="Tipo" value={ctMap[myEmployee.contract_type || ''] || 'Sin especificar'} />
                        <DetailRow icon={<Calendar className="w-4 h-4" />} label="Inicio" value={myEmployee.contract_start_date || '-'} />
                        <DetailRow icon={<Calendar className="w-4 h-4" />} label="Fin" value={myEmployee.contract_end_date || 'Indefinido'} />
                        <DetailRow icon={<Banknote className="w-4 h-4" />} label="IRPF" value={`${myEmployee.irpf}%`} />
                        <DetailRow icon={<Hash className="w-4 h-4" />} label="IBAN" value={myEmployee.iban || '-'} />
                        <DetailRow icon={<PersonStanding className="w-4 h-4" />} label="Taquilla" value={myEmployee.locker || '-'} />
                      </div>
                    </SectionCard>
                  </div>

                  <div style={{ animation: 'fadeSlideIn 0.5s ease-out 0.45s both' }}>
                    <SectionCard icon={<Award className="w-4 h-4" />} title="Estados" accent="violet">
                      <div className="flex flex-wrap gap-2.5">
                        {[
                          { key: 'active', label: myEmployee.active ? 'Activo' : 'Inactivo', active: myEmployee.active, icon: <CheckCircle className="w-3.5 h-3.5" /> },
                          { key: 'medical', label: myEmployee.medical_check ? 'Rev. Médica Realizada' : 'Rev. Médica Pendiente', active: myEmployee.medical_check, icon: <CheckCircle className="w-3.5 h-3.5" /> },
                          { key: 'holidays', label: myEmployee.works_holidays ? 'Trabaja Festivos' : 'No trabaja Festivos', active: myEmployee.works_holidays, icon: <Calendar className="w-3.5 h-3.5" /> },
                        ].map((s) => (
                          <span key={s.key} className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all duration-200 hover:scale-105 active:scale-95 cursor-default ${s.active ? 'bg-emerald-500/10 text-emerald-700 border-emerald-200/50 shadow-sm' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                            {s.icon} {s.label}
                          </span>
                        ))}
                      </div>
                    </SectionCard>
                  </div>
                </>
              ) : (
                <EmptyEmployeeState onCreate={() => setEmployeeModalOpen(true)} />
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
        profileMode
      />

      <CambioVacacionesModal
        isOpen={cambioVacacionesOpen}
        onClose={() => setCambioVacacionesOpen(false)}
        currentMonth={currentVacationMonth}
        employeeId={myEmployee?.id || ''}
        onSubmit={handleCambioVacaciones}
      />

      <SolicitarDiasModal
        isOpen={solicitarDiasOpen}
        onClose={() => setSolicitarDiasOpen(false)}
        employeeId={myEmployee?.id || ''}
        disableWeekends={myEmployee?.work_day === 'wd-1'}
        onSubmit={handleSolicitarDias}
      />
    </div>
  );
};
