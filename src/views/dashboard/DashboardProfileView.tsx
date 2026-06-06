import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEmployees } from '../../context/EmployeeContext';
import { WorkReportsView } from '../admin/workReports/WorkReportsView';
import { EmployeeFormModal } from '../../components/modals/EmployeeFormModal';
import { CambioVacacionesModal } from '../../components/modals/CambioVacacionesModal';
import { SolicitarDiasModal } from '../../components/modals/SolicitarDiasModal';
import { INITIAL_EMPLOYEE_CATEGORIES, INITIAL_SHIFTS, INITIAL_WORK_DAYS, INITIAL_CONTRACT_TYPES, INITIAL_CITIES } from '../../data/mockEmployees';
import { INITIAL_WORK_CENTERS } from '../../data/mockWorkCenters';
import {
  User, Calendar,
  CheckCircle,
  ShieldAlert,
  Mail, Phone,
  SunSnow,
  Sparkles,
  Send, Sun, ClipboardCheck,
  Briefcase, Shield, Hash, MapPin, Clock, Building2, IdCard, Award,
  Plus, X, Check, AlertTriangle,
} from 'lucide-react';

const VACATION_MONTHS = ['JULIO', 'AGOSTO', 'SEPTIEMBRE'] as const;

function getCurrentVacationMonth(month: string | null, year: number | null): string | null {
  if (!month || !year) return null;
  const currentYear = new Date().getFullYear();
  const diff = currentYear - year;
  const idx = VACATION_MONTHS.indexOf(month as typeof VACATION_MONTHS[number]);
  if (idx === -1) return null;
  const currentIdx = ((idx + diff) % 3 + 3) % 3;
  return VACATION_MONTHS[currentIdx];
}

const cityMap = Object.fromEntries(INITIAL_CITIES.map((c) => [c.id, c.name]));
const catMap = Object.fromEntries(INITIAL_EMPLOYEE_CATEGORIES.map((c) => [c.id, c.name]));
const shiftMap = Object.fromEntries(INITIAL_SHIFTS.map((s) => [s.id, s.name]));
const wdMap = Object.fromEntries(INITIAL_WORK_DAYS.map((w) => [w.id, w.name]));
const wcMap = Object.fromEntries(INITIAL_WORK_CENTERS.map((w) => [w.id, w.name]));
const ctMap = Object.fromEntries(INITIAL_CONTRACT_TYPES.map((c) => [c.id, c.name]));

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: string | React.ReactNode }> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="text-app-text-secondary mt-0.5 shrink-0">{icon}</div>
    <div>
      <div className="text-xs text-app-text-secondary">{label}</div>
      <div className="text-sm text-app-text">{value}</div>
    </div>
  </div>
);

const SectionCard: React.FC<{ icon: React.ReactNode; title: string; action?: React.ReactNode; children: React.ReactNode }> = ({ icon, title, action, children }) => (
  <div className="bg-app-card rounded-xl border border-app-card-border p-4">
    <div className="flex items-center gap-2 mb-4 text-app-text font-semibold text-sm">
      {icon}
      <span className="flex-1">{title}</span>
      {action}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </div>
);

export const DashboardProfileView: React.FC = () => {
  const { user: loggedInUser, triggerToast } = useAuth();
  const { employees, createEmployee, updateEmployee, createVacationRequest, vacationRequests, getVacationRequestsByEmployee } = useEmployees();

  const isReadOnly = loggedInUser?.role === 'USER';

  type ProfileTab = 'info' | 'solicitar' | 'parte';
  const [activeTab, setActiveTab] = useState<ProfileTab>('info');

  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [cambioVacacionesOpen, setCambioVacacionesOpen] = useState(false);
  const [solicitarDiasOpen, setSolicitarDiasOpen] = useState(false);
  const [cambioSubmitted, setCambioSubmitted] = useState(false);
  const [requestModalCard, setRequestModalCard] = useState<'personal' | 'employee' | null>(null);
  const [requestText, setRequestText] = useState('');

  const myEmployee = useMemo(
    () => (loggedInUser ? employees.find((e) => e.id === loggedInUser.employee_id) : undefined),
    [employees, loggedInUser]
  );

  const currentVacationMonth = useMemo(
    () => myEmployee ? getCurrentVacationMonth(myEmployee.vacation_month, myEmployee.vacation_year) : null,
    [myEmployee]
  );

  const fullName = loggedInUser?.full_name || '';

  const categoryName = myEmployee ? catMap[myEmployee.category_id] || myEmployee.category_id : '';
  const shiftName = myEmployee ? shiftMap[myEmployee.shift_id] || myEmployee.shift_id : '';
  const scheduleDisplay = myEmployee ? `${myEmployee.start_time || '—'} — ${myEmployee.end_time || '—'}` : '—';

  const handleEmployeeSubmit = (data: Omit<import('../../types').Employee, 'id' | 'created_at' | 'updated_at'>) => {
    if (isReadOnly) return false;
    if (myEmployee) {
      updateEmployee(myEmployee.id, data);
    } else if (loggedInUser) {
      createEmployee({ ...data, city_id: loggedInUser.city_id || null });
    }
    setEmployeeModalOpen(false);
    return true;
  };

  const handleCambioVacaciones = (data: { type: 'VACATION_CHANGE'; requested_month: 'JULIO' | 'AGOSTO' | 'SEPTIEMBRE' | 'SPLIT' }) => {
    if (!myEmployee || isReadOnly) return;
    createVacationRequest({
      employee_id: myEmployee.id,
      type: data.type,
      status: 'PENDING',
      requested_month: data.requested_month,
    });
    setCambioVacacionesOpen(false);
    setCambioSubmitted(true);
  };

  const handleSolicitarDias = (data: { type: 'FREE_DAYS'; requested_days: string[] }) => {
    if (!myEmployee || isReadOnly) return;
    createVacationRequest({
      employee_id: myEmployee.id,
      type: data.type,
      status: 'PENDING',
      requested_days: data.requested_days,
    });
    setSolicitarDiasOpen(false);
  };

  const pendingRequests = useMemo(
    () => myEmployee ? getVacationRequestsByEmployee(myEmployee.id).filter((r) => r.status === 'PENDING').length : 0,
    [myEmployee, vacationRequests]
  );

  return (
    <div className="-mx-5 -mt-5 flex min-w-0 flex-auto flex-col">
      {isReadOnly && (
        <div className="flex items-center gap-3 px-5 py-3.5 mx-5 mt-5 text-xs font-medium text-amber-900 bg-amber-50/90 backdrop-blur-sm border border-amber-200/80 rounded-2xl shadow-xs animate-in">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span><span className="font-bold">Modo Consulta:</span> Tu rol es <span className="px-1.5 py-0.5 font-mono bg-amber-100 rounded-md text-amber-800">USER</span>. Los datos se muestran en modo solo lectura.</span>
        </div>
      )}

      {loggedInUser && (
        <>
          {/* Cover + Header Bar */}
            <div className="bg-white flex flex-col shadow-sm border-b border-app-border">
              {/* Cover Image */}
              <div>
                <img
                  className="h-40 object-cover lg:h-56 w-full"
                  src="/cover.jpg"
                  alt="Cover image"
                />
              </div>

              {/* Bar with Avatar + Name + Nav */}
              <div className="bg-white mx-auto flex w-full max-w-5xl flex-col items-center px-6 lg:h-20 lg:flex-row lg:px-8">
                {/* Avatar */}
                <div className="-mt-16 rounded-full lg:-mt-20">
                  <span className="flex h-24 w-24 items-center justify-center rounded-full text-3xl font-bold uppercase tracking-wide text-app-text ring-4 ring-green-500 bg-gray-100 shadow-md">
                    {((myEmployee?.name?.[0] ?? '') + (myEmployee?.last_name1?.[0] ?? '')).toUpperCase()}
                  </span>
                </div>

                {/* Name + Email */}
                <div className="mt-2 flex flex-col items-center lg:ml-6 lg:mt-0 lg:items-start">
                  <div className="text-xl font-bold leading-none text-app-text">{fullName}</div>
                  <div className="text-sm text-app-text-secondary mt-0.5">{loggedInUser.email}</div>
                </div>

                {/* Nav Tabs — pill style */}
                <div className="mb-4 mt-5 lg:mb-0 lg:ml-auto lg:mt-0">
                  <div className="flex gap-1.5 bg-app-bg rounded-xl p-1 overflow-x-auto">
                    {([
                      { key: 'info' as const, label: 'Info', icon: <User className="h-4 w-4" /> },
                      { key: 'solicitar' as const, label: 'Solicitar', icon: <Calendar className="h-4 w-4" /> },
                      { key: 'parte' as const, label: 'Parte de Trabajo', icon: <ClipboardCheck className="h-4 w-4" /> },
                    ]).map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                          activeTab === tab.key
                            ? 'bg-white text-primary-700 shadow-xs'
                            : 'text-app-text-secondary hover:text-app-text'
                        }`}
                      >
                        {tab.icon} {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          {/* Tab Content */}
          <div className="mx-auto flex w-full max-w-4xl flex-auto justify-center p-6">
            {activeTab === 'info' && (
              <div className="w-full flex flex-col gap-5">
                {/* Compact employee card — WorkReportsView style */}
                <div className="bg-app-card rounded-xl border border-app-card-border p-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <User className="h-4 w-4 text-primary-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] text-app-text-secondary uppercase tracking-wider font-medium">Empleado</p>
                      <p className="text-sm font-semibold text-app-text truncate">{fullName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Mail className="h-4 w-4 text-primary-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] text-app-text-secondary uppercase tracking-wider font-medium">Email</p>
                      <p className="text-sm font-semibold text-app-text truncate">{loggedInUser.email || '—'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Shield className="h-4 w-4 text-primary-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] text-app-text-secondary uppercase tracking-wider font-medium">Rol</p>
                      <p className="text-sm font-semibold text-app-text truncate">{loggedInUser.role || '—'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <MapPin className="h-4 w-4 text-primary-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] text-app-text-secondary uppercase tracking-wider font-medium">Ciudad</p>
                      <p className="text-sm font-semibold text-app-text truncate">{cityMap[loggedInUser.city_id || ''] || loggedInUser.city_id || '—'}</p>
                    </div>
                  </div>
                </div>

                {myEmployee ? (
                  <>
                    <SectionCard
                      icon={<User className="h-4 w-4" />}
                      title="Información Personal"
                      action={
                        <button
                          onClick={() => setRequestModalCard('personal')}
                          className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Solicitar cambio
                        </button>
                      }
                    >
                      <InfoRow icon={<User className="h-4 w-4" />} label="Nombre completo" value={fullName} />
                      <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={loggedInUser.email || '—'} />
                      <InfoRow icon={<Phone className="h-4 w-4" />} label="Teléfono" value={myEmployee?.phone || '—'} />
                      <InfoRow icon={<Hash className="h-4 w-4" />} label="Usuario" value={loggedInUser.username || '—'} />
                      <InfoRow icon={<Shield className="h-4 w-4" />} label="Rol" value={loggedInUser.role || '—'} />
                      <InfoRow icon={<MapPin className="h-4 w-4" />} label="Ciudad" value={cityMap[loggedInUser.city_id || ''] || loggedInUser.city_id || '—'} />
                    </SectionCard>

                    <SectionCard
                      icon={<Award className="h-4 w-4" />}
                      title="Información del Empleado"
                      action={
                        <button
                          onClick={() => setRequestModalCard('employee')}
                          className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Solicitar cambio
                        </button>
                      }
                    >
                      <InfoRow icon={<Award className="h-4 w-4" />} label="Categoría" value={categoryName || '—'} />
                      <InfoRow icon={<Clock className="h-4 w-4" />} label="Turno" value={shiftName || '—'} />
                      <InfoRow icon={<Calendar className="h-4 w-4" />} label="Horario" value={scheduleDisplay} />
                      <InfoRow icon={<IdCard className="h-4 w-4" />} label="Contrato" value={myEmployee.contract_type ? ctMap[myEmployee.contract_type] || myEmployee.contract_type : '—'} />
                      <InfoRow icon={<Building2 className="h-4 w-4" />} label="Centro de Trabajo" value={myEmployee.work_center_id ? (wcMap[myEmployee.work_center_id] || myEmployee.work_center_id) : '—'} />
                      <InfoRow icon={<Calendar className="h-4 w-4" />} label="Días Laborables" value={myEmployee.work_day_id ? wdMap[myEmployee.work_day_id] || myEmployee.work_day_id : '—'} />
                    </SectionCard>
                  </>
                ) : (
                  <div className="bg-app-card rounded-xl border border-app-card-border p-8 text-center">
                    <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-app-text-secondary">Sin información de empleado</p>
                    {!isReadOnly && (
                      <button
                        onClick={() => setEmployeeModalOpen(true)}
                        className="mt-3 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-all"
                      >
                        <Sparkles className="w-4 h-4" /> Crear Ficha
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'solicitar' && (
              <div className="w-full flex flex-col gap-5">
                {myEmployee ? (
                  <>
                    {pendingRequests > 0 && (
                      <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs font-medium text-amber-800">
                        <Send className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        Tienes {pendingRequests} solicitud{pendingRequests !== 1 ? 'es' : ''} pendiente{pendingRequests !== 1 ? 's' : ''}
                      </div>
                    )}

                    <div className="bg-app-card rounded-xl border border-app-card-border p-4">
                      <div className="flex items-center gap-2 mb-4 text-app-text font-semibold text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>Vacaciones</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col items-center rounded-xl bg-primary-50 p-4">
                          <div className="text-3xl font-bold text-primary-600">{myEmployee.own_days ?? '—'}</div>
                          <div className="mt-1 text-center text-xs font-medium text-primary-700">Días Propios</div>
                        </div>
                        <div className="flex flex-col items-center rounded-xl bg-amber-50 p-4">
                          <div className="text-3xl font-bold text-amber-600">{myEmployee.accumulated_days ?? '—'}</div>
                          <div className="mt-1 text-center text-xs font-medium text-amber-700">Acumulados</div>
                        </div>
                        <div className="flex flex-col items-center rounded-xl bg-violet-50 p-4">
                          <div className="text-3xl font-bold text-violet-600">{myEmployee.vacation_days ?? '—'}</div>
                          <div className="mt-1 text-center text-xs font-medium text-violet-700">Vacaciones</div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-app-card-border">
                        <div className="flex items-center gap-2">
                          <SunSnow className="h-4 w-4 text-primary-500 shrink-0" />
                          <div>
                            <div className="text-xs text-app-text-secondary">Mes de Vacaciones</div>
                            <div className="text-sm font-medium text-app-text">{currentVacationMonth || 'No asignado'}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {!isReadOnly && (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => setCambioVacacionesOpen(true)}
                          disabled={cambioSubmitted}
                          className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all active:scale-[0.98] ${
                            cambioSubmitted
                              ? 'bg-amber-100 text-amber-700 border border-amber-200 cursor-not-allowed'
                              : 'text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 shadow-sm'
                          }`}
                        >
                          {cambioSubmitted ? (
                            <><CheckCircle className="w-4 h-4" /> Pendiente</>
                          ) : (
                            <><Calendar className="w-4 h-4" /> Cambio de Mes</>
                          )}
                        </button>
                        <button
                          onClick={() => setSolicitarDiasOpen(true)}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl hover:from-emerald-500 hover:to-emerald-400 transition-all shadow-sm active:scale-[0.98]"
                        >
                          <Sun className="w-4 h-4" /> Solicitar Días
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-app-card rounded-xl border border-app-card-border p-8 text-center">
                    <SunSnow className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-app-text-secondary">Sin información de vacaciones</p>
                    {!isReadOnly && (
                      <button
                        onClick={() => setEmployeeModalOpen(true)}
                        className="mt-3 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-all"
                      >
                        <Sparkles className="w-4 h-4" /> Crear Ficha
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'parte' && (
              <div className="w-full">
                <WorkReportsView />
              </div>
            )}
          </div>
        </>
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
        disableWeekends={myEmployee?.work_day_id === 'wd_1'}
        onSubmit={handleSolicitarDias}
      />

      {requestModalCard && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-sidebar/80 backdrop-blur-xs">
          <div className="bg-app-card rounded-2xl shadow-xl w-full max-w-lg border border-app-card-border overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-5 py-4 bg-gradient-to-r from-primary-600 to-primary-500 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/20 text-white">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Solicitar cambio</h3>
                  <p className="text-xs text-white/70">
                    {requestModalCard === 'personal' ? 'Información Personal' : 'Información del Empleado'}
                  </p>
                </div>
              </div>
              <button onClick={() => { setRequestModalCard(null); setRequestText(''); }} className="text-white/70 hover:text-white p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-app-text mb-1">Describe qué dato necesita ser modificado</h4>
                <p className="text-[11px] text-app-text-secondary">
                  Indica el campo y el nuevo valor. Un administrador revisará tu solicitud y hará el cambio en el panel correspondiente.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-800">
                    <p className="font-semibold mb-0.5">Campos actuales:</p>
                    <ul className="space-y-0.5 text-amber-700">
                      {requestModalCard === 'personal' ? (
                        <>
                          <li>• Nombre: <strong>{fullName}</strong></li>
                          <li>• Email: <strong>{loggedInUser.email || '—'}</strong></li>
                          <li>• Teléfono: <strong>{myEmployee?.phone || '—'}</strong></li>
                          <li>• Ciudad: <strong>{cityMap[loggedInUser.city_id || ''] || loggedInUser.city_id || '—'}</strong></li>
                        </>
                      ) : (
                        <>
                          <li>• Categoría: <strong>{categoryName || '—'}</strong></li>
                          <li>• Turno: <strong>{shiftName || '—'}</strong></li>
                          <li>• Contrato: <strong>{myEmployee?.contract_type ? ctMap[myEmployee.contract_type] || myEmployee.contract_type : '—'}</strong></li>
                          <li>• Centro: <strong>{myEmployee?.work_center_id ? (wcMap[myEmployee.work_center_id] || myEmployee.work_center_id) : '—'}</strong></li>
                          <li>• Días Laborables: <strong>{myEmployee?.work_day_id ? wdMap[myEmployee.work_day_id] || myEmployee.work_day_id : '—'}</strong></li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-app-text-secondary mb-1.5 block">Describe el cambio solicitado</label>
                <textarea
                  value={requestText}
                  onChange={(e) => setRequestText(e.target.value)}
                  placeholder="Ej: Cambiar teléfono a 612345678"
                  rows={4}
                  className="w-full rounded-xl border border-app-border px-4 py-3 text-sm bg-white text-app-text resize-none placeholder:text-app-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
                />
              </div>
            </div>

            <div className="px-5 py-4 border-t border-app-border flex items-center justify-between shrink-0 bg-app-bg/50">
              <span className="text-[11px] text-app-text-secondary">
                {requestText.trim() ? 'Solicitud lista para enviar' : 'Escribe tu solicitud'}
              </span>
              <div className="flex items-center gap-2">
                <button onClick={() => { setRequestModalCard(null); setRequestText(''); }} className="px-4 py-2 border border-app-border hover:bg-app-bg text-app-text-secondary text-sm font-semibold rounded-xl transition-colors">
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (!requestText.trim()) return;
                    triggerToast('Solicitud enviada correctamente. Un administrador revisará los cambios.', 'success');
                    setRequestModalCard(null);
                    setRequestText('');
                  }}
                  disabled={!requestText.trim()}
                  className={`inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold rounded-xl shadow-xs transition-all ${
                    requestText.trim()
                      ? 'text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 active:scale-95'
                      : 'text-app-text-secondary bg-app-bg cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  Enviar Solicitud
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
