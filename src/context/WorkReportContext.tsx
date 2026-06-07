import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { WorkReport, WorkReportStatus, WorkServiceEntry } from '../types';

const STORAGE_KEY = 'on3_mock_work_reports';

function loadReports(): WorkReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: WorkReport[] = JSON.parse(raw);
      // Ensure seed reports for Miguel Ángel Torres exist
      const hasSeeds = parsed.some((r) => r.id === '550e8400-e29b-41d4-a716-446655440001');
      if (hasSeeds) return parsed;

      const taskDay = (dayIdx: number) =>
        Array.from({ length: 5 }, (_, i) => ({
          task_id: `sv_000001-task-${dayIdx * 20 + i}`,
          completed: true,
        }));

      const seed: WorkReport[] = [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          employee_id: '000001',
          date: '2026-06-02',
          status: 'CONFIRMED',
          services: [{ service_id: 'sv_000001', tasks: taskDay(2) }],
          vehicle_id: 'vh_000001',
          km_start: 4500,
          km_end: 4600,
          hour_meter_start: 1250,
          hour_meter_end: 1265,
          fuel_liters: 40,
          tools: ['inv_000028', 'inv_000032'],
          notes: 'Jornada completada sin incidencias',
          created_at: '2026-06-02T07:00:00Z',
          updated_at: '2026-06-02T15:30:00Z',
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          employee_id: '000001',
          date: '2026-05-28',
          status: 'CONFIRMED',
          services: [{ service_id: 'sv_000001', tasks: taskDay(4) }],
          vehicle_id: 'vh_000001',
          km_start: 4400,
          km_end: 4500,
          hour_meter_start: 1235,
          hour_meter_end: 1250,
          fuel_liters: 45,
          tools: ['inv_000028', 'inv_000029'],
          notes: 'Limpieza extraordinaria en Zona Norte por obras',
          created_at: '2026-05-28T07:00:00Z',
          updated_at: '2026-05-28T15:30:00Z',
        },
      ];

      return [...seed, ...parsed];
    }
  } catch { /* ignore */ }

  return [];
}

function getDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getTodayDateString(): string {
  return getDateString(new Date());
}

interface WorkReportContextType {
  reports: WorkReport[];
  getWorkReportForToday: (employeeId: string, prefillServices?: WorkServiceEntry[]) => WorkReport;
  getWorkReportHistory: (employeeId: string) => WorkReport[];
  getWorkReportById: (id: string) => WorkReport | undefined;
  getReportsByEmployeeAndDate: (employeeId: string, date: string) => WorkReport | undefined;
  updateServices: (reportId: string, services: WorkServiceEntry[]) => void;
   updateVehicle: (reportId: string, data: { vehicle_id?: string; km_start?: number; km_end?: number; hour_meter_start?: number; hour_meter_end?: number; fuel_liters?: number; vehicle_breakdown_type?: string; vehicle_breakdown_notes?: string; replacement_vehicle_id?: string; replacement_km_start?: number; replacement_km_end?: number; replacement_hour_meter_start?: number; replacement_hour_meter_end?: number; replacement_fuel_liters?: number }) => void;
  toggleTool: (reportId: string, toolId: string) => void;
  setMachineryBreakdown: (reportId: string, toolId: string, type: string | undefined, notes?: string) => void;
  updateNotes: (reportId: string, notes: string) => void;
  saveReport: (reportId: string) => { success: boolean; error?: string };
  deleteReport: (reportId: string) => void;
}

const WorkReportContext = createContext<WorkReportContextType | undefined>(undefined);

export const WorkReportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<WorkReport[]>(loadReports);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  }, [reports]);

  const persist = useCallback((updater: (prev: WorkReport[]) => WorkReport[]) => {
    setReports(updater);
  }, []);

  const getWorkReportForToday = useCallback((employeeId: string, prefillServices?: WorkServiceEntry[]): WorkReport => {
    const today = getTodayDateString();
    const existing = reports.find((r) => r.employee_id === employeeId && r.date === today);
    if (existing) {
      if (existing.services.length === 0 && prefillServices && prefillServices.length > 0) {
        const updated = { ...existing, services: prefillServices, updated_at: new Date().toISOString() };
        persist((prev) => prev.map((r) => r.id === existing.id ? updated : r));
        return updated;
      }
      return existing;
    }

    const now = new Date().toISOString();
    const newReport: WorkReport = {
      id: crypto.randomUUID(),
      employee_id: employeeId,
      date: today,
      status: 'DRAFT',
      services: prefillServices ?? [],
      tools: [],
      created_at: now,
      updated_at: now,
    };
    persist((prev) => [newReport, ...prev]);
    return newReport;
  }, [reports, persist]);

  const getWorkReportHistory = useCallback((employeeId: string): WorkReport[] => {
    return reports.filter((r) => r.employee_id === employeeId && r.status === 'CONFIRMED');
  }, [reports]);

  const getWorkReportById = useCallback((id: string) => {
    return reports.find((r) => r.id === id);
  }, [reports]);

  const getReportsByEmployeeAndDate = useCallback((employeeId: string, date: string) => {
    return reports.find((r) => r.employee_id === employeeId && r.date === date);
  }, [reports]);

  const updateServices = useCallback((reportId: string, services: WorkServiceEntry[]) => {
    persist((prev) =>
      prev.map((r) =>
        r.id === reportId ? { ...r, services, updated_at: new Date().toISOString() } : r
      )
    );
  }, [persist]);

    const updateVehicle = useCallback((reportId: string, data: { vehicle_id?: string; km_start?: number; km_end?: number; hour_meter_start?: number; hour_meter_end?: number; fuel_liters?: number; vehicle_breakdown_type?: string; vehicle_breakdown_notes?: string; replacement_vehicle_id?: string; replacement_km_start?: number; replacement_km_end?: number; replacement_hour_meter_start?: number; replacement_hour_meter_end?: number; replacement_fuel_liters?: number }) => {
    persist((prev) =>
      prev.map((r) =>
        r.id === reportId ? { ...r, ...data, updated_at: new Date().toISOString() } : r
      )
    );
  }, [persist]);

  const toggleTool = useCallback((reportId: string, toolId: string) => {
    persist((prev) =>
      prev.map((r) => {
        if (r.id !== reportId) return r;
        const tools = r.tools.includes(toolId)
          ? r.tools.filter((t) => t !== toolId)
          : [...r.tools, toolId];
        const breakdowns = { ...r.machinery_breakdowns };
        if (!r.tools.includes(toolId) && breakdowns[toolId]) {
          delete breakdowns[toolId];
        }
        return { ...r, tools, machinery_breakdowns: Object.keys(breakdowns).length > 0 ? breakdowns : undefined, updated_at: new Date().toISOString() };
      })
    );
  }, [persist]);

  const setMachineryBreakdown = useCallback((reportId: string, toolId: string, type: string | undefined, notes?: string) => {
    persist((prev) =>
      prev.map((r) => {
        if (r.id !== reportId) return r;
        const breakdowns = { ...(r.machinery_breakdowns || {}) };
        if (type) {
          breakdowns[toolId] = { type, notes };
        } else {
          delete breakdowns[toolId];
        }
        return {
          ...r,
          machinery_breakdowns: Object.keys(breakdowns).length > 0 ? breakdowns : undefined,
          updated_at: new Date().toISOString(),
        };
      })
    );
  }, [persist]);

  const updateNotes = useCallback((reportId: string, notes: string) => {
    persist((prev) =>
      prev.map((r) =>
        r.id === reportId ? { ...r, notes, updated_at: new Date().toISOString() } : r
      )
    );
  }, [persist]);

  const saveReport = useCallback((reportId: string): { success: boolean; error?: string } => {
    let result: { success: boolean; error?: string } = { success: true };
    persist((prev) =>
      prev.map((r) => {
        if (r.id !== reportId) return r;
        if (r.services.length === 0) {
          result = { success: false, error: 'Debe haber al menos un servicio para guardar el parte.' };
          return r;
        }
        return { ...r, status: 'CONFIRMED', updated_at: new Date().toISOString() };
      })
    );
    return result;
  }, [persist]);

  const deleteReport = useCallback((reportId: string) => {
    persist((prev) => prev.filter((r) => r.id !== reportId));
  }, [persist]);

  return (
    <WorkReportContext.Provider
      value={{
        reports,
        getWorkReportForToday,
        getWorkReportHistory,
        getWorkReportById,
        getReportsByEmployeeAndDate,
        updateServices,
        updateVehicle,
        toggleTool,
        setMachineryBreakdown,
        updateNotes,
        saveReport,
        deleteReport,
      }}
    >
      {children}
    </WorkReportContext.Provider>
  );
};

export const useWorkReports = (): WorkReportContextType => {
  const context = useContext(WorkReportContext);
  if (!context) {
    throw new Error('useWorkReports must be used within a WorkReportProvider');
  }
  return context;
};
