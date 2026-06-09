import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useUsers } from '../../context/UserContext';
import { useEmployees } from '../../context/EmployeeContext';
import { X, ShieldAlert, UserPlus, Save, Search, CheckCircle2, AlertCircle } from 'lucide-react';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<User, 'id' | 'created_at' | 'updated_at'>) => boolean;
  editingUser?: User;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({ isOpen, onClose, onSubmit, editingUser }) => {
  const { user: currentLoggedUser } = useAuth();
  const { users } = useUsers();
  const { employees, getEmployeeById } = useEmployees();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('USER');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [employeeId, setEmployeeId] = useState('');
  const [employeeLookupStatus, setEmployeeLookupStatus] = useState<'idle' | 'found' | 'taken' | 'not_found'>('idle');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const employeeNameMap = new Map(employees.map((e) => [e.id, `${e.name} ${e.last_name1} ${e.last_name2}`.replace(/\s+$/, '')]));
  const usersEmployeeSet = new Set(users.map((u) => u.employee_id));

  useEffect(() => {
    if (editingUser) {
      setFullName(editingUser.full_name);
      setUsername(editingUser.username);
      setEmail(editingUser.email);
      setRole(editingUser.role);
      setStatus(editingUser.status);
      setEmployeeId(editingUser.employee_id || '');
    } else {
      setFullName('');
      setUsername('');
      setEmail('');
      setRole('USER');
      setStatus('ACTIVE');
      setEmployeeId('');
    }
    setFormError(null);
    setFormSuccess(null);
    setEmployeeLookupStatus('idle');
  }, [editingUser, isOpen]);

  const handleEmployeeSearch = () => {
    if (!employeeId.trim() || editingUser) { setEmployeeLookupStatus('idle'); return; }
    const eid = employeeId.trim();

    setFormError(null);
    setFormSuccess(null);

    if (usersEmployeeSet.has(eid)) {
      setEmployeeLookupStatus('taken');
      setFormError(`El empleado con ID "${eid}" ya tiene un usuario asignado.`);
      setUsername(''); setFullName(''); setEmail('');
      return;
    }

    const emp = getEmployeeById(eid);
    if (emp) {
      setEmployeeLookupStatus('found');
      setFormError(null);
      setFormSuccess(`Empleado ${emp.name} ${emp.last_name1} encontrado. Datos autocompletados.`);
      setFullName(`${emp.name} ${emp.last_name1} ${emp.last_name2}`.replace(/\s+$/, ''));
      const initial = emp.name.charAt(0);
      const rawUsername = `${initial}.${emp.last_name1}`;
      setUsername(rawUsername.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase());
      setEmail(`${eid}@on3.com`);
    } else {
      setEmployeeLookupStatus('not_found');
      setFormError(`No se encontró un empleado con ID "${eid}".`);
      setUsername(''); setFullName(''); setEmail('');
    }
  };

  const handleEmployeeIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployeeId(e.target.value);
    setEmployeeLookupStatus('idle');
    setFormError(null);
    setFormSuccess(null);
    setUsername(''); setFullName(''); setEmail('');
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (employeeLookupStatus === 'taken') {
      setFormError('Este empleado ya tiene un usuario asignado.');
      return;
    }

    if (employeeLookupStatus !== 'found') {
      setFormError('Debes buscar un empleado válido antes de crear el usuario.');
      return;
    }

    if (username.trim().length < 3) {
      setFormError('El nombre de usuario debe contener al menos 3 caracteres.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setFormError('El formato de correo electrónico ingresar no es válido.');
      return;
    }

    if (role === 'ROOT' && currentLoggedUser?.role !== 'ROOT') {
      setFormError('Solo el usuario ROOT puede crear cuentas con rol ROOT.');
      return;
    }

    const success = onSubmit({
      full_name: fullName.trim(),
      username: username.trim(),
      email: email.trim(),
      role,
      status,
      language: 'ES',
      employee_id: employeeId.trim() || null,
    });

    if (success) {
      onClose();
    }
  };

  // Helper notice text on role hierarchies depending on current operator role
  const isRoleSelectionDisabled = (roleOption: UserRole) => {
    if (!currentLoggedUser) return true;
    if (currentLoggedUser.role === 'ROOT') return false;
    
    // ADMIN can choose ADMIN, MANAGER, USER but can never select or assign ROOT role
    if (currentLoggedUser.role === 'ADMIN') {
      return roleOption === 'ROOT';
    }
    
    // MANAGER can only choose USER or MANAGER, can't assign ADMIN or ROOT roles
    if (currentLoggedUser.role === 'MANAGER') {
      return roleOption === 'ROOT' || roleOption === 'ADMIN';
    }

    return true; // USER role cannot select anything
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-sidebar/80 backdrop-blur-xs">
      <div className="bg-app-card rounded-2xl shadow-xl w-full max-w-lg border border-app-card-border overflow-hidden animate-scale-in">
        
        {/* Header Title */}
        <div className="px-6 py-4 bg-app-bg border-b border-app-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${editingUser ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}>
              {editingUser ? <Save className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="font-bold text-app-text">
                {editingUser ? `Editar Usuario: @${editingUser.username}` : 'Registrar Nuevo Usuario'}
              </h3>
              <p className="text-xs text-app-text-secondary">Completa los parámetros de acceso y privilegios</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-app-text-secondary hover:text-app-text-secondary p-1.5 hover:bg-app-bg rounded-lg transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2 font-medium">
              <ShieldAlert className="h-4 w-4 text-rose-500 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}
          {formSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
              <span>{formSuccess}</span>
            </div>
          )}

          {/* Form fields layout */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Employee ID (first field, full width) */}
            {!editingUser && (
              <div className="col-span-2">
                <label className="block text-xs font-bold text-app-text uppercase tracking-wide mb-1">
                  ID de Empleado
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-app-text-secondary">
                      <Search className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      value={employeeId}
                      onChange={handleEmployeeIdChange}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleEmployeeSearch(); } }}
                      placeholder="Ej. 000001"
                      className="w-full pl-9 pr-10 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-app-text"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      {employeeLookupStatus === 'found' && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                      {employeeLookupStatus === 'taken' && <AlertCircle className="h-4 w-4 text-rose-500" />}
                      {employeeLookupStatus === 'not_found' && <AlertCircle className="h-4 w-4 text-amber-500" />}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleEmployeeSearch}
                    disabled={!employeeId.trim()}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-app-text-secondary/40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors shrink-0"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Username 50% + Full Name 50% (both disabled) */}
            <div>
              <label className="block text-xs font-bold text-app-text uppercase tracking-wide mb-1">
                Nombre de Usuario *
              </label>
              <input
                type="text"
                value={username ? `@${username}` : ''}
                onChange={(e) => setUsername(e.target.value.replace(/^@/, ''))}
                disabled
                placeholder="@usuario"
                className="w-full px-3 py-2 border border-app-border rounded-xl text-sm bg-app-bg opacity-70 cursor-not-allowed text-app-text"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-app-text uppercase tracking-wide mb-1">
                Nombre Completo *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled
                placeholder="Ej. Juan Pérez González"
                className="w-full px-3 py-2 border border-app-border rounded-xl text-sm bg-app-bg opacity-70 cursor-not-allowed text-app-text"
              />
            </div>

            {/* Email (disabled) */}
            <div className="col-span-2">
              <label className="block text-xs font-bold text-app-text uppercase tracking-wide mb-1">
                Correo Electrónico *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled
                placeholder="correo@on3.com"
                className="w-full px-3 py-2 border border-app-border rounded-xl text-sm bg-app-bg opacity-70 cursor-not-allowed text-app-text"
              />
            </div>

            {/* Role Assignment Dropdown */}
            <div className="col-span-2">
              <label className="block text-xs font-bold text-app-text uppercase tracking-wide mb-1">
                Rol de Privilegio (RBAC)
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 border border-app-border rounded-xl bg-white text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-app-text"
              >
                <option value="USER" disabled={isRoleSelectionDisabled('USER')}>USER (Lectura Básica)</option>
                <option value="MANAGER" disabled={isRoleSelectionDisabled('MANAGER')}>MANAGER (Gestión Media)</option>
                <option value="ADMIN" disabled={isRoleSelectionDisabled('ADMIN')}>ADMIN (Alto Control)</option>
                <option value="ROOT" disabled={isRoleSelectionDisabled('ROOT')}>ROOT (Acceso Total)</option>
              </select>
            </div>

          </div>

          {/* Role hierarchy disclaimer */}
          <div className="p-3 rounded-xl bg-app-bg border border-app-border text-[11px] text-app-text-secondary space-y-1">
            <span className="font-bold text-app-text block">ℹ️ Restricciones jerárquicas en ejecución:</span>
            <p>Los mánagers solo crean/editan mánagers y usuarios comunes. Los administradores controlan todos excepto cuentas del ROOT supremo.</p>
          </div>

          {/* Action buttons footer */}
          <div className="pt-3 border-t border-app-border flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 hover:bg-app-bg text-app-text-secondary text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-5 py-2 text-white text-sm font-semibold rounded-xl transition-all shadow-xs cursor-pointer ${
                editingUser 
                  ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/10' 
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/10'
              }`}
            >
              {editingUser ? 'Guardar Cambios' : 'Registrar Cuenta'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
