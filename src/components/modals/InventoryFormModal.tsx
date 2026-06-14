import React, { useState, useEffect } from 'react';
import { InventoryItem, InventoryAttributes } from '../../types';
import { useLookupsContext } from '../../context/LookupContext';
import { INVENTORY_WAREHOUSE_IDS, getSubtypesForCategory } from '../../data/mockInventory';
import { X, Save, Shirt } from 'lucide-react';

const LETTER_SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'ESTÁNDAR'];
const SHOE_SIZES = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'];
const STANDARD_COLORS: Record<string, string[]> = {
  'ist-6': ['ESTÁNDAR'],
  'ist-7': ['ESTÁNDAR'],
  'ist-8': ['ESTÁNDAR'],
};
const getPresetColors = (subtypeId: string) => STANDARD_COLORS[subtypeId] || ['Verde-Amarilla'];

const SUBTYPE_SIZE_GROUPS: Record<string, 'LETTER' | 'SHOE'> = {
  'ist-1': 'LETTER',
  'ist-2': 'LETTER',
  'ist-3': 'LETTER',
  'ist-4': 'LETTER',
  'ist-5': 'LETTER',
  'ist-6': 'LETTER',
  'ist-7': 'SHOE',
  'ist-8': 'SHOE',
};

interface InventoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'>) => boolean;
  editingItem?: InventoryItem;
}

export const InventoryFormModal: React.FC<InventoryFormModalProps> = ({ isOpen, onClose, onSubmit, editingItem }) => {
  const { workCenters } = useLookupsContext();

  const wcCityMap = Object.fromEntries(
    workCenters.map((wc) => [wc.id, wc.city_id])
  );

  const filteredWorkCenters = workCenters.filter((wc) => INVENTORY_WAREHOUSE_IDS.includes(wc.id));

  const [name, setName] = useState('');
  const [subtype_id, setSubtype_id] = useState('');
  const [customSubtype, setCustomSubtype] = useState('');
  const [isCustomSubtype, setIsCustomSubtype] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [work_center_id, setWork_center_id] = useState('wc_000009');
  const [assigned_to, setAssigned_to] = useState('');
  const [itemColor, setItemColor] = useState('');
  const [customColor, setCustomColor] = useState('');
  const [isCustomColor, setIsCustomColor] = useState(false);
  const [itemSize, setItemSize] = useState('');
  const [itemGender, setItemGender] = useState('');
  const [attributes, setAttributes] = useState<InventoryAttributes>({});
  const [formError, setFormError] = useState<string | null>(null);

  const sizeGroup = SUBTYPE_SIZE_GROUPS[subtype_id] || 'LETTER';
  const sizeOptions = sizeGroup === 'SHOE' ? SHOE_SIZES : LETTER_SIZES;

  const filteredSubtypes = getSubtypesForCategory('CLOTHING');

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      const subId = editingItem.subtype_id;
      const knownSubIds = filteredSubtypes.map((st) => st.id);
      const isCustomSub = subId !== '' && !knownSubIds.includes(subId);
      setSubtype_id(subId);
      setCustomSubtype(isCustomSub ? subId : '');
      setIsCustomSubtype(isCustomSub);
      setQuantity(editingItem.quantity);
      setWork_center_id(editingItem.work_center_id);
      setAssigned_to(editingItem.assigned_to || '');
      const c = editingItem.color || '';
      const isCustom = !getPresetColors(subId).includes(c) && c !== '';
      setItemColor(c);
      setCustomColor(isCustom ? c : '');
      setIsCustomColor(isCustom);
      setItemSize(editingItem.size || '');
      setItemGender(editingItem.gender || '');
      setAttributes(editingItem.attributes || {});
    } else {
      setName('');
      setSubtype_id('');
      setCustomSubtype('');
      setIsCustomSubtype(false);
      setQuantity(1);
      setWork_center_id('wc_000009');
      setAssigned_to('');
      setItemColor('');
      setCustomColor('');
      setIsCustomColor(false);
      setItemSize('');
      setItemGender('');
      setAttributes({});
    }
    setFormError(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setFormError('Selecciona un tipo.');
      return;
    }
    if (quantity < 0) {
      setFormError('La cantidad no puede ser negativa.');
      return;
    }

    const success = onSubmit({
      name: name.trim(),
      description: '',
      category: 'CLOTHING',
      subtype_id,
      status_id: 'rs-1',
      quantity,
      min_stock: 0,
      unit: 'unidades',
      city_id: wcCityMap[work_center_id] || 'ci_000001',
      work_center_id,
      location: '',
      color: itemColor || null,
      size: itemSize || null,
      gender: itemGender || null,
      assigned_to: assigned_to || null,
      notes: '',
      attributes,
    });

    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-sidebar/80" onClick={onClose}>
      <div className="bg-app-card rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-app-border">
          <h2 className="text-lg font-bold text-app-text flex items-center gap-2">
            <Shirt className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            {editingItem ? 'Editar Prenda' : 'Nueva Prenda'}
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
              <div className="w-[70%]">
                <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Nombre *</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Pantalón Verano" className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 text-app-text" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Ubicación</label>
                <select value={work_center_id} onChange={(e) => setWork_center_id(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 text-app-text bg-app-card">
                  {filteredWorkCenters.map((wc) => (
                    <option key={wc.id} value={wc.id}>{wc.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="flex gap-3">
                <div className="w-[60%]">
                  <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Tipo *</label>
                  <select
                    value={!subtype_id && !isCustomSubtype ? '' : filteredSubtypes.some((st) => st.id === subtype_id) ? subtype_id : '__OTHER__'}
                    onChange={(e) => {
                      if (e.target.value === '__OTHER__') {
                        setIsCustomSubtype(true);
                        setSubtype_id(customSubtype);
                      } else {
                        setIsCustomSubtype(false);
                        setSubtype_id(e.target.value);
                        setCustomSubtype('');
                      }
                    }}
                    className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 text-app-text bg-app-card"
                  >
                    <option value="">Seleccionar...</option>
                    {filteredSubtypes.map((st) => (
                      <option key={st.id} value={st.id}>{st.name}</option>
                    ))}
                    <option value="__OTHER__">— Otro —</option>
                  </select>
                </div>
                <div className="w-[20%]">
                  <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Talla</label>
                  <select value={itemSize} onChange={(e) => setItemSize(e.target.value)} disabled={!subtype_id} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 text-app-text bg-app-card disabled:opacity-50 disabled:cursor-not-allowed">
                    <option value="">—</option>
                    {sizeOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="w-[20%]">
                  <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Cant.</label>
                  <input type="number" min={0} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 text-app-text" />
                </div>
              </div>
              {isCustomSubtype && (
                <input
                  type="text"
                  value={customSubtype}
                  onChange={(e) => { setCustomSubtype(e.target.value); setSubtype_id(e.target.value); }}
                  placeholder="Especificar tipo..."
                  className="mt-2 w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 text-app-text"
                  autoFocus
                />
              )}
            </div>

            <div>
              <div className="flex gap-3">
                <div className="w-[40%]">
                  <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Color</label>
                  <select
                    value={!itemColor && !isCustomColor ? '' : getPresetColors(subtype_id).includes(itemColor) ? itemColor : '__OTHER__'}
                    onChange={(e) => {
                      if (e.target.value === '__OTHER__') {
                        setIsCustomColor(true);
                        setItemColor(customColor);
                      } else {
                        setIsCustomColor(false);
                        setItemColor(e.target.value);
                        setCustomColor('');
                      }
                    }}
                    disabled={!subtype_id}
                    className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 text-app-text bg-app-card disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Seleccionar...</option>
                    {getPresetColors(subtype_id).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                    <option value="__OTHER__">— Otro —</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-app-text-secondary uppercase tracking-wider mb-1.5">Género</label>
                  <select value={itemGender} onChange={(e) => setItemGender(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 text-app-text bg-app-card">
                    <option value="">Sin especificar</option>
                    <option value="Hombre">Hombre</option>
                    <option value="Mujer">Mujer</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
              </div>
              {isCustomColor && (
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => { setCustomColor(e.target.value); setItemColor(e.target.value); }}
                  placeholder="Especificar color..."
                  className="mt-2 w-full px-3 py-2 border border-app-border rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 text-app-text"
                  autoFocus
                />
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-app-border">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-app-text-secondary bg-app-bg hover:bg-app-border dark:hover:bg-app-border rounded-xl transition-colors">
              Cancelar
            </button>
            <button type="submit" className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors">
              <Save className="h-4 w-4" />
              {editingItem ? 'Guardar Cambios' : 'Crear Prenda'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
