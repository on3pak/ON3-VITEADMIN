import React, { useState, useEffect } from 'react';
import { MachineryItem } from '../../types';
import { useLookupsContext } from '../../context/LookupContext';
import { MACHINERY_SUBTYPES, MACHINERY_STATUSES } from '../../data/mockMachinery';
import { X, Save, Wrench } from 'lucide-react';

interface MachineryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<MachineryItem, 'id' | 'created_at' | 'updated_at'>) => boolean;
  editingItem?: MachineryItem;
}

export const MachineryFormModal: React.FC<MachineryFormModalProps> = ({ isOpen, onClose, onSubmit, editingItem }) => {
  const { workCenters } = useLookupsContext();

  const wcCityMap = Object.fromEntries(
    workCenters.map((wc) => [wc.id, wc.city_id])
  );

  const [name, setName] = useState('');
  const [subtype_id, setSubtype_id] = useState('');
  const [status_id, setStatus_id] = useState('ms-1');
  const [quantity, setQuantity] = useState(1);
  const [work_center_id, setWork_center_id] = useState('wc_000009');
  const [assigned_to, setAssigned_to] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [serial_number, setSerial_number] = useState('');
  const [warranty_expiration, setWarranty_expiration] = useState('');
  const [last_maintenance, setLast_maintenance] = useState('');
  const [next_maintenance, setNext_maintenance] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setSubtype_id(editingItem.subtype_id);
      setStatus_id(editingItem.status_id);
      setQuantity(editingItem.quantity);
      setWork_center_id(editingItem.work_center_id);
      setAssigned_to(editingItem.assigned_to || '');
      setBrand(editingItem.brand || '');
      setModel(editingItem.model || '');
      setSerial_number(editingItem.serial_number || '');
      setWarranty_expiration(editingItem.warranty_expiration || '');
      setLast_maintenance(editingItem.last_maintenance || '');
      setNext_maintenance(editingItem.next_maintenance || '');
      setNotes(editingItem.notes || '');
    } else {
      setName('');
      setSubtype_id('');
      setStatus_id('ms-1');
      setQuantity(1);
      setWork_center_id('wc_000009');
      setAssigned_to('');
      setBrand('');
      setModel('');
      setSerial_number('');
      setWarranty_expiration('');
      setLast_maintenance('');
      setNext_maintenance('');
      setNotes('');
    }
    setFormError(null);
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('El nombre es obligatorio.');
      return;
    }
    if (!subtype_id) {
      setFormError('Selecciona un tipo de maquinaria.');
      return;
    }
    if (quantity < 0) {
      setFormError('La cantidad no puede ser negativa.');
      return;
    }

    const success = onSubmit({
      name: name.trim(),
      description: '',
      subtype_id,
      status_id: status_id as MachineryItem['status_id'],
      quantity,
      min_stock: 0,
      unit: 'unidades',
      city_id: wcCityMap[work_center_id] || 'ci_000001',
      work_center_id,
      location: '',
      brand: brand || null,
      model: model || null,
      serial_number: serial_number || null,
      warranty_expiration: warranty_expiration || null,
      last_maintenance: last_maintenance || null,
      next_maintenance: next_maintenance || null,
      assigned_to: assigned_to || null,
      notes,
    });

    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-sidebar/80" onClick={onClose}>
      <div className="bg-app-card rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-app-border">
          <h2 className="text-lg font-bold text-app-text flex items-center gap-2">
            <Wrench className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            {editingItem ? 'Editar Maquinaria' : 'Nueva Maquinaria'}
          </h2>
          <button onClick={onClose} className="p-1 text-app-text-secondary hover:text-app-text-secondary rounded-lg hover:bg-app-bg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {formError && (
            <div className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded-xl border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 font-medium">
              {formError}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Nombre *</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Sopladora STIHL BR600" className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 text-app-text" />
              </div>
              <div className="w-[30%]">
                <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Centro</label>
                <select value={work_center_id} onChange={(e) => setWork_center_id(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 text-app-text bg-app-card">
                  {workCenters.map((wc) => (
                    <option key={wc.id} value={wc.id}>{wc.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-[40%]">
                <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Tipo *</label>
                <select value={subtype_id} onChange={(e) => setSubtype_id(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 text-app-text bg-app-card">
                  <option value="">Seleccionar...</option>
                  {MACHINERY_SUBTYPES.map((st) => (
                    <option key={st.id} value={st.id}>{st.name}</option>
                  ))}
                </select>
              </div>
              <div className="w-[30%]">
                <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Estado</label>
                <select value={status_id} onChange={(e) => setStatus_id(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 text-app-text bg-app-card">
                  {MACHINERY_STATUSES.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="w-[30%]">
                <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Cantidad</label>
                <input type="number" min={0} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 text-app-text" />
              </div>
            </div>

            <div className="border-t border-app-border pt-4">
              <h3 className="text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-3">Especificaciones</h3>
              <div className="flex gap-3 mb-3">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Marca</label>
                  <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Ej: STIHL" className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 text-app-text" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Modelo</label>
                  <input type="text" value={model} onChange={(e) => setModel(e.target.value)} placeholder="Ej: BR 600" className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 text-app-text" />
                </div>
              </div>
              <div className="flex gap-3 mb-3">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Nº Serie</label>
                  <input type="text" value={serial_number} onChange={(e) => setSerial_number(e.target.value)} placeholder="Ej: STIHL-BR600-001" className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 text-app-text" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Garantía hasta</label>
                  <input type="date" value={warranty_expiration} onChange={(e) => setWarranty_expiration(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 text-app-text" />
                </div>
              </div>
            </div>

            <div className="border-t border-app-border pt-4">
              <h3 className="text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-3">Mantenimiento</h3>
              <div className="flex gap-3 mb-3">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Último mantenimiento</label>
                  <input type="date" value={last_maintenance} onChange={(e) => setLast_maintenance(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 text-app-text" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Próximo mantenimiento</label>
                  <input type="date" value={next_maintenance} onChange={(e) => setNext_maintenance(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 text-app-text" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Asignado a (ID empleado)</label>
              <input type="text" value={assigned_to} onChange={(e) => setAssigned_to(e.target.value)} placeholder="Ej: 000011" className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 text-app-text" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Notas</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Observaciones adicionales..." className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 text-app-text resize-none" />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-app-border">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-app-text-secondary bg-app-bg hover:bg-app-border dark:hover:bg-app-border rounded-xl transition-colors">
              Cancelar
            </button>
            <button type="submit" className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors">
              <Save className="h-4 w-4" />
              {editingItem ? 'Guardar Cambios' : 'Crear Maquinaria'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
