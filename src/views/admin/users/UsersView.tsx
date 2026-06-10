import React, { useState, useMemo, useEffect } from 'react';
import { useUsers } from '../../../context/UserContext';
import { useAuth } from '../../../context/AuthContext';
import { User, UserRole } from '../../types';
import { UserFormModal } from '../../../components/modals/UserFormModal';
import { ConfirmDialog } from '../../../components/modals/ConfirmDialog';
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
  UserX,
  RotateCcw,
  ArrowLeft,
} from 'lucide-react';

export const UsersView: React.FC = () => {
  const { users, loadUsers, createUser, updateUser, deleteUser, hardDeleteUser, restoreUser } = useUsers();
  const { user: loggedInUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<User | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showDeleted, setShowDeleted] = useState(false);
  const [hardDeleteDialog, setHardDeleteDialog] = useState<{ open: boolean; userId: string | null }>({ open: false, userId: null });
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ rol: false });
  const toggleSection = (key: string) => setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  useEffect(() => { loadUsers(); }, [loadUsers]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, itemsPerPage, showDeleted]);

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

  const activeUsers = useMemo(() => {
    return users.filter((u) => u.status !== 'DELETED');
  }, [users]);

  const deletedUsers = useMemo(() => {
    return users.filter((u) => u.status === 'DELETED');
  }, [users]);

  const filteredActiveUsers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return activeUsers.filter((u) => {
      const matchesSearch =
        u.full_name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);

      const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [activeUsers, searchQuery, roleFilter]);

  const filteredDeletedUsers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return deletedUsers.filter((u) => {
      return (
        u.full_name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      );
    });
  }, [deletedUsers, searchQuery]);

  const currentList = showDeleted ? filteredDeletedUsers : filteredActiveUsers;
  const totalPages = useMemo(() => Math.ceil(currentList.length / itemsPerPage), [currentList, itemsPerPage]);
  const paginatedUsers = useMemo(
    () => currentList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [currentList, currentPage, itemsPerPage]
  );

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case 'ROOT': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'ADMIN': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'MANAGER': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'USER': return 'bg-app-bg text-app-text border-app-border';
    }
  };

  const isReadOnlyOperator = loggedInUser?.role === 'USER';

  const canModifyUser = (targetUser: User): boolean => {
    if (isReadOnlyOperator) return false;
    if (targetUser.id === loggedInUser?.id) return false;
    if (targetUser.role === 'ROOT' && loggedInUser?.role !== 'ROOT') return false;
    return true;
  };

  const renderUserRow = (u: User, isDeletedView: boolean) => (
    <tr key={u.id} className="hover:bg-app-bg/70 transition-colors">
      <td className="py-3.5 px-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold border border-gray-200">
            {u.full_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
          </div>
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
        <div className="flex justify-center gap-1.5">
          {u.id === loggedInUser?.id && (
            <button
              onClick={() => handleOpenEditModal(u)}
              title="Editar mis datos"
              className="p-1.5 text-app-text-secondary hover:text-amber-600 hover:bg-amber-50 rounded-lg border border-transparent hover:border-amber-200 transition-colors cursor-pointer"
            >
              <Edit3 className="h-4 w-4" />
            </button>
          )}
          {isDeletedView ? (
            <>
              <button
                onClick={() => restoreUser(u.id)}
                title="Recuperar usuario"
                className="p-1.5 text-app-text-secondary hover:text-emerald-600 hover:bg-emerald-50 rounded-lg border border-transparent hover:border-emerald-200 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setHardDeleteDialog({ open: true, userId: u.id })}
                title="Borrar definitivamente"
                className="p-1.5 text-app-text-secondary hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          ) : (
            canModifyUser(u) && (
              <button
                onClick={() => deleteUser(u.id)}
                title="Dar de baja"
                className="p-1.5 text-app-text-secondary hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
              >
                <UserX className="h-4 w-4" />
              </button>
            )
          )}
        </div>
      </td>
    </tr>
  );

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
            placeholder={showDeleted ? "Buscar en usuarios dados de baja..." : "Buscar por nombre, @username o correo..."}
            className="w-full min-w-0 pl-9 pr-4 py-2 border border-app-border rounded-xl text-sm placeholder-slate-400 text-app-text focus:outline-hidden focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 xl:hidden">
          {!showDeleted && (
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
          )}
          <button
            onClick={() => { setShowDeleted(!showDeleted); setCurrentPage(1); }}
            className={`flex items-center gap-1.5 px-3 py-2 border font-semibold text-xs rounded-xl transition-colors ${showDeleted ? 'bg-rose-50 text-rose-700 border-rose-200' : 'text-rose-700 border-rose-200 bg-rose-50 hover:bg-rose-100'}`}
          >
            {showDeleted ? <ArrowLeft className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
            <span>{showDeleted ? 'Volver' : `Baja (${deletedUsers.length})`}</span>
          </button>
          {!showDeleted && (
            <button
              onClick={handleOpenCreateModal}
              disabled={isReadOnlyOperator}
              className={`flex items-center gap-1.5 px-4 py-2 text-white font-semibold text-xs rounded-xl shadow-xs ${isReadOnlyOperator ? 'bg-app-text-secondary cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'}`}
            >
              <UserPlus className="h-4 w-4" />
              <span>Crear</span>
            </button>
          )}
        </div>

        <div className="hidden xl:flex items-center gap-2.5">
          {showDeleted ? (
            <button
              onClick={() => { setShowDeleted(false); setCurrentPage(1); }}
              className="flex items-center gap-1.5 px-4 py-2 text-app-text border border-app-border bg-white hover:bg-app-bg font-semibold text-xs rounded-xl shadow-xs transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Volver a usuarios activos</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => { setShowDeleted(true); setCurrentPage(1); }}
                className="flex items-center gap-1.5 px-4 py-2 text-rose-700 border border-rose-200 bg-rose-50 hover:bg-rose-100 font-semibold text-xs rounded-xl shadow-xs transition-colors"
              >
                <UserX className="h-4 w-4" />
                <span>Ver dados de baja</span>
              </button>
              <button
                onClick={handleOpenCreateModal}
                disabled={isReadOnlyOperator}
                className={`flex items-center gap-1.5 px-4 py-2 text-white font-semibold text-xs rounded-xl shadow-xs ${isReadOnlyOperator ? 'bg-app-text-secondary cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'}`}
              >
                <UserPlus className="h-4 w-4" />
                <span>Crear Usuario</span>
              </button>
            </>
          )}
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
                <th className="py-3 px-4 w-24 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-app-text text-sm">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-app-text-secondary font-medium">
                    {showDeleted
                      ? 'No hay usuarios dados de baja.'
                      : 'No se encontraron usuarios que coincidan con los criterios de búsqueda o filtros seleccionados.'}
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((u) => renderUserRow(u, showDeleted))
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

        <div className="hidden xl:flex xl:flex-col xl:w-64 flex-shrink-0 xl:space-y-3">
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

          {!showDeleted && (
            <button
              onClick={() => { setShowDeleted(true); setCurrentPage(1); }}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 hover:border-rose-300 transition-colors"
            >
              <UserX className="h-4 w-4" />
              Ver dados de baja ({deletedUsers.length})
            </button>
          )}
        </div>
      </div>

      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        editingUser={selectedUserForEdit}
      />

      <ConfirmDialog
        isOpen={hardDeleteDialog.open}
        title="Borrar definitivamente"
        message="¿Estás seguro de borrar este usuario definitivamente? Esta acción no se puede deshacer."
        onConfirm={() => {
          if (hardDeleteDialog.userId) hardDeleteUser(hardDeleteDialog.userId);
          setHardDeleteDialog({ open: false, userId: null });
        }}
        onCancel={() => setHardDeleteDialog({ open: false, userId: null })}
      />

    </div>
  );
};
