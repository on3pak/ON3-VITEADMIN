import React, { useState } from 'react';
import { useVehicles } from '../../../context/VehicleContext';
import { INITIAL_WORK_CENTERS } from '../../../data/mockWorkCenters';
import { INITIAL_VEHICLE_TYPES } from '../../../data/mockVehicles';
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
    <div className="text-app-text-secondary mt-0.5">{icon}</div>
    <div>
      <div className="text-xs text-app-text-secondary">{label}</div>
      <div className={`text-sm ${highlight ? 'font-semibold text-primary-600' : 'text-app-text'}`}>{value}</div>
    </div>
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

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const colors: Record<string, string> = {
    'ACTIVE': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'MAINTENANCE': 'bg-amber-100 text-amber-700 border-amber-200',
    'BROKEN': 'bg-rose-100 text-rose-700 border-rose-200',
    'RETIRED': 'bg-app-bg text-app-text border-app-border',
  };
  const labels: Record<string, string> = {
    'ACTIVE': 'Activo',
    'MAINTENANCE': 'En Taller',
    'BROKEN': 'Averiado',
    'RETIRED': 'Baja',
  };
  return <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-lg border ${colors[status] || 'bg-app-bg'}`}>{labels[status] || status}</span>;
};

const vehicleTypeMap = Object.fromEntries(INITIAL_VEHICLE_TYPES.map(vt => [vt.id, vt.type]));
const resolveWorkCenter = (id: string) => INITIAL_WORK_CENTERS.find(w => w.id === id)?.name ?? id;
const fuelTypeLabels: Record<string, string> = {
  'DIESEL': 'Diésel',
  'PETROL': 'Gasolina',
  'ELECTRIC': 'Eléctrico',
  'LPG': 'Gas',
};

export const VehiclesDetailView: React.FC<VehiclesDetailViewProps> = ({ vehicleId, onBack }) => {
  const { getVehicleById, updateVehicle, deleteVehicle } = useVehicles();
  const vehicle = getVehicleById(vehicleId);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (!vehicle) {
    return (
      <div className="space-y-5">
        <div className="bg-app-card rounded-2xl border border-app-card-border p-8 text-center">
          <p className="text-app-text-secondary">Vehículo no encontrado.</p>
          <button onClick={onBack} className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-xl">Volver</button>
        </div>
      </div>
    );
  }

  const formatDate = (date: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const checkExpiration = (date: string) => {
    if (!date) return { color: 'text-app-text-secondary bg-app-bg', text: 'Sin fecha' };
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

  const handleModalSubmit = (data: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>) => {
    updateVehicle(vehicleId, data);
    setModalOpen(false);
    return true;
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-app-text-secondary hover:text-app-text text-sm font-medium">
          <ArrowLeft className="h-4 w-4" />
          <span>Volver</span>
        </button>
      </div>

      <div className="bg-app-card rounded-2xl border border-app-card-border shadow-sm overflow-hidden">
        <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{vehicle.brand} {vehicle.model}</h1>
              <p className="text-blue-200 text-sm font-mono">{vehicle.license_plate}</p>
            </div>
          </div>
          <StatusBadge status={vehicle.status} />
        </div>

        <div className="p-6 space-y-5">
          <SectionCard icon={<Truck className="h-4 w-4" />} title="Datos del Vehículo">
            <InfoRow icon={<Truck className="h-4 w-4" />} label="Tipo" value={vehicleTypeMap[vehicle.vehicle_type_id]} highlight />
            <InfoRow icon={<FileCheck className="h-4 w-4" />} label="VIN" value={vehicle.vin || '-'} />
            <InfoRow icon={<Truck className="h-4 w-4" />} label="Kilómetros" value={`${vehicle.kilometers.toLocaleString()} km`} highlight />
            <InfoRow icon={<Truck className="h-4 w-4" />} label="Combustible" value={fuelTypeLabels[vehicle.fuel_type] || vehicle.fuel_type} />
          </SectionCard>

          <SectionCard icon={<FileCheck className="h-4 w-4" />} title="Documentación">
            <InfoRow 
              icon={<FileCheck className="h-4 w-4" />} 
              label="ITV" 
              value={`${formatDate(vehicle.itv_expiration)} (${checkExpiration(vehicle.itv_expiration).text})`} 
            />
            <InfoRow 
              icon={<FileCheck className="h-4 w-4" />} 
              label="Seguro" 
              value={`${formatDate(vehicle.insurance_expiration)} (${checkExpiration(vehicle.insurance_expiration).text})`} 
            />
            <InfoRow 
              icon={<FileCheck className="h-4 w-4" />} 
              label="Impuesto" 
              value={`${formatDate(vehicle.tax_expiration)} (${checkExpiration(vehicle.tax_expiration).text})`} 
            />
          </SectionCard>

          <SectionCard icon={<Truck className="h-4 w-4" />} title="Mantenimiento">
            <InfoRow icon={<Truck className="h-4 w-4" />} label="Última Revisión" value={formatDate(vehicle.last_review_date)} />
            <InfoRow icon={<Truck className="h-4 w-4" />} label="Próxima Revisión" value={`${vehicle.next_review_kilometers.toLocaleString()} km`} highlight />
          </SectionCard>

          <SectionCard icon={<Truck className="h-4 w-4" />} title="Asignación">
            <InfoRow icon={<Truck className="h-4 w-4" />} label="Centro de Trabajo" value={resolveWorkCenter(vehicle.work_center_id)} />
            <InfoRow icon={<Truck className="h-4 w-4" />} label="Empleado Asignado" value={vehicle.assigned_employee_id || 'Sin asignar'} />
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
        message={`¿Estás seguro de eliminar el vehículo ${vehicle.license_plate}? Esta acción no se puede deshacer.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
};
