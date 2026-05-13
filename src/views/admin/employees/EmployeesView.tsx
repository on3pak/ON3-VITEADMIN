import React, { useState, useMemo, useEffect, useId } from 'react';
import { useEmployees } from '../../../context/EmployeeContext';
import { useAuth } from '../../../context/AuthContext';
import { INITIAL_EMPLOYEE_CATEGORIES, INITIAL_EMPLOYEE_STATUSES } from '../../../data/mockEmployees';
import { INITIAL_WORK_CENTERS } from '../../../data/mockWorkCenters';
import { EmployeeFormModal } from '../../../components/modals/EmployeeFormModal';
import { ConfirmDialog } from '../../../components/modals/ConfirmDialog';
import { EmployeeCategory } from '../../../types';
import {
  Search, UserPlus, Edit3, Trash2, Filter, ShieldAlert, Mail, Eye,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, User, Tags, X,
} from 'lucide-react';

const STATUS_STYLES: Record<string, string> = {
  'es-1': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'es-2': 'bg-amber-100 text-amber-800 border-amber-200',
  'es-3': 'bg-rose-100 text-rose-800 border-rose-200',
  'es-4': 'bg-blue-100 text-blue-800 border-blue-200',
  'es-5': 'bg-cyan-100 text-cyan-800 border-cyan-200',
  'es-6': 'bg-violet-100 text-violet-800 border-violet-200',
};

const CATEGORY_COLORS: Record<string, string> = {
  'ec-1': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'ec-2': 'bg-purple-100 text-purple-700 border-purple-200',
  'ec-3': 'bg-violet-100 text-violet-700 border-violet-200',
  'ec-4': 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
  'ec-5': 'bg-cyan-100 text-cyan-700 border-cyan-200',
  'ec-6': 'bg-teal-100 text-teal-700 border-teal-200',
  'ec-7': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'ec-8': 'bg-amber-100 text-amber-700 border-amber-200',
  'ec-9': 'bg-orange-100 text-orange-700 border-orange-200',
  'ec-10': 'bg-slate-100 text-slate-700 border-slate-200',
};

const getInitials = (name: string, last1: string) => {
  const n = (name?.[0] || '') + (last1?.[0] || '');
  return n.toUpperCase() || '?';
};

export const EmployeesView: React.FC<{ onViewEmployee?: (id: string) => void }> = ({ onViewEmployee }) => {
  const { getEmployeeOverviews, getEmployeeById, createEmployee, updateEmployee, deleteEmployee } = useEmployees();
  const { user: loggedInUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [workCenterFilter, setWorkCenterFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingEmployeeId, setDeletingEmployeeId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'employees' | 'categories'>('employees');

  const [categories, setCategories] = useState<EmployeeCategory[]>(INITIAL_EMPLOYEE_CATEGORIES);
  const [categorySearch, setCategorySearch] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<EmployeeCategory | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryPage, setCategoryPage] = useState(1);
  const [categoryItemsPerPage, setCategoryItemsPerPage] = useState(10);
  const [categoryDeleteTarget, setCategoryDeleteTarget] = useState<EmployeeCategory | null>(null);
  const catDialogId = useId();

  const handleCreate = () => { setModalMode('create'); setSelectedEmployeeId(null); setModalOpen(true); };
  const handleEdit = (id: string) => { setModalMode('edit'); setSelectedEmployeeId(id); setModalOpen(true); };
  const handleDelete = (id: string) => { setDeletingEmployeeId(id); setDeleteDialogOpen(true); };
  const handleConfirmDelete = () => { if (deletingEmployeeId) { deleteEmployee(deletingEmployeeId); } setDeleteDialogOpen(false); setDeletingEmployeeId(null); };

  const openCategoryModal = (cat?: EmployeeCategory) => {
    setEditingCategory(cat ?? null);
    setCategoryName(cat?.name ?? '');
    setCategoryModalOpen(true);
  };
  const saveCategory = () => {
    const name = categoryName.trim();
    if (!name) return;
    if (editingCategory) {
      setCategories((prev) => prev.map((c) => c.id === editingCategory.id ? { ...c, name } : c));
    } else {
      const newId = `ec-${Date.now()}`;
      setCategories((prev) => [...prev, { id: newId, name }]);
    }
    setCategoryModalOpen(false);
    setEditingCategory(null);
    setCategoryName('');
  };
  const filteredCategories = useMemo(() => {
    const q = categorySearch.toLowerCase();
    return q ? categories.filter((c) => c.name.toLowerCase().includes(q)) : categories;
  }, [categories, categorySearch]);
  const catTotalPages = Math.ceil(filteredCategories.length / categoryItemsPerPage);
  const paginatedCategories = useMemo(
    () => filteredCategories.slice((categoryPage - 1) * categoryItemsPerPage, categoryPage * categoryItemsPerPage),
    [filteredCategories, categoryPage, categoryItemsPerPage]
  );
  useEffect(() => setCategoryPage(1), [categorySearch, categoryItemsPerPage]);

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

  const userCityId = loggedInUser?.role === 'ROOT' ? undefined : loggedInUser?.cityId;

  const scopeWorkCenters = useMemo(
    () => userCityId ? INITIAL_WORK_CENTERS.filter((wc) => wc.cityId === userCityId) : INITIAL_WORK_CENTERS,
    [userCityId]
  );

  const filteredEmployees = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return employeeOverviews.filter((emp) => {
      const matchesCityScope = !userCityId || emp.city_id === userCityId;
      if (!matchesCityScope) return false;

      const name = `${emp.name} ${emp.lastName1} ${emp.lastName2}`.toLowerCase();
      const matchesSearch = !q || name.includes(q) || emp.name.toLowerCase().includes(q) || emp.lastName1.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'ALL' || emp.status_id === statusFilter;
      const matchesWorkCenter = workCenterFilter === 'ALL' || emp.work_center_id === workCenterFilter;
      return matchesSearch && matchesStatus && matchesWorkCenter;
    });
  }, [employeeOverviews, searchQuery, statusFilter, workCenterFilter, userCityId]);

  useEffect(() => setCurrentPage(1), [searchQuery, statusFilter, workCenterFilter, itemsPerPage]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const resolveCategory = (id: string) => INITIAL_EMPLOYEE_CATEGORIES.find((c) => c.id === id)?.name ?? id;
  const resolveStatus = (id: string) => INITIAL_EMPLOYEE_STATUSES.find((s) => s.id === id)?.name ?? id;
  const getBadgeStyle = (id: string) => STATUS_STYLES[id] ?? 'bg-slate-100 text-slate-800 border-slate-200';
  const getCategoryBadgeStyle = (id: string) => CATEGORY_COLORS[id] ?? 'bg-slate-100 text-slate-800 border-slate-200';

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

      <div className="flex gap-1.5 bg-slate-100 rounded-xl p-1">
        <button
          onClick={() => setActiveTab('employees')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'employees'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <User className="h-4 w-4" />
          Empleados
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'categories'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Tags className="h-4 w-4" />
          Categorías
        </button>
      </div>

      {activeTab === 'employees' && (
        <>
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        <div className="relative flex-1">
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

        <div className="flex flex-wrap items-center gap-2.5 lg:hidden">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">Todos</option>
              {INITIAL_EMPLOYEE_STATUSES.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <select
              value={workCenterFilter}
              onChange={(e) => setWorkCenterFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">Todos</option>
              {scopeWorkCenters.map((w) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleCreate}
            disabled={isReadOnly}
            className={`flex items-center gap-1.5 px-4 py-2 text-white font-semibold text-xs rounded-xl shadow-xs ${isReadOnly ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            <UserPlus className="h-4 w-4" />
            <span>Crear</span>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2.5">
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

      <div className="flex gap-5">
        <div className="flex-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                    <th className="py-3 px-6">Identidad / Empleado</th>
                    <th className="py-3 px-4 w-28 text-center">Categoría</th>
                    <th className="py-3 px-4 w-20 text-center">Estado</th>
                    <th className="py-3 px-4 w-24 text-center">Acciones</th>
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
                      <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-sm shadow-indigo-500/20 relative overflow-hidden">
                              <User className="w-8 h-8 text-black/50 absolute" />
                              <span className="text-white font-bold text-sm relative z-10">{getInitials(emp.name, emp.lastName1)}</span>
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 leading-tight">{emp.name} {emp.lastName1} {emp.lastName2}</div>
                              <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                <span className="font-mono text-indigo-600 font-semibold">ID: {emp.id}</span>
                                <span>•</span>
                                <Mail className="h-3 w-3 text-slate-300 inline" />
                                <span className="truncate max-w-[140px]">{emp.email || 'sin email'}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex justify-center">
                            <span className={`inline-flex px-2 py-0.5 text-[10px] font-semibold rounded-md border text-center ${getCategoryBadgeStyle(emp.category_id)}`}>
                              {resolveCategory(emp.category_id)}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex justify-center">
                            <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full border text-center ${getBadgeStyle(emp.status_id)}`}>
                              {resolveStatus(emp.status_id)}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex justify-end gap-1.5">
                            <button onClick={() => onViewEmployee?.(emp.id)} className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg" title="Ver detalles"><Eye className="h-4 w-4" /></button>
                            {!isReadOnly && (
                              <>
                                <button onClick={() => handleEdit(emp.id)} className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg"><Edit3 className="h-4 w-4" /></button>
                                <button onClick={() => handleDelete(emp.id)} className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 className="h-4 w-4" /></button>
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
          </div>
        </div>

        <div className="hidden lg:flex lg:flex-col lg:w-64 flex-shrink-0 lg:space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Centros de Trabajo</h3>
            <div className="space-y-1">
              <button
                onClick={() => setWorkCenterFilter('ALL')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  workCenterFilter === 'ALL'
                    ? 'bg-indigo-100 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Todos los Centros
              </button>
              {scopeWorkCenters.map((wc) => (
                <button
                  key={wc.id}
                  onClick={() => setWorkCenterFilter(wc.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    workCenterFilter === wc.id
                      ? 'bg-indigo-100 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {wc.name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Estado</h3>
            <div className="space-y-1">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  statusFilter === 'ALL'
                    ? 'bg-indigo-100 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Todos los Estados
              </button>
              {INITIAL_EMPLOYEE_STATUSES.map((es) => (
                <button
                  key={es.id}
                  onClick={() => setStatusFilter(es.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    statusFilter === es.id
                      ? 'bg-indigo-100 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {es.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <EmployeeFormModal
        isOpen={modalOpen && modalMode !== 'view'}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        editingEmployee={selectedEmployee}
      />

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Eliminar Empleado"
        message="¿Estás seguro de eliminar este empleado? Esta acción no se puede deshacer."
        onConfirm={handleConfirmDelete}
        onCancel={() => { setDeleteDialogOpen(false); setDeletingEmployeeId(null); }}
      />
      </>
      )}

      {activeTab === 'categories' && (
        <div className="space-y-5">
          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 sm:gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                placeholder="Buscar categorías..."
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm placeholder-slate-400 text-slate-800 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <button
              onClick={() => openCategoryModal()}
              disabled={isReadOnly}
              className={`flex items-center gap-1.5 px-4 py-2 text-white font-semibold text-xs rounded-xl shadow-xs ${isReadOnly ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              <Tags className="h-4 w-4" />
              <span>Crear Categoría</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                    <th className="py-3 px-6">Nombre</th>
                    <th className="py-3 px-4 w-24 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                  {paginatedCategories.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="py-12 text-center text-slate-400 font-medium">
                        No se encontraron categorías.
                      </td>
                    </tr>
                  ) : (
                    paginatedCategories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
                              <Tags className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 leading-tight">{cat.name}</div>
                              <div className="text-xs text-slate-400 font-mono">{cat.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex justify-center gap-1.5">
                            <button
                              onClick={() => openCategoryModal(cat)}
                              disabled={isReadOnly}
                              className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
                              title="Editar categoría"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setCategoryDeleteTarget(cat)}
                              disabled={isReadOnly}
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                              title="Eliminar categoría"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="bg-white px-4 py-3 rounded-b-2xl border-x border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Mostrar</span>
                <select
                  value={categoryItemsPerPage}
                  onChange={(e) => { setCategoryItemsPerPage(Number(e.target.value)); setCategoryPage(1); }}
                  className="border border-slate-200 rounded-lg px-2 py-1 text-slate-700 focus:outline-hidden focus:border-indigo-500"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span>por página</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-500 mr-2">Página {catTotalPages > 0 ? categoryPage : 0} de {catTotalPages}</span>
                <button onClick={() => setCategoryPage(1)} disabled={categoryPage === 1 || catTotalPages === 0} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-40"><ChevronsLeft className="h-4 w-4" /></button>
                <button onClick={() => setCategoryPage((p) => Math.max(1, p - 1))} disabled={categoryPage === 1 || catTotalPages === 0} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
                <button onClick={() => setCategoryPage((p) => Math.min(catTotalPages, p + 1))} disabled={categoryPage === catTotalPages || catTotalPages === 0} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
                <button onClick={() => setCategoryPage(catTotalPages)} disabled={categoryPage === catTotalPages || catTotalPages === 0} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-40"><ChevronsRight className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        </div>
      )}

      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setCategoryModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">
                {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
              </h2>
              <button onClick={() => setCategoryModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Nombre</label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Nombre de la categoría"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-slate-800"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setCategoryModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                  Cancelar
                </button>
                <button onClick={saveCategory} className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors">
                  {editingCategory ? 'Guardar' : 'Crear'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {categoryDeleteTarget && (
        <ConfirmDialog
          key={catDialogId}
          isOpen={true}
          title="Eliminar Categoría"
          message={`¿Estás seguro de eliminar la categoría "${categoryDeleteTarget.name}"? Esta acción no se puede deshacer.`}
          onConfirm={() => {
            setCategories((prev) => prev.filter((c) => c.id !== categoryDeleteTarget.id));
            setCategoryDeleteTarget(null);
          }}
          onCancel={() => setCategoryDeleteTarget(null)}
        />
      )}
    </div>
  );
};