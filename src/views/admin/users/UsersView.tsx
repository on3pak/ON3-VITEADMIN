import React, { useState, useMemo } from 'react';
import { useUsers } from '../../../context/UserContext';
import { useAuth } from '../../../context/AuthContext';
import { User, UserRole } from '../../types';
import { UserFormModal } from '../../../components/modals/UserFormModal';
import { 
  Search, 
  UserPlus, 
  Edit3, 
  Trash2, 
  Filter, 
  ShieldAlert, 
  Mail,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const UsersView: React.FC = () => {
  const { users, createUser, updateUser, deleteUser } = useUsers();
  const { user: loggedInUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<User | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ rol: false, estado: false });
  const toggleSection = (key: string) => setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, statusFilter, itemsPerPage]);

  const handleFormSubmit = (formData: Omit<User, 'id' | 'created_at' | 'updated_at'>) => {
    if (selectedUserForEdit) {
      if (selectedUserForEdit.role === 'ROOT' && loggedInUser?.role !== 'ROOT') {
        alert('⚠️ No se puede modificar la cuenta ROOT. Esta cuenta está protegida por el sistema.');
        return false;
      }
      const result = updateUser(selectedUserForEdit.id, formData);
      return result.success;
    } else {
      const result = createUser(formData);
      return result.success;
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedUserForEdit(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (userToEdit: User) => {
    setSelectedUserForEdit(userToEdit);
    setIsModalOpen(true);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(
    () => filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [filteredUsers, currentPage, itemsPerPage]
  );

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case 'ROOT': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'ADMIN': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'MANAGER': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'USER': return 'bg-app-bg text-app-text border-app-border';
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-600/10';
      case 'INACTIVE': return 'bg-app-bg text-app-text-secondary ring-1 ring-slate-600/10';
      default: return 'bg-app-bg text-app-text';
    }
  };

  const handleToggleStatus = (user: User) => {
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    updateUser(user.id, { status: newStatus });
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

      <div className="bg-app-card p-3 sm:p-4 rounded-2xl border border-app-card-border shadow-xs flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        <div className="relative flex-1 min-w-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-app-text-secondary">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, @username o correo..."
            className="w-full min-w-0 pl-9 pr-4 py-2 border border-app-border rounded-xl text-sm placeholder-slate-400 text-app-text focus:outline-hidden focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 lg:hidden">
          <div className="flex items-center gap-1.5 bg-app-bg border border-app-border rounded-xl px-2.5 py-1.5">
            <Filter className="h-3.5 w-3.5 text-app-text-secondary" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-app-text focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">Roles</option>
              <option value="ROOT">ROOT</option>
              <option value="ADMIN">ADMIN</option>
              <option value="MANAGER">MANAGER</option>
              <option value="USER">USER</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-app-bg border border-app-border rounded-xl px-2.5 py-1.5">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-app-text focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">Estados</option>
              <option value="ACTIVE">Activos</option>
              <option value="INACTIVE">Inactivos</option>
            </select>
          </div>

          <button
            onClick={handleOpenCreateModal}
            disabled={isReadOnlyOperator}
            className={`flex items-center gap-1.5 px-4 py-2 text-white font-semibold text-xs rounded-xl shadow-xs ${isReadOnlyOperator ? 'bg-app-text-secondary cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'}`}
          >
            <UserPlus className="h-4 w-4" />
            <span>Crear</span>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2.5">
          <button
            onClick={handleOpenCreateModal}
            disabled={isReadOnlyOperator}
            className={`flex items-center gap-1.5 px-4 py-2 text-white font-semibold text-xs rounded-xl shadow-xs ${isReadOnlyOperator ? 'bg-app-text-secondary cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'}`}
          >
            <UserPlus className="h-4 w-4" />
            <span>Crear Usuario</span>
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
                <th className="py-3 px-6">Identidad / Cuenta</th>
                <th className="py-3 px-4 w-28 text-center">Rol</th>
                <th className="py-3 px-4 w-20 text-center">Estado</th>
                <th className="py-3 px-4 w-24 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-app-text text-sm">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-app-text-secondary font-medium">
                    No se encontraron usuarios que coincidan con los criterios de búsqueda o filtros seleccionados.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-app-bg/70 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <img 
                          src={`https://api.dicebear.com/7.x/bottts/svg?seed=${u.username}`} 
                          alt={u.full_name} 
                          className="w-9 h-9 rounded-lg bg-app-bg border p-0.5"
                        />
                        <div>
                          <div className="font-bold text-app-text-secondary leading-tight">{u.full_name}</div>
                          <div className="text-xs text-app-text-secondary flex items-center gap-1 mt-0.5">
                            <span className="font-mono text-primary-600 font-semibold">@{u.username}</span>
                            <span>•</span>
                            <Mail className="h-3 w-3 text-app-text-secondary inline" />
                            <span className="truncate max-w-[140px]">{u.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex justify-center">
                        <span className={`inline-flex px-2 py-0.5 text-[10px] font-extrabold rounded-md border ${getRoleBadgeStyle(u.role)}`}>
                          {u.role}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex justify-center">
                        {u.role === 'ROOT' && loggedInUser?.role !== 'ROOT' ? (
                          <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full ${
                            u.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-app-bg text-app-text-secondary'
                          }`}>
                            {u.status}
                          </span>
                        ) : (
                          <button
                            onClick={() => handleToggleStatus(u)}
                            disabled={loggedInUser?.role === 'USER'}
                            title={u.status === 'ACTIVE' ? 'Desactivar' : 'Activar'}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all cursor-pointer ${
                              u.status === 'ACTIVE' 
                                ? 'bg-emerald-500 hover:bg-emerald-600 shadow-sm shadow-emerald-500/30' 
                                : 'bg-app-border hover:bg-app-text-secondary'
                            } ${loggedInUser?.role === 'USER' ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <span className={`inline-block h-3 w-3 transform rounded-full bg-white shadow-sm transition-transform ${
                              u.status === 'ACTIVE' ? 'translate-x-4' : 'translate-x-1'
                            }`} />
                          </button>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex justify-center gap-1.5">
                        {u.role === 'ROOT' && loggedInUser?.role === 'ROOT' && (
                          <>
                            <button
                              onClick={() => handleOpenEditModal(u)}
                              title="Modificar registro de usuario"
                              className="p-1.5 text-app-text-secondary hover:text-amber-600 hover:bg-amber-50 rounded-lg border border-transparent hover:border-amber-200 transition-colors cursor-pointer"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>

                            {u.id !== loggedInUser?.id && (
                              <button
                                onClick={() => {
                                  if (confirm(`¿Estás completamente seguro de dar de baja y remover al usuario "${u.full_name}" del sistema?`)) {
                                    deleteUser(u.id);
                                  }
                                }}
                                title="Eliminar usuario del sistema"
                                className="p-1.5 text-app-text-secondary hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </>
                        )}
                        {u.role !== 'ROOT' && (
                          <>
                            <button
                              onClick={() => handleOpenEditModal(u)}
                              title="Modificar registro de usuario"
                              className="p-1.5 text-app-text-secondary hover:text-amber-600 hover:bg-amber-50 rounded-lg border border-transparent hover:border-amber-200 transition-colors cursor-pointer"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => {
                                if (confirm(`¿Estás completamente seguro de dar de baja y remover al usuario "${u.full_name}" del sistema?`)) {
                                  deleteUser(u.id);
                                }
                              }}
                              title="Eliminar usuario del sistema"
                              className="p-1.5 text-app-text-secondary hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
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
            <button 
              onClick={() => setCurrentPage(1)} 
              disabled={currentPage === 1 || totalPages === 0} 
              className="p-1.5 rounded-lg text-app-text-secondary hover:bg-primary-50 hover:text-primary-600 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-app-text-secondary transition-colors"
              title="Primera página"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} 
              disabled={currentPage === 1 || totalPages === 0} 
              className="p-1.5 rounded-lg text-app-text-secondary hover:bg-primary-50 hover:text-primary-600 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-app-text-secondary transition-colors"
              title="Página anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} 
              disabled={currentPage === totalPages || totalPages === 0} 
              className="p-1.5 rounded-lg text-app-text-secondary hover:bg-primary-50 hover:text-primary-600 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-app-text-secondary transition-colors"
              title="Página siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setCurrentPage(totalPages)} 
              disabled={currentPage === totalPages || totalPages === 0} 
              className="p-1.5 rounded-lg text-app-text-secondary hover:bg-primary-50 hover:text-primary-600 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-app-text-secondary transition-colors"
              title="Última página"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
        </div>

        <div className="hidden lg:flex lg:flex-col lg:w-64 flex-shrink-0 lg:space-y-3">
          {(() => { const o = openSections.rol; return (
          <div className="bg-app-card rounded-2xl border border-app-card-border shadow-xs overflow-hidden">
            <button onClick={() => toggleSection('rol')} className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-app-text-secondary uppercase tracking-wider hover:bg-app-bg transition-colors">
              Rol
              {o ? <ChevronUp className="h-3.5 w-3.5 text-app-text-secondary" /> : <ChevronDown className="h-3.5 w-3.5 text-app-text-secondary" />}
            </button>
            {o && (
            <div className="px-4 pt-2 pb-3 space-y-1">
              <button onClick={() => setRoleFilter('ALL')} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${roleFilter === 'ALL' ? 'bg-primary-100 text-primary-700 font-semibold' : 'text-app-text-secondary hover:bg-app-bg'}`}>Todos los Roles</button>
              {(['ROOT', 'ADMIN', 'MANAGER', 'USER'] as const).map((role) => (
                <button key={role} onClick={() => setRoleFilter(role)} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${roleFilter === role ? 'bg-primary-100 text-primary-700 font-semibold' : 'text-app-text-secondary hover:bg-app-bg'}`}>{role}</button>
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
              <button onClick={() => setStatusFilter('ALL')} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${statusFilter === 'ALL' ? 'bg-primary-100 text-primary-700 font-semibold' : 'text-app-text-secondary hover:bg-app-bg'}`}>Todos los Estados</button>
              {(['ACTIVE', 'INACTIVE'] as const).map((status) => (
                <button key={status} onClick={() => setStatusFilter(status)} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${statusFilter === status ? 'bg-primary-100 text-primary-700 font-semibold' : 'text-app-text-secondary hover:bg-app-bg'}`}>{status === 'ACTIVE' ? 'Activos' : 'Inactivos'}</button>
              ))}
            </div>
            )}
          </div>
          )})()}
        </div>
      </div>

      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        editingUser={selectedUserForEdit}
      />

    </div>
  );
};

