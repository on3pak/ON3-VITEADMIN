import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEmployees } from '../../context/EmployeeContext';
import { EmployeeFormModal } from '../../components/modals/EmployeeFormModal';
import { CambioVacacionesModal } from '../../components/modals/CambioVacacionesModal';
import { SolicitarDiasModal } from '../../components/modals/SolicitarDiasModal';
import { INITIAL_EMPLOYEE_CATEGORIES, INITIAL_EMPLOYEE_STATUSES, INITIAL_SHIFTS, INITIAL_WORK_DAYS, INITIAL_CONTRACT_TYPES, INITIAL_CITIES } from '../../data/mockEmployees';
import { INITIAL_WORK_CENTERS } from '../../data/mockWorkCenters';
import {
  User, Calendar,
  CheckCircle,
  ShieldAlert,
  Mail, Phone,
  SunSnow,
  Sparkles,
  Send, Sun,
  Briefcase, Shield, Hash, MapPin, Clock, Building2, IdCard, Clock3, Award,
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
const statusMap = Object.fromEntries(INITIAL_EMPLOYEE_STATUSES.map((s) => [s.id, s.name]));
const shiftMap = Object.fromEntries(INITIAL_SHIFTS.map((s) => [s.id, s.name]));
const wdMap = Object.fromEntries(INITIAL_WORK_DAYS.map((w) => [w.id, w.name]));
const wcMap = Object.fromEntries(INITIAL_WORK_CENTERS.map((w) => [w.id, w.name]));
const ctMap = Object.fromEntries(INITIAL_CONTRACT_TYPES.map((c) => [c.id, c.name]));

export const DashboardProfileView: React.FC = () => {
  const { user: loggedInUser } = useAuth();
  const { employees, createEmployee, updateEmployee, createVacationRequest, vacationRequests, getVacationRequestsByEmployee } = useEmployees();

  const isReadOnly = loggedInUser?.role === 'USER';

  type ProfileTab = 'info' | 'solicitar';
  const [activeTab, setActiveTab] = useState<ProfileTab>('info');

  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [cambioVacacionesOpen, setCambioVacacionesOpen] = useState(false);
  const [solicitarDiasOpen, setSolicitarDiasOpen] = useState(false);
  const [cambioSubmitted, setCambioSubmitted] = useState(false);

  const myEmployee = useMemo(
    () => (loggedInUser ? employees.find((e) => e.id === loggedInUser.employee_id) : undefined),
    [employees, loggedInUser]
  );

  const currentVacationMonth = useMemo(
    () => myEmployee ? getCurrentVacationMonth(myEmployee.vacation_month, myEmployee.vacation_year) : null,
    [myEmployee]
  );

  const fullName = useMemo(() => {
    if (myEmployee) {
      return [myEmployee.name, myEmployee.last_name1, myEmployee.last_name2].filter(Boolean).join(' ');
    }
    return loggedInUser?.full_name || '';
  }, [myEmployee, loggedInUser]);

  const categoryName = myEmployee ? catMap[myEmployee.category_id] || myEmployee.category_id : '';
  const statusName = myEmployee ? statusMap[myEmployee.status_id] || myEmployee.status_id : '';
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
                {loggedInUser.avatar_url ? (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full ring-4 ring-green-500 bg-gray-50 overflow-hidden shadow-md">
                    <img
                      src={loggedInUser.avatar_url}
                      alt={fullName}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <span className="flex h-24 w-24 items-center justify-center rounded-full text-3xl font-bold uppercase tracking-wide text-app-text ring-4 ring-green-500 bg-gray-50 shadow-md">
                    {fullName.charAt(0)}
                  </span>
                )}
              </div>

              {/* Name + Email */}
              <div className="mt-2 flex flex-col items-center lg:ml-6 lg:mt-0 lg:items-start">
                <div className="text-xl font-bold leading-none text-app-text">{fullName}</div>
                <div className="text-sm text-app-text-secondary mt-0.5">{loggedInUser.email}</div>
              </div>

              {/* Nav Tabs — segmented control style */}
              <div className="mb-4 mt-5 lg:mb-0 lg:ml-auto lg:mt-0">
                <div className="inline-flex rounded-lg border border-app-border overflow-hidden shadow-xs bg-app-border gap-px">
                  {([
                    { key: 'info' as const, label: 'Info' },
                    { key: 'solicitar' as const, label: 'Solicitar' },
                  ]).map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`px-4 py-1.5 text-sm font-medium transition-all ${
                        activeTab === tab.key
                          ? 'bg-primary-500 text-white shadow-sm'
                          : 'bg-white text-app-text-secondary hover:bg-gray-50'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mx-auto flex w-full max-w-2xl flex-auto justify-center p-6 sm:p-8">
            {activeTab === 'info' && (
              <div className="w-full flex flex-col gap-6">
                {myEmployee ? (
                  <>
                    {/* User + Employee combined card */}
                    <div className="w-full flex flex-col p-8 bg-white rounded-xl border border-app-border shadow-sm">
                      <div className="text-base font-semibold text-app-text">Información Personal</div>
                      <div className="mt-6 flex flex-col gap-5">
                        <div className="flex items-center">
                          <User className="mr-3 h-5 w-5 text-primary-600 shrink-0" />
                          <div>
                            <div className="text-xs text-app-text-secondary">Nombre completo</div>
                            <div className="text-sm text-app-text">{fullName}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Mail className="mr-3 h-5 w-5 text-primary-600 shrink-0" />
                          <div>
                            <div className="text-xs text-app-text-secondary">Email</div>
                            <div className="text-sm text-app-text">{loggedInUser.email || '—'}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Phone className="mr-3 h-5 w-5 text-primary-600 shrink-0" />
                          <div>
                            <div className="text-xs text-app-text-secondary">Teléfono</div>
                            <div className="text-sm text-app-text">{myEmployee?.phone || '—'}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Hash className="mr-3 h-5 w-5 text-primary-600 shrink-0" />
                          <div>
                            <div className="text-xs text-app-text-secondary">Usuario</div>
                            <div className="text-sm text-app-text">{loggedInUser.username || '—'}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Shield className="mr-3 h-5 w-5 text-primary-600 shrink-0" />
                          <div>
                            <div className="text-xs text-app-text-secondary">Rol</div>
                            <div className="text-sm text-app-text">{loggedInUser.role || '—'}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="mr-3 h-5 w-5 text-primary-600 shrink-0" />
                          <div>
                            <div className="text-xs text-app-text-secondary">Ciudad</div>
                            <div className="text-sm text-app-text">{cityMap[loggedInUser.city_id || ''] || loggedInUser.city_id || '—'}</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 pt-8 border-t border-app-border">
                        <div className="text-base font-semibold text-app-text">Información del Empleado</div>
                        <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-5">
                          <div>
                            <div className="text-xs font-medium text-app-text-secondary uppercase tracking-wider">Categoría</div>
                            <div className="mt-1.5 flex items-center gap-2 text-sm font-medium text-app-text">
                              <Award className="w-4 h-4 text-primary-500 shrink-0" />
                              {categoryName || '—'}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs font-medium text-app-text-secondary uppercase tracking-wider">Turno</div>
                            <div className="mt-1.5 flex items-center gap-2 text-sm font-medium text-app-text">
                              <Clock className="w-4 h-4 text-primary-500 shrink-0" />
                              {shiftName || '—'}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs font-medium text-app-text-secondary uppercase tracking-wider">Horario</div>
                            <div className="mt-1.5 flex items-center gap-2 text-sm font-medium text-app-text">
                              <Clock3 className="w-4 h-4 text-primary-500 shrink-0" />
                              {scheduleDisplay}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs font-medium text-app-text-secondary uppercase tracking-wider">Contrato</div>
                            <div className="mt-1.5 flex items-center gap-2 text-sm font-medium text-app-text">
                              <IdCard className="w-4 h-4 text-primary-500 shrink-0" />
                              {myEmployee.contract_type ? ctMap[myEmployee.contract_type] || myEmployee.contract_type : '—'}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs font-medium text-app-text-secondary uppercase tracking-wider">Centro de Trabajo</div>
                            <div className="mt-1.5 flex items-center gap-2 text-sm font-medium text-app-text">
                              <Building2 className="w-4 h-4 text-primary-500 shrink-0" />
                              {myEmployee.work_center_id ? (wcMap[myEmployee.work_center_id] || myEmployee.work_center_id) : '—'}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs font-medium text-app-text-secondary uppercase tracking-wider">Días Laborables</div>
                            <div className="mt-1.5 flex items-center gap-2 text-sm font-medium text-app-text">
                              <Calendar className="w-4 h-4 text-primary-500 shrink-0" />
                              {myEmployee.work_day_id ? wdMap[myEmployee.work_day_id] || myEmployee.work_day_id : '—'}
                            </div>
                          </div>
                          <div className="col-span-2">
                            <div className="text-xs font-medium text-app-text-secondary uppercase tracking-wider">Estado</div>
                            <div className="mt-1.5">
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                myEmployee.active
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                <span className={`mr-1.5 h-2 w-2 rounded-full ${
                                  myEmployee.active ? 'bg-emerald-500' : 'bg-gray-400'
                                }`} />
                                {statusName || '—'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Schedule card */}
                    <div className="w-full flex flex-col p-8 bg-white rounded-xl border border-app-border shadow-sm">
                      <div className="text-base font-semibold text-app-text">Jornada Laboral</div>
                      <div className="mt-6 grid grid-cols-2 gap-6">
                        <div>
                          <div className="text-xs font-medium text-app-text-secondary uppercase tracking-wider">Hora de Entrada</div>
                          <div className="mt-1 text-lg font-bold text-app-text">{myEmployee.start_time || '—'}</div>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-app-text-secondary uppercase tracking-wider">Hora de Salida</div>
                          <div className="mt-1 text-lg font-bold text-app-text">{myEmployee.end_time || '—'}</div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full flex flex-col items-center py-12 text-center bg-white rounded-xl border border-app-border shadow-sm">
                    <Briefcase className="w-12 h-12 text-gray-300 mb-3" />
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
              <div className="w-full flex flex-col gap-6">
                {myEmployee ? (
                  <>
                    {pendingRequests > 0 && (
                      <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs font-medium text-amber-800">
                        <Send className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        Tienes {pendingRequests} solicitud{pendingRequests !== 1 ? 'es' : ''} pendiente{pendingRequests !== 1 ? 's' : ''}
                      </div>
                    )}

                    <div className="w-full flex flex-col p-8 bg-white rounded-xl border border-app-border shadow-sm">
                      <div className="text-base font-semibold text-app-text">Vacaciones</div>
                      <div className="mt-5 grid grid-cols-3 gap-4">
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

                      <div className="mt-6 pt-6 border-t border-app-border">
                        <div className="text-xs font-medium text-app-text-secondary uppercase tracking-wider mb-3">Mes de Vacaciones</div>
                        <div className="flex items-center gap-2 text-sm font-medium text-app-text">
                          <SunSnow className="w-4 h-4 text-primary-500 shrink-0" />
                          {currentVacationMonth || 'No asignado'}
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
                  <div className="w-full flex flex-col items-center py-12 text-center bg-white rounded-xl border border-app-border shadow-sm">
                    <SunSnow className="w-12 h-12 text-gray-300 mb-3" />
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
    </div>
  );
};
