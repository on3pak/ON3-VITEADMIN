import React, { useState, useEffect } from 'react';
import { Service, ServiceTask } from '../../types';
import { INITIAL_SERVICE_CATEGORIES } from '../../data/mockServices';
import { INITIAL_WORK_CENTERS } from '../../data/mockWorkCenters';
import { WorkCenter } from '../../types';
import { X, ClipboardList, Save } from 'lucide-react';

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => boolean;
  editingService?: Service;
  workCenters?: WorkCenter[];
}

const TASK_TEMPLATES: string[] = [
  'Barrido manual de aceras y calzada',
  'Vaciado de papeleras',
  'Limpieza de imbornales y sumideros',
  'Desbroce de malas hierbas',
  'Barrido mecánico con sopladora',
  'Reposición de bolsas en papeleras',
  'Limpieza de contenedores soterrados',
  'Recogida de residuos voluminosos',
  'Limpieza de marquesinas y paradas',
  'Baldeo de calles con agua a presión',
  'Limpieza de parques y jardines',
  'Retirada de cartelería ilegal',
  'Limpieza de fuentes ornamentales',
  'Desinfección de contenedores',
  'Barrido manual de zonas peatonales',
  'Limpieza de imbornales con camión cuba',
  'Recogida de hojas y restos de poda',
  'Limpieza de solares y terrenos baldíos',
  'Mantenimiento de jardineras y parterres',
  'Limpieza de mobiliario urbano',
];

const DAY_ZONES: string[] = [
  'Zona Norte - Casco Antiguo',
  'Zona Sur - Polígono Industrial',
  'Zona Este - Parque Lineal',
  'Zona Oeste - Barrio Residencial',
  'Zona Centro - Eje Comercial',
  'Zona Periferia - Área Deportiva',
  'Zona Verde - Parques Periurbanos',
];

function generateTasks(serviceId: string): ServiceTask[] {
  const tasks: ServiceTask[] = [];
  let taskId = 0;
  const now = new Date().toISOString();
  for (let day = 0; day < 7; day++) {
    for (let t = 0; t < 20; t++) {
      tasks.push({
        id: `${serviceId}-task-${taskId++}`,
        service_id: serviceId,
        day_index: day,
        task_index: t,
        description: `${TASK_TEMPLATES[t]} - ${DAY_ZONES[day]}`,
        status: 'PENDING',
        zone: DAY_ZONES[day],
        assigned_to: null,
        created_at: now,
        updated_at: now,
      });
    }
  }
  return tasks;
}

export const ServiceFormModal: React.FC<ServiceFormModalProps> = ({ isOpen, onClose, onSubmit, editingService, workCenters }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('BARRIDO MIXTO');
  const [work_center_id, setWork_center_id] = useState('wc_1');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (editingService) {
      setName(editingService.name);
      setCategory(editingService.category);
      setWork_center_id(editingService.work_center_id);
    } else {
      setName('');
      setCategory('BARRIDO MIXTO');
      setWork_center_id('wc-1');
    }
  }, [editingService, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category) {
      setFormError('Completa todos los campos obligatorios');
      return;
    }

    if (editingService) {
      const success = onSubmit({
        name,
        category,
        work_center_id,
        week_start: editingService.week_start,
        tasks: editingService.tasks,
      });
      if (success) onClose();
    } else {
      const tempId = `new-${Date.now()}`;
      const success = onSubmit({
        name,
        category,
        work_center_id,
        week_start: new Date().toISOString().slice(0, 10),
        tasks: generateTasks(tempId),
      });
      if (success) onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-sidebar/80" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-app-border">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-app-text">
              {editingService ? 'Editar Servicio' : 'Nuevo Servicio'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-app-text-secondary hover:text-app-text-secondary">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {formError && (
            <div className="p-3 bg-rose-50 text-rose-700 rounded-lg text-sm">{formError}</div>
          )}

          <div>
            <label className="block text-xs font-semibold text-app-text-secondary mb-1">Nombre *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.toUpperCase())}
              placeholder="Ej: BMIX1"
              className="w-full px-3 py-2 border border-app-border rounded-lg text-sm focus:outline-hidden focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-app-text-secondary mb-1">Categoría *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-app-border rounded-lg text-sm focus:outline-hidden focus:border-indigo-500"
            >
              {INITIAL_SERVICE_CATEGORIES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-app-text-secondary mb-1">Centro de Trabajo *</label>
            <select
              value={work_center_id}
              onChange={(e) => setWork_center_id(e.target.value)}
              className="w-full px-3 py-2 border border-app-border rounded-lg text-sm focus:outline-hidden focus:border-indigo-500"
            >
              {(workCenters ?? INITIAL_WORK_CENTERS).map((wc) => (
                <option key={wc.id} value={wc.id}>{wc.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-app-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-app-text-secondary hover:bg-app-bg rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
            >
              <Save className="h-4 w-4" />
              {editingService ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
