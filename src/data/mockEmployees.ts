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
  { id: 'ct-1', name: 'Indefinido' },
  { id: 'ct-2', name: 'Temporal' },
  { id: 'ct-3', name: 'Obra' },
];

const VACATION_MONTHS: Array<'JULY' | 'AUGUST' | 'SEPTEMBER'> = ['JULY', 'AUGUST', 'SEPTEMBER'];

const EMPLOYEES_SEED: Omit<Employee, 'id'>[] = [
  {
    city_id: 'city-1', name: 'Miguel Ángel', lastName1: 'Torres', lastName2: 'García',
    email: '000001@on3.com', phone: '612345678', category_id: 'ec-1', status_id: 'es-1', work_center_id: 'wc-1',
    active: true, shift_id: 's_1', start_time: '08:00', end_time: '16:00',
    vacation_month: 'JULY', vacation_year: 2024, vacation_days: 22, own_days: 2, accumulated_days: 5, excess_days: 0,
    created_at: '2024-01-15T08:00:00Z', updated_at: '2024-01-15T08:00:00Z',
    personal_email: 'm.torres@gmail.com', phone_fixed: '918765432', work_day_id: 'wd_1',
    iban: 'ES7620770024003102571234', locker: 'L-001', medical_check: true, works_holidays: true,
    contract_type: 'ct-1', contract_start_date: '2023-06-01', contract_end_date: null, irpf: 15
  },
  {
    city_id: 'city-1', name: 'Alejandro', lastName1: 'Mendoza', lastName2: '',
    email: '000002@on3.com', phone: '612345679', category_id: 'ec-2', status_id: 'es-1', work_center_id: 'wc-2',
    active: true, shift_id: 's_2', start_time: '14:00', end_time: '22:00',
    vacation_month: 'AUGUST', vacation_year: 2024, vacation_days: 22, own_days: 2, accumulated_days: 5, excess_days: 0,
    created_at: '2024-02-10T09:00:00Z', updated_at: '2024-02-10T09:00:00Z',
    personal_email: 'maria.rodriguez@gmail.com', phone_fixed: '918765433', work_day_id: 'wd_1',
    iban: 'ES7620770024003102571235', locker: 'L-002', medical_check: true, works_holidays: false,
    contract_type: 'ct-1', contract_start_date: '2023-09-15', contract_end_date: null, irpf: 12
  },
  {
    city_id: 'city-1', name: 'Beatriz', lastName1: 'Salazar', lastName2: '',
    email: '000003@on3.com', phone: '612345680', category_id: 'ec-3', status_id: 'es-2', work_center_id: 'wc-3',
    active: true, shift_id: 's_1', start_time: '08:00', end_time: '16:00',
    vacation_month: 'SEPTEMBER', vacation_year: 2024, vacation_days: 22, own_days: 2, accumulated_days: 5, excess_days: 0,
    created_at: '2024-03-05T10:00:00Z', updated_at: '2024-03-05T10:00:00Z',
    personal_email: 'carlos.martinez@gmail.com', phone_fixed: '918765434', work_day_id: 'wd_2',
    iban: 'ES7620770024003102571236', locker: 'L-003', medical_check: true, works_holidays: true,
    contract_type: 'ct-1', contract_start_date: '2022-01-10', contract_end_date: null, irpf: 18
  },
  {
    city_id: 'city-1', name: 'Carlos', lastName1: 'Fuentes', lastName2: '',
    email: '000004@on3.com', phone: '612345681', category_id: 'ec-4', status_id: 'es-1', work_center_id: 'wc-4',
    active: true, shift_id: 's_3', start_time: '22:00', end_time: '06:00',
    vacation_month: 'JULY', vacation_year: 2024, vacation_days: 22, own_days: 2, accumulated_days: 5, excess_days: 0,
    created_at: '2024-01-20T11:00:00Z', updated_at: '2024-01-20T11:00:00Z',
    personal_email: 'ana.lopez@gmail.com', phone_fixed: '918765435', work_day_id: 'wd_3',
    iban: 'ES7620770024003102571237', locker: 'L-004', medical_check: true, works_holidays: true,
    contract_type: 'ct-2', contract_start_date: '2024-01-01', contract_end_date: '2025-01-01', irpf: 14
  },
  {
    city_id: 'city-2', name: 'Pedro', lastName1: 'Hernández', lastName2: 'Díaz',
    email: '000005@on3.com', phone: '612345682', category_id: 'ec-5', status_id: 'es-3', work_center_id: 'wc-5',
    active: false, shift_id: 's_1', start_time: '08:00', end_time: '16:00',
    vacation_month: 'AUGUST', vacation_year: 2024, vacation_days: 22, own_days: 2, accumulated_days: 5, excess_days: 0,
    created_at: '2023-11-08T08:00:00Z', updated_at: '2024-05-15T08:00:00Z',
    personal_email: 'pedro.hernandez@gmail.com', phone_fixed: '918765436', work_day_id: 'wd_1',
    iban: 'ES7620770024003102571238', locker: 'L-005', medical_check: false, works_holidays: false,
    contract_type: 'ct-1', contract_start_date: '2022-05-20', contract_end_date: null, irpf: 16
  },
  {
    city_id: 'city-1', name: 'Laura', lastName1: 'Jiménez', lastName2: 'Ruiz',
    email: '000006@on3.com', phone: '612345683', category_id: 'ec-6', status_id: 'es-1', work_center_id: 'wc-7',
    active: true, shift_id: 's_2', start_time: '14:00', end_time: '22:00',
    vacation_month: 'SEPTEMBER', vacation_year: 2024, vacation_days: 22, own_days: 2, accumulated_days: 5, excess_days: 0,
    created_at: '2023-08-12T09:00:00Z', updated_at: '2023-08-12T09:00:00Z',
    personal_email: 'laura.jimenez@gmail.com', phone_fixed: '918765437', work_day_id: 'wd_1',
    iban: 'ES7620770024003102571239', locker: 'L-006', medical_check: true, works_holidays: true,
    contract_type: 'ct-1', contract_start_date: '2023-03-01', contract_end_date: null, irpf: 17
  },
  {
    city_id: 'city-2', name: 'Miguel', lastName1: 'Torres', lastName2: 'Navarro',
    email: '000007@on3.com', phone: '612345684', category_id: 'ec-7', status_id: 'es-4', work_center_id: 'wc-6',
    active: true, shift_id: 's_1', start_time: '08:00', end_time: '16:00',
    vacation_month: 'JULY', vacation_year: 2024, vacation_days: 22, own_days: 2, accumulated_days: 5, excess_days: 0,
    created_at: '2023-04-18T10:00:00Z', updated_at: '2024-02-20T10:00:00Z',
    personal_email: 'miguel.torres@gmail.com', phone_fixed: '918765438', work_day_id: 'wd_4',
    iban: 'ES7620770024003102571240', locker: 'L-007', medical_check: true, works_holidays: true,
    contract_type: 'ct-1', contract_start_date: '2021-08-01', contract_end_date: null, irpf: 20
  },
  {
    city_id: 'city-1', name: 'Carmen', lastName1: 'Morales', lastName2: 'Serrano',
    email: '000008@on3.com', phone: '612345685', category_id: 'ec-8', status_id: 'es-1', work_center_id: 'wc-8',
    active: true, shift_id: 's_1', start_time: '09:00', end_time: '17:00',
    vacation_month: 'AUGUST', vacation_year: 2024, vacation_days: 22, own_days: 2, accumulated_days: 5, excess_days: 0,
    created_at: '2022-06-25T08:00:00Z', updated_at: '2022-06-25T08:00:00Z',
    personal_email: 'carmen.morales@gmail.com', phone_fixed: '918765439', work_day_id: 'wd_1',
    iban: 'ES7620770024003102571241', locker: 'L-008', medical_check: true, works_holidays: true,
    contract_type: 'ct-1', contract_start_date: '2020-01-15', contract_end_date: null, irpf: 22
  },
  {
    city_id: 'city-2', name: 'Javier', lastName1: 'Ramos', lastName2: 'Castro',
    email: '000009@on3.com', phone: '612345686', category_id: 'ec-9', status_id: 'es-5', work_center_id: 'wc-1',
    active: true, shift_id: 's_2', start_time: '14:00', end_time: '22:00',
    vacation_month: 'SEPTEMBER', vacation_year: 2024, vacation_days: 22, own_days: 2, accumulated_days: 5, excess_days: 0,
    created_at: '2023-09-30T09:00:00Z', updated_at: '2024-04-10T09:00:00Z',
    personal_email: 'javier.ramos@gmail.com', phone_fixed: '918765440', work_day_id: 'wd_2',
    iban: 'ES7620770024003102571242', locker: 'L-009', medical_check: true, works_holidays: false,
    contract_type: 'ct-1', contract_start_date: '2019-05-01', contract_end_date: null, irpf: 25
  },
  {
    city_id: 'city-1', name: 'Sofia', lastName1: 'Vega', lastName2: 'Ortega',
    email: '000011@on3.com', phone: '612345687', category_id: 'ec-10', status_id: 'es-1', work_center_id: 'wc-8',
    active: true, shift_id: 's_1', start_time: '09:00', end_time: '17:00',
    vacation_month: 'JULY', vacation_year: 2024, vacation_days: 22, own_days: 2, accumulated_days: 5, excess_days: 0,
    created_at: '2024-01-08T08:00:00Z', updated_at: '2024-01-08T08:00:00Z',
    personal_email: 'sofia.vega@gmail.com', phone_fixed: '918765441', work_day_id: 'wd_1',
    iban: 'ES7620770024003102571243', locker: 'L-010', medical_check: true, works_holidays: true,
    contract_type: 'ct-1', contract_start_date: '2023-11-01', contract_end_date: null, irpf: 15
  },
  {
    city_id: 'city-2', name: 'Antonio', lastName1: 'Molina', lastName2: 'Delgado',
    email: '000012@on3.com', phone: '612345688', category_id: 'ec-1', status_id: 'es-6', work_center_id: 'wc-2',
    active: true, shift_id: 's_3', start_time: '22:00', end_time: '06:00',
    vacation_month: 'AUGUST', vacation_year: 2024, vacation_days: 22, own_days: 2, accumulated_days: 5, excess_days: 0,
    created_at: '2024-02-22T10:00:00Z', updated_at: '2024-06-01T10:00:00Z',
    personal_email: 'antonio.molina@gmail.com', phone_fixed: '918765442', work_day_id: 'wd_3',
    iban: 'ES7620770024003102571244', locker: 'L-011', medical_check: true, works_holidays: true,
    contract_type: 'ct-3', contract_start_date: '2024-02-15', contract_end_date: '2024-12-31', irpf: 10
  },
  {
    city_id: 'city-1', name: 'Isabel', lastName1: 'Romero', lastName2: 'Aguilar',
    email: '000013@on3.com', phone: '612345689', category_id: 'ec-2', status_id: 'es-1', work_center_id: 'wc-3',
    active: true, shift_id: 's_1', start_time: '08:00', end_time: '16:00',
    vacation_month: 'SEPTEMBER', vacation_year: 2024, vacation_days: 22, own_days: 2, accumulated_days: 5, excess_days: 0,
    created_at: '2023-12-05T09:00:00Z', updated_at: '2023-12-05T09:00:00Z',
    personal_email: 'isabel.romero@gmail.com', phone_fixed: '918765443', work_day_id: 'wd_1',
    iban: 'ES7620770024003102571245', locker: 'L-012', medical_check: true, works_holidays: true,
    contract_type: 'ct-1', contract_start_date: '2023-06-01', contract_end_date: null, irpf: 13
  },
  {
    city_id: 'city-2', name: 'David', lastName1: 'Cortés', lastName2: 'Garrido',
    email: '000014@on3.com', phone: '612345690', category_id: 'ec-3', status_id: 'es-1', work_center_id: 'wc-4',
    active: true, shift_id: 's_2', start_time: '14:00', end_time: '22:00',
    vacation_month: 'JULY', vacation_year: 2024, vacation_days: 22, own_days: 2, accumulated_days: 5, excess_days: 0,
    created_at: '2024-03-18T08:00:00Z', updated_at: '2024-03-18T08:00:00Z',
    personal_email: 'david.cortes@gmail.com', phone_fixed: '918765444', work_day_id: 'wd_1',
    iban: 'ES7620770024003102571246', locker: 'L-013', medical_check: true, works_holidays: true,
    contract_type: 'ct-2', contract_start_date: '2024-03-01', contract_end_date: '2025-03-01', irpf: 14
  },
  {
    city_id: 'city-1', name: 'Elena', lastName1: 'Soto', lastName2: 'Pérez',
    email: '000015@on3.com', phone: '612345691', category_id: 'ec-4', status_id: 'es-2', work_center_id: 'wc-5',
    active: true, shift_id: 's_1', start_time: '08:00', end_time: '16:00',
    vacation_month: 'AUGUST', vacation_year: 2024, vacation_days: 22, own_days: 2, accumulated_days: 5, excess_days: 0,
    created_at: '2023-10-12T10:00:00Z', updated_at: '2024-05-20T10:00:00Z',
    personal_email: 'elena.soto@gmail.com', phone_fixed: '918765445', work_day_id: 'wd_2',
    iban: 'ES7620770024003102571247', locker: 'L-014', medical_check: true, works_holidays: false,
    contract_type: 'ct-1', contract_start_date: '2022-09-01', contract_end_date: null, irpf: 15
  },
  {
    city_id: 'city-2', name: 'Francisco', lastName1: 'Ruiz', lastName2: 'Guerrero',
    email: '000016@on3.com', phone: '612345692', category_id: 'ec-5', status_id: 'es-1', work_center_id: 'wc-7',
    active: true, shift_id: 's_2', start_time: '14:00', end_time: '22:00',
    vacation_month: 'SEPTEMBER', vacation_year: 2024, vacation_days: 22, own_days: 2, accumulated_days: 5, excess_days: 0,
    created_at: '2023-07-22T09:00:00Z', updated_at: '2023-07-22T09:00:00Z',
    personal_email: 'francisco.ruiz@gmail.com', phone_fixed: '918765446', work_day_id: 'wd_1',
    iban: 'ES7620770024003102571248', locker: 'L-015', medical_check: true, works_holidays: true,
    contract_type: 'ct-1', contract_start_date: '2022-02-15', contract_end_date: null, irpf: 17
  },
  {
    city_id: 'city-1', name: 'Patricia', lastName1: 'Flores', lastName2: 'Moreno',
    email: '000017@on3.com', phone: '612345693', category_id: 'ec-6', status_id: 'es-1', work_center_id: 'wc-7',
    active: true, shift_id: 's_1', start_time: '08:00', end_time: '16:00',
    vacation_month: 'JULY', vacation_year: 2024, vacation_days: 22, own_days: 2, accumulated_days: 5, excess_days: 0,
    created_at: '2024-01-30T08:00:00Z', updated_at: '2024-01-30T08:00:00Z',
    personal_email: 'patricia.flores@gmail.com', phone_fixed: '918765447', work_day_id: 'wd_1',
    iban: 'ES7620770024003102571249', locker: 'L-016', medical_check: true, works_holidays: true,
    contract_type: 'ct-1', contract_start_date: '2023-10-01', contract_end_date: null, irpf: 16
  },
  {
    city_id: 'city-2', name: 'Roberto', lastName1: 'Gil', lastName2: 'Santos',
    email: '000018@on3.com', phone: '612345694', category_id: 'ec-7', status_id: 'es-3', work_center_id: 'wc-6',
    active: false, shift_id: 's_3', start_time: '22:00', end_time: '06:00',
    vacation_month: 'AUGUST', vacation_year: 2024, vacation_days: 22, own_days: 2, accumulated_days: 5, excess_days: 0,
    created_at: '2023-05-14T10:00:00Z', updated_at: '2024-04-05T10:00:00Z',
    personal_email: 'roberto.gil@gmail.com', phone_fixed: '918765448', work_day_id: 'wd_4',
    iban: 'ES7620770024003102571250', locker: 'L-017', medical_check: false, works_holidays: false,
    contract_type: 'ct-1', contract_start_date: '2021-03-01', contract_end_date: null, irpf: 19
  },
  {
    city_id: 'city-1', name: 'Sandra', lastName1: 'Núñez', lastName2: 'Herrera',
    email: '000019@on3.com', phone: '612345695', category_id: 'ec-8', status_id: 'es-1', work_center_id: 'wc-8',
    active: true, shift_id: 's_1', start_time: '09:00', end_time: '17:00',
    vacation_month: 'SEPTEMBER', vacation_year: 2024, vacation_days: 22, own_days: 2, accumulated_days: 5, excess_days: 0,
    created_at: '2022-11-20T08:00:00Z', updated_at: '2022-11-20T08:00:00Z',
    personal_email: 'sandra.nunez@gmail.com', phone_fixed: '918765449', work_day_id: 'wd_1',
    iban: 'ES7620770024003102571251', locker: 'L-018', medical_check: true, works_holidays: true,
    contract_type: 'ct-1', contract_start_date: '2020-08-01', contract_end_date: null, irpf: 21
  },
  {
    city_id: 'city-2', name: 'Alberto', lastName1: 'Castillo', lastName2: 'Jiménez',
    email: '000020@on3.com', phone: '612345696', category_id: 'ec-9', status_id: 'es-1', work_center_id: 'wc-1',
    active: true, shift_id: 's_2', start_time: '14:00', end_time: '22:00',
    vacation_month: 'JULY', vacation_year: 2024, vacation_days: 22, own_days: 2, accumulated_days: 5, excess_days: 0,
    created_at: '2023-03-08T09:00:00Z', updated_at: '2023-03-08T09:00:00Z',
    personal_email: 'alberto.castillo@gmail.com', phone_fixed: '918765450', work_day_id: 'wd_1',
    iban: 'ES7620770024003102571252', locker: 'L-019', medical_check: true, works_holidays: true,
    contract_type: 'ct-1', contract_start_date: '2018-06-01', contract_end_date: null, irpf: 24
  },
  {
    city_id: 'city-1', name: 'Natalia', lastName1: 'Domínguez', lastName2: 'Vargas',
    email: '000021@on3.com', phone: '612345697', category_id: 'ec-10', status_id: 'es-4', work_center_id: 'wc-8',
    active: true, shift_id: 's_1', start_time: '09:00', end_time: '17:00',
    vacation_month: 'AUGUST', vacation_year: 2024, vacation_days: 22, own_days: 2, accumulated_days: 5, excess_days: 0,
    created_at: '2024-02-28T08:00:00Z', updated_at: '2024-06-10T08:00:00Z',
    personal_email: 'natalia.dominguez@gmail.com', phone_fixed: '918765451', work_day_id: 'wd_2',
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
