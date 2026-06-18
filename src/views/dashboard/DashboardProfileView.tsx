import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLookupsContext } from '../../context/LookupContext';
import { employeesApi, vacationsApi } from '../../api/services';
import { api } from '../../api/client';
import type { EmployeeDetail, VacationRequest, ArticleType } from '../../types';
import { EmployeeFormModal } from '../../components/modals/EmployeeFormModal';
import { CambioVacacionesModal } from '../../components/modals/CambioVacacionesModal';
import { SolicitarDiasModal } from '../../components/modals/SolicitarDiasModal';
import {
  User, Calendar, ChevronLeft, ChevronRight,
  ShieldAlert,
  Mail, Phone,
  SunSnow,
  Sparkles,
  Send, Sun,
  Briefcase, Shield, MapPin, Clock, Building2, IdCard, Award,
  CreditCard, Percent, Shirt, Download, Eye, X, History,
} from 'lucide-react';

const VACATION_MONTHS = ['july', 'august', 'september'] as const;
const VACATION_MONTH_INDEX: Record<string, number> = { july: 6, august: 7, september: 8 };

const CITY_BG_IMAGES: Record<string, string> = {
  'Alcalá de Henares': '/img/wallpapers/alcala.webp',
  'Guadalajara': '/img/wallpapers/guadalajara.webp',
};

const CITY_DARK_IMAGES: Record<string, string> = {
  'Alcalá de Henares': '/img/wallpapers/alcala-dark.webp',
  'Guadalajara': '/img/wallpapers/guadalajara-dark.webp',
};

function getCurrentVacationMonth(month: string | null): string | null {
  if (!month) return null;
  const idx = VACATION_MONTHS.indexOf(month as typeof VACATION_MONTHS[number]);
  if (idx === -1) return null;
  return VACATION_MONTHS[idx];
}

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: string | React.ReactNode }> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="text-app-text-secondary mt-0.5 shrink-0">{icon}</div>
    <div>
      <div className="text-xs text-app-text-secondary">{label}</div>
      <div className="text-sm text-app-text">{value}</div>
    </div>
  </div>
);

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return dateStr;
}

const SectionCard: React.FC<{ icon: React.ReactNode; title: string; action?: React.ReactNode; children: React.ReactNode }> = ({ icon, title, action, children }) => (
  <div className="relative overflow-hidden rounded-2xl border border-white/10 dark:border-white/10 bg-white dark:bg-[#07182E] shadow-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,183,255,0.3)] p-5">
    <div className="flex items-center gap-3 mb-4">
      <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg border border-white/20">
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <span className="text-sm font-bold text-app-text dark:text-white/90 truncate block">{title}</span>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </div>
);

export const DashboardProfileView: React.FC = () => {
  const { user: loggedInUser, employee: profileEmployee, vacations: profileVacations, triggerToast, darkMode } = useAuth();
  const { cityMap, categoryMap, shiftMap, workDayMap, workCenterMap, contractTypeMap } = useLookupsContext();

  const isReadOnly = loggedInUser?.role === 'user';

  const [myEmployee, setMyEmployee] = useState<EmployeeDetail | undefined>(profileEmployee ?? undefined);
  const [vacationRequests, setVacationRequests] = useState<VacationRequest[]>(profileVacations ?? []);

  useEffect(() => {
    if (profileEmployee) setMyEmployee(profileEmployee);
  }, [profileEmployee]);

  useEffect(() => {
    if (profileVacations?.length > 0) setVacationRequests(profileVacations);
  }, [profileVacations]);

  // fallback: fetch if auth context didn't have profile data
  useEffect(() => {
    if (!loggedInUser?.employee_id || myEmployee) return;
    employeesApi.getById(loggedInUser.employee_id).then(setMyEmployee).catch(() => {});
  }, [loggedInUser?.employee_id, myEmployee]);

  type ProfileTab = 'info' | 'calendario';
  const [activeTab, setActiveTab] = useState<ProfileTab>('info');

  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [cambioVacacionesOpen, setCambioVacacionesOpen] = useState(false);
  const [solicitarDiasOpen, setSolicitarDiasOpen] = useState(false);
  const [solicitarExcedenciaOpen, setSolicitarExcedenciaOpen] = useState(false);
  const [cambioSubmitted, setCambioSubmitted] = useState(false);
  const [visualizarLicenseOpen, setVisualizarLicenseOpen] = useState(false);

  const [coverError, setCoverError] = useState(false);
  const [coverLoaded, setCoverLoaded] = useState(false);
  const [activeEmployeeTab, setActiveEmployeeTab] = useState<string>('personal');

  // Calendar state
  const today = useMemo(() => new Date(), []);
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const calYear = today.getFullYear();
  const [holidays, setHolidays] = useState<string[]>([]);
  const [holidaysLoading, setHolidaysLoading] = useState(false);

  useEffect(() => {
    const cityId = myEmployee?.city_id || loggedInUser?.city_id;
    if (!cityId) return;
    setHolidaysLoading(true);
    api.get<{ data: { date: string }[] }>('/holidays', { city_id: cityId, year: calYear })
      .then((res) => setHolidays((res?.data || []).map((h) => h.date)))
      .catch(() => setHolidays([]))
      .finally(() => setHolidaysLoading(false));
  }, [myEmployee?.city_id, loggedInUser?.city_id]);

  const coverSrc = useMemo(() => {
    const cityName = cityMap[loggedInUser?.city_id || ''];
    if (!cityName) return '/img/wallpapers/alcala.webp';
    return darkMode
      ? (CITY_DARK_IMAGES[cityName] || '/img/wallpapers/alcala-dark.webp')
      : (CITY_BG_IMAGES[cityName] || '/img/wallpapers/alcala.webp');
  }, [loggedInUser?.city_id, cityMap, darkMode]);

  const fallbackCover = useMemo(() => {
    const cityName = cityMap[loggedInUser?.city_id || ''];
    if (!cityName) return '/img/wallpapers/alcala.webp';
    return darkMode
      ? (CITY_DARK_IMAGES[cityName] || '/img/wallpapers/alcala-dark.webp')
      : (CITY_BG_IMAGES[cityName] || '/img/wallpapers/alcala.webp');
  }, [loggedInUser?.city_id, cityMap, darkMode]);

  const displayCover = coverError ? fallbackCover : coverSrc;

  useEffect(() => {
    setCoverError(false);
    setCoverLoaded(false);
    const img = new Image();
    img.onload = () => setCoverLoaded(true);
    img.onerror = () => { setCoverError(true); setCoverLoaded(true); };
    img.src = coverSrc;
  }, [coverSrc]);

  const fullName = loggedInUser?.full_name || '';

  const categoryName = myEmployee
    ? (myEmployee as EmployeeDetail).category?.name || categoryMap[myEmployee.category_id] || myEmployee.category_id
    : '';
  const workCenterName = myEmployee
    ? (myEmployee as EmployeeDetail).work_center?.name || workCenterMap[myEmployee.work_center_id] || myEmployee.work_center_id
    : '';
  const cityName = myEmployee
    ? (myEmployee as EmployeeDetail).city?.name || cityMap[myEmployee.city_id || ''] || myEmployee.city_id || ''
    : '';
  const statusName = myEmployee
    ? (myEmployee as EmployeeDetail).status?.name || ''
    : '';
  const empDetail = myEmployee as EmployeeDetail | undefined;
  const empPayroll = empDetail?.payroll;
  const empExtras = empDetail?.extras;
  const empSchedule = empDetail?.schedule;
  const empContracts = empDetail?.contract || (empDetail as Record<string, any>)?.contracts;
  const empLeaveBalances = empDetail?.leave_balances ?? [];
  const currentLeaveBalance = empLeaveBalances.length > 0 ? empLeaveBalances[0] : null;

  const contractTypeId = empContracts?.contract_type ?? myEmployee?.contract_type;
  const contractTypeName = contractTypeId
    ? contractTypeMap[contractTypeId] || contractTypeId
    : '—';
  const shiftId = empSchedule?.shift_id ?? myEmployee?.shift_id;
  const shiftName = shiftId ? shiftMap[shiftId] || shiftId : '';
  const workDayId = empSchedule?.work_day_id ?? myEmployee?.work_day_id;
  const scheduleStart = empSchedule?.start_time ?? myEmployee?.start_time;
  const scheduleEnd = empSchedule?.end_time ?? myEmployee?.end_time;
  const fmtTime = (t: string | undefined | null) => t ? t.length > 5 ? t.slice(0, 5) : t : '—';
  const scheduleDisplay = `${fmtTime(scheduleStart)} — ${fmtTime(scheduleEnd)}`;

  const empIban = empPayroll?.iban ?? myEmployee?.iban;
  const empIrpf = empPayroll?.irpf ?? myEmployee?.irpf;
  const empLockers = empExtras?.lockers ?? myEmployee?.lockers;
  const empMedicalCheck = empExtras?.medical_check ?? myEmployee?.medical_check;
  const empVaccinated = empExtras?.vaccinated ?? myEmployee?.vaccinated;
  const empVacationMonth = empContracts?.vacation_month ?? myEmployee?.vacation_month;
  const empDrivingLicenses = empDetail?.driving_licenses ?? [];
  const empSizes = empDetail?.sizes ?? [];
  const empClothing = empDetail?.clothing ?? [];
  const empAdvances = empDetail?.advances ?? [];
  const empLoans = empDetail?.loans ?? [];
  const empSabbaticals = empDetail?.sabbaticals ?? [];
  const empVacationRequests = empDetail?.vacations ?? [];

  const currentVacationMonth = useMemo(
    () => myEmployee ? getCurrentVacationMonth(empVacationMonth) : null,
    [myEmployee, empVacationMonth]
  );
  const vacationMonthIndex = currentVacationMonth ? VACATION_MONTH_INDEX[currentVacationMonth] : -1;

  const handleEmployeeSubmit = (data: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => {
    if (isReadOnly) return false;
    if (myEmployee) {
      employeesApi.update(myEmployee.id, data).then((updated) => setMyEmployee(updated)).catch(() => {});
    } else if (loggedInUser) {
      employeesApi.create({ ...data, city_id: loggedInUser.city_id || null }).then((created) => setMyEmployee(created)).catch(() => {});
    }
    setEmployeeModalOpen(false);
    return true;
  };

  const handleCambioVacaciones = (data: { type: 'vacation_change'; requested_month: 'july' | 'august' | 'september' | 'split' }) => {
    if (!myEmployee || isReadOnly) return;
    vacationsApi.create({
      employee_id: myEmployee.id,
      type: data.type,
      status: 'pending',
      requested_month: data.requested_month,
    }).then((created) => setVacationRequests((prev) => [...prev, created])).catch(() => {});
    setCambioVacacionesOpen(false);
    setCambioSubmitted(true);
  };

  const handleSolicitarDias = (data: { type: 'free_days'; requested_days: string[] }) => {
    if (!myEmployee || isReadOnly) return;
    vacationsApi.create({
      employee_id: myEmployee.id,
      type: data.type,
      status: 'pending',
      requested_days: data.requested_days,
    }).then((created) => setVacationRequests((prev) => [...prev, created])).catch(() => {});
    setSolicitarDiasOpen(false);
  };

  const pendingRequests = useMemo(
    () => myEmployee ? vacationRequests.filter((r) => r.employee_id === myEmployee.id && r.status.toLowerCase() === 'pending').length : 0,
    [myEmployee, vacationRequests]
  );

  const employeeTabs = (() => {
    type TabKey = 'personal' | 'nomina' | 'vacaciones' | 'uniformidad' | 'adelantos' | 'excedencias';
    const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [];
    tabs.push({ key: 'personal', label: 'Personal', icon: <User className="h-4 w-4" /> });
    tabs.push({ key: 'nomina', label: 'Nómina', icon: <CreditCard className="h-4 w-4" /> });
    tabs.push({ key: 'vacaciones', label: 'Vacaciones', icon: <Calendar className="h-4 w-4" /> });
    tabs.push({ key: 'uniformidad', label: 'Uniformidad', icon: <Shirt className="h-4 w-4" /> });
    tabs.push({ key: 'adelantos', label: 'Adelantos', icon: <Send className="h-4 w-4" /> });
    tabs.push({ key: 'excedencias', label: 'Excedencias', icon: <Calendar className="h-4 w-4" /> });
    return tabs;
  })();

  const safeActiveTab = employeeTabs.some(t => t.key === activeEmployeeTab) ? activeEmployeeTab : (employeeTabs[0]?.key || 'personal');

  if (!coverLoaded) {
    return (
      <div className="-mx-5 -mt-5 flex min-w-0 flex-auto flex-col">
                <div className="h-[16vh] sm:h-[18vh] md:h-[20vh] lg:h-[22vh] xl:h-[25vh] w-full bg-app-bg animate-pulse" />
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-6 lg:h-20 lg:flex-row lg:px-8">
          <div className="-mt-16 lg:-mt-20">
            <div className="h-24 w-24 rounded-full bg-app-bg animate-pulse ring-4 ring-app-border" />
          </div>
          <div className="mt-2 flex flex-col items-center lg:ml-6 lg:mt-0 lg:items-start gap-2">
            <div className="h-5 w-48 rounded bg-app-bg animate-pulse" />
            <div className="h-4 w-32 rounded bg-app-bg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="-mx-5 -mt-5 flex min-w-0 flex-auto flex-col">
      {isReadOnly && (
        <div className="flex items-center gap-3 px-5 py-3.5 mx-5 mt-5 text-xs font-medium text-amber-900 dark:text-amber-300 bg-amber-50/90 dark:bg-amber-900/30 backdrop-blur-sm border border-amber-200/80 dark:border-amber-800 rounded-2xl shadow-xs animate-in">
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span><span className="font-bold">Modo Consulta:</span> Tu rol es <span className="px-1.5 py-0.5 font-mono bg-amber-100 dark:bg-amber-900/30 rounded-md text-amber-800 dark:text-amber-300">USER</span>. Los datos se muestran en modo solo lectura.</span>
        </div>
      )}

      {loggedInUser && (
        <>
          {/* Cover + Header Bar */}
            <div>
              {/* Cover Image */}
              <div>
                <img
                  className="h-[16vh] sm:h-[18vh] md:h-[20vh] lg:h-[22vh] xl:h-[25vh] object-cover object-center w-full"
                  src={displayCover}
                  alt="Cover image"
                  onError={() => setCoverError(true)}
                />
              </div>

              {/* Bar with Avatar + Name + Nav */}
              <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-6 lg:h-20 lg:flex-row lg:px-8">
                {/* Avatar */}
                <div className="-mt-16 rounded-full lg:-mt-20">
                  <span className="flex h-24 w-24 items-center justify-center rounded-full text-3xl font-bold uppercase tracking-wide text-app-text ring-4 ring-green-500 bg-app-bg shadow-md">
                    {((myEmployee?.name?.[0] ?? '') + (myEmployee?.last_name1?.[0] ?? '')).toUpperCase()}
                  </span>
                </div>

                {/* Name + Email */}
                <div className="mt-2 flex flex-col items-center lg:ml-6 lg:mt-0 lg:items-start">
                  <div className="text-xl font-bold leading-none text-app-text">{fullName}</div>
                  <div className="text-sm text-app-text-secondary mt-0.5">{loggedInUser.email}</div>
                </div>

                {/* Nav Tabs — pill style */}
                <div className="mb-4 mt-5 w-full lg:mb-0 lg:ml-auto lg:mt-0 lg:w-auto">
                  <div className="flex gap-1 bg-app-bg rounded-xl p-1 flex-wrap justify-center">
                    {([
                      { key: 'info' as const, label: 'Info', icon: <User className="h-4 w-4" /> },
                      { key: 'calendario' as const, label: 'Calendario', icon: <Calendar className="h-4 w-4" /> },
                    ]).map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap sm:px-4 sm:py-2 sm:text-sm sm:gap-2 ${
                          activeTab === tab.key
                            ? 'bg-app-card text-primary-700 shadow-xs'
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
          <div className="bg-gray-100/80 dark:bg-gray-950/50 flex-auto min-h-0 overflow-y-auto">
            <div className="mx-auto flex w-full max-w-6xl justify-center p-4 sm:p-6">
            {activeTab === 'info' && (
              <div className="w-full flex flex-col gap-5">
                  {myEmployee ? (
                  <>
                    <div className="relative overflow-hidden rounded-2xl border border-white/10 dark:border-white/10 bg-white dark:bg-[#07182E] shadow-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,183,255,0.3)] p-4 sm:p-5">

                      {employeeTabs.length > 1 && (
                        <div className="flex gap-1 bg-app-bg rounded-xl p-1 mb-5 flex-wrap justify-center">
                          {employeeTabs.map(tab => (
                            <button
                              key={tab.key}
                              onClick={() => setActiveEmployeeTab(tab.key)}
                              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 sm:px-4 sm:py-2 sm:text-sm sm:gap-2 ${
                                safeActiveTab === tab.key
                                  ? 'bg-app-card text-primary-700 shadow-xs'
                                  : 'text-app-text-secondary hover:text-app-text'
                              }`}
                            >
                              {tab.icon} {tab.label}
                            </button>
                          ))}
                        </div>
                      )}

                      <div>
                        {safeActiveTab === 'personal' && (
                          <div className="space-y-3 sm:space-y-4">
                            {/* Datos Personales */}
                            <div>
                              <div className="text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-3">Datos Personales</div>
                              <div className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-[3fr_3fr_4fr]">
                                <InfoRow icon={<User className="h-4 w-4" />} label="Nombre" value={`${myEmployee.name} ${myEmployee.last_name1} ${myEmployee.last_name2 || ''}`.trim()} />
                                <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={myEmployee.email || '—'} />
                                <div className="hidden md:block" />
                                <InfoRow icon={<Mail className="h-4 w-4" />} label="Email Personal" value={myEmployee.personal_email || '—'} />
                                <InfoRow icon={<Phone className="h-4 w-4" />} label="Teléfono" value={myEmployee.phone || '—'} />
                                <div className="hidden md:block" />
                                <InfoRow icon={<Phone className="h-4 w-4" />} label="Teléfono Fijo" value={myEmployee.phone_fixed || '—'} />
                                <InfoRow icon={<MapPin className="h-4 w-4" />} label="Ciudad" value={cityName || '—'} />
                                <div className="hidden md:block" />
                              </div>
                            </div>

                            {/* DATOS PROFESIONALES */}
                            <div className="border-t border-app-card-border pt-3">
                              <div className="text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-3">DATOS PROFESIONALES</div>
                              <div className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-4">
                                <InfoRow icon={<Award className="h-4 w-4" />} label="Categoría" value={categoryName || '—'} />
                                <InfoRow icon={<Building2 className="h-4 w-4" />} label="Centro de Trabajo" value={workCenterName || '—'} />
                                <InfoRow icon={<Shield className="h-4 w-4" />} label="Estado" value={statusName || '—'} />
                                <div className="hidden md:block" />
                              </div>
                            </div>

                            {/* Horario */}
                            <div className="border-t border-app-card-border pt-3">
                              <div className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-4">
                                <InfoRow icon={<Clock className="h-4 w-4" />} label="Turno" value={shiftName || '—'} />
                                <InfoRow icon={<Calendar className="h-4 w-4" />} label="Horario" value={scheduleDisplay} />
                                <InfoRow icon={<Calendar className="h-4 w-4" />} label="Jornada" value={workDayId ? workDayMap[workDayId] || workDayId : '—'} />
                                <div className="hidden md:block" />
                              </div>
                            </div>

                            {/* Contrato */}
                            <div className="border-t border-app-card-border pt-3">
                              <div className="text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-3">Contrato</div>
                              <div className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-4">
                                <InfoRow icon={<IdCard className="h-4 w-4" />} label="Tipo de Contrato" value={contractTypeName} />
                                <InfoRow icon={<Calendar className="h-4 w-4" />} label="Fecha Inicio" value={empContracts?.contract_start_date || '—'} />
                                <InfoRow icon={<Calendar className="h-4 w-4" />} label="Fecha Fin" value={empContracts?.contract_end_date || '—'} />
                                <div className="hidden md:block" />
                              </div>
                            </div>

                            {/* Permisos de Conducir — listado */}
                            {empDrivingLicenses.length > 0 && (
                              <div className="border-t border-app-card-border pt-3">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="text-xs font-semibold text-app-text-secondary uppercase tracking-wider">Permisos de Conducir</div>
                                  <button
                                    onClick={() => setVisualizarLicenseOpen(true)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary-600 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-all"
                                  >
                                    <Eye className="h-3.5 w-3.5" /> Ver Documento
                                  </button>
                                </div>
                                {(() => {
                                  const LICENSE_LABELS: Record<string, string> = {
                                    am: 'AM', a1: 'A1', a2: 'A2', a: 'A', b: 'B',
                                    be: 'B+E', c1: 'C1', c1e: 'C1+E', c: 'C', ce: 'C+E',
                                    d1: 'D1', d1e: 'D1+E', d: 'D', de: 'D+E',
                                  };
                                  return (
                                    <div className="space-y-1">
                                      {empDrivingLicenses.map((l, i) => (
                                        <div key={l.id || i} className="flex items-center justify-between rounded-xl bg-app-bg/50 px-4 py-2.5">
                                          <span className="text-sm font-semibold text-app-text">{LICENSE_LABELS[l.license_type] || l.license_type}</span>
                                          <span className="text-[11px] text-app-text-secondary">{l.start_date || '—'} → {l.expiry_date || l.end_date || '—'}</span>
                                        </div>
                                      ))}
                                    </div>
                                  );
                                })()}
                              </div>
                            )}

                            {/* Extras */}
                            <div className="border-t border-app-card-border pt-3">
                              <div className="text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-3">Extras</div>
                              <div className="flex flex-wrap gap-4">
                                {empLockers?.length > 0 && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-app-text-secondary">Taquillas</span>
                                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300">
                                      {empLockers.join(', ')}
                                    </span>
                                  </div>
                                )}
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-app-text-secondary">Trabaja Festivos</span>
                                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${empExtras?.works_holidays ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-300'}`}>
                                    {empExtras?.works_holidays ? 'Sí' : 'No'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-app-text-secondary">Revisión Médica</span>
                                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${empExtras?.medical_check ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-300'}`}>
                                    {empExtras?.medical_check ? 'Sí' : 'No'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-app-text-secondary">Vacunado</span>
                                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${empExtras?.vaccinated ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-300'}`}>
                                    {empExtras?.vaccinated ? 'Sí' : 'No'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {safeActiveTab === 'nomina' && (
                          <div className="space-y-3 sm:space-y-4">
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <div className="text-xs font-semibold text-app-text-secondary uppercase tracking-wider">Nóminas</div>
                                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary-600 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-all">
                                  <History className="h-3.5 w-3.5" /> Historial
                                </button>
                              </div>
                              <div className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-4">
                                <InfoRow icon={<IdCard className="h-4 w-4" />} label="DNI/NIE" value={empPayroll?.dni || '—'} />
                                <InfoRow icon={<Shield className="h-4 w-4" />} label="Nº Seguridad Social" value={empPayroll?.social_security_number || '—'} />
                                <InfoRow icon={<CreditCard className="h-4 w-4" />} label="IBAN" value={empIban || '—'} />
                                <InfoRow icon={<Percent className="h-4 w-4" />} label="IRPF" value={empIrpf != null ? `${empIrpf}%` : '—'} />
                              </div>
                            </div>

                            {/* 12 Month Cards */}
                            <div className="border-t border-app-card-border pt-3">
                              <div className="text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-3">Nóminas {new Date().getFullYear()}</div>
                              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                                {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map((m, i) => {
                                  const hasDoc = i === 3 || i === 4; // mock: abril and mayo have docs
                                  return (
                                    <div key={m} className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-app-bg/50 border border-app-border">
                                      <span className="text-xs font-semibold text-app-text">{m}</span>
                                      <button className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold rounded-lg transition-all ${
                                        hasDoc
                                          ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/30'
                                          : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-300 cursor-not-allowed opacity-60'
                                      }`}>
                                        <Download className="h-3 w-3" /> {hasDoc ? 'Descargar' : 'No disponible'}
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}

                        {safeActiveTab === 'vacaciones' && (
                          <div className="space-y-3 sm:space-y-4">
                            {(() => {
                              const MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                              const MONTH_MAP: Record<string, number> = { july: 6, august: 7, september: 8 };
                              const MONTH_EN_TO_ES: Record<string, string> = {
                                january: 'enero', february: 'febrero', march: 'marzo', april: 'abril',
                                may: 'mayo', june: 'junio', july: 'julio', august: 'agosto',
                                september: 'septiembre', october: 'octubre', november: 'noviembre', december: 'diciembre',
                              };
                              const vacMonthIdx = currentVacationMonth ? MONTH_MAP[currentVacationMonth] ?? -1 : -1;

                              return (
                                <>
                                  {/* Balance — Días */}
                                  {empLeaveBalances.length > 0 && (
                                    <div>
                                      <div className="flex items-center justify-between mb-3">
                                        <div className="text-xs font-semibold text-app-text-secondary uppercase tracking-wider">Días</div>
                                        {!isReadOnly && (
                                          <button
                                            onClick={() => setSolicitarDiasOpen(true)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all active:scale-[0.98] text-primary-600 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30"
                                          >
                                            <Sun className="h-3.5 w-3.5" /> Solicitar Días
                                          </button>
                                        )}
                                      </div>
                                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {(() => {
                                          const b = empLeaveBalances[0];
                                          return (
                                            <>
                                              <div className="flex flex-col items-center rounded-xl bg-amber-50 dark:bg-amber-900/20 p-3">
                                                <div className="text-2xl font-bold text-amber-600 dark:text-amber-300">{b.own_days}</div>
                                                <div className="text-[10px] font-semibold text-amber-700 dark:text-amber-300 uppercase mt-0.5">Propios</div>
                                              </div>
                                              <div className="flex flex-col items-center rounded-xl bg-violet-50 dark:bg-violet-900/20 p-3">
                                                <div className="text-2xl font-bold text-violet-600 dark:text-violet-300">{b.accumulated_days}</div>
                                                <div className="text-[10px] font-semibold text-violet-700 dark:text-violet-300 uppercase mt-0.5">Acumulados</div>
                                              </div>
                                              <div className={`flex flex-col items-center rounded-xl p-3 ${b.excess_days > 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-app-bg/50'}`}>
                                                <div className={`text-2xl font-bold ${b.excess_days > 0 ? 'text-red-600 dark:text-red-300' : 'text-app-text-secondary'}`}>{b.excess_days}</div>
                                                <div className={`text-[10px] font-semibold uppercase mt-0.5 ${b.excess_days > 0 ? 'text-red-700 dark:text-red-300' : 'text-app-text-secondary'}`}>Excesos</div>
                                              </div>
                                            </>
                                          );
                                        })()}
                                      </div>
                                    </div>
                                  )}

                                  {/* Mes de Vacaciones */}
                                  <div className="border-t border-app-card-border pt-3">
                                    <div className="flex items-center justify-between mb-3">
                                      <div className="text-xs font-semibold text-app-text-secondary uppercase tracking-wider">Mes de Vacaciones</div>
                                      {!isReadOnly && (
                                        <button
                                          onClick={() => setCambioVacacionesOpen(true)}
                                          disabled={cambioSubmitted}
                                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all active:scale-[0.98] ${
                                            cambioSubmitted
                                              ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 cursor-not-allowed'
                                              : 'text-primary-600 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30'
                                          }`}
                                        >
                                          <Calendar className="h-3.5 w-3.5" />
                                          {cambioSubmitted ? 'Pendiente' : 'Solicitar Cambio'}
                                        </button>
                                      )}
                                    </div>
                                    <div className="flex flex-col items-center rounded-xl bg-teal-50 dark:bg-teal-900/20 p-3 w-full">
                                      <div className="text-2xl font-bold text-teal-600 dark:text-teal-300">
                                        {currentVacationMonth ? MONTH_NAMES[MONTH_MAP[currentVacationMonth]] ?? currentVacationMonth : 'No asignado'}
                                      </div>
                                      <div className="text-[10px] font-semibold text-teal-700 dark:text-teal-300 uppercase mt-0.5">Mes de Vacaciones</div>
                                    </div>
                                  </div>

                                  {/* Requests list */}
                                  {(vacationRequests.length > 0 || empVacationRequests.length > 0) && (
                                    <div className="border-t border-app-card-border pt-3">
                                      <div className="text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-3">Solicitudes</div>
                                      {[...(vacationRequests.length > 0 ? vacationRequests : []), ...(empVacationRequests.filter(vr => !vacationRequests.some(r => r.id === vr.id)))].map((vr, idx) => (
                                        <div key={vr.id || idx} className="flex items-center justify-between rounded-xl bg-app-bg/50 px-4 py-2.5 mb-1.5">
                                          <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-app-text">
                                              {vr.type === 'free_days'
                                                ? `Día libre — ${vr.requested_days?.join(', ') || ''}`
                                                : vr.type === 'vacation_change' || vr.type === 'month_change'
                                                ? `Cambio mes — ${vr.requested_month ? (MONTH_EN_TO_ES[vr.requested_month.toLowerCase()] || vr.requested_month) : ''}`
                                                : vr.type}
                                            </span>
                                          </div>
                                          <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                                            vr.status === 'approved' ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' :
                                            vr.status === 'pending' ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300' :
                                            'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-300'
                                          }`}>
                                            {vr.status === 'approved' ? 'Aprobado' : vr.status === 'pending' ? 'Pendiente' : 'Rechazado'}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        )}

                        {safeActiveTab === 'uniformidad' && (
                          <div className="space-y-3 sm:space-y-4">
                            {empSizes.length > 0 && (
                              <div>
                                <div className="text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-3">Tallas</div>
                                {(() => {
                                  const LABELS: Record<string, string> = {
                                    shirt: 'Camisa', pants: 'Pantalón', jacket: 'Chaqueta',
                                    coat: 'Chaquetón', cap: 'Gorra', shoe: 'Zapatos',
                                  };
                                  return (
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-1.5 text-sm">
                                      {(['shirt', 'pants', 'jacket', 'coat', 'cap', 'shoe'] as ArticleType[]).map(type => {
                                        const size = empSizes.find(s => s.article_type === type)?.size || '—';
                                        return (
                                          <React.Fragment key={type}>
                                            <span className="text-app-text-secondary">{LABELS[type]}</span>
                                            <span className="text-app-text">{size}</span>
                                          </React.Fragment>
                                        );
                                      })}
                                    </div>
                                  );
                                })()}
                              </div>
                            )}
                            {empClothing.length > 0 && (
                              <div className="border-t border-app-card-border pt-3">
                                <div className="text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-3">Prendas {new Date().getFullYear()}</div>
                                <div className="space-y-1.5">
                                  {empClothing.map((c, i) => (
                                    <div key={c.id || i} className="flex items-center justify-between rounded-xl bg-app-bg/50 px-4 py-2.5">
                                      <div className="flex flex-col">
                                        <span className="text-sm font-bold text-app-text">{c.article_type || 'Prenda'} — {c.size} — {c.notes || 'Asignación'}</span>
                                        <span className="text-[11px] text-app-text-secondary">{c.delivery_date ? formatDate(c.delivery_date) : ''}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {empSizes.length === 0 && empClothing.length === 0 && (
                              <p className="text-sm text-app-text-secondary text-center py-4">Sin datos de uniformidad</p>
                            )}
                          </div>
                        )}

                        {safeActiveTab === 'adelantos' && (
                          <div className="space-y-3 sm:space-y-4">
                            {empAdvances.length > 0 && (
                              <div>
                                <div className="flex items-center justify-between mb-3">
                                  <div className="text-xs font-semibold text-app-text-secondary uppercase tracking-wider">Adelantos</div>
                                  {!isReadOnly && (
                                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary-600 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-all">
                                      <Send className="h-3.5 w-3.5" /> Solicitar Adelanto
                                    </button>
                                  )}
                                </div>
                                <div className="space-y-1.5">
                                  {empAdvances.map(a => (
                                    <div key={a.id} className="flex items-center justify-between rounded-xl bg-app-bg/50 px-4 py-2.5">
                                      <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-app-text">{a.amount}€</span>
                                        <span className="text-[11px] text-app-text-secondary">{a.month}/{a.year}</span>
                                      </div>
                                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                                        a.status === 'accepted' || a.status === 'paid' ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' :
                                        'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-300'
                                      }`}>
                                        {a.status === 'accepted' || a.status === 'paid' ? 'Aceptado' : 'Rechazado'}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {empLoans.length > 0 && (
                              <div className={empAdvances.length > 0 ? 'border-t border-app-card-border pt-3' : ''}>
                                <div className="flex items-center justify-between mb-3">
                                  <div className="text-xs font-semibold text-app-text-secondary uppercase tracking-wider">Préstamos</div>
                                  {!isReadOnly && (
                                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary-600 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-all">
                                      <Send className="h-3.5 w-3.5" /> Solicitar Préstamo
                                    </button>
                                  )}
                                </div>
                                <div className="space-y-1.5">
                                  {empLoans.map(l => (
                                    <div key={l.id} className="flex items-center justify-between rounded-xl bg-app-bg/50 px-4 py-2.5">
                                      <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-app-text">{l.amount}€</span>
                                        <span className="text-[11px] text-app-text-secondary">{l.start_date || '—'} → {l.end_date || '—'}</span>
                                      </div>
                                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                                        l.status === 'active' ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300' :
                                        l.status === 'paid' || l.status === 'accepted' ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' :
                                        'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-300'
                                      }`}>
                                        {l.status === 'active' ? 'Activo' : l.status === 'paid' || l.status === 'accepted' ? 'Aceptado' : 'Rechazado'}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {empAdvances.length === 0 && empLoans.length === 0 && (
                              <div>
                                <p className="text-sm text-app-text-secondary text-center py-4">Sin adelantos ni préstamos</p>
                                {!isReadOnly && (
                                  <div className="flex justify-center gap-3">
                                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary-600 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-all">
                                      <Send className="h-3.5 w-3.5" /> Solicitar Adelanto
                                    </button>
                                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary-600 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-all">
                                      <Send className="h-3.5 w-3.5" /> Solicitar Préstamo
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {safeActiveTab === 'excedencias' && (
                          <div className="space-y-3 sm:space-y-4">
                            {empSabbaticals.length > 0 && (
                              <div>
                                <div className="flex items-center justify-between mb-3">
                                  <div className="text-xs font-semibold text-app-text-secondary uppercase tracking-wider">Excedencias</div>
                                  {!isReadOnly && (
                                    <button
                                      onClick={() => setSolicitarExcedenciaOpen(true)}
                                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary-600 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-all"
                                    >
                                      <Calendar className="h-3.5 w-3.5" /> Solicitar Excedencia
                                    </button>
                                  )}
                                </div>
                                <div className="space-y-1.5">
                                  {empSabbaticals.map(s => (
                                    <div key={s.id} className="flex items-center justify-between rounded-xl bg-app-bg/50 px-4 py-2.5">
                                      <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-app-text">Excedencia</span>
                                        <span className="text-[11px] text-app-text-secondary">{s.notes || ''}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {empSabbaticals.length === 0 && (
                              <div>
                                <div className="flex items-center justify-between mb-3">
                                  <div className="text-xs font-semibold text-app-text-secondary uppercase tracking-wider">Excedencias</div>
                                  {!isReadOnly && (
                                    <button
                                      onClick={() => setSolicitarExcedenciaOpen(true)}
                                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary-600 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-all"
                                    >
                                      <Calendar className="h-3.5 w-3.5" /> Solicitar Excedencia
                                    </button>
                                  )}
                                </div>
                                <p className="text-sm text-app-text-secondary text-center py-4">Sin excedencias</p>
                              </div>
                            )}
                          </div>
                        )}


                      </div>
                    </div>
                  </>
                ) : (
                  <div className="relative overflow-hidden rounded-2xl border border-white/10 dark:border-white/10 bg-white dark:bg-[#07182E] shadow-lg p-8 text-center">
                    <Briefcase className="w-12 h-12 text-app-text-secondary/60 dark:text-white/40 mx-auto mb-3" />
                    <p className="text-sm text-app-text-secondary dark:text-white/60">Sin información de empleado</p>
                    {!isReadOnly && (
                      <button
                        onClick={() => setEmployeeModalOpen(true)}
                        className="mt-3 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary-600 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-all"
                      >
                        <Sparkles className="w-4 h-4" /> Crear Ficha
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'calendario' && (
              <div className="w-full flex flex-col gap-4 sm:gap-5">
                {myEmployee ? (
                  <>
                  {/* Calendar */}
                  <div className="relative overflow-hidden rounded-2xl border border-white/10 dark:border-white/10 bg-white dark:bg-[#07182E] shadow-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,183,255,0.3)] p-5">
                    {/* Month navigation */}
                    <div className="flex items-center justify-between mb-5">
                      <button
                        onClick={() => { if (calMonth > 0) setCalMonth(m => m - 1); }}
                        disabled={calMonth === 0}
                        className="flex items-center justify-center size-9 rounded-lg text-app-text-secondary hover:text-app-text hover:bg-app-bg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <span className="text-base font-bold text-app-text">
                        {new Date(calYear, calMonth).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase())}
                      </span>
                      <button
                        onClick={() => { if (calMonth < 11) setCalMonth(m => m + 1); }}
                        disabled={calMonth === 11}
                        className="flex items-center justify-center size-9 rounded-lg text-app-text-secondary hover:text-app-text hover:bg-app-bg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Day-of-week header */}
                    <div className="grid grid-cols-7 mb-2">
                      {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => (
                        <div key={d} className="text-center text-xs font-semibold text-app-text-secondary py-1.5">
                          {d}
                        </div>
                      ))}
                    </div>

                    {/* Calendar grid */}
                    {holidaysLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="size-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-7">
                        {(() => {
                          const firstDay = new Date(calYear, calMonth, 1).getDay(); // 0=Sun
                          const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
                          const daysInPrev = new Date(calYear, calMonth, 0).getDate();
                          const offset = firstDay === 0 ? 6 : firstDay - 1; // Mon=0
                          const totalSlots = Math.ceil((offset + daysInMonth) / 7) * 7;
                          const dateStr = (y: number, m: number, d: number) =>
                            `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                          const isHoliday = (d: Date) => holidays.includes(dateStr(d.getFullYear(), d.getMonth(), d.getDate()));
                          const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;
                          const isVacationDay = (d: Date) => vacationMonthIndex >= 0 && d.getMonth() === vacationMonthIndex;
                          const isNonWorking = (d: Date) => isWeekend(d) || isHoliday(d);
                          const isToday = (d: Date) =>
                            d.getFullYear() === today.getFullYear() &&
                            d.getMonth() === today.getMonth() &&
                            d.getDate() === today.getDate();
                          const isPast = (d: Date) => d < today;
                          const isFuture = (d: Date) => d > today;

                          const cells: React.ReactNode[] = [];
                          for (let i = 0; i < totalSlots; i++) {
                            let day: number;
                            let month: number;
                            let isOutside = false;
                            if (i < offset) {
                              day = daysInPrev - offset + i + 1;
                              month = calMonth - 1;
                              isOutside = true;
                            } else if (i >= offset + daysInMonth) {
                              day = i - offset - daysInMonth + 1;
                              month = calMonth + 1;
                              isOutside = true;
                            } else {
                              day = i - offset + 1;
                              month = calMonth;
                            }
                            const date = new Date(calYear, month, day);
                            const working = !isNonWorking(date);
                            const vac = !isOutside && isVacationDay(date);
                            const todayFlag = isToday(date);
                            const pastFlag = isPast(date);

                            cells.push(
                              <div key={i} className={`relative min-h-[48px] sm:min-h-[56px] flex flex-col items-center justify-center border border-app-card-border text-xs transition-colors
                                ${isOutside ? 'opacity-30' : ''}
                                ${todayFlag ? 'bg-primary-50 dark:bg-primary-900/20 z-10' : ''}
                                ${!isOutside && !working ? 'bg-rose-50/50 dark:bg-rose-900/10' : ''}
                                ${vac && working ? 'bg-teal-50/60 dark:bg-teal-900/15' : ''}
                              `}>
                                <span className={`font-semibold leading-none
                                  ${todayFlag ? 'text-primary-600 dark:text-primary-300' : ''}
                                  ${!isOutside && !working ? 'text-rose-500 dark:text-rose-400' : ''}
                                  ${!isOutside && working ? (pastFlag ? 'text-app-text' : 'text-app-text-secondary') : ''}
                                  ${vac && working ? 'text-teal-600 dark:text-teal-400' : ''}
                                `}>
                                  {day}
                                </span>
                                {!isOutside && !working && (
                                  <span className="text-[9px] leading-none mt-0.5 text-rose-400 dark:text-rose-500 font-medium">F</span>
                                )}
                                {vac && working && (
                                  <span className="text-[9px] leading-none mt-0.5 text-teal-500 dark:text-teal-400 font-medium">V</span>
                                )}
                                {todayFlag && (
                                  <div className="absolute bottom-0.5 size-1 rounded-full bg-primary-500" />
                                )}
                              </div>
                            );
                          }
                          return cells;
                        })()}
                      </div>
                    )}

                    {/* Legend */}
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-app-card-border flex-wrap">
                      <div className="flex items-center gap-1.5 text-xs text-app-text-secondary">
                        <div className="size-3 rounded bg-rose-50 dark:bg-rose-900/10 border border-app-card-border" />
                        Festivo
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-app-text-secondary">
                        <div className="size-3 rounded bg-teal-50 dark:bg-teal-900/15 border border-app-card-border" />
                        Vacaciones
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-app-text-secondary">
                        <div className="size-3 rounded bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800" />
                        Hoy
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-app-text-secondary">
                        <div className="size-3 rounded bg-white dark:bg-transparent border border-app-card-border" />
                        Laborable
                      </div>
                    </div>
                  </div>
                  </>
                ) : (
                  <div className="relative overflow-hidden rounded-2xl border border-white/10 dark:border-white/10 bg-white dark:bg-[#07182E] shadow-lg p-8 text-center">
                    <Calendar className="w-12 h-12 text-app-text-secondary/60 dark:text-white/40 mx-auto mb-3" />
                    <p className="text-sm text-app-text-secondary dark:text-white/60">Sin información de calendario</p>
                  </div>
                )}
              </div>
            )}

          </div>
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
        disableWeekends={workDayId === 'wd_1'}
        onSubmit={handleSolicitarDias}
      />

      {solicitarExcedenciaOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-sidebar/80 backdrop-blur-xs">
          <div className="bg-app-card rounded-2xl shadow-xl w-full max-w-md border border-app-card-border overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-5 py-4 bg-gradient-to-r from-primary-600 to-primary-500 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/20 text-white">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Solicitar Excedencia</h3>
                  <p className="text-xs text-white/70">Selecciona el tipo y fecha de inicio</p>
                </div>
              </div>
              <button onClick={() => setSolicitarExcedenciaOpen(false)} className="text-white/70 hover:text-white p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-app-text-secondary mb-1.5 block">Tipo de Excedencia</label>
                <div className="space-y-2">
                  {[
                    { id: 'voluntaria', label: 'Voluntaria', desc: '4 meses a 5 años (mín. 1 año de servicio)' },
                    { id: 'cuidado_hijos', label: 'Cuidado de hijos/familiares', desc: 'Reincorporación posible en cualquier momento' },
                    { id: 'forzosa', label: 'Forzosa', desc: 'Cargos públicos o sindicales — reincorporación inmediata' },
                  ].map(t => (
                    <label key={t.id} className="flex items-start gap-3 p-3 rounded-xl border border-app-border hover:bg-app-bg/50 cursor-pointer transition-colors">
                      <input type="radio" name="excedencia_type" className="mt-0.5" />
                      <div>
                        <div className="text-sm font-semibold text-app-text">{t.label}</div>
                        <div className="text-[11px] text-app-text-secondary">{t.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="border-t border-app-card-border pt-3">
                <label className="text-xs font-medium text-app-text-secondary mb-1.5 block">Fecha de Inicio</label>
                <input type="date" className="w-full rounded-xl border border-app-border px-4 py-2.5 text-sm bg-app-card text-app-text focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all" />
              </div>
            </div>
            <div className="px-5 py-4 border-t border-app-border flex items-center justify-between shrink-0 bg-app-bg/50">
              <span className="text-[11px] text-app-text-secondary">Revisión por administrador</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setSolicitarExcedenciaOpen(false)} className="px-4 py-2 border border-app-border hover:bg-app-bg text-app-text-secondary text-sm font-semibold rounded-xl transition-colors">
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    triggerToast('Solicitud de excedencia enviada correctamente', 'success');
                    setSolicitarExcedenciaOpen(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl shadow-xs hover:from-primary-500 hover:to-primary-400 transition-all active:scale-95"
                >
                  <Send className="w-4 h-4" /> Enviar Solicitud
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {visualizarLicenseOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-sidebar/80 backdrop-blur-xs">
          <div className="bg-app-card rounded-2xl shadow-xl w-full max-w-md border border-app-card-border overflow-hidden">
            <div className="px-5 py-4 bg-gradient-to-r from-primary-600 to-primary-500 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/20 text-white">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Permisos de Conducir</h3>
                  <p className="text-xs text-white/70">Documento de permisos</p>
                </div>
              </div>
              <button onClick={() => setVisualizarLicenseOpen(false)} className="text-white/70 hover:text-white p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              {(() => {
                const LABELS: Record<string, string> = {
                  am: 'AM', a1: 'A1', a2: 'A2', a: 'A', b: 'B',
                  be: 'B+E', c1: 'C1', c1e: 'C1+E', c: 'C', ce: 'C+E',
                  d1: 'D1', d1e: 'D1+E', d: 'D', de: 'D+E',
                };
                return empDrivingLicenses.map((l, i) => (
                  <div key={l.id || i} className="rounded-xl bg-app-bg/50 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-app-text">{LABELS[l.license_type] || l.license_type}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] text-app-text-secondary block">Fecha Inicio</span>
                        <span className="text-sm font-semibold text-app-text">{l.start_date || '—'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-app-text-secondary block">Fecha Caducidad</span>
                        <span className="text-sm font-semibold text-app-text">{l.expiry_date || l.end_date || '—'}</span>
                      </div>
                    </div>
                    {l.notes && (
                      <div>
                        <span className="text-[10px] text-app-text-secondary block">Notas</span>
                        <span className="text-sm text-app-text">{l.notes}</span>
                      </div>
                    )}
                  </div>
                ));
              })()}
              <div className="border-t border-app-border pt-3 mt-3 text-center">
                <p className="text-[11px] text-app-text-secondary">Visualización de documento no disponible</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
