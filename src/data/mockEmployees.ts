import { Employee, EmployeeCategory, EmployeeStatus, WorkDay, Shift, ContractType, City } from '../types';

export const INITIAL_CITIES: City[] = [
  { id: 'city_1', name: 'Alcalá de Henares' },
  { id: 'city_2', name: 'Guadalajara' },
];

export const INITIAL_EMPLOYEE_CATEGORIES: EmployeeCategory[] = [
  { id: 'ec_1', name: 'Peón Limpieza' },
  { id: 'ec_2', name: 'Peón Recogida' },
  { id: 'ec_3', name: 'Oficial' },
  { id: 'ec_4', name: 'Oficial 2ª' },
  { id: 'ec_5', name: 'Mantenimiento' },
  { id: 'ec_6', name: 'Mecánico' },
  { id: 'ec_7', name: 'Encargado' },
  { id: 'ec_8', name: 'Encargado General' },
  { id: 'ec_9', name: 'Jefe de Servicio' },
  { id: 'ec_10', name: 'Administrativo' },
];

export const INITIAL_EMPLOYEE_STATUSES: EmployeeStatus[] = [
  { id: 'es_1', name: 'Trabajando' },
  { id: 'es_2', name: 'Descanso' },
  { id: 'es_3', name: 'Baja' },
  { id: 'es_4', name: 'Días Propios' },
  { id: 'es_5', name: 'Días Acumulados' },
  { id: 'es_6', name: 'Vacaciones' },
];

export const INITIAL_WORK_DAYS: WorkDay[] = [
  { id: 'wd_1', name: 'Lunes a Viernes' },
  { id: 'wd_2', name: 'Fin de Semana' },
  { id: 'wd_3', name: 'Rotativo 1' },
  { id: 'wd_4', name: 'Rotativo 2' },
];

export const INITIAL_SHIFTS: Shift[] = [
  { id: 's_1', name: 'Mañana' },
  { id: 's_2', name: 'Tarde' },
  { id: 's_3', name: 'Noche' },
];

export const INITIAL_CONTRACT_TYPES: ContractType[] = [
  { id: 'ct_1', name: 'Indefinido' },
  { id: 'ct_2', name: 'Temporal' },
  { id: 'ct_3', name: 'Obra' },
];

const BASE: Omit<Employee, 'id' | 'name' | 'last_name1' | 'last_name2' | 'category_id' | 'shift_id' | 'work_day_id' | 'email' | 'phone' | 'personal_email'> = {
  user_id: null,
  city_id: 'city_1',
  work_center_id: 'wc_1',
  status_id: 'es_1',
  active: true,
  start_time: '08:00',
  end_time: '16:00',
  vacation_month: null,
  vacation_year: null,
  vacation_days: 22,
  own_days: 2,
  accumulated_days: 5,
  excess_days: 0,
  created_at: '2025-01-01T08:00:00Z',
  updated_at: '2025-01-01T08:00:00Z',
  phone_fixed: '',
  iban: 'ES7620770024003102570001',
  locker: '',
  medical_check: true,
  works_holidays: false,
  contract_type: 'ct_1',
  contract_start_date: '2025-01-01',
  contract_end_date: null,
  irpf: 15,
  last_name2: '',
};

const MALE_NAMES = [
  'Antonio', 'Manuel', 'José', 'David', 'Francisco', 'Javier',
  'Daniel', 'Carlos', 'Jesús', 'Rafael', 'Miguel Ángel', 'Pedro',
  'Juan', 'Alejandro', 'Sergio', 'Ramón', 'Félix', 'Víctor',
  'Raúl', 'Alberto', 'Jorge', 'Rubén', 'Álvaro', 'Andrés',
];
const FEMALE_NAMES = [
  'María', 'Ana', 'Laura', 'Carmen', 'Isabel', 'Patricia',
  'Sandra', 'Elena', 'Rosa', 'Natalia', 'Marta', 'Lucía',
];
const LAST_NAMES = [
  'García', 'Rodríguez', 'Martínez', 'López', 'Sánchez', 'Pérez',
  'González', 'Fernández', 'Moreno', 'Jiménez', 'Ruiz', 'Díaz',
  'Torres', 'Muñoz', 'Romero', 'Navarro', 'Gutiérrez', 'Gil',
  'Vázquez', 'Morales', 'Ortega', 'Delgado', 'Castro', 'Santos',
];

function employee(
  idNum: number,
  name: string,
  last1: string,
  cat: string,
  shift: string,
  wd: string,
  extra: Partial<Omit<Employee, 'id'>> = {},
): Employee {
  const id = String(idNum).padStart(6, '0');
  const slug = (s: string) => s.toLowerCase().replace(/[^a-z]/g, '');
  return {
    ...BASE,
    ...extra,
    id,
    name,
    last_name1: last1,
    category_id: cat,
    shift_id: shift,
    work_day_id: wd,
    email: `${slug(name).slice(0, 1)}.${slug(last1)}@on3.com`,
    phone: `6123${String(idNum).padStart(4, '0')}`,
    personal_email: `${slug(name)}.${slug(last1)}@gmail.com`,
  };
}

const employees: Employee[] = [];
let seq = 0;

// ---------- 30 employees in Nave (wc_1) ----------

// 20 MORNING (s_1)
const MORNING = [
  { i: 0, cat: 'ec_1', wd: 'wd_1', t: '08:00', e: '16:00' },
  { i: 1, cat: 'ec_1', wd: 'wd_1', t: '08:00', e: '16:00' },
  { i: 2, cat: 'ec_1', wd: 'wd_1', t: '08:00', e: '16:00' },
  { i: 3, cat: 'ec_1', wd: 'wd_1', t: '08:00', e: '16:00' },
  { i: 4, cat: 'ec_1', wd: 'wd_1', t: '08:00', e: '16:00' },
  { i: 5, cat: 'ec_2', wd: 'wd_1', t: '08:00', e: '16:00' },
  { i: 6, cat: 'ec_2', wd: 'wd_1', t: '08:00', e: '16:00' },
  { i: 7, cat: 'ec_2', wd: 'wd_1', t: '08:00', e: '16:00' },
  { i: 8, cat: 'ec_2', wd: 'wd_1', t: '08:00', e: '16:00' },
  { i: 9, cat: 'ec_2', wd: 'wd_1', t: '08:00', e: '16:00' },
  { i: 10, cat: 'ec_3', wd: 'wd_1', t: '08:00', e: '16:00' },
  { i: 11, cat: 'ec_3', wd: 'wd_1', t: '08:00', e: '16:00' },
  { i: 12, cat: 'ec_3', wd: 'wd_1', t: '08:00', e: '16:00' },
  { i: 13, cat: 'ec_3', wd: 'wd_1', t: '08:00', e: '16:00' },
  { i: 14, cat: 'ec_3', wd: 'wd_1', t: '08:00', e: '16:00' },
  { i: 15, cat: 'ec_4', wd: 'wd_1', t: '08:00', e: '16:00' },
  { i: 16, cat: 'ec_4', wd: 'wd_1', t: '08:00', e: '16:00' },
  { i: 17, cat: 'ec_4', wd: 'wd_1', t: '08:00', e: '16:00' },
  { i: 18, cat: 'ec_4', wd: 'wd_3', t: '07:00', e: '15:00' },
  { i: 19, cat: 'ec_4', wd: 'wd_4', t: '07:00', e: '15:00' },
];

for (const m of MORNING) {
  const nm = seq < 12 ? MALE_NAMES[seq] : FEMALE_NAMES[seq - 12];
  const ln = LAST_NAMES[seq * 3 % LAST_NAMES.length];
  const ln2 = seq % 4 === 0 ? LAST_NAMES[(seq + 7) % LAST_NAMES.length] : '';
  seq++;
  employees.push(employee(seq, nm, ln, m.cat, 's_1', m.wd, {
    start_time: m.t, end_time: m.e, last_name2: ln2,
  }));
}

// 5 AFTERNOON (s_2)
const AFTERNOON = [
  { cat: 'ec_1', wd: 'wd_2' },
  { cat: 'ec_1', wd: 'wd_1' },
  { cat: 'ec_2', wd: 'wd_2' },
  { cat: 'ec_3', wd: 'wd_2' },
  { cat: 'ec_4', wd: 'wd_1' },
];

for (const a of AFTERNOON) {
  const nm = seq % 2 === 0 ? MALE_NAMES[seq % MALE_NAMES.length] : FEMALE_NAMES[seq % FEMALE_NAMES.length];
  const ln = LAST_NAMES[(seq + 17) % LAST_NAMES.length];
  seq++;
  employees.push(employee(seq, nm, ln, a.cat, 's_2', a.wd, {
    start_time: '14:00', end_time: '22:00',
  }));
}

// 5 NIGHT (s_3)
const NIGHT = [
  { cat: 'ec_1', wd: 'wd_1' },
  { cat: 'ec_1', wd: 'wd_1' },
  { cat: 'ec_2', wd: 'wd_1' },
  { cat: 'ec_3', wd: 'wd_3' },
  { cat: 'ec_4', wd: 'wd_1' },
];

for (const n of NIGHT) {
  const nm = seq % 2 === 0 ? MALE_NAMES[(seq + 3) % MALE_NAMES.length] : FEMALE_NAMES[(seq + 5) % FEMALE_NAMES.length];
  const ln = LAST_NAMES[(seq + 31) % LAST_NAMES.length];
  const ln2 = seq % 3 === 0 ? LAST_NAMES[(seq + 11) % LAST_NAMES.length] : '';
  seq++;
  employees.push(employee(seq, nm, ln, n.cat, 's_3', n.wd, {
    start_time: '22:00', end_time: '06:00', last_name2: ln2,
  }));
}

// ---------- OTHER WORK CENTERS ----------

interface OtherWc { wc: string; city: string; cat: string; afternoonCat?: string; evening?: boolean }

const OTHER: OtherWc[] = [
  { wc: 'wc_2',  city: 'city_1', cat: 'ec_7',  afternoonCat: 'pm_2' },
  { wc: 'wc_3',  city: 'city_1', cat: 'ec_1',  afternoonCat: 'ec_3' },
  { wc: 'wc_4',  city: 'city_1', cat: 'ec_2',  afternoonCat: 'ec_4' },
  { wc: 'wc_5',  city: 'city_1', cat: 'ec_3',  afternoonCat: 'ec_7' },
  { wc: 'wc_6',  city: 'city_1', cat: 'ec_5',  afternoonCat: 'ec_6' },
  { wc: 'wc_7',  city: 'city_1', cat: 'ec_6',  afternoonCat: 'ec_5' },
  { wc: 'wc_8',  city: 'city_1', cat: 'ec_8',  afternoonCat: 'ec_9' },
  { wc: 'wc_9',  city: 'city_1', cat: 'ec_10', afternoonCat: 'ec_1' },
  { wc: 'wc_11', city: 'city_2', cat: 'ec_1',  afternoonCat: 'ec_3' },
  { wc: 'wc_12', city: 'city_2', cat: 'ec_2',  afternoonCat: 'ec_4' },
  { wc: 'wc_13', city: 'city_2', cat: 'ec_3',  afternoonCat: 'ec_7' },
  { wc: 'wc_14', city: 'city_2', cat: 'ec_4',  afternoonCat: 'ec_1' },
  { wc: 'wc_15', city: 'city_2', cat: 'ec_9',  afternoonCat: 'ec_10' },
  { wc: 'wc_16', city: 'city_2', cat: 'ec_10', afternoonCat: 'ec_1' },
  { wc: 'wc_18', city: 'city_2', cat: 'ec_1',  afternoonCat: 'ec_3' },
  { wc: 'wc_19', city: 'city_2', cat: 'ec_5',  afternoonCat: 'ec_6' },
  { wc: 'wc_21', city: 'city_2', cat: 'ec_10', afternoonCat: 'ec_1' },
];

for (const o of OTHER) {
  seq++;
  const nm = seq % 2 === 0 ? MALE_NAMES[(seq + 7) % MALE_NAMES.length] : FEMALE_NAMES[(seq + 3) % FEMALE_NAMES.length];
  const ln = LAST_NAMES[(seq + 41) % LAST_NAMES.length];
  employees.push(employee(seq, nm, ln, o.cat, 's_1', 'wd_1', {
    work_center_id: o.wc, city_id: o.city,
  }));

  // afternoon employees per work center (regular weekday shift)
  if (o.afternoonCat === 'pm_2') {
    // Puerta Madrid: 2 afternoon employees
    for (let j = 0; j < 2; j++) {
      seq++;
      const nm2 = MALE_NAMES[(seq + 13) % MALE_NAMES.length];
      const ln2 = LAST_NAMES[(seq + 53) % LAST_NAMES.length];
      employees.push(employee(seq, nm2, ln2, j === 0 ? 'ec_1' : 'ec_3', 's_2', 'wd_1', {
        work_center_id: o.wc, city_id: o.city,
        start_time: '14:00', end_time: '22:00',
      }));
    }
  } else if (o.afternoonCat) {
    seq++;
    const nm2 = MALE_NAMES[(seq + 13) % MALE_NAMES.length];
    const ln2 = LAST_NAMES[(seq + 53) % LAST_NAMES.length];
    employees.push(employee(seq, nm2, ln2, o.afternoonCat, 's_2', 'wd_1', {
      work_center_id: o.wc, city_id: o.city,
      start_time: '14:00', end_time: '22:00',
    }));
  }
}

// Override test account employees to match INITIAL_USERS names
([
  { id: '000001', name: 'Miguel Ángel', last_name1: 'Torres', email: 'm.torres@on3.com', phone: '612300001' },
  { id: '000002', name: 'Alejandro', last_name1: 'Mendoza', email: 'a.mendoza@on3.com', phone: '612300002' },
  { id: '000003', name: 'Beatriz', last_name1: 'Salazar', email: 'b.salazar@on3.com', phone: '612300003' },
  { id: '000004', name: 'Carlos', last_name1: 'Fuentes', email: 'c.fuentes@on3.com', phone: '612300004' },
]).forEach((o) => {
  const emp = employees.find((e) => e.id === o.id);
  if (emp) Object.assign(emp, o);
});

export const INITIAL_EMPLOYEES: Employee[] = employees;
