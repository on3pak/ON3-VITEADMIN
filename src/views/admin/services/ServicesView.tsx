import React, { useState, useMemo, useEffect } from 'react';
import { servicesApi } from '../../../api/services';
import { useServices } from '../../../context/ServiceContext';
import { useAuth } from '../../../context/AuthContext';
import { useLookupsContext } from '../../../context/LookupContext';
import { ServiceFormModal } from '../../../components/modals/ServiceFormModal';
import { ConfirmDialog } from '../../../components/modals/ConfirmDialog';
import { Service, ServiceOverview } from '../../../types';
import {
  Search, Plus, Edit3, Trash2, Filter, Eye,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,   ChevronDown, ChevronUp,
  ClipboardList, Clock, Users, UserCog,
} from 'lucide-react';
import { TableSkeleton } from '../../../components/ui';

const CATEGORY_COLORS: Record<string, string> = {
  'BARRIDO MIXTO': 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800',
  'BARRIDO MANUAL': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
  'BARRIDO MECÁNICO': 'bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800',
  'BALDEO': 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
  'RECOGIDA': 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
  'VACIADO': 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800',
};

export const ServicesView: React.FC<{ onViewService?: (id: string) => void }> = ({ onViewService }) => {
  const { getServiceOverviews, getServiceById, loadServices, loading } = useServices();
  const { user: loggedInUser } = useAuth();
  const { workCenters, shifts, employeeCategories } = useLookupsContext();

  const wcCityMap = useMemo(() => Object.fromEntries(
    workCenters.map((wc) => [wc.id, wc.city_id])
  ), [workCenters]);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [workCenterFilter, setWorkCenterFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ centros: false, tipo: false });
  const toggleSection = (key: string) => setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingServiceId, setDeletingServiceId] = useState<string | null>(null);

  useEffect(() => { loadServices(); }, [loadServices]);

  const handleCreate = () => { setModalMode('create'); setSelectedServiceId(null); setModalOpen(true); };
  const handleEdit = (id: string) => { setModalMode('edit'); setSelectedServiceId(id); setModalOpen(true); };
  const handleDelete = (id: string) => { setDeletingServiceId(id); setDeleteDialogOpen(true); };
  const handleConfirmDelete = async () => { if (deletingServiceId) { await servicesApi.delete(deletingServiceId); loadServices(); } setDeleteDialogOpen(false); setDeletingServiceId(null); };

  const handleModalSubmit = async (data: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
    if (modalMode === 'edit' && selectedServiceId) {
      await servicesApi.update(selectedServiceId, data);
    } else {
      await servicesApi.create(data);
    }
    loadServices();
    setModalOpen(false);
    return true;
  };

  const selectedService = modalMode === 'edit' && selectedServiceId ? getServiceById(selectedServiceId) : undefined;
  const serviceOverviews = getServiceOverviews();

  const userCityId = loggedInUser?.role === 'ROOT' ? undefined : loggedInUser?.city_id;

  const scopeWorkCenters = useMemo(
    () => userCityId ? workCenters.filter((wc) => wc.city_id === userCityId) : workCenters,
    [userCityId, workCenters]
  );

  const filteredServices = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return serviceOverviews.filter((s) => {
      const matchesCityScope = !userCityId || wcCityMap[s.work_center_id] === userCityId;
      if (!matchesCityScope) return false;

      const searchable = `${s.name} ${s.category}`.toLowerCase();
      const matchesSearch = !q || searchable.includes(q);
      const matchesType = categoryFilter === 'ALL' || s.category === categoryFilter;
      const matchesWorkCenter = workCenterFilter === 'ALL' || s.work_center_id === workCenterFilter;
      return matchesSearch && matchesType && matchesWorkCenter;
    });
  }, [serviceOverviews, searchQuery, categoryFilter, workCenterFilter, userCityId]);

  useEffect(() => setCurrentPage(1), [searchQuery, categoryFilter, workCenterFilter, itemsPerPage]);

  const { totalPages, paginatedServices } = useMemo(() => {
    const t = Math.ceil(filteredServices.length / itemsPerPage);
    const p = filteredServices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    return { totalPages: t, paginatedServices: p };
  }, [filteredServices, currentPage, itemsPerPage]);

  return (
    <div className="space-y-5">
      <div className="bg-app-card p-3 sm:p-4 rounded-2xl border border-app-card-border shadow-xs flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        <div className="relative flex-1 min-w-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-app-text-secondary">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre o tipo..."
            className="w-full min-w-0 pl-9 pr-4 py-2 border border-app-border rounded-xl text-sm placeholder:text-app-text-secondary/50 text-app-text focus:outline-hidden focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 xl:hidden">
          <div className="flex items-center gap-1.5 bg-app-bg border border-app-border rounded-xl px-2.5 py-1.5">
            <Filter className="h-3.5 w-3.5 text-app-text-secondary" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-app-text focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">Todos</option>
              <option value="BARRIDO MIXTO">Barrido Mixto</option>
              <option value="BARRIDO MANUAL">Barrido Manual</option>
              <option value="BARRIDO MECÁNICO">Barrido Mecánico</option>
              <option value="BALDEO">Baldeo</option>
              <option value="RECOGIDA">Recogida</option>
              <option value="VACIADO">Vaciado</option>
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

          <button onClick={handleCreate} className="flex items-center gap-1.5 px-4 py-2 text-white font-semibold text-xs rounded-xl shadow-xs bg-primary-600 hover:bg-primary-700">
            <Plus className="h-4 w-4" />
            <span>Crear</span>
          </button>
        </div>

        <div className="hidden xl:flex items-center gap-2.5">
          <button onClick={handleCreate} className="flex items-center gap-1.5 px-4 py-2 text-white font-semibold text-xs rounded-xl shadow-xs bg-primary-600 hover:bg-primary-700">
            <Plus className="h-4 w-4" />
            <span>Crear Servicio</span>
          </button>
        </div>
      </div>

      {loading && serviceOverviews.length === 0 ? (
        <TableSkeleton rows={8} cols={5} />
      ) : (
      <div className="flex gap-5">
        <div className="flex-1">
          <div className="bg-app-card rounded-2xl border border-app-card-border shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-app-bg border-b border-app-border text-[11px] uppercase font-bold text-app-text-secondary tracking-wider">
                    <th className="py-3 px-6">Servicio</th>
                    <th className="py-3 px-4 w-20 text-center">Turno</th>
                    <th className="py-3 px-4 w-28 text-center">Tipo</th>
                    <th className="py-3 px-4 w-32 text-center">Personal</th>
                    <th className="py-3 px-4 w-20 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-app-border text-app-text text-sm">
                  {paginatedServices.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-app-text-secondary font-medium">
                        No se encontraron servicios.
                      </td>
                    </tr>
                  ) : (
                    paginatedServices.map((s) => (
                      <tr key={s.id} className="hover:bg-app-bg/70 transition-colors">
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm shadow-primary-500/20">
                              <ClipboardList className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="font-bold text-app-text-secondary leading-tight">{s.name}</div>
                              <div className="text-xs text-app-text-secondary mt-0.5">
                                <span className="font-medium text-primary-600">{s.category}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex justify-center">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-md bg-app-bg text-app-text">
                              <Clock className="h-3 w-3" />
                              {shifts.find((sh) => sh.id === s.shift_id)?.name ?? s.shift_id}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex justify-center">
                            <span className={`inline-flex px-2 py-0.5 text-[10px] font-semibold rounded-md border text-center ${CATEGORY_COLORS[s.category] || 'bg-app-bg'}`}>
                              {s.category}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex flex-col items-center gap-1">
                            {s.staff_requirement.oficial ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-md bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                                <UserCog className="h-3 w-3" />
                                {employeeCategories.find((c) => c.id === s.staff_requirement.oficial)?.name ?? 'Oficial'}
                              </span>
                            ) : null}
                            {s.staff_requirement.peones > 0 ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-md bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
                                <Users className="h-3 w-3" />
                                {s.staff_requirement.peones} peón{s.staff_requirement.peones !== 1 ? 'es' : ''}
                              </span>
                            ) : null}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex justify-end gap-1.5">
                            <button onClick={() => onViewService?.(s.id)} className="p-1.5 text-app-text-secondary hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 rounded-lg" title="Ver tareas"><Eye className="h-4 w-4" /></button>
                            <button onClick={() => handleEdit(s.id)} className="p-1.5 text-app-text-secondary hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 dark:hover:text-amber-400 rounded-lg"><Edit3 className="h-4 w-4" /></button>
                            <button onClick={() => handleDelete(s.id)} className="p-1.5 text-app-text-secondary hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 dark:hover:text-rose-400 rounded-lg"><Trash2 className="h-4 w-4" /></button>
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
          <div className="bg-app-card rounded-2xl border border-app-card-border shadow-xs overflow-hidden">
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

          {(() => { const o = openSections.tipo; return (
          <div className="bg-app-card rounded-2xl border border-app-card-border shadow-xs overflow-hidden">
            <button onClick={() => toggleSection('tipo')} className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-app-text-secondary uppercase tracking-wider hover:bg-app-bg transition-colors">
              Tipo
              {o ? <ChevronUp className="h-3.5 w-3.5 text-app-text-secondary" /> : <ChevronDown className="h-3.5 w-3.5 text-app-text-secondary" />}
            </button>
            {o && (
            <div className="px-4 pt-2 pb-3 space-y-1">
              <button onClick={() => setCategoryFilter('ALL')} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${categoryFilter === 'ALL' ? 'bg-primary-100 text-primary-700 font-semibold dark:bg-primary-900/30 dark:text-primary-300' : 'text-app-text-secondary hover:bg-app-bg'}`}>Todos los Tipos</button>
              {['BARRIDO MIXTO', 'BARRIDO MANUAL', 'BARRIDO MECÁNICO', 'BALDEO', 'RECOGIDA', 'VACIADO'].map((t) => (
                <button key={t} onClick={() => setCategoryFilter(t)} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${categoryFilter === t ? 'bg-primary-100 text-primary-700 font-semibold dark:bg-primary-900/30 dark:text-primary-300' : 'text-app-text-secondary hover:bg-app-bg'}`}>{t.charAt(0) + t.slice(1).toLowerCase()}</button>
              ))}
            </div>
            )}
          </div>
          )})()}
        </div>
      </div>
      )}

      <ServiceFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        editingService={selectedService}
        workCenters={scopeWorkCenters}
      />

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Eliminar Servicio"
        message="¿Estás seguro de eliminar este servicio? Esta acción no se puede deshacer."
        onConfirm={handleConfirmDelete}
        onCancel={() => { setDeleteDialogOpen(false); setDeletingServiceId(null); }}
      />
    </div>
  );
};


