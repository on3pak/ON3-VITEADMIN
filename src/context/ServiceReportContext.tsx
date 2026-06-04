import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { ServiceReport, ServiceAssignment, ReportType, AttendanceStatus, EmployeeAttendance } from '../types';
import { INITIAL_SERVICE_REPORTS } from '../data/mockServiceReports';
import { generateId } from '../utils/id';

const STORAGE_KEY = 'on3_mock_service_reports';

function loadReports(): ServiceReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return INITIAL_SERVICE_REPORTS;
}

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
  getPrevioForTomorrow: (cityId: string) => ServiceReport;
  getDiarioForToday: (cityId: string) => { report: ServiceReport; warnings: string[] };
  getHistorial: (cityId: string) => ServiceReport[];
  addAssignment: (reportId: string, data: { work_center_id: string; shift_id: string; employee_id: string; service_id: string }) => void;
  removeAssignment: (reportId: string, assignmentId: string) => void;
  setAttendance: (reportId: string, employeeId: string, status: AttendanceStatus, note?: string) => void;
  saveReport: (reportId: string) => { success: boolean; error?: string };
  deleteReport: (reportId: string) => void;
  getReportById: (id: string) => ServiceReport | undefined;
}

const ServiceReportContext = createContext<ServiceReportContextType | undefined>(undefined);

export const ServiceReportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<ServiceReport[]>(loadReports);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  }, [reports]);

  const persist = useCallback((updater: (prev: ServiceReport[]) => ServiceReport[]) => {
    setReports(updater);
  }, []);

  const getPrevioForTomorrow = useCallback((cityId: string): ServiceReport => {
    const tomorrow = getTomorrowDateString();
    const existing = reports.find((r) => r.date === tomorrow && r.type === 'PREVIO' && r.city_id === cityId);
    if (existing) return existing;

    const now = new Date().toISOString();
    const newReport: ServiceReport = {
      id: generateId('sr'),
      date: tomorrow,
      type: 'PREVIO',
      city_id: cityId,
      status: 'DRAFT',
      assignments: [],
      attendance: [],
      created_at: now,
      updated_at: now,
    };
    persist((prev) => [newReport, ...prev]);
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
      id: generateId('sr'),
      date: today,
      type: 'DIARIO',
      city_id: cityId,
      status: 'DRAFT',
      assignments: previo ? [...previo.assignments] : [],
      attendance: previo
        ? [...new Map(previo.assignments.map((a) => [a.employee_id, { employee_id: a.employee_id, status: 'PRESENT' as AttendanceStatus }])).values()]
        : [],
      created_at: now,
      updated_at: now,
    };

    persist((prev) => [newReport, ...prev]);
    return { report: newReport, warnings };
  }, [reports, persist]);

  const getHistorial = useCallback((cityId: string): ServiceReport[] => {
    const today = new Date();
    today.setDate(today.getDate() - 3);
    const cutoff = getDateString(today);
    return reports.filter((r) => r.type === 'DIARIO' && r.city_id === cityId && r.date < cutoff);
  }, [reports]);

  const addAssignment = useCallback((reportId: string, data: { work_center_id: string; shift_id: string; employee_id: string; service_id: string }) => {
    persist((prev) =>
      prev.map((r) => {
        if (r.id !== reportId) return r;
        const newAssignment: ServiceAssignment = {
          id: generateId('sa'),
          ...data,
        };
        const attendance = r.type === 'DIARIO'
          ? (r.attendance.some((a) => a.employee_id === data.employee_id)
            ? r.attendance
            : [...r.attendance, { employee_id: data.employee_id, status: 'PRESENT' as AttendanceStatus }])
          : r.attendance;
        return { ...r, assignments: [...r.assignments, newAssignment], attendance, updated_at: new Date().toISOString() };
      })
    );
  }, [persist]);

  const removeAssignment = useCallback((reportId: string, assignmentId: string) => {
    persist((prev) =>
      prev.map((r) => {
        if (r.id !== reportId) return r;
        return { ...r, assignments: r.assignments.filter((a) => a.id !== assignmentId), updated_at: new Date().toISOString() };
      })
    );
  }, [persist]);

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
  }, [persist]);

  const saveReport = useCallback((reportId: string): { success: boolean; error?: string } => {
    let result: { success: boolean; error?: string } = { success: true };
    persist((prev) =>
      prev.map((r) => {
        if (r.id !== reportId) return r;
        if (r.assignments.length === 0) {
          result = { success: false, error: 'Debe haber al menos una asignación para guardar el parte.' };
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

  const getReportById = useCallback((id: string) => {
    return reports.find((r) => r.id === id);
  }, [reports]);

  return (
    <ServiceReportContext.Provider
      value={{
        reports,
        getPrevioForTomorrow,
        getDiarioForToday,
        getHistorial,
        addAssignment,
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
