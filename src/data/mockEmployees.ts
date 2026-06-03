import { Employee, EmployeeCategory, EmployeeStatus, WorkDay, Shift, ContractType, City, VacationRequest } from '../types';

export const INITIAL_CITIES: City[] = [
  { id: 'city-1', name: 'Alcalá de Henares' },
  { id: 'city-2', name: 'Guadalajara' },
];

export const INITIAL_EMPLOYEE_CATEGORIES: EmployeeCategory[] = [
  { id: 'ec-1', name: 'Peón Limpieza' },
  { id: 'ec-2', name: 'Peón Recogida' },
  { id: 'ec-3', name: 'Oficial' },
  { id: 'ec-4', name: 'Oficial 2ª' },
  { id: 'ec-5', name: 'Mantenimiento' },
  { id: 'ec-6', name: 'Mecánico' },
  { id: 'ec-7', name: 'Encargado' },
  { id: 'ec-8', name: 'Encargado General' },
  { id: 'ec-9', name: 'Jefe de Servicio' },
  { id: 'ec-10', name: 'Administrativo' },
];

export const INITIAL_EMPLOYEE_STATUSES: EmployeeStatus[] = [
  { id: 'es-1', name: 'Trabajando' },
  { id: 'es-2', name: 'Descanso' },
  { id: 'es-3', name: 'Baja' },
  { id: 'es-4', name: 'Días Propios' },
  { id: 'es-5', name: 'Días Acumulados' },
  { id: 'es-6', name: 'Vacaciones' },
];

export const INITIAL_WORK_DAYS: WorkDay[] = [
  { id: 'wd-1', name: 'Lunes a Viernes' },
  { id: 'wd-2', name: 'Fin de Semana' },
  { id: 'wd-3', name: 'Rotativo 1' },
  { id: 'wd-4', name: 'Rotativo 2' },
];

export const INITIAL_SHIFTS: Shift[] = [
  { id: 's-1', name: 'Mañana' },
  { id: 's-2', name: 'Tarde' },
  { id: 's-3', name: 'Noche' },
];

export const INITIAL_CONTRACT_TYPES: ContractType[] = [
  { id: 'ct-1', name: 'Indefinido' },
  { id: 'ct-2', name: 'Temporal' },
  { id: 'ct-3', name: 'Obra' },
];

const VACATION_MONTHS: Array<'julio' | 'agosto' | 'septiembre'> = ['julio', 'agosto', 'septiembre'];

const EMPLOYEES_SEED: Omit<Employee, 'id'>[] = [
  {
    user_id: 'usr_a1b2c3d4', city_id: 'city-1', name: 'Miguel Ángel', last_name1: 'Torres', last_name2: 'García',
    email: 'm.torres@on3.com', phone: '612345678', category_id: 'ec-1', status_id: 'es-1', work_center_id: 'wc-1',
    active: true, shift: 's-1', schedule: '08:00-16:00', start_time: '08:00', end_time: '16:00',
    vacation_month: 'julio', vacation_year: 2024, vacation_days: 22, own_days: 2, accumulated_days: 5, excess_days: 0,
    created_at: '2024-01-15T08:00:00Z', updated_at: '2024-01-15T08:00:00Z',
    personal_email: 'm.torres@gmail.com', phone_fixed: '918765432', work_day: 'wd-1',
    iban: 'ES7620770024003102571234', locker: 'L-001', medical_check: true, works_holidays: true,
    contract_type: 'ct-1', contract_start_date: '2023-06-01', contract_end_date: null, irpf: 15
  },
  {
    user_id: 'usr_b2c3d4e5', city_id: 'city-1', name: 'Alejandro', last_name1: 'Mendoza', last_name2: '',
    email: 'a.mendoza@on3.com', phone: '612345679', category_id: 'ec-2', status_id: 'es-1', work_center_id: 'wc-2',
    active: true, shift: 's-2', schedule: '14:00-22:00', start_time: '14:00', end_time: '22:00',
    vacation_month: 'agosto', vacation_year: 2024, vacation_days: 22, own_days: 2, accumulated_days: 5, excess_days: 0,
    created_at: '2024-02-10T09:00:00Z', updated_at: '2024-02-10T09:00:00Z',
    personal_email: 'maria.rodriguez@gmail.com', phone_fixed: '918765433', work_day: 'wd-1',
    iban: 'ES7620770024003102571235', locker: 'L-002', medical_check: true, works_holidays: false,
    contract_type: 'ct-1', contract_start_date: '2023-09-15', contract_end_date: null, irpf: 12
  },
  {
    user_id: 'usr_c3d4e5f6', city_id: 'city-1', name: 'Beatriz', last_name1: 'Salazar', last_name2: '',
    email: 'b.salazar@on3.com', phone: '612345680', category_id: 'ec-3', status_id: 'es-2', work_center_id: 'wc-3',
    active: true, shift: 's-1', schedule: '08:00-16:00', start_time: '08:00', end_time: '16:00',
    vacation_month: 'septiembre', vacation_year: 2024, vacation_days: 22, own_days: 2, accumulated_days: 5, excess_days: 0,
    created_at: '2024-03-05T10:00:00Z', updated_at: '2024-03-05T10:00:00Z',
    personal_email: 'carlos.martinez@gmail.com', phone_fixed: '918765434', work_day: 'wd-2',
    iban: 'ES7620770024003102571236', locker: 'L-003', medical_check: true, works_holidays: true,
    contract_type: 'ct-1', contract_start_date: '2022-01-10', contract_end_date: null, irpf: 18
  },
  {
    user_id: 'usr_d4e5f6g7', city_id: 'city-1', name: 'Carlos', last_name1: 'Fuentes', last_name2: '',
    email: 'c.fuentes@on3.com', phone: '612345681', category_id: 'ec-4', status_id: 'es-1', work_center_id: 'wc-4',
    active: true, shift: 's-3', schedule: '22:00-06:00', start_time: '22:00', end_time: '06:00',
    vacation_month: 'julio', vacation_year: 2024, vacation_days: 22, own_days: 2, accumulated_days: 5, excess_days: 0,
    created_at: '2024-01-20T11:00:00Z', updated_at: '2024-01-20T11:00:00Z',
    personal_email: 'ana.lopez@gmail.com', phone_fixed: '918765435', work_day: 'wd-3',
    iban: 'ES7620770024003102571237', locker: 'L-004', medical_check: true, works_holidays: true,
    contract_type: 'ct-2', contract_start_date: '2024-01-01', contract_end_date: '2025-01-01', irpf: 14
  },
  {
    user_id: null, city_id: 'city-2', name: 'Pedro', last_name1: 'Hernández', last_name2: 'Díaz',
    email: 'p.hernandez@on3.com', phone: '612345682', category_id: 'ec-5', status_id: 'es-3', work_center_id: 'wc-5',
    active: false, shift: 's-1', schedule: '08:00-16:00', start_time: '08:00', end_time: '16:00',
    vacation_month: 'agosto', vacation_year: 2024, vacation_days: 22, own_days: 2, accumulated_days: 5, excess_days: 0,
    created_at: '2023-11-08T08:00:00Z', updated_at: '2024-05-15T08:00:00Z',
    personal_email: 'pedro.hernandez@gmail.com', phone_fixed: '918765436', work_day: 'wd-1',
    iban: 'ES7620770024003102571238', locker: 'L-005', medical_check: false, works_holidays: false,
    contract_type: 'ct-1', contract_start_date: '2022-05-20', contract_end_date: null, irpf: 16
  },
  {
    user_id: null, city_id: 'city-1', name: 'Laura', last_name1: 'Jiménez', last_name2: 'Ruiz',
    email: 'l.jimenez@on3.com', phone: '612345683', category_id: 'ec-6', status_id: 'es-1', work_center_id: 'wc-7',
    active: true, shift: 's-2', schedule: '14:00-22:00', start_time: '14:00', end_time: '22:00',
    vacation_month: 'septiembre', vacation_year: 2024, vacation_days: 22, own_days: 2, accumulated_days: 5, excess_days: 0,
    created_at: '2023-08-12T09:00:00Z', updated_at: '2023-08-12T09:00:00Z',
    personal_email: 'laura.jimenez@gmail.com', phone_fixed: '918765437', work_day: 'wd-1',
    iban: 'ES7620770024003102571239', locker: 'L-006', medical_check: true, works_holidays: true,
    contract_type: 'ct-1', contract_start_date: '2023-03-01', contract_end_date: null, irpf: 17
  },
  {
    user_id: null, city_id: 'city-2', name: 'Miguel', last_name1: 'Torres', last_name2: 'Navarro',
    email: 'm.torres@on3.com', phone: '612345684', category_id: 'ec-7', status_id: 'es-4', work_center_id: 'wc-6',
    active: true, shift: 's-1', schedule: '08:00-16:00', start_time: '08:00', end_time: '16:00',
    vacation_month: 'julio', vacation_year: 2024, vacation_days: 22, own_days: 2, accumulated_days: 5, excess_days: 0,
    created_at: '2023-04-18T10:00:00Z', updated_at: '2024-02-20T10:00:00Z',
    personal_email: 'miguel.torres@gmail.com', phone_fixed: '918765438', work_day: 'wd-4',
    iban: 'ES7620770024003102571240', locker: 'L-007', medical_check: true, works_holidays: true,
    contract_type: 'ct-1', contract_start_date: '2021-08-01', contract_end_date: null, irpf: 20
  },
  {
    user_id: null, city_id: 'city-1', name: 'Carmen', last_name1: 'Morales', last_name2: 'Serrano',
    email: 'c.morales@on3.com', phone: '612345685', category_id: 'ec-8', status_id: 'es-1', work_center_id: 'wc-8',
    active: true, shift: 's-1', schedule: '09:00-17:00', start_time: '09:00', end_time: '17:00',
    vacation_month: 'agosto', vacation_year: 2024, vacation_days: 22, own_days: 2, accumulated_days: 5, excess_days: 0,
    created_at: '2022-06-25T08:00:00Z', updated_at: '2022-06-25T08:00:00Z',
    personal_email: 'carmen.morales@gmail.com', phone_fixed: '918765439', work_day: 'wd-1',
    iban: 'ES7620770024003102571241', locker: 'L-008', medical_check: true, works_holidays: true,
    contract_type: 'ct-1', contract_start_date: '2020-01-15', contract_end_date: null, irpf: 22
  },
  {
    user_id: null, city_id: 'city-2', name: 'Javier', last_name1: 'Ramos', last_name2: 'Castro',
    email: 'j.ramos@on3.com', phone: '612345686', category_id: 'ec-9', status_id: 'es-5', work_center_id: 'wc-1',
    active: true, shift: 's-2', schedule: '14:00-22:00', start_time: '14:00', end_time: '22:00',
    vacation_month: 'septiembre', vacation_year: 2024, vacation_days: 22, own_days: 2, accumulated_days: 5, excess_days: 0,
    created_at: '2023-09-30T09:00:00Z', updated_at: '2024-04-10T09:00:00Z',
    personal_email: 'javier.ramos@gmail.com', phone_fixed: '918765440', work_day: 'wd-2',
    iban: 'ES7620770024003102571242', locker: 'L-009', medical_check: true, works_holidays: false,
    contract_type: 'ct-1', contract_start_date: '2019-05-01', contract_end_date: null, irpf: 25
  },
  {
    user_id: null, city_id: 'city-1', name: 'Sofia', last_name1: 'Vega', last_name2: 'Ortega',
    email: 's.vega@on3.com', phone: '612345687', category_id: 'ec-10', status_id: 'es-1', work_center_id: 'wc-8',
    active: true, shift: 's-1', schedule: '09:00-17:00', start_time: '09:00', end_time: '17:00',
    vacation_month: 'julio', vacation_year: 2024, vacation_days: 22, own_days: 2, accumulated_days: 5, excess_days: 0,
    created_at: '2024-01-08T08:00:00Z', updated_at: '2024-01-08T08:00:00Z',
    personal_email: 'sofia.vega@gmail.com', phone_fixed: '918765441', work_day: 'wd-1',
    iban: 'ES7620770024003102571243', locker: 'L-010', medical_check: true, works_holidays: true,
    contract_type: 'ct-1', contract_start_date: '2023-11-01', contract_end_date: null, irpf: 15
  },
  {
    user_id: null, city_id: 'city-2', name: 'Antonio', last_name1: 'Molina', last_name2: 'Delgado',
    email: 'a.molina@on3.com', phone: '612345688', category_id: 'ec-1', status_id: 'es-6', work_center_id: 'wc-2',
    active: true, shift: 's-3', schedule: '22:00-06:00', start_time: '22:00', end_time: '06:00',
    vacation_month: 'agosto', vacation_year: 2024, vacation_days: 22, own_days: 2, accumulated_days: 5, excess_days: 0,
    created_at: '2024-02-22T10:00:00Z', updated_at: '2024-06-01T10:00:00Z',
    personal_email: 'antonio.molina@gmail.com', phone_fixed: '918765442', work_day: 'wd-3',
    iban: 'ES7620770024003102571244', locker: 'L-011', medical_check: true, works_holidays: true,
    contract_type: 'ct-3', contract_start_date: '2024-02-15', contract_end_date: '2024-12-31', irpf: 10
  },
  {
    user_id: null, city_id: 'city-1', name: 'Isabel', last_name1: 'Romero', last_name2: 'Aguilar',
    email: 'i.romero@on3.com', phone: '612345689', category_id: 'ec-2', status_id: 'es-1', work_center_id: 'wc-3',
    active: true, shift: 's-1', schedule: '08:00-16:00', start_time: '08:00', end_time: '16:00',
    vacation_month: 'septiembre', vacation_year: 2024, vacation_days: 22, own_days: 2, accumulated_days: 5, excess_days: 0,
    created_at: '2023-12-05T09:00:00Z', updated_at: '2023-12-05T09:00:00Z',
    personal_email: 'isabel.romero@gmail.com', phone_fixed: '918765443', work_day: 'wd-1',
    iban: 'ES7620770024003102571245', locker: 'L-012', medical_check: true, works_holidays: true,
    contract_type: 'ct-1', contract_start_date: '2023-06-01', contract_end_date: null, irpf: 13
  },
  {
    user_id: null, city_id: 'city-2', name: 'David', last_name1: 'Cortés', last_name2: 'Garrido',
    email: 'd.cortes@on3.com', phone: '612345690', category_id: 'ec-3', status_id: 'es-1', work_center_id: 'wc-4',
    active: true, shift: 's-2', schedule: '14:00-22:00', start_time: '14:00', end_time: '22:00',
    vacation_month: 'julio', vacation_year: 2024, vacation_days: 22, own_days: 2, accumulated_days: 5, excess_days: 0,
    created_at: '2024-03-18T08:00:00Z', updated_at: '2024-03-18T08:00:00Z',
    personal_email: 'david.cortes@gmail.com', phone_fixed: '918765444', work_day: 'wd-1',
    iban: 'ES7620770024003102571246', locker: 'L-013', medical_check: true, works_holidays: true,
    contract_type: 'ct-2', contract_start_date: '2024-03-01', contract_end_date: '2025-03-01', irpf: 14
  },
  {
    user_id: null, city_id: 'city-1', name: 'Elena', last_name1: 'Soto', last_name2: 'Pérez',
    email: 'e.soto@on3.com', phone: '612345691', category_id: 'ec-4', status_id: 'es-2', work_center_id: 'wc-5',
    active: true, shift: 's-1', schedule: '08:00-16:00', start_time: '08:00', end_time: '16:00',
    vacation_month: 'agosto', vacation_year: 2024, vacation_days: 22, own_days: 2, accumulated_days: 5, excess_days: 0,
    created_at: '2023-10-12T10:00:00Z', updated_at: '2024-05-20T10:00:00Z',
    personal_email: 'elena.soto@gmail.com', phone_fixed: '918765445', work_day: 'wd-2',
    iban: 'ES7620770024003102571247', locker: 'L-014', medical_check: true, works_holidays: false,
    contract_type: 'ct-1', contract_start_date: '2022-09-01', contract_end_date: null, irpf: 15
  },
  {
    user_id: null, city_id: 'city-2', name: 'Francisco', last_name1: 'Ruiz', last_name2: 'Guerrero',
    email: 'f.ruiz@on3.com', phone: '612345692', category_id: 'ec-5', status_id: 'es-1', work_center_id: 'wc-7',
    active: true, shift: 's-2', schedule: '14:00-22:00', start_time: '14:00', end_time: '22:00',
    vacation_month: 'septiembre', vacation_year: 2024, vacation_days: 22, own_days: 2, accumulated_days: 5, excess_days: 0,
    created_at: '2023-07-22T09:00:00Z', updated_at: '2023-07-22T09:00:00Z',
    personal_email: 'francisco.ruiz@gmail.com', phone_fixed: '918765446', work_day: 'wd-1',
    iban: 'ES7620770024003102571248', locker: 'L-015', medical_check: true, works_holidays: true,
    contract_type: 'ct-1', contract_start_date: '2022-02-15', contract_end_date: null, irpf: 17
  },
  {
    user_id: null, city_id: 'city-1', name: 'Patricia', last_name1: 'Flores', last_name2: 'Moreno',
    email: 'p.flores@on3.com', phone: '612345693', category_id: 'ec-6', status_id: 'es-1', work_center_id: 'wc-7',
    active: true, shift: 's-1', schedule: '08:00-16:00', start_time: '08:00', end_time: '16:00',
    vacation_month: 'julio', vacation_year: 2024, vacation_days: 22, own_days: 2, accumulated_days: 5, excess_days: 0,
    created_at: '2024-01-30T08:00:00Z', updated_at: '2024-01-30T08:00:00Z',
    personal_email: 'patricia.flores@gmail.com', phone_fixed: '918765447', work_day: 'wd-1',
    iban: 'ES7620770024003102571249', locker: 'L-016', medical_check: true, works_holidays: true,
    contract_type: 'ct-1', contract_start_date: '2023-10-01', contract_end_date: null, irpf: 16
  },
  {
    user_id: null, city_id: 'city-2', name: 'Roberto', last_name1: 'Gil', last_name2: 'Santos',
    email: 'r.gil@on3.com', phone: '612345694', category_id: 'ec-7', status_id: 'es-3', work_center_id: 'wc-6',
    active: false, shift: 's-3', schedule: '22:00-06:00', start_time: '22:00', end_time: '06:00',
    vacation_month: 'agosto', vacation_year: 2024, vacation_days: 22, own_days: 2, accumulated_days: 5, excess_days: 0,
    created_at: '2023-05-14T10:00:00Z', updated_at: '2024-04-05T10:00:00Z',
    personal_email: 'roberto.gil@gmail.com', phone_fixed: '918765448', work_day: 'wd-4',
    iban: 'ES7620770024003102571250', locker: 'L-017', medical_check: false, works_holidays: false,
    contract_type: 'ct-1', contract_start_date: '2021-03-01', contract_end_date: null, irpf: 19
  },
  {
    user_id: null, city_id: 'city-1', name: 'Sandra', last_name1: 'Núñez', last_name2: 'Herrera',
    email: 's.nunez@on3.com', phone: '612345695', category_id: 'ec-8', status_id: 'es-1', work_center_id: 'wc-8',
    active: true, shift: 's-1', schedule: '09:00-17:00', start_time: '09:00', end_time: '17:00',
    vacation_month: 'septiembre', vacation_year: 2024, vacation_days: 22, own_days: 2, accumulated_days: 5, excess_days: 0,
    created_at: '2022-11-20T08:00:00Z', updated_at: '2022-11-20T08:00:00Z',
    personal_email: 'sandra.nunez@gmail.com', phone_fixed: '918765449', work_day: 'wd-1',
    iban: 'ES7620770024003102571251', locker: 'L-018', medical_check: true, works_holidays: true,
    contract_type: 'ct-1', contract_start_date: '2020-08-01', contract_end_date: null, irpf: 21
  },
  {
    user_id: null, city_id: 'city-2', name: 'Alberto', last_name1: 'Castillo', last_name2: 'Jiménez',
    email: 'a.castillo@on3.com', phone: '612345696', category_id: 'ec-9', status_id: 'es-1', work_center_id: 'wc-1',
    active: true, shift: 's-2', schedule: '14:00-22:00', start_time: '14:00', end_time: '22:00',
    vacation_month: 'julio', vacation_year: 2024, vacation_days: 22, own_days: 2, accumulated_days: 5, excess_days: 0,
    created_at: '2023-03-08T09:00:00Z', updated_at: '2023-03-08T09:00:00Z',
    personal_email: 'alberto.castillo@gmail.com', phone_fixed: '918765450', work_day: 'wd-1',
    iban: 'ES7620770024003102571252', locker: 'L-019', medical_check: true, works_holidays: true,
    contract_type: 'ct-1', contract_start_date: '2018-06-01', contract_end_date: null, irpf: 24
  },
  {
    user_id: null, city_id: 'city-1', name: 'Natalia', last_name1: 'Domínguez', last_name2: 'Vargas',
    email: 'n.dominguez@on3.com', phone: '612345697', category_id: 'ec-10', status_id: 'es-4', work_center_id: 'wc-8',
    active: true, shift: 's-1', schedule: '09:00-17:00', start_time: '09:00', end_time: '17:00',
    vacation_month: 'agosto', vacation_year: 2024, vacation_days: 22, own_days: 2, accumulated_days: 5, excess_days: 0,
    created_at: '2024-02-28T08:00:00Z', updated_at: '2024-06-10T08:00:00Z',
    personal_email: 'natalia.dominguez@gmail.com', phone_fixed: '918765451', work_day: 'wd-2',
    iban: 'ES7620770024003102571253', locker: 'L-020', medical_check: true, works_holidays: false,
    contract_type: 'ct-1', contract_start_date: '2023-04-15', contract_end_date: null, irpf: 14
  }
];

const PADDED_IDS = [
  '000001', '000002', '000003', '000004', '000005',
  '000006', '000007', '000008', '000009', '000011',
  '000012', '000013', '000014', '000015', '000016',
  '000017', '000018', '000019', '000020', '000021'
];

export const INITIAL_EMPLOYEES: Employee[] = EMPLOYEES_SEED.map((emp, i) => ({
  ...emp,
  id: `emp_${PADDED_IDS[i]}`
}));
