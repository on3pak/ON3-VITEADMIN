import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { WorkReport, WorkServiceEntry } from '../types';
import { workReportsApi } from '../api/services';
import { getToken } from '../api/client';

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
  loading: boolean;
  loadReports: () => void;
  getWorkReportForToday: (employeeId: string, prefillServices?: WorkServiceEntry[]) => WorkReport;
  getWorkReportHistory: (employeeId: string) => WorkReport[];
  getWorkReportById: (id: string) => WorkReport | undefined;
  getReportsByEmployeeAndDate: (employeeId: string, date: string) => WorkReport | undefined;
  updateServices: (reportId: string, services: WorkServiceEntry[]) => void;
  updateVehicle: (reportId: string, data: {
    vehicle_id?: string; km_start?: number; km_end?: number;
    hour_meter_start?: number; hour_meter_end?: number; fuel_liters?: number;
    vehicle_breakdown_type?: string; vehicle_breakdown_notes?: string;
    replacement_vehicle_id?: string; replacement_km_start?: number; replacement_km_end?: number;
    replacement_hour_meter_start?: number; replacement_hour_meter_end?: number; replacement_fuel_liters?: number;
  }) => void;
  toggleTool: (reportId: string, toolId: string) => void;
  setMachineryBreakdown: (reportId: string, toolId: string, type: string | undefined, notes?: string) => void;
  updateNotes: (reportId: string, notes: string) => void;
  saveReport: (reportId: string) => { success: boolean; error?: string };
  deleteReport: (reportId: string) => void;
}

const WorkReportContext = createContext<WorkReportContextType | undefined>(undefined);

export const WorkReportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<WorkReport[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReports = useCallback(() => {
    if (!getToken()) { setLoading(false); return; }
    setLoading(true);
    workReportsApi.list()
      .then((res) => {
        setReports(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
        if (getToken()) {
          workReportsApi.update(existing.id, { services: prefillServices }).catch(() => {});
        }
        return updated;
      }
      return existing;
    }

    const now = new Date().toISOString();
    const newReport: WorkReport = {
      id: crypto.randomUUID(),
      employee_id: employeeId,
      date: today,
      status: 'draft',
      services: prefillServices ?? [],
      tools: [],
      created_at: now,
      updated_at: now,
    };
    persist((prev) => [newReport, ...prev]);
    if (getToken()) {
      workReportsApi.create(newReport).catch(() => {});
    }
    return newReport;
  }, [reports, persist]);

  const getWorkReportHistory = useCallback((employeeId: string): WorkReport[] => {
    return reports.filter((r) => r.employee_id === employeeId && r.status.toLowerCase() === 'confirmed');
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
    if (getToken()) {
      workReportsApi.update(reportId, { services }).catch(() => {});
    }
  }, [persist]);

  const updateVehicle = useCallback((reportId: string, data: {
    vehicle_id?: string; km_start?: number; km_end?: number;
    hour_meter_start?: number; hour_meter_end?: number; fuel_liters?: number;
    vehicle_breakdown_type?: string; vehicle_breakdown_notes?: string;
    replacement_vehicle_id?: string; replacement_km_start?: number; replacement_km_end?: number;
    replacement_hour_meter_start?: number; replacement_hour_meter_end?: number; replacement_fuel_liters?: number;
  }) => {
    persist((prev) =>
      prev.map((r) =>
        r.id === reportId ? { ...r, ...data, updated_at: new Date().toISOString() } : r
      )
    );
    if (getToken()) {
      workReportsApi.update(reportId, data).catch(() => {});
    }
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
    if (getToken()) {
      const report = reports.find((r) => r.id === reportId);
      if (report) {
        const tools = report.tools.includes(toolId)
          ? report.tools.filter((t) => t !== toolId)
          : [...report.tools, toolId];
        workReportsApi.update(reportId, { tools }).catch(() => {});
      }
    }
  }, [persist, reports]);

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
    if (getToken()) {
      const report = reports.find((r) => r.id === reportId);
      if (report) {
        const breakdowns = { ...(report.machinery_breakdowns || {}) };
        if (type) {
          breakdowns[toolId] = { type, notes };
        } else {
          delete breakdowns[toolId];
        }
        workReportsApi.update(reportId, {
          machinery_breakdowns: Object.keys(breakdowns).length > 0 ? breakdowns : undefined,
        }).catch(() => {});
      }
    }
  }, [persist, reports]);

  const updateNotes = useCallback((reportId: string, notes: string) => {
    persist((prev) =>
      prev.map((r) =>
        r.id === reportId ? { ...r, notes, updated_at: new Date().toISOString() } : r
      )
    );
    if (getToken()) {
      workReportsApi.update(reportId, { notes }).catch(() => {});
    }
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
        return { ...r, status: 'confirmed', updated_at: new Date().toISOString() };
      })
    );
    if (result.success && getToken()) {
      workReportsApi.update(reportId, { status: 'confirmed' }).catch(() => {});
    }
    return result;
  }, [persist]);

  const deleteReport = useCallback((reportId: string) => {
    persist((prev) => prev.filter((r) => r.id !== reportId));
    if (getToken()) {
      workReportsApi.delete(reportId).catch(() => {});
    }
  }, [persist]);

  return (
    <WorkReportContext.Provider
      value={{
        reports,
        loading,
        loadReports,
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
