import React, { useState, useMemo, useEffect } from 'react';
import { useMachinery } from '../../../context/MachineryContext';
import { useAuth } from '../../../context/AuthContext';
import { MACHINERY_SUBTYPES, MACHINERY_STATUSES } from '../../../data/mockMachinery';
import { INITIAL_WORK_CENTERS } from '../../../data/mockWorkCenters';
import { INITIAL_CITIES } from '../../../data/mockEmployees';
import { MachineryFormModal } from '../../../components/modals/MachineryFormModal';
import { ConfirmDialog } from '../../../components/modals/ConfirmDialog';
import {
  Search, Plus, Edit3, Trash2,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ChevronDown, ChevronUp,
  Wrench, Filter, MapPin, ShieldAlert,
} from 'lucide-react';

const getSubtypeName = (id: string) => MACHINERY_SUBTYPES.find((st) => st.id === id)?.name ?? id;
const getStatusName = (id: string) => MACHINERY_STATUSES.find((s) => s.id === id)?.name ?? id;
const getWcName = (id: string) => INITIAL_WORK_CENTERS.find((wc) => wc.id === id)?.name ?? id;
const getCityName = (id: string) => INITIAL_CITIES.find((c) => c.id === id)?.name ?? id;

const STATUS_COLORS: Record<string, string> = {
  'ms-1': 'text-emerald-600 bg-emerald-50 border-emerald-200',
  'ms-2': 'text-amber-600 bg-amber-50 border-amber-200',
  'ms-3': 'text-rose-600 bg-rose-50 border-rose-200',
  'ms-4': 'text-slate-500 bg-slate-100 border-slate-200',
};

export const MachineryView: React.FC = () => {
  const { getOverviews, getById, create, update, remove, loadMachinery } = useMachinery();
  const { user: loggedInUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [subtypeFilter, setSubtypeFilter] = useState('ALL');
  const [workCenterFilter, setWorkCenterFilter] = useState('ALL');
  const [cityFilter, setCityFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ ciudad: false, centros: false, subtipo: false, estado: false });

  const toggleSection = (key: string) => setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  useEffect(() => { loadMachinery(); }, [loadMachinery]);

  const handleCreate = () => {
    setModalMode('create');
    setSelectedItemId(null);
    setModalOpen(true);
  };
  const handleEdit = (id: string) => {
    setModalMode('edit');
    setSelectedItemId(id);
    setModalOpen(true);
  };
  const handleDelete = (id: string) => {
    setDeletingItemId(id);
    setDeleteDialogOpen(true);
  };
  const handleConfirmDelete = () => {
    if (deletingItemId) remove(deletingItemId);
    setDeleteDialogOpen(false);
    setDeletingItemId(null);
  };

  const handleModalSubmit = (data: Omit<import('../../../types').MachineryItem, 'id' | 'created_at' | 'updated_at'>) => {
    if (modalMode === 'edit' && selectedItemId) {
      update(selectedItemId, data);
    } else {
      create(data);
    }
    setModalOpen(false);
    return true;
  };

  const selectedItem = modalMode === 'edit' && selectedItemId ? getById(selectedItemId) : undefined;
  const overviews = getOverviews();

  const userCityId = loggedInUser?.role === 'ROOT' ? undefined : loggedInUser?.city_id;

  const scopeCities = userCityId
    ? INITIAL_CITIES.filter((c) => c.id === userCityId)
    : INITIAL_CITIES;

  const scopeWorkCenters = useMemo(() => {
    let base = userCityId
      ? INITIAL_WORK_CENTERS.filter((wc) => wc.city_id === userCityId)
      : INITIAL_WORK_CENTERS;
    if (cityFilter !== 'ALL') {
      base = base.filter((wc) => wc.city_id === cityFilter);
    }
    return base;
  }, [userCityId, cityFilter]);

  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return overviews.filter((item) => {
      const matchesCityScope = !userCityId || item.city_id === userCityId;
      if (!matchesCityScope) return false;

      const matchesCityFilter = cityFilter === 'ALL' || item.city_id === cityFilter;
      if (!matchesCityFilter) return false;

      const searchable = `${item.name} ${getSubtypeName(item.subtype_id)}`.toLowerCase();
      const matchesSearch = !q || searchable.includes(q);
      const matchesStatus = statusFilter === 'ALL' || item.status_id === statusFilter;
      const matchesSubtype = subtypeFilter === 'ALL' || item.subtype_id === subtypeFilter;
      const matchesWorkCenter = workCenterFilter === 'ALL' || item.work_center_id === workCenterFilter;
      return matchesSearch && matchesStatus && matchesSubtype && matchesWorkCenter;
    });
  }, [overviews, searchQuery, statusFilter, workCenterFilter, cityFilter, userCityId]);

  useEffect(() => setCurrentPage(1), [searchQuery, statusFilter, subtypeFilter, workCenterFilter, cityFilter, itemsPerPage]);

  const { totalPages, paginatedItems } = useMemo(() => {
    const t = Math.ceil(filteredItems.length / itemsPerPage);
    const p = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    return { totalPages: t, paginatedItems: p };
  }, [filteredItems, currentPage, itemsPerPage]);

  const isReadOnly = loggedInUser?.role === 'USER';

  return (
    <div className="space-y-5">
      {isReadOnly && (
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-3 font-medium">
          <ShieldAlert className="h-4 w-4 text-amber-600 flex-shrink-0" />
          <span>
            <span className="font-bold">Modo de Consulta:</span> Has iniciado sesión como <span className="font-mono bg-amber-100 px-1 py-0.5 rounded text-amber-800">{loggedInUser?.role}</span>. Cualquier intento de creación, edición o borrado será bloqueado.
          </span>
        </div>
      )}

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
            className="w-full min-w-0 pl-9 pr-4 py-2 border border-app-border rounded-xl text-sm placeholder-slate-400 text-app-text focus:outline-hidden focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
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
              {MACHINERY_STATUSES.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-app-bg border border-app-border rounded-xl px-2.5 py-1.5">
            <Filter className="h-3.5 w-3.5 text-app-text-secondary" />
            <select
              value={subtypeFilter}
              onChange={(e) => setSubtypeFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-app-text focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">Todos</option>
              {MACHINERY_SUBTYPES.map((st) => (
                <option key={st.id} value={st.id}>{st.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleCreate}
            disabled={isReadOnly}
            className={`flex items-center gap-1.5 px-4 py-2 text-white font-semibold text-xs rounded-xl shadow-xs ${isReadOnly ? 'bg-app-text-secondary cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'}`}
          >
            <Plus className="h-4 w-4" />
            <span>Crear</span>
          </button>
        </div>

        <div className="hidden xl:flex items-center gap-2.5">
          <button
            onClick={handleCreate}
            disabled={isReadOnly}
            className={`flex items-center gap-1.5 px-4 py-2 text-white font-semibold text-xs rounded-xl shadow-xs ${isReadOnly ? 'bg-app-text-secondary cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'}`}
          >
            <Plus className="h-4 w-4" />
            <span>Crear Maquinaria</span>
          </button>
        </div>
      </div>

      <div className="flex gap-5">
        <div className="flex-1">
          <div className="bg-app-card rounded-2xl border border-app-card-border shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-app-bg border-b border-app-border text-[11px] uppercase font-bold text-app-text-secondary tracking-wider">
                    <th className="py-3 px-6">Elemento</th>
                    <th className="py-3 px-4 w-16 text-center">Cant.</th>
                    <th className="py-3 px-4 w-28 text-center">Estado</th>
                    <th className="py-3 px-4 w-28 text-center">Marca</th>
                    <th className="py-3 px-4 w-28 text-center">Modelo</th>
                    <th className="py-3 px-4 w-24 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-app-text text-sm">
                  {paginatedItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-app-text-secondary font-medium">
                        No se encontraron elementos de maquinaria.
                      </td>
                    </tr>
                  ) : (
                    paginatedItems.map((item) => {
                      const full = getById(item.id);
                      const statusClass = STATUS_COLORS[item.status_id] || 'text-slate-600 bg-slate-50 border-slate-200';
                      return (
                        <tr key={item.id} className="hover:bg-app-bg/70 transition-colors">
                          <td className="py-3.5 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-cyan-100 text-cyan-600 border border-cyan-200">
                                <Wrench className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="font-bold text-app-text-secondary leading-tight text-sm">{item.name}</div>
                                <div className="text-xs text-app-text-secondary flex items-center gap-1 mt-0.5">
                                  <span className="font-mono text-primary-600 font-semibold">{item.id}</span>
                                  <span>•</span>
                                  <MapPin className="h-3 w-3 text-app-text-secondary" />
                                  <span>{getWcName(item.work_center_id)}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex justify-center">
                              <span className={`text-sm font-bold ${
                                item.quantity === 0 ? 'text-rose-600' :
                                full && full.min_stock > 0 && item.quantity <= full.min_stock ? 'text-amber-500' :
                                'text-emerald-600'
                              }`}>
                                {item.quantity}
                              </span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex justify-center">
                              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${statusClass}`}>
                                {getStatusName(item.status_id)}
                              </span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex justify-center">
                              <span className="text-xs text-app-text-secondary font-medium">{full?.brand || '-'}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex justify-center">
                              <span className="text-xs text-app-text-secondary font-medium">{full?.model || '-'}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex justify-end gap-1.5">
                              {!isReadOnly && (
                                <>
                                  <button onClick={() => handleEdit(item.id)} className="p-1.5 text-app-text-secondary hover:text-amber-600 hover:bg-amber-50 rounded-lg" title="Editar">
                                    <Edit3 className="h-4 w-4" />
                                  </button>
                                  <button onClick={() => handleDelete(item.id)} className="p-1.5 text-app-text-secondary hover:text-rose-600 hover:bg-rose-50 rounded-lg" title="Eliminar">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
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
                  className="border border-app-border rounded-lg px-2.5 py-1.5 text-sm text-app-text focus:outline-hidden focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span>por página</span>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-xs text-app-text-secondary mr-3">Página {totalPages > 0 ? currentPage : 0} de {totalPages}</span>
                <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1 || totalPages === 0} className="p-1.5 rounded-lg text-app-text-secondary hover:bg-primary-50 hover:text-primary-600 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-app-text-secondary transition-colors" title="Primera página"><ChevronsLeft className="h-4 w-4" /></button>
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1 || totalPages === 0} className="p-1.5 rounded-lg text-app-text-secondary hover:bg-primary-50 hover:text-primary-600 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-app-text-secondary transition-colors" title="Página anterior"><ChevronLeft className="h-4 w-4" /></button>
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} className="p-1.5 rounded-lg text-app-text-secondary hover:bg-primary-50 hover:text-primary-600 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-app-text-secondary transition-colors" title="Página siguiente"><ChevronRight className="h-4 w-4" /></button>
                <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages || totalPages === 0} className="p-1.5 rounded-lg text-app-text-secondary hover:bg-primary-50 hover:text-primary-600 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-app-text-secondary transition-colors" title="Última página"><ChevronsRight className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden xl:flex xl:flex-col xl:w-64 flex-shrink-0 xl:space-y-3">
          {loggedInUser?.role === 'ROOT' && (() => {
            const open = openSections.ciudad;
            return (
            <div className="bg-app-card rounded-2xl border border-app-card-border shadow-xs overflow-hidden">
              <button onClick={() => toggleSection('ciudad')} className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-app-text-secondary uppercase tracking-wider hover:bg-app-bg transition-colors">
                Ciudad
                {open ? <ChevronUp className="h-3.5 w-3.5 text-app-text-secondary" /> : <ChevronDown className="h-3.5 w-3.5 text-app-text-secondary" />}
              </button>
              {open && (
              <div className="px-4 pt-2 pb-3 space-y-1">
                <button onClick={() => { setCityFilter('ALL'); setWorkCenterFilter('ALL'); }} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${cityFilter === 'ALL' ? 'bg-primary-100 text-primary-700 font-semibold' : 'text-app-text-secondary hover:bg-app-bg'}`}>Todas las Ciudades</button>
                {scopeCities.map((c) => (
                  <button key={c.id} onClick={() => { setCityFilter(c.id); setWorkCenterFilter('ALL'); }} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${cityFilter === c.id ? 'bg-primary-100 text-primary-700 font-semibold' : 'text-app-text-secondary hover:bg-app-bg'}`}>{c.name}</button>
                ))}
              </div>
              )}
            </div>
            );
          })()}

          {(() => {
            const open = openSections.centros;
            return (
            <div className="bg-app-card rounded-2xl border border-app-card-border shadow-xs overflow-hidden">
              <button onClick={() => toggleSection('centros')} className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-app-text-secondary uppercase tracking-wider hover:bg-app-bg transition-colors">
                Centros de Trabajo
                {open ? <ChevronUp className="h-3.5 w-3.5 text-app-text-secondary" /> : <ChevronDown className="h-3.5 w-3.5 text-app-text-secondary" />}
              </button>
              {open && (
              <div className="px-4 pt-2 pb-3 space-y-1">
                <button onClick={() => setWorkCenterFilter('ALL')} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${workCenterFilter === 'ALL' ? 'bg-primary-100 text-primary-700 font-semibold' : 'text-app-text-secondary hover:bg-app-bg'}`}>Todos los Centros</button>
                {scopeWorkCenters.map((wc) => (
                  <button key={wc.id} onClick={() => setWorkCenterFilter(wc.id)} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${workCenterFilter === wc.id ? 'bg-primary-100 text-primary-700 font-semibold' : 'text-app-text-secondary hover:bg-app-bg'}`}>{wc.name}</button>
                ))}
              </div>
              )}
            </div>
            );
          })()}

          {(() => {
            const open = openSections.subtipo;
            return (
            <div className="bg-app-card rounded-2xl border border-app-card-border shadow-xs overflow-hidden">
              <button onClick={() => toggleSection('subtipo')} className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-app-text-secondary uppercase tracking-wider hover:bg-app-bg transition-colors">
                Subtipo
                {open ? <ChevronUp className="h-3.5 w-3.5 text-app-text-secondary" /> : <ChevronDown className="h-3.5 w-3.5 text-app-text-secondary" />}
              </button>
              {open && (
              <div className="px-4 pt-2 pb-3 space-y-1">
                <button onClick={() => setSubtypeFilter('ALL')} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${subtypeFilter === 'ALL' ? 'bg-primary-100 text-primary-700 font-semibold' : 'text-app-text-secondary hover:bg-app-bg'}`}>Todos</button>
                {MACHINERY_SUBTYPES.map((st) => (
                  <button key={st.id} onClick={() => setSubtypeFilter(st.id)} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${subtypeFilter === st.id ? 'bg-primary-100 text-primary-700 font-semibold' : 'text-app-text-secondary hover:bg-app-bg'}`}>{st.name}</button>
                ))}
              </div>
              )}
            </div>
            );
          })()}

          {(() => {
            const open = openSections.estado;
            return (
            <div className="bg-app-card rounded-2xl border border-app-card-border shadow-xs overflow-hidden">
              <button onClick={() => toggleSection('estado')} className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-app-text-secondary uppercase tracking-wider hover:bg-app-bg transition-colors">
                Estado
                {open ? <ChevronUp className="h-3.5 w-3.5 text-app-text-secondary" /> : <ChevronDown className="h-3.5 w-3.5 text-app-text-secondary" />}
              </button>
              {open && (
              <div className="px-4 pt-2 pb-3 space-y-1">
                <button onClick={() => setStatusFilter('ALL')} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${statusFilter === 'ALL' ? 'bg-primary-100 text-primary-700 font-semibold' : 'text-app-text-secondary hover:bg-app-bg'}`}>Todos los Estados</button>
                {MACHINERY_STATUSES.map((s) => (
                  <button key={s.id} onClick={() => setStatusFilter(s.id)} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${statusFilter === s.id ? 'bg-primary-100 text-primary-700 font-semibold' : 'text-app-text-secondary hover:bg-app-bg'}`}>{s.name}</button>
                ))}
              </div>
              )}
            </div>
            );
          })()}
        </div>
      </div>

      <MachineryFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        editingItem={selectedItem || undefined}
      />

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Eliminar Maquinaria"
        message="¿Estás seguro de eliminar este elemento de maquinaria? Esta acción no se puede deshacer."
        onConfirm={handleConfirmDelete}
        onCancel={() => { setDeleteDialogOpen(false); setDeletingItemId(null); }}
      />
    </div>
  );
};
