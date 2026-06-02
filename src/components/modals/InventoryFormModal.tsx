import React, { useState, useEffect } from 'react';
import { InventoryItem, InventoryCategory, InventoryAttributes } from '../../types';
import { INVENTORY_CATEGORIES, INVENTORY_SUBTYPES, INVENTORY_WAREHOUSE_IDS, getStatusesForCategory, getSubtypesForCategory } from '../../data/mockInventory';
import { INITIAL_WORK_CENTERS } from '../../data/mockWorkCenters';
import { INITIAL_CITIES } from '../../data/mockEmployees';
import { X, Save, Shirt, Shield, Wrench } from 'lucide-react';

interface InventoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'>) => boolean;
  editingItem?: InventoryItem;
}

const CATEGORY_ICONS: Record<InventoryCategory, React.ReactNode> = {
  ropa: <Shirt className="h-4 w-4" />,
  epi: <Shield className="h-4 w-4" />,
  maquinaria: <Wrench className="h-4 w-4" />,
};

export const InventoryFormModal: React.FC<InventoryFormModalProps> = ({ isOpen, onClose, onSubmit, editingItem }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<InventoryCategory>('ropa');
  const [subtype_id, setSubtype_id] = useState('');
  const [status_id, setStatus_id] = useState('is-1');
  const [quantity, setQuantity] = useState(1);
  const [min_stock, setMin_stock] = useState(0);
  const [unit, setUnit] = useState('unidades');
  const [city_id, setCity_id] = useState('city-1');
  const [work_center_id, setWork_center_id] = useState('wc-9');
  const [location, setLocation] = useState('');
  const [assigned_to, setAssigned_to] = useState('');
  const [notes, setNotes] = useState('');
  const [attributes, setAttributes] = useState<InventoryAttributes>({});
  const [formError, setFormError] = useState<string | null>(null);

  const isRopa = category === 'ropa';
  const isEpi = category === 'epi';
  const isMaquinaria = category === 'maquinaria';

  const isWarehouseItem = isRopa || isEpi;

  const filteredWorkCenters = isWarehouseItem
    ? INITIAL_WORK_CENTERS.filter((wc) => INVENTORY_WAREHOUSE_IDS.includes(wc.id))
    : INITIAL_WORK_CENTERS;

  const filteredSubtypes = getSubtypesForCategory(category);

  const setAttr = (key: keyof InventoryAttributes, value: string) => {
    setAttributes((prev) => ({ ...prev, [key]: value || undefined }));
  };

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setDescription(editingItem.description || '');
      setCategory(editingItem.category);
      setSubtype_id(editingItem.subtype_id);
      setStatus_id(editingItem.status_id);
      setQuantity(editingItem.quantity);
      setMin_stock(editingItem.min_stock);
      setUnit(editingItem.unit);
      setCity_id(editingItem.city_id);
      setWork_center_id(editingItem.work_center_id);
      setLocation(editingItem.location || '');
      setAssigned_to(editingItem.assigned_to || '');
      setNotes(editingItem.notes || '');
      setAttributes(editingItem.attributes || {});
    } else {
      setName('');
      setDescription('');
      setCategory('ropa');
      setSubtype_id('');
      setStatus_id('is-1');
      setQuantity(1);
      setMin_stock(0);
      setUnit('unidades');
      setCity_id('city-1');
      setWork_center_id('wc-9');
      setLocation('');
      setAssigned_to('');
      setNotes('');
      setAttributes({});
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
      setFormError('Selecciona un subtipo.');
      return;
    }
    if (quantity < 0) {
      setFormError('La cantidad no puede ser negativa.');
      return;
    }

    const success = onSubmit({
      name: name.trim(),
      description,
      category,
      subtype_id,
      status_id,
      quantity,
      min_stock,
      unit,
      city_id,
      work_center_id,
      location,
      assigned_to: assigned_to || null,
      notes,
      attributes,
    });

    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-sidebar/80" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-app-border">
          <h2 className="text-lg font-bold text-app-text flex items-center gap-2">
            {editingItem ? 'Editar Elemento' : 'Nuevo Elemento'}
            {CATEGORY_ICONS[category]}
          </h2>
          <button onClick={onClose} className="p-1 text-app-text-secondary hover:text-app-text-secondary rounded-lg hover:bg-app-bg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {formError && (
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-700 font-medium">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Nombre *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Chaqueta Alta Visibilidad" className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-app-text" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Categoría</label>
              <select value={category} onChange={(e) => { const newCat = e.target.value as InventoryCategory; setCategory(newCat); setSubtype_id(''); setStatus_id(getStatusesForCategory(newCat)[0].id); }} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-app-text bg-white">
                {INVENTORY_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.value}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Subtipo *</label>
              <select value={subtype_id} onChange={(e) => setSubtype_id(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-app-text bg-white">
                <option value="">Seleccionar...</option>
                {filteredSubtypes.map((st) => (
                  <option key={st.id} value={st.id}>{st.name}</option>
                ))}
              </select>
            </div>

    <div>
      <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Estado</label>
      <select value={status_id} onChange={(e) => setStatus_id(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-app-text bg-white">
        {getStatusesForCategory(category).map((s) => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>
    </div>

            <div>
              <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Cantidad</label>
              <input type="number" min={0} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-app-text" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Stock Mínimo</label>
              <input type="number" min={0} value={min_stock} onChange={(e) => setMin_stock(Number(e.target.value))} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-app-text" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Unidad</label>
              <select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-app-text bg-white">
                <option value="unidades">Unidades</option>
                <option value="pares">Pares</option>
                <option value="cajas">Cajas</option>
                <option value="litros">Litros</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Ciudad</label>
              <select value={city_id} onChange={(e) => setCity_id(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-app-text bg-white">
                {INITIAL_CITIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Centro de Trabajo</label>
              <select value={work_center_id} onChange={(e) => setWork_center_id(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-app-text bg-white">
                {filteredWorkCenters.map((wc) => (
                  <option key={wc.id} value={wc.id}>{wc.name}</option>
                ))}
              </select>
              {isWarehouseItem && (
                <p className="text-[10px] text-amber-600 mt-1">Ropa y EPIs solo disponibles en almacenes.</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Ubicación</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ej: Estante A-1, Garaje Nave" className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-app-text" />
            </div>
          </div>

          {isRopa && (
            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
              <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Shirt className="h-3.5 w-3.5" /> Ropa - Campos específicos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Talla</label>
                  <input type="text" value={attributes.size || ''} onChange={(e) => setAttr('size', e.target.value)} placeholder="Ej: L, XL, 42" className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-app-text" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Color</label>
                  <input type="text" value={attributes.color || ''} onChange={(e) => setAttr('color', e.target.value)} placeholder="Ej: Naranja, Azul" className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-app-text" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Material</label>
                  <input type="text" value={attributes.material || ''} onChange={(e) => setAttr('material', e.target.value)} placeholder="Ej: Algodón, Poliéster" className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-app-text" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Género</label>
                  <select value={attributes.gender || ''} onChange={(e) => setAttr('gender', e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-app-text bg-white">
                    <option value="">Sin especificar</option>
                    <option value="Hombre">Hombre</option>
                    <option value="Mujer">Mujer</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {isEpi && (
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" /> EPI - Campos específicos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Certificación</label>
                  <input type="text" value={attributes.certification || ''} onChange={(e) => setAttr('certification', e.target.value)} placeholder="Ej: CE" className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-app-text" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Norma de Seguridad</label>
                  <input type="text" value={attributes.safety_standard || ''} onChange={(e) => setAttr('safety_standard', e.target.value)} placeholder="Ej: EN 397, EN 388" className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-app-text" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Número de Serie</label>
                  <input type="text" value={attributes.serial_number || ''} onChange={(e) => setAttr('serial_number', e.target.value)} placeholder="Ej: ARN-001" className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-app-text" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Fecha de Caducidad</label>
                  <input type="date" value={attributes.expiration_date || ''} onChange={(e) => setAttr('expiration_date', e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-app-text" />
                </div>
              </div>
            </div>
          )}

          {isMaquinaria && (
            <div className="bg-cyan-50 rounded-xl p-4 border border-cyan-100">
              <h3 className="text-xs font-bold text-cyan-700 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Wrench className="h-3.5 w-3.5" /> Maquinaria - Campos específicos</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Marca</label>
                  <input type="text" value={attributes.brand || ''} onChange={(e) => setAttr('brand', e.target.value)} placeholder="Ej: STIHL" className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-app-text" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Modelo</label>
                  <input type="text" value={attributes.model || ''} onChange={(e) => setAttr('model', e.target.value)} placeholder="Ej: BR 600" className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-app-text" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Número de Serie</label>
                  <input type="text" value={attributes.serial_number || ''} onChange={(e) => setAttr('serial_number', e.target.value)} placeholder="Ej: STIHL-BR600-001" className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-app-text" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Garantía Hasta</label>
                  <input type="date" value={attributes.warranty_expiration || ''} onChange={(e) => setAttr('warranty_expiration', e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-app-text" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Último Mantenimiento</label>
                  <input type="date" value={attributes.last_maintenance || ''} onChange={(e) => setAttr('last_maintenance', e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-app-text" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Próximo Mantenimiento</label>
                  <input type="date" value={attributes.next_maintenance || ''} onChange={(e) => setAttr('next_maintenance', e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-app-text" />
                </div>
              </div>
            </div>
          )}

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Descripción</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Descripción del elemento..." className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-app-text resize-none" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Notas</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Notas adicionales..." className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-app-text resize-none" />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-app-border">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-app-text-secondary bg-app-bg hover:bg-app-border rounded-xl transition-colors">
              Cancelar
            </button>
            <button type="submit" className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors">
              <Save className="h-4 w-4" />
              {editingItem ? 'Guardar Cambios' : 'Crear Elemento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
