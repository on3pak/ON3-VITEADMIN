import React, { useState, useMemo, useEffect } from 'react';
import { useEmployees } from '../../context/EmployeeContext';
import { useAuth } from '../../context/AuthContext';
import { INITIAL_EMPLOYEE_CATEGORIES, INITIAL_EMPLOYEE_STATUSES } from '../../data/mockEmployees';
import { EmployeeFormModal } from '../../components/EmployeeFormModal';
import {
  Search, UserPlus, Edit3, Trash2, Filter, ShieldAlert,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
} from 'lucide-react';

const STATUS_STYLES: Record<string, string> = {
  'es-1': 'bg-emerald-100 text-emerald-800',
  'es-2': 'bg-amber-100 text-amber-800',
  'es-3': 'bg-rose-100 text-rose-800',
  'es-4': 'bg-blue-100 text-blue-800',
  'es-5': 'bg-cyan-100 text-cyan-800',
  'es-6': 'bg-violet-100 text-violet-800',
};

export const EmployeesView: React.FC = () => {
  const { getEmployeeOverviews, getEmployeeById, createEmployee, updateEmployee, deleteEmployee } = useEmployees();
  const { user: loggedInUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  const handleCreate = () => { setModalMode('create'); setSelectedEmployeeId(null); setModalOpen(true); };
  const handleEdit = (id: string) => { setModalMode('edit'); setSelectedEmployeeId(id); setModalOpen(true); };
  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar empleado?')) {
      deleteEmployee(id);
    }
  };

  const handleModalSubmit = (data: Omit<import('../../types').Employee, 'id' | 'created_at' | 'updated_at'>) => {
    if (modalMode === 'edit' && selectedEmployeeId) {
      updateEmployee(selectedEmployeeId, data);
    } else {
      createEmployee(data);
    }
    setModalOpen(false);
    return true;
  };

  const selectedEmployee = modalMode === 'edit' && selectedEmployeeId ? getEmployeeById(selectedEmployeeId) : undefined;
  const employeeOverviews = getEmployeeOverviews();

  const filteredEmployees = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return employeeOverviews.filter((emp) => {
      const name = `${emp.name} ${emp.lastName1} ${emp.lastName2}`.toLowerCase();
      const matchesSearch = !q || name.includes(q) || emp.name.toLowerCase().includes(q) || emp.lastName1.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'ALL' || emp.status_id === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [employeeOverviews, searchQuery, statusFilter]);

  useEffect(() => setCurrentPage(1), [searchQuery, statusFilter, itemsPerPage]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const resolveCategory = (id: string) => INITIAL_EMPLOYEE_CATEGORIES.find((c) => c.id === id)?.name ?? id;
  const resolveStatus = (id: string) => INITIAL_EMPLOYEE_STATUSES.find((s) => s.id === id)?.name ?? id;
  const getBadgeStyle = (id: string) => STATUS_STYLES[id] ?? 'bg-slate-100 text-slate-800';

  const isReadOnly = loggedInUser?.role === 'USER';

  return (
    <div className="space-y-5">
      {isReadOnly && (
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-3 font-medium">
          <ShieldAlert className="h-4 w-4 text-amber-600 flex-shrink-0" />
          <span>
            ⚠️ <span className="font-bold">Modo de Consulta:</span> Has iniciado sesión como <span className="font-mono bg-amber-100 px-1 py-0.5 rounded text-amber-800">{loggedInUser?.role}</span>. Cualquier intento de creación, edición o borrado será bloqueado.
          </span>
        </div>
      )}

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre o apellidos..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm placeholder-slate-400 text-slate-800 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">Todos los Estados</option>
              {INITIAL_EMPLOYEE_STATUSES.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleCreate}
            disabled={isReadOnly}
            className={`flex items-center gap-1.5 px-4 py-2 text-white font-semibold text-xs rounded-xl shadow-xs ${isReadOnly ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
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
              {paginatedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400 font-medium">
                    No se encontraron empleados.
                  </td>
                </tr>
              ) : (
                paginatedEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-600 font-bold text-sm">{emp.name.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{emp.name} {emp.lastName1} {emp.lastName2}</div>
                          <div className="text-xs text-slate-400">ID: {emp.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex px-2 py-0.5 text-[10px] font-semibold rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                        {resolveCategory(emp.category_id)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full ${getBadgeStyle(emp.status_id)}`}>
                        {resolveStatus(emp.status_id)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {!isReadOnly && (
                        <div className="flex justify-end gap-1.5">
                          <button onClick={() => handleEdit(emp.id)} className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg"><Edit3 className="h-4 w-4" /></button>
                          <button onClick={() => handleDelete(emp.id)} className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white px-4 py-3 rounded-b-2xl border-x border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Mostrar</span>
          <select
            value={itemsPerPage}
            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            className="border border-slate-200 rounded-lg px-2 py-1 text-slate-700 focus:outline-hidden focus:border-indigo-500"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>por página</span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-xs text-slate-500 mr-2">Página {totalPages > 0 ? currentPage : 0} de {totalPages}</span>
          <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1 || totalPages === 0} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-40"><ChevronsLeft className="h-4 w-4" /></button>
          <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1 || totalPages === 0} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
          <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
          <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages || totalPages === 0} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-40"><ChevronsRight className="h-4 w-4" /></button>
        </div>
      </div>

      <EmployeeFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        editingEmployee={selectedEmployee}
      />
    </div>
  );
};