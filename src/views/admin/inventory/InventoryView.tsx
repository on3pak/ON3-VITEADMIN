import React, { useState, useMemo, useEffect } from 'react';
import { useInventory } from '../../../context/InventoryContext';
import { useAuth } from '../../../context/AuthContext';
import { InventoryCategory } from '../../../types';
import { INVENTORY_SUBTYPES, getStatusesForCategory, getSubtypesForCategory } from '../../../data/mockInventory';
import { INITIAL_WORK_CENTERS } from '../../../data/mockWorkCenters';
import { INITIAL_CITIES } from '../../../data/mockEmployees';
import { InventoryFormModal } from '../../../components/modals/InventoryFormModal';
import { ConfirmDialog } from '../../../components/modals/ConfirmDialog';
import {
  Search, Plus, Edit3, Trash2, ShieldAlert,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ChevronDown, ChevronUp,
  Shirt, Shield, Wrench, Filter, MapPin,
} from 'lucide-react';

const STATUS_STYLES: Record<string, string> = {
  'rs-1': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'rs-2': 'bg-rose-100 text-rose-800 border-rose-200',
  'rs-3': 'bg-amber-100 text-amber-800 border-amber-200',
  'es-1': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'es-2': 'bg-rose-100 text-rose-800 border-rose-200',
  'es-3': 'bg-amber-100 text-amber-800 border-amber-200',
  'ms-1': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'ms-2': 'bg-amber-100 text-amber-800 border-amber-200',
  'ms-3': 'bg-rose-100 text-rose-800 border-rose-200',
  'ms-4': 'bg-app-bg text-app-text border-app-border',
};

const CATEGORY_TABS: { value: InventoryCategory; label: string; icon: React.ReactNode }[] = [
  { value: 'ropa', label: 'Ropa', icon: <Shirt className="h-4 w-4" /> },
  { value: 'epi', label: 'EPIs', icon: <Shield className="h-4 w-4" /> },
  { value: 'maquinaria', label: 'Maquinaria', icon: <Wrench className="h-4 w-4" /> },
];

const getSubtypeName = (id: string) => INVENTORY_SUBTYPES.find((st) => st.id === id)?.name ?? id;
const statusNameCache = (() => {
  const all = [...getStatusesForCategory('ropa'), ...getStatusesForCategory('epi'), ...getStatusesForCategory('maquinaria')];
  return (id: string) => all.find((s) => s.id === id)?.name ?? id;
})();
const getStatusName = statusNameCache;
const getBadgeStyle = (id: string) => STATUS_STYLES[id] ?? 'bg-app-bg text-app-text border-app-border';
const getWcName = (id: string) => INITIAL_WORK_CENTERS.find((wc) => wc.id === id)?.name ?? id;
const getCityName = (id: string) => INITIAL_CITIES.find((c) => c.id === id)?.name ?? id;

const wcCityMap = Object.fromEntries(
  INITIAL_WORK_CENTERS.map((wc) => [wc.id, wc.city_id])
);

export const InventoryView: React.FC = () => {
  const { getOverviews, getById, create, update, remove } = useInventory();
  const { user: loggedInUser } = useAuth();

  const [activeCategory, setActiveCategory] = useState<InventoryCategory>('ropa');
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

  const handleModalSubmit = (data: Omit<import('../../../types').InventoryItem, 'id' | 'created_at' | 'updated_at'>) => {
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
  const isRoot = loggedInUser?.role === 'ROOT';

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
      if (item.category !== activeCategory) return false;

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
  }, [overviews, searchQuery, statusFilter, workCenterFilter, cityFilter, activeCategory, userCityId]);

  useEffect(() => setCurrentPage(1), [searchQuery, statusFilter, subtypeFilter, workCenterFilter, cityFilter, activeCategory, itemsPerPage]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const isReadOnly = loggedInUser?.role === 'USER';

  const renderExtraCol = (item: typeof overviews[0]) => {
    const full = getById(item.id);
    if (!full) return null;
    switch (activeCategory) {
      case 'ropa':
        return <span className="text-xs text-app-text-secondary">{full.size || '-'} / {full.color || '-'}</span>;
      case 'epi':
        return <span className="text-xs text-app-text-secondary">{full.expiration_date ? `Cad: ${full.expiration_date}` : '-'}</span>;
      case 'maquinaria':
        return <span className="text-xs text-app-text-secondary">{full.brand ? `${full.brand} ${full.model || ''}` : '-'}</span>;
      default:
        return null;
    }
  };

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
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-app-text-secondary">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre o subtipo..."
            className="w-full pl-9 pr-4 py-2 border border-app-border rounded-xl text-sm placeholder-slate-400 text-app-text focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 lg:hidden">
          <div className="flex items-center gap-1.5 bg-app-bg border border-app-border rounded-xl px-2.5 py-1.5">
            <Filter className="h-3.5 w-3.5 text-app-text-secondary" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-app-text focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">Todos</option>
              {getStatusesForCategory(activeCategory).map((s) => (
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
              {getSubtypesForCategory(activeCategory).map((st) => (
                <option key={st.id} value={st.id}>{st.name}</option>
              ))}
            </select>
          </div>

          {activeCategory === 'maquinaria' && (
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
          )}

          <button
            onClick={handleCreate}
            disabled={isReadOnly}
            className={`flex items-center gap-1.5 px-4 py-2 text-white font-semibold text-xs rounded-xl shadow-xs ${isReadOnly ? 'bg-app-text-secondary cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            <Plus className="h-4 w-4" />
            <span>Crear</span>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2.5">
          <button
            onClick={handleCreate}
            disabled={isReadOnly}
            className={`flex items-center gap-1.5 px-4 py-2 text-white font-semibold text-xs rounded-xl shadow-xs ${isReadOnly ? 'bg-app-text-secondary cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            <Plus className="h-4 w-4" />
            <span>Crear {CATEGORY_TABS.find((t) => t.value === activeCategory)?.label}</span>
          </button>
        </div>
      </div>

      <div className="flex gap-1.5 bg-app-bg rounded-xl p-1 overflow-x-auto">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveCategory(tab.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              activeCategory === tab.value
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-app-text-secondary hover:text-app-text'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="flex gap-5">
        <div className="flex-1">
          <div className="bg-app-card rounded-2xl border border-app-card-border shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-app-bg border-b border-app-border text-[11px] uppercase font-bold text-app-text-secondary tracking-wider">
                    <th className="py-3 px-6">Elemento</th>
                    <th className="py-3 px-4 w-28 text-center">Subtipo</th>
                    <th className="py-3 px-4 w-20 text-center">Estado</th>
                    <th className="py-3 px-4 w-16 text-center">Cant.</th>
                    <th className="py-3 px-4 w-28 text-center">Detalle</th>
                    <th className="py-3 px-4 w-24 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-app-text text-sm">
                  {paginatedItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-app-text-secondary font-medium">
                        No se encontraron elementos en {CATEGORY_TABS.find((t) => t.value === activeCategory)?.label.toLowerCase()}.
                      </td>
                    </tr>
                  ) : (
                    paginatedItems.map((item) => {
                      const full = getById(item.id);
                      return (
                        <tr key={item.id} className="hover:bg-app-bg/70 transition-colors">
                          <td className="py-3.5 px-6">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                                activeCategory === 'ropa' ? 'bg-indigo-100 text-indigo-600 border border-indigo-200' :
                                activeCategory === 'epi' ? 'bg-amber-100 text-amber-600 border border-amber-200' :
                                'bg-cyan-100 text-cyan-600 border border-cyan-200'
                              }`}>
                                {CATEGORY_TABS.find((t) => t.value === activeCategory)?.icon}
                              </div>
                              <div>
                                <div className="font-bold text-app-text-secondary leading-tight text-sm">{item.name}</div>
                                <div className="text-xs text-app-text-secondary flex items-center gap-1 mt-0.5">
                                  <span className="font-mono text-indigo-600 font-semibold">{item.id}</span>
                                  <span>•</span>
                                  <MapPin className="h-3 w-3 text-app-text-secondary" />
                                  <span>{getWcName(item.work_center_id)}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex justify-center">
                              <span className="text-xs text-app-text-secondary font-medium">{getSubtypeName(item.subtype_id)}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex justify-center">
                              <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full border text-center ${getBadgeStyle(item.status_id)}`}>
                                {getStatusName(item.status_id)}
                              </span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex justify-center">
                              <span className={`text-sm font-bold ${full && full.min_stock > 0 && item.quantity <= full.min_stock ? 'text-rose-600' : 'text-app-text'}`}>
                                {item.quantity}
                              </span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex justify-center">
                              {renderExtraCol(item)}
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
                  className="border border-app-border rounded-lg px-2.5 py-1.5 text-sm text-app-text focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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

        <div className="hidden lg:flex lg:flex-col lg:w-64 flex-shrink-0 lg:space-y-3">
          {isRoot && (() => {
            const open = openSections.ciudad;
            return (
            <div className="bg-app-card rounded-2xl border border-app-card-border shadow-xs overflow-hidden">
              <button onClick={() => toggleSection('ciudad')} className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-app-text-secondary uppercase tracking-wider hover:bg-app-bg transition-colors">
                Ciudad
                {open ? <ChevronUp className="h-3.5 w-3.5 text-app-text-secondary" /> : <ChevronDown className="h-3.5 w-3.5 text-app-text-secondary" />}
              </button>
              {open && (
              <div className="px-4 pb-3 space-y-1">
                <button onClick={() => { setCityFilter('ALL'); setWorkCenterFilter('ALL'); }} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${cityFilter === 'ALL' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-app-text-secondary hover:bg-app-bg'}`}>Todas las Ciudades</button>
                {scopeCities.map((c) => (
                  <button key={c.id} onClick={() => { setCityFilter(c.id); setWorkCenterFilter('ALL'); }} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${cityFilter === c.id ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-app-text-secondary hover:bg-app-bg'}`}>{c.name}</button>
                ))}
              </div>
              )}
            </div>
            );
          })()}

          {activeCategory === 'maquinaria' && (() => {
            const open = openSections.centros;
            return (
            <div className="bg-app-card rounded-2xl border border-app-card-border shadow-xs overflow-hidden">
              <button onClick={() => toggleSection('centros')} className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-app-text-secondary uppercase tracking-wider hover:bg-app-bg transition-colors">
                Centros de Trabajo
                {open ? <ChevronUp className="h-3.5 w-3.5 text-app-text-secondary" /> : <ChevronDown className="h-3.5 w-3.5 text-app-text-secondary" />}
              </button>
              {open && (
              <div className="px-4 pb-3 space-y-1">
                <button onClick={() => setWorkCenterFilter('ALL')} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${workCenterFilter === 'ALL' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-app-text-secondary hover:bg-app-bg'}`}>Todos los Centros</button>
                {scopeWorkCenters.map((wc) => (
                  <button key={wc.id} onClick={() => setWorkCenterFilter(wc.id)} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${workCenterFilter === wc.id ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-app-text-secondary hover:bg-app-bg'}`}>{wc.name}</button>
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
              <div className="px-4 pb-3 space-y-1">
                <button onClick={() => setSubtypeFilter('ALL')} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${subtypeFilter === 'ALL' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-app-text-secondary hover:bg-app-bg'}`}>Todos</button>
                {getSubtypesForCategory(activeCategory).map((st) => (
                  <button key={st.id} onClick={() => setSubtypeFilter(st.id)} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${subtypeFilter === st.id ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-app-text-secondary hover:bg-app-bg'}`}>{st.name}</button>
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
              <div className="px-4 pb-3 space-y-1">
                <button onClick={() => setStatusFilter('ALL')} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${statusFilter === 'ALL' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-app-text-secondary hover:bg-app-bg'}`}>Todos los Estados</button>
                {getStatusesForCategory(activeCategory).map((s) => (
                  <button key={s.id} onClick={() => setStatusFilter(s.id)} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${statusFilter === s.id ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-app-text-secondary hover:bg-app-bg'}`}>{s.name}</button>
                ))}
              </div>
              )}
            </div>
            );
          })()}
        </div>
      </div>

      <InventoryFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        editingItem={selectedItem || undefined}
      />

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Eliminar Elemento"
        message="¿Estás seguro de eliminar este elemento del inventario? Esta acción no se puede deshacer."
        onConfirm={handleConfirmDelete}
        onCancel={() => { setDeleteDialogOpen(false); setDeletingItemId(null); }}
      />
    </div>
  );
};
