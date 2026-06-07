import React, { useState, useEffect } from 'react';
import { Service, ServiceTask, StaffRequirement } from '../../types';
import { INITIAL_SERVICE_CATEGORIES } from '../../data/mockServices';
import { INITIAL_WORK_CENTERS } from '../../data/mockWorkCenters';
import { INITIAL_SHIFTS } from '../../data/mockEmployees';
import { WorkCenter } from '../../types';
import { generateId } from '../../utils/id';
import { X, ClipboardList, Save, Plus, Trash2, UserCog, Users } from 'lucide-react';

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => boolean;
  editingService?: Service;
  workCenters?: WorkCenter[];
}

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

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

const TASKS_PER_DAY = 20;

function generateTasks(serviceId: string): ServiceTask[] {
  const tasks: ServiceTask[] = [];
  let taskId = 0;
  const now = new Date().toISOString();
  for (let day = 0; day < 7; day++) {
    for (let t = 0; t < TASKS_PER_DAY; t++) {
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
  const shifts = INITIAL_SHIFTS;

  const [name, setName] = useState('');
  const [category, setCategory] = useState('BARRIDO MIXTO');
  const [work_center_id, setWork_center_id] = useState('wc_000001');
  const [shift_id, setShift_id] = useState('s_1');
  const [oficial, setOficial] = useState<string | null>(null);
  const [peones, setPeones] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);
  const [tasks, setTasks] = useState<ServiceTask[]>([]);
  const [taskDay, setTaskDay] = useState(0);

  const peonMax = oficial ? 2 : 1;

  useEffect(() => {
    if (editingService) {
      setName(editingService.name);
      setCategory(editingService.category);
      setWork_center_id(editingService.work_center_id);
      setShift_id(editingService.shift_id);
      setOficial(editingService.staff_requirement.oficial);
      setPeones(editingService.staff_requirement.peones);
      setTasks(editingService.tasks);
    } else {
      setName('');
      setCategory('BARRIDO MIXTO');
      setWork_center_id('wc_000001');
      setShift_id('s_1');
      setOficial(null);
      setPeones(0);
      setTasks([]);
    }
    setTaskDay(0);
  }, [editingService, isOpen]);

  const handleTaskDescriptionChange = (taskId: string, description: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, description } : t))
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleAddTask = () => {
    const dayTasks = tasks.filter((t) => t.day_index === taskDay);
    const maxIndex = dayTasks.reduce((max, t) => Math.max(max, t.task_index), -1);
    const now = new Date().toISOString();
    const newTask: ServiceTask = {
      id: generateId('task'),
      service_id: editingService?.id ?? '',
      day_index: taskDay,
      task_index: maxIndex + 1,
      description: '',
      status: 'PENDING',
      zone: null,
      assigned_to: null,
      created_at: now,
      updated_at: now,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name || !category) {
      setFormError('Completa todos los campos obligatorios');
      return;
    }

    const staffReq: StaffRequirement = { oficial, peones };

    if (editingService) {
      const success = onSubmit({
        name,
        category,
        work_center_id,
        shift_id,
        staff_requirement: staffReq,
        week_start: editingService.week_start,
        tasks,
      });
      if (success) onClose();
    } else {
      const tempId = `new-${Date.now()}`;
      const success = onSubmit({
        name,
        category,
        work_center_id,
        shift_id,
        staff_requirement: staffReq,
        week_start: new Date().toISOString().slice(0, 10),
        tasks: generateTasks(tempId),
      });
      if (success) onClose();
    }
  };

  if (!isOpen) return null;

  const dayTasks = editingService ? tasks.filter((t) => t.day_index === taskDay) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-sidebar/80" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-app-border shrink-0">
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

        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto grow">
          {formError && (
            <div className="p-3 bg-rose-50 text-rose-700 rounded-lg text-sm">{formError}</div>
          )}

          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-2 gap-4">
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

            <div>
              <label className="block text-xs font-semibold text-app-text-secondary mb-1">Turno *</label>
              <select
                value={shift_id}
                onChange={(e) => setShift_id(e.target.value)}
                className="w-full px-3 py-2 border border-app-border rounded-lg text-sm focus:outline-hidden focus:border-indigo-500"
              >
                {shifts.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-app-text-secondary mb-1">Oficial *</label>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => { setOficial(null); if (peones > 1) setPeones(1); }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    oficial === null
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'bg-app-bg text-app-text-secondary border border-app-border hover:border-primary-300'
                  }`}
                >
                  <UserCog className="h-3.5 w-3.5" />
                  Ninguno
                </button>
                <button
                  type="button"
                  onClick={() => setOficial('ec_000003')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    oficial === 'ec_000003'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-app-bg text-app-text-secondary border border-app-border hover:border-amber-300'
                  }`}
                >
                  <UserCog className="h-3.5 w-3.5" />
                  1ª
                </button>
                <button
                  type="button"
                  onClick={() => setOficial('ec_000004')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    oficial === 'ec_000004'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-app-bg text-app-text-secondary border border-app-border hover:border-amber-300'
                  }`}
                >
                  <UserCog className="h-3.5 w-3.5" />
                  2ª
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-app-text-secondary mb-1">Peones</label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[0, 1, 2].filter((n) => n <= peonMax).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPeones(n)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      peones === n
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-app-bg text-app-text-secondary border border-app-border hover:border-emerald-300'
                    }`}
                  >
                    <Users className="h-3.5 w-3.5" />
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="text-xs text-app-text-secondary -mt-2">
            Total: <strong>{(oficial ? 1 : 0) + peones} emp.</strong>
            {oficial ? ` (1 of. + ${peones} peón${peones !== 1 ? 'es' : ''})` : ''}
            {!oficial && peones > 0 ? ' (1 peón)' : ''}
            {!oficial && peones === 0 ? ' — sin personal' : ''}
          </p>

          {editingService && (
            <div className="border-t border-app-border pt-4">
              <label className="block text-xs font-semibold text-app-text-secondary mb-3">Tareas del servicio</label>

              <div className="flex gap-1 overflow-x-auto mb-4">
                {DAYS.map((day, idx) => {
                  const count = tasks.filter((t) => t.day_index === idx).length;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTaskDay(idx)}
                      className={`relative flex flex-col items-center px-3 py-2 text-xs font-semibold rounded-lg transition-all shrink-0 ${
                        taskDay === idx
                          ? 'bg-primary-600 text-white shadow-sm'
                          : 'text-app-text-secondary hover:text-app-text hover:bg-app-bg border border-transparent hover:border-app-border'
                      }`}
                    >
                      <span>{day}</span>
                      <span className="text-[10px] opacity-75">({count}/{TASKS_PER_DAY})</span>
                    </button>
                  );
                })}
                </div>

                <button
                  type="button"
                  onClick={handleAddTask}
                  className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-lg transition-colors w-full justify-center mb-3"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Añadir tarea
                </button>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {dayTasks.length === 0 && (
                  <p className="text-sm text-app-text-secondary text-center py-4">No hay tareas para este día.</p>
                )}
                {dayTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={task.description}
                      onChange={(e) => handleTaskDescriptionChange(task.id, e.target.value)}
                      placeholder="Descripción de la tarea"
                      className="w-full px-3 py-2 border border-app-border rounded-lg text-sm focus:outline-hidden focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-2 text-app-text-secondary hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

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
