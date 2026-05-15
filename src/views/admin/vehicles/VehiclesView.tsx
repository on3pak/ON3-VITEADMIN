import React, { useState, useMemo, useEffect } from 'react';
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

const STATUS_STYLES: Record<string, string> = {
  'ACTIVO': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'MANTENIMIENTO': 'bg-amber-100 text-amber-800 border-amber-200',
  'AVERIADO': 'bg-rose-100 text-rose-800 border-rose-200',
  'BAJA': 'bg-slate-100 text-slate-800 border-slate-200',
};

const TYPE_COLORS: Record<VehicleType, string> = {
  'BARREDORA': 'bg-violet-100 text-violet-700 border-violet-200',
  'CAMION': 'bg-blue-100 text-blue-700 border-blue-200',
  'FURGONETA': 'bg-cyan-100 text-cyan-700 border-cyan-200',
  'TURISMO': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'PORTER': 'bg-amber-100 text-amber-700 border-amber-200',
};

const vehicleTypeMap = Object.fromEntries(INITIAL_VEHICLE_TYPES.map(vt => [vt.id, vt.type]));

const wcCityMap = Object.fromEntries(
  INITIAL_WORK_CENTERS.map((wc) => [wc.id, wc.city_id])
);

export const VehiclesView: React.FC<{ onViewVehicle?: (id: string) => void }> = ({ onViewVehicle }) => {
  const { getVehicleOverviews, getVehicleById, createVehicle, updateVehicle, deleteVehicle } = useVehicles();
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

  const handleCreate = () => { setModalMode('create'); setSelectedVehicleId(null); setModalOpen(true); };
  const handleEdit = (id: string) => { setModalMode('edit'); setSelectedVehicleId(id); setModalOpen(true); };
  const handleDelete = (id: string) => { setDeletingVehicleId(id); setDeleteDialogOpen(true); };
  const handleConfirmDelete = () => { if (deletingVehicleId) { deleteVehicle(deletingVehicleId); } setDeleteDialogOpen(false); setDeletingVehicleId(null); };

  const handleModalSubmit = (data: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>) => {
    if (modalMode === 'edit' && selectedVehicleId) {
      updateVehicle(selectedVehicleId, data);
    } else {
      createVehicle(data);
    }
    setModalOpen(false);
    return true;
  };

  const selectedVehicle = modalMode === 'edit' && selectedVehicleId ? getVehicleById(selectedVehicleId) : undefined;
  const vehicleOverviews = getVehicleOverviews();

  const userCityId = loggedInUser?.role === 'ROOT' ? undefined : loggedInUser?.city_id;

  const scopeWorkCenters = useMemo(
    () => userCityId ? INITIAL_WORK_CENTERS.filter((wc) => wc.city_id === userCityId) : INITIAL_WORK_CENTERS,
    [userCityId]
  );

  const filteredVehicles = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return vehicleOverviews.filter((v) => {
      const matchesCityScope = !userCityId || wcCityMap[v.work_center_id] === userCityId;
      if (!matchesCityScope) return false;

      const searchable = `${v.licensePlate} ${v.model} ${v.brand}`.toLowerCase();
      const matchesSearch = !q || searchable.includes(q);
      const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
      const matchesWorkCenter = workCenterFilter === 'ALL' || v.work_center_id === workCenterFilter;
      return matchesSearch && matchesStatus && matchesWorkCenter;
    });
  }, [vehicleOverviews, searchQuery, statusFilter, workCenterFilter, userCityId]);

  useEffect(() => setCurrentPage(1), [searchQuery, statusFilter, workCenterFilter, itemsPerPage]);

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const paginatedVehicles = filteredVehicles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getBadgeStyle = (status: string) => STATUS_STYLES[status] ?? 'bg-slate-100 text-slate-800 border-slate-200';

  return (
    <div className="space-y-5">
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por matrícula, modelo o marca..."
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
              <option value="ACTIVO">Activo</option>
              <option value="MANTENIMIENTO">Mantenimiento</option>
              <option value="AVERIADO">Averiado</option>
              <option value="BAJA">Baja</option>
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

          <button onClick={() => handleCreate()} className="flex items-center gap-1.5 px-4 py-2 text-white font-semibold text-xs rounded-xl shadow-xs bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4" />
            <span>Crear</span>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2.5">
          <button onClick={() => handleCreate()} className="flex items-center gap-1.5 px-4 py-2 text-white font-semibold text-xs rounded-xl shadow-xs bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4" />
            <span>Crear Vehículo</span>
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
                    <th className="py-3 px-6">Vehículo</th>
                    <th className="py-3 px-4 w-28 text-center">Tipo</th>
                    <th className="py-3 px-4 w-24 text-center">Estado</th>
                    <th className="py-3 px-4 w-20 text-center">Km</th>
                    <th className="py-3 px-4 w-20 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                  {paginatedVehicles.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                        No se encontraron vehículos.
                      </td>
                    </tr>
                  ) : (
                    paginatedVehicles.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm shadow-blue-500/20">
                              <Truck className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 leading-tight">{v.brand} {v.model}</div>
                              <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                <span className="font-mono text-indigo-600 font-semibold">{v.licensePlate}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex justify-center">
                            <span className={`inline-flex px-2 py-0.5 text-[10px] font-semibold rounded-md border text-center ${TYPE_COLORS[vehicleTypeMap[v.vehicle_type_id]] || 'bg-slate-100'}`}>
                              {vehicleTypeMap[v.vehicle_type_id]}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex justify-center">
                            <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full border text-center ${getBadgeStyle(v.status)}`}>
                              {v.status === 'ACTIVO' ? 'Activo' : v.status === 'MANTENIMIENTO' ? 'Mantenimiento' : v.status === 'AVERIADO' ? 'Averiado' : 'Baja'}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span className="text-xs font-mono text-slate-600">{v.kilometers.toLocaleString()} km</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex justify-end gap-1.5">
                            <button onClick={() => onViewVehicle?.(v.id)} className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg" title="Ver detalles"><Eye className="h-4 w-4" /></button>
                            <button onClick={() => handleEdit(v.id)} className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg"><Edit3 className="h-4 w-4" /></button>
                            <button onClick={() => handleDelete(v.id)} className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 className="h-4 w-4" /></button>
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

        <div className="hidden lg:flex lg:flex-col lg:w-64 flex-shrink-0 lg:space-y-3">
          {(() => { const o = openSections.centros; return (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <button onClick={() => toggleSection('centros')} className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hover:bg-slate-50 transition-colors">
              Centros de Trabajo
              {o ? <ChevronUp className="h-3.5 w-3.5 text-slate-400" /> : <ChevronDown className="h-3.5 w-3.5 text-slate-400" />}
            </button>
            {o && (
            <div className="px-4 pb-3 space-y-1">
              <button onClick={() => setWorkCenterFilter('ALL')} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${workCenterFilter === 'ALL' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}>Todos los Centros</button>
              {scopeWorkCenters.map((wc) => (
                <button key={wc.id} onClick={() => setWorkCenterFilter(wc.id)} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${workCenterFilter === wc.id ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}>{wc.name}</button>
              ))}
            </div>
            )}
          </div>
          )})()}

          {(() => { const o = openSections.estado; return (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <button onClick={() => toggleSection('estado')} className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hover:bg-slate-50 transition-colors">
              Estado
              {o ? <ChevronUp className="h-3.5 w-3.5 text-slate-400" /> : <ChevronDown className="h-3.5 w-3.5 text-slate-400" />}
            </button>
            {o && (
            <div className="px-4 pb-3 space-y-1">
              <button onClick={() => setStatusFilter('ALL')} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${statusFilter === 'ALL' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}>Todos los Estados</button>
              {['ACTIVO', 'MANTENIMIENTO', 'AVERIADO', 'BAJA'].map((s) => (
                <button key={s} onClick={() => setStatusFilter(s)} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${statusFilter === s ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}>{s === 'ACTIVO' ? 'Activo' : s === 'MANTENIMIENTO' ? 'Mantenimiento' : s === 'AVERIADO' ? 'Averiado' : 'Baja'}</button>
              ))}
            </div>
            )}
          </div>
          )})()}
        </div>
      </div>

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