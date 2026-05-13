import React, { useState, useEffect } from 'react';
import { WorkCenter } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { INITIAL_CITIES } from '../../data/mockEmployees';
import { X, ShieldAlert, Save, Building2 } from 'lucide-react';

interface WorkCenterFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<WorkCenter, 'id'>) => boolean;
  editingWorkCenter?: WorkCenter;
}

export const WorkCenterFormModal: React.FC<WorkCenterFormModalProps> = ({ isOpen, onClose, onSubmit, editingWorkCenter }) => {
  const { user: currentUser } = useAuth();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [cityId, setCityId] = useState('city-1');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (editingWorkCenter) {
      setName(editingWorkCenter.name);
      setAddress(editingWorkCenter.address);
      setCityId(editingWorkCenter.cityId);
      setStatus(editingWorkCenter.status);
    } else {
      setName('');
      setAddress('');
      setCityId('city-1');
      setStatus('ACTIVE');
    }
    setFormError(null);
  }, [editingWorkCenter, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim() || !address.trim()) {
      setFormError('Nombre y dirección son obligatorios.');
      return;
    }

    const success = onSubmit({
      name: name.trim(),
      address: address.trim(),
      cityId,
      status,
    });

    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden animate-scale-in">

        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${editingWorkCenter ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}>
              {editingWorkCenter ? <Save className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="font-bold text-slate-800">
                {editingWorkCenter ? `Editar Centro: ${editingWorkCenter.name}` : 'Registrar Nuevo Centro'}
              </h3>
              <p className="text-xs text-slate-400">Datos del centro de trabajo</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2 font-medium">
              <ShieldAlert className="h-4 w-4 text-rose-500 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Nombre del Centro *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Nave Central" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-800" />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Dirección *</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Ej. Calle Industria 42" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-800" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Ciudad</label>
              <select value={cityId} onChange={(e) => setCityId(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-800">
                {INITIAL_CITIES.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Estado</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as 'ACTIVE' | 'INACTIVE')} className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-800">
                <option value="ACTIVE">Activo</option>
                <option value="INACTIVE">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 text-sm font-semibold rounded-xl transition-colors cursor-pointer">Cancelar</button>
            <button type="submit" className={`px-5 py-2 text-white text-sm font-semibold rounded-xl transition-all shadow-xs cursor-pointer ${editingWorkCenter ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/10' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/10'}`}>
              {editingWorkCenter ? 'Guardar Cambios' : 'Registrar Centro'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
