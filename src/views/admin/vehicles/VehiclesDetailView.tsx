import React, { useState } from 'react';
import { useVehicles } from '../../../context/VehicleContext';
import { INITIAL_WORK_CENTERS } from '../../../data/mockWorkCenters';
import { VehicleFormModal } from '../../../components/modals/VehicleFormModal';
import { ConfirmDialog } from '../../../components/modals/ConfirmDialog';
import { Vehicle } from '../../types';
import { ArrowLeft, Truck, FileCheck, Edit3, Trash2 } from 'lucide-react';

interface VehiclesDetailViewProps {
  vehicleId: string;
  onBack: () => void;
}

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: string; highlight?: boolean }> = ({ icon, label, value, highlight }) => (
  <div className="flex items-start gap-3">
    <div className="text-slate-400 mt-0.5">{icon}</div>
    <div>
      <div className="text-xs text-slate-500">{label}</div>
      <div className={`text-sm ${highlight ? 'font-semibold text-indigo-600' : 'text-slate-800'}`}>{value}</div>
    </div>
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

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const colors: Record<string, string> = {
    'ACTIVE': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'MAINTENANCE': 'bg-amber-100 text-amber-700 border-amber-200',
    'AVERIADO': 'bg-rose-100 text-rose-700 border-rose-200',
    'BAJA': 'bg-slate-100 text-slate-700 border-slate-200',
  };
  const labels: Record<string, string> = {
    'ACTIVE': 'Activo',
    'MAINTENANCE': 'En Taller',
    'AVERIADO': 'Averiado',
    'BAJA': 'Baja',
  };
  return <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-lg border ${colors[status] || 'bg-slate-100'}`}>{labels[status] || status}</span>;
};

const resolveWorkCenter = (id: string) => INITIAL_WORK_CENTERS.find(w => w.id === id)?.name ?? id;

export const VehiclesDetailView: React.FC<VehiclesDetailViewProps> = ({ vehicleId, onBack }) => {
  const { getVehicleById, updateVehicle, deleteVehicle } = useVehicles();
  const vehicle = getVehicleById(vehicleId);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (!vehicle) {
    return (
      <div className="space-y-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <p className="text-slate-400">Vehículo no encontrado.</p>
          <button onClick={onBack} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl">Volver</button>
        </div>
      </div>
    );
  }

  const formatDate = (date: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const checkExpiration = (date: string) => {
    if (!date) return { color: 'text-slate-500 bg-slate-50', text: 'Sin fecha' };
    const exp = new Date(date);
    const now = new Date();
    const diff = exp.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return { color: 'text-rose-600 bg-rose-50', text: 'Expirado' };
    if (days < 30) return { color: 'text-amber-600 bg-amber-50', text: `${days} días` };
    return { color: 'text-emerald-600 bg-emerald-50', text: `${days} días` };
  };

  const handleEdit = () => {
    setModalOpen(true);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteVehicle(vehicleId);
    onBack();
  };

  const handleModalSubmit = (data: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => {
    updateVehicle(vehicleId, data);
    setModalOpen(false);
    return true;
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-600 hover:text-slate-800 text-sm font-medium">
          <ArrowLeft className="h-4 w-4" />
          <span>Volver</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{vehicle.brand} {vehicle.model}</h1>
              <p className="text-blue-200 text-sm font-mono">{vehicle.licensePlate}</p>
            </div>
          </div>
          <StatusBadge status={vehicle.status} />
        </div>

        <div className="p-6 space-y-5">
          <SectionCard icon={<Truck className="h-4 w-4" />} title="Datos del Vehículo">
            <InfoRow icon={<Truck className="h-4 w-4" />} label="Tipo" value={vehicle.vehicleType} highlight />
            <InfoRow icon={<FileCheck className="h-4 w-4" />} label="VIN" value={vehicle.vin || '-'} />
            <InfoRow icon={<Truck className="h-4 w-4" />} label="Kilómetros" value={`${vehicle.kilometers.toLocaleString()} km`} highlight />
            <InfoRow icon={<Truck className="h-4 w-4" />} label="Combustible" value={vehicle.fuelType} />
          </SectionCard>

          <SectionCard icon={<FileCheck className="h-4 w-4" />} title="Documentación">
            <InfoRow 
              icon={<FileCheck className="h-4 w-4" />} 
              label="ITV" 
              value={`${formatDate(vehicle.itvExpiration)} (${checkExpiration(vehicle.itvExpiration).text})`} 
            />
            <InfoRow 
              icon={<FileCheck className="h-4 w-4" />} 
              label="Seguro" 
              value={`${formatDate(vehicle.insuranceExpiration)} (${checkExpiration(vehicle.insuranceExpiration).text})`} 
            />
            <InfoRow 
              icon={<FileCheck className="h-4 w-4" />} 
              label="Impuesto" 
              value={`${formatDate(vehicle.taxExpiration)} (${checkExpiration(vehicle.taxExpiration).text})`} 
            />
          </SectionCard>

          <SectionCard icon={<Truck className="h-4 w-4" />} title="Mantenimiento">
            <InfoRow icon={<Truck className="h-4 w-4" />} label="Última Revisión" value={formatDate(vehicle.lastReviewDate)} />
            <InfoRow icon={<Truck className="h-4 w-4" />} label="Próxima Revisión" value={`${vehicle.nextReviewKilometers.toLocaleString()} km`} highlight />
          </SectionCard>

          <SectionCard icon={<Truck className="h-4 w-4" />} title="Asignación">
            <InfoRow icon={<Truck className="h-4 w-4" />} label="Centro de Trabajo" value={resolveWorkCenter(vehicle.workCenter)} />
            <InfoRow icon={<Truck className="h-4 w-4" />} label="Empleado Asignado" value={vehicle.assignedEmployee || 'Sin asignar'} />
          </SectionCard>

          {vehicle.observations && (
            <SectionCard icon={<Truck className="h-4 w-4" />} title="Observaciones">
              <div className="col-span-2 p-3 bg-amber-50 rounded-lg text-sm text-amber-800">
                {vehicle.observations}
              </div>
            </SectionCard>
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

      <VehicleFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        editingVehicle={vehicle}
      />

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Eliminar Vehículo"
        message={`¿Estás seguro de eliminar el vehículo ${vehicle.licensePlate}? Esta acción no se puede deshacer.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
};