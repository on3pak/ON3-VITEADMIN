import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Employee, EmployeeOverview, VacationRequest } from '../types';
import { employeesApi, vacationsApi } from '../api/services';
import { getToken } from '../api/client';

interface EmployeeContextType {
  employees: Employee[];
  loading: boolean;
  loadEmployees: () => void;
  getEmployeeOverviews: () => EmployeeOverview[];
  getEmployeeById: (id: string) => Employee | undefined;
  getNextEmployeeId: () => string;
  createEmployee: (data: Omit<Employee, 'id' | 'created_at' | 'updated_at'>, employeeId?: string) => Promise<{ success: boolean }>;
  createEmployeeWizard: (form: FormData) => Promise<{ success: boolean }>;
  updateEmployee: (id: string, data: Partial<Employee>) => Promise<{ success: boolean }>;
  deleteEmployee: (id: string) => Promise<void>;
  vacationRequests: VacationRequest[];
  createVacationRequest: (data: Omit<VacationRequest, 'id' | 'created_at' | 'resolved_at'>) => Promise<{ success: boolean }>;
  resolveVacationRequest: (id: string, status: 'approved' | 'rejected') => Promise<void>;
  getVacationRequestsByEmployee: (employeeId: string) => VacationRequest[];
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const EmployeeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [vacationRequests, setVacationRequests] = useState<VacationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEmployees = useCallback(() => {
    if (!getToken()) { setLoading(false); return; }
    setLoading(true);
    Promise.all([
      employeesApi.list().then((res) => setEmployees(res.data)),
      vacationsApi.list().then((res) => setVacationRequests(res.data)),
    ])
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadEmployees(); }, [loadEmployees]);

  const getEmployeeOverviews = useCallback(() => {
    return employees.map((emp) => ({
      id: emp.id,
      email: emp.email,
      name: emp.name,
      last_name1: emp.last_name1,
      last_name2: emp.last_name2,
      category_id: emp.category_id,
      work_day_id: emp.work_day_id,
      work_center_id: emp.work_center_id,
      status_id: emp.status_id,
      status_name: '',
      city_id: emp.city_id,
    }));
  }, [employees]);

  const getEmployeeById = useCallback((id: string) => {
    return employees.find((emp) => emp.id === id);
  }, [employees]);

  const getNextEmployeeId = useCallback(() => {
    if (employees.length === 0) return '000001';
    const nums = employees
      .map((e) => parseInt(e.id, 10))
      .filter((n) => !isNaN(n))
      .sort((a, b) => a - b);
    if (nums.length === 0) return '000001';
    for (let i = 0; i < nums.length; i++) {
      if (nums[i] !== i + 1) return String(i + 1).padStart(6, '0');
    }
    return String(nums.length + 1).padStart(6, '0');
  }, [employees]);

  const createEmployee = useCallback(async (
    data: Omit<Employee, 'id' | 'created_at' | 'updated_at'>,
    employeeId?: string
  ) => {
    try {
      const created = await employeesApi.create(data);
      setEmployees((prev) => [created, ...prev]);
      return { success: true };
    } catch {
      return { success: false };
    }
  }, []);

  const createEmployeeWizard = useCallback(async (form: FormData) => {
    try {
      const result = await employeesApi.wizard(form);
      if (result.id) {
        const created = await employeesApi.getById(result.id);
        setEmployees((prev) => [created, ...prev]);
      }
      return { success: true };
    } catch {
      return { success: false };
    }
  }, []);

  const updateEmployee = useCallback(async (id: string, data: Partial<Employee>) => {
    try {
      const updated = await employeesApi.update(id, data);
      setEmployees((prev) => prev.map((emp) => emp.id === id ? updated : emp));
      return { success: true };
    } catch {
      return { success: false };
    }
  }, []);

  const deleteEmployee = useCallback(async (id: string) => {
    try {
      await employeesApi.delete(id);
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    } catch { /* ignore */ }
  }, []);

  const createVacationRequest = useCallback(async (data: Omit<VacationRequest, 'id' | 'created_at' | 'resolved_at'>) => {
    try {
      const created = await vacationsApi.create(data);
      setVacationRequests((prev) => [...prev, created]);
      return { success: true };
    } catch {
      return { success: false };
    }
  }, []);

  const resolveVacationRequest = useCallback(async (id: string, status: 'approved' | 'rejected') => {
    try {
      const updated = await vacationsApi.update(id, { status });
      setVacationRequests((prev) =>
        prev.map((req) => req.id === id ? updated : req)
      );
    } catch { /* ignore */ }
  }, []);

  const getVacationRequestsByEmployee = useCallback((employeeId: string) => {
    return vacationRequests.filter((req) => req.employee_id === employeeId);
  }, [vacationRequests]);

  return (
      <EmployeeContext.Provider
        value={{
          employees, loading, loadEmployees, getEmployeeOverviews, getEmployeeById, getNextEmployeeId,
          createEmployee, createEmployeeWizard, updateEmployee, deleteEmployee,
          vacationRequests, createVacationRequest, resolveVacationRequest, getVacationRequestsByEmployee,
        }}
      >
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployees = (): EmployeeContextType => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployees must be used within an EmployeeProvider');
  }
  return context;
};
