import React, { useState, useMemo, useEffect } from 'react';
import { vehiclesApi } from '../../../api/services';
import { useVehicles } from '../../../context/VehicleContext';
import { useAuth } from '../../../context/AuthContext';
import { INITIAL_WORK_CENTERS } from '../../../data/mockWorkCenters';
import { INITIAL_VEHICLE_TYPES } from '../../../data/mockVehicles';
import { VehicleFormModal } from '../../../components/modals/VehicleFormModal';
import { ConfirmDialog } from '../../../components/modals/ConfirmDialog';
import { Vehicle, VehicleOverview, VehicleType } from '../../types';
import {
  Search, Plus, Edit3, Trash2, Filter, Eye,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronDown, ChevronUp, Truck,
} from 'lucide-react';
import { TableSkeleton } from '../../../components/ui';

const STATUS_STYLES: Record<string, string> = {
  'ACTIVE': 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
  'MAINTENANCE': 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
  'BROKEN': 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800',
  'RETIRED': 'bg-app-bg text-app-text border-app-border',
};

const TYPE_COLORS: Record<VehicleType, string> = {
  'BARREDORA': 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800',
  'CAMION': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
  'FURGONETA': 'bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800',
  'TURISMO': 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
  'PORTER': 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
};

const vehicleTypeMap = Object.fromEntries(INITIAL_VEHICLE_TYPES.map(vt => [vt.id, vt.category]));

const wcCityMap = Object.fromEntries(
  INITIAL_WORK_CENTERS.map((wc) => [wc.id, wc.city_id])
);

export const VehiclesView: React.FC<{ onViewVehicle?: (id: string) => void }> = ({ onViewVehicle }) => {
  const { getVehicleOverviews, getVehicleById, loadVehicles, loading } = useVehicles();
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
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingVehicleId, setDeletingVehicleId] = useState<string | null>(null);

  useEffect(() => { loadVehicles(); }, [loadVehicles]);

  const handleCreate = () => { setModalMode('create'); setSelectedVehicleId(null); setModalOpen(true); };
  const handleEdit = (id: string) => { setModalMode('edit'); setSelectedVehicleId(id); setModalOpen(true); };
  const handleDelete = (id: string) => { setDeletingVehicleId(id); setDeleteDialogOpen(true); };
  const handleConfirmDelete = async () => { if (deletingVehicleId) { await vehiclesApi.delete(deletingVehicleId); loadVehicles(); } setDeleteDialogOpen(false); setDeletingVehicleId(null); };

  const handleModalSubmit = async (data: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>) => {
    if (modalMode === 'edit' && selectedVehicleId) {
      await vehiclesApi.update(selectedVehicleId, data);
    } else {
      await vehiclesApi.create(data);
    }
    loadVehicles();
    setModalOpen(false);
    return true;
  };

  const selectedVehicle = modalMode === 'edit' && selectedVehicleId ? getVehicleById(selectedVehicleId) : undefined;
  const vehicleOverviews = getVehicleOverviews();

  const userCityId = loggedInUser?.role === 'root' ? undefined : loggedInUser?.city_id;

  const scopeWorkCenters = useMemo(
    () => userCityId ? INITIAL_WORK_CENTERS.filter((wc) => wc.city_id === userCityId) : INITIAL_WORK_CENTERS,
    [userCityId]
  );

  const filteredVehicles = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return vehicleOverviews.filter((v) => {
      const matchesCityScope = !userCityId || wcCityMap[v.work_center_id] === userCityId;
      if (!matchesCityScope) return false;

      const searchable = `${v.license_plate} ${v.model} ${v.brand}`.toLowerCase();
      const matchesSearch = !q || searchable.includes(q);
      const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
      const matchesWorkCenter = workCenterFilter === 'ALL' || v.work_center_id === workCenterFilter;
      return matchesSearch && matchesStatus && matchesWorkCenter;
    });
  }, [vehicleOverviews, searchQuery, statusFilter, workCenterFilter, userCityId]);

  useEffect(() => setCurrentPage(1), [searchQuery, statusFilter, workCenterFilter, itemsPerPage]);

  const { totalPages, paginatedVehicles } = useMemo(() => {
    const t = Math.ceil(filteredVehicles.length / itemsPerPage);
    const p = filteredVehicles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    return { totalPages: t, paginatedVehicles: p };
  }, [filteredVehicles, currentPage, itemsPerPage]);

  const getBadgeStyle = (status: string) => STATUS_STYLES[status] ?? 'bg-app-bg text-app-text border-app-border';

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
            placeholder="Buscar por matrícula, modelo o marca..."
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
              <option value="ACTIVE">Activo</option>
              <option value="MAINTENANCE">Mantenimiento</option>
              <option value="BROKEN">Averiado</option>
              <option value="RETIRED">Baja</option>
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
            <span>Crear Vehículo</span>
          </button>
        </div>
      </div>

      {loading && vehicleOverviews.length === 0 ? (
        <TableSkeleton rows={8} cols={5} />
      ) : (
      <div className="flex gap-5">
        <div className="flex-1">
          <div className="bg-app-card rounded-2xl border border-app-card-border shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-app-bg border-b border-app-border text-[11px] uppercase font-bold text-app-text-secondary tracking-wider">
                    <th className="py-3 px-6">Vehículo</th>
                    <th className="py-3 px-4 w-28 text-center">Tipo</th>
                    <th className="py-3 px-4 w-24 text-center">Estado</th>
                    <th className="py-3 px-4 w-20 text-center">Km</th>
                    <th className="py-3 px-4 w-20 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-app-border text-app-text text-sm">
                  {paginatedVehicles.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-app-text-secondary font-medium">
                        No se encontraron vehículos.
                      </td>
                    </tr>
                  ) : (
                    paginatedVehicles.map((v) => (
                      <tr key={v.id} className="hover:bg-app-bg/70 transition-colors">
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm shadow-blue-500/20">
                              <Truck className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="font-bold text-app-text-secondary leading-tight">{v.brand} {v.model}</div>
                              <div className="text-xs text-app-text-secondary flex items-center gap-1 mt-0.5">
                                <span className="font-mono text-primary-600 font-semibold">{v.license_plate}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex justify-center">
                            <span className={`inline-flex px-2 py-0.5 text-[10px] font-semibold rounded-md border text-center ${TYPE_COLORS[vehicleTypeMap[v.vehicle_type_id]] || 'bg-app-bg'}`}>
                              {vehicleTypeMap[v.vehicle_type_id]}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex justify-center">
                            <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full border text-center ${getBadgeStyle(v.status)}`}>
                              {v.status.toLowerCase() === 'active' ? 'Activo' : v.status.toLowerCase() === 'maintenance' ? 'Mantenimiento' : v.status.toLowerCase() === 'broken' ? 'Averiado' : 'Baja'}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span className="text-xs font-mono text-app-text-secondary">{v.kilometers.toLocaleString()} km</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex justify-end gap-1.5">
                            <button onClick={() => onViewVehicle?.(v.id)} className="p-1.5 text-app-text-secondary hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 rounded-lg" title="Ver detalles"><Eye className="h-4 w-4" /></button>
                            <button onClick={() => handleEdit(v.id)} className="p-1.5 text-app-text-secondary hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 dark:hover:text-amber-400 rounded-lg"><Edit3 className="h-4 w-4" /></button>
                            <button onClick={() => handleDelete(v.id)} className="p-1.5 text-app-text-secondary hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 dark:hover:text-rose-400 rounded-lg"><Trash2 className="h-4 w-4" /></button>
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

          {(() => { const o = openSections.estado; return (
          <div className="bg-app-card rounded-2xl border border-app-card-border shadow-xs overflow-hidden">
            <button onClick={() => toggleSection('estado')} className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-app-text-secondary uppercase tracking-wider hover:bg-app-bg transition-colors">
              Estado
              {o ? <ChevronUp className="h-3.5 w-3.5 text-app-text-secondary" /> : <ChevronDown className="h-3.5 w-3.5 text-app-text-secondary" />}
            </button>
            {o && (
            <div className="px-4 pt-2 pb-3 space-y-1">
              <button onClick={() => setStatusFilter('ALL')} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${statusFilter === 'ALL' ? 'bg-primary-100 text-primary-700 font-semibold dark:bg-primary-900/30 dark:text-primary-300' : 'text-app-text-secondary hover:bg-app-bg'}`}>Todos los Estados</button>
              {['ACTIVE', 'MAINTENANCE', 'BROKEN', 'RETIRED'].map((s) => (
                <button key={s} onClick={() => setStatusFilter(s)} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${statusFilter === s ? 'bg-primary-100 text-primary-700 font-semibold dark:bg-primary-900/30 dark:text-primary-300' : 'text-app-text-secondary hover:bg-app-bg'}`}>{s === 'ACTIVE' ? 'Activo' : s === 'MAINTENANCE' ? 'Mantenimiento' : s === 'BROKEN' ? 'Averiado' : 'Baja'}</button>
              ))}
            </div>
            )}
          </div>
          )})()}
        </div>
      </div>
      )}

      <VehicleFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        editingVehicle={selectedVehicle}
      />

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Eliminar Vehículo"
        message="¿Estás seguro de eliminar este vehículo? Esta acción no se puede deshacer."
        onConfirm={handleConfirmDelete}
        onCancel={() => { setDeleteDialogOpen(false); setDeletingVehicleId(null); }}
      />
    </div>
  );
};

