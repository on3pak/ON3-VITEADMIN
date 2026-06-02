import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Employee, EmployeeOverview, VacationRequest } from '../types';
import { INITIAL_EMPLOYEES, INITIAL_EMPLOYEE_STATUSES } from '../data/mockEmployees';
import { generateId } from '../utils/id';

interface EmployeeContextType {
  employees: Employee[];
  getEmployeeOverviews: () => EmployeeOverview[];
  getEmployeeById: (id: string) => Employee | undefined;
  createEmployee: (data: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => { success: boolean };
  updateEmployee: (id: string, data: Partial<Employee>) => { success: boolean };
  deleteEmployee: (id: string) => void;
  vacationRequests: VacationRequest[];
  createVacationRequest: (data: Omit<VacationRequest, 'id' | 'created_at' | 'resolved_at'>) => { success: boolean };
  resolveVacationRequest: (id: string, status: 'APPROVED' | 'REJECTED') => void;
  getVacationRequestsByEmployee: (employeeId: string) => VacationRequest[];
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const EmployeeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [vacationRequests, setVacationRequests] = useState<VacationRequest[]>([]);

  const getEmployeeOverviews = useCallback(() => {
    return employees.map((emp) => ({
      id: emp.id,
      email: emp.email,
      name: emp.name,
      lastName1: emp.lastName1,
      lastName2: emp.lastName2,
      category_id: emp.category_id,
      work_day_id: emp.work_day_id,
      work_center_id: emp.work_center_id,
      status_id: emp.status_id,
      status_name: INITIAL_EMPLOYEE_STATUSES.find((s) => s.id === emp.status_id)?.name ?? emp.status_id,
      city_id: emp.city_id,
    }));
  }, [employees]);

  const getEmployeeById = useCallback((id: string) => {
    return employees.find((emp) => emp.id === id);
  }, [employees]);

  const createEmployee = useCallback((data: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => {
    const now = new Date().toISOString();
    const newEmployee: Employee = {
      ...data,
      id: generateId('emp'),
      created_at: now,
      updated_at: now,
    };
    setEmployees((prev) => [newEmployee, ...prev]);
    return { success: true };
  }, []);

  const updateEmployee = useCallback((id: string, data: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id ? { ...emp, ...data, updated_at: new Date().toISOString() } : emp
      )
    );
    return { success: true };
  }, []);

  const deleteEmployee = useCallback((id: string) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  }, []);

  const createVacationRequest = useCallback((data: Omit<VacationRequest, 'id' | 'created_at' | 'resolved_at'>) => {
    const newRequest: VacationRequest = {
      ...data,
      id: generateId('vrq'),
      created_at: new Date().toISOString(),
    };
    setVacationRequests((prev) => [...prev, newRequest]);
    return { success: true };
  }, []);

  const resolveVacationRequest = useCallback((id: string, status: 'APPROVED' | 'REJECTED') => {
    setVacationRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status, resolved_at: new Date().toISOString() } : req
      )
    );
  }, []);

  const getVacationRequestsByEmployee = useCallback((employeeId: string) => {
    return vacationRequests.filter((req) => req.employee_id === employeeId);
  }, [vacationRequests]);

  return (
    <EmployeeContext.Provider
      value={{
        employees, getEmployeeOverviews, getEmployeeById,
        createEmployee, updateEmployee, deleteEmployee,
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
