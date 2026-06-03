import React, { useState, useEffect } from 'react';
import { Employee, VacationMonth } from '../../types';
import { INITIAL_CITIES, INITIAL_EMPLOYEE_CATEGORIES, INITIAL_EMPLOYEE_STATUSES, INITIAL_WORK_DAYS, INITIAL_CONTRACT_TYPES } from '../../data/mockEmployees';
import { INITIAL_WORK_CENTERS } from '../../data/mockWorkCenters';
import { X, ShieldAlert, UserPlus, Save, CreditCard, Calendar, Clock, Phone, Mail, Award } from 'lucide-react';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => boolean;
  editingEmployee?: Employee;
  profileMode?: boolean;
}

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({ isOpen, onClose, onSubmit, editingEmployee, profileMode = false }) => {
  const [name, setName] = useState('');
  const [last_name1, setLastName1] = useState('');
  const [last_name2, setLastName2] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [personal_email, setPersonal_email] = useState('');
  const [phone_fixed, setPhone_fixed] = useState('');
  const [category_id, setCategory_id] = useState('ec_1');
  const [status_id, setStatus_id] = useState('es_1');
  const [work_center_id, setWork_center_id] = useState('wc_1');
  const [work_day_id, setWork_day_id] = useState('wd_1');
  const [start_time, setStart_time] = useState('');
  const [end_time, setEnd_time] = useState('');
  const [vacation_month, setVacation_month] = useState<'' | VacationMonth>('');
  const [vacation_days, setVacation_days] = useState(22);
  const [own_days, setOwn_days] = useState(0);
  const [accumulated_days, setAccumulated_days] = useState(0);
  const [excess_days, setExcess_days] = useState(0);
  const [irpf, setIrpf] = useState(0);
  const [iban, setIban] = useState('');
  const [locker, setLocker] = useState('');
  const [medical_check, setMedical_check] = useState(true);
  const [works_holidays, setWorks_holidays] = useState(true);
  const [active, setActive] = useState(true);
  const [contract_type, setContract_type] = useState('');
  const [contract_start_date, setContract_start_date] = useState('');
  const [contract_end_date, setContract_end_date] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (editingEmployee) {
      setName(editingEmployee.name);
      setLastName1(editingEmployee.last_name1);
      setLastName2(editingEmployee.last_name2 || '');
      setEmail(editingEmployee.email);
      setPhone(editingEmployee.phone);
      setPersonal_email(editingEmployee.personal_email || '');
      setPhone_fixed(editingEmployee.phone_fixed || '');
      setCategory_id(editingEmployee.category_id);
      setStatus_id(editingEmployee.status_id);
      setWork_center_id(editingEmployee.work_center_id);
      setWork_day_id(editingEmployee.work_day_id);
      setStart_time(editingEmployee.start_time || '');
      setEnd_time(editingEmployee.end_time || '');
      setVacation_month(editingEmployee.vacation_month || '');
      setVacation_days(editingEmployee.vacation_days);
      setOwn_days(editingEmployee.own_days);
      setAccumulated_days(editingEmployee.accumulated_days);
      setExcess_days(editingEmployee.excess_days);
      setIrpf(editingEmployee.irpf);
      setIban(editingEmployee.iban || '');
      setLocker(editingEmployee.locker || '');
      setMedical_check(editingEmployee.medical_check);
      setWorks_holidays(editingEmployee.works_holidays);
      setActive(editingEmployee.active);
      setContract_type(editingEmployee.contract_type || '');
      setContract_start_date(editingEmployee.contract_start_date || '');
      setContract_end_date(editingEmployee.contract_end_date || '');
    } else {
      setName('');
      setLastName1('');
      setLastName2('');
      setEmail('');
      setPhone('');
      setPersonal_email('');
      setPhone_fixed('');
      setCategory_id('ec_1');
      setStatus_id('es_1');
      setWork_center_id('wc_1');
      setWork_day_id('wd_1');
      setStart_time('');
      setEnd_time('');
      setVacation_month('');
      setVacation_days(22);
      setOwn_days(0);
      setAccumulated_days(0);
      setExcess_days(0);
      setIrpf(0);
      setIban('');
      setLocker('');
      setMedical_check(true);
      setWorks_holidays(true);
      setActive(true);
      setContract_type('');
      setContract_start_date('');
      setContract_end_date('');
    }
    setFormError(null);
  }, [editingEmployee, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim() || !last_name1.trim() || !email.trim()) {
      setFormError('Los campos Nombre, Apellido y Email son obligatorios.');
      return;
    }

    const success = onSubmit({
      city_id: editingEmployee?.city_id ?? null,
      name: name.trim(),
      last_name1: last_name1.trim(),
      last_name2: last_name2.trim(),
      email: email.trim(),
      phone: phone.trim(),
      category_id,
      status_id,
      work_center_id,
      active,
      shift_id: editingEmployee?.shift_id ?? '',
      start_time,
      end_time,
      vacation_month: vacation_month || null,
      vacation_year: vacation_month ? new Date().getFullYear() : null,
      vacation_days,
      own_days,
      accumulated_days,
      excess_days,
      personal_email: personal_email.trim(),
      phone_fixed: phone_fixed.trim(),
      work_day_id,
      iban: iban.trim(),
      locker: locker.trim(),
      medical_check,
      works_holidays,
      contract_type,
      contract_start_date,
      contract_end_date: contract_end_date || null,
      irpf,
    });

    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-sidebar/80 backdrop-blur-xs">
      <div className="bg-app-card rounded-2xl shadow-xl w-full max-w-2xl border border-app-card-border overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 bg-app-bg border-b border-app-border flex items-center justify-between sticky top-0">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${editingEmployee ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}>
              {editingEmployee ? <Save className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="font-bold text-app-text">
                {editingEmployee ? `Editar: ${editingEmployee.name} ${editingEmployee.last_name1}` : 'Nuevo Empleado'}
              </h3>
              <p className="text-xs text-app-text-secondary">Complete todos los datos</p>
            </div>
          </div>
          <button onClick={onClose} className="text-app-text-secondary hover:text-app-text-secondary p-1.5 hover:bg-app-bg rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2 font-medium">
              <ShieldAlert className="h-4 w-4 text-rose-500 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2 flex items-center gap-1"><Mail className="h-3 w-3"/> Datos Personales</h4>
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-bold text-app-text uppercase mb-1">Nombre *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm" />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-bold text-app-text uppercase mb-1">Apellido 1 *</label>
              <input type="text" value={last_name1} onChange={(e) => setLastName1(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-app-text uppercase mb-1">Apellido 2</label>
              <input type="text" value={last_name2} onChange={(e) => setLastName2(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-app-text uppercase mb-1">Email Empresa *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-app-text uppercase mb-1">Teléfono Móvil</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-app-text uppercase mb-1">Email Personal</label>
              <input type="email" value={personal_email} onChange={(e) => setPersonal_email(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-app-text uppercase mb-1">Teléfono Fijo</label>
              <input type="text" value={phone_fixed} onChange={(e) => setPhone_fixed(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm" />
            </div>

            {!profileMode && (
              <>
              <div className="col-span-2">
                <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2 flex items-center gap-1"><Award className="h-3 w-3"/> Laboral</h4>
              </div>
              <div>
                <label className="block text-xs font-bold text-app-text uppercase mb-1">Categoría</label>
                <select value={category_id} onChange={(e) => setCategory_id(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl bg-white text-sm">
                  {INITIAL_EMPLOYEE_CATEGORIES.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-app-text uppercase mb-1">Estado</label>
                <select value={status_id} onChange={(e) => setStatus_id(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl bg-white text-sm">
                  {INITIAL_EMPLOYEE_STATUSES.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-app-text uppercase mb-1">Centro de Trabajo</label>
                <select value={work_center_id} onChange={(e) => setWork_center_id(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl bg-white text-sm">
                  {INITIAL_WORK_CENTERS.map((w) => (<option key={w.id} value={w.id}>{w.name}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-app-text uppercase mb-1">Jornada</label>
                <select value={work_day_id} onChange={(e) => setWork_day_id(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl bg-white text-sm">
                  {INITIAL_WORK_DAYS.map((w) => (<option key={w.id} value={w.id}>{w.name}</option>))}
                </select>
              </div>

              <div className="col-span-2">
                <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2 flex items-center gap-1"><Clock className="h-3 w-3"/> Horario</h4>
              </div>
              <div>
                <label className="block text-xs font-bold text-app-text uppercase mb-1">Hora Entrada</label>
                <input type="time" value={start_time} onChange={(e) => setStart_time(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-app-text uppercase mb-1">Hora Salida</label>
                <input type="time" value={end_time} onChange={(e) => setEnd_time(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm" />
              </div>

              <div className="col-span-2">
                <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2 flex items-center gap-1"><Calendar className="h-3 w-3"/> Vacaciones</h4>
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-xs font-bold text-app-text uppercase mb-1">Mes de Vacaciones</label>
                <select value={vacation_month} onChange={(e) => setVacation_month(e.target.value as 'JULIO' | 'AGOSTO' | 'SEPTIEMBRE' | '')} className="w-full px-3 py-2 border border-app-border rounded-xl bg-white text-sm">
                  <option value="">Sin asignar</option>
                  <option value="JULY">Julio</option>
                  <option value="AUGUST">Agosto</option>
                  <option value="SEPTEMBER">Septiembre</option>
                </select>
                <p className="text-[11px] text-gray-400 mt-1.5">Rota cada año: julio → agosto → septiembre → julio...</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-app-text uppercase mb-1">Días Vacaciones</label>
                <input type="number" value={vacation_days} onChange={(e) => setVacation_days(Number(e.target.value))} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-app-text uppercase mb-1">Días Propios</label>
                <input type="number" value={own_days} onChange={(e) => setOwn_days(Number(e.target.value))} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-app-text uppercase mb-1">Días Acumulados</label>
                <input type="number" value={accumulated_days} onChange={(e) => setAccumulated_days(Number(e.target.value))} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-app-text uppercase mb-1">Días Extras</label>
                <input type="number" value={excess_days} onChange={(e) => setExcess_days(Number(e.target.value))} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm" />
              </div>

              <div className="col-span-2">
                <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2 flex items-center gap-1"><CreditCard className="h-3 w-3"/> Datos Bancarios</h4>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-app-text uppercase mb-1">IBAN</label>
                <input type="text" value={iban} onChange={(e) => setIban(e.target.value)} placeholder="ES00..." className="w-full px-3 py-2 border border-app-border rounded-xl text-sm font-mono" />
              </div>
              <div>
                <label className="block text-xs font-bold text-app-text uppercase mb-1">IRPF %</label>
                <input type="number" value={irpf} onChange={(e) => setIrpf(Number(e.target.value))} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-app-text uppercase mb-1">Taquilla</label>
                <input type="text" value={locker} onChange={(e) => setLocker(e.target.value)} placeholder="L-001" className="w-full px-3 py-2 border border-app-border rounded-xl text-sm" />
              </div>

              <div className="col-span-2">
                <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">Contrato</h4>
              </div>
              <div>
                <label className="block text-xs font-bold text-app-text uppercase mb-1">Tipo Contrato</label>
                <select value={contract_type} onChange={(e) => setContract_type(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl bg-white text-sm">
                  <option value="">Seleccionar...</option>
                  {INITIAL_CONTRACT_TYPES.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-app-text uppercase mb-1">Fecha Inicio</label>
                <input type="date" value={contract_start_date} onChange={(e) => setContract_start_date(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-app-text uppercase mb-1">Fecha Fin</label>
                <input type="date" value={contract_end_date} onChange={(e) => setContract_end_date(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm" />
              </div>

              <div className="col-span-2">
                <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">Extras</h4>
              </div>
              <div className="col-span-2 flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="rounded" />
                  <span>Activo</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={medical_check} onChange={(e) => setMedical_check(e.target.checked)} className="rounded" />
                  <span>Revisión Médica</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={works_holidays} onChange={(e) => setWorks_holidays(e.target.checked)} className="rounded" />
                  <span>Trabaja Festivos</span>
                </label>
              </div>
              </>
            )}
          </div>

          <div className="pt-4 border-t border-app-border flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-200 hover:bg-app-bg text-app-text-secondary text-sm font-semibold rounded-xl">Cancelar</button>
            <button type="submit" className={`px-5 py-2 text-white text-sm font-semibold rounded-xl shadow-xs ${editingEmployee ? 'bg-amber-600 hover:bg-amber-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
              {editingEmployee ? 'Guardar Cambios' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};