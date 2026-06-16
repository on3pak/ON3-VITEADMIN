import React, { useState, useEffect } from 'react';
import { Employee, VacationMonth, ClothingSizes, ClothingSize, ShoeSize } from '../../types';
import { X, ShieldAlert, UserPlus, Save, CreditCard, Mail, Award, Shirt, Plus, Minus, Search, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { useEmployees } from '../../context/EmployeeContext';
import { useLookupsContext } from '../../context/LookupContext';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Employee, 'id' | 'created_at' | 'updated_at'>, employeeId?: string) => boolean;
  editingEmployee?: Employee;
  profileMode?: boolean;
}

const CLOTHING_SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];
const SHOE_SIZES = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46];

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({ isOpen, onClose, onSubmit, editingEmployee, profileMode = false }) => {
  const { employees, getNextEmployeeId } = useEmployees();
  const {
    employeeCategories, workDays, contractTypes, shifts, cities, employeeStatuses, workCenters,
  } = useLookupsContext();
  const [name, setName] = useState('');
  const [last_name1, setLastName1] = useState('');
  const [last_name2, setLastName2] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [personal_email, setPersonal_email] = useState('');
  const [phone_fixed, setPhone_fixed] = useState('');
  const [city_id, setCity_id] = useState('');
  const [category_id, setCategory_id] = useState('ec_000001');
  const [work_center_id, setWork_center_id] = useState('wc_000001');
  const [work_day_id, setWork_day_id] = useState('wd_1');
  const [shift_id, setShift_id] = useState('');
  const [start_time, setStart_time] = useState('');
  const [end_time, setEnd_time] = useState('');
  const [status_id, setStatus_id] = useState('es_1');
  const [active, setActive] = useState(true);
  const [vacation_month, setVacation_month] = useState<'' | VacationMonth>('');
  const [vacation_days, setVacation_days] = useState(22);
  const [own_days, setOwn_days] = useState(0);
  const [accumulated_days, setAccumulated_days] = useState(0);
  const [excess_days, setExcess_days] = useState(0);
  const [irpf, setIrpf] = useState(0);
  const [iban, setIban] = useState('');
  const [lockers, setLockers] = useState<string[]>(['']);
  const [shirtSize, setShirtSize] = useState('');
  const [pantsSize, setPantsSize] = useState('');
  const [jacketSize, setJacketSize] = useState('');
  const [winter_coat, setWinter_coat] = useState('');
  const [shoeSize, setShoeSize] = useState('');
  const [medical_check, setMedical_check] = useState(true);

  const [works_holidays, setWorks_holidays] = useState(true);
  const [vaccinated, setVaccinated] = useState(false);
  const [contract_type, setContract_type] = useState('');
  const [contract_start_date, setContract_start_date] = useState('');
  const [contract_end_date, setContract_end_date] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const [employeeId, setEmployeeId] = useState('');
  const [idStatus, setIdStatus] = useState<'idle' | 'valid' | 'taken'>('idle');

  useEffect(() => {
    if (editingEmployee) {
      setName(editingEmployee.name);
      setLastName1(editingEmployee.last_name1);
      setLastName2(editingEmployee.last_name2 || '');
      setEmail(editingEmployee.email || '');
      setPhone(editingEmployee.phone);
      setPersonal_email(editingEmployee.personal_email || '');
      setPhone_fixed(editingEmployee.phone_fixed || '');
      setCity_id(editingEmployee.city_id || '');
      setCategory_id(editingEmployee.category_id);
      setWork_center_id(editingEmployee.work_center_id);
      setWork_day_id(editingEmployee.work_day_id);
      setShift_id(editingEmployee.shift_id || '');
      setStart_time(editingEmployee.start_time || '');
      setEnd_time(editingEmployee.end_time || '');
      setStatus_id(editingEmployee.status_id);
      setActive(editingEmployee.active);
      setVacation_month(editingEmployee.vacation_month || '');
      setVacation_days(editingEmployee.vacation_days);
      setOwn_days(editingEmployee.own_days);
      setAccumulated_days(editingEmployee.accumulated_days || 0);
      setExcess_days(editingEmployee.excess_days || 0);
      setIrpf(editingEmployee.irpf);
      setIban(editingEmployee.iban || '');
      setLockers(editingEmployee.lockers?.length ? editingEmployee.lockers : ['']);
      setEmployeeId(editingEmployee.id);
      setIdStatus('valid');
      const cs = editingEmployee.clothing_sizes;
      setShirtSize(cs?.summer_shirt || '');
      setPantsSize(cs?.summer_pants || '');
      setJacketSize(cs?.summer_jacket || '');
      setWinter_coat(cs?.winter_coat || '');
      setShoeSize(cs?.summer_shoe ? String(cs.summer_shoe) : '');
      setMedical_check(editingEmployee.medical_check);
      setWorks_holidays(editingEmployee.works_holidays);
      setVaccinated(editingEmployee.vaccinated ?? false);
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
      setCity_id('');
      setCategory_id('ec_000001');
      setWork_center_id('wc_000001');
      setWork_day_id('wd_1');
      setShift_id('');
      setStart_time('');
      setEnd_time('');
      setStatus_id('es_1');
      setActive(true);
      setVacation_month('');
      setVacation_days(22);
      setOwn_days(0);
      setAccumulated_days(0);
      setExcess_days(0);
      setIrpf(0);
      setIban('');
      setLockers(['']);
      setShirtSize('');
      setPantsSize('');
      setJacketSize('');
      setWinter_coat('');
      setShoeSize('');
      setMedical_check(true);
      setWorks_holidays(true);
      setVaccinated(false);
      setContract_type('');
      setContract_start_date(new Date().toISOString().split('T')[0]);
      setContract_end_date('');
      setEmployeeId('');
      setIdStatus('idle');
    }
    setFormError(null);
    setFormSuccess(null);
  }, [editingEmployee, isOpen]);

  if (!isOpen) return null;

  const handleIdCheck = (value: string) => {
    setEmployeeId(value);
    if (!value.trim()) { setIdStatus('idle'); return; }
    const exists = employees.find((e) => e.id === value.trim());
    if (exists) {
      setIdStatus('taken');
      setFormError(`El ID "${value}" ya está en uso. Sugerencia: ${getNextEmployeeId()}`);
    } else {
      setIdStatus('valid');
      setFormError(null);
    }
  };

  const handleSuggestId = () => {
    const next = getNextEmployeeId();
    setEmployeeId(next);
    setIdStatus('valid');
    setFormError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim() || !last_name1.trim()) {
      setFormError('Los campos Nombre y Primer Apellido son obligatorios.');
      return;
    }

    if (!editingEmployee && !employeeId.trim()) {
      setFormError('Debes asignar un ID de empleado.');
      return;
    }

    const clothingSizesRecord: ClothingSizes = {
      summer_shirt: (shirtSize || null) as ClothingSize,
      winter_shirt: (shirtSize || null) as ClothingSize,
      summer_pants: (pantsSize || null) as ClothingSize,
      winter_pants: (pantsSize || null) as ClothingSize,
      summer_jacket: (jacketSize || null) as ClothingSize,
      winter_jacket: (jacketSize || null) as ClothingSize,
      winter_coat: (winter_coat || null) as ClothingSize,
      cap: 'ESTANDAR',
      summer_shoe: shoeSize ? Number(shoeSize) as ShoeSize : null,
      winter_shoe: shoeSize ? Number(shoeSize) as ShoeSize : null,
    };

    const success = onSubmit({
      city_id: city_id || null,
      name: name.trim(),
      last_name1: last_name1.trim(),
      last_name2: last_name2.trim(),
      email: email.trim(),
      phone: phone.trim(),
      category_id,
      status_id,
      work_center_id,
      active,
      shift_id,
      start_time,
      end_time,
      vacation_month: vacation_month || null,

      vacation_days,
      own_days,
      accumulated_days,
      excess_days,
      personal_email: personal_email.trim(),
      phone_fixed: phone_fixed.trim(),
      work_day_id,
      iban: iban.trim(),
      lockers: lockers.filter((l) => l.trim() !== ''),
      clothing_sizes: clothingSizesRecord,
      medical_check,
      works_holidays,
      vaccinated,
      contract_type,
      contract_start_date,
      contract_end_date: contract_end_date || null,
      irpf,
    }, editingEmployee ? undefined : employeeId.trim());

    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-sidebar/80 backdrop-blur-xs">
      <div className="bg-app-card rounded-2xl shadow-xl w-full max-w-2xl border border-app-card-border overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 bg-app-bg border-b border-app-border flex items-center justify-between sticky top-0">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${editingEmployee ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'}`}>
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
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-300 text-xs rounded-xl flex items-center gap-2 font-medium">
              <ShieldAlert className="h-4 w-4 text-rose-500 dark:text-rose-400 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}
          {formSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300 text-xs rounded-xl flex items-center gap-2 font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
              <span>{formSuccess}</span>
            </div>
          )}

          {!editingEmployee && (
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="block text-xs font-bold text-app-text uppercase mb-1">ID de Empleado</label>
                <div className="relative">
                  <input
                    type="text"
                    value={employeeId}
                    onChange={(e) => handleIdCheck(e.target.value)}
                    placeholder="000009"
                    className={`w-full px-3 py-2 border rounded-xl text-sm ${idStatus === 'taken' ? 'border-rose-400 bg-rose-50 dark:bg-rose-900/20' : idStatus === 'valid' ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' : 'border-app-border'}`}
                  />
                  {idStatus === 'valid' && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />}
                  {idStatus === 'taken' && <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-500" />}
                </div>
              </div>
              <button type="button" onClick={handleSuggestId} className="px-3 py-2 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-xl flex items-center justify-center" title="Sugerir ID">
                <Search className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1"><Mail className="h-3 w-3"/> Datos Personales</h4>
            </div>
            <div className="col-span-2">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-app-text uppercase mb-1">Nombre *</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-app-text uppercase mb-1">Apellido 1 *</label>
                  <input type="text" value={last_name1} onChange={(e) => setLastName1(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-app-text uppercase mb-1">Apellido 2</label>
                  <input type="text" value={last_name2} onChange={(e) => setLastName2(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-app-text uppercase mb-1">Email Corporativo</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-app-text uppercase mb-1">Teléfono Móvil</label>
                  <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-app-text uppercase mb-1">Teléfono Fijo</label>
                  <input type="text" value={phone_fixed} onChange={(e) => setPhone_fixed(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-app-text uppercase mb-1">Email Personal</label>
                  <input type="email" value={personal_email} onChange={(e) => setPersonal_email(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-app-text uppercase mb-1">Ciudad</label>
                  <select value={city_id} onChange={(e) => setCity_id(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl bg-app-card text-sm">
                    <option value="">Seleccionar...</option>
                    {cities.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                  </select>
                </div>
              </div>
            </div>

            {!profileMode && (
              <>
              <div className="col-span-2">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1"><Award className="h-3 w-3"/> Laboral</h4>
              </div>
              <div className="col-span-2">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-app-text uppercase mb-1">Categoría</label>
                    <select value={category_id} onChange={(e) => setCategory_id(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl bg-app-card text-sm">
                      {employeeCategories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-app-text uppercase mb-1">Jornada</label>
                    <select value={work_day_id} onChange={(e) => setWork_day_id(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl bg-app-card text-sm">
                      {workDays.map((w) => (<option key={w.id} value={w.id}>{w.name}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-app-text uppercase mb-1">Turno</label>
                    <select value={shift_id} onChange={(e) => setShift_id(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl bg-app-card text-sm">
                      <option value="">Seleccionar...</option>
                      {shifts.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-app-text uppercase mb-1">Centro de Trabajo</label>
                    <select value={work_center_id} onChange={(e) => setWork_center_id(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl bg-app-card text-sm">
                      {workCenters.map((w) => (<option key={w.id} value={w.id}>{w.name}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-app-text uppercase mb-1">Estado</label>
                    <select value={status_id} onChange={(e) => setStatus_id(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl bg-app-card text-sm">
                      {employeeStatuses.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-app-text uppercase mb-1">Activo</label>
                    <div className="flex items-center h-full">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="sr-only peer" />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                        <span className="ms-2 text-sm text-app-text">{active ? 'Sí' : 'No'}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-2 flex gap-4">
                <div className="w-1/2">
                  <label className="block text-xs font-bold text-app-text uppercase mb-1">Hora Entrada</label>
                  <input type="time" value={start_time} onChange={(e) => setStart_time(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm" />
                </div>
                <div className="w-1/2">
                  <label className="block text-xs font-bold text-app-text uppercase mb-1">Hora Salida</label>
                  <input type="time" value={end_time} onChange={(e) => setEnd_time(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm" />
                </div>
              </div>
              <div className="col-span-2 flex gap-4 items-end">
                <div className="w-1/2">
                  <label className="block text-xs font-bold text-app-text uppercase mb-1">Taquillas</label>
                  <div className="space-y-2">
                    {lockers.map((l, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={l}
                          onChange={(e) => {
                            const next = [...lockers];
                            next[i] = e.target.value.replace(/[^0-9]/g, '').slice(0, 3);
                            setLockers(next);
                          }}
                          placeholder="001"
                          maxLength={3}
                          className="w-full px-3 py-2 border border-app-border rounded-xl text-sm"
                        />
                        {lockers.length > 1 && (
                          <button type="button" onClick={() => setLockers(lockers.filter((_, j) => j !== i))} className="p-2 text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg">
                            <Minus className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    {lockers.length < 2 && (
                      <button type="button" onClick={() => setLockers([...lockers, ''])} className="flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                        <Plus className="h-3 w-3" /> Añadir otra taquilla
                      </button>
                    )}
                  </div>
                </div>
                <div className="w-1/2">
                  <label className="block text-xs font-bold text-app-text uppercase mb-1">Mes de Vacaciones</label>
                  <select value={vacation_month} onChange={(e) => setVacation_month(e.target.value as VacationMonth | '')} className="w-full px-3 py-2 border border-app-border rounded-xl bg-app-card text-sm">
                    <option value="">Sin asignar</option>
                    <option value="JULIO">Julio</option>
                    <option value="AGOSTO">Agosto</option>
                    <option value="SEPTIEMBRE">Septiembre</option>
                  </select>
                  <p className="text-[11px] text-app-text-secondary/50 mt-1.5">Rota cada año</p>
                </div>
              </div>
              <div className="col-span-2 flex gap-4 mt-2">
                <div className="w-1/4">
                  <label className="block text-xs font-bold text-app-text uppercase mb-1">Vacaciones</label>
                  <input type="number" value={vacation_days} onChange={(e) => setVacation_days(Number(e.target.value))} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm" />
                </div>
                <div className="w-1/4">
                  <label className="block text-xs font-bold text-app-text uppercase mb-1">Propios</label>
                  <input type="number" value={own_days} onChange={(e) => setOwn_days(Number(e.target.value))} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm" />
                </div>
                <div className="w-1/4">
                  <label className="block text-xs font-bold text-app-text uppercase mb-1">Acumulados</label>
                  <input type="number" value={accumulated_days} onChange={(e) => setAccumulated_days(Number(e.target.value))} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm" />
                </div>
                <div className="w-1/4">
                  <label className="block text-xs font-bold text-app-text uppercase mb-1">Exceso</label>
                  <input type="number" value={excess_days} onChange={(e) => setExcess_days(Number(e.target.value))} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm" />
                </div>
              </div>
              <div className="col-span-2 flex flex-wrap gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={medical_check} onChange={(e) => setMedical_check(e.target.checked)} className="rounded" />
                  <span>Revisión Médica</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={works_holidays} onChange={(e) => setWorks_holidays(e.target.checked)} className="rounded" />
                  <span>Trabaja Festivos</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={vaccinated} onChange={(e) => setVaccinated(e.target.checked)} className="rounded" />
                  <span>Vacunado</span>
                </label>
              </div>

              <div className="col-span-2">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1"><CreditCard className="h-3 w-3"/> Datos Bancarios</h4>
              </div>
              <div className="col-span-2 flex gap-4">
                <div className="w-[80%]">
                  <label className="block text-xs font-bold text-app-text uppercase mb-1">IBAN</label>
                  <input type="text" value={iban} onChange={(e) => setIban(e.target.value)} placeholder="ES00..." className="w-full px-3 py-2 border border-app-border rounded-xl text-sm font-mono" />
                </div>
                <div className="w-[20%]">
                  <label className="block text-xs font-bold text-app-text uppercase mb-1">IRPF %</label>
                  <input type="number" value={irpf} onChange={(e) => setIrpf(Number(e.target.value))} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm" />
                </div>
              </div>

              <div className="col-span-2">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1"><FileText className="h-3 w-3"/> Contrato</h4>
              </div>
              <div className="col-span-2">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-app-text uppercase mb-1">Tipo Contrato</label>
                    <select value={contract_type} onChange={(e) => setContract_type(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl bg-app-card text-sm">
                      <option value="">Seleccionar...</option>
                      {contractTypes.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
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
                </div>
              </div>

              <div className="col-span-2">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1"><Shirt className="h-3 w-3"/> Uniformidad</h4>
              </div>
              <div className="col-span-2">
                <div className="grid grid-cols-5 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-app-text uppercase mb-1">Camisa</label>
                    <select value={shirtSize} onChange={(e) => setShirtSize(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl bg-app-card text-sm">
                      <option value="">—</option>
                      {CLOTHING_SIZES.map((v) => (<option key={v} value={v}>{v}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-app-text uppercase mb-1">Pantalón</label>
                    <select value={pantsSize} onChange={(e) => setPantsSize(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl bg-app-card text-sm">
                      <option value="">—</option>
                      {CLOTHING_SIZES.map((v) => (<option key={v} value={v}>{v}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-app-text uppercase mb-1">Chaqueta</label>
                    <select value={jacketSize} onChange={(e) => setJacketSize(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl bg-app-card text-sm">
                      <option value="">—</option>
                      {CLOTHING_SIZES.map((v) => (<option key={v} value={v}>{v}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-app-text uppercase mb-1">Chaquetón</label>
                    <select value={winter_coat} onChange={(e) => setWinter_coat(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl bg-app-card text-sm">
                      <option value="">—</option>
                      {CLOTHING_SIZES.map((v) => (<option key={v} value={v}>{v}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-app-text uppercase mb-1">Zapatos</label>
                    <select value={shoeSize} onChange={(e) => setShoeSize(e.target.value)} className="w-full px-3 py-2 border border-app-border rounded-xl bg-app-card text-sm">
                      <option value="">—</option>
                      {SHOE_SIZES.map((v) => (<option key={v} value={v}>{v}</option>))}
                    </select>
                  </div>
                </div>
              </div>
              </>
            )}
          </div>

          <div className="pt-4 border-t border-app-border flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-app-border hover:bg-app-bg text-app-text-secondary text-sm font-semibold rounded-xl">Cancelar</button>
            <button type="submit" className={`px-5 py-2 text-white text-sm font-semibold rounded-xl shadow-xs ${editingEmployee ? 'bg-amber-600 hover:bg-amber-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
              {editingEmployee ? 'Guardar Cambios' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};