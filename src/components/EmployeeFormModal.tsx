import React, { useState, useEffect } from 'react';
import { Employee } from '../types';
import { INITIAL_CITIES, INITIAL_WORK_CENTERS, INITIAL_EMPLOYEE_CATEGORIES, INITIAL_EMPLOYEE_STATUSES, INITIAL_WORK_DAYS, INITIAL_SHIFTS } from '../data/mockEmployees';
import { X, ShieldAlert, UserPlus, Save } from 'lucide-react';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => boolean;
  editingEmployee?: Employee;
}

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({ isOpen, onClose, onSubmit, editingEmployee }) => {
  const [name, setName] = useState('');
  const [lastName1, setLastName1] = useState('');
  const [lastName2, setLastName2] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category_id, setCategory_id] = useState('ec-1');
  const [status_id, setStatus_id] = useState('es-1');
  const [work_center_id, setWork_center_id] = useState('wc-1');
  const [work_day, setWork_day] = useState('wd-1');
  const [shift, setShift] = useState('s-1');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (editingEmployee) {
      setName(editingEmployee.name);
      setLastName1(editingEmployee.lastName1);
      setLastName2(editingEmployee.lastName2 || '');
      setEmail(editingEmployee.email);
      setPhone(editingEmployee.phone);
      setCategory_id(editingEmployee.category_id);
      setStatus_id(editingEmployee.status_id);
      setWork_center_id(editingEmployee.work_center_id);
      setWork_day(editingEmployee.work_day);
      setShift(editingEmployee.shift);
    } else {
      setName('');
      setLastName1('');
      setLastName2('');
      setEmail('');
      setPhone('');
      setCategory_id('ec-1');
      setStatus_id('es-1');
      setWork_center_id('wc-1');
      setWork_day('wd-1');
      setShift('s-1');
    }
    setFormError(null);
  }, [editingEmployee, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim() || !lastName1.trim() || !email.trim()) {
      setFormError('Todos los campos con (*) son obligatorios.');
      return;
    }

    const success = onSubmit({
      user_id: null,
      city_id: null,
      name: name.trim(),
      lastName1: lastName1.trim(),
      lastName2: lastName2.trim(),
      email: email.trim(),
      phone: phone.trim(),
      category_id,
      status_id,
      work_center_id,
      active: true,
      shift,
      schedule: '',
      start_time: '',
      end_time: '',
      employee_category: INITIAL_EMPLOYEE_CATEGORIES.find((c) => c.id === category_id)?.name ?? '',
      own_days: 0,
      accumulated_days: 0,
      vacation_days: 22,
      personal_email: '',
      phone_fixed: '',
      work_day,
      work_center: INITIAL_WORK_CENTERS.find((w) => w.id === work_center_id)?.name ?? '',
      iban: '',
      locker: '',
      medical_check: true,
      works_holidays: true,
      contract_type: '',
      contract_start_date: '',
      contract_end_date: null,
      irpf: 0,
      excess_days: 0,
    });

    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden animate-scale-in">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${editingEmployee ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}>
              {editingEmployee ? <Save className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="font-bold text-slate-800">
                {editingEmployee ? `Editar Empleado: ${editingEmployee.name}` : 'Registrar Nuevo Empleado'}
              </h3>
              <p className="text-xs text-slate-400">Completa los datos del empleado</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-lg">
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
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Nombre *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 text-slate-800" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Apellido 1 *</label>
              <input type="text" value={lastName1} onChange={(e) => setLastName1(e.target.value)} placeholder="Primer apellido" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 text-slate-800" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Apellido 2</label>
              <input type="text" value={lastName2} onChange={(e) => setLastName2(e.target.value)} placeholder="Segundo apellido" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 text-slate-800" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Email *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@empresa.com" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 text-slate-800" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Teléfono</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="6XXXXXXXX" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 text-slate-800" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Categoría</label>
              <select value={category_id} onChange={(e) => setCategory_id(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-sm focus:outline-hidden focus:border-indigo-500 text-slate-800">
                {INITIAL_EMPLOYEE_CATEGORIES.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Estado</label>
              <select value={status_id} onChange={(e) => setStatus_id(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-sm focus:outline-hidden focus:border-indigo-500 text-slate-800">
                {INITIAL_EMPLOYEE_STATUSES.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Centro de Trabajo</label>
              <select value={work_center_id} onChange={(e) => setWork_center_id(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-sm focus:outline-hidden focus:border-indigo-500 text-slate-800">
                {INITIAL_WORK_CENTERS.map((w) => (<option key={w.id} value={w.id}>{w.name}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Jornada</label>
              <select value={work_day} onChange={(e) => setWork_day(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-sm focus:outline-hidden focus:border-indigo-500 text-slate-800">
                {INITIAL_WORK_DAYS.map((w) => (<option key={w.id} value={w.id}>{w.name}</option>))}
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 text-sm font-semibold rounded-xl">Cancelar</button>
            <button type="submit" className={`px-5 py-2 text-white text-sm font-semibold rounded-xl shadow-xs ${editingEmployee ? 'bg-amber-600 hover:bg-amber-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
              {editingEmployee ? 'Guardar' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};