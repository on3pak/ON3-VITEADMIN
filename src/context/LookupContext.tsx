import React, { createContext, useContext, useMemo } from 'react';
import { useLookups } from '../hooks/useLookups';
import type { AllLookups } from '../api/services/lookups';
import {
  INITIAL_CITIES,
  INITIAL_EMPLOYEE_CATEGORIES,
  INITIAL_EMPLOYEE_STATUSES,
  INITIAL_SHIFTS,
  INITIAL_WORK_DAYS,
  INITIAL_CONTRACT_TYPES,
} from '../data/mockEmployees';
import { INITIAL_WORK_CENTERS } from '../data/mockWorkCenters';

interface LookupContextProps {
  lookups: AllLookups | null;
  loading: boolean;
  refresh: () => Promise<void>;
  cities: Array<{ id: string; name: string }>;
  workCenters: Array<{ id: string; name: string; city_id: string }>;
  employeeCategories: Array<{ id: string; name: string }>;
  employeeStatuses: Array<{ id: string; name: string }>;
  shifts: Array<{ id: string; name: string }>;
  workDays: Array<{ id: string; name: string }>;
  contractTypes: Array<{ id: string; name: string }>;
  cityMap: Record<string, string>;
  workCenterMap: Record<string, string>;
  categoryMap: Record<string, string>;
  statusMap: Record<string, string>;
  shiftMap: Record<string, string>;
  workDayMap: Record<string, string>;
  contractTypeMap: Record<string, string>;
  resolveCity: (id: string) => string;
  resolveWorkCenter: (id: string) => string;
  resolveCategory: (id: string) => string;
  resolveStatus: (id: string) => string;
  resolveShift: (id: string) => string;
  resolveWorkDay: (id: string) => string;
  resolveContractType: (id: string) => string;
}

const LookupContext = createContext<LookupContextProps | undefined>(undefined);

export const LookupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { lookups, loading, refresh } = useLookups();

  const cities = lookups?.cities ?? INITIAL_CITIES;
  const workCenters = lookups?.work_centers ?? INITIAL_WORK_CENTERS;
  const employeeCategories = lookups?.employee_categories ?? INITIAL_EMPLOYEE_CATEGORIES;
  const employeeStatuses = lookups?.employee_statuses ?? INITIAL_EMPLOYEE_STATUSES;
  const shifts = lookups?.shifts ?? INITIAL_SHIFTS;
  const workDays = lookups?.work_days ?? INITIAL_WORK_DAYS;
  const contractTypes = lookups?.contract_types ?? INITIAL_CONTRACT_TYPES;

  const { cityMap, workCenterMap, categoryMap, statusMap, shiftMap, workDayMap, contractTypeMap } = useMemo(() => ({
    cityMap: Object.fromEntries(cities.map(c => [c.id, c.name])),
    workCenterMap: Object.fromEntries(workCenters.map(w => [w.id, w.name])),
    categoryMap: Object.fromEntries(employeeCategories.map(c => [c.id, c.name])),
    statusMap: Object.fromEntries(employeeStatuses.map(s => [s.id, s.name])),
    shiftMap: Object.fromEntries(shifts.map(s => [s.id, s.name])),
    workDayMap: Object.fromEntries(workDays.map(w => [w.id, w.name])),
    contractTypeMap: Object.fromEntries(contractTypes.map(c => [c.id, c.name])),
  }), [cities, workCenters, employeeCategories, employeeStatuses, shifts, workDays, contractTypes]);

  const resolveCity = (id: string) => cityMap[id] ?? id;
  const resolveWorkCenter = (id: string) => workCenterMap[id] ?? id;
  const resolveCategory = (id: string) => categoryMap[id] ?? id;
  const resolveStatus = (id: string) => statusMap[id] ?? id;
  const resolveShift = (id: string) => shiftMap[id] ?? id;
  const resolveWorkDay = (id: string) => workDayMap[id] ?? id;
  const resolveContractType = (id: string) => contractTypeMap[id] ?? id;

  return (
    <LookupContext.Provider value={{
      lookups, loading, refresh,
      cities, workCenters, employeeCategories, employeeStatuses,
      shifts, workDays, contractTypes,
      cityMap, workCenterMap, categoryMap, statusMap, shiftMap, workDayMap, contractTypeMap,
      resolveCity, resolveWorkCenter, resolveCategory, resolveStatus,
      resolveShift, resolveWorkDay, resolveContractType,
    }}>
      {children}
    </LookupContext.Provider>
  );
};

export const useLookupsContext = () => {
  const context = useContext(LookupContext);
  if (context === undefined) throw new Error('useLookupsContext must be used within a LookupProvider');
  return context;
};
