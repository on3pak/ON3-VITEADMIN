import React, { useState, useMemo } from 'react';
import { useServices } from '../../../context/ServiceContext';
import { useAuth } from '../../../context/AuthContext';
import { INITIAL_WORK_CENTERS } from '../../../data/mockWorkCenters';
import { ServiceFormModal } from '../../../components/modals/ServiceFormModal';
import { ConfirmDialog } from '../../../components/modals/ConfirmDialog';
import { Service } from '../../types';
import {
  ArrowLeft, ClipboardList, CheckCircle2, Circle,
  Edit3, Trash2,
} from 'lucide-react';

interface ServicesDetailViewProps {
  serviceId: string;
  onBack: () => void;
}

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const InfoRow: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value, highlight }) => (
  <div>
    <div className="text-xs text-slate-500">{label}</div>
    <div className={`text-sm ${highlight ? 'font-semibold text-indigo-600' : 'text-slate-800'}`}>{value}</div>
  </div>
);

const SectionCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-4">
    <div className="flex items-center gap-2 mb-4 text-slate-700 font-semibold text-sm">
      {icon}
      <span>{title}</span>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </div>
);

const resolveWorkCenter = (id: string) => INITIAL_WORK_CENTERS.find((w) => w.id === id)?.name ?? id;

export const ServicesDetailView: React.FC<ServicesDetailViewProps> = ({ serviceId, onBack }) => {
  const { getServiceById, updateService, deleteService, updateServiceTask } = useServices();
  const { user: loggedInUser } = useAuth();
  const service = getServiceById(serviceId);

  const userCityId = loggedInUser?.role === 'ROOT' ? undefined : loggedInUser?.city_id;

  const scopeWorkCenters = useMemo(
    () => userCityId ? INITIAL_WORK_CENTERS.filter((wc) => wc.city_id === userCityId) : INITIAL_WORK_CENTERS,
    [userCityId]
  );

  const [activeDay, setActiveDay] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (!service) {
    return (
      <div className="space-y-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <p className="text-slate-400">Servicio no encontrado.</p>
          <button onClick={onBack} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl">Volver</button>
        </div>
      </div>
    );
  }

  const dayTasks = service.tasks.filter((t) => t.dayIndex === activeDay);
  const dayCompleted = dayTasks.filter((t) => t.status === 'COMPLETED').length;
  const totalCompleted = service.tasks.filter((t) => t.status === 'COMPLETED').length;

  const handleToggleTask = (taskId: string, currentStatus: string) => {
    updateServiceTask(serviceId, taskId, currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED');
  };

  const handleEdit = () => setModalOpen(true);

  const handleDelete = () => setDeleteDialogOpen(true);

  const handleConfirmDelete = () => {
    deleteService(serviceId);
    onBack();
  };

  const handleModalSubmit = (data: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
    updateService(serviceId, data);
    setModalOpen(false);
    return true;
  };

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-600 hover:text-slate-800 text-sm font-medium">
        <ArrowLeft className="h-4 w-4" />
        <span>Volver</span>
      </button>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-600 to-indigo-500 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center">
              <ClipboardList className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{service.name}</h1>
              <p className="text-indigo-200 text-sm">{service.type}</p>
            </div>
          </div>
          <div className="text-right text-white">
            <div className="text-2xl font-bold">{totalCompleted}/{service.tasks.length}</div>
            <div className="text-xs text-indigo-200">tareas completadas</div>
          </div>
        </div>

        <div className="px-6 py-4 border-b border-slate-200">
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{ width: `${(totalCompleted / service.tasks.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-6 space-y-5">
          <SectionCard icon={<ClipboardList className="h-4 w-4" />} title="Información">
            <InfoRow label="Centro de Trabajo" value={resolveWorkCenter(service.work_center_id)} highlight />
            <InfoRow label="Tipo" value={service.type} highlight />
          </SectionCard>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200">
          <div className="flex overflow-x-auto">
            {DAYS.map((day, idx) => {
              const dayTaskCount = service.tasks.filter((t) => t.dayIndex === idx);
              const dayDone = dayTaskCount.filter((t) => t.status === 'COMPLETED').length;
              const isAllDone = dayDone === dayTaskCount.length && dayTaskCount.length > 0;

              return (
                <button
                  key={idx}
                  onClick={() => setActiveDay(idx)}
                  className={`relative flex flex-col items-center gap-1 px-5 py-3 text-xs font-semibold transition-colors shrink-0 ${
                    activeDay === idx
                      ? 'text-indigo-700 bg-indigo-50'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{day}</span>
                  <span className="flex items-center gap-1">
                    {isAllDone ? (
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <Circle className="h-3 w-3 text-slate-300" />
                    )}
                    <span className="text-[10px]">{dayDone}/{dayTaskCount.length}</span>
                  </span>
                  {activeDay === idx && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-700">{DAYS[activeDay]} — {dayCompleted}/{dayTasks.length} completadas</h3>
            <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all"
                style={{ width: `${dayTasks.length > 0 ? (dayCompleted / dayTasks.length) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {dayTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => handleToggleTask(task.id, task.status)}
              >
                {task.status === 'COMPLETED' ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-slate-300 hover:text-slate-400 shrink-0" />
                )}
                <span className={`text-sm ${task.status === 'COMPLETED' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                  {task.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={handleEdit} className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-xl font-medium text-sm">
          <Edit3 className="h-4 w-4" />
          <span>Editar</span>
        </button>
        <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 bg-rose-100 text-rose-700 hover:bg-rose-200 rounded-xl font-medium text-sm">
          <Trash2 className="h-4 w-4" />
          <span>Eliminar</span>
        </button>
      </div>

      <ServiceFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        editingService={service}
        workCenters={scopeWorkCenters}
      />

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Eliminar Servicio"
        message={`¿Estás seguro de eliminar el servicio ${service.name}? Esta acción no se puede deshacer.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
};
