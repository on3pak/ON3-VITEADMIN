import React, { useState } from 'react';
import { useEmployees } from '../../../context/EmployeeContext';
import { useAuth } from '../../../context/AuthContext';
import { INITIAL_EMPLOYEE_CATEGORIES, INITIAL_EMPLOYEE_STATUSES, INITIAL_WORK_DAYS, INITIAL_CONTRACT_TYPES } from '../../../data/mockEmployees';
import { INITIAL_WORK_CENTERS } from '../../../data/mockWorkCenters';
import { EmployeeFormModal } from '../../../components/modals/EmployeeFormModal';
import { ConfirmDialog } from '../../../components/modals/ConfirmDialog';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, CreditCard, Award, Clock, Edit3, Trash2, ShieldAlert, Building2, Wallet, FileCheck, Activity } from 'lucide-react';

interface EmployeesDetailViewProps {
  employeeId: string;
  onBack: () => void;
}

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: string | React.ReactNode; highlight?: boolean }> = ({ icon, label, value, highlight }) => (
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

const StatusBadge: React.FC<{ id: string; statuses: { id: string; name: string }[] }> = ({ id, statuses }) => {
  const status = statuses.find(s => s.id === id);
  const colors: Record<string, string> = {
    'es_1': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'es_2': 'bg-amber-100 text-amber-700 border-amber-200',
    'es_3': 'bg-rose-100 text-rose-700 border-rose-200',
    'es_4': 'bg-blue-100 text-blue-700 border-blue-200',
    'es_5': 'bg-cyan-100 text-cyan-700 border-cyan-200',
    'es_6': 'bg-violet-100 text-violet-700 border-violet-200',
  };
  return <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-lg border ${colors[id] || 'bg-app-bg'}`}>{status?.name || id}</span>;
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleEdit = () => { setModalOpen(true); };
  const handleDelete = () => { setDeleteDialogOpen(true); };
  const handleConfirmDelete = () => { deleteEmployee(employeeId); onBack(); };

  const handleModalSubmit = (data: Omit<import('../../../types').Employee, 'id' | 'created_at' | 'updated_at'>) => {
    updateEmployee(employeeId, data);
    setModalOpen(false);
    return true;
  };

  if (!employee) {
    return (
      <div className="space-y-5">
        <div className="bg-app-card rounded-2xl border border-app-card-border p-8 text-center">
          <p className="text-app-text-secondary">Empleado no encontrado.</p>
          <button onClick={onBack} className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-xl">Volver</button>
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
        <button onClick={onBack} className="flex items-center gap-2 text-app-text-secondary hover:text-app-text text-sm font-medium">
          <ArrowLeft className="h-4 w-4" />
          <span>Volver</span>
        </button>
      </div>

      <div className="bg-app-card rounded-2xl border border-app-card-border shadow-sm overflow-hidden">
        <div className="px-6 py-5 bg-gradient-to-r from-primary-600 to-primary-500 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">{(employee.name?.[0] || '') + (employee.last_name1?.[0] || '')}</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{employee.name} {employee.last_name1} {employee.last_name2}</h1>
              <p className="text-primary-200 text-sm">ID: {employee.id}</p>
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
            <InfoRow icon={<Clock className="h-4 w-4" />} label="Jornada" value={resolveWorkDay(employee.work_day_id)} />
            <InfoRow icon={<Calendar className="h-4 w-4" />} label="Horario" value={employee.start_time && employee.end_time ? `${employee.start_time} - ${employee.end_time}` : '-'} />
          </SectionCard>

          <SectionCard icon={<Calendar className="h-4 w-4" />} title="Vacaciones">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-primary-50/60 rounded-xl border border-primary-100/50">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-100 text-primary-600 shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-app-text-secondary font-medium">Mes asignado</div>
                    <div className="text-sm font-bold text-primary-700 capitalize">{employee.vacation_month || 'Sin asignar'}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-app-text-secondary font-medium">Próximo</div>
                    <div className="text-sm font-bold text-emerald-600 capitalize">{(() => { const m = ['JULIO','AGOSTO','SEPTIEMBRE']; const i = m.indexOf(employee.vacation_month || ''); return i >= 0 ? m[(i + 1) % 3] : '—'; })()}</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'Vacaciones', value: employee.vacation_days, color: 'text-primary-600', bg: 'bg-primary-50' },
                  { label: 'Propios', value: employee.own_days, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { label: 'Acumulados', value: employee.accumulated_days, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Extras', value: employee.excess_days, color: 'text-rose-600', bg: 'bg-rose-50' },
                ].map((d) => (
                  <div key={d.label} className={`text-center p-2 rounded-lg ${d.bg}`}>
                    <div className={`text-lg font-bold ${d.color}`}>{d.value}</div>
                    <div className="text-[10px] text-app-text-secondary">{d.label}</div>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Rota cada año: julio → agosto → septiembre → julio...
              </p>
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
              <span className={`px-3 py-1.5 text-xs font-medium rounded-lg ${employee.active ? 'bg-emerald-100 text-emerald-700' : 'bg-app-bg text-app-text-secondary'}`}>
                {employee.active ? '✓ Activo' : '○ Inactivo'}
              </span>
              <span className={`px-3 py-1.5 text-xs font-medium rounded-lg ${employee.medical_check ? 'bg-emerald-100 text-emerald-700' : 'bg-app-bg text-app-text-secondary'}`}>
                {employee.medical_check ? '✓ Rev. Médica' : '○ Rev. Médica'}
              </span>
              <span className={`px-3 py-1.5 text-xs font-medium rounded-lg ${employee.works_holidays ? 'bg-emerald-100 text-emerald-700' : 'bg-app-bg text-app-text-secondary'}`}>
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

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Eliminar Empleado"
        message={`¿Estás seguro de eliminar al empleado ${employee.name} ${employee.last_name1}? Esta acción no se puede deshacer.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
};
