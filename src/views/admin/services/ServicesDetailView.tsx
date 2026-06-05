import React, { useState, useMemo } from 'react';
import { useServices } from '../../../context/ServiceContext';
import { useAuth } from '../../../context/AuthContext';
import { INITIAL_WORK_CENTERS } from '../../../data/mockWorkCenters';
import { ServiceFormModal } from '../../../components/modals/ServiceFormModal';
import { ConfirmDialog } from '../../../components/modals/ConfirmDialog';
import { Service } from '../../../types';
import { INITIAL_SHIFTS, INITIAL_EMPLOYEE_CATEGORIES } from '../../../data/mockEmployees';
import {
  ArrowLeft, ClipboardList,
  Edit3, Trash2, ListChecks, UserCog, Users,
} from 'lucide-react';

interface ServicesDetailViewProps {
  serviceId: string;
  onBack: () => void;
}

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const InfoRow: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value, highlight }) => (
  <div>
    <div className="text-xs text-app-text-secondary">{label}</div>
    <div className={`text-sm ${highlight ? 'font-semibold text-primary-600' : 'text-app-text'}`}>{value}</div>
  </div>
);

const SectionCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="bg-app-card rounded-xl border border-app-card-border p-4">
    <div className="flex items-center gap-2 mb-4 text-app-text font-semibold text-sm">
      {icon}
      <span>{title}</span>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </div>
);

const resolveWorkCenter = (id: string) => INITIAL_WORK_CENTERS.find((w) => w.id === id)?.name ?? id;

export const ServicesDetailView: React.FC<ServicesDetailViewProps> = ({ serviceId, onBack }) => {
  const { getServiceById, updateService, deleteService } = useServices();
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
        <div className="bg-app-card rounded-2xl border border-app-card-border p-8 text-center">
          <p className="text-app-text-secondary">Servicio no encontrado.</p>
          <button onClick={onBack} className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-xl">Volver</button>
        </div>
      </div>
    );
  }

  const dayTasks = service.tasks.filter((t) => t.day_index === activeDay);

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
      <button onClick={onBack} className="flex items-center gap-2 text-app-text-secondary hover:text-app-text text-sm font-medium">
        <ArrowLeft className="h-4 w-4" />
        <span>Volver</span>
      </button>

      <div className="bg-app-card rounded-2xl border border-app-card-border shadow-sm overflow-hidden">
        <div className="px-6 py-5 bg-gradient-to-r from-primary-600 to-primary-500 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <ClipboardList className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{service.name}</h1>
            <p className="text-primary-200 text-sm">{service.category}</p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <SectionCard icon={<ClipboardList className="h-4 w-4" />} title="Información">
            <InfoRow label="Centro de Trabajo" value={resolveWorkCenter(service.work_center_id)} highlight />
            <InfoRow label="Tipo" value={service.category} highlight />
            <InfoRow label="Turno" value={INITIAL_SHIFTS.find((sh) => sh.id === service.shift_id)?.name ?? service.shift_id} />
            <InfoRow label="Personal necesario" value={
              (service.staff_requirement.oficial
                ? '1 ' + (INITIAL_EMPLOYEE_CATEGORIES.find((c) => c.id === service.staff_requirement.oficial)?.name ?? 'Oficial')
                : '') +
              (service.staff_requirement.oficial && service.staff_requirement.peones > 0 ? ' + ' : '') +
              (service.staff_requirement.peones > 0
                ? service.staff_requirement.peones + ' peón' + (service.staff_requirement.peones !== 1 ? 'es' : '')
                : service.staff_requirement.oficial ? '' : 'Ninguno')
            } />
          </SectionCard>
        </div>
      </div>

      <div className="bg-app-card rounded-2xl border border-app-card-border shadow-sm overflow-hidden">
        <div className="border-b border-app-border">
          <div className="flex overflow-x-auto">
            {DAYS.map((day, idx) => {
              const count = service.tasks.filter((t) => t.day_index === idx).length;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveDay(idx)}
                  className={`relative flex flex-col items-center gap-1 px-5 py-3 text-xs font-semibold transition-colors shrink-0 ${
                    activeDay === idx
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-app-text-secondary hover:text-app-text hover:bg-app-bg'
                  }`}
                >
                  <span>{day}</span>
                  <span className="text-[10px]">{count} tareas</span>
                  {activeDay === idx && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-sm font-bold text-app-text mb-3">{DAYS[activeDay]}</h3>

          {dayTasks.length === 0 ? (
            <p className="text-sm text-app-text-secondary text-center py-4">No hay tareas para este día.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {dayTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 py-2.5 px-2 rounded-lg"
                >
                  <ListChecks className="h-4 w-4 text-app-text-secondary shrink-0 mt-0.5" />
                  <span className="text-sm text-app-text">{task.description}</span>
                </div>
              ))}
            </div>
          )}
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

