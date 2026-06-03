import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Employee, EmployeeOverview } from '../types';
import { INITIAL_EMPLOYEES } from '../data/mockEmployees';
import { generateId } from '../utils/id';

interface EmployeeContextType {
  employees: Employee[];
  getEmployeeOverviews: () => EmployeeOverview[];
  getEmployeeById: (id: string) => Employee | undefined;
  createEmployee: (data: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => { success: boolean };
  updateEmployee: (id: string, data: Partial<Employee>) => { success: boolean };
  deleteEmployee: (id: string) => void;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const EmployeeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);

  const getEmployeeOverviews = useCallback(() => {
    return employees.map((emp) => ({
      id: emp.id,
      email: emp.email,
      name: emp.name,
      last_name1: emp.last_name1,
      last_name2: emp.last_name2,
      category_id: emp.category_id,
      work_day_id: emp.work_day,
      work_center_id: emp.work_center_id,
      status_id: emp.status_id,
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

  return (
    <EmployeeContext.Provider
      value={{ employees, getEmployeeOverviews, getEmployeeById, createEmployee, updateEmployee, deleteEmployee }}
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
