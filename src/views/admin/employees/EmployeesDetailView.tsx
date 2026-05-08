import React, { useState } from 'react';
import { useEmployees } from '../../../context/EmployeeContext';
import { useAuth } from '../../../context/AuthContext';
import { INITIAL_EMPLOYEE_CATEGORIES, INITIAL_EMPLOYEE_STATUSES, INITIAL_WORK_CENTERS, INITIAL_WORK_DAYS, INITIAL_CONTRACT_TYPES } from '../../../data/mockEmployees';
import { EmployeeFormModal } from '../../../components/EmployeeFormModal';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, CreditCard, Award, Clock, Edit3, Trash2, ShieldAlert, Building2, Wallet, FileCheck, Activity } from 'lucide-react';

interface EmployeesDetailViewProps {
  employeeId: string;
  onBack: () => void;
}

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: string | React.ReactNode; highlight?: boolean }> = ({ icon, label, value, highlight }) => (
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

const StatusBadge: React.FC<{ id: string; statuses: { id: string; name: string }[] }> = ({ id, statuses }) => {
  const status = statuses.find(s => s.id === id);
  const colors: Record<string, string> = {
    'es-1': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'es-2': 'bg-amber-100 text-amber-700 border-amber-200',
    'es-3': 'bg-rose-100 text-rose-700 border-rose-200',
    'es-4': 'bg-blue-100 text-blue-700 border-blue-200',
    'es-5': 'bg-cyan-100 text-cyan-700 border-cyan-200',
    'es-6': 'bg-violet-100 text-violet-700 border-violet-200',
  };
  return <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-lg border ${colors[id] || 'bg-slate-100'}`}>{status?.name || id}</span>;
};

export const EmployeesDetailView: React.FC<EmployeesDetailViewProps> = ({ employeeId, onBack }) => {
  const { getEmployeeById, updateEmployee, deleteEmployee } = useEmployees();
  const { user: loggedInUser } = useAuth();

  const employee = getEmployeeById(employeeId);
  const isReadOnly = loggedInUser?.role === 'USER';

  const resolveCategory = (id: string) => INITIAL_EMPLOYEE_CATEGORIES.find(c => c.id === id)?.name ?? id;
  const resolveStatus = (id: string) => INITIAL_EMPLOYEE_STATUSES.find(s => s.id === id)?.name ?? id;
  const resolveWorkCenter = (id: string) => INITIAL_WORK_CENTERS.find(w => w.id === id)?.name ?? id;
  const resolveWorkDay = (id: string) => INITIAL_WORK_DAYS.find(w => w.id === id)?.name ?? id;
  const resolveContractType = (id: string) => INITIAL_CONTRACT_TYPES.find(c => c.id === id)?.name ?? id;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode] = useState<'edit'>('edit');

  const handleEdit = () => { setModalOpen(true); };
  const handleDelete = () => {
    if (confirm('¿Eliminar empleado?')) {
      deleteEmployee(employeeId);
      onBack();
    }
  };

  const handleModalSubmit = (data: Omit<import('../../../types').Employee, 'id' | 'created_at' | 'updated_at'>) => {
    updateEmployee(employeeId, data);
    setModalOpen(false);
    return true;
  };

  if (!employee) {
    return (
      <div className="space-y-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <p className="text-slate-400">Empleado no encontrado.</p>
          <button onClick={onBack} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl">Volver</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {isReadOnly && (
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-3 font-medium">
          <ShieldAlert className="h-4 w-4 text-amber-600" />
          <span>Modo lectura - Rol: {loggedInUser?.role}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-600 hover:text-slate-800 text-sm font-medium">
          <ArrowLeft className="h-4 w-4" />
          <span>Volver</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-600 to-indigo-500 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">{(employee.name?.[0] || '') + (employee.lastName1?.[0] || '')}</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{employee.name} {employee.lastName1} {employee.lastName2}</h1>
              <p className="text-indigo-200 text-sm">ID: {employee.id}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <StatusBadge id={employee.status_id} statuses={INITIAL_EMPLOYEE_STATUSES} />
          </div>
        </div>

        <div className="p-6 space-y-5">
          <SectionCard icon={<User className="h-4 w-4" />} title="Datos Personales">
            <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={employee.email || '-'} />
            <InfoRow icon={<Phone className="h-4 w-4" />} label="Teléfono" value={employee.phone || '-'} />
            <InfoRow icon={<Mail className="h-4 w-4" />} label="Email Personal" value={employee.personal_email || '-'} />
            <InfoRow icon={<Phone className="h-4 w-4" />} label="Teléfono Fijo" value={employee.phone_fixed || '-'} />
          </SectionCard>

          <SectionCard icon={<Award className="h-4 w-4" />} title="Información Laboral">
            <InfoRow icon={<Award className="h-4 w-4" />} label="Categoría" value={resolveCategory(employee.category_id)} highlight />
            <InfoRow icon={<Building2 className="h-4 w-4" />} label="Centro de Trabajo" value={resolveWorkCenter(employee.work_center_id)} highlight />
            <InfoRow icon={<Clock className="h-4 w-4" />} label="Jornada" value={resolveWorkDay(employee.work_day)} />
            <InfoRow icon={<Calendar className="h-4 w-4" />} label="Horario" value={employee.start_time && employee.end_time ? `${employee.start_time} - ${employee.end_time}` : '-'} />
          </SectionCard>

          <SectionCard icon={<Calendar className="h-4 w-4" />} title="Vacaciones y Días">
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-3 bg-indigo-50 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">{employee.vacation_days}</div>
                <div className="text-xs text-slate-500">Vacaciones</div>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <div className="text-2xl font-bold text-emerald-600">{employee.own_days}</div>
                <div className="text-xs text-slate-500">Propios</div>
              </div>
              <div className="text-center p-3 bg-amber-50 rounded-lg">
                <div className="text-2xl font-bold text-amber-600">{employee.accumulated_days}</div>
                <div className="text-xs text-slate-500">Acumulados</div>
              </div>
              <div className="text-center p-3 bg-rose-50 rounded-lg">
                <div className="text-2xl font-bold text-rose-600">{employee.excess_days}</div>
                <div className="text-xs text-slate-500">Extras</div>
              </div>
            </div>
          </SectionCard>

          <SectionCard icon={<CreditCard className="h-4 w-4" />} title="Datos Bancarios">
            <InfoRow icon={<CreditCard className="h-4 w-4" />} label="IBAN" value={employee.iban || 'Sin registrar'} />
            <InfoRow icon={<Wallet className="h-4 w-4" />} label="IRPF" value={employee.irpf ? `${employee.irpf}%` : '-'} />
            <InfoRow icon={<Award className="h-4 w-4" />} label="Taquilla" value={employee.locker || '-'} />
          </SectionCard>

          <SectionCard icon={<FileCheck className="h-4 w-4" />} title="Contrato">
            <InfoRow icon={<FileCheck className="h-4 w-4" />} label="Tipo" value={resolveContractType(employee.contract_type) || '-'} />
            <InfoRow icon={<Calendar className="h-4 w-4" />} label="Inicio" value={employee.contract_start_date || '-'} />
            <InfoRow icon={<Calendar className="h-4 w-4" />} label="Fin" value={employee.contract_end_date || 'Indefinido'} />
          </SectionCard>

          <SectionCard icon={<Activity className="h-4 w-4" />} title="Estados">
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1.5 text-xs font-medium rounded-lg ${employee.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                {employee.active ? '✓ Activo' : '○ Inactivo'}
              </span>
              <span className={`px-3 py-1.5 text-xs font-medium rounded-lg ${employee.medical_check ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                {employee.medical_check ? '✓ Rev. Médica' : '○ Rev. Médica'}
              </span>
              <span className={`px-3 py-1.5 text-xs font-medium rounded-lg ${employee.works_holidays ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                {employee.works_holidays ? '✓ Festivos' : '○ Festivos'}
              </span>
            </div>
          </SectionCard>
        </div>
      </div>

      {!isReadOnly && (
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
      )}

      <EmployeeFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        editingEmployee={employee}
      />
    </div>
  );
};