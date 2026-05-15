import React, { useState, useMemo } from 'react';
import { useWorkCenters } from '../../../context/WorkCenterContext';
import { useAuth } from '../../../context/AuthContext';
import { WorkCenter } from '../../../types';
import { WorkCenterFormModal } from '../../../components/modals/WorkCenterFormModal';
import { INITIAL_CITIES } from '../../../data/mockEmployees';
import { Search, Building2, Plus, Edit3, Trash2, Filter, ShieldAlert, MapPin, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronDown, ChevronUp } from 'lucide-react';

export const WorkCentersView: React.FC = () => {
  const { workCenters, createWorkCenter, updateWorkCenter, deleteWorkCenter } = useWorkCenters();
  const { user: loggedInUser } = useAuth();

  const userCityId = loggedInUser?.role === 'ROOT' ? undefined : loggedInUser?.city_id;

  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState<string>(userCityId || 'ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedForEdit, setSelectedForEdit] = useState<WorkCenter | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ ciudad: false, estado: false });
  const toggleSection = (key: string) => setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, cityFilter, statusFilter, itemsPerPage]);

  const handleFormSubmit = (formData: Omit<WorkCenter, 'id'>) => {
    if (selectedForEdit) {
      const result = updateWorkCenter(selectedForEdit.id, formData);
      return result.success;
    } else {
      const result = createWorkCenter(formData);
      return result.success;
    }
  };

  const resolveCity = (cityId: string) => INITIAL_CITIES.find((c) => c.id === cityId)?.name ?? cityId;

  const scopeCities = userCityId
    ? INITIAL_CITIES.filter((c) => c.id === userCityId)
    : INITIAL_CITIES;

  const filtered = workCenters.filter((wc) => {
    const matchesSearch =
      wc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wc.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resolveCity(wc.city_id).toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCity = cityFilter === 'ALL' || wc.city_id === cityFilter;
    const matchesStatus = statusFilter === 'ALL' || wc.status === statusFilter;

    return matchesSearch && matchesCity && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = useMemo(
    () => filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [filtered, currentPage, itemsPerPage]
  );

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-600/10';
      case 'INACTIVE': return 'bg-slate-100 text-slate-600 ring-1 ring-slate-600/10';
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

      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, dirección o ciudad..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm placeholder-slate-400 text-slate-800 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 lg:hidden">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">Ciudades</option>
              {scopeCities.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">Estados</option>
              <option value="ACTIVE">Activos</option>
              <option value="INACTIVE">Inactivos</option>
            </select>
          </div>

          <button
            onClick={() => { setSelectedForEdit(undefined); setIsModalOpen(true); }}
            disabled={isReadOnlyOperator}
            className={`flex items-center gap-1.5 px-4 py-2 text-white font-semibold text-xs rounded-xl shadow-xs ${isReadOnlyOperator ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            <Plus className="h-4 w-4" />
            <span>Crear</span>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2.5">
          <button
            onClick={() => { setSelectedForEdit(undefined); setIsModalOpen(true); }}
            disabled={isReadOnlyOperator}
            className={`flex items-center gap-1.5 px-4 py-2 text-white font-semibold text-xs rounded-xl shadow-xs ${isReadOnlyOperator ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            <Plus className="h-4 w-4" />
            <span>Crear Centro</span>
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
                    <th className="py-3 px-6">Centro / Dirección</th>
                    <th className="py-3 px-4 w-28 text-center">Ciudad</th>
                    <th className="py-3 px-4 w-20 text-center">Estado</th>
                    <th className="py-3 px-4 w-24 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-slate-400 font-medium">
                        No se encontraron centros de trabajo que coincidan con los criterios de búsqueda o filtros seleccionados.
                      </td>
                    </tr>
                  ) : (
                    paginated.map((wc) => (
                      <tr key={wc.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
                              <Building2 className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 leading-tight">{wc.name}</div>
                              <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                <MapPin className="h-3 w-3 text-slate-300 inline" />
                                <span>{wc.address}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex justify-center">
                            <span className="inline-flex px-2 py-0.5 text-[10px] font-extrabold rounded-md border bg-sky-100 text-sky-800 border-sky-200">
                              {resolveCity(wc.city_id)}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex justify-center">
                            <button
                              onClick={() => {
                                const newStatus = wc.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
                                updateWorkCenter(wc.id, { status: newStatus });
                              }}
                              disabled={isReadOnlyOperator}
                              title={wc.status === 'ACTIVE' ? 'Desactivar' : 'Activar'}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all cursor-pointer ${
                                wc.status === 'ACTIVE'
                                  ? 'bg-emerald-500 hover:bg-emerald-600 shadow-sm shadow-emerald-500/30'
                                  : 'bg-slate-300 hover:bg-slate-400'
                              } ${isReadOnlyOperator ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              <span className={`inline-block h-3 w-3 transform rounded-full bg-white shadow-sm transition-transform ${
                                wc.status === 'ACTIVE' ? 'translate-x-4' : 'translate-x-1'
                              }`} />
                            </button>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex justify-center gap-1.5">
                            <button
                              onClick={() => { setSelectedForEdit(wc); setIsModalOpen(true); }}
                              title="Modificar centro de trabajo"
                              className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg border border-transparent hover:border-amber-200 transition-colors cursor-pointer"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => {
                                if (confirm(`¿Estás completamente seguro de eliminar el centro de trabajo "${wc.name}" del sistema?`)) {
                                  deleteWorkCenter(wc.id);
                                }
                              }}
                              title="Eliminar centro de trabajo"
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
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
                <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1 || totalPages === 0} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-40" title="Primera página">
                  <ChevronsLeft className="h-4 w-4" />
                </button>
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1 || totalPages === 0} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-40" title="Página anterior">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-40" title="Página siguiente">
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages || totalPages === 0} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-40" title="Última página">
                  <ChevronsRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex lg:flex-col lg:w-64 flex-shrink-0 lg:space-y-3">
          {(() => { const o = openSections.ciudad; return (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <button onClick={() => toggleSection('ciudad')} className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hover:bg-slate-50 transition-colors">
              Ciudad
              {o ? <ChevronUp className="h-3.5 w-3.5 text-slate-400" /> : <ChevronDown className="h-3.5 w-3.5 text-slate-400" />}
            </button>
            {o && (
            <div className="px-4 pb-3 space-y-1">
              <button onClick={() => setCityFilter('ALL')} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${cityFilter === 'ALL' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}>Todas las Ciudades</button>
              {scopeCities.map((city) => (
                <button key={city.id} onClick={() => setCityFilter(city.id)} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${cityFilter === city.id ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}>{city.name}</button>
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
              {(['ACTIVE', 'INACTIVE'] as const).map((status) => (
                <button key={status} onClick={() => setStatusFilter(status)} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${statusFilter === status ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}>{status === 'ACTIVE' ? 'Activos' : 'Inactivos'}</button>
              ))}
            </div>
            )}
          </div>
          )})()}
        </div>
      </div>

      <WorkCenterFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        editingWorkCenter={selectedForEdit}
      />

    </div>
  );
};
