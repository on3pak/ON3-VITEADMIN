import React, { useState } from 'react';
import { useEmployees } from '../../context/EmployeeContext';
import { useAuth } from '../../context/AuthContext';
import { EmployeeOverview } from '../../types';
import {
  Search,
  UserPlus,
  Edit3,
  Trash2,
  Filter,
  ShieldAlert,
  Mail,
  Phone
} from 'lucide-react';

export const EmployeesView: React.FC = () => {
  const { getEmployeeOverviews } = useEmployees();
  const { user: loggedInUser } = useAuth();

  const employeeOverviews = getEmployeeOverviews();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredEmployees = employeeOverviews.filter((emp) => {
    const fullName = `${emp.name} ${emp.lastName1} ${emp.lastName2}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.lastName1.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || emp.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Activo': return 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-600/10';
      case 'Inactivo': return 'bg-slate-100 text-slate-600 ring-1 ring-slate-600/10';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const isReadOnlyOperator = loggedInUser?.role === 'USER';

  return (
    <div className="space-y-5">

      {isReadOnlyOperator && (
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-3 font-medium">
          <ShieldAlert className="h-4 w-4 text-amber-600 flex-shrink-0" />
          <span>
            ⚠️ <span className="font-bold">Modo de Consulta Activo:</span> Has iniciado sesión como <span className="font-mono bg-amber-100 px-1 py-0.5 rounded text-amber-800">USER</span>. Puedes navegar y filtrar los datos de la grilla, pero cualquier intento de creación, edición o borrado será bloqueado por las directivas de seguridad RBAC de ON3ADMIN.
          </span>
        </div>
      )}

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 md:space-y-0 md:flex md:items-center md:justify-between gap-4">

        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre o apellidos..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm placeholder-slate-400 text-slate-800 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">Todos los Estados</option>
              <option value="Activo">Activos</option>
              <option value="Inactivo">Inactivos</option>
            </select>
          </div>

          <button
            onClick={() => alert('Crear empleado - No implementado')}
            disabled={isReadOnlyOperator}
            className={`flex items-center gap-1.5 px-4 py-2 text-white font-semibold text-xs rounded-xl shadow-xs transition-all ml-2 ${
              isReadOnlyOperator
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            <UserPlus className="h-4 w-4" />
            <span>Crear Empleado</span>
          </button>
        </div>

      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                <th className="py-3 px-6">Empleado</th>
                <th className="py-3 px-4 text-right">Categoría</th>
                <th className="py-3 px-4 text-right">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400 font-medium">
                    No se encontraron empleados que coincidan con los criterios de búsqueda o filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-100 border flex items-center justify-center">
                          <span className="text-indigo-600 font-bold text-sm">
                            {emp.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 leading-tight">
                            {emp.name} {emp.lastName1} {emp.lastName2}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            ID: {emp.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex justify-end">
                        <span className="inline-flex px-2 py-0.5 text-[10px] font-semibold rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                          {emp.category}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex justify-end">
                        <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full ${getStatusBadgeStyle(emp.status)}`}>
                          {emp.status}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex justify-end gap-1.5">
                        {!isReadOnlyOperator && (
                          <>
                            <button
                              title="Modificar registro de empleado"
                              className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg border border-transparent hover:border-amber-200 transition-colors cursor-pointer"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>

                            <button
                              title="Eliminar empleado del sistema"
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};