import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useServices } from '../../../context/ServiceContext';
import { useEmployees } from '../../../context/EmployeeContext';
import { useServiceReports, getWorkDayIdsForDate, getTomorrowDateString, getTodayDateString } from '../../../context/ServiceReportContext';
import { INITIAL_WORK_CENTERS } from '../../../data/mockWorkCenters';
import { INITIAL_SHIFTS, INITIAL_EMPLOYEE_STATUSES, INITIAL_EMPLOYEE_CATEGORIES } from '../../../data/mockEmployees';
import { AttendanceStatus, ServiceAssignment, StaffRequirement } from '../../../types';
import {
  CalendarCheck, CalendarPlus, History,
  CheckCircle2, X, ChevronDown, ChevronRight,
  Building2, Clock, Users, Save, AlertTriangle, UserCog,
} from 'lucide-react';

type Tab = 'previo' | 'diario' | 'historial';

const SHIFTS = INITIAL_SHIFTS;
const STATUSES = INITIAL_EMPLOYEE_STATUSES;

const SHIFT_WC_INCLUDE: Record<string, string[] | null> = {
  's_1': null,
  's_2': ['wc_1', 'wc_2'],
  's_3': ['wc_1'],
};

const SHIFT_EXCLUDED_WCS: Record<string, string[]> = {
  's_1': ['wc_7', 'wc_8', 'wc_9'],
};

function formatEmployeeName(emp: { name: string; last_name1: string; last_name2: string }): string {
  const parts = [emp.name, emp.last_name1, emp.last_name2].filter(Boolean);
  return parts.join(' ');
}

const ATTENDANCE_LABELS: Record<AttendanceStatus, string> = {
  PRESENT: 'Presente',
  ABSENT: 'Ausente',
  JUSTIFIED_ABSENCE: 'Ausente Justificado',
};

const ATTENDANCE_COLORS: Record<AttendanceStatus, string> = {
  PRESENT: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  ABSENT: 'text-rose-600 bg-rose-50 border-rose-200',
  JUSTIFIED_ABSENCE: 'text-amber-600 bg-amber-50 border-amber-200',
};

export const ServiceReportsView: React.FC<{ onTabChange?: (tab: 'previo' | 'diario' | 'historial') => void }> = ({ onTabChange }) => {
  const { user } = useAuth();
  const { services } = useServices();
  const { employees } = useEmployees();
  const {
    getPrevioForTomorrow, getDiarioForToday, getHistorial,
    addAssignment, removeAssignment, setAttendance, saveReport, getReportById
  } = useServiceReports();

  const userCityId = user?.role === 'ROOT' ? undefined : user?.city_id;

  const scopeWorkCenters = useMemo(
    () => userCityId ? INITIAL_WORK_CENTERS.filter((wc) => wc.city_id === userCityId && wc.status === 'ACTIVE') : INITIAL_WORK_CENTERS.filter((wc) => wc.status === 'ACTIVE'),
    [userCityId]
  );

  const [activeTab, setActiveTab] = useState<Tab>('previo');
  const [activeWC, setActiveWC] = useState<string | null>(null);
  const [activeShift, setActiveShift] = useState<string>('s_1');

  useEffect(() => { onTabChange?.(activeTab); }, []);
  const [report, setReport] = useState<{ id: string; warnings: string[] } | null>(null);
  const [saveMsg, setSaveMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleClick = () => setOpenDropdown(null);
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (!userCityId) return;
    if (activeTab === 'previo') {
      const r = getPrevioForTomorrow(userCityId);
      setReport({ id: r.id, warnings: [] });
      setActiveWC(null);
    } else if (activeTab === 'diario') {
      const { report: r } = getDiarioForToday(userCityId);
      setReport({ id: r.id, warnings: [] });
      setActiveWC(null);
    } else {
      setReport(null);
    }
    setSaveMsg(null);
  }, [activeTab, userCityId]);

  const currentReport = report ? getReportById(report.id) : undefined;

  const computedWarnings = useMemo(() => {
    if (activeTab !== 'diario' || !currentReport || currentReport.assignments.length === 0) return [];
    const warned: string[] = [];
    const seen = new Set<string>();
    for (const a of currentReport.assignments) {
      if (seen.has(a.employee_id)) continue;
      seen.add(a.employee_id);
      const emp = employees.find((e) => e.id === a.employee_id);
      if (!emp || emp.status_id !== 'es_1' || !emp.active) {
        warned.push(`${emp ? `${emp.name} ${emp.last_name1}` : a.employee_id} ya no está disponible (${emp ? (emp.active ? 'estado cambiado' : 'desactivado') : 'no encontrado'}).`);
      }
    }
    return warned;
  }, [activeTab, currentReport, employees]);

  const historial = useMemo(() => getHistorial(userCityId ?? ''), [activeTab, userCityId]);

  const targetDate = activeTab === 'previo' ? getTomorrowDateString() : getTodayDateString();
  const targetDateObj = new Date(targetDate + 'T12:00:00');
  const workDayIds = getWorkDayIdsForDate(targetDateObj);

  const filteredWorkCenters = useMemo(() => {
    const allowedIds = SHIFT_WC_INCLUDE[activeShift];
    const excluded = SHIFT_EXCLUDED_WCS[activeShift] ?? [];
    let wcs = allowedIds ? scopeWorkCenters.filter((wc) => allowedIds.includes(wc.id)) : scopeWorkCenters;
    return wcs.filter((wc) => !excluded.includes(wc.id));
  }, [scopeWorkCenters, activeShift]);

  const getEmployeesForWC = (wcId: string) => {
    return employees.filter((e) => {
      if (e.work_center_id !== wcId) return false;
      if (e.shift_id !== activeShift) return false;
      if (e.status_id !== 'es_1') return false;
      if (!e.active) return false;
      if (!workDayIds.includes(e.work_day_id)) return false;
      return true;
    });
  };

  const getAssignmentsForService = (wcId: string, serviceId: string): ServiceAssignment[] => {
    if (!currentReport) return [];
    return currentReport.assignments.filter((a) => a.service_id === serviceId && a.shift_id === activeShift && a.work_center_id === wcId);
  };

  const isEmployeeAssignedToService = (employeeId: string, wcId: string, serviceId: string): boolean => {
    if (!currentReport) return false;
    return currentReport.assignments.some((a) => a.employee_id === employeeId && a.service_id === serviceId && a.shift_id === activeShift && a.work_center_id === wcId);
  };

  const handleToggleAssign = (wcId: string, employeeId: string, serviceId: string, staffReq: StaffRequirement) => {
    if (!currentReport) return;
    const existing = currentReport.assignments.find(
      (a) => a.employee_id === employeeId && a.service_id === serviceId && a.shift_id === activeShift && a.work_center_id === wcId
    );
    if (existing) {
      removeAssignment(currentReport.id, existing.id);
    } else {
      const emp = employees.find((e) => e.id === employeeId);
      if (!emp) return;
      const isOficial = emp.category_id === 'ec_3' || emp.category_id === 'ec_4';
      const serviceAssignments = currentReport.assignments.filter(
        (a) => a.service_id === serviceId && a.shift_id === activeShift && a.work_center_id === wcId
      );
      if (isOficial) {
        if (!staffReq.oficial) return;
        const assignedOficiales = serviceAssignments.filter((a) => {
          const e = employees.find((ee) => ee.id === a.employee_id);
          return e && (e.category_id === 'ec_3' || e.category_id === 'ec_4');
        });
        if (assignedOficiales.length >= 1) return;
      } else {
        const assignedPeones = serviceAssignments.filter((a) => {
          const e = employees.find((ee) => ee.id === a.employee_id);
          return e && (e.category_id === 'ec_1' || e.category_id === 'ec_2');
        });
        if (assignedPeones.length >= staffReq.peones) return;
      }
      addAssignment(currentReport.id, {
        work_center_id: wcId,
        shift_id: activeShift,
        employee_id: employeeId,
        service_id: serviceId,
      });
    }
  };

  const handleSave = () => {
    if (!currentReport) return;
    const result = saveReport(currentReport.id);
    if (result.success) {
      setSaveMsg({ type: 'success', text: 'Parte guardado correctamente.' });
    } else {
      setSaveMsg({ type: 'error', text: result.error ?? 'Error al guardar.' });
    }
  };

  const handleAttendanceChange = (employeeId: string, status: AttendanceStatus) => {
    if (!currentReport) return;
    setAttendance(currentReport.id, employeeId, status);
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    onTabChange?.(tab);
    setSaveMsg(null);
    setOpenDropdown(null);
  };

  const getAttendanceFor = (employeeId: string): AttendanceStatus => {
    if (!currentReport) return 'PRESENT';
    const a = currentReport.attendance.find((at) => at.employee_id === employeeId);
    return a?.status ?? 'PRESENT';
  };

  const renderTabButton = (tab: Tab, icon: React.ReactNode, label: string) => (
    <button
      onClick={() => handleTabChange(tab)}
      className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all ${
        activeTab === tab
          ? 'text-primary-600 border-primary-600'
          : 'text-app-text-secondary border-transparent hover:text-app-text hover:border-app-text-secondary/30'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  const renderServiceCard = (wcId: string, service: { id: string; name: string; category: string; staff_requirement: StaffRequirement }, wcEmployees: ReturnType<typeof getEmployeesForWC>) => {
    const assignments = getAssignmentsForService(wcId, service.id);
    const dropdownId = `${wcId}-${activeShift}-${service.id}`;
    const staffReq = service.staff_requirement;

    const assignedOficiales = assignments.filter((a) => {
      const e = employees.find((ee) => ee.id === a.employee_id);
      return e && (e.category_id === 'ec_3' || e.category_id === 'ec_4');
    });
    const assignedPeones = assignments.filter((a) => {
      const e = employees.find((ee) => ee.id === a.employee_id);
      return e && (e.category_id === 'ec_1' || e.category_id === 'ec_2');
    });

    const oficiales = staffReq.oficial
      ? wcEmployees.filter((e) => e.category_id === staffReq.oficial)
      : [];
    const peones = staffReq.peones > 0
      ? wcEmployees.filter((e) => e.category_id === 'ec_1' || e.category_id === 'ec_2')
      : [];

    return (
      <div key={service.id} className="bg-white rounded-xl border border-app-border p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="text-sm font-bold text-app-text">{service.name}</h4>
            <p className="text-[11px] text-app-text-secondary">{service.category}</p>
          </div>
          <div className="flex items-center gap-2">
            {staffReq.oficial && (
              <span className="text-[11px] text-app-text-secondary font-mono bg-amber-50 px-2 py-0.5 rounded-full">
                {assignedOficiales.length}/1 of.
              </span>
            )}
            {staffReq.peones > 0 && (
              <span className="text-[11px] text-app-text-secondary font-mono bg-sky-50 px-2 py-0.5 rounded-full">
                {assignedPeones.length}/{staffReq.peones} peón{staffReq.peones !== 1 ? 'es' : ''}
              </span>
            )}
          </div>
        </div>

        {assignments.length > 0 && (
          <div className="space-y-1.5 mb-3">
            {assignments.map((a) => {
              const emp = employees.find((e) => e.id === a.employee_id);
              if (!emp) return null;
              const attendance = getAttendanceFor(a.employee_id);
              const isOficial = emp.category_id === 'ec_3' || emp.category_id === 'ec_4';
              return (
                <div key={a.id} className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-app-bg/50 border border-app-border/50">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`size-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      isOficial ? 'bg-amber-100 text-amber-700' : 'bg-primary-100 text-primary-600'
                    }`}>
                      {emp.name.charAt(0)}{emp.last_name1.charAt(0)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm text-app-text truncate">{formatEmployeeName(emp)}</span>
                      {isOficial && <UserCog className="h-3 w-3 text-amber-500 shrink-0" title="Oficial" />}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {currentReport?.type === 'DIARIO' && (
                      <select
                        value={attendance}
                        onChange={(e) => handleAttendanceChange(a.employee_id, e.target.value as AttendanceStatus)}
                        onClick={(e) => e.stopPropagation()}
                        className={`text-[11px] font-semibold border rounded-md px-1.5 py-0.5 cursor-pointer appearance-none ${ATTENDANCE_COLORS[attendance]}`}
                      >
                        <option value="PRESENT">Presente</option>
                        <option value="ABSENT">Ausente</option>
                        <option value="JUSTIFIED_ABSENCE">Ausente Justif.</option>
                      </select>
                    )}
                    <button
                      onClick={() => removeAssignment(currentReport!.id, a.id)}
                      className="p-0.5 rounded text-app-text-secondary hover:text-rose-500 hover:bg-rose-50 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === dropdownId ? null : dropdownId); }}
            className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Users className="h-3.5 w-3.5" />
            Asignar empleados
            <ChevronDown className={`h-3 w-3 transition-transform ${openDropdown === dropdownId ? 'rotate-180' : ''}`} />
          </button>

          {openDropdown === dropdownId && (
            <div
              onMouseDown={(e) => e.stopPropagation()}
              className="absolute top-full left-0 mt-1 w-full min-w-[280px] bg-white border border-app-border rounded-xl shadow-lg z-50 max-h-72 overflow-y-auto"
            >
              {oficiales.length === 0 && peones.length === 0 ? (
                <p className="p-3 text-xs text-app-text-secondary text-center">No hay empleados disponibles para este turno</p>
              ) : (
                <>
                  {staffReq.oficial && (
                    <div>
                      <div className="sticky top-0 bg-white px-3 py-1.5 text-[10px] font-bold text-amber-700 uppercase tracking-wider border-b border-app-border/50">
                        Oficial — {INITIAL_EMPLOYEE_CATEGORIES.find((c) => c.id === staffReq.oficial)?.name ?? ''} ({assignedOficiales.length}/1)
                      </div>
                      {oficiales.length === 0 ? (
                        <p className="px-3 py-2 text-xs text-app-text-secondary">No hay oficiales disponibles</p>
                      ) : (
                        oficiales.map((emp) => {
                          const checked = isEmployeeAssignedToService(emp.id, wcId, service.id);
                          const atLimit = !checked && assignedOficiales.length >= 1;
                          const statusName = STATUSES.find((s) => s.id === emp.status_id)?.name ?? emp.status_id;
                          return (
                            <label key={emp.id} className={`flex items-center gap-2.5 px-3 py-2 hover:bg-app-bg cursor-pointer border-b border-app-border/50 transition-colors ${atLimit ? 'opacity-40 pointer-events-none' : ''}`}>
                              <input type="checkbox" checked={checked} disabled={atLimit} onChange={() => handleToggleAssign(wcId, emp.id, service.id, staffReq)} className="rounded border-app-border text-primary-600 focus:ring-primary-500 h-4 w-4 shrink-0" />
                              <div className="size-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[10px] font-bold shrink-0">{emp.name.charAt(0)}{emp.last_name1.charAt(0)}</div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm text-app-text truncate">{formatEmployeeName(emp)}</p>
                                <p className="text-[10px] text-app-text-secondary">{statusName}</p>
                              </div>
                            </label>
                          );
                        })
                      )}
                    </div>
                  )}
                  {staffReq.peones > 0 && (
                    <div>
                      <div className="sticky top-0 bg-white px-3 py-1.5 text-[10px] font-bold text-sky-700 uppercase tracking-wider border-b border-app-border/50">
                        Peones ({assignedPeones.length}/{staffReq.peones})
                      </div>
                      {peones.length === 0 ? (
                        <p className="px-3 py-2 text-xs text-app-text-secondary">No hay peones disponibles</p>
                      ) : (
                        peones.map((emp) => {
                          const checked = isEmployeeAssignedToService(emp.id, wcId, service.id);
                          const atLimit = !checked && assignedPeones.length >= staffReq.peones;
                          const statusName = STATUSES.find((s) => s.id === emp.status_id)?.name ?? emp.status_id;
                          return (
                            <label key={emp.id} className={`flex items-center gap-2.5 px-3 py-2 hover:bg-app-bg cursor-pointer border-b border-app-border/50 transition-colors ${atLimit ? 'opacity-40 pointer-events-none' : ''}`}>
                              <input type="checkbox" checked={checked} disabled={atLimit} onChange={() => handleToggleAssign(wcId, emp.id, service.id, staffReq)} className="rounded border-app-border text-primary-600 focus:ring-primary-500 h-4 w-4 shrink-0" />
                              <div className="size-7 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-[10px] font-bold shrink-0">{emp.name.charAt(0)}{emp.last_name1.charAt(0)}</div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm text-app-text truncate">{formatEmployeeName(emp)}</p>
                                <p className="text-[10px] text-app-text-secondary">{statusName}</p>
                              </div>
                            </label>
                          );
                        })
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderWorkCenterSection = (wcId: string) => {
    const wc = scopeWorkCenters.find((w) => w.id === wcId);
    const wcSvc = services.filter((s) => s.work_center_id === wcId && s.shift_id === activeShift);
    const isOpen = activeWC === wcId;
    const wcEmployees = getEmployeesForWC(wcId);

    return (
      <div key={wcId} className="bg-app-card rounded-2xl border border-app-card-border">
        <button
          onClick={() => { setActiveWC(isOpen ? null : wcId); setOpenDropdown(null); }}
          className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-app-bg transition-colors"
        >
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-app-text-secondary" />
            <div className="text-left">
              <h3 className="text-sm font-bold text-app-text">{wc?.name ?? wcId}</h3>
              <p className="text-[11px] text-app-text-secondary">{wcSvc.length} servicio(s)</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {currentReport && (
              <span className="text-xs text-app-text-secondary font-mono bg-app-bg px-2 py-0.5 rounded-full">
                {currentReport.assignments.filter((a) => a.work_center_id === wcId).length} asign.
              </span>
            )}
            {isOpen ? <ChevronDown className="h-4 w-4 text-app-text-secondary" /> : <ChevronRight className="h-4 w-4 text-app-text-secondary" />}
          </div>
        </button>

          {isOpen && (
          <div className="border-t border-app-card-border p-4 space-y-4">
            {wcSvc.length === 0 ? (
              <p className="text-sm text-app-text-secondary text-center py-4">No hay servicios en este centro de trabajo para el turno seleccionado</p>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {wcSvc.map((svc) => renderServiceCard(wcId, svc, wcEmployees))}
              </div>
            )}

            {wcEmployees.length === 0 && wcSvc.length > 0 && (
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                No hay empleados disponibles (trabajando) para este turno en este centro de trabajo.
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderShiftTabs = () => (
    <div className="flex gap-1 overflow-x-auto py-2">
      {SHIFTS.map((shift) => {
        const shiftSvcCount = services.filter((s) => s.shift_id === shift.id).length;
        return (
          <button
            key={shift.id}
            onClick={() => { setActiveShift(shift.id); setActiveWC(null); setOpenDropdown(null); }}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeShift === shift.id
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-app-text-secondary hover:text-app-text hover:bg-app-bg border border-transparent hover:border-app-border'
            }`}
          >
            <Clock className="h-4 w-4" />
            {shift.name}
            {shiftSvcCount > 0 && (
              <span className="text-[11px] opacity-75">({shiftSvcCount} servicios)</span>
            )}
          </button>
        );
      })}
    </div>
  );

  const renderWcList = (isEmptyMsg: string) => {
    if (filteredWorkCenters.length === 0) {
      return (
        <div className="bg-app-card rounded-2xl border border-app-card-border p-8 text-center">
          <Building2 className="h-10 w-10 text-app-text-secondary mx-auto mb-3" />
          <p className="text-app-text-secondary">{isEmptyMsg}</p>
        </div>
      );
    }
    return (
      <div className="space-y-3">
        {filteredWorkCenters.map((wc) => renderWorkCenterSection(wc.id))}
      </div>
    );
  };

  const renderPrevioTab = () => (
    <div className="space-y-4">
      {renderShiftTabs()}
      {renderWcList('No hay centros de trabajo para el turno seleccionado en tu ciudad.')}
    </div>
  );

  const renderDiarioTab = () => (
    <div className="space-y-4">
      {currentReport && currentReport.assignments.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Parte vacío</p>
            <p className="text-xs text-amber-700">No hay asignaciones. Asigna empleados a los servicios para poder guardar el parte.</p>
          </div>
        </div>
      )}

      {renderShiftTabs()}
      {renderWcList('No hay centros de trabajo para el turno seleccionado en tu ciudad.')}
    </div>
  );

  const renderHistorialTab = () => (
    <div className="space-y-4">
      {historial.length === 0 ? (
        <div className="bg-app-card rounded-2xl border border-app-card-border p-8 text-center">
          <History className="h-10 w-10 text-app-text-secondary mx-auto mb-3" />
          <p className="text-app-text-secondary">No hay partes de servicio anteriores registrados.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {historial.map((r) => {
            const totalAssignments = r.assignments.length;
            const presentCount = r.attendance.filter((a) => a.status === 'PRESENT').length;
            return (
              <div key={r.id} className="bg-app-card rounded-xl border border-app-card-border p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CalendarCheck className="h-5 w-5 text-app-text-secondary" />
                  <div>
                    <p className="text-sm font-semibold text-app-text">Parte del {r.date}</p>
                    <p className="text-xs text-app-text-secondary">
                      {totalAssignments} asignaciones · {presentCount} presentes · {r.attendance.length - presentCount} ausencias
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-app-text-secondary bg-app-bg px-2 py-0.5 rounded-full">
                  {r.status === 'CONFIRMED' ? 'Confirmado' : 'Borrador'}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-app-border">
        <div className="flex items-center gap-2">
          {renderTabButton('previo', <CalendarPlus className="h-4 w-4" />, 'Parte Previo')}
          {renderTabButton('diario', <CalendarCheck className="h-4 w-4" />, 'Parte Diario')}
          {renderTabButton('historial', <History className="h-4 w-4" />, 'Historial')}
        </div>
        {(activeTab === 'previo' || activeTab === 'diario') && (
          <button
            onClick={handleSave}
            className="flex items-center justify-center size-9 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 transition-colors border border-emerald-200 shrink-0"
            title="Guardar parte"
          >
            <Save className="h-4 w-4" />
          </button>
        )}
      </div>

      {saveMsg && (
        <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium ${
          saveMsg.type === 'success'
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-rose-50 text-rose-700 border border-rose-200'
        }`}>
          {saveMsg.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertTriangle className="h-4 w-4 shrink-0" />
          )}
          {saveMsg.text}
          <button onClick={() => setSaveMsg(null)} className="ml-auto p-0.5 hover:opacity-70">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {computedWarnings.length > 0 && !saveMsg && (
        <div className="flex items-start gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-amber-50 text-amber-700 border border-amber-200">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Cambios detectados en empleados del parte previo:</p>
            <ul className="list-disc list-inside text-xs mt-1">
              {computedWarnings.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'previo' && renderPrevioTab()}
      {activeTab === 'diario' && renderDiarioTab()}
      {activeTab === 'historial' && renderHistorialTab()}
    </div>
  );
};
