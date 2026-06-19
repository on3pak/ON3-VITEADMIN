import React, { useState, useEffect } from 'react';
import { Employee, VacationMonth, ClothingSizes, ClothingSize, ShoeSize, UserRole } from '../../types';
import {
  X, ShieldAlert, UserPlus, Save, CreditCard, Award, Shirt, Plus, Minus,
  Search, CheckCircle2, AlertCircle, FileText, Calendar,
  ChevronLeft, ChevronRight, User,
} from 'lucide-react';
import { useEmployees } from '../../context/EmployeeContext';
import { useLookupsContext } from '../../context/LookupContext';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Employee, 'id' | 'created_at' | 'updated_at'>, employeeId?: string) => boolean;
  onCreateUser?: (data: { email: string; password: string; role: string; employeeId?: string }) => void;
  editingEmployee?: Employee;
  profileMode?: boolean;
}

const CLOTHING_SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];
const SHOE_SIZES = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46];
const STEPS = ['Identificación', 'Laboral', 'Vacaciones', 'Uniformidad'];
const STORAGE_KEY = 'employee_form_draft';

const capitalize = (v: string) => v.replace(/\b\w/g, (c) => c.toUpperCase());

const generateCorporateEmail = (name: string, last1: string, id: string) => {
  const initial = name.trim().toLowerCase().charAt(0) || 'x';
  const surname = last1.trim().toLowerCase().replace(/\s+/g, '');
  const num = parseInt(id, 10) || '';
  return `${initial}.${surname}${num}@on3.com`;
};

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({ isOpen, onClose, onSubmit, editingEmployee, profileMode = false, onCreateUser }) => {
  const { employees, getNextEmployeeId } = useEmployees();
  const {
    employeeCategories, workDays, contractTypes, shifts, cities, employeeStatuses, workCenters,
  } = useLookupsContext();
  const [currentStep, setCurrentStep] = useState(0);
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
  const [createUser, setCreateUser] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('user');

  const autoEmail = generateCorporateEmail(name, last_name1, employeeId);

  const saveDraft = () => {
    if (editingEmployee) return;
    const draft = {
      name, last_name1, last_name2, phone, email, personal_email, phone_fixed, city_id,
      category_id, work_center_id, work_day_id, shift_id, start_time, end_time, status_id, active,
      vacation_month, vacation_days, own_days, accumulated_days, excess_days, irpf, iban, lockers,
      shirtSize, pantsSize, jacketSize, winter_coat, shoeSize, medical_check, works_holidays, vaccinated,
      contract_type, contract_start_date, contract_end_date, employeeId, idStatus, createUser, userEmail, userPassword, userRole,
    };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(draft)); } catch { /* ignore */ }
  };

  const restoreDraft = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const d = JSON.parse(raw);
      setName(d.name || ''); setLastName1(d.last_name1 || ''); setLastName2(d.last_name2 || '');
      setPhone(d.phone || ''); setEmail(d.email || ''); setPersonal_email(d.personal_email || '');
      setPhone_fixed(d.phone_fixed || ''); setCity_id(d.city_id || '');
      setCategory_id(d.category_id || 'ec_000001'); setWork_center_id(d.work_center_id || 'wc_000001');
      setWork_day_id(d.work_day_id || 'wd_1'); setShift_id(d.shift_id || '');
      setStart_time(d.start_time || ''); setEnd_time(d.end_time || '');
      setStatus_id(d.status_id || 'es_1'); setActive(d.active ?? true);
      setVacation_month(d.vacation_month || '');
      setVacation_days(d.vacation_days ?? 22); setOwn_days(d.own_days ?? 0);
      setAccumulated_days(d.accumulated_days ?? 0); setExcess_days(d.excess_days ?? 0);
      setIrpf(d.irpf ?? 0); setIban(d.iban || '');
      setLockers(d.lockers?.length ? d.lockers : ['']);
      setShirtSize(d.shirtSize || ''); setPantsSize(d.pantsSize || ''); setJacketSize(d.jacketSize || '');
      setWinter_coat(d.winter_coat || ''); setShoeSize(d.shoeSize || '');
      setMedical_check(d.medical_check ?? true); setWorks_holidays(d.works_holidays ?? true);
      setVaccinated(d.vaccinated ?? false); setContract_type(d.contract_type || '');
      setContract_start_date(d.contract_start_date || ''); setContract_end_date(d.contract_end_date || '');
      setEmployeeId(d.employeeId || ''); setIdStatus(d.idStatus || 'idle');
      setCreateUser(d.createUser || false); setUserEmail(d.userEmail || ''); setUserPassword(d.userPassword || ''); setUserRole(d.userRole || 'user');
    } catch { /* ignore */ }
  };

  const clearDraft = () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  };

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
      setCreateUser(false);
      clearDraft();
    } else {
      restoreDraft();
      if (!city_id && cities.length > 0) setCity_id(cities[0].id);
    }
    setCurrentStep(0);
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

    if (!city_id) {
      setFormError('La ciudad es obligatoria.');
      return;
    }

    if (createUser) {
      if (!userEmail.trim()) {
        setFormError('El email de usuario es obligatorio.');
        return;
      }
      if (!userPassword || userPassword.length < 8) {
        setFormError('La contraseña debe tener al menos 8 caracteres.');
        return;
      }
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
      email: createUser ? autoEmail : email,
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
      if (createUser && onCreateUser) {
        onCreateUser({ email: autoEmail, password: userPassword, role: userRole, employeeId: editingEmployee ? undefined : employeeId.trim() });
      }
      clearDraft();
      onClose();
    }
  };

  const canProceed = () => {
    if (currentStep === 0) {
      if (!name.trim() || !last_name1.trim()) return false;
      if (!city_id) return false;
      if (createUser) {
        if (!userEmail.trim()) return false;
        if (!userPassword || userPassword.length < 8) return false;
      }
    }
    return true;
  };

  const renderStepIndicator = () => (
    <div className="flex items-center gap-1 px-6 pt-4 pb-2">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-1 flex-1">
          <div className={`flex items-center gap-1.5 ${i <= currentStep ? 'text-primary-600 dark:text-primary-400' : 'text-app-text-secondary/50'}`}>
            <div className={`size-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
              i === currentStep
                ? 'bg-primary-600 text-white shadow-xs'
                : i < currentStep
                  ? 'bg-emerald-500 text-white'
                  : 'bg-app-bg border border-app-border text-app-text-secondary'
            }`}>
              {i < currentStep ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
            </div>
            <span className={`text-[10px] font-semibold hidden sm:inline ${i === currentStep ? 'text-app-text' : ''}`}>{label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-px mx-1 ${i < currentStep ? 'bg-emerald-400' : 'bg-app-border'}`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep0 = () => (
    <>
      <div className="col-span-2">
        <h4 className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-2 flex items-center gap-2">
          <User className="h-3 w-3" /> Datos Personales
          {!editingEmployee && (
            <label className="flex items-center gap-1.5 ml-auto px-2.5 py-1 rounded-full border border-primary-200 dark:border-primary-800 bg-primary-50/60 dark:bg-primary-900/15 text-[10px] font-semibold text-primary-700 dark:text-primary-300 cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-all select-none">
              <input
                type="checkbox"
                checked={createUser}
                onChange={(e) => {
                  setCreateUser(e.target.checked);
                  if (e.target.checked) {
                    setUserEmail(autoEmail);
                    setUserPassword('');
                    setUserRole('user');
                  } else {
                    setUserEmail('');
                    setUserPassword('');
                    setUserRole('user');
                  }
                  saveDraft();
                }}
                className="rounded border-primary-300 text-primary-600 focus:ring-primary-500 size-3"
              />
              + Usuario
            </label>
          )}
        </h4>
      </div>
      <div className="col-span-2 space-y-3">
        <div className="grid grid-cols-2 gap-4">
          {!editingEmployee && (
          <div>
            <label className="block text-xs font-bold text-app-text uppercase mb-1">ID de Empleado</label>
            <div className="relative">
              <input
                type="text"
                value={employeeId}
                onChange={(e) => handleIdCheck(e.target.value)}
                placeholder="000001"
                className={`w-full px-3 py-2 border rounded-xl text-sm pe-10 ${
                  idStatus === 'taken' ? 'border-rose-400 bg-rose-50 dark:bg-rose-900/20' :
                  idStatus === 'valid' ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' :
                  'border-app-border bg-app-card'
                }`}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-0.5">
                {idStatus === 'valid' && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                {idStatus === 'taken' && <AlertCircle className="h-4 w-4 text-rose-500" />}
                <button
                  type="button"
                  onClick={handleSuggestId}
                  className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-all"
                  title="Buscar ID libre"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          )}
          <div className={editingEmployee ? 'col-span-2' : ''}>
            <label className="block text-xs font-bold text-app-text uppercase mb-1">Ciudad *</label>
            <select value={city_id} onChange={(e) => { setCity_id(e.target.value); saveDraft(); }} className="w-full px-3 py-2 border border-app-border rounded-xl bg-app-card text-sm">
              {cities.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-app-text uppercase mb-1">Nombre *</label>
            <input type="text" value={name} onChange={(e) => { setName(capitalize(e.target.value)); saveDraft(); }} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm bg-app-card" placeholder="Juan" />
          </div>
          <div>
            <label className="block text-xs font-bold text-app-text uppercase mb-1">Apellido 1 *</label>
            <input type="text" value={last_name1} onChange={(e) => { setLastName1(capitalize(e.target.value)); saveDraft(); }} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm bg-app-card" placeholder="García" />
          </div>
          <div>
            <label className="block text-xs font-bold text-app-text uppercase mb-1">Apellido 2</label>
            <input type="text" value={last_name2} onChange={(e) => { setLastName2(capitalize(e.target.value)); saveDraft(); }} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm bg-app-card" placeholder="López" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-app-text uppercase mb-1">Email Personal</label>
            <input type="email" value={personal_email} onChange={(e) => { setPersonal_email(e.target.value); saveDraft(); }} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm bg-app-card" placeholder="juan@gmail.com" />
          </div>
          <div>
            <label className="block text-xs font-bold text-app-text uppercase mb-1">Teléfono Móvil</label>
            <input type="text" value={phone} onChange={(e) => { setPhone(e.target.value); saveDraft(); }} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm bg-app-card" placeholder="612 345 678" />
          </div>
          <div>
            <label className="block text-xs font-bold text-app-text uppercase mb-1">Teléfono Fijo</label>
            <input type="text" value={phone_fixed} onChange={(e) => { setPhone_fixed(e.target.value); saveDraft(); }} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm bg-app-card" placeholder="934 123 456" />
          </div>
        </div>

        {createUser && (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-app-text uppercase mb-1">Email</label>
              <input type="email" value={userEmail} disabled className="w-full px-3 py-2 border border-app-border rounded-xl text-sm bg-app-bg/50 text-app-text-secondary cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-xs font-bold text-app-text uppercase mb-1">Contraseña *</label>
              <div className="relative">
                <input
                  type="text"
                  value={userPassword}
                  onChange={(e) => { setUserPassword(e.target.value); saveDraft(); }}
                  placeholder="Mín. 8 caracteres"
                  className={`w-full px-3 py-2 border rounded-xl text-sm pe-10 bg-app-card ${
                    userPassword && userPassword.length < 8 ? 'border-rose-400' : 'border-app-border'
                  }`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <button
                    type="button"
                    onClick={() => {
                      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                      setUserPassword(Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join(''));
                      saveDraft();
                    }}
                    className="p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-all"
                    title="Generar contraseña segura"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a4 4 0 0 1 4 4v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h1V6a4 4 0 0 1 4-4z"/>
                      <path d="M12 13v4"/>
                      <path d="M10 15h4"/>
                    </svg>
                  </button>
                </div>
              </div>
              {userPassword && userPassword.length < 8 && (
                <p className="text-[11px] text-rose-500 mt-1">Mínimo 8 caracteres</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-app-text uppercase mb-1">Rol *</label>
              <select value={userRole} onChange={(e) => { setUserRole(e.target.value as UserRole); saveDraft(); }} className="w-full px-3 py-2 border border-app-border rounded-xl bg-app-card text-sm">
                <option value="user">Usuario</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
                <option value="root">Root</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </>
  );

  const renderStep1 = () => (
    <>
      <div className="col-span-2">
        <h4 className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-2 flex items-center gap-1">
          <Award className="h-3 w-3" /> Laboral
        </h4>
      </div>
      <div className="col-span-2">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-app-text uppercase mb-1">Categoría</label>
            <select value={category_id} onChange={(e) => { setCategory_id(e.target.value); saveDraft(); }} className="w-full px-3 py-2 border border-app-border rounded-xl bg-app-card text-sm">
              {employeeCategories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-app-text uppercase mb-1">Jornada</label>
            <select value={work_day_id} onChange={(e) => { setWork_day_id(e.target.value); saveDraft(); }} className="w-full px-3 py-2 border border-app-border rounded-xl bg-app-card text-sm">
              {workDays.map((w) => (<option key={w.id} value={w.id}>{w.name}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-app-text uppercase mb-1">Turno</label>
            <select value={shift_id} onChange={(e) => { setShift_id(e.target.value); saveDraft(); }} className="w-full px-3 py-2 border border-app-border rounded-xl bg-app-card text-sm">
              <option value="">Seleccionar...</option>
              {shifts.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-app-text uppercase mb-1">Centro de Trabajo</label>
            <select value={work_center_id} onChange={(e) => { setWork_center_id(e.target.value); saveDraft(); }} className="w-full px-3 py-2 border border-app-border rounded-xl bg-app-card text-sm">
              {workCenters.map((w) => (<option key={w.id} value={w.id}>{w.name}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-app-text uppercase mb-1">Estado</label>
            <select value={status_id} onChange={(e) => { setStatus_id(e.target.value); saveDraft(); }} className="w-full px-3 py-2 border border-app-border rounded-xl bg-app-card text-sm">
              {employeeStatuses.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-app-text uppercase mb-1">Activo</label>
            <div className="flex items-center h-full">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={active} onChange={(e) => { setActive(e.target.checked); saveDraft(); }} className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500" />
                <span className="ms-2 text-sm text-app-text">{active ? 'Sí' : 'No'}</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-app-text uppercase mb-1">Hora Entrada</label>
            <input type="time" value={start_time} onChange={(e) => { setStart_time(e.target.value); saveDraft(); }} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm bg-app-card" />
          </div>
          <div>
            <label className="block text-xs font-bold text-app-text uppercase mb-1">Hora Salida</label>
            <input type="time" value={end_time} onChange={(e) => { setEnd_time(e.target.value); saveDraft(); }} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm bg-app-card" />
          </div>
          <div>
            <label className="block text-xs font-bold text-app-text uppercase mb-1">Taquillas</label>
            <div className="space-y-1.5">
              {lockers.map((l, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={l}
                    onChange={(e) => {
                      const next = [...lockers];
                      next[i] = e.target.value.replace(/[^0-9]/g, '').slice(0, 3);
                      setLockers(next);
                      saveDraft();
                    }}
                    placeholder="001"
                    maxLength={3}
                    className="w-full px-3 py-2 border border-app-border rounded-xl text-sm bg-app-card"
                  />
                  {lockers.length > 1 && (
                    <button type="button" onClick={() => { setLockers(lockers.filter((_, j) => j !== i)); saveDraft(); }} className="p-2 text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg">
                      <Minus className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              {lockers.length < 2 && (
                <button type="button" onClick={() => { setLockers([...lockers, '']); saveDraft(); }} className="flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                  <Plus className="h-3 w-3" /> Añadir otra taquilla
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-2">
        <h4 className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-2 flex items-center gap-1">
          <FileText className="h-3 w-3" /> Contrato
        </h4>
      </div>
      <div className="col-span-2">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-app-text uppercase mb-1">Tipo Contrato</label>
            <select value={contract_type} onChange={(e) => { setContract_type(e.target.value); saveDraft(); }} className="w-full px-3 py-2 border border-app-border rounded-xl bg-app-card text-sm">
              <option value="">Seleccionar...</option>
              {contractTypes.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-app-text uppercase mb-1">Fecha Inicio</label>
            <input type="date" value={contract_start_date} onChange={(e) => { setContract_start_date(e.target.value); saveDraft(); }} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm bg-app-card" />
          </div>
          <div>
            <label className="block text-xs font-bold text-app-text uppercase mb-1">Fecha Fin</label>
            <input type="date" value={contract_end_date} onChange={(e) => { setContract_end_date(e.target.value); saveDraft(); }} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm bg-app-card" />
          </div>
        </div>
      </div>

      <div className="col-span-2 flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={medical_check} onChange={(e) => { setMedical_check(e.target.checked); saveDraft(); }} className="rounded" />
          <span className="font-medium text-app-text">Revisión Médica</span>
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={works_holidays} onChange={(e) => { setWorks_holidays(e.target.checked); saveDraft(); }} className="rounded" />
          <span className="font-medium text-app-text">Trabaja Festivos</span>
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={vaccinated} onChange={(e) => { setVaccinated(e.target.checked); saveDraft(); }} className="rounded" />
          <span className="font-medium text-app-text">Vacunado</span>
        </label>
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <div className="col-span-2">
        <h4 className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-2 flex items-center gap-1">
          <Calendar className="h-3 w-3" /> Vacaciones
        </h4>
      </div>
      <div className="col-span-2">
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold text-app-text uppercase mb-1">Mes de Vacaciones</label>
            <select value={vacation_month} onChange={(e) => { setVacation_month(e.target.value as VacationMonth | ''); saveDraft(); }} className="w-full px-3 py-2 border border-app-border rounded-xl bg-app-card text-sm">
              <option value="">Sin asignar</option>
              <option value="JULIO">Julio</option>
              <option value="AGOSTO">Agosto</option>
              <option value="SEPTIEMBRE">Septiembre</option>
            </select>
            <p className="text-[10px] text-app-text-secondary/50 mt-1">Rota cada año</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-app-text uppercase mb-1">Vacaciones</label>
            <input type="number" value={vacation_days} onChange={(e) => { setVacation_days(Number(e.target.value)); saveDraft(); }} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm bg-app-card" />
          </div>
          <div>
            <label className="block text-xs font-bold text-app-text uppercase mb-1">Propios</label>
            <input type="number" value={own_days} onChange={(e) => { setOwn_days(Number(e.target.value)); saveDraft(); }} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm bg-app-card" />
          </div>
          <div>
            <label className="block text-xs font-bold text-app-text uppercase mb-1">Acumulados</label>
            <input type="number" value={accumulated_days} onChange={(e) => { setAccumulated_days(Number(e.target.value)); saveDraft(); }} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm bg-app-card" />
          </div>
          <div>
            <label className="block text-xs font-bold text-app-text uppercase mb-1">Exceso</label>
            <input type="number" value={excess_days} onChange={(e) => { setExcess_days(Number(e.target.value)); saveDraft(); }} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm bg-app-card" />
          </div>
        </div>
      </div>

      <div className="col-span-2">
        <h4 className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-2 flex items-center gap-1">
          <CreditCard className="h-3 w-3" /> Datos Bancarios
        </h4>
      </div>
      <div className="col-span-2">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-3">
            <label className="block text-xs font-bold text-app-text uppercase mb-1">IBAN</label>
            <input type="text" value={iban} onChange={(e) => { setIban(e.target.value); saveDraft(); }} placeholder="ES00..." className="w-full px-3 py-2 border border-app-border rounded-xl text-sm font-mono bg-app-card" />
          </div>
          <div>
            <label className="block text-xs font-bold text-app-text uppercase mb-1">IRPF %</label>
            <input type="number" value={irpf} onChange={(e) => { setIrpf(Number(e.target.value)); saveDraft(); }} className="w-full px-3 py-2 border border-app-border rounded-xl text-sm bg-app-card" />
          </div>
        </div>
      </div>
    </>
  );

  const renderStep3 = () => (
    <>
      <div className="col-span-2">
        <h4 className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-2 flex items-center gap-1">
          <Shirt className="h-3 w-3" /> Uniformidad
        </h4>
      </div>
      <div className="col-span-2">
        <div className="grid grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-bold text-app-text uppercase mb-1">Camisa</label>
            <select value={shirtSize} onChange={(e) => { setShirtSize(e.target.value); saveDraft(); }} className="w-full px-3 py-2 border border-app-border rounded-xl bg-app-card text-sm">
              <option value="">—</option>
              {CLOTHING_SIZES.map((v) => (<option key={v} value={v}>{v}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-app-text uppercase mb-1">Pantalón</label>
            <select value={pantsSize} onChange={(e) => { setPantsSize(e.target.value); saveDraft(); }} className="w-full px-3 py-2 border border-app-border rounded-xl bg-app-card text-sm">
              <option value="">—</option>
              {CLOTHING_SIZES.map((v) => (<option key={v} value={v}>{v}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-app-text uppercase mb-1">Chaqueta</label>
            <select value={jacketSize} onChange={(e) => { setJacketSize(e.target.value); saveDraft(); }} className="w-full px-3 py-2 border border-app-border rounded-xl bg-app-card text-sm">
              <option value="">—</option>
              {CLOTHING_SIZES.map((v) => (<option key={v} value={v}>{v}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-app-text uppercase mb-1">Chaquetón</label>
            <select value={winter_coat} onChange={(e) => { setWinter_coat(e.target.value); saveDraft(); }} className="w-full px-3 py-2 border border-app-border rounded-xl bg-app-card text-sm">
              <option value="">—</option>
              {CLOTHING_SIZES.map((v) => (<option key={v} value={v}>{v}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-app-text uppercase mb-1">Zapatos</label>
            <select value={shoeSize} onChange={(e) => { setShoeSize(e.target.value); saveDraft(); }} className="w-full px-3 py-2 border border-app-border rounded-xl bg-app-card text-sm">
              <option value="">—</option>
              {SHOE_SIZES.map((v) => (<option key={v} value={String(v)}>{v}</option>))}
            </select>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-sidebar/80 backdrop-blur-xs">
      <div className="bg-app-card rounded-2xl shadow-xl w-full max-w-2xl border border-app-card-border overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 bg-app-bg border-b border-app-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${editingEmployee ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'}`}>
              {editingEmployee ? <Save className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="font-bold text-app-text">
                {editingEmployee ? `Editar: ${editingEmployee.name} ${editingEmployee.last_name1}` : 'Nuevo Empleado'}
              </h3>
              <p className="text-xs text-app-text-secondary">
                {editingEmployee ? 'Modifica los datos del empleado' : `Paso ${currentStep + 1} de ${STEPS.length} — ${STEPS[currentStep]}`}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-app-text-secondary hover:text-app-text-secondary p-1.5 hover:bg-app-bg rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {!editingEmployee && !profileMode && renderStepIndicator()}

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          {formError && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-300 text-xs rounded-xl flex items-center gap-2 font-medium">
              <ShieldAlert className="h-4 w-4 text-rose-500 dark:text-rose-400 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {currentStep === 0 && renderStep0()}
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </div>
        </form>

        <div className="px-6 py-4 border-t border-app-border flex items-center justify-between shrink-0 bg-app-bg/50">
          <div>
            {currentStep > 0 && (
              <button
                type="button"
                onClick={() => setCurrentStep((s) => s - 1)}
                className="flex items-center gap-1.5 px-4 py-2 border border-app-border hover:bg-app-bg text-app-text-secondary text-sm font-semibold rounded-xl transition-all"
              >
                <ChevronLeft className="h-4 w-4" /> Anterior
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-app-border hover:bg-app-bg text-app-text-secondary text-sm font-semibold rounded-xl transition-all">
              Cancelar
            </button>
            {profileMode || editingEmployee ? (
              <button
                type="submit"
                className={`px-5 py-2 text-white text-sm font-semibold rounded-xl shadow-xs transition-all ${
                  editingEmployee ? 'bg-amber-600 hover:bg-amber-700' : 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400'
                }`}
              >
                {editingEmployee ? 'Guardar Cambios' : 'Registrar'}
              </button>
            ) : currentStep < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((s) => s + 1)}
                disabled={!canProceed()}
                className="flex items-center gap-1.5 px-5 py-2 text-white text-sm font-semibold rounded-xl shadow-xs bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-5 py-2 text-white text-sm font-semibold rounded-xl shadow-xs bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 transition-all"
              >
                Registrar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
