import React, { useState, useEffect } from 'react';
import { Vehicle, VehicleStatus, FuelType } from '../../types';
import { INITIAL_VEHICLE_TYPES } from '../../data/mockVehicles';
import { INITIAL_WORK_CENTERS } from '../../data/mockWorkCenters';
import { X, Truck, Save } from 'lucide-react';

interface VehicleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>) => boolean;
  editingVehicle?: Vehicle;
}

export const VehicleFormModal: React.FC<VehicleFormModalProps> = ({ isOpen, onClose, onSubmit, editingVehicle }) => {
  const [licensePlate, setLicensePlate] = useState('');
  const [model, setModel] = useState('');
  const [brand, setBrand] = useState('');
  const [vehicleTypeId, setVehicleTypeId] = useState('vt-1');
  const [status, setStatus] = useState<VehicleStatus>('ACTIVE');
  const [vin, setVin] = useState('');
  const [registrationDate, setRegistrationDate] = useState('');
  const [itvExpiration, setItvExpiration] = useState('');
  const [insuranceExpiration, setInsuranceExpiration] = useState('');
  const [taxExpiration, setTaxExpiration] = useState('');
  const [fuelType, setFuelType] = useState<FuelType>('DIESEL');
  const [kilometers, setKilometers] = useState(0);
  const [lastReviewDate, setLastReviewDate] = useState('');
  const [nextReviewKilometers, setNextReviewKilometers] = useState(0);
  const [workCenter, setWorkCenter] = useState('wc-1');
  const [assignedEmployee, setAssignedEmployee] = useState('');
  const [observations, setObservations] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (editingVehicle) {
      setLicensePlate(editingVehicle.licensePlate);
      setModel(editingVehicle.model);
      setBrand(editingVehicle.brand);
      setVehicleTypeId(editingVehicle.vehicle_type_id);
      setStatus(editingVehicle.status);
      setVin(editingVehicle.vin || '');
      setRegistrationDate(editingVehicle.registration_date || '');
      setItvExpiration(editingVehicle.itv_expiration || '');
      setInsuranceExpiration(editingVehicle.insurance_expiration || '');
      setTaxExpiration(editingVehicle.tax_expiration || '');
      setFuelType(editingVehicle.fuel_type);
      setKilometers(editingVehicle.kilometers);
      setLastReviewDate(editingVehicle.last_review_date || '');
      setNextReviewKilometers(editingVehicle.next_review_kilometers);
      setWorkCenter(editingVehicle.work_center_id);
      setAssignedEmployee(editingVehicle.assigned_employee_id || '');
      setObservations(editingVehicle.observations || '');
    } else {
      setLicensePlate('');
      setModel('');
      setBrand('');
      setVehicleTypeId('vt-1');
      setStatus('ACTIVE');
      setVin('');
      setRegistrationDate('');
      setItvExpiration('');
      setInsuranceExpiration('');
      setTaxExpiration('');
      setFuelType('DIESEL');
      setKilometers(0);
      setLastReviewDate('');
      setNextReviewKilometers(0);
      setWorkCenter('wc-1');
      setAssignedEmployee('');
      setObservations('');
    }
  }, [editingVehicle, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!licensePlate || !model || !brand) {
      setFormError('Por favor, completa los campos obligatorios');
      return;
    }
    const success = onSubmit({
      licensePlate,
      model,
      brand,
      vehicle_type_id: vehicleTypeId,
      status,
      vin,
      registration_date: registrationDate,
      itv_expiration: itvExpiration,
      insurance_expiration: insuranceExpiration,
      tax_expiration: taxExpiration,
      fuel_type: fuelType,
      kilometers,
      last_review_date: lastReviewDate,
      next_review_kilometers: nextReviewKilometers,
      work_center_id: workCenter,
      assigned_employee_id: assignedEmployee,
      observations,
    });
    if (success) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-800">
              {editingVehicle ? 'Editar Vehículo' : 'Nuevo Vehículo'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {formError && (
            <div className="p-3 bg-rose-50 text-rose-700 rounded-lg text-sm">{formError}</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Matrícula *</label>
              <input
                type="text"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Marca *</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Modelo *</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tipo</label>
              <select
                value={vehicleTypeId}
                onChange={(e) => setVehicleTypeId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:border-indigo-500"
              >
                {INITIAL_VEHICLE_TYPES.map((vt) => (
                  <option key={vt.id} value={vt.id}>{vt.type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Estado</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as VehicleStatus)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:border-indigo-500"
              >
                <option value="ACTIVE">Activo</option>
                <option value="MAINTENANCE">Mantenimiento</option>
                <option value="AVERIADO">Averiado</option>
                <option value="BAJA">Baja</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Combustible</label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value as FuelType)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:border-indigo-500"
              >
                <option value="DIESEL">Diésel</option>
                <option value="GASOLINA">Gasolina</option>
                <option value="ELECTRICO">Eléctrico</option>
                <option value="GAS">Gas</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">VIN</label>
              <input
                type="text"
                value={vin}
                onChange={(e) => setVin(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Kilómetros</label>
              <input
                type="number"
                value={kilometers}
                onChange={(e) => setKilometers(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Centro de Trabajo</label>
              <select
                value={workCenter}
                onChange={(e) => setWorkCenter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:border-indigo-500"
              >
                {INITIAL_WORK_CENTERS.map((wc) => (
                  <option key={wc.id} value={wc.id}>{wc.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Fecha Matriculación</label>
              <input
                type="date"
                value={registrationDate}
                onChange={(e) => setRegistrationDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">ITV</label>
              <input
                type="date"
                value={itvExpiration}
                onChange={(e) => setItvExpiration(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Seguro</label>
              <input
                type="date"
                value={insuranceExpiration}
                onChange={(e) => setInsuranceExpiration(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Observaciones</label>
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
            >
              <Save className="h-4 w-4" />
              {editingVehicle ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};