import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ServiceReport, ServiceAssignment, AttendanceStatus, EmployeeAttendance } from '../types';
import { serviceReportsApi } from '../api/services';
import { getToken } from '../api/client';

function getDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getWorkDayIdsForDate(date: Date): string[] {
  const day = date.getDay();
  const isWeekend = day === 0 || day === 6;
  const base = isWeekend ? ['wd_2'] : ['wd_1'];
  return [...base, 'wd_3', 'wd_4'];
}

export function getTomorrowDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return getDateString(d);
}

export function getTodayDateString(): string {
  return getDateString(new Date());
}

export function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return getDateString(d);
}

interface ServiceReportContextType {
  reports: ServiceReport[];
  loading: boolean;
  loadReports: () => void;
  getPrevioForTomorrow: (cityId: string) => ServiceReport;
  getDiarioForToday: (cityId: string) => { report: ServiceReport; warnings: string[] };
  getHistorial: (cityId: string) => ServiceReport[];
  addAssignment: (reportId: string, data: { work_center_id: string; shift_id: string; employee_id: string; service_id: string; vehicle_id?: string }) => void;
  updateAssignmentVehicle: (reportId: string, assignmentId: string, vehicleId: string | null) => void;
  removeAssignment: (reportId: string, assignmentId: string) => void;
  setAttendance: (reportId: string, employeeId: string, status: AttendanceStatus, note?: string) => void;
  saveReport: (reportId: string) => { success: boolean; error?: string };
  deleteReport: (reportId: string) => void;
  getReportById: (id: string) => ServiceReport | undefined;
}

const ServiceReportContext = createContext<ServiceReportContextType | undefined>(undefined);

export const ServiceReportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<ServiceReport[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReports = useCallback(() => {
    if (!getToken()) { setLoading(false); return; }
    setLoading(true);
    serviceReportsApi.list()
      .then((res) => {
        setReports(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const persist = useCallback((updater: (prev: ServiceReport[]) => ServiceReport[]) => {
    setReports(updater);
  }, []);

  const syncReport = useCallback((reportId: string) => {
    if (getToken()) {
      const report = reports.find((r) => r.id === reportId);
      if (report) {
        serviceReportsApi.update(reportId, {
          assignments: report.assignments,
          attendance: report.attendance,
          status: report.status,
        }).catch(() => {});
      }
    }
  }, [reports]);

  const getPrevioForTomorrow = useCallback((cityId: string): ServiceReport => {
    const tomorrow = getTomorrowDateString();
    const existing = reports.find((r) => r.date === tomorrow && r.type === 'PREVIO' && r.city_id === cityId);
    if (existing) return existing;

    const now = new Date().toISOString();
    const newReport: ServiceReport = {
      id: crypto.randomUUID(),
      date: tomorrow,
      type: 'PREVIO',
      city_id: cityId,
      status: 'draft',
      assignments: [],
      attendance: [],
      created_at: now,
      updated_at: now,
    };
    persist((prev) => [newReport, ...prev]);
    if (getToken()) {
      serviceReportsApi.create(newReport).catch(() => {});
    }
    return newReport;
  }, [reports, persist]);

  const getDiarioForToday = useCallback((cityId: string): { report: ServiceReport; warnings: string[] } => {
    const today = getTodayDateString();
    const existing = reports.find((r) => r.date === today && r.type === 'DIARIO' && r.city_id === cityId);
    if (existing) return { report: existing, warnings: [] };

    const yesterday = getYesterdayDateString();
    const previo = reports.find((r) => r.date === yesterday && r.type === 'PREVIO' && r.city_id === cityId);
    const warnings: string[] = [];

    if (previo) {
      persist((prev) => prev.filter((r) => r.id !== previo.id));
    }

    const now = new Date().toISOString();
    const newReport: ServiceReport = {
      id: crypto.randomUUID(),
      date: today,
      type: 'DIARIO',
      city_id: cityId,
      status: 'draft',
      assignments: previo ? [...previo.assignments] : [],
      attendance: previo
        ? [...new Map(previo.assignments.map((a) => [a.employee_id, { employee_id: a.employee_id, status: 'present' as AttendanceStatus }])).values()]
        : [],
      created_at: now,
      updated_at: now,
    };

    persist((prev) => [newReport, ...prev]);
    if (getToken()) {
      serviceReportsApi.create(newReport).catch(() => {});
    }
    return { report: newReport, warnings };
  }, [reports, persist]);

  const getHistorial = useCallback((cityId: string): ServiceReport[] => {
    const today = new Date();
    today.setDate(today.getDate() - 3);
    const cutoff = getDateString(today);
    return reports.filter((r) => r.type === 'DIARIO' && r.city_id === cityId && r.date < cutoff);
  }, [reports]);

  const addAssignment = useCallback((reportId: string, data: { work_center_id: string; shift_id: string; employee_id: string; service_id: string; vehicle_id?: string }) => {
    persist((prev) =>
      prev.map((r) => {
        if (r.id !== reportId) return r;
        const newAssignment: ServiceAssignment = {
          id: crypto.randomUUID(),
          ...data,
        };
        const attendance = r.type === 'DIARIO'
          ? (r.attendance.some((a) => a.employee_id === data.employee_id)
            ? r.attendance
            : [...r.attendance, { employee_id: data.employee_id, status: 'present' as AttendanceStatus }])
          : r.attendance;
        return { ...r, assignments: [...r.assignments, newAssignment], attendance, updated_at: new Date().toISOString() };
      })
    );
    syncReport(reportId);
  }, [persist, syncReport]);

  const updateAssignmentVehicle = useCallback((reportId: string, assignmentId: string, vehicleId: string | null) => {
    persist((prev) =>
      prev.map((r) => {
        if (r.id !== reportId) return r;
        return {
          ...r,
          assignments: r.assignments.map((a) =>
            a.id === assignmentId ? { ...a, vehicle_id: vehicleId ?? undefined } : a
          ),
          updated_at: new Date().toISOString(),
        };
      })
    );
    syncReport(reportId);
  }, [persist, syncReport]);

  const removeAssignment = useCallback((reportId: string, assignmentId: string) => {
    persist((prev) =>
      prev.map((r) => {
        if (r.id !== reportId) return r;
        return { ...r, assignments: r.assignments.filter((a) => a.id !== assignmentId), updated_at: new Date().toISOString() };
      })
    );
    syncReport(reportId);
  }, [persist, syncReport]);

  const setAttendance = useCallback((reportId: string, employeeId: string, status: AttendanceStatus, note?: string) => {
    persist((prev) =>
      prev.map((r) => {
        if (r.id !== reportId) return r;
        const attendance: EmployeeAttendance[] = r.attendance.some((a) => a.employee_id === employeeId)
          ? r.attendance.map((a) => a.employee_id === employeeId ? { ...a, status, note: note ?? a.note } : a)
          : [...r.attendance, { employee_id: employeeId, status, note }];
        return { ...r, attendance, updated_at: new Date().toISOString() };
      })
    );
    syncReport(reportId);
  }, [persist, syncReport]);

  const saveReport = useCallback((reportId: string): { success: boolean; error?: string } => {
    let result: { success: boolean; error?: string } = { success: true };
    persist((prev) =>
      prev.map((r) => {
        if (r.id !== reportId) return r;
        if (r.assignments.length === 0) {
          result = { success: false, error: 'Debe haber al menos una asignación para guardar el parte.' };
          return r;
        }
        return { ...r, status: 'confirmed', updated_at: new Date().toISOString() };
      })
    );
    if (result.success && getToken()) {
      serviceReportsApi.update(reportId, { status: 'confirmed' }).catch(() => {});
    }
    return result;
  }, [persist]);

  const deleteReport = useCallback((reportId: string) => {
    persist((prev) => prev.filter((r) => r.id !== reportId));
    if (getToken()) {
      serviceReportsApi.delete(reportId).catch(() => {});
    }
  }, [persist]);

  const getReportById = useCallback((id: string) => {
    return reports.find((r) => r.id === id);
  }, [reports]);

  return (
    <ServiceReportContext.Provider
      value={{
        reports,
        loading,
        loadReports,
        getPrevioForTomorrow,
        getDiarioForToday,
        getHistorial,
        addAssignment,
        updateAssignmentVehicle,
        removeAssignment,
        setAttendance,
        saveReport,
        deleteReport,
        getReportById,
      }}
    >
      {children}
    </ServiceReportContext.Provider>
  );
};

export const useServiceReports = (): ServiceReportContextType => {
  const context = useContext(ServiceReportContext);
  if (!context) {
    throw new Error('useServiceReports must be used within a ServiceReportProvider');
  }
  return context;
};
