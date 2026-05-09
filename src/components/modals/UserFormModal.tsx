import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { X, ShieldAlert, UserPlus, Save } from 'lucide-react';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<User, 'id' | 'createdAt'>) => boolean;
  editingUser?: User;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({ isOpen, onClose, onSubmit, editingUser }) => {
  const { user: currentLoggedUser } = useAuth();
  
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('USER');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (editingUser) {
      setFullName(editingUser.fullName);
      setUsername(editingUser.username);
      setEmail(editingUser.email);
      setRole(editingUser.role);
      setStatus(editingUser.status);
    } else {
      setFullName('');
      setUsername('');
      setEmail('');
      setRole('USER');
      setStatus('ACTIVE');
    }
    setFormError(null);
  }, [editingUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fullName.trim() || !username.trim() || !email.trim()) {
      setFormError('Todos los campos con (*) son de carácter obligatorio.');
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
      fullName: fullName.trim(),
      username: username.trim(),
      email: email.trim(),
      role,
      status,
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
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden animate-scale-in">
        
        {/* Header Title */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${editingUser ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}>
              {editingUser ? <Save className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="font-bold text-slate-800">
                {editingUser ? `Editar Usuario: @${editingUser.username}` : 'Registrar Nuevo Usuario'}
              </h3>
              <p className="text-xs text-slate-400">Completa los parámetros de acceso y privilegios</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
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

          {/* Form fields layout */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Full Name */}
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Nombre Completo *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ej. Juan Pérez González"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-800"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Nombre de Usuario *
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={!!editingUser}
                placeholder="ej. jperez"
                className={`w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden text-slate-800 ${
                  editingUser ? 'bg-slate-100 cursor-not-allowed opacity-70' : 'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all'
                }`}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Correo Electrónico *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@empresa.com"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-800"
              />
            </div>

            {/* Role Assignment Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Rol de Privilegio (RBAC)
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-800"
              >
                <option value="USER" disabled={isRoleSelectionDisabled('USER')}>USER (Lectura Básica)</option>
                <option value="MANAGER" disabled={isRoleSelectionDisabled('MANAGER')}>MANAGER (Gestión Media)</option>
                <option value="ADMIN" disabled={isRoleSelectionDisabled('ADMIN')}>ADMIN (Alto Control)</option>
                <option value="ROOT" disabled={isRoleSelectionDisabled('ROOT')}>ROOT (Acceso Total)</option>
              </select>
            </div>

            {/* Status Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Estado Cuenta
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'ACTIVE' | 'INACTIVE')}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-800"
              >
                <option value="ACTIVE">Activo</option>
                <option value="INACTIVE">Inactivo</option>
              </select>
            </div>

          </div>

          {/* Role hierarchy disclaimer */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 space-y-1">
            <span className="font-bold text-slate-700 block">ℹ️ Restricciones jerárquicas en ejecución:</span>
            <p>Los mánagers solo crean/editan mánagers y usuarios comunes. Los administradores controlan todos excepto cuentas del ROOT supremo.</p>
          </div>

          {/* Action buttons footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
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
