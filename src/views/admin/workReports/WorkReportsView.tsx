import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useEmployees } from '../../../context/EmployeeContext';
import { useServices } from '../../../context/ServiceContext';
import { useServiceReports, getTodayDateString } from '../../../context/ServiceReportContext';
import { useVehicles } from '../../../context/VehicleContext';
import { useInventory } from '../../../context/InventoryContext';
import { useWorkReports } from '../../../context/WorkReportContext';
import { INVENTORY_SUBTYPES } from '../../../data/mockInventory';
import { INITIAL_EMPLOYEE_CATEGORIES, INITIAL_SHIFTS } from '../../../data/mockEmployees';
import { INITIAL_WORK_CENTERS } from '../../../data/mockWorkCenters';
import {
  ClipboardCheck, History, ClipboardList,
  Truck, Wrench, FileText, Save,
  CheckCircle2, AlertTriangle, X, ChevronDown, ChevronRight,
  Fuel, CalendarClock, Plus, Clock, Trash2,
  Building2, User, BadgeInfo,
} from 'lucide-react';

type Tab = 'hoy' | 'historial';

interface AssignMachineryType {
  id: string;
  name: string;
  model?: string;
  brand?: string;
}

const shiftMap = Object.fromEntries(INITIAL_SHIFTS.map((s) => [s.id, s.name]));
const todayIndex = (new Date().getDay() + 6) % 7;

const SectionCard: React.FC<{ icon: React.ReactNode; title: string; action?: React.ReactNode; children: React.ReactNode }> = ({ icon, title, action, children }) => (
  <div className="bg-app-card rounded-xl border border-app-card-border p-4">
    <div className="flex items-center gap-2 mb-4 text-app-text font-semibold text-sm">
      {icon}
      <span className="flex-1">{title}</span>
      {action}
    </div>
    {children}
  </div>
);

function formatEmployeeName(emp: { name: string; last_name1: string; last_name2: string }): string {
  return [emp.name, emp.last_name1, emp.last_name2].filter(Boolean).join(' ');
}

export const WorkReportsView: React.FC = () => {
  const { user } = useAuth();
  const { employees } = useEmployees();
  const { services } = useServices();
  const { getDiarioForToday, getReportById: getServiceReportById } = useServiceReports();
  const { vehicles } = useVehicles();
  const { items: inventoryItems } = useInventory();
  const {
    getWorkReportForToday, getWorkReportHistory, getWorkReportById,
    updateServices, updateVehicle, toggleTool, setMachineryBreakdown, updateNotes, saveReport,
  } = useWorkReports();

  const [activeTab, setActiveTab] = useState<Tab>('hoy');
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [saveMsg, setSaveMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());
  const [showToolPicker, setShowToolPicker] = useState(false);
  const [showServicePicker, setShowServicePicker] = useState(false);
  const [showVehiclePicker, setShowVehiclePicker] = useState(false);
  const [vehiclePickerMode, setVehiclePickerMode] = useState<'primary' | 'replacement'>('primary');
  const [showBreakdownModal, setShowBreakdownModal] = useState(false);
  const [showMachineryBreakdownModal, setShowMachineryBreakdownModal] = useState(false);
  const [breakdownType, setBreakdownType] = useState<string>('');
  const [machineryBreakdownToolId, setMachineryBreakdownToolId] = useState<string | null>(null);
  const [machineryBreakdownType, setMachineryBreakdownType] = useState<string>('');
  const [machineryBreakdownNotes, setMachineryBreakdownNotes] = useState('');
  const [breakdownNotes, setBreakdownNotes] = useState('');
  const [expandedVehicle, setExpandedVehicle] = useState(false);
  const [expandedReplacement, setExpandedReplacement] = useState(false);
  const [showFuelLiters, setShowFuelLiters] = useState(false);
  const [showReplacementFuelLiters, setShowReplacementFuelLiters] = useState(false);
  const [isSavedMode, setIsSavedMode] = useState(false);

  const BREAKDOWN_TYPES = [
    { id: 'mecanica', label: 'Avería mecánica' },
    { id: 'electrica', label: 'Avería eléctrica / hidráulica' },
    { id: 'neumatico', label: 'Pinchazo / neumático' },
    { id: 'accidente', label: 'Accidente / golpe' },
    { id: 'otro', label: 'Otros' },
  ];
  const [notes, setNotes] = useState('');
  const [workReportId, setWorkReportId] = useState<string | null>(null);
  const initializedRef = useRef(false);

  const myEmployee = useMemo(
    () => (user ? employees.find((e) => e.id === user.employee_id) : undefined),
    [employees, user]
  );

  const userCityId = useMemo(() => {
    if (user?.role === 'ROOT') return undefined;
    return user?.city_id;
  }, [user]);

  const todayDiario = useMemo(() => {
    if (!userCityId) return null;
    return getDiarioForToday(userCityId);
  }, [userCityId, getDiarioForToday]);

  const myAssignments = useMemo(() => {
    if (!todayDiario || !myEmployee) return [];
    return todayDiario.report.assignments.filter((a) => a.employee_id === myEmployee.id);
  }, [todayDiario, myEmployee]);

  const myServiceIds = useMemo(() => {
    return [...new Set(myAssignments.map((a) => a.service_id))];
  }, [myAssignments]);

  const myServices = useMemo(() => {
    return services.filter((s) => myServiceIds.includes(s.id));
  }, [services, myServiceIds]);

  const prefillServices = useMemo(() => {
    return myServices.map((s) => ({
      service_id: s.id,
      tasks: s.tasks.filter((t) => t.day_index === todayIndex).map((t) => ({ task_id: t.id, completed: false })),
    }));
  }, [myServices]);

  const vehicleAssignment = useMemo(() => {
    return myAssignments.find((a) => a.vehicle_id);
  }, [myAssignments]);

  useEffect(() => {
    if (!myEmployee || initializedRef.current) return;
    const prefill = prefillServices.length > 0 ? prefillServices : undefined;
    const report = getWorkReportForToday(myEmployee.id, prefill);
    setWorkReportId(report.id);
    if (report.notes) setNotes(report.notes);
    initializedRef.current = true;
  }, [myEmployee, prefillServices, getWorkReportForToday]);

  useEffect(() => {
    const close = () => {
      setShowToolPicker(false);
      setShowServicePicker(false);
      setShowVehiclePicker(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const workReport = useMemo(() => {
    if (!workReportId) return null;
    return getWorkReportById(workReportId);
  }, [workReportId, getWorkReportById]);

  const canEdit = workReport ? workReport.status !== 'CONFIRMED' && !isSavedMode : true;
  const isVehicleBroken = workReport ? !!workReport.vehicle_breakdown_type : false;

  const wcVehicles = useMemo(() => {
    if (!myEmployee?.work_center_id) return [];
    return vehicles.filter((v) => v.work_center_id === myEmployee.work_center_id && v.status === 'ACTIVE');
  }, [vehicles, myEmployee]);

  const machineryItems = useMemo(() => {
    return inventoryItems.filter((item) => item.category === 'MACHINERY' && item.status_id === 'ms-1');
  }, [inventoryItems]);

  const machinerySubtypes = useMemo(() => {
    const map = new Map<string, { name: string; items: AssignMachineryType[] }>();
    for (const item of machineryItems) {
      const sub = INVENTORY_SUBTYPES.find((s) => s.id === item.subtype_id);
      const key = item.subtype_id;
      if (!map.has(key)) map.set(key, { name: sub?.name ?? key, items: [] });
      map.get(key)!.items.push({
        id: item.id,
        name: item.name,
        model: item.attributes?.model ?? undefined,
        brand: item.attributes?.brand ?? undefined,
      });
    }
    return map;
  }, [machineryItems]);

  const history = useMemo(() => {
    if (!myEmployee) return [];
    return getWorkReportHistory(myEmployee.id);
  }, [myEmployee, getWorkReportHistory]);

  const selectedHistoryReport = useMemo(() => {
    if (!selectedHistoryId) return null;
    return getWorkReportById(selectedHistoryId);
  }, [selectedHistoryId, getWorkReportById]);

  const handleToggleCompleted = useCallback((serviceId: string, taskId: string) => {
    if (!workReport || !canEdit || workReport.status === 'CONFIRMED') return;
    const updated = workReport.services.map((entry) => {
      if (entry.service_id !== serviceId) return entry;
      return {
        ...entry,
        tasks: entry.tasks.map((t) =>
          t.task_id === taskId ? { ...t, completed: !t.completed } : t
        ),
      };
    });
    updateServices(workReport.id, updated);
  }, [workReport, canEdit, updateServices]);

  const handleAddService = (serviceId: string) => {
    if (!workReport || !canEdit || workReport.status === 'CONFIRMED') return;
    const service = services.find((s) => s.id === serviceId);
    if (!service) return;
    const entry: import('../../../types').WorkServiceEntry = {
      service_id: serviceId,
      tasks: service.tasks.filter((t) => t.day_index === todayIndex).map((t) => ({ task_id: t.id, completed: false })),
    };
    updateServices(workReport.id, [...workReport.services, entry]);
    setShowServicePicker(false);
  };

  const handleRemoveService = (serviceId: string) => {
    if (!workReport || !canEdit || workReport.status === 'CONFIRMED') return;
    updateServices(workReport.id, workReport.services.filter((e) => e.service_id !== serviceId));
  };

  const handleToggleExpand = (serviceId: string) => {
    setExpandedServices((prev) => {
      const next = new Set(prev);
      if (next.has(serviceId)) next.delete(serviceId);
      else next.add(serviceId);
      return next;
    });
  };

  const handleVehicleChange = (vehicleId: string, asReplacement?: boolean) => {
    if (!workReport || !canEdit || workReport.status === 'CONFIRMED') return;
    if (asReplacement) {
      updateVehicle(workReport.id, { replacement_vehicle_id: vehicleId || undefined });
    } else {
      updateVehicle(workReport.id, { vehicle_id: vehicleId || undefined });
    }
  };

  const handleFieldChange = (field: string, value: number | undefined) => {
    if (!workReport || !canEdit || workReport.status === 'CONFIRMED') return;
    updateVehicle(workReport.id, { [field]: value });
  };

  const handleToggleTool = (toolId: string) => {
    if (!workReport || !canEdit || workReport.status === 'CONFIRMED') return;
    toggleTool(workReport.id, toolId);
  };

  const handleOpenBreakdownModal = () => {
    setBreakdownType('');
    setBreakdownNotes('');
    setShowBreakdownModal(true);
  };

  const handleConfirmBreakdown = () => {
    if (!workReport || !canEdit || workReport.status === 'CONFIRMED' || !breakdownType) return;
    const label = BREAKDOWN_TYPES.find((b) => b.id === breakdownType)?.label ?? breakdownType;
    updateVehicle(workReport.id, {
      vehicle_breakdown_type: label,
      vehicle_breakdown_notes: breakdownNotes || undefined,
    });
    setShowBreakdownModal(false);
    setBreakdownType('');
    setBreakdownNotes('');
  };

  const handleRemoveBreakdown = () => {
    if (!workReport || !canEdit || workReport.status === 'CONFIRMED') return;
    updateVehicle(workReport.id, {
      vehicle_breakdown_type: undefined,
      vehicle_breakdown_notes: undefined,
      replacement_vehicle_id: undefined,
      replacement_km_start: undefined,
      replacement_km_end: undefined,
      replacement_hour_meter_start: undefined,
      replacement_hour_meter_end: undefined,
      replacement_fuel_liters: undefined,
    });
  };

  const handleRemoveReplacement = () => {
    if (!workReport || !canEdit || workReport.status === 'CONFIRMED') return;
    updateVehicle(workReport.id, {
      replacement_vehicle_id: undefined,
      replacement_km_start: undefined,
      replacement_km_end: undefined,
      replacement_hour_meter_start: undefined,
      replacement_hour_meter_end: undefined,
      replacement_fuel_liters: undefined,
    });
  };

  const handleOpenMachineryBreakdown = (toolId: string) => {
    const existing = workReport?.machinery_breakdowns?.[toolId];
    setMachineryBreakdownToolId(toolId);
    setMachineryBreakdownType(existing?.type ?? '');
    setMachineryBreakdownNotes(existing?.notes ?? '');
    setShowMachineryBreakdownModal(true);
  };

  const handleConfirmMachineryBreakdown = () => {
    if (!workReport || !canEdit || workReport.status === 'CONFIRMED' || !machineryBreakdownToolId || !machineryBreakdownType) return;
    const label = BREAKDOWN_TYPES.find((b) => b.id === machineryBreakdownType)?.label ?? machineryBreakdownType;
    setMachineryBreakdown(workReport.id, machineryBreakdownToolId, label, machineryBreakdownNotes || undefined);
    setShowMachineryBreakdownModal(false);
    setMachineryBreakdownToolId(null);
    setMachineryBreakdownType('');
    setMachineryBreakdownNotes('');
  };

  const handleRemoveMachineryBreakdown = (toolId: string) => {
    if (!workReport || !canEdit || workReport.status === 'CONFIRMED') return;
    setMachineryBreakdown(workReport.id, toolId, undefined);
  };

  const handleNotesChange = (value: string) => {
    setNotes(value);
    if (!workReport || !canEdit || workReport.status === 'CONFIRMED') return;
    updateNotes(workReport.id, value);
  };

  const handleSave = () => {
    if (!workReport) return;
    if (workReport.services.length === 0) {
      setSaveMsg({ type: 'error', text: 'Debe haber al menos un servicio para guardar el parte.' });
      return;
    }
    if (notes !== workReport.notes) {
      updateNotes(workReport.id, notes);
    }
    const d = new Date();
    const dateStr = `${d.getDate().toString().padStart(2, '0')}${(d.getMonth() + 1).toString().padStart(2, '0')}${d.getFullYear()}`;
    setSaveMsg({ type: 'success', text: `Parte confirmado pt${workReport.employee_id}_${dateStr}` });
    setIsSavedMode(true);
  };

  const getServiceProgress = (serviceId: string): { completed: number; total: number } => {
    const entry = workReport?.services.find((e) => e.service_id === serviceId);
    if (!entry) return { completed: 0, total: 0 };
    const completed = entry.tasks.filter((t) => t.completed).length;
    return { completed, total: entry.tasks.length };
  };

  const getProgressPercent = (serviceId: string): number => {
    const { completed, total } = getServiceProgress(serviceId);
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  const getTotalProgress = (): { completed: number; total: number } => {
    let completed = 0;
    let total = 0;
    for (const entry of workReport?.services ?? []) {
      for (const t of entry.tasks) {
        total++;
        if (t.completed) completed++;
      }
    }
    return { completed, total };
  };

  const totalProgress = useMemo(getTotalProgress, [workReport]);

  if (!myEmployee) {
    return (
      <div className="bg-app-card rounded-2xl border border-app-card-border p-12 text-center">
        <UserCog className="h-16 w-16 text-app-text-secondary mx-auto mb-4" />
        <h3 className="text-lg font-bold text-app-text mb-2">Sin perfil de empleado</h3>
        <p className="text-sm text-app-text-secondary max-w-md mx-auto">
          No tienes un perfil de empleado vinculado a tu usuario. Contacta con un administrador.
        </p>
      </div>
    );
  }

  const renderHoyTab = () => {
    if (!workReport) return null;
    const isConfirmed = workReport.status === 'CONFIRMED';

    return (
      <div className="space-y-5">
        {saveMsg && (
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium ${
            saveMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}>
            {saveMsg.type === 'success' ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertTriangle className="h-4 w-4 shrink-0" />}
            {saveMsg.text}
            <button onClick={() => { setSaveMsg(null); setIsSavedMode(false); }} className="ml-auto p-0.5 hover:opacity-70"><X className="h-3.5 w-3.5" /></button>
          </div>
        )}

        {isConfirmed && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Parte de trabajo confirmado — no editable
          </div>
        )}

        {/* Today header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-app-text-secondary" />
            <span className="text-sm font-semibold text-app-text">
              {INITIAL_WORK_CENTERS.find((w) => w.id === myEmployee.work_center_id)?.name ?? myEmployee.work_center_id}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-app-text-secondary" />
            <span className="text-sm font-semibold text-app-text">
              {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Employee card */}
        <div className="bg-app-bg rounded-xl border border-app-border p-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <User className="h-4 w-4 text-primary-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-app-text-secondary uppercase tracking-wider font-medium">Empleado</p>
              <p className="text-sm font-semibold text-app-text truncate">{formatEmployeeName(myEmployee)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 min-w-0">
            <BadgeInfo className="h-4 w-4 text-primary-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-app-text-secondary uppercase tracking-wider font-medium">Categoría</p>
              <p className="text-sm font-semibold text-app-text truncate">{INITIAL_EMPLOYEE_CATEGORIES.find((c) => c.id === myEmployee.category_id)?.name ?? myEmployee.category_id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 min-w-0">
            <CalendarClock className="h-4 w-4 text-primary-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-app-text-secondary uppercase tracking-wider font-medium">Turno</p>
              <p className="text-sm font-semibold text-app-text truncate">{shiftMap[myEmployee.shift_id] ?? myEmployee.shift_id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 min-w-0">
            <Clock className="h-4 w-4 text-primary-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-app-text-secondary uppercase tracking-wider font-medium">Horario</p>
              <p className="text-sm font-semibold text-app-text truncate">{myEmployee.start_time} - {myEmployee.end_time}</p>
            </div>
          </div>
        </div>

        {/* Global Progress */}
        {totalProgress.total > 0 && (
          <div className="bg-app-card rounded-xl border border-app-card-border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-app-text-secondary uppercase tracking-wider">Progreso general</span>
              <span className="text-sm font-bold text-app-text">{totalProgress.completed}/{totalProgress.total} tareas</span>
            </div>
            <div className="h-2 bg-app-bg rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${totalProgress.total > 0 ? (totalProgress.completed / totalProgress.total) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}

        {/* Services section */}
        <SectionCard
          icon={<ClipboardList className="h-4 w-4" />}
          title="Servicios"
          action={canEdit ? (
            <div className="relative">
              <button
                onMouseDown={(e) => { e.stopPropagation(); setShowServicePicker(!showServicePicker); }}
                className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                Añadir servicio
              </button>
              {showServicePicker && (
                <div
                  onMouseDown={(e) => e.stopPropagation()}
                  className="absolute top-full right-0 mt-1 w-72 bg-white border border-app-border rounded-xl shadow-lg z-50 max-h-72 overflow-y-auto"
                >
                  {(() => {
                    const available = services.filter((s) => !workReport.services.some((e) => e.service_id === s.id));
                    return available.length === 0 ? (
                      <p className="p-3 text-xs text-app-text-secondary text-center">No hay más servicios disponibles</p>
                    ) : (
                      available.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => handleAddService(s.id)}
                          className="w-full text-left px-3 py-2.5 hover:bg-app-bg border-b border-app-border/50 transition-colors"
                        >
                          <p className="text-sm font-medium text-app-text">{s.name}</p>
                          <p className="text-[11px] text-app-text-secondary">{s.category}</p>
                        </button>
                      ))
                    );
                  })()}
                </div>
              )}
            </div>
          ) : undefined}
        >
          {workReport.services.length === 0 ? (
            <div className="text-center py-6">
              <ClipboardCheck className="h-10 w-10 text-app-text-secondary mx-auto mb-2" />
              <p className="text-sm text-app-text-secondary">No tienes servicios asignados hoy en el parte diario.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {workReport.services.map((entry) => {
                const service = services.find((s) => s.id === entry.service_id);
                if (!service) return null;
                const { completed, total } = getServiceProgress(entry.service_id);
                const progress = getProgressPercent(entry.service_id);
                const isExpanded = expandedServices.has(entry.service_id);

                return (
                  <div key={entry.service_id} className="border border-app-border rounded-xl overflow-hidden">
                    <button
                      onClick={() => handleToggleExpand(entry.service_id)}
                      className="w-full flex items-center justify-between px-3 py-2 bg-app-bg hover:bg-gray-100/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <ClipboardList className="h-4 w-4 text-primary-500 shrink-0" />
                        <div className="min-w-0 text-left">
                          <p className="text-sm font-semibold text-app-text truncate">{service.name}</p>
                          <p className="text-[11px] text-app-text-secondary">{service.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center gap-1.5">
                          <div className="h-1.5 w-16 bg-gray-200 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-300 ${
                              progress === 100 ? 'bg-emerald-500' : 'bg-primary-500'
                            }`} style={{ width: `${progress}%` }} />
                          </div>
                          <span className="text-[11px] font-mono text-app-text-secondary">{completed}/{total}</span>
                        </div>
                        {canEdit && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleRemoveService(entry.service_id); }}
                            className="p-1 rounded-md hover:bg-rose-50 text-app-text-secondary hover:text-rose-600 transition-colors"
                            title="Quitar servicio"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {isExpanded ? <ChevronDown className="h-4 w-4 text-app-text-secondary" /> : <ChevronRight className="h-4 w-4 text-app-text-secondary" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-app-border px-4 py-3 space-y-2">
                        {(() => {
                          const todayTasks = service.tasks.filter((t) => t.day_index === todayIndex);
                          return todayTasks.length === 0 ? (
                            <p className="text-xs text-app-text-secondary text-center py-2">Este servicio no tiene tareas</p>
                          ) : (
                            todayTasks.map((task) => {
                              const taskCompletion = entry.tasks.find((t) => t.task_id === task.id);
                              const isCompleted = taskCompletion?.completed ?? false;
                              return (
                              <label
                                key={task.id}
                                className={`flex items-start gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                                  isCompleted ? 'bg-emerald-50/50' : 'hover:bg-app-bg'
                                } ${isSavedMode || isConfirmed || !canEdit ? 'cursor-default' : ''}`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isCompleted}
                                  disabled={isSavedMode || isConfirmed || !canEdit}
                                  onChange={() => handleToggleCompleted(entry.service_id, task.id)}
                                  className="mt-0.5 rounded border-app-border text-primary-600 focus:ring-primary-500 h-4 w-4 shrink-0 disabled:opacity-50"
                                />
                                <div className="min-w-0 flex-1">
                                  <p className={`text-sm ${isCompleted ? 'text-app-text-secondary line-through' : 'text-app-text'}`}>
                                    {task.description}
                                  </p>
                                  {task.zone && (
                                    <p className="text-[11px] text-app-text-secondary mt-0.5">{task.zone}</p>
                                  )}
                                </div>
                              </label>
                            );
                            })
                          )
                        })()}
                        </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>

        {/* Vehicle section */}
        <SectionCard
          icon={<Truck className="h-4 w-4" />}
          title="Vehículo"
          action={canEdit ? (
            <div className="relative flex gap-1">
              {!workReport.vehicle_id && !workReport.replacement_vehicle_id && (
                <button
                  onMouseDown={(e) => { e.stopPropagation(); setVehiclePickerMode('primary'); setShowVehiclePicker(!showVehiclePicker); }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Añadir vehículo
                </button>
              )}
              {isVehicleBroken && !workReport.replacement_vehicle_id && (
                <button
                  onMouseDown={(e) => { e.stopPropagation(); setVehiclePickerMode('replacement'); setShowVehiclePicker(!showVehiclePicker); }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Añadir vehículo de reemplazo
                </button>
              )}
              {showVehiclePicker && vehiclePickerMode === 'primary' && (
                <VehiclePicker
                  vehicles={wcVehicles}
                  assignedIds={[workReport.vehicle_id, workReport.replacement_vehicle_id].filter(Boolean) as string[]}
                  onSelect={(id) => { handleVehicleChange(id, false); setShowVehiclePicker(false); }}
                />
              )}
              {showVehiclePicker && vehiclePickerMode === 'replacement' && (
                <VehiclePicker
                  vehicles={wcVehicles}
                  assignedIds={[workReport.vehicle_id, workReport.replacement_vehicle_id].filter(Boolean) as string[]}
                  onSelect={(id) => { handleVehicleChange(id, true); setShowVehiclePicker(false); }}
                />
              )}
            </div>
          ) : undefined}
        >
          <div className="space-y-3">

            {/* ===== Primary vehicle ===== */}
            {workReport.vehicle_id && (
              <div className="border border-app-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedVehicle(!expandedVehicle)}
                  className="w-full flex items-center justify-between px-3 py-2 bg-app-bg hover:bg-gray-100/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Truck className={`h-4 w-4 shrink-0 ${isVehicleBroken ? 'text-amber-500' : 'text-primary-500'}`} />
                    <div className="min-w-0 text-left">
                      <p className={`text-sm font-semibold truncate ${isVehicleBroken ? 'text-amber-800' : 'text-app-text'}`}>
                        {(() => {
                          const v = vehicles.find((x) => x.id === workReport.vehicle_id);
                          return v ? `${v.license_plate} — ${v.brand} ${v.model}` : workReport.vehicle_id;
                        })()}
                      </p>
                      <p className={`text-[11px] ${isVehicleBroken ? 'text-amber-600' : 'text-app-text-secondary'}`}>
                        {(() => {
                          const v = vehicles.find((x) => x.id === workReport.vehicle_id);
                          return v ? `${v.kilometers.toLocaleString()} km` : '';
                        })()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {canEdit && !isVehicleBroken && (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleOpenBreakdownModal(); }}
                          className="p-1.5 rounded-md hover:bg-amber-50 text-app-text-secondary hover:text-amber-600 transition-colors"
                          title="Avería"
                        >
                          <AlertTriangle className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleVehicleChange(''); setShowVehiclePicker(false); }}
                          className="p-1.5 rounded-md hover:bg-rose-50 text-app-text-secondary hover:text-rose-600 transition-colors"
                          title="Quitar vehículo"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                    {expandedVehicle ? <ChevronDown className="h-4 w-4 text-app-text-secondary" /> : <ChevronRight className="h-4 w-4 text-app-text-secondary" />}
                  </div>
                </button>

                {isVehicleBroken && (
                  <div className="px-4 py-2 bg-amber-50 border-b border-app-border">
                    <div className="flex items-start gap-2 text-amber-700 text-xs font-medium">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p>Avería registrada: {workReport.vehicle_breakdown_type}</p>
                        {workReport.vehicle_breakdown_notes && (
                          <p className="text-[11px] text-amber-600 mt-0.5 leading-relaxed">{workReport.vehicle_breakdown_notes}</p>
                        )}
                      </div>
                      {canEdit && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleRemoveBreakdown(); }}
                          className="shrink-0 p-1 rounded hover:bg-amber-100 text-amber-400 hover:text-amber-600 transition-colors"
                          title="Quitar avería"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {expandedVehicle && (
                  <div className="border-t border-app-border px-4 py-3 space-y-3">
                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <label className="text-[11px] font-medium text-app-text-secondary mb-1 block">Km inicio</label>
                        <input
                          type="number"
                          value={workReport.km_start ?? ''}
                          onChange={(e) => handleFieldChange('km_start', e.target.value ? Number(e.target.value) : undefined)}
                          disabled={isSavedMode || isConfirmed || !canEdit || isVehicleBroken}
                          className="w-full rounded-lg border border-app-border px-2 py-1.5 text-sm bg-white text-app-text disabled:opacity-50"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-app-text-secondary mb-1 block">Km fin</label>
                        <input
                          type="number"
                          value={workReport.km_end ?? ''}
                          onChange={(e) => handleFieldChange('km_end', e.target.value ? Number(e.target.value) : undefined)}
                          disabled={isSavedMode || isConfirmed || !canEdit || isVehicleBroken}
                          className="w-full rounded-lg border border-app-border px-2 py-1.5 text-sm bg-white text-app-text disabled:opacity-50"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-app-text-secondary mb-1 block">H. inicio</label>
                        <input
                          type="number"
                          value={workReport.hour_meter_start ?? ''}
                          onChange={(e) => handleFieldChange('hour_meter_start', e.target.value ? Number(e.target.value) : undefined)}
                          disabled={isSavedMode || isConfirmed || !canEdit || isVehicleBroken}
                          className="w-full rounded-lg border border-app-border px-2 py-1.5 text-sm bg-white text-app-text disabled:opacity-50"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-app-text-secondary mb-1 block">H. fin</label>
                        <input
                          type="number"
                          value={workReport.hour_meter_end ?? ''}
                          onChange={(e) => handleFieldChange('hour_meter_end', e.target.value ? Number(e.target.value) : undefined)}
                          disabled={isSavedMode || isConfirmed || !canEdit || isVehicleBroken}
                          className="w-full rounded-lg border border-app-border px-2 py-1.5 text-sm bg-white text-app-text disabled:opacity-50"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showFuelLiters || !!workReport.fuel_liters}
                        onChange={(e) => setShowFuelLiters(e.target.checked)}
                        disabled={isSavedMode || isConfirmed || !canEdit || isVehicleBroken}
                        className="rounded border-app-border text-primary-600 focus:ring-primary-500 h-4 w-4 disabled:opacity-50"
                      />
                      <span className="text-xs font-medium text-app-text">Repostar</span>
                    </label>

                    {(showFuelLiters || !!workReport.fuel_liters) && (
                      <div className="max-w-[200px]">
                        <label className="text-[11px] font-medium text-app-text-secondary mb-1 block">
                          <Fuel className="h-3 w-3 inline mr-1" />
                          Litros de combustible
                        </label>
                        <input
                          type="number"
                          value={workReport.fuel_liters ?? ''}
                          onChange={(e) => handleFieldChange('fuel_liters', e.target.value ? Number(e.target.value) : undefined)}
                          disabled={isSavedMode || isConfirmed || !canEdit || isVehicleBroken}
                          className="w-full rounded-lg border border-app-border px-2 py-1.5 text-sm bg-white text-app-text disabled:opacity-50"
                          placeholder="0"
                          step="0.1"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ===== Replacement vehicle ===== */}
            {workReport.replacement_vehicle_id && (
              <div className="border border-app-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedReplacement(!expandedReplacement)}
                  className="w-full flex items-center justify-between px-3 py-2 bg-app-bg hover:bg-gray-100/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Truck className="h-4 w-4 text-primary-500 shrink-0" />
                    <div className="min-w-0 text-left">
                      <p className="text-sm font-semibold text-app-text truncate">
                        {(() => {
                          const v = vehicles.find((x) => x.id === workReport.replacement_vehicle_id);
                          return v ? `${v.license_plate} — ${v.brand} ${v.model}` : workReport.replacement_vehicle_id;
                        })()}
                      </p>
                      <p className="text-[11px] text-app-text-secondary">
                        {(() => {
                          const v = vehicles.find((x) => x.id === workReport.replacement_vehicle_id);
                          return v ? `${v.kilometers.toLocaleString()} km` : '';
                        })()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {canEdit && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRemoveReplacement(); }}
                        className="p-1.5 rounded-md hover:bg-rose-50 text-app-text-secondary hover:text-rose-600 transition-colors"
                        title="Quitar vehículo de reemplazo"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {expandedReplacement ? <ChevronDown className="h-4 w-4 text-app-text-secondary" /> : <ChevronRight className="h-4 w-4 text-app-text-secondary" />}
                  </div>
                </button>

                {expandedReplacement && (
                  <div className="border-t border-app-border px-4 py-3 space-y-3">
                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <label className="text-[11px] font-medium text-app-text-secondary mb-1 block">Km inicio</label>
                        <input
                          type="number"
                          value={workReport.replacement_km_start ?? ''}
                          onChange={(e) => handleFieldChange('replacement_km_start', e.target.value ? Number(e.target.value) : undefined)}
                          disabled={isSavedMode || isConfirmed || !canEdit}
                          className="w-full rounded-lg border border-app-border px-2 py-1.5 text-sm bg-white text-app-text disabled:opacity-50"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-app-text-secondary mb-1 block">Km fin</label>
                        <input
                          type="number"
                          value={workReport.replacement_km_end ?? ''}
                          onChange={(e) => handleFieldChange('replacement_km_end', e.target.value ? Number(e.target.value) : undefined)}
                          disabled={isSavedMode || isConfirmed || !canEdit}
                          className="w-full rounded-lg border border-app-border px-2 py-1.5 text-sm bg-white text-app-text disabled:opacity-50"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-app-text-secondary mb-1 block">H. inicio</label>
                        <input
                          type="number"
                          value={workReport.replacement_hour_meter_start ?? ''}
                          onChange={(e) => handleFieldChange('replacement_hour_meter_start', e.target.value ? Number(e.target.value) : undefined)}
                          disabled={isSavedMode || isConfirmed || !canEdit}
                          className="w-full rounded-lg border border-app-border px-2 py-1.5 text-sm bg-white text-app-text disabled:opacity-50"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-app-text-secondary mb-1 block">H. fin</label>
                        <input
                          type="number"
                          value={workReport.replacement_hour_meter_end ?? ''}
                          onChange={(e) => handleFieldChange('replacement_hour_meter_end', e.target.value ? Number(e.target.value) : undefined)}
                          disabled={isSavedMode || isConfirmed || !canEdit}
                          className="w-full rounded-lg border border-app-border px-2 py-1.5 text-sm bg-white text-app-text disabled:opacity-50"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showReplacementFuelLiters || !!workReport.replacement_fuel_liters}
                        onChange={(e) => setShowReplacementFuelLiters(e.target.checked)}
                        disabled={isSavedMode || isConfirmed || !canEdit}
                        className="rounded border-app-border text-primary-600 focus:ring-primary-500 h-4 w-4 disabled:opacity-50"
                      />
                      <span className="text-xs font-medium text-app-text">Repostar</span>
                    </label>

                    {(showReplacementFuelLiters || !!workReport.replacement_fuel_liters) && (
                      <div className="max-w-[200px]">
                        <label className="text-[11px] font-medium text-app-text-secondary mb-1 block">
                          <Fuel className="h-3 w-3 inline mr-1" />
                          Litros de combustible
                        </label>
                        <input
                          type="number"
                          value={workReport.replacement_fuel_liters ?? ''}
                          onChange={(e) => handleFieldChange('replacement_fuel_liters', e.target.value ? Number(e.target.value) : undefined)}
                          disabled={isSavedMode || isConfirmed || !canEdit}
                          className="w-full rounded-lg border border-app-border px-2 py-1.5 text-sm bg-white text-app-text disabled:opacity-50"
                          placeholder="0"
                          step="0.1"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

          </div>
        </SectionCard>

        {/* Breakdown Modal */}
        {showBreakdownModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40" onClick={() => setShowBreakdownModal(false)}>
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-5 pt-5 pb-2">
                <h3 className="text-base font-bold text-app-text">Registrar avería</h3>
                <p className="text-xs text-app-text-secondary mt-1">Selecciona el tipo de avería y añade observaciones si es necesario.</p>
              </div>
              <div className="px-5 py-3 space-y-3 max-h-80 overflow-y-auto">
                <div className="relative">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1.5 rounded-lg transition-colors pointer-events-none">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {breakdownType ? BREAKDOWN_TYPES.find((b) => b.id === breakdownType)?.label : 'Seleccionar tipo de avería'}
                  </div>
                  <select
                    value={breakdownType}
                    onChange={(e) => setBreakdownType(e.target.value)}
                    className="absolute inset-0 w-full opacity-0 cursor-pointer"
                  >
                    <option value="">Seleccionar tipo de avería</option>
                    {BREAKDOWN_TYPES.map((b) => (
                      <option key={b.id} value={b.id}>{b.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-medium text-app-text-secondary mb-1.5 block">Observaciones</label>
                  <textarea
                    value={breakdownNotes}
                    onChange={(e) => setBreakdownNotes(e.target.value)}
                    placeholder="Describe brevemente lo ocurrido..."
                    rows={3}
                    className="w-full rounded-lg border border-app-border px-3 py-2 text-sm bg-white text-app-text resize-none placeholder:text-app-text-secondary/50"
                  />
                </div>
              </div>
              <div className="px-5 py-3 border-t border-app-border/50 flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowBreakdownModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-app-text-secondary hover:text-app-text bg-app-bg hover:bg-app-border rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmBreakdown}
                  disabled={!breakdownType}
                  className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  Marcar como averiado
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tools section */}
        <SectionCard
          icon={<Wrench className="h-4 w-4" />}
          title="Herramientas / Maquinaria"
          action={canEdit && workReport.status !== 'CONFIRMED' ? (
            <div className="relative">
              <button
                onMouseDown={(e) => { e.stopPropagation(); setShowToolPicker(!showToolPicker); }}
                className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Wrench className="h-3.5 w-3.5" />
                Añadir herramienta
              </button>

              {showToolPicker && (
                <div
                  onMouseDown={(e) => e.stopPropagation()}
                  className="absolute top-full right-0 mt-1 w-72 bg-white border border-app-border rounded-xl shadow-lg z-50 max-h-72 overflow-y-auto"
                >
                  {machineryItems.length === 0 ? (
                    <p className="p-3 text-xs text-app-text-secondary text-center">No hay maquinaria disponible</p>
                  ) : (
                    Array.from(machinerySubtypes.entries()).map(([subtypeId, group]) => (
                      <div key={subtypeId}>
                        <div className="sticky top-0 bg-white px-3 py-1.5 text-[10px] font-bold text-app-text-secondary uppercase tracking-wider border-b border-app-border/50">
                          {group.name}
                        </div>
                        {group.items.map((item) => {
                          const isBroken = !!workReport.machinery_breakdowns?.[item.id];
                          return (
                            <label
                              key={item.id}
                              className={`flex items-center gap-2.5 px-3 py-2 hover:bg-app-bg cursor-pointer border-b border-app-border/50 transition-colors ${
                                workReport.tools.includes(item.id) ? (isBroken ? 'bg-amber-50' : 'bg-primary-50') : ''
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={workReport.tools.includes(item.id)}
                                onChange={() => handleToggleTool(item.id)}
                                disabled={isBroken}
                                className="rounded border-app-border text-primary-600 focus:ring-primary-500 h-4 w-4 shrink-0 disabled:opacity-50"
                              />
                              <div className="min-w-0 flex-1">
                                <p className={`text-sm truncate ${isBroken ? 'text-amber-700' : 'text-app-text'}`}>
                                  {item.name}
                                  {isBroken && (
                                    <span className="ml-1.5 text-[10px] text-amber-500 font-medium">(avería)</span>
                                  )}
                                </p>
                                {(item.brand || item.model) && (
                                  <p className="text-[10px] text-app-text-secondary">{[item.brand, item.model].filter(Boolean).join(' ')}</p>
                                )}
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ) : undefined}
        >
          <div className="space-y-2">
            {workReport.tools.length > 0 && (
              <div className="space-y-2">
                {workReport.tools.map((toolId) => {
                  const item = inventoryItems.find((i) => i.id === toolId);
                  const breakdown = workReport.machinery_breakdowns?.[toolId];
                  const isBroken = !!breakdown;
                  return (
                    <div key={toolId} className={`flex items-center justify-between rounded-lg px-3 py-2 border ${isBroken ? 'bg-amber-50 border-amber-200' : 'bg-app-bg border-app-border'}`}>
                      <div className="flex items-center gap-3 min-w-0">
                        <Wrench className={`h-4 w-4 shrink-0 ${isBroken ? 'text-amber-500' : 'text-primary-500'}`} />
                        <div className="min-w-0">
                          <p className={`text-sm font-semibold truncate ${isBroken ? 'text-amber-800' : 'text-app-text'}`}>
                            {item?.name ?? toolId}
                            {isBroken && (
                              <span className="ml-1.5 text-[10px] text-amber-600 font-medium">(avería: {breakdown?.type})</span>
                            )}
                          </p>
                          {(item?.brand || item?.model) && (
                            <p className="text-[11px] text-app-text-secondary">{[item.brand, item.model].filter(Boolean).join(' ')}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {!isBroken && !(isSavedMode || isConfirmed || !canEdit) && (
                          <>
                            <button
                              onClick={() => handleOpenMachineryBreakdown(toolId)}
                              className="p-1.5 rounded-md hover:bg-amber-50 text-app-text-secondary hover:text-amber-600 transition-colors"
                              title="Marcar como averiado"
                            >
                              <AlertTriangle className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleToggleTool(toolId)}
                              className="p-1.5 rounded-md hover:bg-rose-50 text-app-text-secondary hover:text-rose-600 transition-colors"
                              title="Quitar herramienta"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                        {isBroken && canEdit && workReport.status !== 'CONFIRMED' && (
                          <button
                            onClick={() => handleRemoveMachineryBreakdown(toolId)}
                            className="p-1.5 rounded-md hover:bg-amber-50 text-app-text-secondary hover:text-amber-600 transition-colors"
                            title="Quitar avería"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {workReport.tools.length === 0 && (
              <p className="text-xs text-app-text-secondary text-center py-4">No hay herramientas añadidas</p>
            )}
          </div>
        </SectionCard>

        {/* Machinery Breakdown Modal */}
        {showMachineryBreakdownModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40" onClick={() => setShowMachineryBreakdownModal(false)}>
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-5 pt-5 pb-2">
                <h3 className="text-base font-bold text-app-text">Registrar avería en maquinaria</h3>
                <p className="text-xs text-app-text-secondary mt-1">Selecciona el tipo de avería para la herramienta seleccionada.</p>
              </div>
              <div className="px-5 py-3 space-y-3 max-h-80 overflow-y-auto">
                <div className="relative">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1.5 rounded-lg transition-colors pointer-events-none">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {machineryBreakdownType ? BREAKDOWN_TYPES.find((b) => b.id === machineryBreakdownType)?.label : 'Seleccionar tipo de avería'}
                  </div>
                  <select
                    value={machineryBreakdownType}
                    onChange={(e) => setMachineryBreakdownType(e.target.value)}
                    className="absolute inset-0 w-full opacity-0 cursor-pointer"
                  >
                    <option value="">Seleccionar tipo de avería</option>
                    {BREAKDOWN_TYPES.map((b) => (
                      <option key={b.id} value={b.id}>{b.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-medium text-app-text-secondary mb-1.5 block">Observaciones</label>
                  <textarea
                    value={machineryBreakdownNotes}
                    onChange={(e) => setMachineryBreakdownNotes(e.target.value)}
                    placeholder="Describe brevemente lo ocurrido..."
                    rows={3}
                    className="w-full rounded-lg border border-app-border px-3 py-2 text-sm bg-white text-app-text resize-none placeholder:text-app-text-secondary/50"
                  />
                </div>
              </div>
              <div className="px-5 py-3 border-t border-app-border/50 flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowMachineryBreakdownModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-app-text-secondary hover:text-app-text bg-app-bg hover:bg-app-border rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmMachineryBreakdown}
                  disabled={!machineryBreakdownType}
                  className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  Marcar como averiado
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        <SectionCard icon={<FileText className="h-4 w-4" />} title="Observaciones">
          <textarea
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            disabled={isSavedMode || isConfirmed || !canEdit}
            rows={3}
            className="w-full rounded-lg border border-app-border px-3 py-2 text-sm bg-white text-app-text resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Incidencias, observaciones, ..."
          />
        </SectionCard>
      </div>
    );
  };

  const renderHistorialTab = () => {
    if (selectedHistoryReport) {
      return (
        <div className="space-y-5">
          <button
            onClick={() => setSelectedHistoryId(null)}
            className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 mb-2"
          >
            <ChevronRight className="h-3.5 w-3.5 rotate-180" />
            Volver al historial
          </button>

          <div className="flex items-center gap-2 mb-3">
            <CalendarClock className="h-5 w-5 text-app-text-secondary" />
            <span className="text-sm font-semibold text-app-text">
              Parte del {selectedHistoryReport.date}
            </span>
            <span className="text-[11px] font-mono text-app-text-secondary bg-app-bg px-2 py-0.5 rounded-full">
              Confirmado
            </span>
          </div>

          {/* Services from history */}
          <SectionCard icon={<ClipboardList className="h-4 w-4" />} title="Servicios">
            <div className="space-y-3">
              {selectedHistoryReport.services.map((entry) => {
                const service = services.find((s) => s.id === entry.service_id);
                if (!service) return null;
                const completed = entry.tasks.filter((t) => t.completed).length;
                const total = entry.tasks.length;
                const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

                return (
                  <div key={entry.service_id} className="border border-app-border rounded-xl overflow-hidden">
                    <div className="px-4 py-3">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-sm font-semibold text-app-text">{service.name}</p>
                          <p className="text-[11px] text-app-text-secondary">{service.category}</p>
                        </div>
                        <span className="text-[11px] font-mono text-app-text-secondary">{completed}/{total}</span>
                      </div>
                      <div className="h-1.5 w-full bg-app-bg rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${progress === 100 ? 'bg-emerald-500' : 'bg-primary-500'}`} style={{ width: `${progress}%` }} />
                      </div>
                      {entry.tasks.filter((t) => t.completed).length > 0 && (
                        <div className="mt-3 space-y-1">
                          {service.tasks.filter((t) => entry.tasks.find((et) => et.task_id === t.id)?.completed).map((t) => (
                            <div key={t.id} className="flex items-center gap-2 text-xs text-app-text-secondary">
                              <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                              {t.description}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          {/* Vehicle from history */}
          {selectedHistoryReport.vehicle_id && (
            <SectionCard icon={<Truck className="h-4 w-4" />} title="Vehículo">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <span className="text-[11px] font-medium text-app-text-secondary block">Vehículo</span>
                  <span className="text-sm text-app-text">
                    {(() => {
                      const v = vehicles.find((v) => v.id === selectedHistoryReport.vehicle_id);
                      return v ? `${v.license_plate} — ${v.brand} ${v.model}` : selectedHistoryReport.vehicle_id;
                    })()}
                  </span>
                </div>
                {selectedHistoryReport.km_start !== undefined && (
                  <div>
                    <span className="text-[11px] font-medium text-app-text-secondary block">Km inicio</span>
                    <span className="text-sm text-app-text">{selectedHistoryReport.km_start}</span>
                  </div>
                )}
                {selectedHistoryReport.km_end !== undefined && (
                  <div>
                    <span className="text-[11px] font-medium text-app-text-secondary block">Km fin</span>
                    <span className="text-sm text-app-text">{selectedHistoryReport.km_end}</span>
                  </div>
                )}
                {selectedHistoryReport.hour_meter_start !== undefined && (
                  <div>
                    <span className="text-[11px] font-medium text-app-text-secondary block">Horómetro inicio</span>
                    <span className="text-sm text-app-text">{selectedHistoryReport.hour_meter_start}</span>
                  </div>
                )}
                {selectedHistoryReport.hour_meter_end !== undefined && (
                  <div>
                    <span className="text-[11px] font-medium text-app-text-secondary block">Horómetro fin</span>
                    <span className="text-sm text-app-text">{selectedHistoryReport.hour_meter_end}</span>
                  </div>
                )}
                {selectedHistoryReport.fuel_liters !== undefined && (
                  <div>
                    <span className="text-[11px] font-medium text-app-text-secondary block">Combustible</span>
                    <span className="text-sm text-app-text">{selectedHistoryReport.fuel_liters} L</span>
                  </div>
                )}
              </div>
            </SectionCard>
          )}

          {/* Tools from history */}
          {selectedHistoryReport.tools.length > 0 && (
            <SectionCard icon={<Wrench className="h-4 w-4" />} title="Herramientas / Maquinaria">
              <div className="flex flex-wrap gap-2">
                {selectedHistoryReport.tools.map((toolId) => {
                  const item = inventoryItems.find((i) => i.id === toolId);
                  return (
                    <span key={toolId} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-app-bg text-app-text-secondary">
                      {item?.name ?? toolId}
                    </span>
                  );
                })}
              </div>
            </SectionCard>
          )}

          {selectedHistoryReport.notes && (
            <SectionCard icon={<FileText className="h-4 w-4" />} title="Observaciones">
              <p className="text-sm text-app-text whitespace-pre-wrap">{selectedHistoryReport.notes}</p>
            </SectionCard>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {history.length === 0 ? (
          <div className="bg-app-card rounded-2xl border border-app-card-border p-8 text-center">
            <History className="h-10 w-10 text-app-text-secondary mx-auto mb-3" />
            <p className="text-app-text-secondary">No hay partes de trabajo anteriores registrados.</p>
          </div>
        ) : (
          history.map((r) => {
            const completed = r.services.reduce((acc, e) => acc + e.tasks.filter((t) => t.completed).length, 0);
            const total = r.services.reduce((acc, e) => acc + e.tasks.length, 0);
            return (
              <button
                key={r.id}
                onClick={() => setSelectedHistoryId(r.id)}
                className="w-full bg-app-card rounded-xl border border-app-card-border p-4 flex items-center justify-between hover:bg-app-bg transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <CalendarClock className="h-5 w-5 text-app-text-secondary" />
                  <div>
                    <p className="text-sm font-semibold text-app-text">Parte del {r.date}</p>
                    <p className="text-xs text-app-text-secondary">
                      {r.services.length} servicios · {completed}/{total} tareas{r.vehicle_id ? ' · Con vehículo' : ''}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-app-text-secondary shrink-0" />
              </button>
            );
          })
        )}
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-app-border">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setActiveTab('hoy'); setSelectedHistoryId(null); }}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'hoy'
                ? 'text-primary-600 border-primary-600'
                : 'text-app-text-secondary border-transparent hover:text-app-text hover:border-app-text-secondary/30'
            }`}
          >
            <ClipboardCheck className="h-4 w-4" />
            Hoy
          </button>
          <button
            onClick={() => setActiveTab('historial')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'historial'
                ? 'text-primary-600 border-primary-600'
                : 'text-app-text-secondary border-transparent hover:text-app-text hover:border-app-text-secondary/30'
            }`}
          >
            <History className="h-4 w-4" />
            Historial
          </button>
        </div>
        {activeTab === 'hoy' && workReport && workReport.status !== 'CONFIRMED' && canEdit && !isSavedMode && !saveMsg && (
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors shadow-sm shrink-0"
          >
            <Save className="h-3.5 w-3.5" />
            Guardar
          </button>
        )}
      </div>

      {activeTab === 'hoy' && renderHoyTab()}
      {activeTab === 'historial' && renderHistorialTab()}
    </div>
  );
};

interface VehiclePickerProps {
  vehicles: { id: string; license_plate: string; brand: string; model: string; kilometers: number; vehicle_type_id: string }[];
  assignedIds: string[];
  onSelect: (id: string) => void;
}

function VehiclePicker({ vehicles, assignedIds, onSelect }: VehiclePickerProps) {
  const available = vehicles.filter((v) => !assignedIds.includes(v.id));
  return (
    <div
      onMouseDown={(e) => e.stopPropagation()}
      className="absolute top-full left-0 mt-1 w-full min-w-[280px] bg-white border border-app-border rounded-xl shadow-lg z-50 max-h-72 overflow-y-auto"
    >
      {available.length === 0 ? (
        <p className="p-3 text-xs text-app-text-secondary text-center">No hay vehículos disponibles en tu centro</p>
      ) : (
        available.map((v) => (
          <button
            key={v.id}
            onClick={() => onSelect(v.id)}
            className="w-full text-left px-3 py-2.5 hover:bg-app-bg border-b border-app-border/50 transition-colors"
          >
            <p className="text-sm font-medium text-app-text">{v.license_plate} — {v.brand} {v.model}</p>
            <p className="text-[11px] text-app-text-secondary">{v.kilometers.toLocaleString()} km · {v.vehicle_type_id}</p>
          </button>
        ))
      )}
    </div>
  );
}
