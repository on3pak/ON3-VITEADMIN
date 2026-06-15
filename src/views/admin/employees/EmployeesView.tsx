import React, { useState, useMemo, useEffect, useId } from 'react';
import { employeesApi } from '../../../api/services';
import { useEmployees } from '../../../context/EmployeeContext';
import { useAuth } from '../../../context/AuthContext';
import {
  INITIAL_EMPLOYEE_CATEGORIES, INITIAL_EMPLOYEE_STATUSES,
  INITIAL_WORK_DAYS, INITIAL_SHIFTS, INITIAL_CONTRACT_TYPES,
} from '../../../data/mockEmployees';
import { INITIAL_WORK_CENTERS } from '../../../data/mockWorkCenters';
import { EmployeeFormModal } from '../../../components/modals/EmployeeFormModal';
import { ConfirmDialog } from '../../../components/modals/ConfirmDialog';
import { EmployeeCategory, EmployeeStatus, WorkDay, Shift, ContractType } from '../../../types';
import {
  Search, UserPlus, Edit3, Trash2, Filter, ShieldAlert, Mail, Eye,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronDown, ChevronUp, User, Tags,
  HeartPulse, CalendarDays, Clock, FileText, X,
} from 'lucide-react';
import { TableSkeleton } from '../../../components/ui';

const STATUS_STYLES: Record<string, string> = {
  'es_1': 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
  'es_2': 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
  'es_3': 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800',
  'es_4': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
  'es_5': 'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800',
  'es_6': 'bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800',
};

const CATEGORY_COLORS: Record<string, string> = {
  'ec_000001': 'bg-primary-100 text-primary-700 border-primary-200 dark:bg-primary-900/30 dark:text-primary-300 dark:border-primary-800',
  'ec_000002': 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
  'ec_000003': 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800',
  'ec_000004': 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200 dark:bg-fuchsia-900/30 dark:text-fuchsia-300 dark:border-fuchsia-800',
  'ec_000005': 'bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800',
  'ec_000006': 'bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800',
  'ec_000007': 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
  'ec_000008': 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
  'ec_000009': 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800',
  'ec_000010': 'bg-app-bg text-app-text border-app-border',
};

const getInitials = (name: string, last1: string) => {
  const n = (name?.[0] || '') + (last1?.[0] || '');
  return n.toUpperCase() || '?';
};

export const EmployeesView: React.FC<{ onViewEmployee?: (id: string) => void }> = ({ onViewEmployee }) => {
  const { getEmployeeOverviews, getEmployeeById, loadEmployees, loading } = useEmployees();
  const { user: loggedInUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [workCenterFilter, setWorkCenterFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ centros: false, estado: false });
  const toggleSection = (key: string) => setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingEmployeeId, setDeletingEmployeeId] = useState<string | null>(null);

  useEffect(() => { loadEmployees(); }, [loadEmployees]);

  type LookupTab = 'employees' | 'categories' | 'statuses' | 'workdays' | 'shifts' | 'contracts';
  const [activeTab, setActiveTab] = useState<LookupTab>('employees');

  type NamedEntity = { id: string; name: string };
  const useLookupState = <T extends NamedEntity>(initial: T[], prefix: string) => {
    const [items, setItems] = useState<T[]>(initial);
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<T | null>(null);
    const [name, setName] = useState('');
    const [page, setPage] = useState(1);
    const [ipp, setIpp] = useState(10);
    const [deleteTarget, setDeleteTarget] = useState<T | null>(null);
    const dialogId = useId();
    const filtered = useMemo(() => {
      const q = search.toLowerCase();
      return q ? items.filter((x) => x.name.toLowerCase().includes(q)) : items;
    }, [items, search]);
    const totalPages = Math.ceil(filtered.length / ipp);
    const paginated = useMemo(
      () => filtered.slice((page - 1) * ipp, page * ipp),
      [filtered, page, ipp]
    );
    useEffect(() => setPage(1), [search, ipp]);
    const openModal = (item?: T) => {
      setEditItem(item ?? null);
      setName(item?.name ?? '');
      setModalOpen(true);
    };
    const save = () => {
      const trimmed = name.trim();
      if (!trimmed) return;
      if (editItem) {
        setItems((prev) => prev.map((x) => x.id === editItem.id ? { ...x, name: trimmed } as T : x));
      } else {
        setItems((prev) => [...prev, { id: `${prefix}-${Date.now()}`, name: trimmed } as T]);
      }
      setModalOpen(false);
      setEditItem(null);
      setName('');
    };
    return { items: paginated, allItems: items, setItems, search, setSearch, modalOpen, setModalOpen, editItem, name, setName, page, setPage, ipp, setIpp, deleteTarget, setDeleteTarget, dialogId, filtered, totalPages, openModal, save };
  };

  const cats = useLookupState<EmployeeCategory>(INITIAL_EMPLOYEE_CATEGORIES, 'ec');
  const statuses = useLookupState<EmployeeStatus>(INITIAL_EMPLOYEE_STATUSES, 'es');
  const workDays = useLookupState<WorkDay>(INITIAL_WORK_DAYS, 'wd');
  const shifts = useLookupState<Shift>(INITIAL_SHIFTS, 's');
  const contracts = useLookupState<ContractType>(INITIAL_CONTRACT_TYPES, 'ct');

  const handleCreate = () => { setModalMode('create'); setSelectedEmployeeId(null); setModalOpen(true); };
  const createButtonConfig = useMemo(() => {
    const tabs: Record<string, { icon: React.ReactNode; label: string; action: () => void }> = {
      employees: { icon: <UserPlus className="h-4 w-4" />, label: 'Crear Empleado', action: handleCreate },
      categories: { icon: <Tags className="h-4 w-4" />, label: 'Crear Categoría', action: () => cats.openModal() },
      statuses: { icon: <HeartPulse className="h-4 w-4" />, label: 'Crear Estado', action: () => statuses.openModal() },
      workdays: { icon: <CalendarDays className="h-4 w-4" />, label: 'Crear Jornada', action: () => workDays.openModal() },
      shifts: { icon: <Clock className="h-4 w-4" />, label: 'Crear Turno', action: () => shifts.openModal() },
      contracts: { icon: <FileText className="h-4 w-4" />, label: 'Crear Contrato', action: () => contracts.openModal() },
    };
    return tabs[activeTab] ?? tabs.employees;
  }, [activeTab, cats, statuses, workDays, shifts, contracts]);
  const handleEdit = (id: string) => { setModalMode('edit'); setSelectedEmployeeId(id); setModalOpen(true); };
  const handleDelete = (id: string) => { setDeletingEmployeeId(id); setDeleteDialogOpen(true); };
  const handleConfirmDelete = async () => { if (deletingEmployeeId) { await employeesApi.delete(deletingEmployeeId); loadEmployees(); } setDeleteDialogOpen(false); setDeletingEmployeeId(null); };

  const handleModalSubmit = async (data: Omit<import('../../types').Employee, 'id' | 'created_at' | 'updated_at'>, employeeId?: string) => {
    if (modalMode === 'edit' && selectedEmployeeId) {
      await employeesApi.update(selectedEmployeeId, data);
    } else {
      await employeesApi.create(data);
    }
    loadEmployees();
    setModalOpen(false);
    return true;
  };

  const selectedEmployee = modalMode === 'edit' && selectedEmployeeId ? getEmployeeById(selectedEmployeeId) : undefined;
  const employeeOverviews = getEmployeeOverviews();

  const userCityId = loggedInUser?.role === 'root' ? undefined : loggedInUser?.city_id;

  const scopeWorkCenters = useMemo(
    () => userCityId ? INITIAL_WORK_CENTERS.filter((wc) => wc.city_id === userCityId) : INITIAL_WORK_CENTERS,
    [userCityId]
  );

  const filteredEmployees = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return employeeOverviews.filter((emp) => {
      const matchesCityScope = !userCityId || emp.city_id === userCityId;
      if (!matchesCityScope) return false;

      const name = `${emp.name} ${emp.last_name1} ${emp.last_name2}`.toLowerCase();
      const matchesSearch = !q || name.includes(q) || emp.name.toLowerCase().includes(q) || emp.last_name1.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'ALL' || emp.status_id === statusFilter;
      const matchesWorkCenter = workCenterFilter === 'ALL' || emp.work_center_id === workCenterFilter;
      return matchesSearch && matchesStatus && matchesWorkCenter;
    });
  }, [employeeOverviews, searchQuery, statusFilter, workCenterFilter, userCityId]);

  useEffect(() => setCurrentPage(1), [searchQuery, statusFilter, workCenterFilter, itemsPerPage]);
  useEffect(() => {
    cats.setPage(1);
    statuses.setPage(1);
    workDays.setPage(1);
    shifts.setPage(1);
    contracts.setPage(1);
  }, [searchQuery]);

  const { totalPages, paginatedEmployees } = useMemo(() => {
    const t = Math.ceil(filteredEmployees.length / itemsPerPage);
    const p = filteredEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    return { totalPages: t, paginatedEmployees: p };
  }, [filteredEmployees, currentPage, itemsPerPage]);

  const resolveCategory = (id: string) => INITIAL_EMPLOYEE_CATEGORIES.find((c) => c.id === id)?.name ?? id;
  const resolveStatus = (id: string) => INITIAL_EMPLOYEE_STATUSES.find((s) => s.id === id)?.name ?? id;
  const getBadgeStyle = (id: string) => STATUS_STYLES[id] ?? 'bg-app-bg text-app-text border-app-border';
  const getCategoryBadgeStyle = (id: string) => CATEGORY_COLORS[id] ?? 'bg-app-bg text-app-text border-app-border';

  const isReadOnly = loggedInUser?.role === 'user';

  const renderLookupTab = (s: ReturnType<typeof useLookupState<NamedEntity>>, icon: React.ReactNode, singular: string, plural: string) => {
    const lookupFiltered = searchQuery ? s.allItems.filter((x) => x.name.toLowerCase().includes(searchQuery.toLowerCase())) : s.allItems;
    const lookupTotalPages = Math.ceil(lookupFiltered.length / s.ipp);
    const lookupPaginated = lookupFiltered.slice((s.page - 1) * s.ipp, s.page * s.ipp);

    return (
    <div className="space-y-5">
      <div className="card-uiverse overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-app-bg border-b border-app-border text-[11px] uppercase font-bold text-app-text-secondary tracking-wider">
                <th className="py-3 px-6">Nombre</th>
                <th className="py-3 px-4 w-24 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border text-app-text text-sm">
              {lookupPaginated.length === 0 ? (
                <tr>
                  <td colSpan={2} className="py-12 text-center text-app-text-secondary font-medium">
                    No se encontraron {plural.toLowerCase()}.
                  </td>
                </tr>
              ) : (
                lookupPaginated.map((item) => (
                  <tr key={item.id} className="hover:bg-app-bg/70 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary-100 border border-primary-200 flex items-center justify-center text-primary-600 shrink-0">
                          {icon}
                        </div>
                        <div>
                          <div className="font-bold text-app-text-secondary leading-tight">{item.name}</div>
                          <div className="text-xs text-app-text-secondary font-mono">{item.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex justify-center gap-1.5">
                        <button onClick={() => s.openModal(item)} disabled={isReadOnly} className="p-1.5 text-app-text-secondary hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 dark:hover:text-amber-400 rounded-lg" title={`Editar ${singular.toLowerCase()}`}>
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button onClick={() => s.setDeleteTarget(item)} disabled={isReadOnly} className="p-1.5 text-app-text-secondary hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 dark:hover:text-rose-400 rounded-lg" title={`Eliminar ${singular.toLowerCase()}`}>
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
        <div className="bg-app-card border-t border-app-card-border flex items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2 text-sm text-app-text-secondary">
            <span>Mostrar</span>
            <select
              value={s.ipp}
              onChange={(e) => { s.setIpp(Number(e.target.value)); s.setPage(1); }}
              className="border border-app-border rounded-lg px-2.5 py-1.5 text-sm text-app-text focus:outline-hidden focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>por página</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-app-text-secondary mr-3">Página {lookupTotalPages > 0 ? s.page : 0} de {lookupTotalPages}</span>
            <button onClick={() => s.setPage(1)} disabled={s.page === 1 || lookupTotalPages === 0} className="p-1.5 rounded-lg text-app-text-secondary hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-app-text-secondary transition-colors" title="Primera página"><ChevronsLeft className="h-4 w-4" /></button>
            <button onClick={() => s.setPage((p: number) => Math.max(1, p - 1))} disabled={s.page === 1 || lookupTotalPages === 0} className="p-1.5 rounded-lg text-app-text-secondary hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-app-text-secondary transition-colors" title="Página anterior"><ChevronLeft className="h-4 w-4" /></button>
            <button onClick={() => s.setPage((p: number) => Math.min(lookupTotalPages, p + 1))} disabled={s.page === lookupTotalPages || lookupTotalPages === 0} className="p-1.5 rounded-lg text-app-text-secondary hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-app-text-secondary transition-colors" title="Página siguiente"><ChevronRight className="h-4 w-4" /></button>
            <button onClick={() => s.setPage(lookupTotalPages)} disabled={s.page === lookupTotalPages || lookupTotalPages === 0} className="p-1.5 rounded-lg text-app-text-secondary hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-app-text-secondary transition-colors" title="Última página"><ChevronsRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      {s.modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-sidebar/80" onClick={() => s.setModalOpen(false)}>
          <div className="bg-app-card rounded-2xl shadow-xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-app-text-secondary">
                {s.editItem ? `Editar ${singular}` : `Nuev${singular.endsWith('a') ? 'a' : 'o'} ${singular}`}
              </h2>
              <button onClick={() => s.setModalOpen(false)} className="p-1 text-app-text-secondary hover:text-app-text-secondary rounded-lg hover:bg-app-bg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Nombre</label>
                <input
                  type="text"
                  value={s.name}
                  onChange={(e) => s.setName(e.target.value)}
                  placeholder={`Nombre del ${singular.toLowerCase()}`}
                  className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 text-app-text"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => s.setModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-app-text-secondary bg-app-bg hover:bg-app-border rounded-xl transition-colors">
                  Cancelar
                </button>
                <button onClick={s.save} className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors">
                  {s.editItem ? 'Guardar' : 'Crear'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {s.deleteTarget && (
        <ConfirmDialog
          key={s.dialogId}
          isOpen={true}
          title={`Eliminar ${singular}`}
          message={`¿Estás seguro de eliminar "${s.deleteTarget.name}"? Esta acción no se puede deshacer.`}
          onConfirm={() => {
            s.setItems((prev: NamedEntity[]) => prev.filter((x) => x.id !== s.deleteTarget!.id));
            s.setDeleteTarget(null);
          }}
          onCancel={() => s.setDeleteTarget(null)}
        />
      )}
    </div>
  );
  };

  return (
    <div className="space-y-5">
      {isReadOnly && (
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 dark:bg-amber-900/20 dark:text-amber-200 dark:border-amber-800 flex items-center gap-3 font-medium">
          <ShieldAlert className="h-4 w-4 text-amber-600 flex-shrink-0" />
          <span>
            ⚠️ <span className="font-bold">Modo de Consulta:</span> Has iniciado sesión como <span className="font-mono bg-amber-100 px-1 py-0.5 rounded text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">{loggedInUser?.role}</span>. Cualquier intento de creación, edición o borrado será bloqueado.
          </span>
        </div>
      )}

      <div className="card-uiverse p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        <div className="relative flex-1 min-w-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-app-text-secondary">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === 'employees' ? 'Buscar por nombre o apellidos...' : `Buscar ${({categories: 'categorías', statuses: 'estados', workdays: 'jornadas', shifts: 'turnos', contracts: 'contratos'} as Record<string, string>)[activeTab] ?? '...'}`}
            className="w-full min-w-0 pl-9 pr-4 py-2 border border-app-border rounded-xl text-sm placeholder:text-app-text-secondary/50 text-app-text focus:outline-hidden focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 xl:hidden">
          <div className="flex items-center gap-1.5 bg-app-bg border border-app-border rounded-xl px-2.5 py-1.5">
            <Filter className="h-3.5 w-3.5 text-app-text-secondary" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-app-text focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">Todos</option>
              {INITIAL_EMPLOYEE_STATUSES.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-app-bg border border-app-border rounded-xl px-2.5 py-1.5">
            <select
              value={workCenterFilter}
              onChange={(e) => setWorkCenterFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-app-text focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">Todos</option>
              {scopeWorkCenters.map((w) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={createButtonConfig.action}
            disabled={isReadOnly}
            className={`flex items-center gap-1.5 px-4 py-2 text-white font-semibold text-xs rounded-xl shadow-xs ${isReadOnly ? 'bg-app-text-secondary cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'}`}
          >
            {createButtonConfig.icon}
            <span>{createButtonConfig.label}</span>
          </button>
        </div>

        <div className="hidden xl:flex items-center gap-2.5">
          <button
            onClick={createButtonConfig.action}
            disabled={isReadOnly}
            className={`flex items-center gap-1.5 px-4 py-2 text-white font-semibold text-xs rounded-xl shadow-xs ${isReadOnly ? 'bg-app-text-secondary cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'}`}
          >
            {createButtonConfig.icon}
            <span>{createButtonConfig.label}</span>
          </button>
        </div>
      </div>

      <div className="flex gap-1.5 bg-app-bg rounded-xl p-1 overflow-x-auto">
        <button onClick={() => setActiveTab('employees')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'employees' ? 'bg-app-card text-primary-700 shadow-xs' : 'text-app-text-secondary hover:text-app-text'}`}>
          <User className="h-4 w-4" /> Empleados
        </button>
        <button onClick={() => setActiveTab('categories')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'categories' ? 'bg-app-card text-primary-700 shadow-xs' : 'text-app-text-secondary hover:text-app-text'}`}>
          <Tags className="h-4 w-4" /> Categorías
        </button>
        <button onClick={() => setActiveTab('statuses')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'statuses' ? 'bg-app-card text-primary-700 shadow-xs' : 'text-app-text-secondary hover:text-app-text'}`}>
          <HeartPulse className="h-4 w-4" /> Estados
        </button>
        <button onClick={() => setActiveTab('workdays')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'workdays' ? 'bg-app-card text-primary-700 shadow-xs' : 'text-app-text-secondary hover:text-app-text'}`}>
          <CalendarDays className="h-4 w-4" /> Jornadas
        </button>
        <button onClick={() => setActiveTab('shifts')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'shifts' ? 'bg-app-card text-primary-700 shadow-xs' : 'text-app-text-secondary hover:text-app-text'}`}>
          <Clock className="h-4 w-4" /> Turnos
        </button>
        <button onClick={() => setActiveTab('contracts')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'contracts' ? 'bg-app-card text-primary-700 shadow-xs' : 'text-app-text-secondary hover:text-app-text'}`}>
          <FileText className="h-4 w-4" /> Contratos
        </button>
      </div>

      {loading && activeTab === 'employees' && employeeOverviews.length === 0 ? (
        <TableSkeleton rows={8} cols={4} />
      ) : (
      activeTab === 'employees' && (
        <>

      <div className="flex gap-5">
        <div className="flex-1">
          <div className="card-uiverse overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-app-bg border-b border-app-border text-[11px] uppercase font-bold text-app-text-secondary tracking-wider">
                    <th className="py-3 px-6">Identidad / Empleado</th>
                    <th className="py-3 px-4 w-28 text-center">Categoría</th>
                    <th className="py-3 px-4 w-20 text-center">Estado</th>
                    <th className="py-3 px-4 w-24 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-app-border text-app-text text-sm">
                  {paginatedEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-app-text-secondary font-medium">
                        No se encontraron empleados.
                      </td>
                    </tr>
                  ) : (
                    paginatedEmployees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-app-bg/70 transition-colors">
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm shadow-primary-500/20 relative overflow-hidden">
                              <User className="w-8 h-8 text-app-text-secondary/50 absolute" />
                              <span className="text-white font-bold text-sm relative z-10">{getInitials(emp.name, emp.last_name1)}</span>
                            </div>
                            <div>
                              <div className="font-bold text-app-text-secondary leading-tight">{emp.name} {emp.last_name1} {emp.last_name2}</div>
                              <div className="text-xs text-app-text-secondary flex items-center gap-1 mt-0.5">
                                <span className="font-mono text-primary-600 font-semibold">ID: {emp.id}</span>
                                <span>•</span>
                                <Mail className="h-3 w-3 text-app-text-secondary inline" />
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
                            <button onClick={() => onViewEmployee?.(emp.id)} className="p-1.5 text-app-text-secondary hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 rounded-lg" title="Ver detalles"><Eye className="h-4 w-4" /></button>
                            {!isReadOnly && (
                              <>
                                <button onClick={() => handleEdit(emp.id)} className="p-1.5 text-app-text-secondary hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 dark:hover:text-amber-400 rounded-lg"><Edit3 className="h-4 w-4" /></button>
                                <button onClick={() => handleDelete(emp.id)} className="p-1.5 text-app-text-secondary hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 dark:hover:text-rose-400 rounded-lg"><Trash2 className="h-4 w-4" /></button>
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
            <div className="bg-app-card border-t border-app-card-border flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-2 text-sm text-app-text-secondary">
                <span>Mostrar</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="border border-app-border rounded-lg px-2.5 py-1.5 text-sm text-app-text focus:outline-hidden focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span>por página</span>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-xs text-app-text-secondary mr-3">Página {totalPages > 0 ? currentPage : 0} de {totalPages}</span>
                <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1 || totalPages === 0} className="p-1.5 rounded-lg text-app-text-secondary hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-app-text-secondary transition-colors" title="Primera página"><ChevronsLeft className="h-4 w-4" /></button>
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1 || totalPages === 0} className="p-1.5 rounded-lg text-app-text-secondary hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-app-text-secondary transition-colors" title="Página anterior"><ChevronLeft className="h-4 w-4" /></button>
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} className="p-1.5 rounded-lg text-app-text-secondary hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-app-text-secondary transition-colors" title="Página siguiente"><ChevronRight className="h-4 w-4" /></button>
                <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages || totalPages === 0} className="p-1.5 rounded-lg text-app-text-secondary hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-app-text-secondary transition-colors" title="Última página"><ChevronsRight className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden xl:flex xl:flex-col xl:w-64 flex-shrink-0 xl:space-y-3">
          {(() => { const o = openSections.centros; return (
          <div className="card-uiverse overflow-hidden">
            <button onClick={() => toggleSection('centros')} className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-app-text-secondary uppercase tracking-wider hover:bg-app-bg transition-colors">
              Centros de Trabajo
              {o ? <ChevronUp className="h-3.5 w-3.5 text-app-text-secondary" /> : <ChevronDown className="h-3.5 w-3.5 text-app-text-secondary" />}
            </button>
            {o && (
            <div className="px-4 pt-2 pb-3 space-y-1">
              <button onClick={() => setWorkCenterFilter('ALL')} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${workCenterFilter === 'ALL' ? 'bg-primary-100 text-primary-700 font-semibold dark:bg-primary-900/30 dark:text-primary-300' : 'text-app-text-secondary hover:bg-app-bg'}`}>Todos los Centros</button>
              {scopeWorkCenters.map((wc) => (
                <button key={wc.id} onClick={() => setWorkCenterFilter(wc.id)} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${workCenterFilter === wc.id ? 'bg-primary-100 text-primary-700 font-semibold dark:bg-primary-900/30 dark:text-primary-300' : 'text-app-text-secondary hover:bg-app-bg'}`}>{wc.name}</button>
              ))}
            </div>
            )}
          </div>
          )})()}

          {(() => { const o = openSections.estado; return (
          <div className="card-uiverse overflow-hidden">
            <button onClick={() => toggleSection('estado')} className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-app-text-secondary uppercase tracking-wider hover:bg-app-bg transition-colors">
              Estado
              {o ? <ChevronUp className="h-3.5 w-3.5 text-app-text-secondary" /> : <ChevronDown className="h-3.5 w-3.5 text-app-text-secondary" />}
            </button>
            {o && (
            <div className="px-4 pt-2 pb-3 space-y-1">
              <button onClick={() => setStatusFilter('ALL')} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${statusFilter === 'ALL' ? 'bg-primary-100 text-primary-700 font-semibold dark:bg-primary-900/30 dark:text-primary-300' : 'text-app-text-secondary hover:bg-app-bg'}`}>Todos los Estados</button>
              {INITIAL_EMPLOYEE_STATUSES.map((es) => (
                <button key={es.id} onClick={() => setStatusFilter(es.id)} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${statusFilter === es.id ? 'bg-primary-100 text-primary-700 font-semibold dark:bg-primary-900/30 dark:text-primary-300' : 'text-app-text-secondary hover:bg-app-bg'}`}>{es.name}</button>
              ))}
            </div>
            )}
          </div>
          )})()}
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
      ))}

      {activeTab === 'categories' && renderLookupTab(cats, <Tags className="h-5 w-5" />, 'Categoría', 'Categorías')}
      {activeTab === 'statuses' && renderLookupTab(statuses, <HeartPulse className="h-5 w-5" />, 'Estado', 'Estados')}
      {activeTab === 'workdays' && renderLookupTab(workDays, <CalendarDays className="h-5 w-5" />, 'Jornada', 'Jornadas')}
      {activeTab === 'shifts' && renderLookupTab(shifts, <Clock className="h-5 w-5" />, 'Turno', 'Turnos')}
      {activeTab === 'contracts' && renderLookupTab(contracts, <FileText className="h-5 w-5" />, 'Contrato', 'Contratos')}
    </div>
  );
};

