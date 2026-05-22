import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEmployees } from '../../context/EmployeeContext';
import { EmployeeFormModal } from '../../components/modals/EmployeeFormModal';
import { INITIAL_CITIES, INITIAL_EMPLOYEE_CATEGORIES, INITIAL_EMPLOYEE_STATUSES, INITIAL_WORK_DAYS, INITIAL_SHIFTS, INITIAL_CONTRACT_TYPES } from '../../data/mockEmployees';
import { INITIAL_WORK_CENTERS } from '../../data/mockWorkCenters';
import {
  User, Shield, Calendar, Briefcase,
  Edit3, CheckCircle, Flag, TrendingUp,
  FileText, Share2, ShieldAlert,
} from 'lucide-react';

const cityMap = Object.fromEntries(INITIAL_CITIES.map((c) => [c.id, c.name]));
const wcMap = Object.fromEntries(INITIAL_WORK_CENTERS.map((w) => [w.id, w.name]));
const catMap = Object.fromEntries(INITIAL_EMPLOYEE_CATEGORIES.map((c) => [c.id, c.name]));
const statusMap = Object.fromEntries(INITIAL_EMPLOYEE_STATUSES.map((s) => [s.id, s.name]));
const shiftMap = Object.fromEntries(INITIAL_SHIFTS.map((s) => [s.id, s.name]));
const wdMap = Object.fromEntries(INITIAL_WORK_DAYS.map((w) => [w.id, w.name]));
const ctMap = Object.fromEntries(INITIAL_CONTRACT_TYPES.map((c) => [c.id, c.name]));

const STATUS_BADGE: Record<string, string> = {
  'es-1': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'es-2': 'bg-blue-100 text-blue-700 border-blue-200',
  'es-3': 'bg-rose-100 text-rose-700 border-rose-200',
  'es-4': 'bg-amber-100 text-amber-700 border-amber-200',
  'es-5': 'bg-purple-100 text-purple-700 border-purple-200',
  'es-6': 'bg-cyan-100 text-cyan-700 border-cyan-200',
};

const ROLE_STYLE: Record<string, string> = {
  ROOT: 'bg-violet-100 text-violet-700 border-violet-200',
  ADMIN: 'bg-blue-100 text-blue-700 border-blue-200',
  MANAGER: 'bg-amber-100 text-amber-700 border-amber-200',
  USER: 'bg-gray-100 text-gray-600 border-gray-200',
};

const formatDate = (d: string) => {
  const date = new Date(d);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
};

export const DashboardProfileView: React.FC = () => {
  const { user: loggedInUser } = useAuth();
  const { employees, createEmployee, updateEmployee } = useEmployees();

  const isReadOnly = loggedInUser?.role === 'USER';

  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);

  const myEmployee = useMemo(
    () => (loggedInUser ? employees.find((e) => e.user_id === loggedInUser.id) : undefined),
    [employees, loggedInUser]
  );

  const handleEmployeeSubmit = (data: Omit<import('../../types').Employee, 'id' | 'created_at' | 'updated_at'>) => {
    if (isReadOnly) return false;
    if (myEmployee) {
      updateEmployee(myEmployee.id, data);
    } else if (loggedInUser) {
      createEmployee({ ...data, user_id: loggedInUser.id, city_id: loggedInUser.city_id || null });
    }
    setEmployeeModalOpen(false);
    return true;
  };

  return (
    <div className="space-y-5">
      {isReadOnly && (
        <div className="flex items-center gap-3 px-4 py-3 text-xs font-medium text-amber-900 bg-amber-50 border border-amber-200 rounded-xl">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span><span className="font-bold">Modo Consulta:</span> Tu rol es <span className="px-1 py-0.5 font-mono bg-amber-100 rounded text-amber-800">USER</span>. Los datos se muestran en modo solo lectura.</span>
        </div>
      )}

      {loggedInUser && (
        <div className="space-y-5">
          {/* Profile Header Card */}
          <div className="overflow-hidden bg-white border border-gray-200 rounded-xl shadow-xs">
            <div className="relative px-6 pt-12 pb-6 bg-gradient-to-r from-indigo-600 to-indigo-500">
              <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-end sm:gap-6">
                <div className="relative shrink-0">
                  <div className="w-24 h-24 overflow-hidden border-4 border-white rounded-2xl shadow-md">
                    <img src={loggedInUser.avatar_url} alt={loggedInUser.full_name} className="object-cover w-full h-full" />
                  </div>
                  <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                </div>
                <div className="mt-4 sm:mt-0 sm:pb-1">
                  <h1 className="text-2xl font-bold text-white">{loggedInUser.full_name}</h1>
                  <p className="text-indigo-200">@{loggedInUser.username}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2 justify-center sm:justify-start">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold border rounded-full ${ROLE_STYLE[loggedInUser.role]}`}>
                      <Shield className="w-3 h-3" /> {loggedInUser.role}
                    </span>
                    <span className="text-xs text-indigo-200">
                      <Calendar className="inline w-3 h-3 mr-1" />
                      Miembro desde {formatDate(loggedInUser.created_at)}
                    </span>
                  </div>
                </div>
                <div className="hidden sm:flex sm:ml-auto sm:pb-1 gap-2">
                  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-white rounded-lg shadow-xs hover:bg-indigo-50 transition-colors">
                    <Share2 className="w-3.5 h-3.5" /> Compartir
                  </button>
                  {!isReadOnly && (
                    <button onClick={() => setEmployeeModalOpen(true)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-700 rounded-lg shadow-xs hover:bg-indigo-800 transition-colors">
                      <Edit3 className="w-3.5 h-3.5" /> Editar
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-1 px-6 py-3 bg-gray-50 border-t border-gray-100 sm:hidden">
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-white border border-gray-200 rounded-lg shadow-xs hover:bg-indigo-50 transition-colors">
                <Share2 className="w-3.5 h-3.5" /> Compartir
              </button>
              {!isReadOnly && (
                <button onClick={() => setEmployeeModalOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg shadow-xs hover:bg-indigo-700 transition-colors">
                  <Edit3 className="w-3.5 h-3.5" /> Editar
                </button>
              )}
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {/* Left Column - About + Personal Details */}
            <div className="space-y-5 lg:col-span-1">
              {/* About Card */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-xs">
                <div className="px-5 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <User className="w-4 h-4 text-gray-400" />
                    Acerca de
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-xs font-medium text-gray-500">Email</span>
                    <span className="text-sm text-right text-gray-900 truncate max-w-[180px]">{loggedInUser.email}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-xs font-medium text-gray-500">Usuario</span>
                    <span className="text-sm text-right text-gray-900">{loggedInUser.username}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-xs font-medium text-gray-500">Rol</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold border rounded-full ${ROLE_STYLE[loggedInUser.role]}`}>
                      <Shield className="w-2.5 h-2.5" /> {loggedInUser.role}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-xs font-medium text-gray-500">Estado</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold border rounded-full ${loggedInUser.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                      {loggedInUser.status === 'ACTIVE' ? <CheckCircle className="w-2.5 h-2.5" /> : <Flag className="w-2.5 h-2.5" />}
                      {loggedInUser.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-xs font-medium text-gray-500">Ciudad</span>
                    <span className="text-sm text-right text-gray-900">{cityMap[loggedInUser.city_id || ''] || 'Sin asignar'}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-xs font-medium text-gray-500">Registro</span>
                    <span className="text-sm text-right text-gray-900">{formatDate(loggedInUser.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              {myEmployee && (
                <div className="bg-white border border-gray-200 rounded-xl shadow-xs">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      Estadísticas
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 p-5">
                    <div className="p-3 text-center bg-indigo-50 rounded-lg">
                      <div className="text-lg font-bold text-indigo-600">{myEmployee.vacation_days}</div>
                      <div className="text-[10px] text-gray-500">Vacaciones</div>
                    </div>
                    <div className="p-3 text-center bg-emerald-50 rounded-lg">
                      <div className="text-lg font-bold text-emerald-600">{myEmployee.own_days}</div>
                      <div className="text-[10px] text-gray-500">Propios</div>
                    </div>
                    <div className="p-3 text-center bg-amber-50 rounded-lg">
                      <div className="text-lg font-bold text-amber-600">{myEmployee.accumulated_days}</div>
                      <div className="text-[10px] text-gray-500">Acumulados</div>
                    </div>
                    <div className="p-3 text-center bg-rose-50 rounded-lg">
                      <div className="text-lg font-bold text-rose-600">{myEmployee.excess_days}</div>
                      <div className="text-[10px] text-gray-500">Extras</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Employee Details */}
            <div className="space-y-5 lg:col-span-2">
              {myEmployee ? (
                <>
                  {/* Work Info Card */}
                  <div className="bg-white border border-gray-200 rounded-xl shadow-xs">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                        <Briefcase className="w-4 h-4 text-gray-400" />
                        Información Laboral
                      </div>
                      <span className={`inline-flex px-2.5 py-1 text-[10px] font-bold border rounded-full ${STATUS_BADGE[myEmployee.status_id] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                        {statusMap[myEmployee.status_id] || myEmployee.status_id}
                      </span>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <div className="text-[11px] font-medium text-gray-500">Centro de Trabajo</div>
                          <div className="mt-0.5 text-sm font-medium text-gray-900">{wcMap[myEmployee.work_center_id] || myEmployee.work_center_id}</div>
                        </div>
                        <div>
                          <div className="text-[11px] font-medium text-gray-500">Categoría</div>
                          <div className="mt-0.5 text-sm font-medium text-gray-900">{catMap[myEmployee.category_id] || myEmployee.category_id}</div>
                        </div>
                        <div>
                          <div className="text-[11px] font-medium text-gray-500">Jornada</div>
                          <div className="mt-0.5 text-sm font-medium text-gray-900">{wdMap[myEmployee.work_day] || myEmployee.work_day}</div>
                        </div>
                        <div>
                          <div className="text-[11px] font-medium text-gray-500">Turno</div>
                          <div className="mt-0.5 text-sm font-medium text-gray-900">{shiftMap[myEmployee.shift] || myEmployee.shift}</div>
                        </div>
                        <div className="sm:col-span-2">
                          <div className="text-[11px] font-medium text-gray-500">Horario</div>
                          <div className="mt-0.5 text-sm font-medium text-gray-900">{myEmployee.start_time || '-'} - {myEmployee.end_time || '-'}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Personal Data Card */}
                  <div className="bg-white border border-gray-200 rounded-xl shadow-xs">
                    <div className="px-5 py-4 border-b border-gray-100">
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                        <User className="w-4 h-4 text-gray-400" />
                        Datos Personales
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <div className="text-[11px] font-medium text-gray-500">Nombre Completo</div>
                          <div className="mt-0.5 text-sm font-medium text-gray-900">{myEmployee.name} {myEmployee.lastName1} {myEmployee.lastName2 || ''}</div>
                        </div>
                        <div>
                          <div className="text-[11px] font-medium text-gray-500">Email</div>
                          <div className="mt-0.5 text-sm font-medium text-gray-900">{myEmployee.email}</div>
                        </div>
                        <div>
                          <div className="text-[11px] font-medium text-gray-500">Teléfono</div>
                          <div className="mt-0.5 text-sm font-medium text-gray-900">{myEmployee.phone}</div>
                        </div>
                        <div>
                          <div className="text-[11px] font-medium text-gray-500">Email Personal</div>
                          <div className="mt-0.5 text-sm font-medium text-gray-900">{myEmployee.personal_email || '-'}</div>
                        </div>
                        <div>
                          <div className="text-[11px] font-medium text-gray-500">Ciudad</div>
                          <div className="mt-0.5 text-sm font-medium text-gray-900">{cityMap[myEmployee.city_id || ''] || 'Sin asignar'}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contract Card */}
                  <div className="bg-white border border-gray-200 rounded-xl shadow-xs">
                    <div className="px-5 py-4 border-b border-gray-100">
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                        <FileText className="w-4 h-4 text-gray-400" />
                        Contrato
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <div className="text-[11px] font-medium text-gray-500">Tipo</div>
                          <div className="mt-0.5 text-sm font-medium text-gray-900">{ctMap[myEmployee.contract_type || ''] || 'Sin especificar'}</div>
                        </div>
                        <div>
                          <div className="text-[11px] font-medium text-gray-500">Inicio</div>
                          <div className="mt-0.5 text-sm font-medium text-gray-900">{myEmployee.contract_start_date || '-'}</div>
                        </div>
                        <div>
                          <div className="text-[11px] font-medium text-gray-500">Fin</div>
                          <div className="mt-0.5 text-sm font-medium text-gray-900">{myEmployee.contract_end_date || 'Indefinido'}</div>
                        </div>
                        <div>
                          <div className="text-[11px] font-medium text-gray-500">IRPF</div>
                          <div className="mt-0.5 text-sm font-medium text-gray-900">{myEmployee.irpf}%</div>
                        </div>
                        <div>
                          <div className="text-[11px] font-medium text-gray-500">IBAN</div>
                          <div className="mt-0.5 text-sm font-medium text-gray-900">{myEmployee.iban || '-'}</div>
                        </div>
                        <div>
                          <div className="text-[11px] font-medium text-gray-500">Taquilla</div>
                          <div className="mt-0.5 text-sm font-medium text-gray-900">{myEmployee.locker || '-'}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Card */}
                  <div className="bg-white border border-gray-200 rounded-xl shadow-xs">
                    <div className="px-5 py-4 border-b border-gray-100">
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                        <CheckCircle className="w-4 h-4 text-gray-400" />
                        Estados
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 p-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg ${myEmployee.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                        {myEmployee.active ? <CheckCircle className="w-3 h-3" /> : <Flag className="w-3 h-3" />}
                        {myEmployee.active ? 'Activo' : 'Inactivo'}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg ${myEmployee.medical_check ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                        <CheckCircle className="w-3 h-3" />
                        {myEmployee.medical_check ? 'Rev. Médica Realizada' : 'Rev. Médica Pendiente'}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg ${myEmployee.works_holidays ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                        <Calendar className="w-3 h-3" />
                        {myEmployee.works_holidays ? 'Trabaja Festivos' : 'No trabaja Festivos'}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 bg-white border border-gray-200 rounded-xl shadow-xs">
                  <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 border border-gray-200 rounded-xl">
                    <Briefcase className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">Sin ficha de empleado</h3>
                  <p className="max-w-sm mt-1 text-sm text-center text-gray-500">Tu cuenta de usuario no tiene un registro de empleado asociado. Crea uno para gestionar tus datos laborales.</p>
                  {!isReadOnly && (
                    <button onClick={() => setEmployeeModalOpen(true)} className="inline-flex items-center gap-1.5 px-5 py-2.5 mt-5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-xs">
                      <Briefcase className="w-4 h-4" /> Crear Ficha de Empleado
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <EmployeeFormModal
        isOpen={employeeModalOpen}
        onClose={() => setEmployeeModalOpen(false)}
        onSubmit={handleEmployeeSubmit}
        editingEmployee={myEmployee}
      />
    </div>
  );
};

