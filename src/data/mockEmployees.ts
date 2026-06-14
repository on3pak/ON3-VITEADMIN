import { Employee, EmployeeCategory, EmployeeStatus, WorkDay, Shift, ContractType, City, ClothingSizes } from '../types';

export const INITIAL_CITIES: City[] = [
  { id: 'ci_000001', name: 'Alcalá de Henares' },
  { id: 'ci_000002', name: 'Guadalajara' },
];

export const INITIAL_EMPLOYEE_CATEGORIES: EmployeeCategory[] = [
  { id: 'ec_000001', name: 'Peón Limpieza' },
  { id: 'ec_000002', name: 'Peón Recogida' },
  { id: 'ec_000003', name: 'Oficial' },
  { id: 'ec_000004', name: 'Oficial 2ª' },
  { id: 'ec_000005', name: 'Mantenimiento' },
  { id: 'ec_000006', name: 'Mecánico' },
  { id: 'ec_000007', name: 'Encargado' },
  { id: 'ec_000008', name: 'Encargado General' },
  { id: 'ec_000009', name: 'Jefe de Servicio' },
  { id: 'ec_000010', name: 'Administrativo' },
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
  { id: 's_4', name: 'Mañana esp' },
  { id: 's_2', name: 'Tarde' },
  { id: 's_3', name: 'Noche' },
];

export const INITIAL_CONTRACT_TYPES: ContractType[] = [
  { id: 'ct_1', name: 'Indefinido' },
  { id: 'ct_2', name: 'Temporal' },
  { id: 'ct_3', name: 'Obra' },
];

const DEFAULT_CLOTHING_SIZES: ClothingSizes = {
  summer_shirt: 'L',
  winter_shirt: 'L',
  summer_pants: 'L',
  winter_pants: 'L',
  summer_jacket: 'L',
  winter_jacket: 'L',
  winter_coat: 'L',
  cap: 'ESTANDAR',
  summer_shoe: 42,
  winter_shoe: 43,
};

const BASE: Omit<Employee, 'id' | 'name' | 'last_name1' | 'last_name2' | 'category_id' | 'shift_id' | 'work_day_id' | 'email' | 'phone' | 'personal_email'> = {
  city_id: 'ci_000001',
  work_center_id: 'wc_000001',
  status_id: 'es_1',
  active: true,
  start_time: '06:00',
  end_time: '13:00',
  vacation_month: null,

  vacation_days: 22,
  own_days: 2,
  accumulated_days: 5,
  excess_days: 0,
  created_at: '2025-01-01T08:00:00Z',
  updated_at: '2025-01-01T08:00:00Z',
  phone_fixed: '',
  iban: 'ES7620770024003102570001',
  lockers: ['001'],
  clothing_sizes: DEFAULT_CLOTHING_SIZES,
  medical_check: true,
  works_holidays: false,
  contract_type: 'ct_1',
  contract_start_date: '2025-01-01',
  contract_end_date: null,
  irpf: 15,
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
    last_name2: extra.last_name2 || LAST_NAMES[(idNum + 31) % LAST_NAMES.length],
  };
}

const employees: Employee[] = [];
let seq = 0;

// ---------- 30 employees in Nave (wc_1) ----------

// 20 MORNING (s_1)
const MORNING = [
  { i: 0, cat: 'ec_000001', wd: 'wd_1', t: '06:00', e: '13:00' },
  { i: 1, cat: 'ec_000001', wd: 'wd_1', t: '06:00', e: '13:00' },
  { i: 2, cat: 'ec_000001', wd: 'wd_1', t: '06:00', e: '13:00' },
  { i: 3, cat: 'ec_000001', wd: 'wd_1', t: '06:00', e: '13:00' },
  { i: 4, cat: 'ec_000001', wd: 'wd_1', t: '06:00', e: '13:00' },
  { i: 5, cat: 'ec_000002', wd: 'wd_1', t: '06:00', e: '13:00' },
  { i: 6, cat: 'ec_000002', wd: 'wd_1', t: '06:00', e: '13:00' },
  { i: 7, cat: 'ec_000002', wd: 'wd_1', t: '06:00', e: '13:00' },
  { i: 8, cat: 'ec_000002', wd: 'wd_1', t: '06:00', e: '13:00' },
  { i: 9, cat: 'ec_000002', wd: 'wd_1', t: '06:00', e: '13:00' },
  { i: 10, cat: 'ec_000003', wd: 'wd_1', t: '06:00', e: '13:00' },
  { i: 11, cat: 'ec_000003', wd: 'wd_1', t: '06:00', e: '13:00' },
  { i: 12, cat: 'ec_000003', wd: 'wd_1', t: '06:00', e: '13:00' },
  { i: 13, cat: 'ec_000003', wd: 'wd_1', t: '06:00', e: '13:00' },
  { i: 14, cat: 'ec_000003', wd: 'wd_1', t: '06:00', e: '13:00' },
  { i: 15, cat: 'ec_000004', wd: 'wd_1', t: '06:00', e: '13:00' },
  { i: 16, cat: 'ec_000004', wd: 'wd_1', t: '06:00', e: '13:00' },
  { i: 17, cat: 'ec_000004', wd: 'wd_1', t: '06:00', e: '13:00' },
  { i: 18, cat: 'ec_000004', wd: 'wd_3', t: '07:00', e: '15:00' },
  { i: 19, cat: 'ec_000004', wd: 'wd_4', t: '07:00', e: '15:00' },
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
  { cat: 'ec_000001', wd: 'wd_2' },
  { cat: 'ec_000001', wd: 'wd_1' },
  { cat: 'ec_000002', wd: 'wd_2' },
  { cat: 'ec_000003', wd: 'wd_2' },
  { cat: 'ec_000004', wd: 'wd_1' },
];

for (const a of AFTERNOON) {
  const nm = seq % 2 === 0 ? MALE_NAMES[seq % MALE_NAMES.length] : FEMALE_NAMES[seq % FEMALE_NAMES.length];
  const ln = LAST_NAMES[(seq + 17) % LAST_NAMES.length];
  seq++;
  employees.push(employee(seq, nm, ln, a.cat, 's_2', a.wd, {
    start_time: '14:00', end_time: '21:00',
  }));
}

// 5 NIGHT (s_3)
const NIGHT = [
  { cat: 'ec_000001', wd: 'wd_1' },
  { cat: 'ec_000001', wd: 'wd_1' },
  { cat: 'ec_000002', wd: 'wd_1' },
  { cat: 'ec_000003', wd: 'wd_3' },
  { cat: 'ec_000004', wd: 'wd_1' },
];

for (const n of NIGHT) {
  const nm = seq % 2 === 0 ? MALE_NAMES[(seq + 3) % MALE_NAMES.length] : FEMALE_NAMES[(seq + 5) % FEMALE_NAMES.length];
  const ln = LAST_NAMES[(seq + 31) % LAST_NAMES.length];
  const ln2 = seq % 3 === 0 ? LAST_NAMES[(seq + 11) % LAST_NAMES.length] : '';
  seq++;
  employees.push(employee(seq, nm, ln, n.cat, 's_3', n.wd, {
    start_time: '22:00', end_time: '05:00', last_name2: ln2,
  }));
}

// ---------- OTHER WORK CENTERS ----------

interface OtherWc { wc: string; city: string; cat: string; afternoonCat?: string; evening?: boolean }

const OTHER: OtherWc[] = [
  { wc: 'wc_000002',  city: 'ci_000001', cat: 'ec_000007',  afternoonCat: 'pm_2' },
  { wc: 'wc_000003',  city: 'ci_000001', cat: 'ec_000001',  afternoonCat: 'ec_000003' },
  { wc: 'wc_000004',  city: 'ci_000001', cat: 'ec_000002',  afternoonCat: 'ec_000004' },
  { wc: 'wc_000005',  city: 'ci_000001', cat: 'ec_000003',  afternoonCat: 'ec_000007' },
  { wc: 'wc_000006',  city: 'ci_000001', cat: 'ec_000005',  afternoonCat: 'ec_000006' },
  { wc: 'wc_000007',  city: 'ci_000001', cat: 'ec_000006',  afternoonCat: 'ec_000005' },
  { wc: 'wc_000008',  city: 'ci_000001', cat: 'ec_000008',  afternoonCat: 'ec_000009' },
  { wc: 'wc_000009',  city: 'ci_000001', cat: 'ec_000010', afternoonCat: 'ec_000001' },
  { wc: 'wc_000011', city: 'ci_000002', cat: 'ec_000001',  afternoonCat: 'ec_000003' },
  { wc: 'wc_000012', city: 'ci_000002', cat: 'ec_000002',  afternoonCat: 'ec_000004' },
  { wc: 'wc_000013', city: 'ci_000002', cat: 'ec_000003',  afternoonCat: 'ec_000007' },
  { wc: 'wc_000014', city: 'ci_000002', cat: 'ec_000004',  afternoonCat: 'ec_000001' },
  { wc: 'wc_000015', city: 'ci_000002', cat: 'ec_000009',  afternoonCat: 'ec_000010' },
  { wc: 'wc_000016', city: 'ci_000002', cat: 'ec_000010', afternoonCat: 'ec_000001' },
  { wc: 'wc_000018', city: 'ci_000002', cat: 'ec_000001',  afternoonCat: 'ec_000003' },
  { wc: 'wc_000019', city: 'ci_000002', cat: 'ec_000005',  afternoonCat: 'ec_000006' },
  { wc: 'wc_000021', city: 'ci_000002', cat: 'ec_000010', afternoonCat: 'ec_000001' },
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
      employees.push(employee(seq, nm2, ln2, j === 0 ? 'ec_000001' : 'ec_000003', 's_2', 'wd_1', {
        work_center_id: o.wc, city_id: o.city,
        start_time: '14:00', end_time: '21:00',
      }));
    }
  } else if (o.afternoonCat) {
    seq++;
    const nm2 = MALE_NAMES[(seq + 13) % MALE_NAMES.length];
    const ln2 = LAST_NAMES[(seq + 53) % LAST_NAMES.length];
    employees.push(employee(seq, nm2, ln2, o.afternoonCat, 's_2', 'wd_1', {
      work_center_id: o.wc, city_id: o.city,
      start_time: '14:00', end_time: '21:00',
    }));
  }
}

// Override test account employees to match INITIAL_USERS names
([
  { id: '000001', name: 'Miguel Ángel', last_name1: 'Torres', last_name2: 'López', email: 'm.torres1@on3.com', phone: '612300001' },
  { id: '000002', name: 'Alejandro', last_name1: 'Mendoza', last_name2: 'García', email: 'a.mendoza2@on3.com', phone: '612300002' },
  { id: '000003', name: 'Beatriz', last_name1: 'Salazar', last_name2: 'Ruiz', email: 'b.salazar3@on3.com', phone: '612300003' },
  { id: '000004', name: 'Carlos', last_name1: 'Fuentes', last_name2: 'Martínez', email: 'c.fuentes4@on3.com', phone: '612300004' },
  { id: '000005', name: 'Diana', last_name1: 'Reyes', last_name2: 'Morales', email: 'd.reyes5@on3.com', phone: '612300005' },
  { id: '000006', name: 'Eduardo', last_name1: 'Gómez', last_name2: 'Fernández', email: 'e.gomez6@on3.com', phone: '612300006' },
  { id: '000007', name: 'Gabriela', last_name1: 'Vaca', last_name2: 'Rodríguez', email: 'g.vaca7@on3.com', phone: '612300007' },
  { id: '000008', name: 'Hugo', last_name1: 'Pérez', last_name2: 'López', email: 'h.perez8@on3.com', phone: '612300008' },
]).forEach((o) => {
  const emp = employees.find((e) => e.id === o.id);
  if (emp) Object.assign(emp, o);
});

export const INITIAL_EMPLOYEES: Employee[] = employees;
